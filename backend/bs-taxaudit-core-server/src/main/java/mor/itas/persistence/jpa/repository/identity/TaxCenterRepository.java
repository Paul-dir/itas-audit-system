package mor.itas.persistence.jpa.repository.identity;

import mor.itas.persistence.jpa.entity.identity.TaxCenterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaxCenterRepository extends JpaRepository<TaxCenterEntity, UUID> {
    Optional<TaxCenterEntity> findByCode(String code);
    List<TaxCenterEntity> findByRegionId(UUID regionId);
}
