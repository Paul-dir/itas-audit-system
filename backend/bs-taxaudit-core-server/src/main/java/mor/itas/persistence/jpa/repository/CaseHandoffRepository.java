package mor.itas.persistence.jpa.repository;

import mor.itas.persistence.jpa.entity.CaseHandoff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CaseHandoffRepository extends JpaRepository<CaseHandoff, UUID> {
    Optional<CaseHandoff> findByCaseIdAndStatus(UUID caseId, String status);
    Optional<CaseHandoff> findByCaseId(UUID caseId);
}
