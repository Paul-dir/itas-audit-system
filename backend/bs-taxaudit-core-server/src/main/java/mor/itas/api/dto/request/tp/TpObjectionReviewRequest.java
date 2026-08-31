package mor.itas.api.dto.request.tp;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TpObjectionReviewRequest {
    private String reviewResult;              // ACCEPT_OBJECTION, ACCEPT_PARTIAL_OBJECTION, REJECT_OBJECTION
    private BigDecimal adjustedAssessmentAmount;
    private String reviewComments;
}
