package mor.itas.infrastructure.workflow;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
@Profile("mock")
public class MockWorkflowEngineAdapter implements WorkflowEnginePort {

    @Override
    public UUID startWorkflow(String processKey, String businessKey) {
        return UUID.randomUUID(); // Return a mock workflow instance ID
    }

    @Override
    public void completeTask(UUID taskId) {
        // Mock task completion
    }
}
