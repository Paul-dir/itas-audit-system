package com.mor.itas.infrastructure.notification;

public interface NotificationEnginePort {
    void sendNotification(String userId, String message);
}
