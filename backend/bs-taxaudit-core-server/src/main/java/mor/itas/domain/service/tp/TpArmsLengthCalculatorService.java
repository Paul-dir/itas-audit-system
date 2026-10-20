package mor.itas.domain.service.tp;

import mor.itas.domain.model.tp.TpArmsLengthAnalysis;
import mor.itas.domain.valueobject.tp.TpMethod;
import mor.itas.domain.valueobject.tp.TpMethodIndicator;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Service
public class TpArmsLengthCalculatorService {

    /**
     * Calculates arm's length range, arm's length point, and taxpayer variance for a given TP method.
     */
    public TpArmsLengthAnalysis calculateArmsLength(
            String caseId,
            TpMethod tpMethod,
            TpMethodIndicator indicator,
            BigDecimal rangeMin,
            BigDecimal rangeMax,
            BigDecimal taxpayerActualResult,
            String comparableDataSource
    ) {
        BigDecimal determinedArmsLengthPoint = rangeMin.add(rangeMax).divide(BigDecimal.valueOf(2), 4, RoundingMode.HALF_UP);
        BigDecimal varianceAmount = taxpayerActualResult.subtract(determinedArmsLengthPoint);

        BigDecimal variancePercentage = BigDecimal.ZERO;
        if (determinedArmsLengthPoint.compareTo(BigDecimal.ZERO) != 0) {
            variancePercentage = varianceAmount.divide(determinedArmsLengthPoint, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        }

        return TpArmsLengthAnalysis.builder()
                .analysisId(UUID.randomUUID().toString())
                .caseId(caseId)
                .appliedTpMethod(tpMethod)
                .indicatorUsed(indicator)
                .armsLengthRangeMin(rangeMin)
                .armsLengthRangeMax(rangeMax)
                .determinedArmsLengthPriceOrProfit(determinedArmsLengthPoint)
                .taxpayerActualResult(taxpayerActualResult)
                .varianceAmount(varianceAmount)
                .variancePercentage(variancePercentage)
                .comparableDataSource(comparableDataSource)
                .confidenceLevel(BigDecimal.valueOf(95.0))
                .build();
    }
}
