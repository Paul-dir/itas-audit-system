package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.AnnualAuditPlanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface AnnualAuditPlanJpaRepository extends JpaRepository<AnnualAuditPlanEntity, UUID> {
}
