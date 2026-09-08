package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApAuditCaseRepository extends JpaRepository<ApAuditCaseEntity, UUID> {
    List<ApAuditCaseEntity> findByPlanId(UUID planId);
    
    List<ApAuditCaseEntity> findByStatus(String status);
    
    List<ApAuditCaseEntity> findByAssignedAuditorId(String auditorId);
    
    List<ApAuditCaseEntity> findByAssignedTeamLeaderId(String teamLeaderId);
    
    int countByPlanIdAndStatus(UUID planId, String status);

    /**
     * Get all cases visible to a team leader:
     * 1. Cases already assigned to this team leader (any status)
     * 2. PENDING_ASSIGNMENT cases not yet claimed by anyone
     */
    @Query("SELECT c FROM ApAuditCaseEntity c WHERE c.assignedTeamLeaderId = :teamLeaderId OR (c.status = 'PENDING_ASSIGNMENT' AND c.assignedTeamLeaderId IS NULL)")
    List<ApAuditCaseEntity> findVisibleToTeamLeader(@Param("teamLeaderId") String teamLeaderId);

    /**
     * Get ALL cases for a team leader including incoming unassigned cases.
     * Returns cases where teamLeaderId matches OR cases that are TEAM_ASSIGNED/PENDING_ASSIGNMENT.
     */
    @Query("SELECT c FROM ApAuditCaseEntity c WHERE c.assignedTeamLeaderId = :teamLeaderId OR c.status IN ('TEAM_ASSIGNED', 'PENDING_ASSIGNMENT')")
    List<ApAuditCaseEntity> findAllForTeamLeader(@Param("teamLeaderId") String teamLeaderId);
}
