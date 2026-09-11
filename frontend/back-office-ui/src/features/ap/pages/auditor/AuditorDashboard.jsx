/**
 * AuditorDashboard - Redesigned to match Team Leader dashboard layout
 * 
 * Dashboard shows: welcome banner, metric cards, active work, audit summary
 * "My Audit Cases" uses a table layout matching Team Leader's My Cases
 */

import { useState, useMemo, useCallback } from 'react';
import {
  Search, Clock, CheckCircle, PlayCircle, Eye, FileText, AlertTriangle,
  BarChart3, RefreshCw, Loader2, ArrowRight, Calendar, Users, Briefcase,
  TrendingUp, AlertCircle, ChevronRight, ChevronLeft, Filter, LayoutGrid, List,
  FileSearch, Cpu, TestTube, MessageSquare, Target, Activity, Download, ClipboardCheck, Database,
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { useWorkflow } from '../../../teamleader/context/WorkflowContext.jsx';
import { Card, StatCard, Button, Badge, Input, Empty, Alert } from '../../../../components/ui/index.jsx';
import MetricCard from '../../../teamleader/components/MetricCard';
import StatusBadge from '../../../teamleader/components/StatusBadge';
import { AUDIT_TYPES, CASE_STATUS } from '../../data/constants.js';
import { WORKFLOW_STEPS } from '../../../teamleader/data/workflowConstants.js';
import useAuditorData from './hooks/useAuditorData.js';
import AuditorWorkspace from './AuditorWorkspace.jsx';

// ── Risk Level Colors ────────────────────────────────────────────────────────
const RISK_COLORS = {
  CRITICAL: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  HIGH:     { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' },
  MEDIUM:   { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
  LOW:      { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
};

// ── Risk Badge Helper ────────────────────────────────────────────────────────
function getRiskBadge(risk) {
  const riskLower = risk?.toLowerCase();
  if (riskLower === 'critical' || riskLower === 'high') return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded text-xs font-medium"><span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400"></span> {risk}</span>;
  if (riskLower === 'medium') return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 rounded text-xs font-medium"><span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400"></span> {risk}</span>;
  if (riskLower === 'low') return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200 rounded text-xs font-medium"><span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400"></span> {risk}</span>;
  return <span className="text-gray-600 dark:text-gray-400">N/A</span>;
}

// ── Segment Badge Helper ─────────────────────────────────────────────────────
function getSegmentBadge(segment) {
  const segmentUpper = segment?.toUpperCase();
  if (segmentUpper === 'LARGE') return <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded-full text-xs font-semibold">LTO</span>;
  if (segmentUpper === 'MEDIUM') return <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 rounded-full text-xs font-semibold">MTO</span>;
  if (segmentUpper === 'SMALL') return <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200 rounded-full text-xs font-semibold">STO</span>;
  return <span className="text-gray-600 dark:text-gray-400">N/A</span>;
}

// ── Cases View (Table Layout matching Team Leader) ───────────────────────
function CasesView({ cases, loading, refreshing, error, refresh, onExecuteCase }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesSearch = !search || 
        c.taxpayerName?.toLowerCase().includes(search.toLowerCase()) ||
        c.taxpayerId?.includes(search) ||
        c.tin?.includes(search) ||
        c.caseNumber?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All Statuses' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [cases, search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Audit Cases</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Cases assigned to you by your Team Leader. Click <strong>Continue Audit</strong> to proceed with the workflow.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={refresh} disabled={refreshing} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium">
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by taxpayer name, TIN, or case number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Statuses</option>
              <option>ASSIGNED</option>
              <option>IN_PROGRESS</option>
              <option>COMPLETED</option>
              <option>CONCLUDED</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Cases Table */}
      {!loading && filteredCases.length > 0 && (
        <div className="overflow-x-auto">
          <Card className="p-0 border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Case ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Taxpayer (TIN & Segment)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Workflow Step</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCases.map((caseItem) => {
                  const caseId = caseItem.id || caseItem.caseId;
                  const currentStep = caseItem.currentStep || 'PLANNING';
                  const stepName = WORKFLOW_STEPS.find(s => s.id === currentStep)?.label || currentStep;

                  return (
                    <tr key={caseId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {caseItem.caseNumber || `AU-${String(caseId).substring(0, 8)}`}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{caseItem.taxpayerName || 'Taxpayer'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">TIN: {caseItem.taxpayerId || caseItem.tin || 'N/A'}</div>
                        <div className="mt-2">{getSegmentBadge(caseItem.segment || caseItem.sector)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded text-xs font-medium">
                          AP System
                        </span>
                      </td>
                      <td className="px-6 py-4">{getRiskBadge(caseItem.riskPriority || caseItem.riskLevel)}</td>
                      <td className="px-6 py-4"><StatusBadge status={caseItem.status} /></td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{stepName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onExecuteCase(caseItem)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm shadow-blue-500/20"
                          >
                            <PlayCircle size={14} />
                            Continue Audit
                          </button>
                          <button
                            onClick={() => onExecuteCase(caseItem)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                          >
                            <Eye size={14} />
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCases.length === 0 && (
        <Card className="p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">No cases found</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {cases.length === 0
              ? "Cases will appear here once your Team Leader assigns them to you."
              : 'Try adjusting your filters or search criteria'}
          </p>
        </Card>
      )}

      {/* Pagination Footer */}
      {!loading && filteredCases.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredCases.length} of {cases.length} cases.
          </div>
        </div>
      )}
    </div>
  );
}

// ── Active Work Item ─────────────────────────────────────────────────────────
function ActiveWorkItem({ caseItem, onExecute }) {
  const risk = RISK_COLORS[caseItem.riskPriority] || RISK_COLORS.MEDIUM;
  const currentStep = caseItem.currentStep || 'PLANNING';
  const stepIdx = WORKFLOW_STEPS.findIndex(s => s.id === currentStep);
  const progress = stepIdx >= 0 ? Math.round(((stepIdx) / WORKFLOW_STEPS.length) * 100) : 0;

  return (
    <div
      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer group"
      onClick={() => onExecute(caseItem)}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${risk.bg}`}>
        <span className={`text-xs font-bold ${risk.text}`}>
          {(caseItem.taxpayerName || 'TX')[0]}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {caseItem.taxpayerName || 'Taxpayer'}
          </h4>
          <Badge color={caseItem.riskPriority === 'HIGH' ? 'red' : caseItem.riskPriority === 'CRITICAL' ? 'red' : 'yellow'} dot>
            {caseItem.riskPriority || '—'}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{caseItem.taxpayerId || caseItem.tin || '—'}</span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            {WORKFLOW_STEPS.find(s => s.id === currentStep)?.label || currentStep}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
    </div>
  );
}

// ── Activity Item ────────────────────────────────────────────────────────────
function ActivityItem({ step, action, timestamp }) {
  const stepConfig = WORKFLOW_STEPS.find(s => s.id === step);
  return (
    <div className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0 last:pb-0">
      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 dark:text-gray-300">{action}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Step {stepConfig?.number || '?'}: {stepConfig?.label || step}
          </span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {new Date(timestamp).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard Component ─────────────────────────────────────────────────
export default function AuditorDashboard({ view }) {
  const { user } = useAuth();
  const { getWorkflow, actions: workflowActions } = useWorkflow();
  const [executingCase, setExecutingCase] = useState(null);

  // Fetch data using the custom hook
  const {
    cases, metrics, loading, refreshing, error, refresh
  } = useAuditorData(user?.id);

  // Categorize cases
  const activeCases = useMemo(() => 
    cases.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED'),
    [cases]
  );

  const completedCases = useMemo(() => 
    cases.filter(c => c.status === 'COMPLETED' || c.status === 'CONCLUDED'),
    [cases]
  );

  // Get recent workflow events from active cases
  const recentActivity = useMemo(() => {
    const events = [];
    activeCases.forEach(c => {
      const wf = getWorkflow(c.id || c.caseId);
      if (wf.timeline?.length > 0) {
        wf.timeline.slice(-3).forEach(t => events.push(t));
      }
    });
    return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
  }, [activeCases, getWorkflow]);

  // Handlers
  const handleExecuteCase = useCallback((caseItem) => {
    const caseId = caseItem.id || caseItem.caseId;
    const wf = getWorkflow(caseId);

    if (wf.status === 'PENDING_HANDOFF' || !wf.steps?.CASE_DETAIL?.completedAt) {
      workflowActions.importCase(caseId, user.id, {
        taxpayerName: caseItem.taxpayerName,
        importedAt: new Date().toISOString(),
      });
    }

    setExecutingCase({
      id: caseId,
      taxpayerName: caseItem.taxpayerName,
      riskLevel: caseItem.riskPriority || caseItem.riskLevel,
      tin: caseItem.taxpayerId || caseItem.tin,
      sector: caseItem.segment || caseItem.sector,
      ...caseItem,
    });
  }, [getWorkflow, workflowActions, user?.id]);

  // If executing a case, show the workspace
  if (executingCase) {
    return (
      <AuditorWorkspace
        caseData={executingCase}
        onBack={() => setExecutingCase(null)}
      />
    );
  }

  // ── Cases View ──────────────────────────────────────────────────────────
  if (view === 'cases') {
    return (
      <CasesView
        cases={cases}
        loading={loading}
        refreshing={refreshing}
        error={error}
        refresh={refresh}
        onExecuteCase={handleExecuteCase}
      />
    );
  }

  // ── Dashboard View (matching Team Leader style) ─────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back, {user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            You are signed in as <span className="font-medium">Auditor</span>.
            Cases assigned to you by your Team Leader appear here for execution.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
            <Database size={16} />
            <span>Database Synchronized</span>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300">
          <Loader2 size={16} className="animate-spin" />
          Loading your workspace...
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert type="warning" title="Data Loading Issue">
          Some data may not be up to date. <button onClick={refresh} className="underline font-medium">Retry</button>
        </Alert>
      )}

      {/* Metric Cards (same style as Team Leader) */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Active Cases"
            value={metrics.inProgress}
            subtitle="In progress"
            icon={PlayCircle}
            color="blue"
          />
          <MetricCard
            title="Completed"
            value={metrics.completed}
            subtitle="Audits done"
            icon={CheckCircle}
            color="green"
          />
          <MetricCard
            title="Total Assigned"
            value={metrics.totalAssigned}
            subtitle="All time"
            icon={Briefcase}
            color="purple"
          />
          <MetricCard
            title="Audit Days"
            value={metrics.totalAuditDays}
            subtitle="Days worked"
            icon={Calendar}
            color="amber"
          />
        </div>
      )}

      {/* Two-Column Layout (matching Team Leader) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Active Work (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Active Work Section */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity size={20} className="text-blue-600 dark:text-blue-400" />
                  Active Work
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Cases currently assigned to you — continue your audit work.
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                {activeCases.length} active
              </span>
            </div>

            {activeCases.length > 0 ? (
              <div className="space-y-3">
                {activeCases.slice(0, 5).map((caseItem) => (
                  <ActiveWorkItem
                    key={caseItem.id || caseItem.caseId}
                    caseItem={caseItem}
                    onExecute={handleExecuteCase}
                  />
                ))}
                {activeCases.length > 5 && (
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400 pt-2">
                    +{activeCases.length - 5} more active cases
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                <Clock size={40} className="mx-auto mb-3 text-gray-400 dark:text-gray-600 opacity-50" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">No active cases</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Cases will appear when assigned by your Team Leader
                </p>
              </div>
            )}

            {/* Recent Activity — inline under Active Work */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Activity size={16} className="text-green-600 dark:text-green-400" />
                Recent Activity
              </h4>
              <div className="space-y-3">
                {recentActivity.length > 0 ? (
                  recentActivity.map((event, idx) => (
                    <ActivityItem
                      key={idx}
                      step={event.step}
                      action={event.action}
                      timestamp={event.timestamp}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">No activity yet</p>
                )}
              </div>
            </div>
          </Card>

          {/* Recently Completed */}
          {completedCases.length > 0 && (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
                    Recently Completed
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Audits you've finished successfully.
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {completedCases.slice(0, 3).map((caseItem) => (
                  <div
                    key={caseItem.id || caseItem.caseId}
                    className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {caseItem.taxpayerName || 'Taxpayer'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {caseItem.taxpayerId || caseItem.tin || '—'}
                        </p>
                      </div>
                    </div>
                    <Badge color="green">{caseItem.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column (1/3 width): Audit Summary & Activity */}
        <div className="space-y-6">

          {/* Audit Summary */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 size={18} className="text-purple-600 dark:text-purple-400" />
                  Audit Summary
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Your audit portfolio overview
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Status Distribution */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">In Progress</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {metrics?.inProgress || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Completed</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {metrics?.completed || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Assigned</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {(metrics?.totalAssigned || 0) - (metrics?.inProgress || 0) - (metrics?.completed || 0)}
                  </span>
                </div>
              </div>

              {/* Total Cases */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Total Cases</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {metrics?.totalAssigned || 0}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Workflow Progress */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Audit Workflow</h3>
            <div className="space-y-3">
              {WORKFLOW_STEPS.slice(0, 6).map((step, idx) => {
                const isCurrent = idx === 0;
                return (
                  <div key={step.id} className={`flex items-center gap-3 ${isCurrent ? 'bg-white dark:bg-slate-800 rounded-lg p-2 border border-blue-300 dark:border-blue-600' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCurrent ? 'bg-blue-100 dark:bg-blue-800/50' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <span className={`text-xs font-bold ${
                        isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                      }`}>{idx + 1}</span>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {step.label}
                      </p>
                      {isCurrent && <p className="text-xs text-blue-600 dark:text-blue-400">← Your next step</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>


        </div>
      </div>
    </div>
  );
}
