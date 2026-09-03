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

    @Transactional
    public void executeStep(UUID caseId, IssueAuditExecutionRequest req, String actorId) {
        log.info("Executing Issue Audit step {} for caseId: {}", req.getAction(), caseId);
        
        ApAuditCaseEntity auditCase = auditCaseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));
        
        IssueAuditDetailEntity detail = issueAuditDetailRepository.findByAuditCaseId(caseId)
                .orElseGet(() -> IssueAuditDetailEntity.builder()
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
            log.error("JSON serialization error", e);
        }

        if (req.getReportTitle() != null) detail.setReportTitle(req.getReportTitle());
        if (req.getReportSummary() != null) detail.setReportSummary(req.getReportSummary());
        if (req.getTotalAdjustedAmount() != null) detail.setTotalAdjustedAmount(req.getTotalAdjustedAmount());

        if ("SUBMIT_TO_TL".equals(req.getAction())) {
            detail.setReportStatus("SUBMITTED_TO_TL");
            detail.setCurrentPhase("TEAM_LEADER_REVIEW");
        } else if ("REVIEW_TL".equals(req.getAction())) {
            detail.setTeamLeaderComments(req.getComments());
            if ("APPROVED".equals(req.getDecision())) {
                detail.setReportStatus("TL_APPROVED");
                detail.setCurrentPhase("PROCESS_OWNER_REVIEW");
            } else {
                detail.setReportStatus("REJECTED_BY_TL");
                detail.setCurrentPhase("REPORT_DRAFT");
            }
        } else if ("REVIEW_PO".equals(req.getAction())) {
            detail.setProcessOwnerComments(req.getComments());
            if ("APPROVED".equals(req.getDecision())) {
                detail.setReportStatus("PO_APPROVED");
                detail.setCurrentPhase("DIRECTOR_REVIEW");
            } else {
                detail.setReportStatus("REJECTED_BY_PO");
                detail.setCurrentPhase("REPORT_DRAFT");
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
                auditCase.setStatus("REFERRED");
            } else if ("COMPREHENSIVE_AUDIT_REFERRAL".equals(req.getDecision())) {
                detail.setReportStatus("REFERRED_TO_COMPREHENSIVE");
                detail.setReferralReferenceNumber("CMP-REF-" + System.currentTimeMillis());
                auditCase.setStatus("REFERRED");
            }
        }

        issueAuditDetailRepository.save(detail);
        auditCaseRepository.save(auditCase);
    }
}
