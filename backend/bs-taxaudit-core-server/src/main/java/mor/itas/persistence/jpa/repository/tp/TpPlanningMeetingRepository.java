package mor.itas.persistence.jpa.repository.tp;

import mor.itas.persistence.jpa.entity.tp.TpPlanningMeetingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TpPlanningMeetingRepository extends JpaRepository<TpPlanningMeetingEntity, UUID> {
    Optional<TpPlanningMeetingEntity> findByAuditCaseId(UUID auditCaseId);
}
