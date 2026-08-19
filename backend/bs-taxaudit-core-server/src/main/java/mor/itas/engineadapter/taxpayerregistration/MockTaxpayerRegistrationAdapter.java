package mor.itas.engineadapter.taxpayerregistration;

import mor.itas.application.port.outboundport.taxpayerregistration.TaxpayerRegistrationPort;
import mor.itas.domain.valueobject.TaxpayerStats;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

/**
 * Mock Taxpayer Registration Adapter
 * 
 * Phase 1 implementation providing mock taxpayer data.
 * Phase 2 will replace with real Registration Service integration.
 */
@Component
@Profile("mock")
public class MockTaxpayerRegistrationAdapter implements TaxpayerRegistrationPort {

    @Override
    public boolean verifyTaxpayerStatus(String tin) {
        // Mock always returns true for Phase 1
        return true;
    }

    @Override
    public TaxpayerStats getNationalTaxpayerStats() {
        // National-level taxpayer statistics
        // Total: 2.5M
        // Active: 2.35M (94%)
        // Inactive: 150K (6%)
        return new TaxpayerStats(
            2_500_000L,  // total
            2_350_000L,  // active
            150_000L     // inactive
        );
    }

    @Override
    public Map<String, TaxpayerStats> getTaxpayersByRegion() {
        Map<String, TaxpayerStats> regionalStats = new HashMap<>();
        
        // Addis Ababa (AA)
        regionalStats.put("AA", new TaxpayerStats(500_000L, 475_000L, 25_000L));
        
        // Dire Dawa (AB)
        regionalStats.put("AB", new TaxpayerStats(150_000L, 142_500L, 7_500L));
        
        // Amhara (BA)
        regionalStats.put("BA", new TaxpayerStats(800_000L, 760_000L, 40_000L));
        
        // Oromia (BB)
        regionalStats.put("BB", new TaxpayerStats(800_000L, 760_000L, 40_000L));
        
        // SNNPR (CA)
        regionalStats.put("CA", new TaxpayerStats(250_000L, 212_500L, 37_500L));
        
        return regionalStats;
    }
}
