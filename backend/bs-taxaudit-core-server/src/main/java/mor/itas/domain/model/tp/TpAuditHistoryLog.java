package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpActionType;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpAuditHistoryLog {
    private String eventId;
    private String caseId;
    private LocalDateTime timestamp;
    private String userId;
    private String userRole;
    private TpActionType actionType;
    private String actionDescription;
    private String actionOutcome;
    private String relatedEntityType;
    private String relatedEntityId;
    private String comments;
}
