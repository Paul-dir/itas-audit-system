package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.ApRegionalDeploymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApRegionalDeploymentRepository extends JpaRepository<ApRegionalDeploymentEntity, UUID> {
    List<ApRegionalDeploymentEntity> findByPlanId(UUID planId);
    
    Optional<ApRegionalDeploymentEntity> findByPlanIdAndRegionId(UUID planId, String regionId);
    
    int countByPlanId(UUID planId);
}
