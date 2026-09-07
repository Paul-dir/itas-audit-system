package mor.itas.persistence.jpa.repository.workflow;

import mor.itas.persistence.jpa.entity.workflow.WorkflowStepEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkflowStepRepository extends JpaRepository<WorkflowStepEntity, UUID> {
    List<WorkflowStepEntity> findByDefinitionIdOrderByStepNumberAsc(UUID definitionId);
}
