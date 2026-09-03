package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpObjectionReviewResult;
import mor.itas.domain.valueobject.tp.TpObjectionStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpObjection {
    private String objectionId;
    private String caseId;
    private String noticeId;
    private String taxpayerId;
    private LocalDateTime objectionDate;
    
    @Builder.Default
    private TpObjectionStatus status = TpObjectionStatus.SUBMITTED;
    
    private String noticeProvisionReferenced;
    private String factualExplanation;
    private String legalArguments;
    
    @Builder.Default
    private List<String> supportingEvidenceRefs = new ArrayList<>();
    
    private String disputedTpAnalysisSections;
    
    // Review Workflow
    private String reviewerId;
    private LocalDateTime reviewedAt;
    private String reviewerEvaluation;
    private TpObjectionReviewResult reviewResult;
    private BigDecimal adjustedAssessmentAmount;
    private String reviewComments;
}
