package mor.itas.engineadapter.riskengine;

import mor.itas.application.port.outboundport.riskengine.RiskEnginePort;
import mor.itas.domain.valueobject.RiskDistribution;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

/**
 * Mock Risk Engine Adapter
 */
@Component
@Profile("mock")
public class MockRiskEngineAdapter implements RiskEnginePort {

    @Override
    public Map<String, Integer> fetchSuggestedQuotas() {
        Map<String, Integer> mockQuotas = new HashMap<>();
        mockQuotas.put("TC-ADDIS-01", 150);
        mockQuotas.put("TC-ADDIS-02", 120);
        mockQuotas.put("TC-HAWASSA-01", 85);
        mockQuotas.put("TC-DIREDAWA-01", 60);
        mockQuotas.put("TC-BAHIR-01", 95);
        return mockQuotas;
    }

    @Override
    public RiskDistribution getNationalRiskDistribution() {
        return new RiskDistribution(21_500L, 79_980L, 149_640L, 178_880L);
    }

    @Override
    public Map<String, RiskDistribution> getRiskDistributionByRegion() {
        Map<String, RiskDistribution> regionalRisk = new HashMap<>();
        regionalRisk.put("AA", new RiskDistribution(4_300L, 15_996L, 29_928L, 35_776L));
        regionalRisk.put("BA", new RiskDistribution(3_225L, 11_997L, 22_446L, 26_832L));
        regionalRisk.put("BB", new RiskDistribution(3_225L, 11_997L, 22_446L, 26_832L));
        regionalRisk.put("AB", new RiskDistribution(968L, 3_599L, 6_734L, 8_050L));
        regionalRisk.put("CA", new RiskDistribution(1_075L, 4_198L, 7_857L, 9_391L));
        regionalRisk.put("SO", new RiskDistribution(1_075L, 4_198L, 7_857L, 9_391L));
        return regionalRisk;
    }

    @Override
    public Map<String, Double> getRecommendedAuditTypeDistribution() {
        Map<String, Double> distribution = new HashMap<>();
        distribution.put("DESK", 35.0);
        distribution.put("FIELD", 25.0);
        distribution.put("JOINT", 15.0);
        distribution.put("TPRICE", 8.0);
        distribution.put("COMP", 12.0);
        distribution.put("ISSUE", 5.0);
        return distribution;
    }
}
