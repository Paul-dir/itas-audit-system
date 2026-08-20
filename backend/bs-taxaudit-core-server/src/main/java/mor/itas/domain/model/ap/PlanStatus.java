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
     * Director requested revision of the plan
     */
    REVISION_REQUESTED,
    
    /**
     * Director approved plan, ready to send to Regional Directors
     */
    DIRECTOR_APPROVED,
    
    /**
     * Plan awaiting regional feedback collection
     */
    AWAITING_REGIONAL_FEEDBACK,
    
    /**
     * Regional feedback collection complete
     */
    FEEDBACK_COLLECTED,
    
    /**
     * Amendment required based on feedback
     */
    AMENDMENT_REQUIRED,
    
    /**
     * Plan submitted to Regional Directors, waiting for Regional approval
     */
    SUBMITTED_TO_REGIONAL,
    
    /**
     * Plan submitted to Senior Management for approval
     */
    SUBMITTED_TO_SENIOR_MGMT,
    
    /**
     * Senior Management approved plan
     */
    SENIOR_MGMT_APPROVED,
    
    /**
     * Senior Management rejected plan
     */
    SENIOR_MGMT_REJECTED,
    
    /**
     * Approved plan sent to regions for deployment
     */
    APPROVED_TO_REGIONS,
    
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
