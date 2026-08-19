package mor.itas.application.port.outboundport.riskengine;

import mor.itas.domain.valueobject.RiskDistribution;
import java.util.Map;

/**
 * Risk Engine Port
 * 
 * Defines contracts for accessing risk data from external Risk Engine.
 * All operations are read-only queries to prevent accidental modifications.
 */
public interface RiskEnginePort {
    
    /**
     * Fetch suggested quotas by tax center
     * 
     * @return Map of tax center code to suggested case count
     */
    Map<String, Integer> fetchSuggestedQuotas();
    
    /**
     * Get national risk distribution
     * 
     * @return RiskDistribution with counts for each risk level
     */
    RiskDistribution getNationalRiskDistribution();
    
    /**
     * Get risk distribution by region
     * 
     * @return Map of region code to RiskDistribution
     */
    Map<String, RiskDistribution> getRiskDistributionByRegion();
    
    /**
     * Get recommended audit type distribution
     * 
     * @return Map of audit type code to recommended percentage (0-100)
     */
    Map<String, Double> getRecommendedAuditTypeDistribution();
}
