package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpCostExpenseSelection {
    private String selectionId;
    private String caseId;
    private String costCategory;
    private BigDecimal selectionThreshold;
    private String rationale;
    private BigDecimal confidenceLevel;
    
    private boolean auditorOverridden;
    private String overrideReason;
    private String overrideJustification;
}
