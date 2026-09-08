package mor.itas.domain.event.ap;

import lombok.*;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class CommitteeCaseCreated extends DomainEvent {
    private String taxpayerName;
    private String taxIdNumber;

    public CommitteeCaseCreated(UUID aggregateId, String taxpayerName, String taxIdNumber) {
        super(aggregateId);
        this.taxpayerName = taxpayerName;
        this.taxIdNumber = taxIdNumber;
    }
}
