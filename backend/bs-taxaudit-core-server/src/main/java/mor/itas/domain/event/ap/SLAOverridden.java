package mor.itas.domain.event.ap;

import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SLAOverridden extends DomainEvent {
    private OffsetDateTime newDeadline;
    private String reason;
    private UUID approvedBy;

    public SLAOverridden(UUID aggregateId, OffsetDateTime newDeadline, String reason, UUID approvedBy) {
        super(aggregateId);
        this.newDeadline = newDeadline;
        this.reason = reason;
        this.approvedBy = approvedBy;
    }
}
