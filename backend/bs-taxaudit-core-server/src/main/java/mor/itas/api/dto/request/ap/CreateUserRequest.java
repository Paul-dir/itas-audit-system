package mor.itas.api.dto.request.ap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserRequest {
    private String username;
    private String email;
    private String fullName;
    private String userType;
    private String auditType;
    private String assignedLevel;
    private String assignedLocation;
}
