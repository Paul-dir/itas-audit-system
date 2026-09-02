package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpAuditPlanStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpAuditPlan {
    private String planId;
    private String caseId;
    @Builder.Default
    private int version = 1;
    @Builder.Default
    private TpAuditPlanStatus status = TpAuditPlanStatus.DRAFT;
    
    private String auditObjective;
    private String auditScope;
    private String auditPeriod;
    
    @Builder.Default
    private List<String> tpIssuesToInvestigate = new ArrayList<>();
    
    @Builder.Default
    private List<TpPlannedProcedure> plannedProcedures = new ArrayList<>();
    
    private String informationRequirements;
    private String resourceAllocation;

    // Sprint 2 Additions (FR-04.5.1-01 to 03, FR-04.2-04 to 06)
    private MaterialityRecord materiality;
    private IndustryResearchRecord industryResearch;
    private AuditSamplingRecord auditSampling;
    
    @Builder.Default
    private List<String> assignedAuditorIds = new ArrayList<>();
    
    @Builder.Default
    private List<String> timelineMilestones = new ArrayList<>();
    
    private String expectedOutputs;
    
    private String submittedToId;
    private LocalDateTime submittedAt;
    private String reviewedById;
    private LocalDateTime reviewedAt;
    private String reviewDecision;
    private String reviewComments;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TpPlannedProcedure {
        private String procedureId;
        private int sequence;
        private String title;
        private String description;
        private String targetArea;
        private String assignedAuditorId;
        private boolean completed;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MaterialityRecord {
        private double thresholdAmount;
        private String currency; // ETB
        private double materialityPercentage; // e.g. 5.0%
        private String basis; // REVENUE, PROFIT, TRANSACTION_AMOUNT
        private String objectiveAndScope;
        private String contextAndResources;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IndustryResearchRecord {
        private String sectorClassification;
        private String businessModelAnalysis;
        private String marketCharacteristics;
        private String economicRisks;
        private String industryBenchmarksSummary;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuditSamplingRecord {
        private String samplingMethod; // STRATIFIED, SYSTEMATIC, RANDOM, JUDGMENTAL
        private String populationDefinition;
        private String selectionCriteria;
        private int calculatedSampleSize;
        private String justification;
    }
}
