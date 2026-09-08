package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Response DTO for auditor profile information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditorProfileResponse {
    
    private UUID auditorId;
    private String firstName;
    private String lastName;
    private String expertise;
    private String seniority;
    private Integer yearsOfExperience;
    private String taxCenter;
    private String email;
    
    /**
     * Get full display name
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
