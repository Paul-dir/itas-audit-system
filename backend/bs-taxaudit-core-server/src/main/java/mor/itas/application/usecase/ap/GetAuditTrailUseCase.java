package mor.itas.application.usecase.ap;

import mor.itas.api.dto.response.ap.jac.AuditTrailEntryResponse;
import mor.itas.domain.service.ap.AuditTrailService;
import mor.itas.persistence.jpa.entity.ap.CommitteeAuditLogEntity;
import mor.itas.persistence.jpa.repository.ap.CommitteeAuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import java.util.UUID;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * Use Case: Get Audit Trail
 * Retrieves immutable audit trail for case and compliance reports
 */
@Component
@RequiredArgsConstructor
public class GetAuditTrailUseCase {
    private final CommitteeAuditLogRepository auditLogRepository;
    private final AuditTrailService auditTrailService;
    
    /**
     * Retrieve audit trail for a specific case (paginated)
     */
    public Page<AuditTrailEntryResponse> getCaseAuditTrail(UUID caseId, Pageable pageable) {
        if (caseId == null) {
            throw new IllegalArgumentException("Case ID cannot be null");
        }
        return auditLogRepository.findByCommitteeCaseEntityCaseIdOrderByActionTimestampDesc(caseId, pageable)
            .map(this::toEntryResponse);
    }
    
    /**
     * Retrieve global audit trail with optional filtering (paginated)
     */
    public Page<AuditTrailEntryResponse> getGlobalAuditTrail(String actionType, String actorIdStr, String taxCenter, Pageable pageable) {
        UUID actorId = null;
        if (actorIdStr != null && !actorIdStr.isBlank()) {
            try {
                actorId = UUID.fromString(actorIdStr);
            } catch (IllegalArgumentException e) {
                // Ignore invalid actor UUID format
            }
        }
        return auditLogRepository.findGlobalLogs(actionType, actorId, taxCenter, pageable)
            .map(this::toEntryResponse);
    }
    
    /**
     * Export audit trail as CSV bytes
     */
    public byte[] exportAuditTrail(UUID caseId, String format) {
        List<CommitteeAuditLogEntity> logs;
        if (caseId != null) {
            logs = auditLogRepository.findByCommitteeCaseEntityCaseIdOrderByActionTimestampDesc(caseId, Pageable.unpaged()).getContent();
        } else {
            logs = auditLogRepository.findAll();
        }
        
        StringBuilder csv = new StringBuilder();
        csv.append("LogID,CaseID,ActorID,ActionType,ActionReason,Timestamp\n");
        for (CommitteeAuditLogEntity log : logs) {
            UUID logCaseId = log.getCommitteeCaseEntity() != null ? log.getCommitteeCaseEntity().getCaseId() : null;
            csv.append(log.getLogId()).append(",")
               .append(logCaseId).append(",")
               .append(log.getActorId()).append(",")
               .append(escapeCsv(log.getActionType())).append(",")
               .append(escapeCsv(log.getActionReason())).append(",")
               .append(log.getActionTimestamp()).append("\n");
        }
        return csv.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }
    
    private String escapeCsv(String val) {
        if (val == null) return "";
        return "\"" + val.replace("\"", "\"\"") + "\"";
    }

    private AuditTrailEntryResponse toEntryResponse(CommitteeAuditLogEntity entity) {
        return AuditTrailEntryResponse.builder()
            .logId(entity.getLogId())
            .actorId(entity.getActorId())
            .actorName("Actor " + entity.getActorId().toString().substring(0, 8))
            .actionType(entity.getActionType())
            .beforeState(entity.getBeforeState())
            .afterState(entity.getAfterState())
            .actionReason(entity.getActionReason())
            .actionTimestamp(entity.getActionTimestamp())
            .actionHash(entity.getActionHash())
            .build();
    }
    
    /**
     * Legacy execute method for compatibility
     */
    public Page<AuditTrailResponse> execute(UUID caseId, Pageable pageable) {
        if (caseId == null) {
            throw new IllegalArgumentException("Case ID cannot be null");
        }
        Page<CommitteeAuditLogEntity> auditLogs = auditLogRepository.findByCommitteeCaseEntityCaseIdOrderByActionTimestampDesc(caseId, pageable);
        return auditLogs.map(this::toResponse);
    }
    
    /**
     * Legacy executeByActionType method for compatibility
     */
    public Page<AuditTrailResponse> executeByActionType(UUID caseId, String actionType, Pageable pageable) {
        if (caseId == null || actionType == null) {
            throw new IllegalArgumentException("Case ID and action type cannot be null");
        }
        Page<CommitteeAuditLogEntity> auditLogs = auditLogRepository.findByCaseIdAndActionType(
            caseId, actionType, pageable);
        return auditLogs.map(this::toResponse);
    }
    
    private AuditTrailResponse toResponse(CommitteeAuditLogEntity entity) {
        UUID logCaseId = entity.getCommitteeCaseEntity() != null ? entity.getCommitteeCaseEntity().getCaseId() : null;
        return AuditTrailResponse.builder()
            .logId(entity.getLogId())
            .caseId(logCaseId)
            .actorId(entity.getActorId())
            .actionType(entity.getActionType())
            .actionReason(entity.getActionReason())
            .actionTimestamp(entity.getActionTimestamp())
            .build();
    }
    
    @Data
    public static class AuditTrailResponse {
        private UUID logId;
        private UUID caseId;
        private UUID actorId;
        private String actionType;
        private String actionReason;
        private OffsetDateTime actionTimestamp;
        
        public static AuditTrailResponseBuilder builder() {
            return new AuditTrailResponseBuilder();
        }
        
        public static class AuditTrailResponseBuilder {
            private UUID logId;
            private UUID caseId;
            private UUID actorId;
            private String actionType;
            private String actionReason;
            private OffsetDateTime actionTimestamp;
            
            public AuditTrailResponseBuilder logId(UUID logId) {
                this.logId = logId;
                return this;
            }
            
            public AuditTrailResponseBuilder caseId(UUID caseId) {
                this.caseId = caseId;
                return this;
            }
            
            public AuditTrailResponseBuilder actorId(UUID actorId) {
                this.actorId = actorId;
                return this;
            }
            
            public AuditTrailResponseBuilder actionType(String actionType) {
                this.actionType = actionType;
                return this;
            }
            
            public AuditTrailResponseBuilder actionReason(String reason) {
                this.actionReason = reason;
                return this;
            }
            
            public AuditTrailResponseBuilder actionTimestamp(OffsetDateTime timestamp) {
                this.actionTimestamp = timestamp;
                return this;
            }
            
            public AuditTrailResponse build() {
                AuditTrailResponse response = new AuditTrailResponse();
                response.logId = this.logId;
                response.caseId = this.caseId;
                response.actorId = this.actorId;
                response.actionType = this.actionType;
                response.actionReason = this.actionReason;
                response.actionTimestamp = this.actionTimestamp;
                return response;
            }
        }
    }
}
