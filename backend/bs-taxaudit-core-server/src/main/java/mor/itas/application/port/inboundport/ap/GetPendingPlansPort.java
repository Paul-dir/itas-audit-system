package mor.itas.application.port.inboundport.ap;

import mor.itas.domain.model.ap.AnnualAuditPlan;
import java.util.List;

/**
 * GetPendingPlansPort - Inbound Port
 * 
 * Defines the contract for retrieving pending plans awaiting director review.
 */
public interface GetPendingPlansPort {
    
    /**
     * Get all plans awaiting director review
     * 
     * @return list of plans in SUBMITTED_TO_DIRECTOR status
     */
    List<AnnualAuditPlan> getPendingPlans();
}
