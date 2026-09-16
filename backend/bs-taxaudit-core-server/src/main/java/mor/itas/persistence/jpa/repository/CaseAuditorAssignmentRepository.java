package mor.itas.persistence.jpa.repository;

import mor.itas.persistence.jpa.entity.CaseAuditorAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CaseAuditorAssignmentRepository extends JpaRepository<CaseAuditorAssignment, UUID> {
    @Query("SELECT caa FROM CaseAuditorAssignment caa WHERE caa.caseId = ?1 AND caa.status = 'ACTIVE'")
    Optional<CaseAuditorAssignment> findActiveByCaseId(UUID caseId);
}
