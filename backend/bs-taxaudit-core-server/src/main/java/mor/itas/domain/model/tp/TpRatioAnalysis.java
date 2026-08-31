package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpRatioMetric;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpRatioAnalysis {
    private String ratioId;
    private String caseId;
    private TpRatioMetric metricName;
    private String calculationFormula;
    
    @Builder.Default
    private Map<String, BigDecimal> inputValues = new HashMap<>();
    
    private BigDecimal calculatedResult;
    private String periodCovered;
    private BigDecimal benchmarkValue;
    private BigDecimal varianceAmount;
    private BigDecimal variancePercentage;
    private boolean exceedsThreshold;
    private String dataSource;
}
