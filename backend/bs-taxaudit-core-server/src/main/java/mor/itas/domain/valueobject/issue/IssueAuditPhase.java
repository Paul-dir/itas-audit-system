package mor.itas.domain.valueobject.issue;

public enum IssueAuditPhase {
    NOTIFICATION,
    TRANSACTION_SELECTION,
    EVIDENCE_GATHERING,
    FIELD_VISIT,
    REPORT_DRAFT,
    TEAM_LEADER_REVIEW,
    PROCESS_OWNER_REVIEW,
    DIRECTOR_REVIEW,
    FOLLOW_UP
}
