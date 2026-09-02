package mor.itas.api.controller.backoffice.ap;

import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
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
 *
 * Key endpoints:
 *  GET    /cases?taxCenter=AA-TC1                 — all cases for a tax center
 *  GET    /cases?teamLeader=<userId>              — cases assigned to team leader
 *  GET    /cases?committeeId=<userId>             — cases assigned to committee member
 *  GET    /cases?auditor=<userId>                 — cases assigned to auditor
 *  GET    /cases?status=PENDING_ASSIGNMENT        — cases by status
 *  GET    /cases/{id}                             — single case
 *  POST   /cases/{id}/assign-team-leader          — assign one case to TL
 *  POST   /cases/{id}/assign-auditor              — assign one case to auditor
 *  POST   /cases/bulk-assign-team-leader          — assign many cases to TLs
 *  POST   /cases/bulk-assign-auditor              — assign many cases to auditors (TL action)
 *  PATCH  /cases/{id}/status                      — update case status
 */
@RestController
@RequestMapping("/api/v1/backoffice/ap/cases")
@RequiredArgsConstructor
public class CaseManagementController {

    private final ApAuditCaseRepository caseRepository;

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
            @RequestParam(required = false) String auditType) {

        try {
            List<ApAuditCaseEntity> cases;

            // Normalize tax center code: AA-TC1 → TC-AA-01
            String normalizedTC = normalizeTaxCenterCode(taxCenter);

            if (normalizedTC != null && !normalizedTC.isBlank()) {
                // ── Tax center view ──────────────────────────────────────────
                System.out.println("[Cases] Tax center query: " + taxCenter + " -> " + normalizedTC);
                if (status != null && !status.isBlank()) {
                    cases = caseRepository.findByTaxCenterCodeAndStatus(normalizedTC, status);
                } else {
                    cases = caseRepository.findByTaxCenterCode(normalizedTC);
                }
            } else if (teamLeader != null && !teamLeader.isBlank()) {
                // ── Team leader view ─────────────────────────────────────────
                cases = caseRepository.findByAssignedTeamLeaderId(teamLeader);

                // If no results by direct UUID/username, search by taxCenter and match assignedTeamLeaderId
                if (cases.isEmpty()) {
                    String resolvedTC = resolveTaxCenterFromUserContext(teamLeader, taxCenter);
                    if (resolvedTC != null) {
                        cases = caseRepository.findByTaxCenterCode(resolvedTC)
                                .stream()
                                .filter(c -> (teamLeader.equals(c.getAssignedTeamLeaderId()))
                                          && !ApAuditCaseEntity.STATUS_PENDING_ASSIGNMENT.equals(c.getStatus())
                                          && !ApAuditCaseEntity.STATUS_ASSIGNED_TO_COMMITTEE.equals(c.getStatus()))
                                .collect(Collectors.toList());
                    }
                }

                // Filter out committee cases
                final List<ApAuditCaseEntity> finalCases = cases;
                cases = finalCases.stream()
                        .filter(c -> !ApAuditCaseEntity.STATUS_ASSIGNED_TO_COMMITTEE.equals(c.getStatus()))
                        .collect(Collectors.toList());

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
                cases = caseRepository.findByAssignedAuditorId(auditor);

                // If no results, try backend auditor ID format
                if (cases.isEmpty()) {
                    String resolvedTC = resolveTaxCenterFromUserContext(auditor, taxCenter);
                    if (resolvedTC != null) {
                        System.out.println("[Cases] Auditor ID '" + auditor + "' not found, falling back to TC: " + resolvedTC);
                        cases = caseRepository.findByTaxCenterCode(resolvedTC)
                                .stream()
                                .filter(c -> c.getAssignedAuditorId() != null)
                                .collect(Collectors.toList());
                    }
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

            entity.setAssignedTeamLeaderId(teamLeaderId);
            entity.setStatus(ApAuditCaseEntity.STATUS_ASSIGNED_TO_TEAM_LEADER);
            entity.setUpdatedAt(OffsetDateTime.now());
            caseRepository.save(entity);

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

            entity.setAssignedAuditorId(auditorId);
            entity.setStatus(ApAuditCaseEntity.STATUS_IN_PROGRESS);
            entity.setStartedAt(OffsetDateTime.now());
            entity.setUpdatedAt(OffsetDateTime.now());
            caseRepository.save(entity);

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

                    entity.setAssignedTeamLeaderId(teamLeaderId);
                    entity.setStatus(ApAuditCaseEntity.STATUS_ASSIGNED_TO_TEAM_LEADER);
                    entity.setUpdatedAt(OffsetDateTime.now());
                    caseRepository.save(entity);
                    assigned++;
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

                    entity.setAssignedAuditorId(auditorId);
                    entity.setStatus(ApAuditCaseEntity.STATUS_IN_PROGRESS);
                    entity.setStartedAt(OffsetDateTime.now());
                    entity.setUpdatedAt(OffsetDateTime.now());
                    caseRepository.save(entity);
                    assigned++;
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
            return ResponseEntity.ok(GenericResponse.success(toDto(entity)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(GenericResponse.error("NOT_FOUND", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error("STATUS_ERROR", e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Normalize tax center code from frontend format to backend format.
     * Frontend: AA-TC1 → Backend: TC-AA-01
     * Also handles: AA-TC2 → TC-AA-02, etc.
     */
    private String normalizeTaxCenterCode(String code) {
        if (code == null || code.isBlank()) return code;
        // Already in backend format
        if (code.startsWith("TC-")) return code;
        // Frontend format: AA-TC1, BB-TC2, etc.
        // Convert: AA-TC1 → TC-AA-01
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("^([A-Z]{2})-TC(\\d+)$").matcher(code.trim());
        if (m.matches()) {
            String region = m.group(1);
            String tcNum = String.format("%02d", Integer.parseInt(m.group(2)));
            return "TC-" + region + "-" + tcNum;
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
        m.put("assignedAuditorId", c.getAssignedAuditorId());
        m.put("isCommitteeCase", c.isCommitteeCase());
        m.put("createdBy", c.getCreatedBy());
        m.put("createdAt", c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);
        m.put("startedAt", c.getStartedAt() != null ? c.getStartedAt().toString() : null);
        m.put("completedAt", c.getCompletedAt() != null ? c.getCompletedAt().toString() : null);
        m.put("updatedAt", c.getUpdatedAt() != null ? c.getUpdatedAt().toString() : null);
        return m;
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
}
