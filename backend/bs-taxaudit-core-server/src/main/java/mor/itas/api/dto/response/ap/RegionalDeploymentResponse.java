package mor.itas.api.dto.response.ap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * RegionalDeploymentResponse - Response DTO for Regional Deployment
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegionalDeploymentResponse {
    
    private UUID id;
    private String regionId;
    private String deployedBy;
    private OffsetDateTime deployedAt;
    private String status;
}
