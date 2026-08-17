package com.mor.itas.engineadapter.notification;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("mock")
public class MockNotificationEngineAdapter implements NotificationEnginePort {

    @Override
    public void sendNotification(String userId, String message) {
        // Mock sending notification by doing nothing or logging
        System.out.println("Mock Notification sent to " + userId + ": " + message);
    }
}
