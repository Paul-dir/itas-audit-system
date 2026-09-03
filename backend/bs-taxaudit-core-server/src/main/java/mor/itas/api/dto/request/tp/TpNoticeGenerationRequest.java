package mor.itas.api.dto.request.tp;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TpNoticeGenerationRequest {
    private String taxpayerName;
    private String tin;
    private String auditPeriod;
    private String issuesSummary;
    private String proposedAdjustmentsSummary;
    private BigDecimal assessedPrincipalTax;
    private BigDecimal penalties;
    private BigDecimal interest;
    private LocalDate issueDate;
    private LocalDate responseDeadline;
    private String deliveryMethod;  // EMAIL, ELECTRONIC_PORTAL, PHYSICAL_MAIL
}
