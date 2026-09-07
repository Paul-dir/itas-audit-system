package mor.itas.persistence.jpa.repository.workflow;

import mor.itas.persistence.jpa.entity.workflow.WorkflowTaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface WorkflowTaskRepository extends JpaRepository<WorkflowTaskEntity, UUID> {

    /**
     * Task inbox query: returns all PENDING tasks for a given user
     * — either directly assigned or routable to the user by role.
     */
    @Query("""
        SELECT t FROM WorkflowTaskEntity t
        WHERE t.status = 'PENDING'
          AND (t.assignedToUserId IN :userIds OR t.assignedToRole IN :roles)
        ORDER BY t.priority DESC, t.dueAt ASC NULLS LAST, t.createdAt ASC
        """)
    List<WorkflowTaskEntity> findPendingTasksForUser(
        @Param("userIds") Collection<String> userIds,
        @Param("roles") List<String> roles
    );

    /** All tasks (any status) associated with a specific audit case. */
    List<WorkflowTaskEntity> findByCaseIdOrderByCreatedAtAsc(UUID caseId);

    /** Count of pending tasks assigned to a role — used for dashboard badges. */
    @Query("SELECT COUNT(t) FROM WorkflowTaskEntity t WHERE t.status = 'PENDING' AND t.assignedToRole = :role")
    long countPendingByRole(@Param("role") String role);

    /** Count pending tasks for a specific user (direct + role). */
    @Query("""
        SELECT COUNT(t) FROM WorkflowTaskEntity t
        WHERE t.status = 'PENDING'
          AND (t.assignedToUserId IN :userIds OR t.assignedToRole IN :roles)
        """)
    long countPendingForUser(@Param("userIds") Collection<String> userIds, @Param("roles") List<String> roles);
}
