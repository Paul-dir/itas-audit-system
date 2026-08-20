package mor.itas.api.dto.request.ap;

import jakarta.validation.constraints.NotBlank;

/**
 * ApprovalRequest - Request DTO for approving plans at Director and Regional levels
 */
public class ApprovalRequest {

    @NotBlank(message = "Approval reason is required")
    private String reason;

    // Constructors
    public ApprovalRequest() {
    }

    public ApprovalRequest(String reason) {
        this.reason = reason;
    }

    // Getters and Setters
    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    @Override
    public String toString() {
        return "ApprovalRequest{" +
                "reason='" + reason + '\'' +
                '}';
    }
}
