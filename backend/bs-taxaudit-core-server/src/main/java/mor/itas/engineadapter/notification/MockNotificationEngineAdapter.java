package mor.itas.engineadapter.notification;

import mor.itas.application.port.outboundport.notification.NotificationEnginePort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Mock Notification Engine Adapter
 * In development/test mode, logs notifications and stores them in-memory
 * for verification. In production, this would integrate with an actual
 * notification service (email, SMS, push).
 *
 * Supports committee-specific notification types:
 *   - VOTE_CAST: Notify case owner when a vote is cast
 *   - OWNERSHIP_CHANGED: Notify when case ownership changes
 *   - SLA_WARNING: Warn members when SLA is approaching
 *   - SLA_BREACH: Alert when SLA is breached
 *   - HANDOFF_READY: Notify team leader of new handoff
 *   - SESSION_REMINDER: Remind members of upcoming sessions
 *   - RESEARCH_NOTE_ADDED: Notify case subscribers of new notes
 */
@Component
@Profile({"mock", "test"})
@Slf4j
public class MockNotificationEngineAdapter implements NotificationEnginePort {

    /** In-memory notification store for testing verification */
    private final Map<String, List<StoredNotification>> notificationStore = new ConcurrentHashMap<>();

    @Override
    public void sendNotification(String userId, String message) {
        StoredNotification notification = new StoredNotification(
                userId,
                message,
                "GENERAL",
                OffsetDateTime.now()
        );
        notificationStore.computeIfAbsent(userId, k -> Collections.synchronizedList(new ArrayList<>()))
                .add(notification);
        log.info("[NOTIFICATION] To: {} | Message: {}", userId, message);
    }

    /**
     * Send a typed committee notification.
     */
    public void sendCommitteeNotification(String userId, String type, String message, Map<String, Object> metadata) {
        StoredNotification notification = new StoredNotification(
                userId,
                message,
                type,
                OffsetDateTime.now()
        );
        notification.metadata = metadata;
        notificationStore.computeIfAbsent(userId, k -> Collections.synchronizedList(new ArrayList<>()))
                .add(notification);
        log.info("[NOTIFICATION] To: {} | Type: {} | Message: {}", userId, type, message);
    }

    /**
     * Send SLA warning to all committee members on a case.
     */
    public void sendSLAWarning(List<String> userIds, String caseCode, long hoursRemaining) {
        String message = String.format(
                "⚠️ SLA WARNING: Case %s has less than %d hours remaining before deadline. Please take immediate action.",
                caseCode, hoursRemaining
        );
        userIds.forEach(uid -> sendCommitteeNotification(uid, "SLA_WARNING", message, Map.of(
                "caseCode", caseCode,
                "hoursRemaining", hoursRemaining
        )));
    }

    /**
     * Send SLA breach alert to chairperson and case owner.
     */
    public void sendSLABreach(List<String> userIds, String caseCode) {
        String message = String.format(
                "🚨 SLA BREACH: Case %s has exceeded its deadline. Immediate action required.",
                caseCode
        );
        userIds.forEach(uid -> sendCommitteeNotification(uid, "SLA_BREACH", message, Map.of(
                "caseCode", caseCode
        )));
    }

    /**
     * Notify team leader of a new handoff.
     */
    public void sendHandoffNotification(String teamLeadUserId, String caseCode, String chairpersonName) {
        String message = String.format(
                "📋 NEW HANDOFF: Chairperson %s has transferred case %s to the Execution Workspace. You have been appointed as Team Leader.",
                chairpersonName, caseCode
        );
        sendCommitteeNotification(teamLeadUserId, "HANDOFF_READY", message, Map.of(
                "caseCode", caseCode,
                "chairperson", chairpersonName
        ));
    }

    /**
     * Notify case subscribers when a research note is added.
     */
    public void sendResearchNoteNotification(List<String> userIds, String caseCode, String authorName) {
        String message = String.format(
                "📝 New research note added to case %s by %s",
                caseCode, authorName
        );
        userIds.forEach(uid -> sendCommitteeNotification(uid, "RESEARCH_NOTE_ADDED", message, Map.of(
                "caseCode", caseCode,
                "author", authorName
        )));
    }

    /**
     * Get all notifications for a user (for testing).
     */
    public List<StoredNotification> getNotificationsForUser(String userId) {
        return notificationStore.getOrDefault(userId, Collections.emptyList());
    }

    /**
     * Get notification count for a user (for testing).
     */
    public int getNotificationCount(String userId) {
        return getNotificationsForUser(userId).size();
    }

    /**
     * Clear all notifications (for test cleanup).
     */
    public void clearAll() {
        notificationStore.clear();
    }

    /**
     * Stored notification record for testing.
     */
    public static class StoredNotification {
        public final String userId;
        public final String message;
        public final String type;
        public final OffsetDateTime sentAt;
        public Map<String, Object> metadata;

        public StoredNotification(String userId, String message, String type, OffsetDateTime sentAt) {
            this.userId = userId;
            this.message = message;
            this.type = type;
            this.sentAt = sentAt;
        }

        @Override
        public String toString() {
            return "StoredNotification{userId='" + userId + "', type='" + type + "', message='" + message + "'}";
        }
    }
}
