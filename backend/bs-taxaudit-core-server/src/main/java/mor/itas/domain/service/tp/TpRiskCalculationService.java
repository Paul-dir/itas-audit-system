package mor.itas.domain.service.tp;

import mor.itas.domain.model.ap.RiskLevel;
import mor.itas.domain.model.tp.TpRiskAssessment;

import org.springframework.stereotype.Service;

@Service
public class TpRiskCalculationService {

    /**
     * Assesses and updates the overall risk level on a TpRiskAssessment domain model.
     */
    public RiskLevel evaluateRiskAssessment(TpRiskAssessment riskAssessment) {
        if (riskAssessment == null) {
            return RiskLevel.LOW;
        }
        return riskAssessment.calculateOverallRiskLevel();
    }
}
