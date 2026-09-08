package mor.itas.api.dto.response.ap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * TeamLeaderPlanReviewDto - Response DTO for Team Leader Plan Review
 * 
 * Represents an audit plan submitted by an auditor that requires team lead review.
 * Provides rich context including auditor info, case details, and plan content.
 * 
 * Fields:
 * - planId: Unique plan identifier
 * - caseId: Related audit case ID
 * - caseCode: Human-readable case identifier
 * - auditorId: ID of the auditor who submitted the plan
 * - auditorName: Name of the auditor
 * - taxpayerId: ID of taxpayer being audited
 * - taxpayerName: Name of taxpayer
 * - taxIdentificationNumber: TIN
 * - segment: Audit segment (LTO, MTO, STO, etc.)
 * - scope: Plan scope
 * - objectives: Audit objectives
 * - methodology: Methodology to be used
 * - timeline: Proposed timeline
 * - resourcePlan: Resource allocation
 * - status: Current status (SUBMITTED, APPROVED, REJECTED, REVISION_REQUESTED)
 * - submittedAt: When auditor submitted plan
 * - daysWaiting: Days since submission (for SLA tracking)
 * - reviewedBy: Team lead who reviewed (null if pending)
 * - reviewTimestamp: When reviewed
 * - reviewComments: Reason for decision/revision request
 * - riskPriority: Taxpayer risk level (HIGH, MEDIUM, LOW)
 * - riskScore: Risk score (0-100)
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeamLeaderPlanReviewDto {
    
    // Plan Identification
    private UUID planId;
    private UUID caseId;
    private String caseCode;
    
    // Auditor Information
    private String auditorId;
    private String auditorName;
    
    // Taxpayer Information
    private String taxpayerId;
    private String taxpayerName;
    private String taxIdentificationNumber;
    private String segment;
    
    // Plan Content
    private String scope;
    private String objectives;
    private String methodology;
    private String timeline;
    private String resourcePlan;
    
    // Status Information
    private String status;              // SUBMITTED, APPROVED, REJECTED, REVISION_REQUESTED
    private OffsetDateTime submittedAt; // When auditor submitted
    private Integer daysWaiting;        // Days since submission
    
    // Review Information
    private String reviewedBy;          // Team lead ID who reviewed
    private OffsetDateTime reviewTimestamp;  // When reviewed
    private String reviewComments;      // Decision reason
    
    // Risk Context
    private String riskPriority;        // HIGH, MEDIUM, LOW
    private Integer riskScore;          // 0-100
}
