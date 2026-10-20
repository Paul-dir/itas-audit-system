package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpResponseCompleteness;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpTaxpayerResponse {
    private String responseId;
    private String caseId;
    private String requestId;
    private String taxpayerId;
    private LocalDateTime submissionDate;
    private TpResponseCompleteness completenessStatus;
    
    @Builder.Default
    private List<String> documentsSubmitted = new ArrayList<>();
    
    private String textualExplanation;
    private String auditorReviewComments;
    private String reviewedById;
    private LocalDateTime reviewedAt;
}
