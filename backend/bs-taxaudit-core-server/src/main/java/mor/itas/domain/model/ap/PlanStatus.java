package mor.itas.domain.model.ap;

/**
 * Plan Status Enum - Defines all possible states for Annual Audit Plans
 * 
 * Workflow: DRAFT → SUBMITTED_TO_DIRECTOR → DIRECTOR_APPROVED → SUBMITTED_TO_REGIONAL 
 *          → REGIONAL_APPROVED → SENT_TO_TAX_CENTERS → TC_FEEDBACK_SUBMITTED → FINALIZED
 */
public enum PlanStatus {
    /**
     * Plan created by Planning Team, not yet submitted to Director
     */
    DRAFT,
    
    /**
     * Plan submitted to Director, waiting for Director approval
     */
    SUBMITTED_TO_DIRECTOR,
    
    /**
     * Director approved plan, ready to send to Regional Directors
     */
    DIRECTOR_APPROVED,
    
    /**
     * Plan submitted to Regional Directors, waiting for Regional approval
     */
    SUBMITTED_TO_REGIONAL,
    
    /**
     * Regional Director approved plan, ready to send to Tax Centers
     */
    REGIONAL_APPROVED,
    
    /**
     * Plan sent to Tax Centers for feedback
     */
    SENT_TO_TAX_CENTERS,
    
    /**
     * All Tax Centers submitted their feedback
     */
    TC_FEEDBACK_SUBMITTED,
    
    /**
     * Plan finalized, ready for case cascade engine
     */
    FINALIZED
}
