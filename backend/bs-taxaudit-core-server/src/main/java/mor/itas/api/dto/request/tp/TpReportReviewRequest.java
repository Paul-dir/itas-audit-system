package mor.itas.api.dto.request.tp;

import lombok.Data;

@Data
public class TpReportReviewRequest {
    private String decision;   // APPROVE, REQUEST_REVISIONS, REJECT
    private String comments;
}
