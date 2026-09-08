package mor.itas.domain.event.ap;

import lombok.*;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AuditorNominated extends DomainEvent {
    private UUID auditorId;
    private UUID nominatingMemberId;
    private String justification;

    public AuditorNominated(UUID aggregateId, UUID auditorId, UUID nominatingMemberId, String justification) {
        super(aggregateId);
        this.auditorId = auditorId;
        this.nominatingMemberId = nominatingMemberId;
        this.justification = justification;
    }
}
