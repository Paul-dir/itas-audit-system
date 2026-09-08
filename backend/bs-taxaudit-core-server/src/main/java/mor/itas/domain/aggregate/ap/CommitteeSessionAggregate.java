package mor.itas.domain.aggregate.ap;

import lombok.*;
import java.time.OffsetDateTime;
import java.util.*;

/**
 * Committee Session Aggregate Root
 * Manages committee sessions for formal decision-making
 */
@Data
@AllArgsConstructor
@Builder
public class CommitteeSessionAggregate {

    private UUID sessionId;
    private String sessionName;
    private String agenda;
    private OffsetDateTime scheduledDate;
    private String location;
    private SessionStatus status;
    @Builder.Default
    private List<SessionAttendee> attendees = new ArrayList<>();
    private String sessionMinutes;
    private OffsetDateTime actualStartTime;
    private OffsetDateTime actualEndTime;
    private UUID chairpersonId;
    private OffsetDateTime createdAt;
    @Builder.Default
    private List<DomainEvent> uncommittedEvents = new ArrayList<>();

    public enum SessionStatus {
        SCHEDULED("Session has been scheduled"),
        IN_PROGRESS("Session is currently in progress"),
        COMPLETED("Session has been completed"),
        CANCELLED("Session has been cancelled");

        private final String description;

        SessionStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * Start the session
     */
    public void startSession() {
        if (status != SessionStatus.SCHEDULED) {
            throw new IllegalStateException("Can only start SCHEDULED sessions");
        }
        this.status = SessionStatus.IN_PROGRESS;
        this.actualStartTime = OffsetDateTime.now();
    }

    /**
     * Complete the session
     */
    public void completeSession(String minutes) {
        if (status != SessionStatus.IN_PROGRESS) {
            throw new IllegalStateException("Can only complete IN_PROGRESS sessions");
        }
        this.status = SessionStatus.COMPLETED;
        this.actualEndTime = OffsetDateTime.now();
        this.sessionMinutes = minutes;
    }

    /**
     * Cancel the session
     */
    public void cancelSession() {
        if (status == SessionStatus.COMPLETED || status == SessionStatus.CANCELLED) {
            throw new IllegalStateException("Cannot cancel COMPLETED or already CANCELLED sessions");
        }
        this.status = SessionStatus.CANCELLED;
    }

    /**
     * Add attendee to session
     */
    public void addAttendee(UUID memberId, String memberName) {
        if (memberId == null || memberName == null) {
            throw new IllegalArgumentException("Member ID and name cannot be null");
        }

        boolean alreadyAttending = attendees.stream()
                .anyMatch(a -> a.getMemberId().equals(memberId));

        if (!alreadyAttending) {
            attendees.add(new SessionAttendee(
                    UUID.randomUUID(),
                    sessionId,
                    memberId,
                    memberName,
                    AttendanceStatus.INVITED,
                    null,
                    null
            ));
        }
    }

    /**
     * Confirm attendance
     */
    public void confirmAttendance(UUID memberId) {
        SessionAttendee attendee = attendees.stream()
                .filter(a -> a.getMemberId().equals(memberId))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Attendee not found"));

        attendee.setAttendanceStatus(AttendanceStatus.CONFIRMED);
        attendee.setConfirmedAt(OffsetDateTime.now());
    }

    /**
     * Mark as attended (when session completes)
     */
    public void markAttended(UUID memberId) {
        SessionAttendee attendee = attendees.stream()
                .filter(a -> a.getMemberId().equals(memberId))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Attendee not found"));

        attendee.setAttendanceStatus(AttendanceStatus.ATTENDED);
        attendee.setAttendedAt(OffsetDateTime.now());
    }

    /**
     * Get all attendees
     */
    public List<SessionAttendee> getAttendees() {
        return Collections.unmodifiableList(attendees);
    }

    /**
     * Get attended count
     */
    public int getAttendedCount() {
        return (int) attendees.stream()
                .filter(a -> a.getAttendanceStatus() == AttendanceStatus.ATTENDED)
                .count();
    }

    /**
     * Get session duration in minutes
     */
    public long getSessionDurationMinutes() {
        if (actualStartTime == null || actualEndTime == null) {
            return 0;
        }
        return java.time.temporal.ChronoUnit.MINUTES.between(actualStartTime, actualEndTime);
    }

    /**
     * Raise domain event
     */
    public void raiseEvent(Object event) {
        this.uncommittedEvents.add((DomainEvent) event);
    }

    /**
     * Get and clear uncommitted events
     */
    public List<DomainEvent> getUncommittedEvents() {
        return new ArrayList<>(this.uncommittedEvents);
    }

    public void clearUncommittedEvents() {
        this.uncommittedEvents.clear();
    }

    @Data
    @AllArgsConstructor
    public static class SessionAttendee {
        private UUID attendeeId;
        private UUID sessionId;
        private UUID memberId;
        private String memberName;
        private AttendanceStatus attendanceStatus;
        private OffsetDateTime confirmedAt;
        private OffsetDateTime attendedAt;
    }

    public enum AttendanceStatus {
        INVITED("Attendee has been invited"),
        CONFIRMED("Attendee has confirmed attendance"),
        ATTENDED("Attendee attended the session"),
        DECLINED("Attendee declined");

        private final String description;

        AttendanceStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    @Data
    @AllArgsConstructor
    public static class DomainEvent {
        private UUID aggregateId;
        private OffsetDateTime occurredAt;

        public DomainEvent(UUID aggregateId) {
            this.aggregateId = aggregateId;
            this.occurredAt = OffsetDateTime.now();
        }
    }
}
