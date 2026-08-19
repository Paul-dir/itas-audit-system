package mor.itas.persistence.jpa.entity.ap;

/**
 * PlanStatusEnum - JPA-compatible enum for PostgreSQL ap_plan_status type
 * Maps to domain model PlanStatus
 */
public enum PlanStatusEnum {
    DRAFT,
    SUBMITTED_TO_DIRECTOR,
    DIRECTOR_APPROVED,
    SUBMITTED_TO_REGIONAL,
    REGIONAL_APPROVED,
    SENT_TO_TAX_CENTERS,
    TC_FEEDBACK_SUBMITTED,
    FINALIZED
}
