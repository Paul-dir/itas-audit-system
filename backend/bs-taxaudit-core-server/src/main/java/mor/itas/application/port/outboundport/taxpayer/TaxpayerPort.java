package mor.itas.application.port.outboundport.taxpayer;

import java.util.List;
import java.util.Map;

/**
 * TaxpayerPort - Outbound port for taxpayer data access
 * 
 * Used by the case cascade use case to:
 * 1. Fetch taxpayers registered in a specific tax center
 * 2. Get risk scores and recommended audit types for each taxpayer
 * 3. Rank taxpayers by risk level within each audit type
 */
public interface TaxpayerPort {
    
    /**
     * Get all active taxpayers for a specific tax center
     * Each taxpayer includes: tin, name, sector, businessSize, financials, riskFlags
     */
    List<Map<String, Object>> getTaxpayersForTaxCenter(String taxCenterCode);
    
    /**
     * Get risk classification for a taxpayer
     * Returns recommended audit type and risk score
     * 
     * @param tin Taxpayer Identification Number
     * @param taxCenterCode Tax center code
     * @return Map with keys: auditType, riskScore, riskLevel, reason
     */
    Map<String, Object> getTaxpayerRiskClassification(String tin, String taxCenterCode);
    
    /**
     * Get taxpayers ranked by risk for a specific audit type
     * Used to select the top N taxpayers matching the plan allocation
     */
    List<Map<String, Object>> getTaxpayersByAuditType(String taxCenterCode, String auditType, int limit);
}
