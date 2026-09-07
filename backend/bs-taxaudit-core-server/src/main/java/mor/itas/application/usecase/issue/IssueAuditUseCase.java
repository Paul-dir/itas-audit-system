package mor.itas.application.usecase.issue;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.api.dto.request.issue.IssueAuditExecutionRequest;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.issue.IssueAuditDetailEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import mor.itas.persistence.jpa.repository.issue.IssueAuditDetailRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class IssueAuditUseCase {

    private final ApAuditCaseRepository auditCaseRepository;
    private final IssueAuditDetailRepository issueAuditDetailRepository;
    private final ObjectMapper objectMapper;

    /**
     * Resolves an audit case by UUID or human-readable case number.
     */
    public ApAuditCaseEntity resolveCase(String caseIdOrNumber) {
        try {
            UUID uuid = UUID.fromString(caseIdOrNumber);
            return auditCaseRepository.findById(uuid)
                    .orElseGet(() -> auditCaseRepository.findByCaseNumber(caseIdOrNumber)
                            .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseIdOrNumber)));
        } catch (IllegalArgumentException e) {
            return auditCaseRepository.findByCaseNumber(caseIdOrNumber)
                    .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseIdOrNumber));
        }
    }

    @Transactional(readOnly = true)
    public IssueAuditDetailEntity getDetail(String caseIdOrNumber) {
        ApAuditCaseEntity auditCase = resolveCase(caseIdOrNumber);
        return issueAuditDetailRepository.findByAuditCaseId(auditCase.getId())
                .orElseGet(() -> IssueAuditDetailEntity.builder()
                        .id(UUID.randomUUID())
                        .auditCase(auditCase)
                        .currentPhase("NOTIFICATION")
                        .reportVersion(1)
                        .reportStatus("DRAFT")
                        .identifiedIssue("VAT Withholding & Overhead Disallowance Discrepancy")
                        .totalAdjustedAmount(14850000.0)
                        .build());
    }

    @Transactional
    public void executeStep(String caseIdOrNumber, IssueAuditExecutionRequest req, String actorId) {
        log.info("Executing Issue Audit step {} for case: {} by actor: {}", req.getAction(), caseIdOrNumber, actorId);
        
        ApAuditCaseEntity auditCase = resolveCase(caseIdOrNumber);
        
        IssueAuditDetailEntity detail = issueAuditDetailRepository.findByAuditCaseId(auditCase.getId())
                .orElseGet(() -> IssueAuditDetailEntity.builder()
                        .id(UUID.randomUUID())
                        .auditCase(auditCase)
                        .currentPhase("NOTIFICATION")
                        .reportVersion(1)
                        .reportStatus("DRAFT")
                        .build());

        if (req.getIdentifiedIssue() != null) detail.setIdentifiedIssue(req.getIdentifiedIssue());
        if (req.getNotificationRequired() != null) detail.setNotificationRequired(req.getNotificationRequired());
        if (req.getNotificationSent() != null) detail.setNotificationSent(req.getNotificationSent());
        if (req.getNotificationRecipientChannel() != null) detail.setNotificationRecipientChannel(req.getNotificationRecipientChannel());

        try {
            if (req.getSelectedTransactions() != null) {
                detail.setSelectionDataJson(objectMapper.writeValueAsString(req.getSelectedTransactions()));
            }
            if (req.getEvidenceRecords() != null) {
                detail.setEvidenceDataJson(objectMapper.writeValueAsString(req.getEvidenceRecords()));
            }
            if (req.getFieldVisitFindings() != null) {
                detail.setFieldVisitFindingsJson(objectMapper.writeValueAsString(req.getFieldVisitFindings()));
            }
        } catch (Exception e) {
            log.error("JSON serialization error for issue audit data", e);
        }

        if (req.getReportTitle() != null) detail.setReportTitle(req.getReportTitle());
        if (req.getReportSummary() != null) detail.setReportSummary(req.getReportSummary());
        if (req.getTotalAdjustedAmount() != null) detail.setTotalAdjustedAmount(req.getTotalAdjustedAmount());

        // Sequential Workflow Transitions for Issue Audit
        if ("SUBMIT_TO_TL".equals(req.getAction())) {
            detail.setReportStatus("SUBMITTED_TO_TL");
            detail.setCurrentPhase("TEAM_LEADER_REVIEW");
            auditCase.setStatus("SUBMITTED_FOR_TL_REVIEW");
        } else if ("REVIEW_TL".equals(req.getAction())) {
            detail.setTeamLeaderComments(req.getComments());
            if ("APPROVED".equals(req.getDecision())) {
                detail.setReportStatus("TL_APPROVED");
                detail.setCurrentPhase("DIRECTOR_REVIEW");
                auditCase.setStatus("SUBMITTED_TO_TC_DIRECTOR");
            } else {
                detail.setReportStatus("REJECTED_BY_TL");
                detail.setCurrentPhase("REPORT_DRAFT");
                auditCase.setStatus("REVISION_REQUESTED");
            }
        } else if ("REVIEW_PO".equals(req.getAction())) {
            detail.setProcessOwnerComments(req.getComments());
            if ("APPROVED".equals(req.getDecision())) {
                detail.setReportStatus("PO_APPROVED");
                detail.setCurrentPhase("DIRECTOR_REVIEW");
                auditCase.setStatus("SUBMITTED_TO_TC_DIRECTOR");
            } else {
                detail.setReportStatus("REJECTED_BY_PO");
                detail.setCurrentPhase("REPORT_DRAFT");
                auditCase.setStatus("REVISION_REQUESTED");
            }
        } else if ("DECISION_DIRECTOR".equals(req.getAction())) {
            detail.setDirectorComments(req.getComments());
            detail.setFollowUpDecision(req.getDecision());
            detail.setDecisionDate(OffsetDateTime.now());
            detail.setCurrentPhase("FOLLOW_UP");
            
            if ("REPORT_FINALIZED".equals(req.getDecision())) {
                detail.setReportStatus("FINALIZED");
                auditCase.setStatus("COMPLETED");
            } else if ("FRAUD_REFERRAL".equals(req.getDecision())) {
                detail.setReportStatus("REFERRED_TO_FRAUD");
                detail.setReferralReferenceNumber("FRD-REF-" + System.currentTimeMillis());
                auditCase.setStatus("REFERRED_TO_FRAUD");
            } else if ("COMPREHENSIVE_AUDIT_REFERRAL".equals(req.getDecision())) {
                detail.setReportStatus("REFERRED_TO_COMPREHENSIVE");
                detail.setReferralReferenceNumber("CMP-REF-" + System.currentTimeMillis());
                auditCase.setStatus("REFERRED_TO_COMPREHENSIVE");
            } else if ("RETURNED_FOR_REVISION".equals(req.getDecision())) {
                detail.setReportStatus("REJECTED_BY_DIRECTOR");
                detail.setCurrentPhase("REPORT_DRAFT");
                auditCase.setStatus("REVISION_REQUESTED");
            }
        }

        issueAuditDetailRepository.save(detail);
        auditCaseRepository.save(auditCase);
        log.info("Successfully updated Issue Audit for case: {}, status: {}", caseIdOrNumber, auditCase.getStatus());
    }
}
