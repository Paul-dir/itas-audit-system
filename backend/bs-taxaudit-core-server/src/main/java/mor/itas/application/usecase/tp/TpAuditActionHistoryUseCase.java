package mor.itas.application.usecase.tp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.persistence.jpa.entity.tp.TpAuditActionHistoryEntity;
import mor.itas.persistence.jpa.repository.tp.TpAuditActionHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Centralized, append-only audit action history recorder.
 *
 * CRITICAL DESIGN DECISION:
 * This service runs in REQUIRES_NEW propagation — meaning every call creates
 * its own transaction that commits IMMEDIATELY, independent of the caller's
 * transaction. This ensures that history records are NEVER lost even if the
 * main business transaction rolls back. The action history must be preserved
 * even on failure for forensic/audit purposes.
 *
 * Statutory basis:
 * "maintain history of audit actions undertaken for the taxpayer along with
 * details: date, assigned auditor, status, outcome"
 * "maintain a record of all changes to taxpayer records and all necessary
 * documentation for audit purposes"
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TpAuditActionHistoryUseCase {

    private final TpAuditActionHistoryRepository historyRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(UUID caseId,
                       String actionType,
                       String actionPhase,
                       String actorId,
                       String actorRole,
                       String summary,
                       String beforeStatus,
                       String afterStatus,
                       UUID referenceId) {
        TpAuditActionHistoryEntity entry = TpAuditActionHistoryEntity.builder()
                .auditCaseId(caseId)
                .actionType(actionType)
                .actionPhase(actionPhase)
                .actorId(actorId)
                .actorRole(actorRole)
                .summary(summary)
                .beforeStatus(beforeStatus)
                .afterStatus(afterStatus)
                .referenceId(referenceId)
                .actionTimestamp(OffsetDateTime.now())
                .build();
        historyRepository.save(entry);
        log.info("AUDIT_TRAIL [{}] case={} actor={} action={}", actionPhase, caseId, actorId, actionType);
    }

    @Transactional(readOnly = true)
    public List<TpAuditActionHistoryEntity> getFullHistory(UUID caseId) {
        return historyRepository.findByAuditCaseIdOrderByActionTimestampAsc(caseId);
    }

    @Transactional(readOnly = true)
    public List<TpAuditActionHistoryEntity> getPhaseHistory(UUID caseId, String phase) {
        return historyRepository.findByAuditCaseIdAndActionPhaseOrderByActionTimestampAsc(caseId, phase);
    }
}
