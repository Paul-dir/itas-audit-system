package mor.itas.engineadapter.workflow;

import mor.itas.application.port.outboundport.workflow.WorkflowEnginePort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Mock Workflow Engine Adapter
 * Manages committee case lifecycle state transitions in-memory.
 * In production, this would integrate with Camunda, Flowable, or Activiti.
 *
 * Tracks:
 *   - Active workflows (processKey → businessKey → state)
 *   - Task completions
 *   - SLA timer management
 *   - State transition history
 */
@Component
@Profile({"mock", "test"})
@Slf4j
public class MockWorkflowEngineAdapter implements WorkflowEnginePort {

    /** Active workflows: workflowId → WorkflowState */
    private final Map<UUID, WorkflowState> activeWorkflows = new ConcurrentHashMap<>();

    /** State history: businessKey → list of transitions */
    private final Map<String, List<StateTransition>> stateHistory = new ConcurrentHashMap<>();

    @Override
    public UUID startWorkflow(String processKey, String businessKey) {
        UUID workflowId = UUID.randomUUID();
        WorkflowState state = new WorkflowState(workflowId, processKey, businessKey, "STARTED", OffsetDateTime.now());
        activeWorkflows.put(workflowId, state);

        recordTransition(businessKey, "STARTED", processKey);

        log.info("[WORKFLOW] Started workflow: id={}, process={}, business={}",
                workflowId, processKey, businessKey);
        return workflowId;
    }

    @Override
    public void completeTask(UUID taskId) {
        if (taskId == null) return;

        WorkflowState state = activeWorkflows.get(taskId);
        if (state != null) {
            state.status = "COMPLETED";
            state.completedAt = OffsetDateTime.now();
            recordTransition(state.businessKey, "COMPLETED", state.processKey);
            log.info("[WORKFLOW] Completed task: workflowId={}, process={}", taskId, state.processKey);
        }
    }

    /**
     * Transition a workflow to a new state (committee-specific).
     */
    public void transitionWorkflow(UUID workflowId, String newState) {
        WorkflowState state = activeWorkflows.get(workflowId);
        if (state != null) {
            String oldState = state.status;
            state.status = newState;
            recordTransition(state.businessKey, newState, state.processKey);
            log.info("[WORKFLOW] Transitioned: workflowId={}, {} → {}", workflowId, oldState, newState);
        }
    }

    /**
     * Transition workflow by business key (committee case ID).
     */
    public void transitionByBusinessKey(String businessKey, String newState) {
        activeWorkflows.values().stream()
                .filter(w -> w.businessKey.equals(businessKey))
                .findFirst()
                .ifPresent(w -> {
                    String oldState = w.status;
                    w.status = newState;
                    recordTransition(businessKey, newState, w.processKey);
                    log.info("[WORKFLOW] Transitioned by key: business={}, {} → {}", businessKey, oldState, newState);
                });
    }

    /**
     * Get current state of a workflow.
     */
    public String getWorkflowState(UUID workflowId) {
        WorkflowState state = activeWorkflows.get(workflowId);
        return state != null ? state.status : null;
    }

    /**
     * Get state history for a business key.
     */
    public List<StateTransition> getStateHistory(String businessKey) {
        return stateHistory.getOrDefault(businessKey, Collections.emptyList());
    }

    /**
     * Check if a workflow is still active (not completed/cancelled).
     */
    public boolean isActive(UUID workflowId) {
        WorkflowState state = activeWorkflows.get(workflowId);
        return state != null && !"COMPLETED".equals(state.status) && !"CANCELLED".equals(state.status);
    }

    /**
     * Cancel a workflow.
     */
    public void cancelWorkflow(UUID workflowId) {
        WorkflowState state = activeWorkflows.get(workflowId);
        if (state != null) {
            state.status = "CANCELLED";
            state.completedAt = OffsetDateTime.now();
            recordTransition(state.businessKey, "CANCELLED", state.processKey);
            log.info("[WORKFLOW] Cancelled workflow: {}", workflowId);
        }
    }

    /**
     * Get all active workflows (for monitoring).
     */
    public Collection<WorkflowState> getActiveWorkflows() {
        return activeWorkflows.values();
    }

    private void recordTransition(String businessKey, String newState, String processKey) {
        stateHistory.computeIfAbsent(businessKey, k -> Collections.synchronizedList(new ArrayList<>()))
                .add(new StateTransition(newState, processKey, OffsetDateTime.now()));
    }

    /** Workflow state record */
    public static class WorkflowState {
        public final UUID workflowId;
        public final String processKey;
        public final String businessKey;
        public final OffsetDateTime startedAt;
        public String status;
        public OffsetDateTime completedAt;

        public WorkflowState(UUID workflowId, String processKey, String businessKey, String status, OffsetDateTime startedAt) {
            this.workflowId = workflowId;
            this.processKey = processKey;
            this.businessKey = businessKey;
            this.status = status;
            this.startedAt = startedAt;
        }
    }

    /** State transition record */
    public static class StateTransition {
        public final String state;
        public final String processKey;
        public final OffsetDateTime timestamp;

        public StateTransition(String state, String processKey, OffsetDateTime timestamp) {
            this.state = state;
            this.processKey = processKey;
            this.timestamp = timestamp;
        }
    }
}
