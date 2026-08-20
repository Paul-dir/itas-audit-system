package mor.itas.persistence.mapper.ap;

import mor.itas.api.dto.response.ap.TaxCenterAllocationDto;
import mor.itas.api.dto.response.ap.TaxCenterFeedbackDto;
import mor.itas.domain.model.ap.RegionalAllocationDetail;
import mor.itas.domain.model.ap.TaxCenterFeedback;
import org.springframework.stereotype.Component;

/**
 * TaxCenterFeedbackDtoMapper - Mapper
 * 
 * Maps domain models to DTOs for Tax Center Feedback workflow.
 * 
 * Mappings:
 * - RegionalAllocationDetail → TaxCenterAllocationDto
 * - TaxCenterFeedback → TaxCenterFeedbackDto
 */
@Component
public class TaxCenterFeedbackDtoMapper {
    
    /**
     * Map domain allocation to allocation DTO for tax center view
     */
    public TaxCenterAllocationDto toTaxCenterAllocationDto(RegionalAllocationDetail detail) {
        if (detail == null) {
            return null;
        }
        
        return TaxCenterAllocationDto.builder()
            .regionId(detail.getRegionId())
            .regionName(getRegionName(detail.getRegionId()))
            .allocationByAuditType(detail.getAllocationByAuditType())
            .totalAllocation(detail.getTotalAllocated())
            .status(detail.getStatus())
            .build();
    }
    
    /**
     * Map domain feedback to feedback DTO for response
     */
    public TaxCenterFeedbackDto toTaxCenterFeedbackDto(TaxCenterFeedback feedback) {
        if (feedback == null) {
            return null;
        }
        
        return TaxCenterFeedbackDto.builder()
            .taxCenterId(feedback.getTaxCenterId())
            .regionId(feedback.getRegionId())
            .auditTypeId(feedback.getAuditTypeId())
            .requestedCount(feedback.getRequestedCount())
            .acceptedCount(feedback.getAcceptedCount())
            .delta(feedback.calculateDelta())
            .gapPercentage(feedback.getGapPercentage())
            .justification(feedback.getJustification())
            .feedbackDetails(feedback.getFeedbackDetails())
            .submittedBy(feedback.getSubmittedBy())
            .submittedAt(feedback.getSubmittedAt())
            .status(feedback.getStatus())
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
