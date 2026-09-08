package mor.itas.persistence.jpa.entity.ap;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.*;

@Entity
@Table(name = "t_committee_session")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommitteeSessionEntity {

    @Id
    private UUID sessionId;

    @Column(nullable = false, length = 255)
    private String sessionName;

    @Column(columnDefinition = "TEXT")
    private String agenda;

    @Column(nullable = false)
    private OffsetDateTime scheduledDate;

    @Column(length = 255)
    private String location;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "session_minutes", columnDefinition = "TEXT")
    private String sessionMinutes;

    @Column(name = "actual_start_time")
    private OffsetDateTime actualStartTime;

    @Column(name = "actual_end_time")
    private OffsetDateTime actualEndTime;

    @Column(nullable = false)
    private UUID chairpersonId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Version
    private Long version;

    @OneToMany(mappedBy = "sessionEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SessionAttendeeEntity> attendees = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (sessionId == null) {
            sessionId = UUID.randomUUID();
        }
    }
}
