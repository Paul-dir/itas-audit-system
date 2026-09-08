/**
 * useNotifications Hook
 * Subscribes to the global SSE event stream and provides real-time notifications.
 * Listens for: case_assigned, activity, and other events from the backend.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const SSE_ENDPOINT = '/api/v1/backoffice/ap/committee/events';

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    const entry = {
      id,
      read: false,
      timestamp: new Date().toISOString(),
      ...notification,
    };

    setNotifications((prev) => [entry, ...prev.slice(0, 49)]); // keep last 50
    setUnreadCount((prev) => prev + 1);
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    if (!userId) return;

    function connect() {
      try {
        const es = new EventSource(SSE_ENDPOINT);
        eventSourceRef.current = es;

        es.addEventListener('connected', () => {
          setConnected(true);
          console.log('[Notifications] SSE connected');
        });

        // Listen for case assignment events
        es.addEventListener('case_assigned', (event) => {
          try {
            const data = JSON.parse(event.data);
            // Only notify the assigned auditor (or everyone for now)
            if (data.auditorId === userId || !data.auditorId) {
              addNotification({
                type: 'case_assigned',
                title: 'New Case Assigned',
                message: `You have been assigned a new audit case.`,
                caseId: data.caseId,
                auditorId: data.auditorId,
                teamLeaderId: data.teamLeaderId,
                icon: '📋',
              });
            }
          } catch (err) {
            console.warn('[Notifications] Failed to parse case_assigned:', err);
          }
        });

        // Listen for generic activity events
        es.addEventListener('activity', (event) => {
          try {
            const data = JSON.parse(event.data);
            addNotification({
              type: data.type || 'activity',
              title: data.action || 'Activity Update',
              message: data.action || 'New activity on your cases',
              caseId: data.caseId,
              icon: data.type === 'assignment' ? '👤' : data.type === 'status_change' ? '🔄' : '📢',
            });
          } catch (err) {
            console.warn('[Notifications] Failed to parse activity:', err);
          }
        });

        // Listen for status change events
        es.addEventListener('case_status_changed', (event) => {
          try {
            const data = JSON.parse(event.data);
            addNotification({
              type: 'status_change',
              title: 'Case Status Updated',
              message: `Status changed: ${data.oldStatus} → ${data.newStatus}`,
              caseId: data.caseId,
              icon: '🔄',
            });
          } catch (err) {
            console.warn('[Notifications] Failed to parse status change:', err);
          }
        });

        es.onerror = () => {
          setConnected(false);
          console.warn('[Notifications] SSE connection error — will reconnect in 5s');
          es.close();
          eventSourceRef.current = null;
          reconnectTimeoutRef.current = setTimeout(connect, 5000);
        };
      } catch (err) {
        console.warn('[Notifications] Failed to create EventSource:', err);
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      }
    }

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      setConnected(false);
    };
  }, [userId, addNotification]);

  return {
    notifications,
    unreadCount,
    connected,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };
}
