package mor.itas.api.dto.response.ap;

import lombok.*;

/**
 * ManagementApprovalDto - Response DTO
 * 
 * Response for Senior Management approval decision.
 * 
 * Fields:
 * - planId: The plan ID
 * - decision: APPROVE or REJECT
 * - managementComment: Decision comment
 * - message: Status message
 * - success: Operation success flag
 */
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class ManagementApprovalDto {
    
    private String planId;
    private String decision;
    private String managementComment;
    private String message;
    private Boolean success;
}
