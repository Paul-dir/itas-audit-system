package mor.itas.api.dto.request.ap.jac;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

/**
 * Request DTO for chairperson to create committee session
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCommitteeSessionRequest {
    
    @NotBlank(message = "Session name is required")
    private String sessionName;
    
    private String agenda;
    
    @JsonDeserialize(using = FlexibleLocalDateTimeDeserializer.class)
    private LocalDateTime scheduledDate;
    
    private String location;

    private UUID caseId;

    public static class FlexibleLocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {
        @Override
        public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            String text = p.getText();
            if (text == null || text.trim().isEmpty()) {
                return null;
            }
            text = text.trim();
            try {
                return LocalDateTime.parse(text);
            } catch (Exception e1) {
                try {
                    return OffsetDateTime.parse(text).toLocalDateTime();
                } catch (Exception e2) {
                    try {
                        return Instant.parse(text).atZone(ZoneOffset.UTC).toLocalDateTime();
                    } catch (Exception e3) {
                        try {
                            return LocalDate.parse(text).atStartOfDay();
                        } catch (Exception e4) {
                            throw new IOException("Cannot parse scheduledDate: " + text);
                        }
                    }
                }
            }
        }
    }
}
