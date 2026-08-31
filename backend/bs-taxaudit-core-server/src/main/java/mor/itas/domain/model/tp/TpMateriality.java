package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpMaterialityBasis;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpMateriality {
    private String materialityId;
    private String caseId;
    private String objective;
    private String scope;
    private String context;
    private String resourcesRequired;
    
    @Builder.Default
    private List<String> researchAndEvidence = new ArrayList<>();
    
    @Builder.Default
    private List<String> documentedAssumptions = new ArrayList<>();
    
    private BigDecimal thresholdAmount;
    
    @Builder.Default
    private String currency = "ETB";
    
    private BigDecimal materialityPercentage;
    private TpMaterialityBasis basis;
    private LocalDate effectiveDate;
    private String notes;
}
