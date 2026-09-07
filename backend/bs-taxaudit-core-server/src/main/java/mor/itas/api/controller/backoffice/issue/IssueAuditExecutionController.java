package mor.itas.api.controller.backoffice.issue;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.api.dto.request.issue.IssueAuditExecutionRequest;
import mor.itas.application.usecase.issue.IssueAuditUseCase;
import mor.itas.persistence.jpa.entity.issue.IssueAuditDetailEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public ResponseEntity<IssueAuditDetailEntity> getDetail(
            @PathVariable String caseId) {
        IssueAuditDetailEntity detail = issueAuditUseCase.getDetail(caseId);
        return ResponseEntity.ok(detail);
    }

    @PostMapping("/execute")
    public ResponseEntity<Void> executeStep(
            @PathVariable String caseId,
            @RequestBody IssueAuditExecutionRequest req,
            @RequestHeader(value = "X-Actor-Id", defaultValue = "tax-auditor") String actorId) {
        issueAuditUseCase.executeStep(caseId, req, actorId);
        return ResponseEntity.ok().build();
    }
}
