package mor.itas.persistence.jpa.repository.identity;

import mor.itas.persistence.jpa.entity.identity.RegionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RegionRepository extends JpaRepository<RegionEntity, UUID> {
    Optional<RegionEntity> findByCode(String code);
}
