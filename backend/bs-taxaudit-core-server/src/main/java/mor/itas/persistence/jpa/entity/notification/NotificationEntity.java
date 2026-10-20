package mor.itas.persistence.jpa.entity.notification;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications", indexes = {
    @Index(name = "idx_notif_recipient", columnList = "recipient_user_id, is_read, created_at DESC"),
    @Index(name = "idx_notif_case", columnList = "case_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEntity {

    @Id
    @Column(columnDefinition = "UUID")
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "recipient_user_id", nullable = false, length = 64)
    private String recipientUserId;

    @Column(name = "notification_type", nullable = false, length = 64)
    private String notificationType;

    @Column(nullable = false, length = 256)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(name = "task_id", columnDefinition = "UUID")
    private UUID taskId;

    @Column(name = "case_id", columnDefinition = "UUID")
    private UUID caseId;

    @Column(name = "artifact_type", length = 128)
    private String artifactType;

    @Column(name = "artifact_id", columnDefinition = "UUID")
    private UUID artifactId;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private boolean isRead = false;

    @Column(name = "read_at")
    private OffsetDateTime readAt;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
