package mor.itas.domain.event.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpAuditPhase;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpPhaseTransitionEvent {
    private String caseId;
    private TpAuditPhase previousPhase;
    private TpAuditPhase newPhase;
    private String triggeredById;
    private LocalDateTime timestamp;
}
