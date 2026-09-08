package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO for committee case details
 * Includes all fields needed by frontend CommitteeCases page and CaseDetail
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommitteeCaseResponse {
    
    // Basic identifiers
    private UUID committeeCaseId;
    private UUID id;
    private String caseCode;
    
    // Taxpayer information
    private String taxpayerName;
    private String taxIdNumber;
    private String segment;
    private String businessType;
    private String industry;
    private String description;
    
    // Risk assessment
    private Integer riskScore;
    private String riskPriority;
    private String assessmentScore;
    
    // Case status
    private String status;
    private String votingStatus;  // PENDING, IN_PROGRESS, PASSED, REJECTED
    private OffsetDateTime committeeDeadline;
    private OffsetDateTime extendedDeadline;
    private Integer extensionCount;
    
    // Ownership & Team Lead
    private UUID currentOwnerId;
    private UUID teamLeadId;
    private String teamLeadName;
    private Boolean userOwnsCase;
    
    // Decision
    private String decision;
    private OffsetDateTime decisionDate;
    private String decisionReason;
    private OffsetDateTime createdDate;
    
    // Location
    private String address;
    private String city;
    private String region;
    private String taxCenter;
    
    // Financial
    private BigDecimal totalAmount;
    
    // Compliance
    private List<String> complianceIssues;
    private List<RiskIndicatorResponse> riskIndicators;
    private List<RepresentativeResponse> representatives;
    
    // Related data
    private List<ResearchNoteResponse> researchNotes;
    private VotingTallyResponse votingTally;
    private TeamAssignmentResponse teamAssignment;
}
