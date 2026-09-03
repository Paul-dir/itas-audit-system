package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpMeetingDecision;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpPlanningMeeting {
    private String meetingId;
    private String caseId;
    private LocalDateTime scheduledDate;
    
    @Builder.Default
    private List<String> authorizedParticipants = new ArrayList<>();
    
    private String meetingAgenda;
    private String riskAssessmentReviewNotes;
    private String workingHypothesisDiscussion;
    private String revenueAtRiskDiscussion;
    private String committeeMemberComments;
    private TpMeetingDecision decision;
    private LocalDateTime decisionTimestamp;
    private String recordedByUserId;
}
