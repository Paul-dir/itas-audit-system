package mor.itas.persistence.jpa.repository.shared;

import mor.itas.persistence.jpa.entity.shared.AuditTrailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AuditTrailRepository extends JpaRepository<AuditTrailEntity, UUID> {
}
