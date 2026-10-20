package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpHypothesisStatus;
import mor.itas.domain.valueobject.tp.TpMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpWorkingHypothesis {
    private String hypothesisId;
    private String caseId;
    @Builder.Default
    private TpHypothesisStatus status = TpHypothesisStatus.DRAFT;
    private String hypothesisDescription;
    private String identifiedIssue;
    private String economicRationale;
    private String controlledTransaction;
    private String relatedPartyId;
    private String relatedPartyName;
    
    @Builder.Default
    private List<String> riskIndicators = new ArrayList<>();
    
    @Builder.Default
    private List<String> supportingEvidence = new ArrayList<>();
    
    @Builder.Default
    private List<String> documentedAssumptions = new ArrayList<>();
    
    @Builder.Default
    private String currency = "ETB";
    
    private String calculationBasis;
    private BigDecimal estimatedRevenueAtRisk;
    private String calculationMethodology;
    private TpMethod preliminaryTpMethod;
    private String comparableDataUsed;
    private String initialConclusion;
    private String preparerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
