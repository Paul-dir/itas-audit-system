package mor.itas.persistence.jpa.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.util.HashMap;
import java.util.Map;

/**
 * DistributionConverter - Converts JSONB distribution column to/from Map
 * Handles serialization of: Map<String, Map<String, Integer>>
 * Example: {"addis_ababa": {"desk_audit": 50, "comprehensive": 50}}
 */
@Converter(autoApply = true)
public class DistributionConverter implements AttributeConverter<Map<String, Map<String, Integer>>, String> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(Map<String, Map<String, Integer>> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (Exception e) {
            System.err.println("❌ Error converting distribution to JSON: " + e.getMessage());
            return null;
        }
    }

    @Override
    public Map<String, Map<String, Integer>> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return new HashMap<>();
        }
        try {
            return objectMapper.readValue(dbData, new TypeReference<Map<String, Map<String, Integer>>>() {});
        } catch (Exception e) {
            System.err.println("❌ Error deserializing distribution: " + e.getMessage());
            return new HashMap<>();
        }
    }
}
