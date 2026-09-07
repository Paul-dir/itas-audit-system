package mor.itas.api.controller.backoffice.workflow;

import lombok.*;
import mor.itas.infrastructure.security.ItasPrincipal;
import mor.itas.persistence.jpa.entity.workflow.WorkflowTaskEntity;
import mor.itas.persistence.jpa.repository.workflow.WorkflowTaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;
import java.util.LinkedHashSet;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Workflow Task Inbox API.
 * GET  /api/v1/tasks/my-tasks          — pending tasks for the authenticated user
 * GET  /api/v1/tasks/{taskId}          — single task detail
 * POST /api/v1/tasks/{taskId}/approve  — approve with optional comments
 * POST /api/v1/tasks/{taskId}/return   — return with mandatory return_reason
 * POST /api/v1/tasks/{taskId}/reject   — reject with mandatory comments
 */
@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class WorkflowTaskController {

    private final WorkflowTaskRepository taskRepository;
    private final mor.itas.persistence.jpa.repository.identity.UserRepository userRepository;

    private ItasPrincipal resolvePrincipal(String actorHeader, ItasPrincipal principal) {
        if (principal != null) return principal;
        if (actorHeader == null || actorHeader.isBlank()) return null;

        String raw = actorHeader.trim();
        mor.itas.persistence.jpa.entity.identity.UserEntity user = null;
        try {
            UUID uId = UUID.fromString(raw);
            user = userRepository.findById(uId).orElse(null);
        } catch (Exception ignored) {}

        if (user == null) {
            user = userRepository.findByUsername(raw).orElse(null);
        }
        if (user == null) {
            user = userRepository.findByEmail(raw).orElse(null);
        }

        String userId = user != null ? user.getId().toString() : raw;
        String username = user != null ? user.getUsername() : raw;
        String fullName = user != null ? user.getFullName() : raw;
        String orgUnit = user != null && user.getOrgUnitId() != null ? user.getOrgUnitId().toString() : "";

        List<org.springframework.security.core.GrantedAuthority> authorities = new java.util.ArrayList<>();
        if (user != null && user.getRoles() != null) {
            for (var r : user.getRoles()) {
                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + r.getCode()));
            }
        } else {
            // Derive role heuristically if not in DB
            String lower = raw.toLowerCase();
            if (lower.startsWith("u-tl-") || lower.contains("teamleader")) authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_TEAM_LEADER"));
            else if (lower.startsWith("u-aud-") || lower.contains("auditor")) authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_AUDITOR"));
            else if (lower.startsWith("u-com-") || lower.contains("committee")) authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_REVIEW_COMMITTEE"));
            else if (lower.startsWith("u-ad-") || lower.contains("director")) authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_DIRECTOR"));
            else if (lower.startsWith("u-pt-") || lower.contains("planning")) authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_PLANNING_TEAM"));
            else if (lower.startsWith("u-tcm-") || lower.contains("taxcenter")) authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_TAX_CENTER_MANAGER"));
        }

        return new ItasPrincipal(userId, username, "", fullName, orgUnit, authorities);
    }

    private Set<String> resolveUserIds(ItasPrincipal principal, String actorHeader) {
        Set<String> set = new LinkedHashSet<>();
        if (principal != null) {
            if (principal.getUserId() != null) set.add(principal.getUserId());
            if (principal.getUsername() != null) set.add(principal.getUsername());
        }
        if (actorHeader != null && !actorHeader.isBlank()) {
            set.add(actorHeader.trim());
            set.add(actorHeader.trim().toLowerCase());
        }
        return set;
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<List<TaskResponse>> getMyTasks(
            @RequestHeader(value = "X-Actor-Id", required = false) String actorHeader,
            @AuthenticationPrincipal ItasPrincipal principal) {

        ItasPrincipal actor = resolvePrincipal(actorHeader, principal);
        if (actor == null) {
            return ResponseEntity.ok(List.of());
        }

        List<String> roles = actor.getAuthorities().stream()
            .filter(a -> a.getAuthority().startsWith("ROLE_"))
            .map(a -> a.getAuthority().substring(5))
            .collect(Collectors.toList());

        Set<String> userIds = resolveUserIds(actor, actorHeader);

        List<TaskResponse> tasks = taskRepository
            .findPendingTasksForUser(userIds, roles)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getTask(
            @PathVariable UUID taskId,
            @RequestHeader(value = "X-Actor-Id", required = false) String actorHeader,
            @AuthenticationPrincipal ItasPrincipal principal) {

        ItasPrincipal actor = resolvePrincipal(actorHeader, principal);
        if (actor == null) return ResponseEntity.status(401).build();

        return taskRepository.findById(taskId)
            .map(t -> {
                if (!canAct(t, actor)) return ResponseEntity.status(403).<TaskResponse>build();
                return ResponseEntity.ok(toResponse(t));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{taskId}/approve")
    public ResponseEntity<Void> approve(
            @PathVariable UUID taskId,
            @RequestBody(required = false) TaskDecisionRequest body,
            @RequestHeader(value = "X-Actor-Id", required = false) String actorHeader,
            @AuthenticationPrincipal ItasPrincipal principal) {

        ItasPrincipal actor = resolvePrincipal(actorHeader, principal);
        if (actor == null) return ResponseEntity.status(401).build();
        return resolveTask(taskId, "APPROVED", body != null ? body.getComments() : null, null, actor);
    }

    @PostMapping("/{taskId}/return")
    public ResponseEntity<Void> returnTask(
            @PathVariable UUID taskId,
            @RequestBody TaskDecisionRequest body,
            @RequestHeader(value = "X-Actor-Id", required = false) String actorHeader,
            @AuthenticationPrincipal ItasPrincipal principal) {

        ItasPrincipal actor = resolvePrincipal(actorHeader, principal);
        if (actor == null) return ResponseEntity.status(401).build();
        if (body.getReturnReason() == null || body.getReturnReason().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return resolveTask(taskId, "RETURNED", body.getComments(), body.getReturnReason(), actor);
    }

    @PostMapping("/{taskId}/reject")
    public ResponseEntity<Void> reject(
            @PathVariable UUID taskId,
            @RequestBody TaskDecisionRequest body,
            @RequestHeader(value = "X-Actor-Id", required = false) String actorHeader,
            @AuthenticationPrincipal ItasPrincipal principal) {

        ItasPrincipal actor = resolvePrincipal(actorHeader, principal);
        if (actor == null) return ResponseEntity.status(401).build();
        if (body.getComments() == null || body.getComments().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return resolveTask(taskId, "REJECTED", body.getComments(), null, actor);
    }

    // ── Internals ─────────────────────────────────────────────────────────────

    private ResponseEntity<Void> resolveTask(UUID taskId, String decision,
            String comments, String returnReason, ItasPrincipal principal) {

        return taskRepository.findById(taskId).map(task -> {
            if (!canAct(task, principal)) return ResponseEntity.status(403).<Void>build();
            if (!"PENDING".equals(task.getStatus())) return ResponseEntity.badRequest().<Void>build();

            task.setStatus("COMPLETED");
            task.setDecision(decision);
            task.setComments(comments);
            task.setReturnReason(returnReason);
            task.setCompletedBy(principal.getUserId());
            task.setCompletedAt(OffsetDateTime.now());
            taskRepository.save(task);

            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private boolean canAct(WorkflowTaskEntity task, ItasPrincipal principal) {
        if (principal.getUserId().equals(task.getAssignedToUserId())) return true;
        return principal.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_" + task.getAssignedToRole())
                        || a.getAuthority().equals("ROLE_SYSTEM_ADMIN"));
    }

    private TaskResponse toResponse(WorkflowTaskEntity t) {
        return TaskResponse.builder()
            .id(t.getId().toString())
            .caseId(t.getCaseId().toString())
            .artifactId(t.getArtifactId().toString())
            .artifactType(t.getArtifactType())
            .taskTitle(t.getTaskTitle())
            .taskDescription(t.getTaskDescription())
            .assignedToRole(t.getAssignedToRole())
            .assignedToUserId(t.getAssignedToUserId())
            .status(t.getStatus())
            .priority(t.getPriority())
            .dueAt(t.getDueAt())
            .createdAt(t.getCreatedAt())
            .build();
    }

    // ── DTOs ─────────────────────────────────────────────────────────────────

    @Data @Builder
    public static class TaskResponse {
        private String id;
        private String caseId;
        private String artifactId;
        private String artifactType;
        private String taskTitle;
        private String taskDescription;
        private String assignedToRole;
        private String assignedToUserId;
        private String status;
        private String priority;
        private OffsetDateTime dueAt;
        private OffsetDateTime createdAt;
    }

    @Data
    public static class TaskDecisionRequest {
        private String comments;
        private String returnReason;
    }
}
