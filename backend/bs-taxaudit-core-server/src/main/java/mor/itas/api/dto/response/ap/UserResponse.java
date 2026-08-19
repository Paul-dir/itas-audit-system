package mor.itas.api.dto.response.ap;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {
    private UUID userId;
    private String username;
    private String email;
    private String fullName;
    private String userType;
    private String auditType;
    private String assignedLevel;
    private String assignedLocation;
    private String status;
    private OffsetDateTime createdDate;
    private OffsetDateTime lastModified;

    public boolean isActive() { return "ACTIVE".equals(status); }
    public boolean isSpecialist() { return auditType != null && !auditType.isEmpty(); }
}
