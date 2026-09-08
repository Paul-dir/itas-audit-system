/**
 * CaseDetail Page - Enhanced Professional Design
 * Display detailed case information with tabs, voting, and executive panel
 */

import { useState, useEffect, useCallback } from 'react';
import { committeeAPI } from '../services/api';
import { useVoting } from '../hooks/useVoting';
import { useOwnership } from '../hooks/useOwnership';
import { useCommitteeSSE } from '../hooks/useCommitteeSSE';
import { useCommitteeRole } from '../components/CommitteeRoleGate';
import { 
  ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Hand, Users, 
  FileText, TrendingUp, Shield, Clock, MapPin, User,
  ThumbsUp, ThumbsDown, Hand as HandIcon
} from 'lucide-react';
import Card from '../../../components/Card';
import { UnifiedCaseInfo, UnifiedCaseHeader } from '../../../components/shared/UnifiedCaseDetail.jsx';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import TeamLeaderAppointment from '../components/TeamLeaderAppointment';
import ExecutiveViability from '../components/ExecutiveViability';
import ChairpersonPanel from '../components/ChairpersonPanel';

export default function CaseDetail({ caseId, onBack }) {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [ownershipError, setOwnershipError] = useState(null);
  const [activeTab, setActiveTab] = useState('BASIC_CASE_INFO');
  const { isChairperson, isMember } = useCommitteeRole();

  const { voteTally, setVoteTally, castVote, voting: isVoting, userVote, error: votingError } = useVoting(caseId);
  const ownership = useOwnership(caseId);
  const [liveConnected, setLiveConnected] = useState(false);

  // Real-time vote tally updates via SSE
  const handleVoteTallyUpdate = useCallback((tally) => {
    setVoteTally(prev => prev ? { ...prev, ...tally } : tally);
  }, [setVoteTally]);

  const handleOwnershipChange = useCallback((data) => {
    // Refresh case data when ownership changes by another user
    fetchCaseData();
  }, []);

  useCommitteeSSE({
    caseId,
    onVoteTallyUpdated: handleVoteTallyUpdate,
    onOwnershipChanged: handleOwnershipChange,
    onConnected: () => setLiveConnected(true),
    onError: () => setLiveConnected(false),
  });

  useEffect(() => {
    if (caseId) {
      fetchCaseData();
    }
  }, [caseId]);

  const fetchCaseData = async () => {
    try {
      // Only show full-screen loading spinner on initial load (no caseData yet)
      if (!caseData) {
        setLoading(true);
      } else {
        setRefreshing(true); // subtle refresh indicator
      }
      const [detail, tally] = await Promise.all([
        committeeAPI.getCaseDetail(caseId),
        committeeAPI.getVoteTally(caseId).catch(() => ({})),
      ]);
      setCaseData(detail);
      setError(null);
      if (tally && tally.approveCount !== undefined) {
        setVoteTally(tally);
      }
    } catch (err) {
      console.error('[Case Detail] fetch error (non-fatal):', err.message);
      // Don't clear existing caseData on refresh errors — keep showing current data
      if (!caseData) {
        setError(err.message || 'Failed to load case detail');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleVote = async (voteOption) => {
    try {
      await castVote(voteOption);
      // Refresh case data to pick up any auto-transitioned status
      fetchCaseData();
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const handleTakeOwnership = async () => {
    try {
      setOwnershipError(null);
      await ownership.takeOwnership();
    } catch (err) {
      setOwnershipError(err.message);
    }
  };

  const handleReleaseOwnership = async () => {
    try {
      setOwnershipError(null);
      await ownership.releaseOwnership();
    } catch (err) {
      setOwnershipError(err.message);
    }
  };

  // Tab definitions removed — using unified UnifiedCaseInfo component

  if (loading) {
    return <LoadingSpinner message="Loading case details..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
        >
          <ArrowLeft size={18} />
          Back to Cases
        </button>
        <ErrorAlert
          error={error}
          title="Failed to Load Case"
          onRetry={fetchCaseData}
        />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
        >
          <ArrowLeft size={18} />
          Back to Cases
        </button>
        <Card className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">Case not found</p>
        </Card>
      </div>
    );
  }

  // Case info rendered by UnifiedCaseInfo component (replaces custom tabs)

  return (
    <div className="space-y-6">
      {/* Refresh indicator */}
      {refreshing && (
        <div className="fixed top-2 right-2 z-50 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg shadow-lg animate-pulse">
          Refreshing...
        </div>
      )}

      {/* Header */}
      <UnifiedCaseHeader caseData={caseData} onBack={onBack} backLabel="Back to Cases" />

      {/* Case Status Flow */}
      <Card className="p-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {['PENDING_VOTES', 'TEAM_ASSIGNED', 'PENDING_VIABILITY', 'APPROVED'].map((step, i) => {
            const flowSteps = ['PENDING_VOTES', 'TEAM_ASSIGNED', 'PENDING_VIABILITY', 'APPROVED'];
            const currentIdx = flowSteps.indexOf(caseData.status);
            const isCurrent = caseData.status === step;
            const isPast = currentIdx >= 0 && i < currentIdx;
            const isRejected = caseData.status === 'REJECTED' && step === 'PENDING_VIABILITY';
            return (
              <div key={step} className="flex items-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  isRejected ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700' :
                  isCurrent ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 ring-2 ring-blue-200 dark:ring-blue-800' :
                  isPast ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700' :
                  'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700'
                }`}>
                  {isPast && <span>✓</span>}
                  {step.replace(/_/g, ' ')}
                </div>
                {i < 3 && <div className={`w-6 h-px mx-1 flex-shrink-0 ${isPast ? 'bg-green-400 dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`} />}
              </div>
            );
          })}
          {caseData.status === 'REJECTED' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 ring-2 ring-red-200 dark:ring-red-800">
              ✗ REJECTED
            </div>
          )}
        </div>
      </Card>

      {/* Error Alert */}
      {ownershipError && (
        <ErrorAlert
          error={ownershipError}
          onDismiss={() => setOwnershipError(null)}
          title="Ownership Error"
        />
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: Unified Case Information */}
        <div className="col-span-2 space-y-6">
          <UnifiedCaseInfo
            caseData={caseData}
            sections={{
              overview: true,
              taxpayer: true,
              address: true,
              risk: true,
              auditInfo: false,
              committeeDecision: true,
              segmentHistory: false,
            }}
          />
        </div>

        {/* Right Column: Voting & Command Panel */}
        <div className="space-y-6">
          {/* Advisory Voting Station: committee members only */}
          {isMember && <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Advisory Voting Station</h3>
              {liveConnected && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Live
                </span>
              )}
            </div>

            {voteTally && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                      {voteTally.approveCount || 0}
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">Approve</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                      {voteTally.rejectCount || 0}
                    </div>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">Reject</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                      {voteTally.moreInfoCount || voteTally.abstainCount || 0}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">More Info</p>
                  </div>
                </div>

                {!userVote && (
                  <div className="space-y-3 pt-4 border-t border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold">Cast Your Advisory Vote</p>
                    <button
                      onClick={() => handleVote('APPROVE')}
                      disabled={isVoting}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      <ThumbsUp size={16} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleVote('REJECT')}
                      disabled={isVoting}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      <ThumbsDown size={16} />
                      Reject
                    </button>
                    <button
                      onClick={() => handleVote('MORE_INFO')}
                      disabled={isVoting}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      <HandIcon size={16} />
                      More Info Needed
                    </button>
                  </div>
                )}
                {userVote && (
                  <div className="pt-4 border-t border-blue-200 dark:border-blue-800 flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle size={18} />
                    <span className="text-sm font-medium">Voted: <strong>{userVote}</strong></span>
                  </div>
                )}
                {votingError && (
                  <div className="pt-3 text-xs text-red-500 dark:text-red-400">
                    {votingError}
                  </div>
                )}
              </div>
            )}
          </Card>}

          {/* Chairperson Command Panel — visible to chairperson only */}
          {isChairperson && (
            <ChairpersonPanel
              caseData={caseData}
              onActionComplete={fetchCaseData}
            />
          )}

          {/* Team Lead Info */}
          <Card className="p-6 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border border-teal-200 dark:border-teal-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Users size={20} className="text-teal-600 dark:text-teal-400" />
              Team Lead Assignment
            </h3>
            {caseData.teamLeadId ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-teal-100 dark:border-teal-900">
                  <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-800/50 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{caseData.teamLeadName || 'Team Leader'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate">{caseData.teamLeadId}</p>
                  </div>
                </div>
                {caseData.status && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                    <CheckCircle size={16} className="text-teal-600 dark:text-teal-400" />
                    <span className="text-sm font-medium text-teal-800 dark:text-teal-200">
                      {caseData.status === 'TEAM_ASSIGNED' && 'Awaiting viability determination'}
                      {caseData.status === 'PENDING_VIABILITY' && 'Viability pending — ready for review'}
                      {caseData.status === 'APPROVED' && 'Case approved — execution phase'}
                      {caseData.status === 'REJECTED' && 'Case rejected by chairperson'}
                      {!['TEAM_ASSIGNED', 'PENDING_VIABILITY', 'APPROVED', 'REJECTED'].includes(caseData.status) && 'Assigned'}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">No team leader assigned</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                    A team leader must be appointed before viability can be determined.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Case Ownership */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Case Ownership</h3>
            <div className="space-y-3">
              {!caseData.userOwnsCase ? (
                <button
                  onClick={handleTakeOwnership}
                  disabled={ownership.loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                >
                  <Hand size={18} />
                  {ownership.loading ? 'Taking...' : 'Take Ownership'}
                </button>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
                    <CheckCircle size={18} />
                    <span className="font-medium">You own this case</span>
                  </div>
                  <button
                    onClick={handleReleaseOwnership}
                    disabled={ownership.loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors font-medium"
                  >
                    <Hand className="rotate-180" size={18} />
                    {ownership.loading ? 'Releasing...' : 'Release Ownership'}
                  </button>
                </>
              )}
            </div>
          </Card>

          {/* Decision Details */}
          {(caseData.decision || caseData.decisionReason) && (
            <Card className="p-6 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                {caseData.decision === 'APPROVED' ? (
                  <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
                )}
                Decision Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Decision</p>
                  <div className="mt-1">
                    <StatusBadge status={caseData.decision} variant="risk" />
                  </div>
                </div>
                {caseData.decisionDate && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Decided On</p>
                    <p className="text-gray-900 dark:text-white mt-1 text-sm">
                      {new Date(caseData.decisionDate).toLocaleString()}
                    </p>
                  </div>
                )}
                {caseData.decisionReason && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Reason</p>
                    <p className="text-gray-900 dark:text-white mt-1 text-sm leading-relaxed">
                      {caseData.decisionReason}
                    </p>
                  </div>
                )}
                {caseData.chairpersonId && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Chairperson</p>
                    <p className="text-gray-900 dark:text-white mt-1 text-sm font-mono">
                      {caseData.chairpersonId}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Handoff Info */}
          {(caseData.handoffRecordId || caseData.handoffDate) && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ArrowRight size={20} className="text-indigo-600 dark:text-indigo-400" />
                Handoff to Execution
              </h3>
              <div className="space-y-3">
                {caseData.handoffRecordId && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Handoff Record</p>
                    <p className="text-gray-900 dark:text-white mt-1 text-sm font-mono">
                      {caseData.handoffRecordId}
                    </p>
                  </div>
                )}
                {caseData.handoffDate && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Handoff Date</p>
                    <p className="text-gray-900 dark:text-white mt-1 text-sm">
                      {new Date(caseData.handoffDate).toLocaleString()}
                    </p>
                  </div>
                )}
                {caseData.caseCode && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Case Code</p>
                    <p className="text-gray-900 dark:text-white mt-1 text-sm font-mono font-bold">
                      {caseData.caseCode}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Activity Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={20} />
              Activity Timeline
            </h3>
            <div className="space-y-0">
              {/* Case Created */}
              <div className="flex gap-3 pb-4 relative">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0 z-10"></div>
                  <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="pb-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Case Created</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {caseData.createdDate ? new Date(caseData.createdDate).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Team Lead Assigned */}
              {caseData.teamLeadId && (
                <div className="flex gap-3 pb-4 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0 z-10"></div>
                    <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Team Leader Appointed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{caseData.teamLeadName || caseData.teamLeadId}</p>
                  </div>
                </div>
              )}

              {/* Decision Made */}
              {caseData.decision && (
                <div className="flex gap-3 pb-4 relative">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${caseData.decision === 'APPROVED' ? 'bg-green-500' : 'bg-red-500'} mt-1.5 flex-shrink-0 z-10`}></div>
                    <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Viability: {caseData.decision}
                    </p>
                    {caseData.decisionDate && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(caseData.decisionDate).toLocaleString()}
                      </p>
                    )}
                    {caseData.decisionReason && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2">
                        {caseData.decisionReason}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Handoff */}
              {caseData.handoffDate && (
                <div className="flex gap-3 pb-4 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 z-10"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Handed Off to Execution</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(caseData.handoffDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Fallback: show current status if no other events */}
              {!caseData.teamLeadId && !caseData.decision && !caseData.handoffDate && (
                <div className="flex gap-3 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0 z-10"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Status: {caseData.status?.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Deadline: {caseData.committeeDeadline ? new Date(caseData.committeeDeadline).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

