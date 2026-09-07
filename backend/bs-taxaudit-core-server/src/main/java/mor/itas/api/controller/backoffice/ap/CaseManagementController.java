package mor.itas.api.controller.backoffice.ap;

import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import mor.itas.application.usecase.workflow.WorkflowExecutionEngine;
import mor.itas.infrastructure.security.ItasPrincipal;
import mor.itas.api.dto.response.ap.GenericResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * CaseManagementController — REST adapter for the full audit-case lifecycle.
 */
@RestController
@RequestMapping("/api/v1/backoffice/ap/cases")
@RequiredArgsConstructor
public class CaseManagementController {

    private final ApAuditCaseRepository caseRepository;
    private final WorkflowExecutionEngine workflowExecutionEngine;
    private final mor.itas.infrastructure.security.OrgScopeAuthorizationService orgScopeAuthorizationService;
    private final mor.itas.application.usecase.ap.UserManagementUseCase userManagementUseCase;
    private final mor.itas.application.service.notification.NotificationService notificationService;

    // ─────────────────────────────────────────────────────────────────────────
    // QUERIES
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Flexible case listing with multiple optional filters.
     * At least one filter must be provided.
     */
    @GetMapping
    public ResponseEntity<GenericResponse<List<Map<String, Object>>>> getCases(
            @RequestParam(required = false) String taxCenter,
            @RequestParam(required = false) String teamLeader,
            @RequestParam(required = false) String committeeId,
            @RequestParam(required = false) String auditor,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String auditType,
            @RequestParam(required = false) Integer planYear,
            @RequestParam(required = false) Integer year) {

        try {
            List<ApAuditCaseEntity> cases;

            if (taxCenter != null && !taxCenter.isBlank()) {
                // ── Tax center view strictly scoped to this Tax Center's variants ──
                List<String> tcVariants = getTaxCenterVariants(taxCenter);
                List<ApAuditCaseEntity> found = new ArrayList<>();
                for (String v : tcVariants) {
                    if (status != null && !status.isBlank()) {
                        found.addAll(caseRepository.findByTaxCenterCodeAndStatus(v, status));
                    } else {
                        found.addAll(caseRepository.findByTaxCenterCode(v));
                    }
                }
                // Deduplicate by case ID preserving order
                Map<UUID, ApAuditCaseEntity> dedup = new LinkedHashMap<>();
                for (ApAuditCaseEntity c : found) {
                    dedup.putIfAbsent(c.getId(), c);
                }
                cases = new ArrayList<>(dedup.values());
            } else if (teamLeader != null && !teamLeader.isBlank()) {
                // ── Team leader view ─────────────────────────────────────────
                cases = new ArrayList<>(caseRepository.findByAssignedTeamLeaderId(teamLeader));

                // If no results or to be thorough, attempt canonical resolution
                String canonicalTL = resolveTeamLeaderCanonicalId(teamLeader);
                if (canonicalTL != null && !canonicalTL.equalsIgnoreCase(teamLeader)) {
                    List<ApAuditCaseEntity> extra = caseRepository.findByAssignedTeamLeaderId(canonicalTL);
                    for (ApAuditCaseEntity c : extra) {
                        boolean exists = false;
                        for (ApAuditCaseEntity ex : cases) {
                            if (ex.getId().equals(c.getId())) { exists = true; break; }
                        }
                        if (!exists) cases.add(c);
                    }
                }

                // Also check if teamLeader matches User's UUID / username from UserManagementUseCase
                if (userManagementUseCase != null) {
                    try {
                        List<mor.itas.domain.model.ap.User> allUsers = userManagementUseCase.getAllUsers();
                        for (mor.itas.domain.model.ap.User u : allUsers) {
                            boolean matches = (u.getUsername() != null && u.getUsername().equalsIgnoreCase(teamLeader))
                                           || (u.getUserId() != null && u.getUserId().toString().equalsIgnoreCase(teamLeader))
                                           || (u.getEmail() != null && u.getEmail().equalsIgnoreCase(teamLeader));
                            if (matches) {
                                if (u.getUserId() != null) {
                                    for (ApAuditCaseEntity c : caseRepository.findByAssignedTeamLeaderId(u.getUserId().toString())) {
                                        boolean exists = false;
                                        for (ApAuditCaseEntity ex : cases) {
                                            if (ex.getId().equals(c.getId())) { exists = true; break; }
                                        }
                                        if (!exists) cases.add(c);
                                    }
                                }
                                if (u.getUsername() != null) {
                                    for (ApAuditCaseEntity c : caseRepository.findByAssignedTeamLeaderId(u.getUsername())) {
                                        boolean exists = false;
                                        for (ApAuditCaseEntity ex : cases) {
                                            if (ex.getId().equals(c.getId())) { exists = true; break; }
                                        }
                                        if (!exists) cases.add(c);
                                    }
                                }
                            }
                        }
                    } catch (Exception ignored) {}
                }

                // If still no results by direct UUID/username, search by taxCenter and match assignedTeamLeaderId
                if (cases.isEmpty()) {
                    String resolvedTC = resolveTaxCenterFromUserContext(teamLeader, taxCenter);
                    if (resolvedTC != null) {
                        cases = caseRepository.findByTaxCenterCode(resolvedTC)
                                .stream()
                                .filter(c -> teamLeader.equalsIgnoreCase(c.getAssignedTeamLeaderId())
                                          && !ApAuditCaseEntity.STATUS_PENDING_ASSIGNMENT.equals(c.getStatus()))
                                .collect(Collectors.toList());
                    }
                }

            } else if (committeeId != null && !committeeId.isBlank()) {
                // ── Committee member view (strictly separated by auditType) ──
                String resolvedTC = resolveTaxCenterFromUserContext(committeeId, taxCenter);
                final String requestedType = auditType != null && !auditType.isBlank() ? auditType.toUpperCase() : null;

                if (resolvedTC != null) {
                    cases = caseRepository.findByTaxCenterCode(resolvedTC)
                            .stream()
                            .filter(c -> ApAuditCaseEntity.STATUS_ASSIGNED_TO_COMMITTEE.equals(c.getStatus())
                                      || "JOINT_AUDIT".equals(c.getAuditType())
                                      || "TRANSFER_PRICING".equals(c.getAuditType()))
                            .filter(c -> requestedType == null || requestedType.equals(c.getAuditType()))
                            .collect(Collectors.toList());
                } else {
                    cases = caseRepository.findAll()
                            .stream()
                            .filter(c -> ApAuditCaseEntity.STATUS_ASSIGNED_TO_COMMITTEE.equals(c.getStatus())
                                      || "JOINT_AUDIT".equals(c.getAuditType())
                                      || "TRANSFER_PRICING".equals(c.getAuditType()))
                            .filter(c -> requestedType == null || requestedType.equals(c.getAuditType()))
                            .collect(Collectors.toList());
                }

            } else if (auditor != null && !auditor.isBlank()) {
                // ── Auditor view ─────────────────────────────────────────────
                cases = new ArrayList<>(caseRepository.findByAssignedAuditorId(auditor));

                // Resolve auditor identifier (email, alias, UUID, username)
                String canonicalAuditor = resolveAuditorCanonicalId(auditor);
                if (canonicalAuditor != null && !canonicalAuditor.equalsIgnoreCase(auditor)) {
                    for (ApAuditCaseEntity c : caseRepository.findByAssignedAuditorId(canonicalAuditor)) {
                        boolean exists = false;
                        for (ApAuditCaseEntity ex : cases) {
                            if (ex.getId().equals(c.getId())) { exists = true; break; }
                        }
                        if (!exists) cases.add(c);
                    }
                }

                if (userManagementUseCase != null) {
                    try {
                        List<mor.itas.domain.model.ap.User> allUsers = userManagementUseCase.getAllUsers();
                        for (mor.itas.domain.model.ap.User u : allUsers) {
                            boolean matches = (u.getUsername() != null && u.getUsername().equalsIgnoreCase(auditor))
                                           || (u.getUserId() != null && u.getUserId().toString().equalsIgnoreCase(auditor))
                                           || (u.getEmail() != null && u.getEmail().equalsIgnoreCase(auditor));
                            if (matches) {
                                if (u.getUserId() != null) {
                                    for (ApAuditCaseEntity c : caseRepository.findByAssignedAuditorId(u.getUserId().toString())) {
                                        boolean exists = false;
                                        for (ApAuditCaseEntity ex : cases) {
                                            if (ex.getId().equals(c.getId())) { exists = true; break; }
                                        }
                                        if (!exists) cases.add(c);
                                    }
                                }
                                if (u.getUsername() != null) {
                                    for (ApAuditCaseEntity c : caseRepository.findByAssignedAuditorId(u.getUsername())) {
                                        boolean exists = false;
                                        for (ApAuditCaseEntity ex : cases) {
                                            if (ex.getId().equals(c.getId())) { exists = true; break; }
                                        }
                                        if (!exists) cases.add(c);
                                    }
                                }
                            }
                        }
                    } catch (Exception ignored) {}
                }
            } else if (status != null && !status.isBlank()) {
                cases = caseRepository.findByStatus(status);
            } else {
                return ResponseEntity.badRequest().body(GenericResponse.error(
                        "MISSING_FILTER",
                        "At least one filter is required: taxCenter, teamLeader, committeeId, auditor, or status"));
            }

            // Optional secondary filter by auditType
            if (auditType != null && !auditType.isBlank()) {
                String typeFilter = auditType.toUpperCase();
                cases = cases.stream()
                        .filter(c -> typeFilter.equals(c.getAuditType()))
                        .collect(Collectors.toList());
            }

            // Optional secondary filter by planYear / year
            final Integer targetYear = planYear != null ? planYear : year;
            if (targetYear != null) {
                cases = cases.stream()
                        .filter(c -> {
                            if (c.getCaseNumber() != null && c.getCaseNumber().startsWith(targetYear + "-")) {
                                return true;
                            }
                            return false;
                        })
                        .collect(Collectors.toList());
            }

            List<Map<String, Object>> dtos = cases.stream()
                    .map(this::toDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(GenericResponse.success(dtos, dtos.size(), (long) dtos.size()));

        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error("QUERY_ERROR", "Failed to query cases: " + e.getMessage()));
        }
    }

