package mor.itas.persistence.mapper.ap;

import mor.itas.api.dto.response.ap.AmendmentFeedbackDetailDto;
import mor.itas.api.dto.response.ap.AmendedPlanDto;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * PlanAmendmentDtoMapper - Mapper
 * 
 * Maps amendment data to DTOs for Amendment Workflow.
 * 
 * Mappings:
 * - Amendment feedback map → AmendmentFeedbackDetailDto
 * - Amended plan data → AmendedPlanDto
 */
@Component
public class PlanAmendmentDtoMapper {
    
    /**
     * Map amendment feedback to DTO
     */
    public AmendmentFeedbackDetailDto toAmendmentFeedbackDetailDto(
            Map<String, Object> feedbackData) {
        
        return AmendmentFeedbackDetailDto.builder()
            .planId((String) feedbackData.get("planId"))
            .amendmentRound((Integer) feedbackData.get("amendmentRound"))
            .directorMessage((String) feedbackData.get("directorMessage"))
            .directorComment((String) feedbackData.get("directorComment"))
            .regionalFeedback((Map<String, Object>) feedbackData.get("regionalFeedback"))
            .requestedChanges((Map<String, Object>) feedbackData.get("requestedChanges"))
            .build();
    }
    
    /**
     * Map amended plan data to DTO
     */
    public AmendedPlanDto toAmendedPlanDto(
            String planId,
            Integer amendmentRound,
            Map<String, Map<String, Integer>> plannedChanges,
            Map<String, Object> changeSummary,
            String planningTeamComments,
            String submittedBy) {
        
        return AmendedPlanDto.builder()
            .planId(planId)
            .amendmentRound(amendmentRound)
            .plannedChanges(plannedChanges)
            .changeSummary(changeSummary)
            .planningTeamComments(planningTeamComments)
            .submittedBy(submittedBy)
            .submittedAt(java.time.LocalDateTime.now().toString())
            .status("SUBMITTED_TO_DIRECTOR")
            .build();
    }
}
