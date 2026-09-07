package mor.itas.persistence.jpa.repository.notification;

import mor.itas.persistence.jpa.entity.notification.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, UUID> {

    List<NotificationEntity> findByRecipientUserIdOrderByCreatedAtDesc(String recipientUserId);

    List<NotificationEntity> findByRecipientUserIdInOrderByCreatedAtDesc(Collection<String> recipientUserIds);

    long countByRecipientUserIdAndIsReadFalse(String recipientUserId);

    @Query("SELECT COUNT(n) FROM NotificationEntity n WHERE n.recipientUserId IN :recipientUserIds AND n.isRead = false")
    long countByRecipientUserIdInAndIsReadFalse(@Param("recipientUserIds") Collection<String> recipientUserIds);

    @Modifying
    @Query("UPDATE NotificationEntity n SET n.isRead = true, n.readAt = :readAt WHERE n.recipientUserId IN :recipientUserIds AND n.isRead = false")
    int markAllAsRead(@Param("recipientUserIds") Collection<String> recipientUserIds, @Param("readAt") OffsetDateTime readAt);
}
