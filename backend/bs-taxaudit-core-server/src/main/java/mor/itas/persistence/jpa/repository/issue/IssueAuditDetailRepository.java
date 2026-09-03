package mor.itas.persistence.jpa.repository.issue;

import mor.itas.persistence.jpa.entity.issue.IssueAuditDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface IssueAuditDetailRepository extends JpaRepository<IssueAuditDetailEntity, UUID> {
    Optional<IssueAuditDetailEntity> findByAuditCaseId(UUID caseId);
}
