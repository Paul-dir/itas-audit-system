/**
 * TeamLeaderDashboard Page
 * Shows cases from Committee after vote passes (TEAM_ASSIGNED status).
 * 
 * Workflow:
 * 1. Committee votes → case moves to TEAM_ASSIGNED
 * 2. Team Leader sees incoming cases here → assigns team
 * 3. Team assesses viability → case moves to PENDING_VIABILITY
 * 4. Chairperson determines viability → APPROVED/REJECTED
 */

import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useApp } from '../../../context/AppContext.jsx';
import { useDashboard } from '../hooks/useDashboard';
import { teamLeaderAPI } from '../services/api';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import AuditorAssignmentModal from '../components/AuditorAssignmentModal';
import ErrorAlert from '../components/ErrorAlert';
import Card from '../../../components/Card';
import {
  FileText, Users, Clock, CheckCircle, AlertTriangle, Send, ClipboardCheck,
  ArrowRight, Shield, Activity, Loader, Database, Eye,
} from 'lucide-react';

export default function TeamLeaderDashboard() {
  const { user } = useAuth();
  const { state, actions, selectors } = useApp();
  const { metrics, teamMembers, loading, error, refresh } = useDashboard(user?.id);
  const [selectedCase, setSelectedCase] = useState(null);
  const [assignModal, setAssignModal] = useState(null);

  // Use team members from backend API
  const myAuditors = teamMembers || [];

  const handleAssignToAuditor = useCallback(async (caseId, auditorId) => {
    try {
      // Call the backend API to assign the case to the auditor
      await teamLeaderAPI.assignCaseToAuditor(caseId, auditorId);
      // Refresh the dashboard to show updated metrics
      refresh();
    } catch (err) {
      console.error('[TeamLeaderDashboard] Failed to assign case:', err);
      // Still try local state update as fallback
      const apCase = state.cases.find(c => c.id === caseId);
      if (apCase) {
        actions.assignCaseToAuditor(caseId, auditorId);
      }
    }
  }, [refresh, state.cases, actions]);

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorAlert
          error={error}
          title="Failed to Load Dashboard"
          onRetry={refresh}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back, {user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            You are signed in as <span className="font-medium">Team Leader</span>.
            Cases approved by the Joint Audit Committee appear here for assignment.
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

      {/* Loading State */}
      {loading && !metrics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      )}

      {/* Top Metrics */}
      {metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Total Cases"
              value={metrics.totalCases || 0}
              subtitle={`${metrics.totalAssigned || 0} assigned · ${metrics.pendingAssignment || 0} incoming`}
              icon={FileText}
              color="blue"
            />
            <MetricCard
              title="Awaiting Assignment"
              value={metrics.pendingAssignment || 0}
              subtitle="From Committee"
              icon={ArrowRight}
              color="amber"
            />
            <MetricCard
              title="In Progress"
              value={metrics.inProgress || 0}
              subtitle="Active Audits"
              icon={Activity}
              color="purple"
            />
            <MetricCard
              title="Completed"
              value={metrics.completed || 0}
              subtitle="Finished Audits"
              icon={CheckCircle}
              color="green"
            />
            <MetricCard
              title="Plans to Review"
              value={metrics.plansAwaitingReview || 0}
              subtitle="Awaiting your decision"
              icon={ClipboardCheck}
              color="red"
            />
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: Incoming Committee Cases (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">

              {/* Incoming Cases from Committee */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <ArrowRight size={20} className="text-purple-600 dark:text-purple-400" />
                      Cases from Committee — Ready for Assignment
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      These cases have passed Executive Viability Determination and are ready for team assignment.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    {metrics.incomingCases?.length || 0} incoming
                  </span>
                </div>

                {metrics.incomingCases && metrics.incomingCases.length > 0 ? (
                  <div className="space-y-3">
                    {metrics.incomingCases.slice(0, 10).map((caseItem) => (
                      <div
                        key={caseItem.committeeCaseId || caseItem.id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                      >
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                          <FileText size={18} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {caseItem.taxpayerName}
                            </p>
                            <StatusBadge status={caseItem.status} />
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>TIN: {caseItem.taxIdNumber || 'N/A'}</span>
                            <span>•</span>
                            <span>Risk: {caseItem.riskPriority || 'N/A'}</span>
                            {caseItem.totalAmount && (
                              <>
                                <span>•</span>
                                <span>ETB {parseFloat(caseItem.totalAmount).toLocaleString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setAssignModal(caseItem)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 flex-shrink-0"
                        >
                          <Send size={14} />
                          Assign
                        </button>
                      </div>
                    ))}
                    {metrics.incomingCases.length > 10 && (
                      <p className="text-sm text-center text-gray-500 dark:text-gray-400 pt-2">
                        +{metrics.incomingCases.length - 10} more incoming cases
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                    <Clock size={40} className="mx-auto mb-3 text-gray-400 dark:text-gray-600 opacity-50" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">No incoming cases from Committee</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Cases will appear here after the Joint Audit Committee determines viability
                    </p>
                  </div>
                )}
              </Card>

              {/* Risk Priority Standing */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Risk Priority Standing</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Distribution of your assigned cases by risk level.</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Team Portfolio</span>
                </div>

                {metrics.riskBreakdown && (
                  <div className="space-y-4">
                    {/* Risk Donut */}
                    <div className="flex items-center justify-center py-4">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="45" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                          <circle
                            cx="60" cy="60" r="45" fill="none" stroke="#ef4444" strokeWidth="12"
                            strokeDasharray={`${(metrics.riskBreakdown.critical || 0) * 14} 282.6`}
                          />
                          <circle
                            cx="60" cy="60" r="45" fill="none" stroke="#f59e0b" strokeWidth="12"
                            strokeDasharray={`${(metrics.riskBreakdown.high || 0) * 14} 282.6`}
                            strokeDashoffset={`${-(metrics.riskBreakdown.critical || 0) * 14}`}
                          />
                          <circle
                            cx="60" cy="60" r="45" fill="none" stroke="#3b82f6" strokeWidth="12"
                            strokeDasharray={`${(metrics.riskBreakdown.medium || 0) * 14} 282.6`}
                            strokeDashoffset={`${-((metrics.riskBreakdown.critical || 0) + (metrics.riskBreakdown.high || 0)) * 14}`}
                          />
                          <circle
                            cx="60" cy="60" r="45" fill="none" stroke="#10b981" strokeWidth="12"
                            strokeDasharray={`${(metrics.riskBreakdown.low || 0) * 14} 282.6`}
                            strokeDashoffset={`${-((metrics.riskBreakdown.critical || 0) + (metrics.riskBreakdown.high || 0) + (metrics.riskBreakdown.medium || 0)) * 14}`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {metrics.totalAssigned || 0}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">ASSIGNED</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Critical</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {metrics.riskBreakdown.critical || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">High</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {metrics.riskBreakdown.high || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Medium</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {metrics.riskBreakdown.medium || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Low</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {metrics.riskBreakdown.low || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column (1/3 width): Team & Quick Actions */}
            <div className="space-y-6">

              {/* Audit Team Overview */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Users size={18} className="text-blue-600 dark:text-blue-400" />
                      Your Audit Team
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {myAuditors.length} auditor{myAuditors.length !== 1 ? 's' : ''} assigned
                    </p>
                  </div>
                </div>

                {myAuditors.length > 0 ? (
                  <div className="space-y-2">
                    {myAuditors.map((auditor) => {
                      const name = auditor.name || auditor.fullName || 'Unknown';
                      const expertise = auditor.expertise || auditor.specialization || '';
                      const seniority = auditor.seniority || auditor.level || '';
                      const taxCenter = auditor.taxCenter || auditor.tax_center || '';
                      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

                      return (
                        <div key={auditor.id || auditor.auditorId} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                              {initials}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {expertise && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                  {expertise}
                                </span>
                              )}
                              {seniority && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  seniority === 'PRINCIPAL' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                                  seniority === 'SENIOR' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                  seniority === 'MID_LEVEL' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                                  'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                                }`}>
                                  {seniority}
                                </span>
                              )}
                            </div>
                            {taxCenter && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                📍 {taxCenter}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                    <Users size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No auditors in your team yet</p>
                    <p className="text-xs mt-1 text-amber-600 dark:text-amber-400">Wait for the Chairperson to form a team</p>
                  </div>
                )}
              </Card>

              {/* Quick Workflow Info */}
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Workflow Pipeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Committee Voting</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Members cast advisory votes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Viability Determination</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Chairperson decides: Viable / Not Viable</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg p-2 border border-purple-300 dark:border-purple-600">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-800/50 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">← You are here</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Team Leader assigns to auditors</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">4</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Audit Execution</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Auditor conducts field/desk audit</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Live Activity Stream */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-green-600 dark:text-green-400" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {state.cases.filter(c => (
                    c.assignedTeamLeaderId === user?.id ||
                    c.assignedTeamLeaderUserId === user?.id ||
                    c.assignedTeamLeader === user?.id
                  )).slice(0, 5).map((c) => (
                    <div key={c.id} className="flex gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{c.taxpayerName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{c.status?.replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                  ))}
                  {state.cases.filter(c => (
                    c.assignedTeamLeaderId === user?.id ||
                    c.assignedTeamLeaderUserId === user?.id ||
                    c.assignedTeamLeader === user?.id
                  )).length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No activity yet</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Auditor Assignment Modal */}
      <AuditorAssignmentModal
        open={!!assignModal}
        onClose={() => setAssignModal(null)}
        caseData={assignModal}
        user={user}
        onAssign={handleAssignToAuditor}
      />
    </div>
  );
}
