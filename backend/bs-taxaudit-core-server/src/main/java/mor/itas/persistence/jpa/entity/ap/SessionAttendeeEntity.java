package mor.itas.persistence.jpa.entity.ap;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "t_session_attendee")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionAttendeeEntity {

    @Id
    private UUID attendeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private CommitteeSessionEntity sessionEntity;

    @Column(nullable = false)
    private UUID memberId;

    @Column(name = "attendance_status", length = 50)
    private String attendanceStatus;

    @Column(name = "confirmed_at")
    private OffsetDateTime confirmedAt;

    @Column(name = "attended_at")
    private OffsetDateTime attendedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (attendeeId == null) {
            attendeeId = UUID.randomUUID();
        }
    }
}
