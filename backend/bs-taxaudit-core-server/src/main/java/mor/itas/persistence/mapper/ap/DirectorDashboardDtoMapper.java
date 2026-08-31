package mor.itas.persistence.mapper.ap;

import mor.itas.api.dto.response.ap.PendingPlanDto;
import mor.itas.domain.model.ap.AnnualAuditPlan;
import mor.itas.persistence.jpa.entity.ap.AnnualAuditPlanEntity;
import mor.itas.persistence.jpa.entity.ap.RegionalFeedbackEntity;
import mor.itas.persistence.jpa.repository.ap.RegionalFeedbackRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.*;

/**
 * DirectorDashboardDtoMapper - Mapper
 * 
 * Maps domain entities to DTOs for Director Dashboard responses.
 */
@Component
@RequiredArgsConstructor
public class DirectorDashboardDtoMapper {

    private final RegionalFeedbackRepository regionalFeedbackRepository;
    private final ObjectMapper objectMapper;
    
    /**
     * Map AnnualAuditPlan to PendingPlanDto for list view
     * 
     * @param plan the domain plan
     * @return the DTO
     */
    public PendingPlanDto toPendingPlanDto(AnnualAuditPlan plan) {
        if (plan == null) {
            return null;
        }
        
        // Build distribution from allocations
        // For Phase A, we'll return an empty map since full distribution
        // is in a separate detailed view
        Map<String, Map<String, Integer>> distribution = new HashMap<>();
        
        return PendingPlanDto.builder()
            .id(plan.getId().toString())
            .name(plan.getPlanName())
            .year(plan.getPlanYear())
            .status(plan.getStatus().name())
            .totalCases(100L)  // Will be calculated properly in full implementation
            .createdAt(plan.getCreatedAt())
            .createdBy(plan.getCreatedBy())
            .distribution(distribution)
            .description("")  // Will be added in full implementation
            .amendmentComment(plan.getAmendmentComment())
            .build();
    }

    /**
     * Map JPA Entity to PendingPlanDto - includes submission metadata and REAL distribution data
     * 
     * @param entity the JPA entity
     * @return the DTO
     */
    public PendingPlanDto toPendingPlanDto(AnnualAuditPlanEntity entity) {
        if (entity == null) {
            return null;
        }
        
        // ✅ GET REAL DISTRIBUTION DATA FROM ENTITY
        Map<String, Map<String, Integer>> distribution = entity.getDistribution();
        if (distribution == null) {
            distribution = new HashMap<>();
        }
        
        // Calculate total cases from distribution
        long totalCases = 0;
        if (distribution != null && !distribution.isEmpty()) {
            for (Map<String, Integer> regionMap : distribution.values()) {
                if (regionMap != null) {
                    totalCases += regionMap.values().stream().mapToLong(Long::valueOf).sum();
                }
            }
        }
        
        // ✅ BUILD REGIONAL FEEDBACK: merge submitted feedback + plan defaults
        Map<String, Object> regionalFeedback = buildRegionalFeedbackWithDefaults(entity, distribution);

        return PendingPlanDto.builder()
            .id(entity.getId().toString())
            .name(entity.getName())
            .year(entity.getYear())
            .status(entity.getStatus().name())
            .totalCases(totalCases > 0 ? totalCases : 100L)
            .createdAt(entity.getCreatedAt())
            .createdBy(entity.getCreatedBy())
            .distribution(distribution)
            .description("")
            .submittedToDirectorBy(entity.getSubmittedToDirectorBy())
            .submittedToDirectorAt(entity.getSubmittedToDirectorAt())
            .directorApprovedBy(entity.getDirectorApprovedBy())
            .directorApprovedAt(entity.getDirectorApprovedAt())
            .directorApprovalReason(entity.getDirectorApprovalReason())
            .amendmentComment(entity.getAmendmentComment())
            .regionalFeedback(regionalFeedback)
            .build();
    }

    /**
     * Build regionalFeedback map that includes:
     * - Actual submitted feedback for regions that have submitted
     * - Default plan distribution for regions that haven't submitted yet
     */
    private Map<String, Object> buildRegionalFeedbackWithDefaults(
            AnnualAuditPlanEntity entity,
            Map<String, Map<String, Integer>> distribution) {
        
        Map<String, Object> result = new HashMap<>();
        
        // All possible region codes
        List<String> allRegions = Arrays.asList("AA", "BA", "BB", "AB", "CA", "SO");
        Map<String, String> codeToId = Map.of(
            "AA", "addis_ababa", "BA", "amhara", "BB", "oromia",
            "AB", "dire_dawa", "CA", "snnpr", "SO", "somali"
        );
        
        // Get submitted feedback from database
        List<RegionalFeedbackEntity> submittedFeedback = regionalFeedbackRepository
            .findByPlanId(entity.getId());
        
        // Build a map of submitted feedback by region
        Map<String, RegionalFeedbackEntity> submittedMap = new HashMap<>();
        for (RegionalFeedbackEntity fb : submittedFeedback) {
            submittedMap.put(fb.getRegionId(), fb);
        }
        
        // For each region, use submitted data or default from distribution
        for (String regionCode : allRegions) {
            String frontendId = codeToId.getOrDefault(regionCode, regionCode);
            RegionalFeedbackEntity submitted = submittedMap.get(regionCode);
            
            if (submitted != null) {
                // Region has submitted - parse the feedback JSON
                try {
                    Map<String, Object> feedbackData = objectMapper.readValue(
                        submitted.getFeedbackText(), Map.class);
                    result.put(regionCode, Map.of(
                        "status", "submitted",
                        "feedback", feedbackData,
                        "submittedBy", submitted.getSubmittedBy(),
                        "submittedAt", submitted.getSubmittedAt().toString()
                    ));
                } catch (Exception e) {
                    result.put(regionCode, Map.of(
                        "status", "submitted",
                        "feedback", submitted.getFeedbackText()
                    ));
                }
            } else {
                // Try both backend code and frontend ID for distribution lookup
                Map<String, Integer> regionDist = distribution.get(regionCode);
                if (regionDist == null) regionDist = distribution.get(frontendId);
                if (regionDist == null) regionDist = new HashMap<>();
                
                Map<String, Object> defaultFeedback = new HashMap<>();
                for (Map.Entry<String, Integer> entry : regionDist.entrySet()) {
                    defaultFeedback.put(entry.getKey(), Map.of(
                        "totalRequested", entry.getValue(),
                        "totalCapacity", entry.getValue(),
                        "totalGap", 0,
                        "gapPercentage", 0.0
                    ));
                }
                
                result.put(regionCode, Map.of(
                    "status", "pending",
                    "feedback", defaultFeedback,
                    "isDefault", true
                ));
            }
        }
        
        return result;
    }
}
