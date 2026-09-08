package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Response DTO for auditor nomination
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditorNominationResponse {
    
    private UUID nominationId;
    private UUID auditorId;
    private String auditorName;
    private String justification;
    private UUID nominatingMemberId;
    private OffsetDateTime nominatedAt;
    private String role;
    private Boolean selected;
}
