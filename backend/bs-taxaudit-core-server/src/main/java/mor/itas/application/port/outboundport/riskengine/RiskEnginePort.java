package mor.itas.application.port.outboundport.riskengine;

import java.util.Map;

public interface RiskEnginePort {
    Map<String, Integer> fetchSuggestedQuotas();
}
