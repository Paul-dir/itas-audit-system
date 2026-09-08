/**
 * CaseExecution Page
 * Main execution workspace for a case going through the 11-step audit workflow.
 * Shows workflow progress, step details, and action panels for the current step.
 * 
 * This is the central page for both Team Leader and Auditor to manage case execution.
 */

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { useWorkflow } from '../context/WorkflowContext.jsx';
import { WORKFLOW_STEPS, WORKFLOW_STEP_IDS } from '../data/workflowConstants';
import WorkflowProgress from '../components/WorkflowProgress';
import StatusBadge from '../components/StatusBadge';
import Card from '../../../../components/Card';
import { UnifiedCaseInfo } from '../../../../components/shared/UnifiedCaseDetail.jsx';
import {
  ArrowLeft, ArrowRight, ArrowRightLeft, CheckCircle, Clock, FileText, Users,
  Send, Eye, AlertTriangle, Cpu, TestTube, MessageSquare,
  Calendar, FileSearch, FolderOpen, ClipboardList, UserCheck,
  Loader2, Download,
} from 'lucide-react';

// ── Step panel components (inline for now, will be extracted) ──────────────

function StepHeader({ step, stepData, isCurrent, isCompleted }) {
  const STEP_ICONS = {
    CASE_DETAIL: FileText, PLANNING: ClipboardList,
    ENTRY_CONFERENCE: Calendar, INFO_REQUEST: FileSearch, DOCUMENT_COLLECTION: FolderOpen,
    CAAT_ANALYSIS: Cpu, AUDIT_TESTING: TestTube, FINDINGS: AlertTriangle,
    TAXPAYER_RESPONSE: MessageSquare, CONCLUSION: CheckCircle,
  };
  const Icon = STEP_ICONS[step.id] || FileText;

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
      isCurrent ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
      isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-900/10' :
      'border-gray-200 dark:border-gray-700'
    }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        isCompleted ? 'bg-green-600 text-white' :
        isCurrent ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' :
        'bg-gray-200 dark:bg-gray-700 text-gray-400'
      }`}>
        {isCompleted ? <CheckCircle size={22} /> : <Icon size={22} />}
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Step {step.number}</p>
        <h3 className={`text-lg font-bold ${
          isCurrent ? 'text-blue-700 dark:text-blue-300' :
          isCompleted ? 'text-green-700 dark:text-green-300' :
          'text-gray-900 dark:text-white'
        }`}>{step.label}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{step.actor}</p>
      </div>
      {isCompleted && (
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
          Completed
        </span>
      )}
      {isCurrent && (
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold animate-pulse">
          In Progress
        </span>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function CaseExecution({ caseId, caseData, onBack }) {
  const { user } = useAuth();
  const { getWorkflow, getStepProgress, actions } = useWorkflow();
  const [activeStepTab, setActiveStepTab] = useState(null);

  const workflow = getWorkflow(caseId);
  const progress = getStepProgress(caseId);

  // Hydrate workflow state from backend on mount
  useEffect(() => {
    if (caseId && actions.loadWorkflow) {
      actions.loadWorkflow(caseId);
    }
  }, [caseId, actions.loadWorkflow]);

  // Build step statuses map
  const stepStatuses = useMemo(() => {
    const statuses = {};
    WORKFLOW_STEP_IDS.forEach(id => {
      const stepData = workflow.steps[id];
      statuses[id] = stepData?.status || 'upcoming';
    });
    return statuses;
  }, [workflow.steps]);

  // Check which role we're viewing as
  const isTeamLeader = user?.role === 'team_leader';
  const isAuditor = user?.role === 'auditor';

  // ── Step action handlers ──────────────────────────────────────────────

  const handleImport = () => {
    actions.importCase(caseId, user.id, {
      taxpayerName: caseData?.taxpayerName,
      importedAt: new Date().toISOString(),
    });
  };

  const handleSubmitPlan = () => {
    actions.submitPlan(caseId, user.id, {
      materialityThreshold: 'ETB 500,000',
      scope: 'VAT, Income Tax - 3 years',
      samplingMethod: 'Stratified random sampling',
      workPlan: 'Full field audit with CAAT analysis',
      submittedAt: new Date().toISOString(),
    });
  };

  const handleApprovePlan = () => {
    actions.approvePlan(caseId, user.id);
  };

  const handleRecordMinutes = () => {
    actions.recordMinutes(caseId, user.id, {
      date: new Date().toISOString(),
      attendees: ['Auditor', 'Taxpayer Representative'],
      agenda: 'Introduction of audit, scope discussion, timeline agreement',
      agreements: ['Taxpayer will provide all requested documents within 15 business days'],
    });
  };

  const handleRunCAAT = () => {
    // Simulate CAAT results
    actions.runCAAT(caseId, user.id, {
      analysisTypes: ['REVENUE_VS_BANK', 'EXPENSE_RATIO', 'PATTERN_DETECTION'],
      anomalies: [
        { id: 'anom-1', type: 'REVENUE_VS_BANK', severity: 'HIGH', description: 'Revenue underreporting of ETB 2.3M detected', amount: 2300000 },
        { id: 'anom-2', type: 'EXPENSE_RATIO', severity: 'MEDIUM', description: 'Unusually high entertainment expenses', amount: 450000 },
        { id: 'anom-3', type: 'PATTERN_DETECTION', severity: 'LOW', description: 'Round number transactions detected', amount: 120000 },
      ],
    });
  };

  const handleCompleteCAAT = () => {
    actions.completeCAAT(caseId, user.id);
  };

  const handleCompleteTesting = () => {
    actions.completeTesting(caseId, user.id);
  };

  const handleSubmitFindings = () => {
    actions.addFinding(caseId, {
      id: `finding-${Date.now()}`,
      description: 'VAT underreporting on imported goods',
      severity: 'HIGH',
      financialImpact: 2300000,
      evidence: ['CAAT anomaly #1', 'Import declaration records'],
      status: 'DRAFT',
    });
    actions.submitFindings(caseId, user.id);
  };

  const handleApproveFindings = () => {
    actions.approveFindings(caseId, user.id);
  };

  const handleTaxpayerRespond = () => {
    const findings = workflow.findings || [];
    if (findings.length > 0) {
      actions.taxpayerRespond(caseId, findings[0].id, {
        responseType: 'AGREE',
        explanation: 'Taxpayer agrees with the finding',
        respondedAt: new Date().toISOString(),
      });
    }
    actions.startConclusion(caseId, user.id);
  };

  const handleConcludeCase = () => {
    actions.addConclusion(caseId, {
      id: `concl-${Date.now()}`,
      findingId: workflow.findings?.[0]?.id,
      determination: 'UPHELD',
      adjustmentAmount: 2300000,
      rationale: 'Taxpayer response did not provide sufficient evidence to overturn',
    });
    actions.concludeCase(caseId, user.id);
  };

  // ── Render step content based on current step ─────────────────────────

  const renderStepContent = () => {
    const currentStep = workflow.currentStep;

    switch (currentStep) {
      case 'CASE_DETAIL':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                Review the case information below before proceeding to planning.
              </p>
            </div>
            <UnifiedCaseInfo
              caseData={caseData}
              compactRisk
              sections={{
                overview: true,
                taxpayer: true,
                address: true,
                risk: true,
                auditInfo: true,
                committeeDecision: false,
                segmentHistory: false,
              }}
            />
          </div>
        );

      case 'PLANNING':
      case 'PLANNING_REVISION':
        return (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <ClipboardList size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Audit Planning</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">Define scope, objectives, and methodology</p>
              </div>
            </div>
            <div className="space-y-4">
              {workflow.plan ? (
                <div className="space-y-4">
                  {/* Plan Status */}
                  <div className={`p-3 rounded-lg border ${
                    workflow.plan.status === 'APPROVED' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                    workflow.plan.status === 'SUBMITTED' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
                    'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                  }`}>
                    <p className={`text-sm font-semibold ${
                      workflow.plan.status === 'APPROVED' ? 'text-green-700 dark:text-green-300' :
                      workflow.plan.status === 'SUBMITTED' ? 'text-blue-700 dark:text-blue-300' :
                      'text-amber-700 dark:text-amber-300'
                    }`}>Status: {workflow.plan.status?.replace(/_/g, ' ')}</p>
                  </div>

                  {/* Plan Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    {workflow.plan.scope && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Scope</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{workflow.plan.scope}</p>
                      </div>
                    )}
                    {workflow.plan.objectives && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Objectives</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{workflow.plan.objectives}</p>
                      </div>
                    )}
                    {workflow.plan.methodology && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Methodology</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{workflow.plan.methodology}</p>
                      </div>
                    )}
                    {workflow.plan.timeline && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Timeline</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{workflow.plan.timeline}</p>
                      </div>
                    )}
                  </div>

                  {/* Team Leader Actions */}
                  {isTeamLeader && workflow.plan.status === 'SUBMITTED' && (
                    <div className="flex gap-3 pt-2">
                      <button onClick={handleApprovePlan} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2">
                        <CheckCircle size={16} /> Approve Plan
                      </button>
                      <button onClick={() => actions.revisionPlan(caseId, user.id, 'Please expand scope to include transfer pricing')} className="px-5 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium flex items-center gap-2">
                        <AlertTriangle size={16} /> Send for Revision
                      </button>
                    </div>
                  )}
                </div>
              ) : isAuditor ? (
                <button onClick={handleSubmitPlan} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                  <ClipboardList size={18} /> Submit Audit Plan
                </button>
              ) : (
                <div className="text-center py-8">
                  <ClipboardList size={40} className="mx-auto mb-3 text-gray-400 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Auditor is preparing the audit plan...</p>
                </div>
              )}
            </div>
          </Card>
        );

      case 'ENTRY_CONFERENCE':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Entry Conference</h3>
            <div className="space-y-4">
              {workflow.conference?.minutes ? (
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <CheckCircle size={18} className="text-green-600 dark:text-green-400 mb-2" />
                    <p className="font-medium text-green-800 dark:text-green-200">Conference Completed</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Attendees</p>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{workflow.conference.minutes.attendees?.join(', ')}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Agreements</p>
                    <ul className="mt-1 space-y-1">
                      {workflow.conference.minutes.agreements?.map((a, i) => (
                        <li key={i} className="text-sm text-gray-900 dark:text-white flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : isAuditor ? (
                <button onClick={handleRecordMinutes} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                  <Calendar size={18} /> Record Conference Minutes
                </button>
              ) : (
                <p className="text-sm text-gray-500">Auditor is scheduling the entry conference with the taxpayer...</p>
              )}
            </div>
          </Card>
        );

      case 'INFO_REQUEST':
      case 'DOCUMENT_COLLECTION':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Document Requests & Collection</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{workflow.documentRequests?.length || 0}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Requests Sent</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">{workflow.documents?.filter(d => d.status === 'VERIFIED').length || 0}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Verified</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{workflow.documents?.filter(d => d.status === 'PENDING').length || 0}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">Pending</p>
                </div>
              </div>
              {isAuditor && (
                <button
                  onClick={() => actions.createDocRequest(caseId, user.id, {
                    id: `req-${Date.now()}`,
                    title: 'Financial Documents Request',
                    items: ['Financial Statements (3 years)', 'Bank Statements', 'Tax Returns'],
                    deadline: new Date(Date.now() + 15 * 86400000).toISOString(),
                    sentAt: new Date().toISOString(),
                  })}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                >
                  <FileSearch size={18} /> Send Document Request
                </button>
              )}
            </div>
          </Card>
        );

      case 'CAAT_ANALYSIS':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">CAAT / Automated Analysis</h3>
            <div className="space-y-4">
              {workflow.anomalies?.length > 0 ? (
                <div className="space-y-3">
                  <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
                    <p className="font-medium text-violet-800 dark:text-violet-200">
                      {workflow.anomalies.length} anomalies detected
                    </p>
                  </div>
                  {workflow.anomalies.map((anomaly) => (
                    <div key={anomaly.id} className={`p-4 rounded-xl border ${
                      anomaly.decision === 'ACCEPT' ? 'border-green-300 bg-green-50 dark:bg-green-900/10' :
                      anomaly.decision === 'REJECT' ? 'border-red-300 bg-red-50 dark:bg-red-900/10' :
                      'border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{anomaly.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Severity: {anomaly.severity} · Amount: ETB {anomaly.amount?.toLocaleString()}</p>
                        </div>
                        {!anomaly.decision && isAuditor && (
                          <div className="flex gap-2">
                            <button onClick={() => actions.validateAnomaly(caseId, anomaly.id, 'ACCEPT', 'Confirmed')} className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium">Accept</button>
                            <button onClick={() => actions.validateAnomaly(caseId, anomaly.id, 'REJECT', 'False alarm')} className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium">Reject</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isAuditor && workflow.anomalies.every(a => a.decision) && (
                    <button onClick={handleCompleteCAAT} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                      <ArrowRight size={18} /> Complete CAAT — Proceed to Testing
                    </button>
                  )}
                </div>
              ) : isAuditor ? (
                <button onClick={handleRunCAAT} className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 font-medium flex items-center gap-2">
                  <Cpu size={18} /> Run CAAT Analysis
                </button>
              ) : (
                <p className="text-sm text-gray-500">Auditor will run CAAT analysis on collected documents...</p>
              )}
            </div>
          </Card>
        );

      case 'AUDIT_TESTING':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Audit Testing</h3>
            <div className="space-y-4">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Perform manual testing beyond CAAT analysis. Upload working papers and link evidence to issues found.
                </p>
              </div>
              {isAuditor && (
                <div className="space-y-3">
                  <button
                    onClick={() => actions.addWorkingPaper(caseId, {
                      id: `wp-${Date.now()}`,
                      title: 'Revenue Verification Working Paper',
                      testDescription: 'Verified reported revenue against bank deposits and sales records',
                      result: 'Discrepancy found — ETB 2.3M underreporting',
                      evidenceAttached: true,
                      createdAt: new Date().toISOString(),
                    })}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2"
                  >
                    <FileText size={14} /> Add Working Paper
                  </button>
                  <button onClick={handleCompleteTesting} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                    <ArrowRight size={18} /> Complete Testing — Draft Findings
                  </button>
                </div>
              )}
            </div>
          </Card>
        );

      case 'FINDINGS':
      case 'FINDINGS_REVISION':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Audit Findings</h3>
            <div className="space-y-4">
              {workflow.findings?.length > 0 ? (
                <div className="space-y-3">
                  {workflow.findings.map((finding) => (
                    <div key={finding.id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{finding.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Severity: {finding.severity} · Impact: ETB {finding.financialImpact?.toLocaleString()}</p>
                          <div className="flex gap-1 mt-2">
                            <StatusBadge status={finding.status} />
                            {finding.taxpayerResponse && (
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                finding.taxpayerResponse.responseType === 'AGREE' ? 'bg-green-100 text-green-700' :
                                finding.taxpayerResponse.responseType === 'DISAGREE' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                Taxpayer: {finding.taxpayerResponse.responseType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isAuditor && workflow.steps.FINDINGS?.status === 'in_progress' && (
                    <button onClick={handleSubmitFindings} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                      <Send size={18} /> Submit Findings for TL Approval
                    </button>
                  )}
                  {isTeamLeader && workflow.findings.some(f => f.status === 'SUBMITTED') && (
                    <button onClick={handleApproveFindings} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2">
                      <CheckCircle size={18} /> Approve Findings — Send to Taxpayer
                    </button>
                  )}
                </div>
              ) : isAuditor ? (
                <button onClick={handleSubmitFindings} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                  <AlertTriangle size={18} /> Create Findings
                </button>
              ) : (
                <p className="text-sm text-gray-500">Auditor is drafting findings based on testing results...</p>
              )}
            </div>
          </Card>
        );

      case 'TAXPAYER_RESPONSE':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Taxpayer Response</h3>
            <div className="space-y-4">
              <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-xl p-4">
                <p className="text-sm text-sky-800 dark:text-sky-200">
                  Findings have been sent to the taxpayer. They have <strong>30 days</strong> to respond with agreement, disagreement, or no response.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {workflow.findings?.map(f => (
                  <div key={f.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs font-semibold text-gray-500 uppercase truncate">{f.description}</p>
                    <p className={`text-sm mt-1 font-medium ${
                      f.taxpayerResponse?.responseType === 'AGREE' ? 'text-green-600' :
                      f.taxpayerResponse?.responseType === 'DISAGREE' ? 'text-red-600' :
                      'text-gray-400'
                    }`}>
                      {f.taxpayerResponse ? f.taxpayerResponse.responseType : 'Awaiting Response'}
                    </p>
                  </div>
                ))}
              </div>
              {isAuditor && (
                <button onClick={handleTaxpayerRespond} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                  <MessageSquare size={18} /> Simulate Taxpayer Response
                </button>
              )}
            </div>
          </Card>
        );

      case 'CONCLUSION':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Auditor Conclusion</h3>
            <div className="space-y-4">
              {workflow.status === 'CONCLUDED' ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                  <CheckCircle size={48} className="mx-auto mb-3 text-green-600 dark:text-green-400" />
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">Case Concluded</h3>
                  <p className="text-green-700 dark:text-green-300">The audit case has been finalized and locked.</p>
                  {workflow.conclusions?.length > 0 && (
                    <div className="mt-4 text-left">
                      <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">Conclusions:</p>
                      {workflow.conclusions.map(c => (
                        <div key={c.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800 mt-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Determination: {c.determination}</p>
                          <p className="text-xs text-gray-500 mt-1">Adjustment: ETB {c.adjustmentAmount?.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 mt-1">{c.rationale}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Make final determination for each finding: Upheld, Reduced, Overturned, or Withdrawn.
                  </p>
                  {workflow.findings?.map(f => (
                    <div key={f.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{f.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Financial Impact: ETB {f.financialImpact?.toLocaleString()}</p>
                      {f.taxpayerResponse && (
                        <p className="text-xs text-gray-500 mt-1">Taxpayer: {f.taxpayerResponse.responseType}</p>
                      )}
                    </div>
                  ))}
                  {isAuditor && (
                    <button onClick={handleConcludeCase} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2">
                      <CheckCircle size={18} /> Finalize & Conclude Case
                    </button>
                  )}
                </div>
              )}
            </div>
          </Card>
        );

      default:
        return (
          <Card className="p-6 text-center">
            <p className="text-gray-500">Step not yet started</p>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {caseData?.taxpayerName || 'Case Execution'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Audit Execution Workflow — {progress.current} of {progress.total} steps complete ({progress.percent}%)
          </p>
        </div>
        <div className="w-20"></div>
      </div>

      {/* Workflow Progress */}
      <Card className="p-6 overflow-x-auto">
        <WorkflowProgress currentStep={workflow.currentStep} stepStatuses={stepStatuses} />
      </Card>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      {/* Case Summary Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Taxpayer</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{caseData?.taxpayerName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Risk</p>
              <StatusBadge status={caseData?.riskPriority || caseData?.riskLevel} variant="risk" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
              <StatusBadge status={workflow.status} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-semibold">Current Step</p>
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {WORKFLOW_STEPS.find(s => s.id === workflow.currentStep)?.label || 'N/A'}
            </p>
          </div>
        </div>
      </Card>

      {/* Current Step Content */}
      {renderStepContent()}

      {/* Activity Timeline */}
      {workflow.timeline?.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock size={20} />
            Workflow Timeline
          </h3>
          <div className="space-y-3">
            {workflow.timeline.map((event, idx) => (
              <div key={idx} className="flex gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{event.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Step {WORKFLOW_STEPS.find(s => s.id === event.step)?.number || '?'}: {event.step} · {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

    </div>
  );
}
