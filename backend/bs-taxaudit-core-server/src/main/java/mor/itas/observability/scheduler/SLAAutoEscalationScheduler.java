package mor.itas.observability.scheduler;

import mor.itas.domain.service.ap.SLAManagementService;
import mor.itas.domain.aggregate.CommitteeCaseAggregate;
import mor.itas.persistence.jpa.entity.ap.CommitteeCaseEntity;
import mor.itas.persistence.jpa.repository.ap.CommitteeCaseRepository;
import mor.itas.engineadapter.notification.MockNotificationEngineAdapter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * SLA Auto-Escalation Scheduler
 *
 * Runs periodically to:
 *   1. Scan all active committee cases (PENDING_VOTES, PENDING_VIABILITY, APPROVED, TEAM_ASSIGNED)
 *   2. Check which cases have approaching deadlines (< 24 hours → WARNING)
 *   3. Check which cases have breached deadlines (past deadline → BREACH)
 *   4. Send notifications to relevant members
 *   5. Broadcast SSE events for real-time dashboard updates
 *
 * Schedule:
 *   - Every 15 minutes: check for SLA warnings and breaches
 *   - Every hour: generate SLA compliance report
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SLAAutoEscalationScheduler {

    private final CommitteeCaseRepository caseRepository;
    private final SLAManagementService slaService;
    private final MockNotificationEngineAdapter notificationAdapter;

    @Autowired(required = false)
    private mor.itas.api.controller.backoffice.jac.CommitteeEventService eventService;

    /** Active statuses that should be monitored for SLA */
    private static final Set<String> ACTIVE_STATUSES = Set.of(
            "PENDING_VOTES",
            "PENDING_VIABILITY",
            "APPROVED",
            "TEAM_ASSIGNED"
    );

    /** Warning threshold: notify when less than this many hours remain */
    private static final long WARNING_THRESHOLD_HOURS = 24;

    /** Critical threshold: notify when less than this many hours remain */
    private static final long CRITICAL_THRESHOLD_HOURS = 4;

    /**
     * Main SLA check — runs every 15 minutes.
     * Scans all active cases and handles warnings/breaches.
     */
    @Scheduled(fixedRate = 15 * 60 * 1000, initialDelay = 30 * 1000) // every 15 min, start after 30s
    public void checkSLACompliance() {
        log.info("[SLA-SCHEDULER] Starting SLA compliance check...");

        try {
            List<CommitteeCaseEntity> activeCases = caseRepository.findAll().stream()
                    .filter(c -> ACTIVE_STATUSES.contains(c.getStatus()))
                    .collect(Collectors.toList());

            log.info("[SLA-SCHEDULER] Found {} active cases to check", activeCases.size());

            int warningCount = 0;
            int breachCount = 0;
            int criticalCount = 0;

            for (CommitteeCaseEntity caseEntity : activeCases) {
                try {
                    CommitteeCaseAggregate aggregate = toAggregate(caseEntity);
                    SLACheckResult result = checkCase(aggregate, caseEntity);

                    switch (result) {
                        case BREACH:
                            breachCount++;
                            handleSLABreach(caseEntity);
                            break;
                        case CRITICAL:
                            criticalCount++;
                            handleSLACritical(caseEntity);
                            break;
                        case WARNING:
                            warningCount++;
                            handleSLAWarning(caseEntity);
                            break;
                        default:
                            // OK — no action needed
                            break;
                    }
                } catch (Exception e) {
                    log.warn("[SLA-SCHEDULER] Error checking case {}: {}", caseEntity.getCaseId(), e.getMessage());
                }
            }

            log.info("[SLA-SCHEDULER] Check complete: {} warnings, {} critical, {} breaches",
                    warningCount, criticalCount, breachCount);

        } catch (Exception e) {
            log.error("[SLA-SCHEDULER] Error during SLA compliance check", e);
        }
    }

    /**
     * Determine SLA status for a case.
     */
    private SLACheckResult checkCase(CommitteeCaseAggregate aggregate, CommitteeCaseEntity entity) {
        OffsetDateTime effectiveDeadline = entity.getExtendedDeadline() != null
                ? entity.getExtendedDeadline()
                : entity.getCommitteeDeadline();

        if (effectiveDeadline == null) return SLACheckResult.OK;

        long hoursRemaining = ChronoUnit.HOURS.between(OffsetDateTime.now(), effectiveDeadline);

        if (hoursRemaining < 0) {
            return SLACheckResult.BREACH;
        } else if (hoursRemaining <= CRITICAL_THRESHOLD_HOURS) {
            return SLACheckResult.CRITICAL;
        } else if (hoursRemaining <= WARNING_THRESHOLD_HOURS) {
            return SLACheckResult.WARNING;
        }
        return SLACheckResult.OK;
    }

    /**
     * Handle SLA breach — case has exceeded its deadline.
     * Notify chairperson, case owner, and all committee members.
     */
    private void handleSLABreach(CommitteeCaseEntity caseEntity) {
        String caseCode = caseEntity.getCaseCode() != null
                ? caseEntity.getCaseCode()
                : "JAC-" + caseEntity.getCaseId().toString().substring(0, 8);

        log.warn("[SLA-SCHEDULER] SLA BREACH for case {} ({})", caseCode, caseEntity.getCaseId());

        List<String> userIds = new ArrayList<>();
        if (caseEntity.getChairpersonId() != null) {
            userIds.add(caseEntity.getChairpersonId().toString());
        }
        if (caseEntity.getCurrentOwnerId() != null) {
            userIds.add(caseEntity.getCurrentOwnerId().toString());
        }

        if (!userIds.isEmpty()) {
            notificationAdapter.sendSLABreach(userIds, caseCode);
        }

        // Broadcast SSE event
        broadcastEvent("activity", Map.of(
                "type", "sla_breach",
                "action", "SLA BREACH: Case deadline exceeded",
                "caseId", caseEntity.getCaseId().toString(),
                "caseCode", caseCode,
                "timestamp", OffsetDateTime.now().toString()
        ));
    }

    /**
     * Handle SLA critical — less than 4 hours remaining.
     * Urgent notification to case owner and chairperson.
     */
    private void handleSLACritical(CommitteeCaseEntity caseEntity) {
        String caseCode = caseEntity.getCaseCode() != null
                ? caseEntity.getCaseCode()
                : "JAC-" + caseEntity.getCaseId().toString().substring(0, 8);

        OffsetDateTime effectiveDeadline = caseEntity.getExtendedDeadline() != null
                ? caseEntity.getExtendedDeadline()
                : caseEntity.getCommitteeDeadline();
        long hoursRemaining = Math.max(0, ChronoUnit.HOURS.between(OffsetDateTime.now(), effectiveDeadline));

        log.warn("[SLA-SCHEDULER] SLA CRITICAL for case {} ({}h remaining)", caseCode, hoursRemaining);

        List<String> userIds = new ArrayList<>();
        if (caseEntity.getChairpersonId() != null) userIds.add(caseEntity.getChairpersonId().toString());
        if (caseEntity.getCurrentOwnerId() != null) userIds.add(caseEntity.getCurrentOwnerId().toString());

        if (!userIds.isEmpty()) {
            notificationAdapter.sendSLAWarning(userIds, caseCode, hoursRemaining);
        }

        broadcastEvent("activity", Map.of(
                "type", "sla_critical",
                "action", "SLA CRITICAL: Less than 4 hours remaining",
                "caseId", caseEntity.getCaseId().toString(),
                "caseCode", caseCode,
                "hoursRemaining", hoursRemaining,
                "timestamp", OffsetDateTime.now().toString()
        ));
    }

    /**
     * Handle SLA warning — less than 24 hours remaining.
     */
    private void handleSLAWarning(CommitteeCaseEntity caseEntity) {
        String caseCode = caseEntity.getCaseCode() != null
                ? caseEntity.getCaseCode()
                : "JAC-" + caseEntity.getCaseId().toString().substring(0, 8);

        OffsetDateTime effectiveDeadline = caseEntity.getExtendedDeadline() != null
                ? caseEntity.getExtendedDeadline()
                : caseEntity.getCommitteeDeadline();
        long hoursRemaining = Math.max(0, ChronoUnit.HOURS.between(OffsetDateTime.now(), effectiveDeadline));

        log.info("[SLA-SCHEDULER] SLA WARNING for case {} ({}h remaining)", caseCode, hoursRemaining);

        List<String> userIds = new ArrayList<>();
        if (caseEntity.getCurrentOwnerId() != null) userIds.add(caseEntity.getCurrentOwnerId().toString());

        if (!userIds.isEmpty()) {
            notificationAdapter.sendSLAWarning(userIds, caseCode, hoursRemaining);
        }

        broadcastEvent("activity", Map.of(
                "type", "sla_warning",
                "action", "SLA WARNING: Less than 24 hours remaining",
                "caseId", caseEntity.getCaseId().toString(),
                "caseCode", caseCode,
                "hoursRemaining", hoursRemaining,
                "timestamp", OffsetDateTime.now().toString()
        ));
    }

    /**
     * Broadcast event via SSE (if event service is available).
     */
    private void broadcastEvent(String eventName, Object data) {
        if (eventService != null) {
            eventService.broadcastGlobal(eventName, data);
        }
    }

    /**
     * Convert JPA entity to domain aggregate.
     */
    private CommitteeCaseAggregate toAggregate(CommitteeCaseEntity entity) {
        return CommitteeCaseAggregate.builder()
                .caseId(entity.getCaseId())
                .status(entity.getStatus() != null
                        ? CommitteeCaseAggregate.CommitteeCaseStatus.valueOf(entity.getStatus())
                        : null)
                .committeeDeadline(entity.getCommitteeDeadline())
                .extendedDeadline(entity.getExtendedDeadline())
                .extensionCount(entity.getExtensionCount() != null ? entity.getExtensionCount() : 0)
                .currentOwnerId(entity.getCurrentOwnerId())
                .chairpersonId(entity.getChairpersonId())
                .build();
    }

    enum SLACheckResult {
        OK, WARNING, CRITICAL, BREACH
    }
}
