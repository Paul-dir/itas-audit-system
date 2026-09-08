package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.CommitteeSessionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CommitteeSessionRepository extends JpaRepository<CommitteeSessionEntity, UUID> {
    Page<CommitteeSessionEntity> findByOrderByScheduledDateDesc(Pageable pageable);
}
