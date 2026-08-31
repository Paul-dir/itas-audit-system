package mor.itas.persistence.jpa.entity.tp;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tp_planning_meeting")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TpPlanningMeetingEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_case_id", nullable = false)
    private ApAuditCaseEntity auditCase;

    @Column(name = "audit_case_id", insertable = false, updatable = false)
    private UUID auditCaseId;

    @Column(name = "scheduled_date")
    private OffsetDateTime scheduledDate;

    @Column(name = "participants", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode participants;

    @Column(name = "agenda", columnDefinition = "TEXT")
    private String agenda;

    @Column(name = "discussion_notes", columnDefinition = "TEXT")
    private String discussionNotes;

    @Column(name = "decision", length = 50)
    private String decision; // APPROVED, RETURN_FOR_REVISION, REJECT

    @Column(name = "decision_timestamp")
    private OffsetDateTime decisionTimestamp;

    @Column(name = "recorded_by", length = 255)
    private String recordedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
