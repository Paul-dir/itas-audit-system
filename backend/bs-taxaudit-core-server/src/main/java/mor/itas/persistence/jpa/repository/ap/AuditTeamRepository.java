package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.AuditTeamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for AuditTeam entity.
 * Manages audit teams formed during the nomination process.
 */
@Repository
public interface AuditTeamRepository extends JpaRepository<AuditTeamEntity, UUID> {

    /**
     * Find all active teams available for assignment.
     */
    List<AuditTeamEntity> findByActiveTrue();

    /**
     * Find teams that have capacity for new cases.
     * Returns teams where current_cases < capacity.
     */
    @Query("SELECT t FROM AuditTeamEntity t WHERE t.active = true AND t.currentCases < t.capacity")
    List<AuditTeamEntity> findAvailableTeams();

    /**
     * Find team by team leader ID.
     */
    AuditTeamEntity findByTeamLeaderId(UUID teamLeaderId);

    /**
     * Find team by team leader ID if it exists and is active.
     */
    AuditTeamEntity findByTeamLeaderIdAndActiveTrue(UUID teamLeaderId);

    /**
     * Count active teams.
     */
    long countByActiveTrue();

    /**
     * Count teams at capacity.
     */
    @Query("SELECT COUNT(t) FROM AuditTeamEntity t WHERE t.active = true AND t.currentCases >= t.capacity")
    long countTeamsAtCapacity();
}
