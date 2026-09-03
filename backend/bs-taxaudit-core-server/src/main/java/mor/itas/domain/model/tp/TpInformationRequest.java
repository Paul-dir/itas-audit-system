package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpInformationRequestStatus;
import mor.itas.domain.valueobject.tp.TpRequestType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpInformationRequest {
    private String requestId;
    private String caseId;
    private TpRequestType requestType;
    @Builder.Default
    private TpInformationRequestStatus status = TpInformationRequestStatus.DRAFT;
    
    private String reason;
    private String detailedDescription;
    private LocalDate dueDate;
    private String responsibleAuditorId;
    private String approvalDecisionMakerId;
    private String approvalComments;
    private LocalDateTime sentAt;
    
    private TpInterviewDetails interviewDetails;
    private TpSiteVisitDetails siteVisitDetails;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TpInterviewDetails {
        private LocalDateTime scheduledDate;
        
        @Builder.Default
        private List<String> participants = new ArrayList<>();
        
        @Builder.Default
        private List<String> topics = new ArrayList<>();
        
        private String questionList;
        private String documentedResponses;
        private String agreementsReached;
        private String disagreementsNoted;
        private String actionItems;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TpSiteVisitDetails {
        private LocalDateTime visitDate;
        private String location;
        
        @Builder.Default
        private List<String> participants = new ArrayList<>();
        
        private String observations;
        
        @Builder.Default
        private List<String> evidenceCollected = new ArrayList<>();
        
        private String auditorConclusions;
    }
}
