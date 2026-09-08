package mor.itas.domain.event.ap;

import lombok.*;
import java.util.List;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OfficialTeamAssigned extends DomainEvent {
    private List<UUID> teamMemberIds;
    private UUID teamLeadId;

    public OfficialTeamAssigned(UUID aggregateId, List<UUID> teamMemberIds, UUID teamLeadId) {
        super(aggregateId);
        this.teamMemberIds = teamMemberIds;
        this.teamLeadId = teamLeadId;
    }
}
