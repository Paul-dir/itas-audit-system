package mor.itas.api.dto.response.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpAuditCaseResponse {
    private UUID id;
    private String caseNumber;
    private String taxpayerName;
    private String tin;
    private String sector;
    private String status;
    private String tpCurrentPhase;
    private BigDecimal totalAssessmentDemand;
}
