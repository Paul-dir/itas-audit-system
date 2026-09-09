/**
 * StatusBadge Component
 * Display status with color coding
 */

export default function StatusBadge({ status, variant = 'status' }) {
  const getClasses = (status, variant) => {
    const statusMap = {
      PENDING: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
      ACTIVE: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      COMPLETED: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
      APPROVED: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
      REJECTED: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
      UNDER_REVIEW: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
      HELD: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
    };

    const riskMap = {
      HIGH: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
      MEDIUM: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
      LOW: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    };

    const map = variant === 'risk' ? riskMap : statusMap;
    return map[status?.toUpperCase()] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getClasses(status, variant)}`}>
      {status}
    </span>
  );
}
