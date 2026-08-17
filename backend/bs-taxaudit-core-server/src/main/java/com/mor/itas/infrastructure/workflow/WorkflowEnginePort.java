package com.mor.itas.infrastructure.workflow;

import java.util.UUID;

public interface WorkflowEnginePort {
    UUID startWorkflow(String processKey, String businessKey);
    void completeTask(UUID taskId);
}
