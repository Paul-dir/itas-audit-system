package mor.itas.domain.aggregate.ap;

import mor.itas.domain.exception.InvalidTeamSizeException;
import mor.itas.domain.valueobject.AuditorNomination;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.*;

/**
 * Team Assignment Aggregate Root
 * Manages auditor nominations and official team assignment
 */
@Data
@AllArgsConstructor
@Builder
public class TeamAssignmentAggregate {

    private UUID teamAssignmentId;
    private UUID committeeCaseId;
    @Builder.Default
    private List<AuditorNomination> nominations = new ArrayList<>();
    private UUID appointedTeamLeadId;
    @Builder.Default
    private List<UUID> officialTeamMemberIds = new ArrayList<>();
    private TeamAssignmentStatus status;
    private OffsetDateTime teamAssignmentDate;
    @Builder.Default
    private List<AuditLogEntry> auditLog = new ArrayList<>();
    @Builder.Default
    private List<DomainEvent> uncommittedEvents = new ArrayList<>();

    private static final int MIN_TEAM_SIZE = 2;
    private static final int MAX_TEAM_SIZE = 5;

    public enum TeamAssignmentStatus {
        PENDING("Awaiting nominations and assignments"),
        TEAM_LEAD_APPOINTED("Team lead has been appointed"),
        OFFICIAL_TEAM_ASSIGNED("Official team has been assigned"),
        COMPLETED("Team assignment completed");

        private final String description;

        TeamAssignmentStatus(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    /**
     * Nominate an auditor for the team
     */
    public void nominateAuditor(UUID nominatingMemberId, UUID auditorId, String justification) {
        if (nominatingMemberId == null || auditorId == null || justification == null) {
            throw new IllegalArgumentException("Nomination fields cannot be null");
        }

        AuditorNomination nomination = AuditorNomination.builder()
                .nominatedAuditorId(auditorId)
                .nominatingMemberId(nominatingMemberId)
                .justification(justification)
                .nominatedAt(OffsetDateTime.now())
                .build();

        nominations.add(nomination);
        addAuditLog("AUDITOR_NOMINATED", 
                Map.of("auditorId", auditorId.toString(), "justification", justification),
                nominatingMemberId);
    }

    /**
     * Appoint team lead
     */
    public void appointTeamLead(UUID auditorId) {
        if (auditorId == null) {
            throw new IllegalArgumentException("Auditor ID cannot be null");
        }

        this.appointedTeamLeadId = auditorId;
        this.status = TeamAssignmentStatus.TEAM_LEAD_APPOINTED;
        addAuditLog("TEAM_LEAD_APPOINTED", 
                Map.of("teamLeadId", auditorId.toString()),
                auditorId);
    }

    /**
     * Assign official team members
     * Enforces team size validation (2-5 members)
     */
    public void assignOfficialTeam(List<UUID> auditorIds) {
        validateTeamSize(auditorIds.size());

        if (!auditorIds.contains(appointedTeamLeadId)) {
            throw new IllegalStateException("Team lead must be included in official team");
        }

        this.officialTeamMemberIds = new ArrayList<>(auditorIds);
        this.status = TeamAssignmentStatus.OFFICIAL_TEAM_ASSIGNED;
        this.teamAssignmentDate = OffsetDateTime.now();
        addAuditLog("OFFICIAL_TEAM_ASSIGNED", 
                Map.of("teamMemberCount", auditorIds.size()),
                appointedTeamLeadId);
    }

    /**
     * Validate team size is within acceptable range
     */
    public void validateTeamSize(int teamSize) {
        if (teamSize < MIN_TEAM_SIZE || teamSize > MAX_TEAM_SIZE) {
            throw new InvalidTeamSizeException(teamSize, MIN_TEAM_SIZE, MAX_TEAM_SIZE);
        }
    }

    /**
     * Get all nominations
     */
    public List<AuditorNomination> getNominations() {
        return Collections.unmodifiableList(nominations);
    }

    /**
     * Get official team
     */
    public List<UUID> getOfficialTeam() {
        return Collections.unmodifiableList(officialTeamMemberIds);
    }

    /**
     * Check if auditor is on official team
     */
    public boolean isTeamMember(UUID auditorId) {
        return officialTeamMemberIds.contains(auditorId);
    }

    /**
     * Check if auditor was nominated
     */
    public boolean wasNominated(UUID auditorId) {
        return nominations.stream()
                .anyMatch(n -> n.getNominatedAuditorId().equals(auditorId));
    }

    /**
     * Mark assignment as completed
     */
    public void markAsCompleted() {
        this.status = TeamAssignmentStatus.COMPLETED;
        addAuditLog("TEAM_ASSIGNMENT_COMPLETED", Map.of(), null);
    }

    /**
     * Add audit log entry
     */
    private void addAuditLog(String actionType, Map<String, Object> details, UUID actor) {
        AuditLogEntry entry = new AuditLogEntry(
                UUID.randomUUID(),
                teamAssignmentId,
                actor,
                actionType,
                details,
                OffsetDateTime.now()
        );
        auditLog.add(entry);
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
    public static class DomainEvent {
        private UUID aggregateId;
        private OffsetDateTime occurredAt;

        public DomainEvent(UUID aggregateId) {
            this.aggregateId = aggregateId;
            this.occurredAt = OffsetDateTime.now();
        }
    }

    @Data
    @AllArgsConstructor
    public static class AuditLogEntry {
        private UUID logId;
        private UUID assignmentId;
        private UUID actorId;
        private String actionType;
        private Map<String, Object> details;
        private OffsetDateTime actionTimestamp;
    }
}
