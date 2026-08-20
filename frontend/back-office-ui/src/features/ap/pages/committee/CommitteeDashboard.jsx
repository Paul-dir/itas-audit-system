import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card } from '../../../../components/Card.jsx';
import { Badge } from '../../../../components/Badge.jsx';
import { AlertCircle, CheckCircle2, FileText } from 'lucide-react';

export default function CommitteeDashboard({ view }) {
  const { user } = useAuth();

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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Pending Reviews</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">12</p>
            </div>
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Approved</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">28</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Reports</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">5</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
      </div>

      {/* Committee Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Committee Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Committee Member</p>
            <p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Audit Type</p>
            <p className="text-gray-900 dark:text-white font-medium capitalize">{user.auditType?.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Region</p>
            <p className="text-gray-900 dark:text-white font-medium capitalize">{user.region?.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Tax Center</p>
            <p className="text-gray-900 dark:text-white font-medium capitalize">{user.taxCenter?.replace(/_/g, ' ')}</p>
          </div>
        </div>
      </Card>

      {/* Recent Activities */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-900 dark:text-white font-medium">Approved Case Review</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-900 dark:text-white font-medium">Pending Review - Joint Audit</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-900 dark:text-white font-medium">Submitted Committee Report</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
