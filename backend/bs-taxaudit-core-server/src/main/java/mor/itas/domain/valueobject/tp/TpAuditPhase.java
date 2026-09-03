package mor.itas.domain.valueobject.tp;

/**
 * Phased workflow steps specifically for Transfer Pricing Audit cases.
 */
public enum TpAuditPhase {
    DETAILED_RISK_ASSESSMENT,
    PLANNING,
    PLANNING_APPROVAL,
    FIELD_WORK,
    ANALYSIS,
    REPORT,
    REPORT_APPROVAL,
    NOTICE,
    ASSESSMENT,
    TAXPAYER_RESPONSE,
    REVIEW_OR_INVESTIGATION,
    COMPLETION,
    CLOSED_SUCCESSFULLY
}
