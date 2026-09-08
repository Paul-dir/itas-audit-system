package mor.itas.domain.model.ap;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * AuditCase - Domain Model for audit cases generated from finalized plans
 * Represents individual audit cases with assignment and status tracking
 */
public class AuditCase {
    private UUID id;
    private UUID committeeCaseId;
    private String taxIdNumber;
    private UUID planId;
    private UUID allocationId;
    private String caseNumber;
    private String taxpayerId;
    private String taxpayerName;
    private String auditType;
    private String riskPriority;
    private Integer riskScore;
    private String segment;
    private String status;  // PENDING_ASSIGNMENT, ASSIGNED, IN_PROGRESS, COMPLETED
    private String assignedTeamLeaderId;
    private String assignedAuditorId;
    private java.time.OffsetDateTime handoffAt;
    private String handoffBy;
    private String handoffComment;
    private java.time.OffsetDateTime assignedAt;
    private String assignedBy;
    private String createdBy;
    private OffsetDateTime createdAt;
    private OffsetDateTime startedAt;
    private OffsetDateTime completedAt;
    private OffsetDateTime updatedAt;

    // Status Constants
    public static final String STATUS_PENDING_ASSIGNMENT = "PENDING_ASSIGNMENT";
    public static final String STATUS_ASSIGNED = "ASSIGNED";
    public static final String STATUS_IN_PROGRESS = "IN_PROGRESS";
    public static final String STATUS_COMPLETED = "COMPLETED";

    // Constructors
    public AuditCase() {
    }

    public AuditCase(UUID planId, String caseNumber, String taxpayerId, String auditType,
                    Integer riskScore, String createdBy) {
        this.id = UUID.randomUUID();
        this.planId = planId;
        this.caseNumber = caseNumber;
        this.taxpayerId = taxpayerId;
        this.auditType = auditType;
        this.riskScore = riskScore;
        this.status = STATUS_PENDING_ASSIGNMENT;
        this.createdBy = createdBy;
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    public AuditCase(UUID id, UUID planId, UUID allocationId, String caseNumber, String taxpayerId,
                    String taxpayerName, String auditType, String riskPriority, Integer riskScore,
                    String segment, String status, String assignedTeamLeaderId,
                    String assignedAuditorId, String createdBy, OffsetDateTime createdAt,
                    OffsetDateTime startedAt, OffsetDateTime completedAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.planId = planId;
        this.allocationId = allocationId;
        this.caseNumber = caseNumber;
        this.taxpayerId = taxpayerId;
        this.taxpayerName = taxpayerName;
        this.auditType = auditType;
        this.riskPriority = riskPriority;
        this.riskScore = riskScore;
        this.segment = segment;
        this.status = status;
        this.assignedTeamLeaderId = assignedTeamLeaderId;
        this.assignedAuditorId = assignedAuditorId;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.updatedAt = updatedAt;
    }

    // Business Methods
    public void assignToTeamLeader(String teamLeaderId) {
        if (!STATUS_PENDING_ASSIGNMENT.equals(this.status)) {
            throw new IllegalStateException("Cannot assign case that is not in PENDING_ASSIGNMENT status");
        }
        this.assignedTeamLeaderId = teamLeaderId;
        this.status = STATUS_ASSIGNED;
        this.updatedAt = OffsetDateTime.now();
    }

    public void assignToAuditor(String auditorId) {
        if (!STATUS_ASSIGNED.equals(this.status)) {
            throw new IllegalStateException("Case must be assigned to team leader first");
        }
        this.assignedAuditorId = auditorId;
        this.status = STATUS_IN_PROGRESS;
        this.startedAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    public void complete() {
        if (!STATUS_IN_PROGRESS.equals(this.status)) {
            throw new IllegalStateException("Only in-progress cases can be completed");
        }
        this.status = STATUS_COMPLETED;
        this.completedAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    public boolean isPendingAssignment() {
        return STATUS_PENDING_ASSIGNMENT.equals(this.status);
    }

    public boolean isAssigned() {
        return assignedTeamLeaderId != null && !STATUS_PENDING_ASSIGNMENT.equals(this.status);
    }

    public boolean isInProgress() {
        return STATUS_IN_PROGRESS.equals(this.status);
    }

    public boolean isCompleted() {
        return STATUS_COMPLETED.equals(this.status);
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getCommitteeCaseId() { return committeeCaseId; }
    public UUID getPlanId() { return planId; }
    public UUID getAllocationId() { return allocationId; }
    public String getCaseNumber() { return caseNumber; }
    public String getTaxpayerId() { return taxpayerId; }
    public String getTaxIdNumber() { return taxIdNumber; }
    public String getTaxpayerName() { return taxpayerName; }
    public String getAuditType() { return auditType; }
    public String getRiskPriority() { return riskPriority; }
    public Integer getRiskScore() { return riskScore; }
    public String getSegment() { return segment; }
    public String getStatus() { return status; }
    public String getAssignedTeamLeaderId() { return assignedTeamLeaderId; }
    public String getAssignedAuditorId() { return assignedAuditorId; }
    public String getCreatedBy() { return createdBy; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getStartedAt() { return startedAt; }
    public OffsetDateTime getCompletedAt() { return completedAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public OffsetDateTime getHandoffAt() { return handoffAt; }
    public String getHandoffBy() { return handoffBy; }
    public String getHandoffComment() { return handoffComment; }
    public OffsetDateTime getAssignedAt() { return assignedAt; }
    public String getAssignedBy() { return assignedBy; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setCommitteeCaseId(UUID committeeCaseId) { this.committeeCaseId = committeeCaseId; }
    public void setPlanId(UUID planId) { this.planId = planId; }
    public void setAllocationId(UUID allocationId) { this.allocationId = allocationId; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }
    public void setTaxpayerId(String taxpayerId) { this.taxpayerId = taxpayerId; }
    public void setTaxIdNumber(String taxIdNumber) { this.taxIdNumber = taxIdNumber; }
    public void setTaxpayerName(String taxpayerName) { this.taxpayerName = taxpayerName; }
    public void setAuditType(String auditType) { this.auditType = auditType; }
    public void setRiskPriority(String riskPriority) { this.riskPriority = riskPriority; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
    public void setSegment(String segment) { this.segment = segment; }
    public void setStatus(String status) { this.status = status; }
    public void setAssignedTeamLeaderId(String assignedTeamLeaderId) { this.assignedTeamLeaderId = assignedTeamLeaderId; }
    public void setAssignedAuditorId(String assignedAuditorId) { this.assignedAuditorId = assignedAuditorId; }
    public void setHandoffAt(OffsetDateTime handoffAt) { this.handoffAt = handoffAt; }
    public void setHandoffBy(String handoffBy) { this.handoffBy = handoffBy; }
    public void setHandoffComment(String handoffComment) { this.handoffComment = handoffComment; }
    public void setAssignedAt(OffsetDateTime assignedAt) { this.assignedAt = assignedAt; }
    public void setAssignedBy(String assignedBy) { this.assignedBy = assignedBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public void setStartedAt(OffsetDateTime startedAt) { this.startedAt = startedAt; }
    public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
