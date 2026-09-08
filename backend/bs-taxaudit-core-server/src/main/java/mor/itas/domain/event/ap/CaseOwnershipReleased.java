package mor.itas.domain.event.ap;

import lombok.*;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CaseOwnershipReleased extends DomainEvent {
    private UUID previousOwnerId;

    public CaseOwnershipReleased(UUID aggregateId, UUID previousOwnerId) {
        super(aggregateId);
        this.previousOwnerId = previousOwnerId;
    }
}
