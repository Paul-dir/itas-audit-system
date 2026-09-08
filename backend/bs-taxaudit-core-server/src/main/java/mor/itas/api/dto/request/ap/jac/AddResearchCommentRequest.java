package mor.itas.api.dto.request.ap.jac;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

/**
 * Request DTO for adding comment to research note
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddResearchCommentRequest {
    
    @NotBlank(message = "Comment content is required")
    @Size(max = 5000, message = "Comment must not exceed 5000 characters")
    private String content;
    
    private UUID repliedToCommentId;  // Optional, for threading
}
