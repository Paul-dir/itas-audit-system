package mor.itas.domain.event.ap;

import lombok.*;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ViabilityFinalized extends DomainEvent {
    private String decision;
    private String reason;
    private UUID chairpersonId;

    public ViabilityFinalized(UUID aggregateId, String decision, String reason, UUID chairpersonId) {
        super(aggregateId);
        this.decision = decision;
        this.reason = reason;
        this.chairpersonId = chairpersonId;
    }
}
