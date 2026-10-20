package mor.itas.application.usecase.tp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.tp.TpInformationRequestLogEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import mor.itas.persistence.jpa.repository.tp.TpInformationRequestLogRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Manages the full lifecycle of Information & Document Requests (IDRs).
 *
 * APPROVAL WORKFLOW:
 *   Auditor creates IDR (DRAFT)
 *   → Auditor submits for approval (AWAITING_APPROVAL)
 *   → Process Owner approves (APPROVED)
 *   → System marks as ISSUED (sent to taxpayer via e-Tax portal)
 *   → Taxpayer uploads evidence (RESPONSE_RECEIVED)
 *   → Auditor acknowledges (CLOSED)
 *   OR: Deadline passes without response → OVERDUE → escalation triggered
 *
 * The scheduled job (@Scheduled) is a critical gap-fill: the requirements say
 * "if taxpayer fails to raise objection within approved period → trigger fraud
 * investigation." This can ONLY be enforced automatically — a human cannot
 * reliably check deadlines daily across hundreds of cases.
 *
 * Statutory basis:
 * "enable auditor to obtain approval for request for information"
 * "enable taxpayer to submit additional information/evidence"
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TpInformationRequestUseCase {

    private final ApAuditCaseRepository auditCaseRepository;
    private final TpInformationRequestLogRepository idrRepository;
    private final TpAuditActionHistoryUseCase historyUseCase;

    /** Auditor creates a new IDR in DRAFT status. */
    @Transactional
    public UUID createInformationRequest(UUID caseId,
                                         String requestType,
                                         String subject,
                                         String description,
                                         LocalDate deadlineDate,
                                         String actorId) {
        getValidTpCase(caseId);
        String ref = generateRef(caseId);

        TpInformationRequestLogEntity idr = TpInformationRequestLogEntity.builder()
                .auditCaseId(caseId)
                .requestReference(ref)
                .requestType(requestType != null ? requestType : "DOCUMENT")
                .subject(subject)
                .description(description)
                .deadlineDate(deadlineDate)
                .status("DRAFT")
                .submittedBy(actorId)
                .build();

        idr = idrRepository.save(idr);

        historyUseCase.record(caseId, "IDR_CREATED", "FIELD_WORK",
                actorId, "AUDITOR",
                "IDR created: " + ref + " — " + subject,
                null, "DRAFT", idr.getId());

        return idr.getId();
    }

    /** Auditor submits IDR for process owner approval. */
    @Transactional
    public void submitForApproval(UUID idrId, String actorId) {
        TpInformationRequestLogEntity idr = getIdr(idrId);
        validateStatus(idr, "DRAFT");
        idr.setStatus("AWAITING_APPROVAL");
        idr.setSubmittedAt(OffsetDateTime.now());
        idrRepository.save(idr);

        historyUseCase.record(idr.getAuditCaseId(), "IDR_SUBMITTED_FOR_APPROVAL", "FIELD_WORK",
                actorId, "AUDITOR",
                "IDR " + idr.getRequestReference() + " submitted for process owner approval",
                "DRAFT", "AWAITING_APPROVAL", idrId);
    }

    /** Process Owner approves or rejects IDR. */
    @Transactional
    public void approveInformationRequest(UUID idrId, boolean approved, String comments, String actorId) {
        TpInformationRequestLogEntity idr = getIdr(idrId);
        validateStatus(idr, "AWAITING_APPROVAL");

        String newStatus = approved ? "APPROVED" : "DRAFT";
        idr.setStatus(newStatus);
        idr.setApprovedBy(actorId);
        idr.setApprovedAt(OffsetDateTime.now());
        idr.setApprovalComments(comments);
        idrRepository.save(idr);

        String action = approved ? "IDR_APPROVED" : "IDR_REJECTED_BACK_TO_DRAFT";
        historyUseCase.record(idr.getAuditCaseId(), action, "FIELD_WORK",
                actorId, "PROCESS_OWNER",
                "IDR " + idr.getRequestReference() + (approved ? " approved." : " rejected: ") + (comments != null ? comments : ""),
                "AWAITING_APPROVAL", newStatus, idrId);
    }

    /** Issues the IDR to the taxpayer (marks as ISSUED). */
    @Transactional
    public void issueToTaxpayer(UUID idrId, String actorId) {
        TpInformationRequestLogEntity idr = getIdr(idrId);
        validateStatus(idr, "APPROVED");
        idr.setStatus("ISSUED");
        idrRepository.save(idr);

        historyUseCase.record(idr.getAuditCaseId(), "IDR_ISSUED", "FIELD_WORK",
                actorId, "SYSTEM",
                "IDR " + idr.getRequestReference() + " issued to taxpayer via e-Tax portal. Deadline: " + idr.getDeadlineDate(),
                "APPROVED", "ISSUED", idrId);
    }

    /** Records taxpayer's submission of evidence in response to the IDR. */
    @Transactional
    public void recordTaxpayerResponse(UUID idrId, String response, String actorId) {
        TpInformationRequestLogEntity idr = getIdr(idrId);
        idr.setTaxpayerResponse(response);
        idr.setEvidenceUploaded(true);
        idr.setResponseReceivedAt(OffsetDateTime.now());
        idr.setStatus("RESPONSE_RECEIVED");
        idrRepository.save(idr);

        historyUseCase.record(idr.getAuditCaseId(), "IDR_RESPONSE_RECEIVED", "FIELD_WORK",
                actorId, "TAXPAYER",
                "Taxpayer submitted evidence for IDR " + idr.getRequestReference(),
                "ISSUED", "RESPONSE_RECEIVED", idrId);
    }

    /** Auditor acknowledges response and closes the IDR. */
    @Transactional
    public void closeRequest(UUID idrId, String actorId) {
        TpInformationRequestLogEntity idr = getIdr(idrId);
        idr.setStatus("CLOSED");
        idrRepository.save(idr);

        historyUseCase.record(idr.getAuditCaseId(), "IDR_CLOSED", "FIELD_WORK",
                actorId, "AUDITOR",
                "IDR " + idr.getRequestReference() + " closed — evidence acknowledged.",
                "RESPONSE_RECEIVED", "CLOSED", idrId);
    }

    /**
     * SCHEDULED JOB — Runs daily at 01:00 AM.
     * Finds all ISSUED IDRs whose deadline has passed and flags them as OVERDUE.
     * This is the system's automatic enforcement of the taxpayer response deadline.
     * Statutory basis: "if taxpayer fails to raise objection within approved period
     * of time → tax intelligence and fraud investigation process will be triggered"
     */
    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void monitorOverdueRequests() {
        List<TpInformationRequestLogEntity> overdue = idrRepository.findOverdueRequests(LocalDate.now());
        for (TpInformationRequestLogEntity idr : overdue) {
            idr.setIsOverdue(true);
            idr.setOverdueFlaggedAt(OffsetDateTime.now());
            idr.setStatus("OVERDUE");
            idrRepository.save(idr);

            historyUseCase.record(idr.getAuditCaseId(), "IDR_OVERDUE_FLAGGED", "FIELD_WORK",
                    "SYSTEM", "SYSTEM",
                    "⚠ IDR " + idr.getRequestReference() + " is OVERDUE (deadline: " + idr.getDeadlineDate() + "). Escalation required.",
                    "ISSUED", "OVERDUE", idr.getId());

            log.warn("IDR OVERDUE: {} case={}", idr.getRequestReference(), idr.getAuditCaseId());
        }
        if (!overdue.isEmpty()) {
            log.warn("Overdue IDR check complete: {} IDRs flagged.", overdue.size());
        }
    }

    public List<TpInformationRequestLogEntity> getRequestsForCase(UUID caseId) {
        return idrRepository.findByAuditCaseIdOrderByCreatedAtDesc(caseId);
    }

    public List<TpInformationRequestLogEntity> getPendingApprovalRequests(UUID caseId) {
        return idrRepository.findByAuditCaseIdAndStatus(caseId, "AWAITING_APPROVAL");
    }

    // --- Private helpers ---

    private String generateRef(UUID caseId) {
        long count = idrRepository.count();
        return String.format("IDR-TP-%d-%04d", java.time.Year.now().getValue(), count + 1);
    }

    private TpInformationRequestLogEntity getIdr(UUID idrId) {
        return idrRepository.findById(idrId)
                .orElseThrow(() -> new IllegalArgumentException("IDR not found: " + idrId));
    }

    private void validateStatus(TpInformationRequestLogEntity idr, String expected) {
        if (!expected.equals(idr.getStatus())) {
            throw new IllegalStateException(
                    "IDR " + idr.getRequestReference() + " is in status " + idr.getStatus() +
                    ", expected " + expected);
        }
    }

    private ApAuditCaseEntity getValidTpCase(UUID caseId) {
        return auditCaseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));
    }
}
