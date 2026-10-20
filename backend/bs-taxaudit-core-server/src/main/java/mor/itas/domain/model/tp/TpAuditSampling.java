package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpSamplingMethod;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpAuditSampling {
    private String samplingId;
    private String caseId;
    private TpSamplingMethod method;
    private String populationDefinition;
    private String selectionCriteria;
    private String sampleSizeRationale;
    private BigDecimal confidenceLevel;
    private BigDecimal precisionMargin;
    private String documentedJustification;
    
    @Builder.Default
    private List<String> supportingEvidence = new ArrayList<>();
}
