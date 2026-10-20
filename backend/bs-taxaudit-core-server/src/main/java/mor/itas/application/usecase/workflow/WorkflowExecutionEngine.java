package mor.itas.application.usecase.workflow;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.infrastructure.security.ItasPrincipal;
import mor.itas.persistence.jpa.entity.workflow.*;
import mor.itas.persistence.jpa.repository.workflow.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Enterprise Configurable Workflow Execution Engine.
 * Manages state transitions, role-based task generation, SLA calculation,
 * mandatory return reasons, and audit trail generation for all TP audit artifacts.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WorkflowExecutionEngine {

    private final WorkflowDefinitionRepository definitionRepository;
    private final WorkflowStepRepository stepRepository;
    private final WorkflowInstanceRepository instanceRepository;
    private final WorkflowTaskRepository taskRepository;

    /**
     * Triggers a new workflow instance for an artifact (e.g., AUDIT_REPORT, INFO_REQUEST).
     */
    @Transactional
    public WorkflowInstanceEntity triggerWorkflow(
            UUID caseId, 
            UUID artifactId, 
            String artifactType, 
            String taskTitle, 
            ItasPrincipal actor) {

        log.info("Triggering workflow for artifactType={}, caseId={}, actor={}", artifactType, caseId, actor.getUsername());

        // 1. Locate active definition
        WorkflowDefinitionEntity definition = definitionRepository.findByCodeAndIsActiveTrue(artifactType)
            .orElseThrow(() -> new IllegalArgumentException("No active workflow definition found for code: " + artifactType));

        // 2. Fetch steps ordered by step_number
        List<WorkflowStepEntity> steps = stepRepository.findByDefinitionIdOrderByStepNumberAsc(definition.getId());
        if (steps.isEmpty()) {
            throw new IllegalStateException("Workflow definition " + artifactType + " has no configured steps!");
        }

        WorkflowStepEntity firstStep = steps.get(0);

        // 3. Create workflow instance
        WorkflowInstanceEntity instance = WorkflowInstanceEntity.builder()
            .definitionId(definition.getId())
            .caseId(caseId)
            .artifactId(artifactId)
            .artifactType(artifactType)
            .currentStepId(firstStep.getId())
            .currentStepNumber(firstStep.getStepNumber())
            .status("IN_PROGRESS")
            .initiatedBy(actor.getUserId())
            .startedAt(OffsetDateTime.now())
            .version(1)
            .build();

        instance = instanceRepository.save(instance);

        // 4. Create initial task for the first step
        createTaskForStep(instance, firstStep, caseId, artifactId, artifactType, taskTitle, actor.getOrgUnitId());

        return instance;
    }

    /**
     * Advances a workflow task upon decision (APPROVED, RETURNED, REJECTED).
     */
    @Transactional
    public WorkflowTaskEntity processTaskDecision(
            UUID taskId, 
            String decision, 
            String comments, 
            String returnReason, 
            ItasPrincipal actor) {

        log.info("Processing task decision taskId={}, decision={}, actor={}", taskId, decision, actor.getUsername());

        WorkflowTaskEntity task = taskRepository.findById(taskId)
            .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));

        if (!"PENDING".equals(task.getStatus())) {
            throw new IllegalStateException("Task " + taskId + " is already in state: " + task.getStatus());
        }

        // Validate mandatory return reason
        if ("RETURNED".equalsIgnoreCase(decision) && (returnReason == null || returnReason.isBlank())) {
            throw new IllegalArgumentException("Return reason is mandatory when returning a task for revision.");
        }

        // 1. Complete current task
        task.setStatus("COMPLETED");
        task.setDecision(decision.toUpperCase());
        task.setComments(comments);
        task.setReturnReason(returnReason);
        task.setCompletedBy(actor.getUserId());
        task.setCompletedAt(OffsetDateTime.now());
        taskRepository.save(task);

        // 2. Fetch instance & step configuration
        WorkflowInstanceEntity instance = instanceRepository.findById(task.getInstanceId())
            .orElseThrow(() -> new IllegalStateException("Workflow instance not found: " + task.getInstanceId()));

        WorkflowStepEntity currentStep = stepRepository.findById(task.getStepId())
            .orElseThrow(() -> new IllegalStateException("Step not found: " + task.getStepId()));

        List<WorkflowStepEntity> steps = stepRepository.findByDefinitionIdOrderByStepNumberAsc(instance.getDefinitionId());

        if ("APPROVED".equalsIgnoreCase(decision)) {
            // Find next step in chain
            int currentStepIndex = -1;
            for (int i = 0; i < steps.size(); i++) {
                if (steps.get(i).getId().equals(currentStep.getId())) {
                    currentStepIndex = i;
                    break;
                }
            }

            if (currentStepIndex >= 0 && currentStepIndex < steps.size() - 1) {
                // Advance to next step
                WorkflowStepEntity nextStep = steps.get(currentStepIndex + 1);
                instance.setCurrentStepId(nextStep.getId());
                instance.setCurrentStepNumber(nextStep.getStepNumber());
                instanceRepository.save(instance);

                createTaskForStep(instance, nextStep, task.getCaseId(), task.getArtifactId(), task.getArtifactType(), 
                        "Review " + task.getArtifactType() + " — " + nextStep.getStepName(), actor.getOrgUnitId());
            } else {
                // All approval steps complete!
                instance.setStatus("COMPLETED");
                instance.setCompletedAt(OffsetDateTime.now());
                instanceRepository.save(instance);
                log.info("Workflow instance {} COMPLETED successfully", instance.getId());
            }

        } else if ("RETURNED".equalsIgnoreCase(decision)) {
            // Return back to creator step (Step 1)
            WorkflowStepEntity firstStep = steps.get(0);
            instance.setCurrentStepId(firstStep.getId());
            instance.setCurrentStepNumber(firstStep.getStepNumber());
            instance.setStatus("RETURNED");
            instanceRepository.save(instance);

            // Re-assign task to original creator (Auditor)
            WorkflowTaskEntity returnTask = WorkflowTaskEntity.builder()
                .instanceId(instance.getId())
                .stepId(firstStep.getId())
                .caseId(task.getCaseId())
                .artifactId(task.getArtifactId())
                .artifactType(task.getArtifactType())
                .taskTitle("REVISED REQUIRED: " + task.getTaskTitle())
                .taskDescription("Returned by " + actor.getFullName() + ". Reason: " + returnReason)
                .assignedToUserId(instance.getInitiatedBy())
                .assignedToRole(firstStep.getAssignedRole())
                .status("PENDING")
                .priority("HIGH")
                .dueAt(OffsetDateTime.now().plusDays(2))
                .returnReason(returnReason)
                .build();

            taskRepository.save(returnTask);
            log.info("Workflow instance {} RETURNED to initiator {}", instance.getId(), instance.getInitiatedBy());

        } else if ("REJECTED".equalsIgnoreCase(decision)) {
            instance.setStatus("REJECTED");
            instance.setCompletedAt(OffsetDateTime.now());
            instanceRepository.save(instance);
            log.info("Workflow instance {} REJECTED", instance.getId());
        }

        return task;
    }

    private void createTaskForStep(
            WorkflowInstanceEntity instance, 
            WorkflowStepEntity step, 
            UUID caseId, 
            UUID artifactId, 
            String artifactType, 
            String title,
            String orgUnitIdStr) {

        UUID orgUnitUuid = null;
        if (orgUnitIdStr != null) {
            try { orgUnitUuid = UUID.fromString(orgUnitIdStr); } catch (Exception ignored) {}
        }

        OffsetDateTime dueAt = step.getSlaHours() != null 
            ? OffsetDateTime.now().plusHours(step.getSlaHours())
            : OffsetDateTime.now().plusDays(3);

        WorkflowTaskEntity task = WorkflowTaskEntity.builder()
            .instanceId(instance.getId())
            .stepId(step.getId())
            .caseId(caseId)
            .artifactId(artifactId)
            .artifactType(artifactType)
            .taskTitle(title)
            .taskDescription(step.getDescription())
            .assignedToRole(step.getAssignedRole())
            .assignedToOrgUnitId(orgUnitUuid)
            .status("PENDING")
            .priority("NORMAL")
            .dueAt(dueAt)
            .build();

        taskRepository.save(task);
    }
}
