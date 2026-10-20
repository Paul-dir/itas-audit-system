package mor.itas.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private String error;  // Error code like MISSING_FIELD, INVALID_CASE_STATE, etc.
    private String message;
    private String field;  // For field-specific validation errors
    private String currentStatus;  // For state-related errors
    private String teamLeaderId;  // For team-related errors
    private String auditorId;  // For auditor-related errors
}
