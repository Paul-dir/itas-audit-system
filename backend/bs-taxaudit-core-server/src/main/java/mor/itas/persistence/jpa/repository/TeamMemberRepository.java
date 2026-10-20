package mor.itas.persistence.jpa.repository;

import mor.itas.persistence.jpa.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, UUID> {
    
    /**
     * Find active team member with proper filtering
     * Validates: team_leader_id, auditor_id, is_active=true, left_at IS NULL
     * Used for C2 bug fix: prevents cross-team auditor assignments
     */
    @Query("SELECT tm FROM TeamMember tm " +
           "WHERE tm.teamLeaderId = ?1 " +
           "AND tm.auditorId = ?2 " +
           "AND tm.isActive = true " +
           "AND tm.leftAt IS NULL")
    Optional<TeamMember> findActiveTeamMember(UUID teamLeaderId, UUID auditorId);
    
    /**
     * Count active team members for a team leader
     * Used for C3 bug fix: empty team detection
     */
    @Query("SELECT COUNT(tm) FROM TeamMember tm " +
           "WHERE tm.teamLeaderId = ?1 " +
           "AND tm.isActive = true " +
           "AND tm.leftAt IS NULL")
    long countActiveMembers(UUID teamLeaderId);
    
    /**
     * List all active team members for a team leader
     */
    @Query("SELECT tm FROM TeamMember tm " +
           "WHERE tm.teamLeaderId = ?1 " +
           "AND tm.isActive = true " +
           "AND tm.leftAt IS NULL")
    List<TeamMember> findActiveTeamMembers(UUID teamLeaderId);
}
