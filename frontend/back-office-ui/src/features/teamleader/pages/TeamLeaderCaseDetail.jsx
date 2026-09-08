/**
 * TeamLeaderCaseDetail Page
 * Detailed view of a case for the Team Leader
 * Shows case info, voting results, team assignment, and action panel
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { teamLeaderAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import AuditorAssignmentModal from '../components/AuditorAssignmentModal';
import Card from '../../../components/Card';
import { UnifiedCaseInfo, UnifiedCaseHeader } from '../../../components/shared/UnifiedCaseDetail.jsx';
import {
  ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Users, FileText,
  TrendingUp, Shield, Clock, MapPin, User, Send, ThumbsUp,
  ThumbsDown, Hand as HandIcon, Activity,
} from 'lucide-react';

export default function TeamLeaderCaseDetail({ caseId, source, onBack }) {
  const { user } = useAuth();
  const [caseData, setCaseData] = useState(null);
  const [voteTally, setVoteTally] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('BASIC_CASE_INFO');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [handoffLoading, setHandoffLoading] = useState(false);

  useEffect(() => {
    if (caseId) {
      fetchCaseData();
    }
  }, [caseId]);

  const fetchCaseData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (source === 'committee') {
        // Fetch from committee API
        const detail = await teamLeaderAPI.getCommitteeCaseDetail(caseId);
        setCaseData(detail);

        // Try to get vote tally
        try {
          const tally = await teamLeaderAPI.getVoteTally(caseId);
          setVoteTally(tally);
        } catch {
          // Vote tally not available
        }
      } else {
        // Fetch from AP system
        const detail = await teamLeaderAPI.getCaseDetail(caseId);
        setCaseData(detail);
      }
    } catch (err) {
      setError(err.message || 'Failed to load case detail');
      console.error('[Team Leader Case Detail]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToAuditor = async (caseIdParam, auditorId) => {
    if (!['HANDED_OFF', 'AUDITOR_ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'].includes(caseData?.status) && !caseData?.handoffAt) {
      throw new Error('Complete the case handoff before assigning an auditor');
    }
    await teamLeaderAPI.assignCaseToAuditor(caseIdParam, auditorId);
    fetchCaseData(); // Refresh
  };

  const isHandedOff = Boolean(caseData?.handoffAt)
    || ['HANDED_OFF', 'AUDITOR_ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'].includes(caseData?.status);

  const handleHandoff = async () => {
    try {
      setHandoffLoading(true);
      await teamLeaderAPI.handoffCase(caseId, user.id, 'Accepted by Team Leader after reviewing the case referral');
      await fetchCaseData();
    } catch (err) {
      setError(err.message || 'Failed to hand off case');
    } finally {
      setHandoffLoading(false);
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
      {/* Header */}
      <UnifiedCaseHeader caseData={caseData} onBack={onBack} backLabel="Back to Cases" />

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
              auditInfo: true,
              committeeDecision: source === 'committee',
              segmentHistory: false,
            }}
          />

          {/* Compliance Issues (Committee Cases) */}
          {source === 'committee' && caseData.complianceIssues && caseData.complianceIssues.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Compliance Issues</h3>
              <div className="space-y-3">
                {caseData.complianceIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  >
                    <AlertCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-900 dark:text-red-100">{issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Activity Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={20} />
              Activity Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Case received from Committee</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {caseData.createdDate || caseData.createdAt
                      ? new Date(caseData.createdDate || caseData.createdAt).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
              {caseData.decisionDate && (
                <div className="flex gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Viability determined: {caseData.decision}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(caseData.decisionDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Transferred to Team Leader workspace</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ready for auditor assignment</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Action Panel */}
        <div className="space-y-6">
          {/* Assignment Action Panel */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Team Leader Actions</h3>
            <div className="space-y-2">
              {!isHandedOff && (
                <button
                  onClick={handleHandoff}
                  disabled={handoffLoading}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ArrowRight size={16} />
                  {handoffLoading ? 'Handing Off...' : 'Handoff Case'}
                </button>
              )}
              <button
                onClick={() => setShowAssignModal(true)}
                disabled={!isHandedOff}
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-800/50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                title={!isHandedOff ? 'Complete the case handoff before assigning an auditor' : 'Assign this case to an auditor'}
              >
                <Send size={16} className="text-blue-600 dark:text-blue-400" />
                Assign to Auditor
              </button>
              {!isHandedOff && (
                <p className="px-4 py-2 text-xs text-amber-700 dark:text-amber-300">
                  Complete the case handoff before assigning an auditor.
                </p>
              )}
              <button className="w-full px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-lg transition-colors flex items-center gap-2">
                <Users size={16} className="text-purple-600 dark:text-purple-400" />
                View Assigned Auditor
              </button>
              <button className="w-full px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-lg transition-colors flex items-center gap-2">
                <FileText size={16} className="text-green-600 dark:text-green-400" />
                Download Dossier
              </button>
              <button className="w-full px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-lg transition-colors flex items-center gap-2">
                <Activity size={16} className="text-amber-600 dark:text-amber-400" />
                Mark as In Progress
              </button>
            </div>
          </Card>

          {/* Committee Voting Summary (for committee cases) */}
          {source === 'committee' && voteTally && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Voting Summary</h3>
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
                    {voteTally.abstainCount || 0}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Abstain</p>
                </div>
              </div>
            </Card>
          )}

          {/* Case Ownership Status */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Case Assignment Status</h3>
            <div className="space-y-3">
              {caseData.assignedAuditorName || caseData.assignedAuditorId ? (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
                  <CheckCircle size={18} />
                  <div>
                    <span className="font-medium">Assigned to Auditor</span>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {caseData.assignedAuditorName || caseData.assignedAuditorId}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-lg">
                  <AlertCircle size={18} />
                  <span className="font-medium">Awaiting Auditor Assignment</span>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Info */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield size={20} />
              Quick Info
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Risk Level</p>
                <div className="mt-1"><StatusBadge status={caseData.riskPriority || caseData.riskLevel} variant="risk" /></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Segment</p>
                <p className="text-gray-900 dark:text-white mt-1 text-sm font-medium">{caseData.segment || 'N/A'}</p>
              </div>
              {caseData.totalAmount && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Assessment Amount</p>
                  <p className="text-gray-900 dark:text-white mt-1 text-sm font-bold">
                    ETB {parseFloat(caseData.totalAmount).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Auditor Assignment Modal */}
      <AuditorAssignmentModal
        open={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        caseData={caseData}
        user={user}
        onAssign={handleAssignToAuditor}
      />
    </div>
  );
}
