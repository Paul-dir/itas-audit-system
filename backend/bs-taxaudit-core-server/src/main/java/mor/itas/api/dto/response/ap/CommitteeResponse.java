package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommitteeResponse {
    private UUID committeeId;
    private String committeeName;
    private String committeeType;
    private String level;
    private String location;
    private UUID chairId;
    private List<UUID> memberIds;
    private Integer capacity;
    private Integer currentLoad;
    private String status;
    private OffsetDateTime createdDate;
    private OffsetDateTime lastModified;

    public boolean isActive() { return "ACTIVE".equals(status); }
    public int getRemainingCapacity() { return Math.max(0, capacity - currentLoad); }
    public boolean hasCapacity() { return currentLoad < capacity; }
}
