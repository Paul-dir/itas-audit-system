package mor.itas.api.controller.backoffice.issue;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.api.dto.request.issue.IssueAuditExecutionRequest;
import mor.itas.application.usecase.issue.IssueAuditUseCase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Issue Audit REST Controller
 * Base: /api/v1/backoffice/issue/cases/{caseId}
 */
@RestController
@RequestMapping("/api/v1/backoffice/issue/cases/{caseId}")
@RequiredArgsConstructor
@Slf4j
public class IssueAuditExecutionController {

    private final IssueAuditUseCase issueAuditUseCase;

    @PostMapping("/execute")
    public ResponseEntity<Void> executeStep(
            @PathVariable UUID caseId,
            @RequestBody IssueAuditExecutionRequest req,
            @RequestHeader("X-Actor-Id") String actorId) {
        issueAuditUseCase.executeStep(caseId, req, actorId);
        return ResponseEntity.ok().build();
    }
}
