package mor.itas.api.dto.request.ap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCommitteeRequest {
    private String committeeName;
    private String committeeType;
    private String level;
    private String location;
    private UUID chairId;
    private Integer capacity;
}
