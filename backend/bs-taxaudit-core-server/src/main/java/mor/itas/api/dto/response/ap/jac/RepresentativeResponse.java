package mor.itas.api.dto.response.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for authorized representatives of a taxpayer
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepresentativeResponse {
    
    private String name;
    private String title;
    private String phone;
    private String email;
}
