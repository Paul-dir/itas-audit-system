package mor.itas.application.port.inboundport.ap;

import mor.itas.domain.model.ap.RiskAnalysis;

/**
 * RiskAnalysisPort - Inbound Port (Application Port)
 * 
 * This is a driving port that defines the interface for getting risk analysis data.
 * 
 * Implemented by: GetRiskAnalysisUseCase
 * Used by: RiskAnalysisController
 * 
 * Hexagonal Architecture:
 * - External Actor (Planning Team Frontend)
 * - → REST Controller (Adapter)
 * - → RiskAnalysisPort (Port)
 * - → GetRiskAnalysisUseCase (Use Case Implementation)
 */
public interface RiskAnalysisPort {
    
    /**
     * Get complete risk analysis data for plan creation
     * 
     * Returns national and regional risk aggregates along with computed plan defaults.
     * 
     * @return RiskAnalysis aggregate containing:
     *         - National risk data (total taxpayers, risky count, by risk level, by audit type)
     *         - Regional risk data (per-region breakdown)
     *         - Plan defaults (pre-computed case distribution)
     */
    RiskAnalysis getRiskAnalysis();
}
