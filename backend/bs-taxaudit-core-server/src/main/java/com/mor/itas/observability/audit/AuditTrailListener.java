package com.mor.itas.observability.audit;

import com.mor.itas.persistence.jpa.entity.shared.AuditTrailEntity;
import jakarta.persistence.EntityManager;
import org.hibernate.event.spi.PostInsertEvent;
import org.hibernate.event.spi.PostInsertEventListener;
import org.hibernate.event.spi.PostUpdateEvent;
import org.hibernate.event.spi.PostUpdateEventListener;
import org.hibernate.persister.entity.EntityPersister;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.UUID;

@Component
public class AuditTrailListener implements PostInsertEventListener, PostUpdateEventListener {

    @Override
    public void onPostInsert(PostInsertEvent event) {
        logAudit(event.getEntity(), event.getId(), "INSERT", event.getSession());
    }

    @Override
    public void onPostUpdate(PostUpdateEvent event) {
        logAudit(event.getEntity(), event.getId(), "UPDATE", event.getSession());
    }

    private void logAudit(Object entity, Object entityId, String action, EntityManager em) {
        if (entity instanceof AuditTrailEntity) return; // Prevent infinite loop

        AuditTrailEntity audit = new AuditTrailEntity();
        audit.setEntityType(entity.getClass().getSimpleName());
        audit.setEntityId(entityId instanceof UUID ? (UUID) entityId : UUID.randomUUID());
        audit.setActorId(ActorContextHolder.getActorId());
        audit.setAction(action);
        audit.setOccurredAt(OffsetDateTime.now());

        // We persist it natively to avoid triggering events again
        em.persist(audit);
    }

    @Override
    public boolean requiresPostCommitHandling(EntityPersister persister) {
        return false;
    }
}
