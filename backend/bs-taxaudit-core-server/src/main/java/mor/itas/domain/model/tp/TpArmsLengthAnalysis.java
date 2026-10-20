package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpMethod;
import mor.itas.domain.valueobject.tp.TpMethodIndicator;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpArmsLengthAnalysis {
    private String analysisId;
    private String caseId;
    private TpMethod appliedTpMethod;
    private TpMethodIndicator indicatorUsed;
    
    private BigDecimal determinedArmsLengthPriceOrProfit;
    private BigDecimal armsLengthRangeMin;
    private BigDecimal armsLengthRangeMax;
    private BigDecimal taxpayerActualResult;
    
    private BigDecimal varianceAmount;
    private BigDecimal variancePercentage;
    private String comparableDataSource;
    private BigDecimal confidenceLevel;
    private String limitationsIdentified;
}
