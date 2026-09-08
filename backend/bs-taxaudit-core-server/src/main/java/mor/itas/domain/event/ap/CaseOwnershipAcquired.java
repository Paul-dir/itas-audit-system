package mor.itas.domain.event.ap;

import lombok.*;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CaseOwnershipAcquired extends DomainEvent {
    private UUID memberId;

    public CaseOwnershipAcquired(UUID aggregateId, UUID memberId) {
        super(aggregateId);
        this.memberId = memberId;
    }
}
