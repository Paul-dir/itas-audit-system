package mor.itas.api.dto.request.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for adding research note to case
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddResearchNoteRequest {
    
    @NotNull(message = "Category is required")
    private String category;  // OBSERVATION, QUESTION, INVESTIGATION, RECOMMENDATION
    
    @NotBlank(message = "Content is required")
    @Size(max = 10000, message = "Content must not exceed 10000 characters")
    private String content;
}
