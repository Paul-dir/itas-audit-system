package mor.itas.api.dto.request.ap;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmitFeedbackRequest {
    @NotNull(message = "Adjusted count must not be null")
    private Integer tcAdjustedCount;

    private String tcJustification;
}
