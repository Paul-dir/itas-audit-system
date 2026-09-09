/**
 * StatusBadge Component
 * Display status with color coding for team leader cases
 */

export default function StatusBadge({ status, variant = 'status' }) {
  const getClasses = (status, variant) => {
    const statusMap = {
      PENDING: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
      ASSIGNED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      IN_PROGRESS: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      COMPLETED: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      CLOSED: 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200',
      TEAM_ASSIGNED: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
      PENDING_HANDOFF: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
      HANDED_OFF: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    };

    const riskMap = {
      CRITICAL: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
      HIGH: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
      MEDIUM: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
      LOW: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    };

    const map = variant === 'risk' ? riskMap : statusMap;
    return map[status?.toUpperCase()] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
  };

  const getLabel = (status) => {
    const labels = {
      PENDING: 'Pending',
      ASSIGNED: 'Assigned',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed',
      CLOSED: 'Closed',
      TEAM_ASSIGNED: 'Team Assigned',
      PENDING_HANDOFF: 'Pending Handoff',
      HANDED_OFF: 'Handed Off',
    };
    return labels[status?.toUpperCase()] || status;
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getClasses(status, variant)}`}>
      {getLabel(status)}
    </span>
  );
}
