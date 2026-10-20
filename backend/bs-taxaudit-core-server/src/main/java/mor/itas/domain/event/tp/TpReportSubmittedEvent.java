package mor.itas.domain.event.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpReportSubmittedEvent {
    private String caseId;
    private String reportId;
    private int version;
    private String submittedById;
    private String reviewerRole;
    private LocalDateTime timestamp;
}
