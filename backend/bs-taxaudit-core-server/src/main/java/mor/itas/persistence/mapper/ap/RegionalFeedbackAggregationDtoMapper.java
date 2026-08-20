package mor.itas.persistence.mapper.ap;

import mor.itas.api.dto.response.ap.RegionalFeedbackAggregateDto;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * RegionalFeedbackAggregationDtoMapper - Mapper
 * 
 * Maps aggregated feedback data to DTOs for Regional Feedback workflow.
 * 
 * Mappings:
 * - Aggregated feedback map → RegionalFeedbackAggregateDto
 */
@Component
public class RegionalFeedbackAggregationDtoMapper {
    
    /**
     * Map aggregated feedback to DTO for response
     */
    @SuppressWarnings("unchecked")
    public RegionalFeedbackAggregateDto toRegionalFeedbackAggregateDto(
            String regionId,
            Map<String, Map<String, Object>> aggregatedFeedback,
            Long totalRequested,
            Long totalCapacity,
            Long totalGap,
            Double gapPercentage,
            String regionalAnalysis) {
        
        return RegionalFeedbackAggregateDto.builder()
            .regionId(regionId)
            .regionName(getRegionName(regionId))
            .aggregatedByAuditType((Map<String, Object>) (Map<String, ?>) aggregatedFeedback)
            .totalRequested(totalRequested)
            .totalCapacity(totalCapacity)
            .totalGap(totalGap)
            .gapPercentage(gapPercentage)
            .regionalAnalysis(regionalAnalysis)
            .submittedBy("REGIONAL_DIRECTOR_" + regionId)
            .submittedAt(LocalDateTime.now().toString())
            .status("SUBMITTED")
            .build();
    }
    
    /**
     * Get human-readable region name from region code
     */
    private String getRegionName(String regionId) {
        if (regionId == null) {
            return "Unknown";
        }
        
        return switch (regionId) {
            case "AA" -> "Addis Ababa";
            case "AB" -> "Oromia";
            case "BA" -> "Amhara";
            case "BB" -> "SNNP";
            case "CA" -> "Tigray";
            case "SO" -> "Somali";
            default -> "Region " + regionId;
        };
    }
}
