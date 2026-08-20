package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
