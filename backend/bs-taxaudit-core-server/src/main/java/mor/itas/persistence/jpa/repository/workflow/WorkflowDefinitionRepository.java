package mor.itas.persistence.jpa.repository.workflow;

import mor.itas.persistence.jpa.entity.workflow.WorkflowDefinitionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkflowDefinitionRepository extends JpaRepository<WorkflowDefinitionEntity, UUID> {
    Optional<WorkflowDefinitionEntity> findByCodeAndIsActiveTrue(String code);
}
