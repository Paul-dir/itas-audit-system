package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpComparisonDataSource;
import mor.itas.domain.valueobject.tp.TpComparisonType;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpBenchmarkComparison {
    private String comparisonId;
    private String caseId;
    private TpComparisonType comparisonType;
    private TpComparisonDataSource dataSource;
    private String comparableEntityOrTransaction;
    private BigDecimal taxpayerValue;
    private BigDecimal benchmarkValue;
    private BigDecimal varianceAmount;
    private BigDecimal variancePercentage;
    private String auditPeriod;
    private boolean flaggedAsPotentialIssue;
}
