package com.mor.itas.engineadapter.notification;

public interface NotificationEnginePort {
    void sendNotification(String userId, String message);
}
