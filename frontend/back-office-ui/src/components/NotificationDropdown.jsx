/**
 * NotificationDropdown
 * Bell icon with badge count and dropdown list of notifications.
 * Receives notifications from useNotifications hook via props.
 */

import { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, X, Wifi, WifiOff } from 'lucide-react';

export default function NotificationDropdown({
  notifications = [],
  unreadCount = 0,
  connected = false,
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title={connected ? 'Notifications connected' : 'Notifications offline'}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
              {connected ? (
                <Wifi size={12} className="text-green-500" title="Connected" />
              ) : (
                <WifiOff size={12} className="text-red-400" title="Disconnected" />
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="p-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                  title="Mark all as read"
                >
                  <CheckCheck size={14} />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={onClear}
                  className="p-1 text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Clear all"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell size={24} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    if (!notification.read && onMarkAsRead) {
                      onMarkAsRead(notification.id);
                    }
                  }}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
                    notification.read
                      ? 'bg-white dark:bg-gray-800'
                      : 'bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">{notification.icon || '📢'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${
                        notification.read
                          ? 'text-gray-700 dark:text-gray-300'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {unreadCount} unread of {notifications.length} total
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
