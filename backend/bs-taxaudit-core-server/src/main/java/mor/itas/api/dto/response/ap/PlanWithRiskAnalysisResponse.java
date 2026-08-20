package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.time.OffsetDateTime;

/**
 * PlanWithRiskAnalysisResponse - Extended plan response with detailed risk analysis
 * Includes national aggregate, regional breakdown, audit types, and risk levels
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlanWithRiskAnalysisResponse {
    
    private PlanResponse plan;
    private RiskAnalysis riskAnalysis;
    
    public PlanWithRiskAnalysisResponse() {
    }
    
    public PlanWithRiskAnalysisResponse(PlanResponse plan, RiskAnalysis riskAnalysis) {
        this.plan = plan;
        this.riskAnalysis = riskAnalysis;
    }
    
    public PlanResponse getPlan() {
        return plan;
    }
    
    public void setPlan(PlanResponse plan) {
        this.plan = plan;
    }
    
    public RiskAnalysis getRiskAnalysis() {
        return riskAnalysis;
    }
    
    public void setRiskAnalysis(RiskAnalysis riskAnalysis) {
        this.riskAnalysis = riskAnalysis;
    }
    
    /**
     * Risk Analysis - Contains comprehensive risk breakdown
     */
    public static class RiskAnalysis {
        private NationalAggregate nationalAggregate;
        private Map<String, RegionalBreakdown> regionalBreakdown;
        private AuditTypeDistribution auditTypeDistribution;
        private RiskLevelDistribution riskLevelDistribution;
        
        public RiskAnalysis() {
        }
        
        public RiskAnalysis(NationalAggregate national, Map<String, RegionalBreakdown> regional,
                          AuditTypeDistribution auditTypes, RiskLevelDistribution riskLevels) {
            this.nationalAggregate = national;
            this.regionalBreakdown = regional;
            this.auditTypeDistribution = auditTypes;
            this.riskLevelDistribution = riskLevels;
        }
        
        public NationalAggregate getNationalAggregate() {
            return nationalAggregate;
        }
        
        public void setNationalAggregate(NationalAggregate nationalAggregate) {
            this.nationalAggregate = nationalAggregate;
        }
        
        public Map<String, RegionalBreakdown> getRegionalBreakdown() {
            return regionalBreakdown;
        }
        
        public void setRegionalBreakdown(Map<String, RegionalBreakdown> regionalBreakdown) {
            this.regionalBreakdown = regionalBreakdown;
        }
        
        public AuditTypeDistribution getAuditTypeDistribution() {
            return auditTypeDistribution;
        }
        
        public void setAuditTypeDistribution(AuditTypeDistribution auditTypeDistribution) {
            this.auditTypeDistribution = auditTypeDistribution;
        }
        
        public RiskLevelDistribution getRiskLevelDistribution() {
            return riskLevelDistribution;
        }
        
        public void setRiskLevelDistribution(RiskLevelDistribution riskLevelDistribution) {
            this.riskLevelDistribution = riskLevelDistribution;
        }
    }
    
    /**
     * National Level Aggregate
     */
    public static class NationalAggregate {
        private Long totalTaxpayers;
        private Long totalRiskyTaxpayers;
        private Long totalAuditsRequired;
        private Double riskPercentage;
        private RiskLevelCount riskLevelCounts;
        
        public NationalAggregate() {
        }
        
        public NationalAggregate(Long totalTaxpayers, Long riskyTaxpayers, Long auditsRequired, 
                               Double riskPerc, RiskLevelCount counts) {
            this.totalTaxpayers = totalTaxpayers;
            this.totalRiskyTaxpayers = riskyTaxpayers;
            this.totalAuditsRequired = auditsRequired;
            this.riskPercentage = riskPerc;
            this.riskLevelCounts = counts;
        }
        
        public Long getTotalTaxpayers() {
            return totalTaxpayers;
        }
        
        public void setTotalTaxpayers(Long totalTaxpayers) {
            this.totalTaxpayers = totalTaxpayers;
        }
        
        public Long getTotalRiskyTaxpayers() {
            return totalRiskyTaxpayers;
        }
        
        public void setTotalRiskyTaxpayers(Long totalRiskyTaxpayers) {
            this.totalRiskyTaxpayers = totalRiskyTaxpayers;
        }
        
        public Long getTotalAuditsRequired() {
            return totalAuditsRequired;
        }
        
        public void setTotalAuditsRequired(Long totalAuditsRequired) {
            this.totalAuditsRequired = totalAuditsRequired;
        }
        
        public Double getRiskPercentage() {
            return riskPercentage;
        }
        
        public void setRiskPercentage(Double riskPercentage) {
            this.riskPercentage = riskPercentage;
        }
        
        public RiskLevelCount getRiskLevelCounts() {
            return riskLevelCounts;
        }
        
        public void setRiskLevelCounts(RiskLevelCount riskLevelCounts) {
            this.riskLevelCounts = riskLevelCounts;
        }
    }
    
    /**
     * Regional Breakdown - Per region data
     */
    public static class RegionalBreakdown {
        private String regionCode;
        private String regionName;
        private Long taxpayers;
        private Long riskyTaxpayers;
        private Long auditsRequired;
        private RiskLevelCount riskLevelCounts;
        
        public RegionalBreakdown() {
        }
        
        public RegionalBreakdown(String code, String name, Long taxpayers, Long risky, 
                               Long audits, RiskLevelCount counts) {
            this.regionCode = code;
            this.regionName = name;
            this.taxpayers = taxpayers;
            this.riskyTaxpayers = risky;
            this.auditsRequired = audits;
            this.riskLevelCounts = counts;
        }
        
        public String getRegionCode() {
            return regionCode;
        }
        
        public void setRegionCode(String regionCode) {
            this.regionCode = regionCode;
        }
        
        public String getRegionName() {
            return regionName;
        }
        
        public void setRegionName(String regionName) {
            this.regionName = regionName;
        }
        
        public Long getTaxpayers() {
            return taxpayers;
        }
        
        public void setTaxpayers(Long taxpayers) {
            this.taxpayers = taxpayers;
        }
        
        public Long getRiskyTaxpayers() {
            return riskyTaxpayers;
        }
        
        public void setRiskyTaxpayers(Long riskyTaxpayers) {
            this.riskyTaxpayers = riskyTaxpayers;
        }
        
        public Long getAuditsRequired() {
            return auditsRequired;
        }
        
        public void setAuditsRequired(Long auditsRequired) {
            this.auditsRequired = auditsRequired;
        }
        
        public RiskLevelCount getRiskLevelCounts() {
            return riskLevelCounts;
        }
        
        public void setRiskLevelCounts(RiskLevelCount riskLevelCounts) {
            this.riskLevelCounts = riskLevelCounts;
        }
    }
    
    /**
     * Risk Level Counts - Breakdown by risk level
     */
    public static class RiskLevelCount {
        private Long critical;
        private Long high;
        private Long medium;
        private Long low;
        
        public RiskLevelCount() {
        }
        
        public RiskLevelCount(Long critical, Long high, Long medium, Long low) {
            this.critical = critical;
            this.high = high;
            this.medium = medium;
            this.low = low;
        }
        
        public Long getCritical() {
            return critical;
        }
        
        public void setCritical(Long critical) {
            this.critical = critical;
        }
        
        public Long getHigh() {
            return high;
        }
        
        public void setHigh(Long high) {
            this.high = high;
        }
        
        public Long getMedium() {
            return medium;
        }
        
        public void setMedium(Long medium) {
            this.medium = medium;
        }
        
        public Long getLow() {
            return low;
        }
        
        public void setLow(Long low) {
            this.low = low;
        }
    }
    
    /**
     * Audit Type Distribution - Breakdown by audit type
     */
    public static class AuditTypeDistribution {
        private Map<String, AuditTypeDetail> byType;
        
        public AuditTypeDistribution() {
        }
        
        public AuditTypeDistribution(Map<String, AuditTypeDetail> byType) {
            this.byType = byType;
        }
        
        public Map<String, AuditTypeDetail> getByType() {
            return byType;
        }
        
        public void setByType(Map<String, AuditTypeDetail> byType) {
            this.byType = byType;
        }
    }
    
    /**
     * Audit Type Detail
     */
    public static class AuditTypeDetail {
        private String auditType;
        private Double percentage;
        private Long suggestedCount;
        
        public AuditTypeDetail() {
        }
        
        public AuditTypeDetail(String type, Double percent, Long count) {
            this.auditType = type;
            this.percentage = percent;
            this.suggestedCount = count;
        }
        
        public String getAuditType() {
            return auditType;
        }
        
        public void setAuditType(String auditType) {
            this.auditType = auditType;
        }
        
        public Double getPercentage() {
            return percentage;
        }
        
        public void setPercentage(Double percentage) {
            this.percentage = percentage;
        }
        
        public Long getSuggestedCount() {
            return suggestedCount;
        }
        
        public void setSuggestedCount(Long suggestedCount) {
            this.suggestedCount = suggestedCount;
        }
    }
    
    /**
     * Risk Level Distribution
     */
    public static class RiskLevelDistribution {
        private Long critical;
        private Long high;
        private Long medium;
        private Long low;
        private Double criticalPercent;
        private Double highPercent;
        private Double mediumPercent;
        private Double lowPercent;
        
        public RiskLevelDistribution() {
        }
        
        public RiskLevelDistribution(Long crit, Long h, Long m, Long l, 
                                    Double cp, Double hp, Double mp, Double lp) {
            this.critical = crit;
            this.high = h;
            this.medium = m;
            this.low = l;
            this.criticalPercent = cp;
            this.highPercent = hp;
            this.mediumPercent = mp;
            this.lowPercent = lp;
        }
        
        public Long getCritical() {
            return critical;
        }
        
        public void setCritical(Long critical) {
            this.critical = critical;
        }
        
        public Long getHigh() {
            return high;
        }
        
        public void setHigh(Long high) {
            this.high = high;
        }
        
        public Long getMedium() {
            return medium;
        }
        
        public void setMedium(Long medium) {
            this.medium = medium;
        }
        
        public Long getLow() {
            return low;
        }
        
        public void setLow(Long low) {
            this.low = low;
        }
        
        public Double getCriticalPercent() {
            return criticalPercent;
        }
        
        public void setCriticalPercent(Double criticalPercent) {
            this.criticalPercent = criticalPercent;
        }
        
        public Double getHighPercent() {
            return highPercent;
        }
        
        public void setHighPercent(Double highPercent) {
            this.highPercent = highPercent;
        }
        
        public Double getMediumPercent() {
            return mediumPercent;
        }
        
        public void setMediumPercent(Double mediumPercent) {
            this.mediumPercent = mediumPercent;
        }
        
        public Double getLowPercent() {
            return lowPercent;
        }
        
        public void setLowPercent(Double lowPercent) {
            this.lowPercent = lowPercent;
        }
    }
}
