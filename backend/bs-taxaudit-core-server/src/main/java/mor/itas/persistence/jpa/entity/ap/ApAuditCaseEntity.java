package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import mor.itas.persistence.jpa.entity.tp.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * ApAuditCaseEntity - JPA Entity for ap_audit_cases table
 * Represents audit cases generated from finalized annual audit plans.
 *
 * Status lifecycle:
 *   PENDING_ASSIGNMENT → ASSIGNED_TO_TEAM_LEADER (or ASSIGNED_TO_COMMITTEE for Joint/TP)
 *   ASSIGNED_TO_TEAM_LEADER → IN_PROGRESS (after team leader allocates to auditor)
 *   IN_PROGRESS → COMPLETED
 */
@Entity
@Table(name = "ap_audit_cases", indexes = {
    @Index(name = "idx_ap_audit_cases_plan_id", columnList = "plan_id"),
    @Index(name = "idx_ap_audit_cases_status", columnList = "status"),
    @Index(name = "idx_ap_audit_cases_auditor", columnList = "assigned_auditor_id"),
    @Index(name = "idx_ap_audit_cases_team_leader", columnList = "assigned_team_leader_id"),
    @Index(name = "idx_ap_audit_cases_case_number", columnList = "case_number"),
    @Index(name = "idx_ap_audit_cases_tax_center", columnList = "tax_center_code"),
    @Index(name = "idx_ap_audit_cases_region", columnList = "region_code"),
    @Index(name = "idx_ap_audit_cases_audit_type", columnList = "audit_type"),
    @Index(name = "idx_ap_audit_cases_tc_status", columnList = "tax_center_code, status"),
    @Index(name = "idx_ap_audit_cases_tl_status", columnList = "assigned_team_leader_id, status")
})
public class ApAuditCaseEntity {

    // ── Status constants ──────────────────────────────────────────────────────
    /** Newly created — not yet assigned to anyone */
    public static final String STATUS_PENDING_ASSIGNMENT      = "PENDING_ASSIGNMENT";
    /** Assigned to a desk / comprehensive / issue team leader */
    public static final String STATUS_ASSIGNED_TO_TEAM_LEADER = "ASSIGNED_TO_TEAM_LEADER";
    /** Assigned to joint-audit or transfer-pricing committee */
    public static final String STATUS_ASSIGNED_TO_COMMITTEE   = "ASSIGNED_TO_COMMITTEE";
    /** Team leader has further allocated to a specific auditor */
    public static final String STATUS_IN_PROGRESS             = "IN_PROGRESS";
    /** Audit execution finished */
    public static final String STATUS_COMPLETED               = "COMPLETED";

    @Id
    private UUID id = UUID.randomUUID();

    @Column(nullable = false, name = "plan_id")
    private UUID planId;

    @Column(name = "allocation_id")
    private UUID allocationId;

    /** Direct denormalized reference — avoids join via allocation table */
    @Column(length = 64, name = "tax_center_code")
    private String taxCenterCode;

    @Column(length = 10, name = "region_code")
    private String regionCode;

    @Column(nullable = false, length = 32, name = "case_number", unique = true)
    private String caseNumber;

    /** TIN / taxpayer registration number */
    @Column(nullable = false, length = 64, name = "taxpayer_id")
    private String taxpayerId;

    /** Human-readable taxpayer name for display (denormalized from taxpayer service) */
    @Column(length = 256, name = "taxpayer_name")
    private String taxpayerName;

    /** Business sector (denormalized) */
    @Column(length = 128, name = "sector")
    private String sector;

    @Column(length = 32, name = "audit_type")
    private String auditType;

    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(name = "estimated_revenue")
    private Long estimatedRevenue;

    @Column(nullable = false, length = 32, name = "status")
    private String status = STATUS_PENDING_ASSIGNMENT;

    /**
     * For DESK / COMPREHENSIVE / ISSUE: holds the team leader's userId.
     * For JOINT_AUDIT / TRANSFER_PRICING: holds the committee member's userId.
     */
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

