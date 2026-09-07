package mor.itas.application.service.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.persistence.jpa.entity.identity.UserEntity;
import mor.itas.persistence.jpa.entity.notification.NotificationEntity;
import mor.itas.persistence.jpa.repository.identity.UserRepository;
import mor.itas.persistence.jpa.repository.notification.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * Resolves all possible identifier forms for a user (username, email, UUID string)
     * so that notifications can be queried and matched reliably.
     */
    public Set<String> resolveUserIdentifiers(String actorId) {
        Set<String> ids = new LinkedHashSet<>();
        if (actorId == null || actorId.isBlank()) return ids;

        String trimmed = actorId.trim();
        ids.add(trimmed);
        ids.add(trimmed.toLowerCase());

        try {
            // Try UUID lookup
            try {
                UUID uuid = UUID.fromString(trimmed);
                userRepository.findById(uuid).ifPresent(u -> {
                    if (u.getUsername() != null) ids.add(u.getUsername().toLowerCase());
                    if (u.getEmail() != null) ids.add(u.getEmail().toLowerCase());
                });
            } catch (IllegalArgumentException ignored) {}

            // Try username lookup
            userRepository.findByUsername(trimmed).ifPresent(u -> {
                ids.add(u.getId().toString());
                if (u.getEmail() != null) ids.add(u.getEmail().toLowerCase());
            });

            // Try email lookup
            userRepository.findByEmail(trimmed).ifPresent(u -> {
                ids.add(u.getId().toString());
                if (u.getUsername() != null) ids.add(u.getUsername().toLowerCase());
            });
        } catch (Exception e) {
            log.warn("Error resolving user identifiers for {}: {}", actorId, e.getMessage());
        }

        return ids;
    }

    /**
     * Send a targeted notification to a specific recipient user.
     */
    @Transactional
    public NotificationEntity sendNotification(
            String recipientUserId,
            String type,
            String title,
            String body,
            UUID caseId,
            UUID taskId,
            String artifactType,
            UUID artifactId) {

        if (recipientUserId == null || recipientUserId.isBlank()) {
            log.warn("Cannot send notification: recipientUserId is null or blank");
            return null;
        }

        NotificationEntity entity = NotificationEntity.builder()
                .recipientUserId(recipientUserId.trim().toLowerCase())
                .notificationType(type != null ? type : "INFO")
                .title(title)
                .body(body)
                .caseId(caseId)
                .taskId(taskId)
                .artifactType(artifactType)
                .artifactId(artifactId)
                .isRead(false)
                .createdAt(OffsetDateTime.now())
                .build();

        NotificationEntity saved = notificationRepository.save(entity);
        log.info("Sent targeted notification [{}] to user {}: {}", type, recipientUserId, title);
        return saved;
    }

    /**
     * Get all notifications for a specific user (ordered newest first).
     */
    @Transactional(readOnly = true)
    public List<NotificationEntity> getUserNotifications(String actorId) {
        Set<String> ids = resolveUserIdentifiers(actorId);
        if (ids.isEmpty()) return List.of();
        return notificationRepository.findByRecipientUserIdInOrderByCreatedAtDesc(ids);
    }

    /**
     * Get unread notification count for a specific user.
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(String actorId) {
        Set<String> ids = resolveUserIdentifiers(actorId);
        if (ids.isEmpty()) return 0L;
        return notificationRepository.countByRecipientUserIdInAndIsReadFalse(ids);
    }

    /**
     * Mark a single notification as read.
     */
    @Transactional
    public boolean markAsRead(UUID notificationId, String actorId) {
        return notificationRepository.findById(notificationId).map(n -> {
            n.setRead(true);
            n.setReadAt(OffsetDateTime.now());
            notificationRepository.save(n);
            return true;
        }).orElse(false);
    }

    /**
     * Mark all notifications for this user as read.
     */
    @Transactional
    public int markAllAsRead(String actorId) {
        Set<String> ids = resolveUserIdentifiers(actorId);
        if (ids.isEmpty()) return 0;
        return notificationRepository.markAllAsRead(ids, OffsetDateTime.now());
    }
}
