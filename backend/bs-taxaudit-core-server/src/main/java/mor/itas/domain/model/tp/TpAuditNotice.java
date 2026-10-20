package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpDeliveryMethod;
import mor.itas.domain.valueobject.tp.TpNoticeStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpAuditNotice {
    private String noticeId;
    private String caseId;
    private String noticeReferenceNumber; // Unique e.g. TP-2026-00101
    @Builder.Default
    private TpNoticeStatus status = TpNoticeStatus.DRAFT;
    
    private LocalDate issueDate;
    private LocalDate responseDeadline;
    
    private String taxpayerName;
    private String tin;
    private String auditPeriod;
    private String issuesSummary;
    private String proposedAdjustmentsSummary;
    
    private BigDecimal assessedPrincipalTax;
    private BigDecimal penalties;
    private BigDecimal interest;
    private BigDecimal totalAssessmentAmount;
    
    private TpDeliveryMethod deliveryMethod;
    private String deliveryStatus;
    private LocalDateTime deliveryTimestamp;
    private String returnedReason; // For Requirement 40 returned notices action plan
    private String actionPlanDetails;
}
