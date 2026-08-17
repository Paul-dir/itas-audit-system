package mor.itas.engineadapter.risk;

import mor.itas.application.port.outboundport.risk.RiskEnginePort;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

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
}
