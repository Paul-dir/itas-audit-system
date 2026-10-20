package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpCrossBorderConclusion;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpCrossBorderAssessment {
    private String assessmentId;
    private String caseId;
    private String foreignRelatedPartyId;
    private String foreignRelatedPartyName;
    private String counterpartyCountry;
    private String transactionDescription;
    private BigDecimal transactionAmount;
    private String pricingTerms;
    
    @Builder.Default
    private List<String> supportingAnalysisEvidence = new ArrayList<>();
    
    @Builder.Default
    private List<String> identifiedRiskIndicators = new ArrayList<>();
    
    private TpCrossBorderConclusion conclusion;
    private String AuditorNotes;
}
