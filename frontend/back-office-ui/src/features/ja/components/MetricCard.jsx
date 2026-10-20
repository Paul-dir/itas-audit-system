/**
 * MetricCard Component
 * Displays a single metric with icon and value
 */

export default function MetricCard({ title, value, subtitle, icon: Icon, color = 'blue', onClick, link }) {
  const colorClasses = {
    blue: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
    green: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20',
    purple: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20',
    red: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
  };

  const iconColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    red: 'text-red-600 dark:text-red-400',
  };

  const content = (
    <div className="flex items-start justify-between h-full">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`${iconColorClasses[color]}`}>
          <Icon size={32} />
        </div>
      )}
    </div>
  );

  if (link) {
    return (
      <a href={link} className={`p-6 rounded-lg border ${colorClasses[color]} cursor-pointer hover:shadow-md transition-shadow block`}>
        {content}
      </a>
    );
  }

  return (
    <div
      className={`p-6 rounded-lg border ${colorClasses[color]} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      {content}
    </div>
  );
}
