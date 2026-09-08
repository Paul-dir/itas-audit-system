package mor.itas.persistence.jpa.entity.ap;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "t_conference_record", indexes = {
    @Index(name = "idx_conference_case_id", columnList = "case_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConferenceRecordEntity {

    @Id
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "case_id", nullable = false)
    private UUID caseId;

    @Column(name = "scheduled_date")
    private OffsetDateTime scheduledDate;

    @Column(length = 128)
    private String location;

    @Column(length = 64)
    private String scheduledBy;

    @Column(columnDefinition = "TEXT")
    private String agenda;

    @Column(columnDefinition = "TEXT")
    private String minutes;

    @Column(name = "minutes_recorded_by")
    private String minutesRecordedBy;

    @Column(length = 32)
    private String status; // SCHEDULED, MINUTES_RECORDED, APPROVED

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "approved_at")
    private OffsetDateTime approvedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
