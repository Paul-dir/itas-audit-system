package mor.itas.domain.event.ap;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Base class for all domain events in the Joint Audit Committee module
 */
@Getter
@AllArgsConstructor
public abstract class DomainEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    private UUID aggregateId;
    private OffsetDateTime occurredAt;
    private String actor;

    // No-arg constructor for Lombok/serialization
    public DomainEvent() {
        this(UUID.randomUUID());
    }

    public DomainEvent(UUID aggregateId) {
        this.aggregateId = aggregateId;
        this.occurredAt = OffsetDateTime.now();
        this.actor = null;
    }

    public DomainEvent(UUID aggregateId, String actor) {
        this.aggregateId = aggregateId;
        this.occurredAt = OffsetDateTime.now();
        this.actor = actor;
    }
}
