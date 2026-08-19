import React, { useState, useMemo } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import RoleLayout from '../layouts/RoleLayout';
import Badge from '../Badge';
import RoleDashboardShell from '../dashboard/RoleDashboardShell';
import SubmitAuditRequestForm from '../views/SubmitAuditRequestForm';
import MyRequestsView from '../views/MyRequestsView';
import { useAppData } from '../../hooks/useAppData';
import { getRoleLabel } from '../../config/navigation';

function RequesterDashboard({ userRole, onNavigate }) {
  const { data } = useAppData();

  const metrics = useMemo(() => {
    const requests = (data.auditRequests || data.requests || []).filter(
      (r) => !userRole || r.submittedBy === userRole || true
    );
    const pending = requests.filter((r) => r.status === 'PENDING' || r.status === 'pending').length;
    const approved = requests.filter((r) => r.status === 'APPROVED' || r.status === 'approved').length;
    const total = requests.length;
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

    return {
      summaryMetrics: [
        {
          id: 'total',
          title: 'Total requests',
          value: total,
          subtitle: 'audit requests submitted',
          color: 'blue',
          progress: Math.min(100, total * 20),
        },
        {
          id: 'pending',
          title: 'Pending review',
          value: pending,
          subtitle: 'awaiting process owner review',
          color: 'amber',
          progress: total > 0 ? Math.round((pending / total) * 100) : 0,
        },
        {
          id: 'approved',
          title: 'Approval rate',
          value: `${approvalRate}%`,
          subtitle: `${approved} of ${total} requests approved`,
          color: 'teal',
          progress: approvalRate,
        },
      ],
      bottomMetrics: [
        { id: 'pending', label: 'Pending', value: pending, color: 'amber' },
        { id: 'approved', label: 'Approved', value: approved, color: 'teal' },
        { id: 'total', label: 'Total requests', value: total, color: 'blue' },
      ],
    };
  }, [data, userRole]);

  return (
    <div className="space-y-6">
      <RoleDashboardShell
        summaryMetrics={metrics.summaryMetrics}
        bottomMetrics={metrics.bottomMetrics}
      />

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
        <p className="mb-2 text-sm font-semibold text-blue-300">
          <i className="fas fa-info-circle mr-2" />
          Audit Request System
        </p>
        <p className="text-xs leading-relaxed text-slate-400">
          Submit audit requests for taxpayers requiring audit. Your requests will be reviewed
          and approved by the Process Owner. Once approved, audit cases will be created and
          assigned for execution.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onNavigate('submit-request')}
          className="rounded-xl border border-slate-800/80 bg-[#161f28] p-6 text-center transition-all duration-200 hover:border-emerald-500/40 hover:bg-emerald-500/5"
        >
          <i className="fas fa-plus-circle mb-3 block text-3xl text-emerald-400" />
          <h3 className="mb-1 text-base font-semibold text-slate-100">Submit new request</h3>
          <p className="text-xs text-slate-500">Create a new audit request</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('my-requests')}
          className="rounded-xl border border-slate-800/80 bg-[#161f28] p-6 text-center transition-all duration-200 hover:border-blue-500/40 hover:bg-blue-500/5"
        >
          <i className="fas fa-list mb-3 block text-3xl text-blue-400" />
          <h3 className="mb-1 text-base font-semibold text-slate-100">My requests</h3>
          <p className="text-xs text-slate-500">View and manage your requests</p>
        </button>
      </div>
    </div>
  );
}

function RequesterDashboardView({ userRole }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const roleLabel = getRoleLabel(userRole);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <RequesterDashboard userRole={userRole} onNavigate={setCurrentView} />;
      case 'submit-request':
        return <SubmitAuditRequestForm userRole={userRole} />;
      case 'my-requests':
        return <MyRequestsView userRole={userRole} />;
      default:
        return <RequesterDashboard userRole={userRole} onNavigate={setCurrentView} />;
    }
  };

  return (
    <ProtectedRoute requiredRoles={[userRole]}>
      <RoleLayout currentView={currentView} onNavigate={setCurrentView}>
        {currentView !== 'dashboard' && (
          <div className="mb-4">
            <Badge status={roleLabel} className="director-approved" />
          </div>
        )}
        {renderContent()}
      </RoleLayout>
    </ProtectedRoute>
  );
}

export default RequesterDashboardView;
