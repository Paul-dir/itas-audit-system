package mor.itas.observability.scheduler;

import mor.itas.persistence.jpa.entity.ap.HandoffRecordEntity;
import mor.itas.persistence.jpa.entity.ap.CommitteeCaseEntity;
import mor.itas.persistence.jpa.repository.ap.HandoffRecordRepository;
import mor.itas.persistence.jpa.repository.ap.CommitteeCaseRepository;
import mor.itas.engineadapter.notification.MockNotificationEngineAdapter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Handoff Notification Scheduler
 *
 * Polls for newly created handoff records that haven't been acknowledged yet
 * and sends notifications to the assigned team leaders.
 *
 * Lifecycle:
 *   1. Chairperson transfers case → HandoffRecord created (delivery_status = PENDING)
 *   2. Scheduler picks up PENDING handoffs → Notifies team leader
 *   3. Team leader acknowledges → delivery_status = DELIVERED
 *   4. If not acknowledged within 1 hour → re-notify (max 3 retries)
 *
 * Schedule:
 *   - Every 5 minutes: check for new/unacknowledged handoffs
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class HandoffNotificationScheduler {

    private final HandoffRecordRepository handoffRecordRepository;
    private final CommitteeCaseRepository caseRepository;
    private final MockNotificationEngineAdapter notificationAdapter;

    /** Track which handoffs have been notified (handoffId → notify count) */
    private final Map<UUID, Integer> notifiedHandoffs = new ConcurrentHashMap<>();

    private static final int MAX_RETRY_NOTIFICATIONS = 3;
    private static final long RETRY_INTERVAL_MINUTES = 60; // re-notify every hour if not acknowledged

    /**
     * Check for pending handoffs and notify team leaders.
     * Runs every 5 minutes.
     */
    @Scheduled(fixedRate = 5 * 60 * 1000, initialDelay = 60 * 1000) // every 5 min, start after 1 min
    public void pollPendingHandoffs() {
        log.debug("[HANDOFF-SCHEDULER] Polling for pending handoffs...");

        try {
            List<HandoffRecordEntity> allHandoffs = handoffRecordRepository.findAll();

            // deliveredAt is null when not yet delivered (pending)
            List<HandoffRecordEntity> pendingHandoffs = allHandoffs.stream()
                    .filter(h -> h.getDeliveredAt() == null)
                    .collect(java.util.stream.Collectors.toList());

            log.debug("[HANDOFF-SCHEDULER] Found {} pending handoffs", pendingHandoffs.size());

            for (HandoffRecordEntity handoff : pendingHandoffs) {
                try {
                    processHandoff(handoff);
                } catch (Exception e) {
                    log.warn("[HANDOFF-SCHEDULER] Error processing handoff {}: {}",
                            handoff.getHandoffId(), e.getMessage());
                }
            }

        } catch (Exception e) {
            log.error("[HANDOFF-SCHEDULER] Error during handoff polling", e);
        }
    }

    /**
     * Process a single handoff record.
     */
    private void processHandoff(HandoffRecordEntity handoff) {
        UUID handoffId = handoff.getHandoffId();
        UUID teamLeadId = handoff.getTeamLeadId();

        if (teamLeadId == null) {
            log.warn("[HANDOFF-SCHEDULER] Handoff {} has no team lead assigned", handoffId);
            return;
        }

        int notifyCount = notifiedHandoffs.getOrDefault(handoffId, 0);

        if (notifyCount == 0) {
            // First notification — send immediately
            sendHandoffNotification(handoff, teamLeadId);
            notifiedHandoffs.put(handoffId, 1);
        } else if (notifyCount < MAX_RETRY_NOTIFICATIONS) {
            // Re-notify if not acknowledged
            log.info("[HANDOFF-SCHEDULER] Re-notifying team leader for handoff {} (attempt {})",
                    handoffId, notifyCount + 1);
            sendHandoffNotification(handoff, teamLeadId);
            notifiedHandoffs.put(handoffId, notifyCount + 1);
        } else {
            log.warn("[HANDOFF-SCHEDULER] Max notifications reached for handoff {}. " +
                    "Team leader has not acknowledged.", handoffId);
        }
    }

    /**
     * Send notification to team leader about a new handoff.
     */
    private void sendHandoffNotification(HandoffRecordEntity handoff, UUID teamLeadId) {
        String caseCode = handoff.getCaseCode() != null ? handoff.getCaseCode() : "Unknown";

        // Get case details for richer notification
        String chairpersonName = "Chairperson";
        if (handoff.getCommitteeCaseEntity() != null) {
            CommitteeCaseEntity caseEntity = handoff.getCommitteeCaseEntity();
            if (caseEntity.getChairpersonId() != null) {
                chairpersonName = "Chairperson (" + caseEntity.getChairpersonId().toString().substring(0, 8) + ")";
            }
        }

        notificationAdapter.sendHandoffNotification(
                teamLeadId.toString(),
                caseCode,
                chairpersonName
        );

        log.info("[HANDOFF-SCHEDULER] Handoff notification sent: handoffId={}, teamLeadId={}, caseCode={}",
                handoff.getHandoffId(), teamLeadId, caseCode);
    }

    /**
     * Mark a handoff as acknowledged (called when team leader views/accepts the handoff).
     */
    public void acknowledgeHandoff(UUID handoffId) {
        notifiedHandoffs.remove(handoffId);
        log.info("[HANDOFF-SCHEDULER] Handoff {} acknowledged", handoffId);
    }

    /**
     * Get notification status for a handoff.
     */
    public Map<UUID, Integer> getNotificationStatus() {
        return Collections.unmodifiableMap(notifiedHandoffs);
    }
}
