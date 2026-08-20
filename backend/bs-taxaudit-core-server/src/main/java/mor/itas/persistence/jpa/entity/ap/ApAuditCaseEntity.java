package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * ApAuditCaseEntity - JPA Entity for ap_audit_cases table
 * Represents audit cases generated from finalized annual audit plans
 */
@Entity
@Table(name = "ap_audit_cases", indexes = {
    @Index(name = "idx_ap_audit_cases_plan_id", columnList = "plan_id"),
    @Index(name = "idx_ap_audit_cases_status", columnList = "status"),
    @Index(name = "idx_ap_audit_cases_auditor", columnList = "assigned_auditor_id"),
    @Index(name = "idx_ap_audit_cases_team_leader", columnList = "assigned_team_leader_id"),
    @Index(name = "idx_ap_audit_cases_case_number", columnList = "case_number")
})
public class ApAuditCaseEntity {

    @Id
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, name = "plan_id")
    private UUID planId;

    @Column(name = "allocation_id")
    private UUID allocationId;

    @Column(nullable = false, length = 32, name = "case_number", unique = true)
    private String caseNumber;

    @Column(nullable = false, length = 64, name = "taxpayer_id")
    private String taxpayerId;

    @Column(length = 32, name = "audit_type")
    private String auditType;

    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(nullable = false, length = 32, name = "status")
    private String status = "PENDING_ASSIGNMENT";

    @Column(length = 64, name = "assigned_team_leader_id")
    private String assignedTeamLeaderId;

    @Column(length = 64, name = "assigned_auditor_id")
    private String assignedAuditorId;

    @Column(nullable = false, length = 64, name = "created_by")
    private String createdBy;

    @Column(nullable = false, name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "started_at")
    private OffsetDateTime startedAt;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    // Constructors
    public ApAuditCaseEntity() {
    }

    public ApAuditCaseEntity(UUID planId, String caseNumber, String taxpayerId, String auditType, 
                            Integer riskScore, String createdBy) {
        this.planId = planId;
        this.caseNumber = caseNumber;
        this.taxpayerId = taxpayerId;
        this.auditType = auditType;
        this.riskScore = riskScore;
        this.status = "PENDING_ASSIGNMENT";
        this.createdBy = createdBy;
        this.createdAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getPlanId() {
        return planId;
    }

    public void setPlanId(UUID planId) {
        this.planId = planId;
    }

    public UUID getAllocationId() {
        return allocationId;
    }

    public void setAllocationId(UUID allocationId) {
        this.allocationId = allocationId;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }

    public String getTaxpayerId() {
        return taxpayerId;
    }

    public void setTaxpayerId(String taxpayerId) {
        this.taxpayerId = taxpayerId;
    }

    public String getAuditType() {
        return auditType;
    }

    public void setAuditType(String auditType) {
        this.auditType = auditType;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAssignedTeamLeaderId() {
        return assignedTeamLeaderId;
    }

    public void setAssignedTeamLeaderId(String assignedTeamLeaderId) {
        this.assignedTeamLeaderId = assignedTeamLeaderId;
    }

    public String getAssignedAuditorId() {
        return assignedAuditorId;
    }

    public void setAssignedAuditorId(String assignedAuditorId) {
        this.assignedAuditorId = assignedAuditorId;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(OffsetDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public OffsetDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(OffsetDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
