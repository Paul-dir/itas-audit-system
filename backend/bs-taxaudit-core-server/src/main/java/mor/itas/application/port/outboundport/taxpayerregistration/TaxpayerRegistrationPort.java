package mor.itas.application.port.outboundport.taxpayerregistration;

import mor.itas.domain.valueobject.TaxpayerStats;
import java.util.Map;

/**
 * Taxpayer Registration Port
 * 
 * Defines contracts for accessing taxpayer registration data.
 * All operations are read-only queries to prevent accidental modifications.
 */
public interface TaxpayerRegistrationPort {
    
    /**
     * Verify if a taxpayer (by TIN) is registered and active
     * 
     * @param tin Taxpayer Identification Number
     * @return true if taxpayer is registered and active
     */
    boolean verifyTaxpayerStatus(String tin);
    
    /**
     * Get national-level taxpayer statistics
     * 
     * @return TaxpayerStats with national totals
     */
    TaxpayerStats getNationalTaxpayerStats();
    
    /**
     * Get taxpayer statistics by region
     * 
     * @return Map of region code to TaxpayerStats
     */
    Map<String, TaxpayerStats> getTaxpayersByRegion();
}
