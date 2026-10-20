/**
 * CommitteeDashboard Page
 * Main dashboard showing executive overview and key metrics
 * with real-time SSE updates for activity stream and vote casts.
 */

import { useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { useCommitteeSSE } from '../hooks/useCommitteeSSE';
import MetricCard from '../components/MetricCard';
import { AlertCircle, CheckCircle2, FileText, AlertTriangle, Loader, Database, Wifi, WifiOff } from 'lucide-react';
import Card from '../../../components/Card';

export default function CommitteeDashboard() {
  const { user, authContext } = useAuth();
  const taxCenter = user?.taxCenter || authContext?.taxCenter || authContext?.org_context?.assignedTaxCenter || null;
  const { metrics, loading, error, refresh } = useDashboard(taxCenter);
  const [liveActivities, setLiveActivities] = useState([]);
  const [sseConnected, setSseConnected] = useState(false);

  const handleActivity = useCallback((data) => {
    setLiveActivities(prev => {
      const next = [
        {
          id: Date.now() + Math.random(),
          advisor: data.actor || data.actorName || 'System',
          initials: (data.actor || 'S').substring(0, 2).toUpperCase(),
          action: data.action || data.message || data.type || 'Event',
          timestamp: data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'Just now',
          caseReference: data.caseId ? `Case: ${data.caseId.substring(0, 12)}...` : '',
        },
        ...prev,
      ];
      return next.slice(0, 20); // keep last 20 live events
    });
  }, []);

  const handleVoteCast = useCallback(() => {
    // When any vote is cast globally, refresh dashboard metrics
    refresh();
  }, [refresh]);

  useCommitteeSSE({
    onActivity: handleActivity,
    onVoteCast: handleVoteCast,
    onConnected: () => setSseConnected(true),
    onError: () => setSseConnected(false),
  });

  // Merge live activities with server-provided activity stream
  const allActivities = [...liveActivities, ...(metrics?.activityStream || [])].slice(0, 20);

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">Failed to Load Dashboard</h3>
              <p className="text-sm text-red-800 dark:text-red-200 mt-1">{error}</p>
              <button
                onClick={refresh}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back, {user?.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            You are signed in as <span className="font-semibold text-blue-600 dark:text-blue-400">
              {user?.role === 'committee_chair' ? 'Joint Audit Committee Chair' : 'Joint Audit Committee Member'}
            </span>
            {taxCenter && <span className="text-gray-500 dark:text-gray-400 font-medium"> ({taxCenter})</span>}.
            Here is the active real-time stance of your tax viability portfolio.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
            sseConnected
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}>
            {sseConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
            <span>{sseConnected ? 'Live Connected' : 'Connecting...'}</span>
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              title="Total Portfolio Cases"
              value={metrics.totalPortfolioCases || '0'}
              subtitle="Active"
              icon={FileText}
              color="blue"
            />
            <MetricCard
              title="Chairperson Action"
              value={`${metrics.chairpersonAction?.count || '0'}`}
              subtitle={metrics.chairpersonAction?.status || 'Decision'}
              icon={CheckCircle2}
              color="blue"
            />
            <MetricCard
              title="Advisory Votes Pending"
              value={metrics.advisoryVotesPending || '0'}
              subtitle="Ballot"
              icon={AlertTriangle}
              color="purple"
            />
            <MetricCard
              title="Critical SLA Warnings"
              value={metrics.criticalSLAWarnings || '0'}
              subtitle="Alert"
              icon={AlertTriangle}
              color="red"
            />
          </div>

          {/* Risk Priority and Office Segment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Priority */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Risk Priority Standing</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active division of taxpayers entities based on automated rule-engine scores.</p>
                </div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Predictive Threat Index</span>
              </div>

              {metrics.riskPriority && (
                <div className="space-y-4">
                  {/* Risk Donut Chart Placeholder */}
                  <div className="flex items-center justify-center py-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="45" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="12"
                          strokeDasharray={`${(metrics.riskPriority.highThreat || 0) * 2.8} 282.6`}
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="12"
                          strokeDasharray={`${(metrics.riskPriority.mediumThreat || 0) * 2.8} 282.6`}
                          strokeDashoffset={`${-(metrics.riskPriority.highThreat || 0) * 2.8}`}
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="45"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="12"
                          strokeDasharray={`${(metrics.riskPriority.lowThreat || 0) * 2.8} 282.6`}
                          strokeDashoffset={`${-((metrics.riskPriority.highThreat || 0) + (metrics.riskPriority.mediumThreat || 0)) * 2.8}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {metrics.riskPriority.totalCases || 0}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">TOTAL CASES</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">High Threat</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {metrics.riskPriority.highThreat || 0} units · {Math.round(((metrics.riskPriority.highThreat || 0) / (metrics.riskPriority.totalCases || 1)) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Medium Threat</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {metrics.riskPriority.mediumThreat || 0} units · {Math.round(((metrics.riskPriority.mediumThreat || 0) / (metrics.riskPriority.totalCases || 1)) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Low Threat</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {metrics.riskPriority.lowThreat || 0} unit · {Math.round(((metrics.riskPriority.lowThreat || 0) / (metrics.riskPriority.totalCases || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Office Segment Divisions */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Office Segment Divisions</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Proportional classification across Taxpayer Offices.</p>
                </div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">LTO / MTO / STO</span>
              </div>

              {metrics.officeSegment && (
                <div className="space-y-5">
                  {/* Large Taxpayer Office */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Large Taxpayer Office
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {metrics.officeSegment.ltoPercentage || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${metrics.officeSegment.ltoPercentage || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {metrics.officeSegment.ltoDossiers || 0} Dossiers
                    </p>
                  </div>

                  {/* Medium Taxpayer Office */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Medium Taxpayer Office
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {metrics.officeSegment.mtoPercentage || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${metrics.officeSegment.mtoPercentage || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {metrics.officeSegment.mtoDossiers || 0} Dossiers
                    </p>
                  </div>

                  {/* Small Taxpayer Office */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Small Taxpayer Office
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {metrics.officeSegment.stoPercentage || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: `${metrics.officeSegment.stoPercentage || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {metrics.officeSegment.stoDossiers || 0} Dossier
                    </p>
                  </div>

                  {/* SLA Health Index */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SLA Health Index</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {metrics.officeSegment.slaHealthIndex || '0'}% compliance
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Live Activity Stream */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Audit Committee Activity Stream</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time chronicle of advisor assignments, ballots, and chairperson sanctions.</p>
              </div>
              <span className={`text-xs font-semibold uppercase px-3 py-1 rounded-full ${
                sseConnected
                  ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
                  : 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
              }`}> {sseConnected ? '● Live' : 'Real-Time Monitor'}</span>
            </div>

            {allActivities.length > 0 ? (
              <div className="space-y-4">
                {allActivities.map((activity, idx) => (
                  <div key={activity.id || idx} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-bold">
                        {activity.initials || 'N/A'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.advisor}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{activity.action}</p>
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {activity.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{activity.caseReference}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No activity yet</p>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
