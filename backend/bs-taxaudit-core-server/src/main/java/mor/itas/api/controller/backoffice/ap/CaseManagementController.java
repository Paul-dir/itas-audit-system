package mor.itas.api.controller.backoffice.ap;

import mor.itas.domain.model.ap.AuditCase;
import mor.itas.application.port.inboundport.ap.CaseManagementPort;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

/**
 * Case Management REST Controller
 * 
 * REST Adapter for Case Management use cases.
 * Depends on inbound ports (CaseManagementPort), not directly on use cases.
 * This is the driving adapter - converts HTTP to domain operations.
 * 
 * Hexagonal/DDD: REST Controller is an adapter that uses inbound ports
 */
@RestController
@RequestMapping("/api/v1/backoffice/ap/cases")
@RequiredArgsConstructor
public class CaseManagementController {

    private final CaseManagementPort caseManagementPort;

    // ==================== CASE QUERIES ====================

    /**
     * 6.4 Get case by ID
     */
    @GetMapping("/{caseId}")
    public ResponseEntity<AuditCase> getCaseById(@PathVariable UUID caseId) {
        AuditCase auditCase = caseManagementPort.getCaseById(caseId);
        return ResponseEntity.ok(auditCase);
    }

    /**
     * 7.5 Get cases for tax center
     */
    @GetMapping
    public ResponseEntity<GetCasesResponse> getCases(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String assignedAuditor,
            @RequestParam(required = false) String assignedTeamLeader) {
        
        List<AuditCase> cases;
        
        if (status != null) {
            cases = caseManagementPort.getCasesByStatus(status);
        } else if (assignedAuditor != null) {
            cases = caseManagementPort.getCasesForAuditor(assignedAuditor);
        } else if (assignedTeamLeader != null) {
            cases = caseManagementPort.getCasesForTeamLeader(assignedTeamLeader);
        } else {
            throw new IllegalArgumentException("Must provide at least one filter: status, assignedAuditor, or assignedTeamLeader");
        }
        
        return ResponseEntity.ok(new GetCasesResponse(cases.size(), cases));
    }

    // ==================== CASE ASSIGNMENT ====================

    /**
     * 6.2 Assign case to team leader
     * Status: PENDING_ASSIGNMENT → ASSIGNED
     */
    @PostMapping("/{caseId}/assign-team-leader")
    public ResponseEntity<AuditCase> assignCaseToTeamLeader(
            @PathVariable UUID caseId,
            @RequestBody AssignTeamLeaderRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AuditCase auditCase = caseManagementPort.assignCaseToTeamLeader(caseId, request.getTeamLeaderId());
        return ResponseEntity.ok(auditCase);
    }

    /**
     * 6.3 Assign case to auditor
     * Status: ASSIGNED → IN_PROGRESS
     */
    @PostMapping("/{caseId}/assign-auditor")
    public ResponseEntity<AuditCase> assignCaseToAuditor(
            @PathVariable UUID caseId,
            @RequestBody AssignAuditorRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AuditCase auditCase = caseManagementPort.assignCaseToAuditor(caseId, request.getAuditorId());
        return ResponseEntity.ok(auditCase);
    }

    // ==================== CASE STATUS UPDATES ====================

    /**
     * 6.4 Update case status as work progresses
     */
    @PatchMapping("/{caseId}/status")
    public ResponseEntity<AuditCase> updateCaseStatus(
            @PathVariable UUID caseId,
            @RequestBody UpdateCaseStatusRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        AuditCase auditCase = caseManagementPort.updateCaseStatus(caseId, request.getStatus());
        return ResponseEntity.ok(auditCase);
    }

    // ==================== REQUEST/RESPONSE DTOs ====================

    @Data
    static class AssignTeamLeaderRequest {
        private String teamLeaderId;
    }

    @Data
    static class AssignAuditorRequest {
        private String auditorId;
    }

    @Data
    static class UpdateCaseStatusRequest {
        private String status;
    }

    @Data
    static class GetCasesResponse {
        private int count;
        private Object cases;

        public GetCasesResponse(int count, Object cases) {
            this.count = count;
            this.cases = cases;
        }
    }
}
