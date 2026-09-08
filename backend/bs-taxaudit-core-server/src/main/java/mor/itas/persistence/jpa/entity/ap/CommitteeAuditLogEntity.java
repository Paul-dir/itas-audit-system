package mor.itas.persistence.jpa.entity.ap;

import lombok.*;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.*;

@Entity
@Table(name = "t_committee_audit_log")
@Immutable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommitteeAuditLogEntity {

    @Id
    private UUID logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false, updatable = false)
    private CommitteeCaseEntity committeeCaseEntity;

    @Column(nullable = false, updatable = false)
    private UUID actorId;

    @Column(nullable = false, updatable = false, length = 100)
    private String actionType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "before_state", columnDefinition = "jsonb", updatable = false)
    private Map<String, Object> beforeState;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "after_state", columnDefinition = "jsonb", updatable = false)
    private Map<String, Object> afterState;

    @Column(name = "action_reason", columnDefinition = "TEXT", updatable = false)
    private String actionReason;

    @Column(name = "action_timestamp", nullable = false, updatable = false)
    private OffsetDateTime actionTimestamp;

    @Column(name = "action_hash", length = 64, updatable = false)
    private String actionHash;

    @Column(name = "ip_address", length = 45, updatable = false)
    private String ipAddress;

    @PrePersist
    protected void onCreate() {
        if (logId == null) {
            logId = UUID.randomUUID();
        }
        if (actionTimestamp == null) {
            actionTimestamp = OffsetDateTime.now();
        }
    }
}