    /**
     * Single case by ID.
     */
    @GetMapping("/{caseId}")
    public ResponseEntity<GenericResponse<Map<String, Object>>> getCaseById(@PathVariable UUID caseId) {
        try {
            ApAuditCaseEntity entity = caseRepository.findById(caseId)
                    .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));
            return ResponseEntity.ok(GenericResponse.success(toDto(entity)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(GenericResponse.error("NOT_FOUND", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error("ERROR", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SINGLE ASSIGNMENT
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Assign a single case to a team leader.
     * PENDING_ASSIGNMENT → ASSIGNED_TO_TEAM_LEADER
     */
    @PostMapping("/{caseId}/assign-team-leader")
    @Transactional
    public ResponseEntity<GenericResponse<Map<String, Object>>> assignToTeamLeader(
            @PathVariable UUID caseId,
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "X-Actor-Id", required = false) String actorId) {
        try {
            String teamLeaderId = (String) body.get("teamLeaderId");
            if (teamLeaderId == null || teamLeaderId.isBlank()) {
                return ResponseEntity.ok(GenericResponse.error("MISSING_TL", "teamLeaderId is required"));
            }
            ApAuditCaseEntity entity = caseRepository.findById(caseId)
                    .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));

            // Allow re-assignment if already PENDING or already ASSIGNED_TO_TEAM_LEADER
            if (!ApAuditCaseEntity.STATUS_PENDING_ASSIGNMENT.equals(entity.getStatus())
                    && !ApAuditCaseEntity.STATUS_ASSIGNED_TO_TEAM_LEADER.equals(entity.getStatus())) {
                return ResponseEntity.ok(GenericResponse.error("INVALID_STATE",
                        "Case cannot be assigned to team leader in status: " + entity.getStatus()));
            }

            String canonicalTL = resolveTeamLeaderCanonicalId(teamLeaderId);
            String targetTLId = canonicalTL != null ? canonicalTL : teamLeaderId;
            entity.setAssignedTeamLeaderId(targetTLId);
            entity.setStatus(ApAuditCaseEntity.STATUS_ASSIGNED_TO_TEAM_LEADER);
            entity.setUpdatedAt(OffsetDateTime.now());
            caseRepository.save(entity);

            if (notificationService != null) {
                try {
                    String taxpayer = entity.getTaxpayerName() != null ? entity.getTaxpayerName() : entity.getTaxpayerId();
                    notificationService.sendNotification(
                            targetTLId,
                            "CASE_ASSIGNMENT",
                            "New Audit Case Assigned: " + entity.getCaseNumber(),
                            entity.getAuditType() + " case for taxpayer " + taxpayer + " has been assigned to your supervision queue.",
                            entity.getId(), null, "CASE", entity.getId()
                    );
                } catch (Exception ignored) {}
            }

            return ResponseEntity.ok(GenericResponse.success(toDto(entity)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(GenericResponse.error("NOT_FOUND", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error("ASSIGN_ERROR", e.getMessage()));
        }
    }

    /**
     * Assign a single case to an auditor (Team Leader action).
     * ASSIGNED_TO_TEAM_LEADER → IN_PROGRESS
     */
    @PostMapping("/{caseId}/assign-auditor")
    @Transactional
    public ResponseEntity<GenericResponse<Map<String, Object>>> assignToAuditor(
            @PathVariable UUID caseId,
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "X-Actor-Id", required = false) String actorId) {
        try {
            String auditorId = (String) body.get("auditorId");
            if (auditorId == null || auditorId.isBlank()) {
                return ResponseEntity.ok(GenericResponse.error("MISSING_AUDITOR", "auditorId is required"));
            }
            ApAuditCaseEntity entity = caseRepository.findById(caseId)
                    .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));

            if (!ApAuditCaseEntity.STATUS_ASSIGNED_TO_TEAM_LEADER.equals(entity.getStatus())
                    && !ApAuditCaseEntity.STATUS_IN_PROGRESS.equals(entity.getStatus())) {
                return ResponseEntity.ok(GenericResponse.error("INVALID_STATE",
                        "Case must be assigned to team leader before auditor assignment. Status: " + entity.getStatus()));
            }

            String canonicalAuditor = resolveAuditorCanonicalId(auditorId);
            String targetAuditorId = canonicalAuditor != null ? canonicalAuditor : auditorId;

            entity.setAssignedAuditorId(targetAuditorId);
            entity.setStatus(ApAuditCaseEntity.STATUS_IN_PROGRESS);
            entity.setStartedAt(OffsetDateTime.now());
            entity.setUpdatedAt(OffsetDateTime.now());
            caseRepository.save(entity);

            if (notificationService != null) {
                try {
                    String taxpayer = entity.getTaxpayerName() != null ? entity.getTaxpayerName() : entity.getTaxpayerId();
                    notificationService.sendNotification(
                            targetAuditorId,
                            "AUDIT_ASSIGNMENT",
                            "Case Assigned for Audit: " + entity.getCaseNumber(),
                            "You have been assigned to execute the " + entity.getAuditType() + " audit for " + taxpayer + ".",
                            entity.getId(), null, "CASE", entity.getId()
                    );
                } catch (Exception ignored) {}
            }

            return ResponseEntity.ok(GenericResponse.success(toDto(entity)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(GenericResponse.error("NOT_FOUND", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error("ASSIGN_ERROR", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BULK ASSIGNMENT
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Bulk assign cases to team leaders.
     * Used by Tax Center Case Management page.
     *
     * Request body:
     * {
     *   "assignments": [
     *     { "caseId": "uuid", "teamLeaderId": "tl-user-id" },
     *     ...
     *   ]
     * }
     */
    @PostMapping("/bulk-assign-team-leader")
    @Transactional
    public ResponseEntity<GenericResponse<Map<String, Object>>> bulkAssignToTeamLeaders(
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "X-Actor-Id", required = false) String actorId) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> assignments = (List<Map<String, Object>>) body.get("assignments");

            if (assignments == null || assignments.isEmpty()) {
                return ResponseEntity.ok(GenericResponse.error("MISSING_ASSIGNMENTS", "assignments list is required"));
            }

            int assigned = 0;
            List<String> errors = new ArrayList<>();

            for (Map<String, Object> assignment : assignments) {
                try {
                    UUID caseId = UUID.fromString((String) assignment.get("caseId"));
                    String teamLeaderId = (String) assignment.get("teamLeaderId");

                    if (teamLeaderId == null || teamLeaderId.isBlank()) {
                        errors.add("Case " + caseId + ": missing teamLeaderId");
                        continue;
                    }

                    ApAuditCaseEntity entity = caseRepository.findById(caseId).orElse(null);
                    if (entity == null) {
                        errors.add("Case " + caseId + ": not found");
                        continue;
                    }

                    // Enforce multi-dimensional organizational authorization check (CanUserPerformAction)
                    mor.itas.infrastructure.security.OrgScopeAuthorizationService.AuthorizationResult authRes =
                            orgScopeAuthorizationService.canUserPerformAction(actorId, "CASE_ASSIGN", entity.getTaxCenterCode(), entity.getAuditType(), entity.getCommitteeId(), entity);

                    if (!authRes.isAllowed()) {
                        errors.add("Case " + caseId + ": " + authRes.getReason());
                        continue;
                    }

                    // Normalize to canonical username if passed as email, alias, or UUID
                    String canonicalTL = resolveTeamLeaderCanonicalId(teamLeaderId);
                    String targetTLId = canonicalTL != null ? canonicalTL : teamLeaderId;

                    // Enforce Strict Tax Center Isolation: Verify case's Tax Center matches Team Leader's Tax Center
                    String caseTc = entity.getTaxCenterCode();
                    if (caseTc != null && targetTLId != null && targetTLId.startsWith("u-tl-")) {
                        List<String> caseTcVariants = getTaxCenterVariants(caseTc);
                        boolean match = false;
                        for (String variant : caseTcVariants) {
                            String vLower = variant.toLowerCase().replace("-", "").replace("_", "");
                            String tlLower = targetTLId.toLowerCase().replace("-", "").replace("_", "");
                            if (tlLower.contains(vLower)) {
                                match = true;
                                break;
                            }
                        }
                        if (!match) {
                            errors.add("Case " + caseId + " (" + caseTc + "): Cannot assign to Team Leader " + targetTLId + " from another Tax Center");
                            continue;
                        }
                    }

                    entity.setAssignedTeamLeaderId(targetTLId);
                    
                    String requestedStatus = (String) assignment.get("status");
                    if (requestedStatus != null && !requestedStatus.isBlank()) {
                        entity.setStatus(requestedStatus);
                    } else {
                        entity.setStatus(ApAuditCaseEntity.STATUS_ASSIGNED_TO_TEAM_LEADER);
                    }
                    
                    entity.setUpdatedAt(OffsetDateTime.now());
                    caseRepository.save(entity);
                    assigned++;

                    if (notificationService != null) {
                        try {
                            String taxpayer = entity.getTaxpayerName() != null ? entity.getTaxpayerName() : entity.getTaxpayerId();
                            notificationService.sendNotification(
                                    targetTLId,
                                    "CASE_ASSIGNMENT",
                                    "New Audit Case Assigned: " + entity.getCaseNumber(),
                                    entity.getAuditType() + " case for taxpayer " + taxpayer + " has been assigned to your supervision queue.",
                                    entity.getId(), null, "CASE", entity.getId()
                            );
                        } catch (Exception ignored) {}
                    }
                } catch (Exception e) {
                    errors.add("Assignment error: " + e.getMessage());
                }
            }

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("totalRequested", assignments.size());
            result.put("assigned", assigned);
            result.put("failed", errors.size());
            result.put("errors", errors);
            result.put("status", errors.isEmpty() ? "SUCCESS" : (assigned > 0 ? "PARTIAL_SUCCESS" : "FAILED"));

            return ResponseEntity.ok(GenericResponse.success(result));
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error("BULK_ASSIGN_ERROR", e.getMessage()));
        }
    }

    /**
     * Bulk assign cases to auditors.
     * Used by Team Leader Dashboard.
     *
     * Request body:
     * {
     *   "assignments": [
     *     { "caseId": "uuid", "auditorId": "auditor-user-id" },
     *     ...
     *   ]
     * }
     */
    @PostMapping("/bulk-assign-auditor")
    @Transactional
    public ResponseEntity<GenericResponse<Map<String, Object>>> bulkAssignToAuditors(
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "X-Actor-Id", required = false) String actorId) {
        try {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> assignments = (List<Map<String, Object>>) body.get("assignments");

            if (assignments == null || assignments.isEmpty()) {
                return ResponseEntity.ok(GenericResponse.error("MISSING_ASSIGNMENTS", "assignments list is required"));
            }

            int assigned = 0;
            List<String> errors = new ArrayList<>();

            for (Map<String, Object> assignment : assignments) {
                try {
                    UUID caseId = UUID.fromString((String) assignment.get("caseId"));
                    String auditorId = (String) assignment.get("auditorId");

                    if (auditorId == null || auditorId.isBlank()) {
                        errors.add("Case " + caseId + ": missing auditorId");
                        continue;
                    }

                    ApAuditCaseEntity entity = caseRepository.findById(caseId).orElse(null);
                    if (entity == null) {
                        errors.add("Case " + caseId + ": not found");
                        continue;
                    }

                    // Allow assignment if in ASSIGNED_TO_TEAM_LEADER, ASSIGNED_TO_COMMITTEE, or IN_PROGRESS state
                    if (!ApAuditCaseEntity.STATUS_ASSIGNED_TO_TEAM_LEADER.equals(entity.getStatus())
                            && !ApAuditCaseEntity.STATUS_ASSIGNED_TO_COMMITTEE.equals(entity.getStatus())
                            && !ApAuditCaseEntity.STATUS_IN_PROGRESS.equals(entity.getStatus())) {
                        errors.add("Case " + caseId + ": invalid status " + entity.getStatus());
                        continue;
                    }

                    // Normalize to canonical username if passed as email, alias, or UUID
                    String canonicalAuditor = resolveAuditorCanonicalId(auditorId);
                    String targetAuditorId = canonicalAuditor != null ? canonicalAuditor : auditorId;

                    entity.setAssignedAuditorId(targetAuditorId);
                    entity.setStatus(ApAuditCaseEntity.STATUS_IN_PROGRESS);
                    entity.setStartedAt(OffsetDateTime.now());
                    entity.setUpdatedAt(OffsetDateTime.now());
                    caseRepository.save(entity);
                    assigned++;

                    if (notificationService != null) {
                        try {
                            String taxpayer = entity.getTaxpayerName() != null ? entity.getTaxpayerName() : entity.getTaxpayerId();
                            notificationService.sendNotification(
                                    targetAuditorId,
                                    "AUDIT_ASSIGNMENT",
                                    "Audit Assignment: " + entity.getCaseNumber(),
                                    "You have been assigned to execute the " + entity.getAuditType() + " audit for " + taxpayer + ".",
                                    entity.getId(), null, "CASE", entity.getId()
                            );
                        } catch (Exception ignored) {}
                    }
                } catch (Exception e) {
                    errors.add("Assignment error: " + e.getMessage());
                }
            }

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("totalRequested", assignments.size());
            result.put("assigned", assigned);
            result.put("failed", errors.size());
            result.put("errors", errors);
            result.put("status", errors.isEmpty() ? "SUCCESS" : (assigned > 0 ? "PARTIAL_SUCCESS" : "FAILED"));

            return ResponseEntity.ok(GenericResponse.success(result));
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error("BULK_ASSIGN_ERROR", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // STATUS UPDATE
    // ─────────────────────────────────────────────────────────────────────────

    @PatchMapping("/{caseId}/status")
    @Transactional
    public ResponseEntity<GenericResponse<Map<String, Object>>> updateStatus(
            @PathVariable UUID caseId,
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "X-Actor-Id", required = false) String actorId) {
        try {
            String newStatus = (String) body.get("status");
            if (newStatus == null || newStatus.isBlank()) {
                return ResponseEntity.ok(GenericResponse.error("MISSING_STATUS", "status is required"));
            }
            ApAuditCaseEntity entity = caseRepository.findById(caseId)
                    .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));
            entity.setStatus(newStatus);
            entity.setUpdatedAt(OffsetDateTime.now());
            if (ApAuditCaseEntity.STATUS_COMPLETED.equals(newStatus)) {
                entity.setCompletedAt(OffsetDateTime.now());
            }
            caseRepository.save(entity);

            if (notificationService != null) {
                try {
                    if (newStatus.contains("SUBMITTED_FOR_TL_REVIEW") || newStatus.contains("SUBMITTED_TO_TL")) {
                        if (entity.getAssignedTeamLeaderId() != null) {
                            notificationService.sendNotification(
                                    entity.getAssignedTeamLeaderId(),
                                    "SUPERVISORY_REVIEW",
                                    "Supervisory Review: " + entity.getCaseNumber(),
                                    "Auditor submitted audit findings/report for case " + entity.getCaseNumber() + " for your review.",
                                    entity.getId(), null, "CASE", entity.getId()
                            );
                        }
                    } else if (newStatus.contains("REVISION_REQUESTED") || newStatus.contains("RETURNED")) {
                        if (entity.getAssignedAuditorId() != null) {
                            notificationService.sendNotification(
                                    entity.getAssignedAuditorId(),
                                    "REVISION_DIRECTIVE",
                                    "Revision Required: " + entity.getCaseNumber(),
                                    "Supervisory review returned case " + entity.getCaseNumber() + " with revision instructions.",
                                    entity.getId(), null, "CASE", entity.getId()
                            );
                        }
                    } else if (newStatus.contains("SUBMITTED_FOR_COMMITTEE")) {
                        String tcCode = entity.getTaxCenterCode() != null ? entity.getTaxCenterCode().toLowerCase() : "fed";
                        String chair = tcCode.contains("lto") ? "u-com-fed-tpchair" : "u-com-" + tcCode + "-tp";
                        notificationService.sendNotification(
                                chair,
                                "COMMITTEE_DELIBERATION",
                                "Committee Docket: " + entity.getCaseNumber(),
                                "Team Leader endorsed case " + entity.getCaseNumber() + " for formal statutory resolution.",
                                entity.getId(), null, "CASE", entity.getId()
                        );
                    }
                } catch (Exception ignored) {}
            }

            return ResponseEntity.ok(GenericResponse.success(toDto(entity)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(GenericResponse.error("NOT_FOUND", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error("STATUS_ERROR", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // REFERRAL AUDIT CASES (STRICT TAX CENTER ISOLATION)
    // ─────────────────────────────────────────────────────────────────────────

    private static final List<Map<String, Object>> REFERRAL_STORE = Collections.synchronizedList(new ArrayList<>());

    @PostMapping("/referrals")
    public ResponseEntity<GenericResponse<Map<String, Object>>> createReferral(
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "X-Actor-Id", required = false) String actorId) {
        try {
            String targetTc = (String) body.get("targetTaxCenter");
            String normalizedTC = normalizeTaxCenterCode(targetTc);
            body.put("targetTaxCenterCode", normalizedTC != null ? normalizedTC : targetTc);
            body.put("createdAt", OffsetDateTime.now().toString());
            body.put("status", "PENDING_TAX_CENTER_REVIEW");
            REFERRAL_STORE.add(body);
            return ResponseEntity.ok(GenericResponse.success(body));
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error("REFERRAL_CREATE_ERROR", e.getMessage()));
        }
    }

    @GetMapping("/referrals")
    public ResponseEntity<GenericResponse<List<Map<String, Object>>>> getReferrals(
            @RequestParam(required = false) String taxCenter,
            @RequestParam(required = false) String requestingEntity) {
        try {
            String normalizedTC = normalizeTaxCenterCode(taxCenter);
            List<Map<String, Object>> filtered = REFERRAL_STORE.stream()
                    .filter(ref -> {
                        if (normalizedTC == null || normalizedTC.isBlank()) return true;
                        String target = (String) ref.get("targetTaxCenter");
                        String targetCode = (String) ref.get("targetTaxCenterCode");
                        String normTarget = normalizeTaxCenterCode(target);
                        return normalizedTC.equalsIgnoreCase(normTarget) || normalizedTC.equalsIgnoreCase(targetCode) || normalizedTC.equalsIgnoreCase(target);
                    })
                    .filter(ref -> {
                        if (requestingEntity == null || requestingEntity.isBlank()) return true;
                        String req = (String) ref.get("requestingEntity");
                        return req != null && req.toLowerCase().contains(requestingEntity.toLowerCase());
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(GenericResponse.success(filtered, filtered.size(), (long) filtered.size()));
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error("REFERRAL_QUERY_ERROR", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    public static List<String> getTaxCenterVariants(String code) {
        if (code == null || code.isBlank()) return List.of();
        Set<String> variants = new LinkedHashSet<>();
        variants.add(code.trim());
        variants.add(code.trim().toLowerCase());
        variants.add(code.trim().toUpperCase());

        String s = code.trim().toLowerCase();
        if (s.contains("federal-lto1") || s.contains("fed-lto1") || s.equals("lto1") || s.equals("tc-fed-01")) {
            variants.add("federal-lto1");
            variants.add("FED-LTO1");
            variants.add("TC-FED-01");
        } else if (s.contains("federal-lto2") || s.contains("fed-lto2") || s.equals("lto2") || s.equals("tc-fed-02")) {
            variants.add("federal-lto2");
            variants.add("FED-LTO2");
            variants.add("TC-FED-02");
        } else {
            String sClean = s;
            if (sClean.startsWith("tc-") || sClean.startsWith("tc_")) {
                sClean = sClean.substring(3);
            }
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("([a-z_]+)[-_]?(?:tc)?[-_]?0?(\\d+)").matcher(sClean);
            if (m.find()) {
                String reg = m.group(1);
                int num = Integer.parseInt(m.group(2));
                String num2 = String.format("%02d", num);

                if (reg.contains("aa") || reg.contains("addis")) {
                    variants.add("addis_ababa-tc" + num);
                    variants.add("AA-TC" + num);
                    variants.add("TC-AA-" + num2);
                } else if (reg.contains("ba") || reg.contains("amhara")) {
                    variants.add("amhara-tc" + num);
                    variants.add("BA-TC" + num);
                    variants.add("TC-BA-" + num2);
                } else if (reg.contains("bb") || reg.contains("oromia")) {
                    variants.add("oromia-tc" + num);
                    variants.add("BB-TC" + num);
                    variants.add("TC-BB-" + num2);
                } else if (reg.contains("ab") || reg.contains("dd") || reg.contains("dire")) {
                    variants.add("dire_dawa-tc" + num);
                    variants.add("AB-TC" + num);
                    variants.add("TC-DD-" + num2);
                    variants.add("TC-AB-" + num2);
                } else if (reg.contains("ca") || reg.contains("snnpr")) {
                    variants.add("snnpr-tc" + num);
                    variants.add("CA-TC" + num);
                    variants.add("TC-CA-" + num2);
                } else if (reg.contains("so") || reg.contains("sm") || reg.contains("somali")) {
                    variants.add("somali-tc" + num);
                    variants.add("SO-TC" + num);
                    variants.add("TC-SM-" + num2);
                    variants.add("TC-SO-" + num2);
                }
            }
        }
        return new ArrayList<>(variants);
    }

    /**
     * Normalize tax center code from frontend format to backend format.
     * Frontend: AA-TC1 → Backend: TC-AA-01
     * Also handles: AA-TC2 → TC-AA-02, etc.
     */
    private String normalizeTaxCenterCode(String code) {
        if (code == null || code.isBlank()) return code;
        List<String> variants = getTaxCenterVariants(code);
        for (String v : variants) {
            if (v.startsWith("TC-")) return v;
        }
        return code;
    }

    /**
     * Find the backend tax center code for a frontend user ID.
     * Maps seed user tax center context to the backend TC-AA-XX format.
     * e.g., u-tl-aa1a (addis_ababa-tc1) → TC-AA-01
     */
    private String resolveTaxCenterFromUserContext(String userId, String requestTaxCenter) {
        // If a tax center was explicitly provided, use it
        if (requestTaxCenter != null && !requestTaxCenter.isBlank()) {
            return normalizeTaxCenterCode(requestTaxCenter);
        }
        // Try to extract tax center from user ID pattern
        // u-tc-aa1 → addis_ababa-tc1 → TC-AA-01
        // u-tl-aa1a → addis_ababa-tc1 → TC-AA-01
        // u-aud-aa1a → addis_ababa-tc1 → TC-AA-01
        if (userId != null) {
            String lower = userId.toLowerCase();
            // Extract region+tc number from user ID
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(?:tc|tl|aud)(?:om)?-([a-z]{2})(\\d)").matcher(lower);
            if (m.find()) {
                String region = m.group(1).toUpperCase();
                String tcNum = m.group(2);
                return "TC-" + region + "-" + "0" + tcNum;
            }
        }
        return null;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPER — Convert entity to API DTO
    // ─────────────────────────────────────────────────────────────────────────

    private Map<String, Object> toDto(ApAuditCaseEntity c) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", c.getId().toString());
        m.put("planId", c.getPlanId() != null ? c.getPlanId().toString() : null);

        Integer planYear = null;
        if (c.getCaseNumber() != null && c.getCaseNumber().contains("-")) {
            try {
                String firstPart = c.getCaseNumber().split("-")[0];
                if (firstPart.length() == 4) {
                    planYear = Integer.parseInt(firstPart);
                }
            } catch (Exception ignored) {}
        }
        m.put("planYear", planYear != null ? planYear : 2026);

        m.put("allocationId", c.getAllocationId() != null ? c.getAllocationId().toString() : null);
        m.put("caseNumber", c.getCaseNumber());
        m.put("taxCenterCode", c.getTaxCenterCode());
        m.put("regionCode", c.getRegionCode());
        m.put("taxpayerId", c.getTaxpayerId());
        m.put("taxpayerName", c.getTaxpayerName() != null ? c.getTaxpayerName() : c.getTaxpayerId());
        m.put("sector", c.getSector());
        m.put("auditType", c.getAuditType());
        m.put("riskScore", c.getRiskScore());
        m.put("estimatedRevenue", c.getEstimatedRevenue());
        m.put("status", c.getStatus());
        // Normalise status for frontend compatibility
        m.put("frontendStatus", normalizeFrontendStatus(c.getStatus()));
        m.put("assignedTeamLeaderId", c.getAssignedTeamLeaderId());
        m.put("assignedTeamLeaderName", resolveUserDisplayName(c.getAssignedTeamLeaderId()));
        m.put("assignedAuditorId", c.getAssignedAuditorId());
        m.put("assignedAuditorName", resolveUserDisplayName(c.getAssignedAuditorId()));
        m.put("isCommitteeCase", c.isCommitteeCase());
        m.put("createdBy", c.getCreatedBy());
        m.put("createdAt", c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);
        m.put("startedAt", c.getStartedAt() != null ? c.getStartedAt().toString() : null);
        m.put("completedAt", c.getCompletedAt() != null ? c.getCompletedAt().toString() : null);
        m.put("updatedAt", c.getUpdatedAt() != null ? c.getUpdatedAt().toString() : null);
        return m;
    }

    private String resolveUserDisplayName(String identifier) {
        if (identifier == null || identifier.isBlank()) return null;
        if (identifier.endsWith("-committee")) {
            String type = identifier.replace("-committee", "").toUpperCase();
            return switch (type) {
                case "JOINT" -> "Joint Audit Committee";
                case "TP", "TRANSFER" -> "Transfer Pricing Committee";
                case "DESK" -> "Desk Audit Committee";
                case "COMP" -> "Comprehensive Audit Committee";
                case "ISSUE" -> "Issue Audit Committee";
                default -> type + " Committee";
            };
        }
        if (userManagementUseCase != null) {
            try {
                for (mor.itas.domain.model.ap.User u : userManagementUseCase.getAllUsers()) {
                    boolean match = (u.getUsername() != null && u.getUsername().equalsIgnoreCase(identifier))
                                 || (u.getUserId() != null && u.getUserId().toString().equalsIgnoreCase(identifier))
                                 || (u.getEmail() != null && u.getEmail().equalsIgnoreCase(identifier));
                    if (match) {
                        return u.getFullName();
                    }
                }
            } catch (Exception ignored) {}
        }
        if (identifier.startsWith("u-tl-") || identifier.startsWith("u-aud-")) {
            String[] parts = identifier.split("-");
            if (parts.length >= 4) {
                boolean isTl = parts[1].equals("tl");
                String role = isTl ? "TL" : "Auditor";
                String type = parts[parts.length - 2].toUpperCase();
                String num = parts[parts.length - 1];
                StringBuilder tcB = new StringBuilder();
                for (int i = 2; i < parts.length - 2; i++) {
                    if (tcB.length() > 0) tcB.append(" ");
                    tcB.append(parts[i].replace("_", " ").toUpperCase());
                }
                String tc = tcB.toString();
                return type + " " + role + "-" + num + (tc.isEmpty() ? "" : " (" + tc + ")");
            }
        }
        return identifier;
    }

    /**
     * Map backend status to the simplified frontend status used in UI tabs.
     */
    private String normalizeFrontendStatus(String status) {
        if (status == null) return "PENDING";
        return switch (status) {
            case ApAuditCaseEntity.STATUS_PENDING_ASSIGNMENT     -> "PENDING";
            case ApAuditCaseEntity.STATUS_ASSIGNED_TO_TEAM_LEADER -> "ASSIGNED";
            case ApAuditCaseEntity.STATUS_ASSIGNED_TO_COMMITTEE   -> "ASSIGNED";
            case ApAuditCaseEntity.STATUS_IN_PROGRESS             -> "IN_PROGRESS";
            case ApAuditCaseEntity.STATUS_COMPLETED               -> "COMPLETED";
            default -> status;
        };
    }

    private String resolveAuditorCanonicalId(String auditorIdentifier) {
        if (auditorIdentifier == null || auditorIdentifier.isBlank()) return null;
        String lower = auditorIdentifier.trim().toLowerCase();

        // Check common aliases
        if (lower.contains("michael.abera") || lower.contains("michael.desta") || lower.contains("tolera.getachew")) {
            return "u-aud-addis_ababa-tc1-tp-1-1";
        }

        if (userManagementUseCase != null) {
            try {
                Optional<mor.itas.domain.model.ap.User> match = userManagementUseCase.getAllUsers().stream()
                        .filter(u -> (u.getUsername() != null && u.getUsername().equalsIgnoreCase(lower))
                                  || (u.getEmail() != null && u.getEmail().equalsIgnoreCase(lower))
                                  || (u.getUserId() != null && u.getUserId().toString().equalsIgnoreCase(lower)))
                        .findFirst();
                if (match.isPresent()) {
                    return match.get().getUsername();
                }
            } catch (Exception ignored) {}
        }
        return null;
    }

    private String resolveTeamLeaderCanonicalId(String tlIdentifier) {
        if (tlIdentifier == null || tlIdentifier.isBlank()) return null;
        String lower = tlIdentifier.trim().toLowerCase();

        if (lower.contains("robel.girma") || lower.contains("robel")) {
            return "u-tl-addis_ababa-tc1-tp-1";
        }

        if (userManagementUseCase != null) {
            try {
                Optional<mor.itas.domain.model.ap.User> match = userManagementUseCase.getAllUsers().stream()
                        .filter(u -> (u.getUsername() != null && u.getUsername().equalsIgnoreCase(lower))
                                  || (u.getEmail() != null && u.getEmail().equalsIgnoreCase(lower))
                                  || (u.getUserId() != null && u.getUserId().toString().equalsIgnoreCase(lower)))
                        .findFirst();
                if (match.isPresent()) {
                    return match.get().getUsername();
                }
            } catch (Exception ignored) {}
        }
        return null;
    }
}
