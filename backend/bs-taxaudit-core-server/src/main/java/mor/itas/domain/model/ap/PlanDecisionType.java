package mor.itas.domain.model.ap;

/**
 * PlanDecisionType - Enum
 * 
 * Represents the possible decisions a director can make on a plan
 */
public enum PlanDecisionType {
    APPROVED("Director approved the plan"),
    REJECTED("Director rejected the plan"),
    AMENDMENT_REQUESTED("Director requested amendments");
    
    private final String description;
    
    PlanDecisionType(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
