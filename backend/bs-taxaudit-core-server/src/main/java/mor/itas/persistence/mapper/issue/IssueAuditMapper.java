package mor.itas.persistence.mapper.issue;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import mor.itas.domain.model.issue.IssueAuditCase;
import mor.itas.domain.valueobject.issue.FollowUpDecisionType;
import mor.itas.domain.valueobject.issue.IssueAuditPhase;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.issue.IssueAuditDetailEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class IssueAuditMapper {

    private final ObjectMapper objectMapper;

    public IssueAuditCase toDomain(ApAuditCaseEntity caseEntity, IssueAuditDetailEntity detailEntity) {
        if (caseEntity == null) return null;

        IssueAuditCase.IssueAuditCaseBuilder builder = IssueAuditCase.builder()
                .caseId(caseEntity.getId())
                .caseNumber(caseEntity.getCaseNumber())
                .taxpayerId(caseEntity.getTaxpayerId())
                .taxpayerName(caseEntity.getTaxpayerName())
                .tin(caseEntity.getTaxpayerId())
                .sector(caseEntity.getSector())
                .assignedAuditorId(caseEntity.getAssignedAuditorId())
                .teamLeaderId(caseEntity.getAssignedTeamLeaderId());

        if (detailEntity != null) {
            builder.currentPhase(detailEntity.getCurrentPhase() != null ? IssueAuditPhase.valueOf(detailEntity.getCurrentPhase()) : IssueAuditPhase.NOTIFICATION)
                    .notificationRequired(detailEntity.getNotificationRequired())
                    .notificationSent(detailEntity.getNotificationSent())
                    .notificationRecipientChannel(detailEntity.getNotificationRecipientChannel())
                    .identifiedIssue(detailEntity.getIdentifiedIssue())
                    .selectionRationale(detailEntity.getSelectionRationale())
                    .fieldVisitRequired(detailEntity.getFieldVisitRequired())
                    .reportVersion(detailEntity.getReportVersion())
                    .reportStatus(detailEntity.getReportStatus())
                    .reportTitle(detailEntity.getReportTitle())
                    .reportSummary(detailEntity.getReportSummary())
                    .totalAdjustedAmount(detailEntity.getTotalAdjustedAmount())
                    .teamLeaderComments(detailEntity.getTeamLeaderComments())
                    .processOwnerComments(detailEntity.getProcessOwnerComments())
                    .directorComments(detailEntity.getDirectorComments())
                    .followUpDecision(detailEntity.getFollowUpDecision() != null ? FollowUpDecisionType.valueOf(detailEntity.getFollowUpDecision()) : null)
                    .referralReferenceNumber(detailEntity.getReferralReferenceNumber());

            try {
                if (detailEntity.getSelectionDataJson() != null) {
                    List<IssueAuditCase.SelectedTransactionArea> sel = objectMapper.readValue(detailEntity.getSelectionDataJson(), new TypeReference<List<IssueAuditCase.SelectedTransactionArea>>() {});
                    builder.selectedTransactionAreas(sel);
                }
                if (detailEntity.getEvidenceDataJson() != null) {
                    List<IssueAuditCase.EvidenceRecord> ev = objectMapper.readValue(detailEntity.getEvidenceDataJson(), new TypeReference<List<IssueAuditCase.EvidenceRecord>>() {});
                    builder.evidenceRecords(ev);
                }
                if (detailEntity.getFieldVisitFindingsJson() != null) {
                    List<IssueAuditCase.FieldVisitFinding> fv = objectMapper.readValue(detailEntity.getFieldVisitFindingsJson(), new TypeReference<List<IssueAuditCase.FieldVisitFinding>>() {});
                    builder.fieldVisitFindings(fv);
                }
            } catch (Exception e) {
                // Log and continue with empty lists
            }
        }

        return builder.build();
    }
}
