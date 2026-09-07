package mor.itas.persistence.jpa.repository.workflow;

import mor.itas.persistence.jpa.entity.workflow.WorkflowInstanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkflowInstanceRepository extends JpaRepository<WorkflowInstanceEntity, UUID> {
    Optional<WorkflowInstanceEntity> findByArtifactIdAndStatus(UUID artifactId, String status);
    List<WorkflowInstanceEntity> findByCaseId(UUID caseId);
}
