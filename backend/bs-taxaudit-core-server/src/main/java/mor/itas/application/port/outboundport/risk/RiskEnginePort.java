package mor.itas.application.port.outboundport.risk;

import java.util.Map;

public interface RiskEnginePort {
    Map<String, Integer> fetchSuggestedQuotas();
}
