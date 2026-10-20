package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpStructuredDiscussion {
    private String discussionId;
    private String caseId;
    private LocalDateTime discussionDate;
    
    @Builder.Default
    private List<String> auditorParticipants = new ArrayList<>();
    
    @Builder.Default
    private List<String> taxpayerParticipants = new ArrayList<>();
    
    @Builder.Default
    private List<String> topics = new ArrayList<>();
    
    private String questionsRaised;
    private String answersProvided;
    private String agreementsReached;
    private String areasOfDisagreement;
    private String actionItemsAgreed;
    private String followUpRequirements;
    
    @Builder.Default
    private List<String> supportingDocumentsExchanged = new ArrayList<>();
}
