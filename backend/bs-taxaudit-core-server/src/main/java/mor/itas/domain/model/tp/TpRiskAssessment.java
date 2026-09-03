package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import mor.itas.domain.model.ap.RiskLevel;
import mor.itas.domain.valueobject.tp.TpRiskAssessmentStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpRiskAssessment {
    private String riskAssessmentId;
    private String caseId;
    @Builder.Default
    private int version = 1;
    @Builder.Default
    private TpRiskAssessmentStatus status = TpRiskAssessmentStatus.DRAFT;
    private RiskLevel overallRiskLevel;
    
    @Builder.Default
    private List<RiskCategoryItem> riskCategories = new ArrayList<>();
    
    @Builder.Default
    private List<String> riskIndicators = new ArrayList<>();
    
    @Builder.Default
    private List<String> supportingEvidence = new ArrayList<>();
    
    private String auditorComments;
    private String createdById;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskCategoryItem {
        private String categoryName; // e.g. "TP Documentation", "Functional Analysis", "Economic Analysis", "Comparable Analysis", "Profit Allocation"
        private String question;
        private String response;
        private boolean riskIdentified;
        private String evidenceReference;
    }

    /**
     * Calculates the overall risk level based on identified risk indicators.
     */
    public RiskLevel calculateOverallRiskLevel() {
        long riskCount = riskCategories.stream().filter(RiskCategoryItem::isRiskIdentified).count();
        if (riskCount >= 4) {
            this.overallRiskLevel = RiskLevel.CRITICAL;
        } else if (riskCount == 3) {
            this.overallRiskLevel = RiskLevel.HIGH;
        } else if (riskCount >= 1) {
            this.overallRiskLevel = RiskLevel.MEDIUM;
        } else {
            this.overallRiskLevel = RiskLevel.LOW;
        }
        return this.overallRiskLevel;
    }
}
