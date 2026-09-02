import { useAuth } from '../../../../context/AuthContext.jsx';
import TeamLeaderDashboard from '../teamleader/TeamLeaderDashboard.jsx';
import Card from '../../../../components/Card.jsx';
import Badge from '../../../../components/Badge.jsx';
import { AlertCircle, CheckCircle2, FileText } from 'lucide-react';

export default function CommitteeDashboard({ view }) {
  const { user } = useAuth();

  if (view === 'reviews') {
    return <TeamLeaderDashboard />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Committee Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {user.auditType && `Audit Type: ${user.auditType.replace(/_/g, ' ')}`}
            {user.region && ` • Region: ${user.region}`}
            {user.taxCenter && ` • Tax Center: ${user.taxCenter}`}
          </p>
        </div>
      </div>

      {/* Case Management View for Committee Members */}
      <TeamLeaderDashboard />
    </div>
  );
}
