package mor.itas.domain.event.ap;

import lombok.*;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TeamLeadAppointed extends DomainEvent {
    private UUID teamLeadId;
    private String reason;

    public TeamLeadAppointed(UUID aggregateId, UUID teamLeadId, String reason) {
        super(aggregateId);
        this.teamLeadId = teamLeadId;
        this.reason = reason;
    }
}
