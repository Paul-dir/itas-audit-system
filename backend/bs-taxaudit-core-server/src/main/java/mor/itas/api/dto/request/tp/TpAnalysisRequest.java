package mor.itas.api.dto.request.tp;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TpAnalysisRequest {
    private String analysisType; // RATIO, BENCHMARK, CROSS_BORDER, CUSTOMS_VALUATION, METHOD_SELECTION, ARMS_LENGTH, COST_EXPENSE
    private JsonNode data;
    private String selectedTpMethod;

    // Arms Length specific
    private BigDecimal armsLengthRangeMin;
    private BigDecimal armsLengthRangeMax;
    private BigDecimal taxpayerActualResult;
    private BigDecimal varianceAmount;
    private BigDecimal variancePercentage;
}
