package mor.itas.api.dto.request.ap;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * SubmitTaxCenterFeedbackRequest - Request DTO for Tax Center Manager providing feedback
 */
public class SubmitTaxCenterFeedbackRequest {

    @NotNull(message = "Adjusted count is required")
    @Positive(message = "Adjusted count must be positive")
    private Integer adjustedCount;

    @NotBlank(message = "Justification is required")
    private String justification;

    // Constructors
    public SubmitTaxCenterFeedbackRequest() {
    }

    public SubmitTaxCenterFeedbackRequest(Integer adjustedCount, String justification) {
        this.adjustedCount = adjustedCount;
        this.justification = justification;
    }

    // Getters and Setters
    public Integer getAdjustedCount() {
        return adjustedCount;
    }

    public void setAdjustedCount(Integer adjustedCount) {
        this.adjustedCount = adjustedCount;
    }

    public String getJustification() {
        return justification;
    }

    public void setJustification(String justification) {
        this.justification = justification;
    }

    @Override
    public String toString() {
        return "SubmitTaxCenterFeedbackRequest{" +
                "adjustedCount=" + adjustedCount +
                ", justification='" + justification + '\'' +
                '}';
    }
}