    // ── TP-Specific Child Entities ────────────────────────────────────────────
    @OneToOne(mappedBy = "auditCase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private TpRiskAssessmentEntity tpRiskAssessment;

    @OneToOne(mappedBy = "auditCase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private TpWorkingHypothesisEntity tpWorkingHypothesis;

    @OneToOne(mappedBy = "auditCase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private TpAuditPlanEntity tpAuditPlan;

    @OneToOne(mappedBy = "auditCase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private TpPlanningMeetingEntity tpPlanningMeeting;

    @OneToOne(mappedBy = "auditCase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private TpFieldWorkDataEntity tpFieldWorkData;

    @OneToOne(mappedBy = "auditCase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private TpAnalysisDataEntity tpAnalysisData;

    @OneToMany(mappedBy = "auditCase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<TpAuditReportEntity> tpAuditReports = new java.util.ArrayList<>();

    @OneToOne(mappedBy = "auditCase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private TpAuditNoticeEntity tpAuditNotice;

    @OneToMany(mappedBy = "auditCase", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private java.util.List<TpObjectionEntity> tpObjections = new java.util.ArrayList<>();

    /** Current workflow phase for TP cases (e.g. DETAILED_RISK_ASSESSMENT, PLANNING, FIELD_WORK…) */
    @Column(name = "tp_current_phase", length = 64)
    private String tpCurrentPhase;

    // ── Constructors ──────────────────────────────────────────────────────────
    public ApAuditCaseEntity() {
    }

    public ApAuditCaseEntity(UUID planId, String caseNumber, String taxpayerId, String auditType,
                             Integer riskScore, String createdBy) {
        this.planId = planId;
        this.caseNumber = caseNumber;
        this.taxpayerId = taxpayerId;
        this.auditType = auditType;
        this.riskScore = riskScore;
        this.status = STATUS_PENDING_ASSIGNMENT;
        this.createdBy = createdBy;
        this.createdAt = OffsetDateTime.now();
    }

    // ── Helper: is this a committee-type case? ────────────────────────────────
    public boolean isCommitteeCase() {
        return STATUS_ASSIGNED_TO_COMMITTEE.equals(this.status) ||
               "JOINT_AUDIT".equals(this.auditType) ||
               "TRANSFER_PRICING".equals(this.auditType);
    }

    // ── Getters and Setters ───────────────────────────────────────────────────
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getPlanId() { return planId; }
    public void setPlanId(UUID planId) { this.planId = planId; }

    public UUID getAllocationId() { return allocationId; }
    public void setAllocationId(UUID allocationId) { this.allocationId = allocationId; }

    public String getTaxCenterCode() { return taxCenterCode; }
    public void setTaxCenterCode(String taxCenterCode) { this.taxCenterCode = taxCenterCode; }

    public String getRegionCode() { return regionCode; }
    public void setRegionCode(String regionCode) { this.regionCode = regionCode; }

    public String getCaseNumber() { return caseNumber; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }

    public String getTaxpayerId() { return taxpayerId; }
    public void setTaxpayerId(String taxpayerId) { this.taxpayerId = taxpayerId; }

    public String getTaxpayerName() { return taxpayerName; }
    public void setTaxpayerName(String taxpayerName) { this.taxpayerName = taxpayerName; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getAuditType() { return auditType; }
    public void setAuditType(String auditType) { this.auditType = auditType; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public Long getEstimatedRevenue() { return estimatedRevenue; }
    public void setEstimatedRevenue(Long estimatedRevenue) { this.estimatedRevenue = estimatedRevenue; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedTeamLeaderId() { return assignedTeamLeaderId; }
    public void setAssignedTeamLeaderId(String assignedTeamLeaderId) { this.assignedTeamLeaderId = assignedTeamLeaderId; }

    public String getAssignedAuditorId() { return assignedAuditorId; }
    public void setAssignedAuditorId(String assignedAuditorId) { this.assignedAuditorId = assignedAuditorId; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(OffsetDateTime startedAt) { this.startedAt = startedAt; }

    public OffsetDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public TpRiskAssessmentEntity getTpRiskAssessment() { return tpRiskAssessment; }
    public void setTpRiskAssessment(TpRiskAssessmentEntity tpRiskAssessment) { this.tpRiskAssessment = tpRiskAssessment; }

    public TpWorkingHypothesisEntity getTpWorkingHypothesis() { return tpWorkingHypothesis; }
    public void setTpWorkingHypothesis(TpWorkingHypothesisEntity tpWorkingHypothesis) { this.tpWorkingHypothesis = tpWorkingHypothesis; }

    public TpAuditPlanEntity getTpAuditPlan() { return tpAuditPlan; }
    public void setTpAuditPlan(TpAuditPlanEntity tpAuditPlan) { this.tpAuditPlan = tpAuditPlan; }

    public TpPlanningMeetingEntity getTpPlanningMeeting() { return tpPlanningMeeting; }
    public void setTpPlanningMeeting(TpPlanningMeetingEntity tpPlanningMeeting) { this.tpPlanningMeeting = tpPlanningMeeting; }

    public TpFieldWorkDataEntity getTpFieldWorkData() { return tpFieldWorkData; }
    public void setTpFieldWorkData(TpFieldWorkDataEntity tpFieldWorkData) { this.tpFieldWorkData = tpFieldWorkData; }

    public TpAnalysisDataEntity getTpAnalysisData() { return tpAnalysisData; }
    public void setTpAnalysisData(TpAnalysisDataEntity tpAnalysisData) { this.tpAnalysisData = tpAnalysisData; }

    public java.util.List<TpAuditReportEntity> getTpAuditReports() { return tpAuditReports; }
    public void setTpAuditReports(java.util.List<TpAuditReportEntity> tpAuditReports) { this.tpAuditReports = tpAuditReports; }

    public TpAuditNoticeEntity getTpAuditNotice() { return tpAuditNotice; }
    public void setTpAuditNotice(TpAuditNoticeEntity tpAuditNotice) { this.tpAuditNotice = tpAuditNotice; }

    public java.util.List<TpObjectionEntity> getTpObjections() { return tpObjections; }
    public void setTpObjections(java.util.List<TpObjectionEntity> tpObjections) { this.tpObjections = tpObjections; }

    public String getTpCurrentPhase() { return tpCurrentPhase; }
    public void setTpCurrentPhase(String tpCurrentPhase) { this.tpCurrentPhase = tpCurrentPhase; }
}
