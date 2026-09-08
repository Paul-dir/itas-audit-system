package mor.itas.domain.event.ap;

import lombok.*;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ResearchNoteAdded extends DomainEvent {
    private UUID noteId;
    private String category;
    private UUID authorId;

    public ResearchNoteAdded(UUID aggregateId, UUID noteId, String category, UUID authorId) {
        super(aggregateId);
        this.noteId = noteId;
        this.category = category;
        this.authorId = authorId;
    }
}
