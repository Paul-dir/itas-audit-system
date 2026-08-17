package mor.itas.api.dto.request.ap;

import lombok.Data;

@Data
public class CreatePlanRequest {
    private Integer planYear;
    private String planName;
}
