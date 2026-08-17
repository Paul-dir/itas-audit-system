package mor.itas.application.port.outboundport.notification;

public interface NotificationEnginePort {
    void sendNotification(String userId, String message);
}
