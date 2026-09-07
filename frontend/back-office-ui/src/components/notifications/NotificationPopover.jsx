import React, { useState } from 'react';
import { 
  Bell, CheckCheck, Clock, Briefcase, CheckSquare, 
  AlertCircle, ExternalLink, X, ChevronRight, Inbox, ShieldAlert
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

function formatTimeAgo(isoString) {
  if (!isoString) return '';
  const now = new Date();
  const date = new Date(isoString);
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NotificationPopover({
  isOpen,
  onClose,
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenTasksModal,
  onNavigate
}) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'ASSIGNMENT' | 'WORKFLOW'

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-slate-800' : 'bg-white';
  const borderColor = isDark ? 'border-slate-700' : 'border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtextColor = isDark ? 'text-slate-400' : 'text-gray-500';
  const hoverBg = isDark ? 'hover:bg-slate-700/70' : 'hover:bg-gray-50';
  const itemUnreadBg = isDark ? 'bg-blue-950/20' : 'bg-blue-50/40';

  const isAssignment = (type) => type === 'CASE_ASSIGNMENT' || type === 'AUDIT_ASSIGNMENT';
  const isWorkflow = (type) => type === 'WORKFLOW_TASK' || type === 'STATUS_CHANGE' || type === 'REVIEW_REQUEST';

  const filteredNotifications = notifications.filter(item => {
    if (filter === 'ASSIGNMENT') return isAssignment(item.notificationType);
    if (filter === 'WORKFLOW') return isWorkflow(item.notificationType);
    return true;
  });

  const getIconForType = (type) => {
    if (isAssignment(type)) {
      return <Briefcase size={16} className="text-blue-500" />;
    }
    if (isWorkflow(type)) {
      return <CheckSquare size={16} className="text-amber-500" />;
    }
    if (type === 'DEADLINE_ALERT') {
      return <AlertCircle size={16} className="text-rose-500" />;
    }
    return <Bell size={16} className="text-indigo-400" />;
  };

  const handleItemClick = (notification) => {
    if (!notification.read && !notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (isWorkflow(notification.notificationType) || notification.taskId) {
      if (onOpenTasksModal) {
        onClose();
        onOpenTasksModal();
      }
    } else if (notification.caseId && onNavigate) {
      onClose();
      if (user?.role === 'tax_center_manager') {
        onNavigate('cases');
      } else {
        onNavigate('dashboard');
      }
    }
  };

  return (
    <div 
      className={`absolute right-0 mt-2 w-96 max-w-[95vw] rounded-2xl border ${borderColor} ${bgColor} shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col overflow-hidden`}
      style={{ maxHeight: 'calc(100vh - 80px)' }}
    >
      {/* Header */}
      <div className={`p-4 border-b ${borderColor} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell size={18} className="text-blue-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </div>
          <div>
            <h3 className={`text-sm font-bold ${textColor} flex items-center gap-2`}>
              Notifications
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-500 text-white rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <p className={`text-[11px] ${subtextColor}`}>
              Targeted for {user?.name || user?.username || 'user'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className={`p-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition flex items-center gap-1`}
              title="Mark all as read"
            >
              <CheckCheck size={14} />
              <span className="hidden sm:inline text-[11px]">Mark read</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg ${hoverBg} ${subtextColor} transition`}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={`px-4 py-2 border-b ${borderColor} flex items-center gap-2 text-xs`}>
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`px-2.5 py-1 rounded-md font-medium transition ${
            filter === 'ALL'
              ? 'bg-blue-600 text-white shadow-sm'
              : `${subtextColor} ${hoverBg}`
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('ASSIGNMENT')}
          className={`px-2.5 py-1 rounded-md font-medium transition ${
            filter === 'ASSIGNMENT'
              ? 'bg-blue-600 text-white shadow-sm'
              : `${subtextColor} ${hoverBg}`
          }`}
        >
          Assignments ({notifications.filter(n => isAssignment(n.notificationType)).length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('WORKFLOW')}
          className={`px-2.5 py-1 rounded-md font-medium transition ${
            filter === 'WORKFLOW'
              ? 'bg-blue-600 text-white shadow-sm'
              : `${subtextColor} ${hoverBg}`
          }`}
        >
          Tasks ({notifications.filter(n => isWorkflow(n.notificationType)).length})
        </button>
      </div>

      {/* Notification List */}
      <div className="overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700/50 flex-1 max-h-[380px]">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-700/50 mx-auto flex items-center justify-center text-blue-500 mb-3">
              <Inbox size={22} />
            </div>
            <p className={`text-sm font-semibold ${textColor}`}>No notifications</p>
            <p className={`text-xs ${subtextColor} mt-1`}>
              You're all caught up! New case assignments and workflow requests for your queue will appear here.
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => {
            const isRead = n.read || n.isRead;
            return (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`p-3.5 transition-all cursor-pointer flex gap-3 items-start ${
                  !isRead ? itemUnreadBg : hoverBg
                }`}
              >
                <div className="mt-0.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex-shrink-0">
                  {getIconForType(n.notificationType)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className={`text-xs font-semibold ${textColor} truncate`}>
                      {n.title}
                    </p>
                    <span className={`text-[10px] whitespace-nowrap ${subtextColor} flex items-center gap-1`}>
                      <Clock size={10} />
                      {formatTimeAgo(n.createdAt)}
                    </span>
                  </div>

                  <p className={`text-xs ${subtextColor} line-clamp-2 leading-relaxed`}>
                    {n.body}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {n.notificationType?.replace(/_/g, ' ')}
                    </span>

                    <div className="flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                      <span>View</span>
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </div>

                {!isRead && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer with link to Task Queue */}
      <div className={`p-3 border-t ${borderColor} bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between text-xs`}>
        <button
          type="button"
          onClick={() => {
            onClose();
            if (onOpenTasksModal) onOpenTasksModal();
          }}
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1.5"
        >
          <CheckSquare size={13} />
          <span>Open Workflow Tasks Queue</span>
        </button>

        <span className="text-[10px] text-slate-400">
          Real-time user isolation
        </span>
      </div>
    </div>
  );
}
