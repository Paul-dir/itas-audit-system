package mor.itas.persistence.jpa.entity.ap;

/**
 * PlanStatusEnum - JPA-compatible enum for PostgreSQL ap_plan_status type
 * Maps to domain model PlanStatus
 */
public enum PlanStatusEnum {
    DRAFT,
    SUBMITTED_TO_DIRECTOR,
    REVISION_REQUESTED,
    DIRECTOR_APPROVED,
    AWAITING_REGIONAL_FEEDBACK,
    FEEDBACK_COLLECTED,
    AMENDMENT_REQUIRED,
    SUBMITTED_TO_REGIONAL,
    SUBMITTED_TO_SENIOR_MGMT,
    SENIOR_MGMT_APPROVED,
    SENIOR_MGMT_REJECTED,
    APPROVED_TO_REGIONS,
    REGIONAL_APPROVED,
    SENT_TO_TAX_CENTERS,
    TC_FEEDBACK_SUBMITTED,
    FINALIZED
}
