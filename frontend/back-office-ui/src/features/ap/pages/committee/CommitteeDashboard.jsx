import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, StatCard, Button, Badge, Alert, Tabs, Modal, Input, Textarea, Select } from '../../../../components/ui/index.jsx';
import {
  Users, CheckCircle2, Clock, AlertTriangle, BarChart2,
  FileText, Scale, ShieldAlert, Layers3, RefreshCw, Landmark,
  Send, Search, Check, ChevronRight, ClipboardList, Calendar,
  FileCheck, DollarSign, ArrowRight, Printer, Filter, Sparkles,
  Target, UserCheck, ArrowRightLeft, UserPlus
} from 'lucide-react';
import TpCommitteeWorkspace from '../../../tp/pages/TpCommitteeWorkspace.jsx';
import { formatRevenueWithCurrency, formatRevenue } from '../../utils/revenueFormatter.js';
import CaseDetailModal from '../shared/CaseDetailModal.jsx';

/**
 * CommitteeDashboard — Transfer Pricing Process Owner / Review Committee Dashboard
 * 
 * Executive governance console tailored specifically for the unified authority:
 * TP Process Owner / Review Committee.
 * 
 * Core statutory responsibilities:
 *   1. Case Intake & Dossier Review (Directive No. 43/2015 & Art. 79)
 *   2. Assignment of Cases to TP Team Leaders for Audit Planning & Execution
 *   3. Working Hypothesis Formulation & Net Revenue at Risk Modeling
 *   4. Committee Planning Meeting & Statutory Case Plan Mandate (triggering Audit Planning)
 *   5. Technical Review & Authorization of Audit Plans & IDR-01
 *   6. Final TP Audit Report Approval & Exit Conference Clearance
 *   7. Statutory Assessment Notice Sign-Off & Criminal Fraud Referrals
 *   8. Deliberation Registry & Performance Management Reporting
 */
export default function CommitteeDashboard({ view }) {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('ALL');

  // Selected case and active gate for TpCommitteeWorkspace
  const [tpWorkspaceCase, setTpWorkspaceCase] = useState(null);
  const [tpWorkspaceGate, setTpWorkspaceGate] = useState(null);

  // Dossier modal state
  const [dossierCase, setDossierCase] = useState(null);

  // Assign Team Leader Modal State
  const [assignModalCase, setAssignModalCase] = useState(null);
  const [selectedTL, setSelectedTL] = useState('');
  const [assignNotes, setAssignNotes] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Batch Assignment State
  const [selectedCaseIds, setSelectedCaseIds] = useState(new Set());
  const [batchAssignTL, setBatchAssignTL] = useState('');

  // Deliberation Sessions State
  const [deliberationModal, setDeliberationModal] = useState(false);
  const [selectedDelibView, setSelectedDelibView] = useState(null);
  const [delibSuccess, setDelibSuccess] = useState('');
  const [deliberations, setDeliberations] = useState([
    {
      id: 'DELIB-2026-001',
      sessionDate: '2026-09-02',
      sessionTitle: 'Q3 Transfer Pricing Statutory Review — Cross-Border Management Fees',
      caseNumber: '2026-8e7018d8-REG-FED-federal-lto1-0026',
      taxpayerName: 'Metropolitan Wholesale Chemicals & Polymers S.C.',
      agenda: 'Evaluation of management fee deductions and Singapore hub procurement markups',
      quorum: ['Committee Chair (Presiding)', 'Senior TP Economist', 'Legal & Treaty Counsel', 'LTO Delegate'],
      decision: 'APPROVED',
      proposedAdjustment: 24500000,
      decisionNotes: 'Quorum established. The committee unanimously approved the proposed transfer pricing audit scope focusing on disallowance of management fee deductions under Art. 79 of Tax Proclamation 979/2016.',
      resolutionNumber: 'TP-RES-2026/042'
    },
    {
      id: 'DELIB-2026-002',
      sessionDate: '2026-09-04',
      sessionTitle: 'Offshore Intangible Brand Royalty Assessment Hearing',
      caseNumber: '2026-8e7018d8-REG-FED-federal-lto1-0030',
      taxpayerName: 'Sheba Hospitality & Luxury Resorts S.C.',
      agenda: 'Interquartile range analysis on trademark royalties paid to Swiss affiliate',
      quorum: ['Committee Chair (Presiding)', 'Senior TP Economist', 'Legal & Treaty Counsel'],
      decision: 'APPROVED_WITH_CONDITIONS',
      proposedAdjustment: 18200000,
      decisionNotes: 'Approved for full audit. Committee directs the field audit team to request local file DEMPE evidence and intercompany agreements via IDR-01 within 10 days of entry conference.',
      resolutionNumber: 'TP-RES-2026/043'
    }
  ]);

  const [newDelib, setNewDelib] = useState({
    sessionTitle: '',
    caseId: '',
    agenda: '',
    decision: 'APPROVED',
    proposedAdjustment: '',
    decisionNotes: '',
    attendees: ['Committee Chair (Presiding)', 'Senior TP Economist', 'Legal & Treaty Counsel']
  });

  // Map sidebar views to tabs
  useEffect(() => {
    if (!view) return;
    if (view === 'assign' || view === 'assign-cases') {
      setTab('assign');
      setTpWorkspaceCase(null);
    } else if (view === 'intake') {
      setTab('intake');
      setTpWorkspaceCase(null);
    } else if (view === 'planning') {
      setTab('planning');
      setTpWorkspaceCase(null);
    } else if (view === 'approvals') {
      setTab('approvals');
      setTpWorkspaceCase(null);
    } else if (view === 'deliberations') {
      setTab('deliberations');
      setTpWorkspaceCase(null);
    } else if (view === 'cases') {
      setTab('cases');
      setTpWorkspaceCase(null);
    } else if (view === 'dashboard' || view === 'queue') {
      setTab('queue');
      setTpWorkspaceCase(null);
    }
  }, [view]);

  const effectiveTaxCenter = user?.taxCenter || (() => {
    const raw = (user?.username || user?.id || '').toLowerCase();
    const stripped = raw.replace(/^u-com-/, '').replace(/-(?:tp|ja|joint|desk|comp|issue|chair|tpchair|jachair|mem\d*|tpmem\d*)$/, '');
    if (stripped === 'fed' || stripped.includes('federal-lto1') || !stripped) return 'federal-lto1';
    return stripped;
  })();

  // Fetch Cases from Backend
  const fetchCases = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      let r = await fetch(`/api/v1/backoffice/ap/cases?committeeId=${user.id}`, {
        headers: { 'X-Actor-Id': user.id }
      });
      let res = r.ok ? await r.json() : null;
      let data = res?.data || [];

      // If empty for this committee ID, fallback to fetching TP cases for jurisdiction
      if (data.length === 0 && effectiveTaxCenter) {
        r = await fetch(`/api/v1/backoffice/ap/cases?taxCenter=${effectiveTaxCenter}&auditType=TRANSFER_PRICING`, {
          headers: { 'X-Actor-Id': user.id }
        });
        if (r.ok) {
          res = await r.json();
          data = res?.data || [];
        }
      }
      setCases(data);
    } catch (e) {
      console.error('CommitteeDashboard fetchCases error:', e);
    } finally {
      setLoading(false);
    }
  }, [user?.id, effectiveTaxCenter]);

  // Fetch TP Team Leaders strictly for this committee's Tax Center
  const fetchTeamLeaders = useCallback(async () => {
    try {
      const tcParam = effectiveTaxCenter ? `&taxCenter=${encodeURIComponent(effectiveTaxCenter)}` : '';
      const r = await fetch(`/api/v1/backoffice/ap/users?role=team_leader&auditType=TRANSFER_PRICING${tcParam}`);
      if (r.ok) {
        const res = await r.json();
        const list = Array.isArray(res) ? res : (res.data || []);
        setTeamLeaders(list);
      }
    } catch (e) {
      console.error('Failed to load TP team leaders:', e);
    }
  }, [effectiveTaxCenter]);

  useEffect(() => {
    fetchCases();
    fetchTeamLeaders();
  }, [fetchCases, fetchTeamLeaders]);

  // Assign Case to Team Leader Action
  const handleAssignCaseToTL = async (targetCaseId, targetTLId, notes = '') => {
    if (!targetCaseId || !targetTLId) return;
    setAssigning(true);
    try {
      const r = await fetch(`/api/v1/backoffice/ap/cases/${targetCaseId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': user?.id || user?.username || 'tp-chair'
        },
        body: JSON.stringify({
          teamLeaderId: targetTLId,
          notes: notes || undefined
        })
      });
      if (r.ok) {
        const selectedTLObj = teamLeaders.find(tl => tl.username === targetTLId);
        const tlName = selectedTLObj?.fullName || targetTLId;
        setDelibSuccess(`Case successfully assigned to TP Team Leader ${tlName}! The case is now accessible on the Team Leader's dashboard.`);
        setAssignModalCase(null);
        setSelectedTL('');
        setAssignNotes('');
        await fetchCases();
      } else {
        const err = await r.json().catch(() => ({}));
        alert(`Failed to assign case: ${err.message || r.statusText}`);
      }
    } catch (e) {
      console.error('Assign error:', e);
      alert(`Assignment failed: ${e.message}`);
    } finally {
      setAssigning(false);
    }
  };

  // Batch Assign Selected Cases
  const handleBatchAssign = async () => {
    if (selectedCaseIds.size === 0 || !batchAssignTL) {
      alert('Please select at least one case and a target TP Team Leader.');
      return;
    }
    setAssigning(true);
    try {
      const ids = Array.from(selectedCaseIds);
      let successCount = 0;
      for (const id of ids) {
        const r = await fetch(`/api/v1/backoffice/ap/cases/${id}/assign`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor-Id': user?.id || user?.username || 'tp-chair'
          },
          body: JSON.stringify({ teamLeaderId: batchAssignTL })
        });
        if (r.ok) successCount++;
      }
      const selectedTLObj = teamLeaders.find(tl => tl.username === batchAssignTL);
      const tlName = selectedTLObj?.fullName || batchAssignTL;
      setDelibSuccess(`Successfully assigned ${successCount} case(s) to TP Team Leader ${tlName}!`);
      setSelectedCaseIds(new Set());
      setBatchAssignTL('');
      await fetchCases();
    } catch (e) {
      console.error('Batch assign error:', e);
      alert(`Batch assignment failed: ${e.message}`);
    } finally {
      setAssigning(false);
    }
  };

  // Open Workspace for a specific case and optional gate
  const handleOpenWorkspace = (c, gate = 'INTAKE_REVIEW') => {
    setTpWorkspaceGate(gate);
    setTpWorkspaceCase(c);
  };

  // Pipeline Metric Computations
  const intakeCases = cases.filter(c => 
    c.status === 'ASSIGNED_TO_COMMITTEE' || 
    c.tpCurrentPhase === 'COMMITTEE_INTAKE'
  );

  const unassignedTLCases = cases.filter(c => 
    !c.assignedTeamLeaderId || c.status === 'ASSIGNED_TO_COMMITTEE'
  );

  const hypothesisCases = cases.filter(c => 
    c.status === 'TP_INTAKE_ACCEPTED' || 
    c.tpCurrentPhase === 'HYPOTHESIS_DEVELOPMENT' || 
    c.status === 'HYPOTHESIS_IN_PROGRESS'
  );

  const planningMeetingCases = cases.filter(c => 
    c.status === 'DEVELOPED_BY_PO' || 
    c.status === 'AWAITING_COMMITTEE_DECISION' || 
    c.tpCurrentPhase === 'PLANNING_MEETING'
  );

  const planApprovalCases = cases.filter(c => 
    c.status === 'AUDIT_PLAN_SUBMITTED_COMMITTEE' ||
    c.status === 'AUDIT_PLAN_SUBMITTED_TL' || 
    c.status === 'UNDER_REVIEW' ||
    c.status === 'AUDIT_PLAN_SUBMITTED'
  );

  const reportApprovalCases = cases.filter(c => 
    c.status === 'SUBMITTED_FOR_PO_REVIEW' || 
    c.status === 'SUBMITTED_FOR_COMMITTEE' ||
    c.status === 'RISK_ASSESSMENT_SUBMITTED_COMMITTEE' ||
    c.status === 'PENDING_PO_NOTICE_AUTHORIZATION' ||
    c.status === 'EXIT_CONFERENCE_PENDING_PO'
  );

  const activeExecutionCases = cases.filter(c => 
    c.status === 'IN_PROGRESS' || 
    c.status === 'PLANNING_TRIGGERED' ||
    c.status === 'AUDIT_PLAN_APPROVED'
  );

  const completedCases = cases.filter(c => 
    ['COMPLETED', 'CLOSED', 'FINAL_ASSESSMENT_ISSUED'].includes(c.status)
  );

  const totalRevenueAtRisk = cases.reduce((sum, c) => sum + (Number(c.estimatedRevenue) || 0), 0);
  const actionRequiredCount = intakeCases.length + hypothesisCases.length + planningMeetingCases.length + planApprovalCases.length + reportApprovalCases.length;

  // Handle Recording Deliberation
  const handleRecordDeliberation = () => {
    if (!newDelib.sessionTitle || !newDelib.decisionNotes) {
      alert('Please enter a session title and formal committee decision notes.');
      return;
    }

    const selectedCaseObj = cases.find(c => c.id === newDelib.caseId) || cases[0];
    const newRecord = {
      id: `DELIB-2026-00${deliberations.length + 1}`,
      sessionDate: new Date().toISOString().split('T')[0],
      sessionTitle: newDelib.sessionTitle,
      caseNumber: selectedCaseObj?.caseNumber || 'CASE-TP-2026',
      taxpayerName: selectedCaseObj?.taxpayerName || 'Selected Enterprise',
      agenda: newDelib.agenda || 'Statutory Transfer Pricing Review',
      quorum: newDelib.attendees,
      decision: newDelib.decision,
      proposedAdjustment: parseFloat(newDelib.proposedAdjustment) || 0,
      decisionNotes: newDelib.decisionNotes,
      resolutionNumber: `TP-RES-2026/0${44 + deliberations.length}`
    };

    setDeliberations([newRecord, ...deliberations]);
    setDelibSuccess(`Formal Resolution ${newRecord.resolutionNumber} successfully recorded in the statutory register!`);
    setDeliberationModal(false);
    setNewDelib({
      sessionTitle: '',
      caseId: '',
      agenda: '',
      decision: 'APPROVED',
      proposedAdjustment: '',
      decisionNotes: '',
      attendees: ['Committee Chair (Presiding)', 'Senior TP Economist', 'Legal & Treaty Counsel']
    });
  };

  // Helper for status badge color & label
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ASSIGNED_TO_COMMITTEE':
        return { label: 'New Intake (Awaiting TL)', color: 'amber', dot: true };
      case 'ASSIGNED_TO_TEAM_LEADER':
        return { label: 'Assigned to Team Leader', color: 'teal', dot: false };
      case 'TP_INTAKE_ACCEPTED':
      case 'HYPOTHESIS_DEVELOPMENT':
        return { label: 'Hypothesis In Progress', color: 'blue', dot: true };
      case 'DEVELOPED_BY_PO':
      case 'PLANNING_MEETING':
      case 'AWAITING_COMMITTEE_DECISION':
        return { label: 'Planning Session Due', color: 'indigo', dot: true };
      case 'PLANNING_TRIGGERED':
        return { label: 'Mandate Issued (Planning)', color: 'teal', dot: false };
      case 'AUDIT_PLAN_SUBMITTED_TL':
      case 'UNDER_REVIEW':
        return { label: 'Audit Plan Awaiting TL', color: 'amber', dot: true };
      case 'RISK_ASSESSMENT_SUBMITTED_TL':
        return { label: 'Risk Assessment Awaiting TL', color: 'amber', dot: true };
      case 'AUDIT_PLAN_SUBMITTED_COMMITTEE':
        return { label: 'Plan Awaiting Committee', color: 'purple', dot: true };
      case 'SUBMITTED_FOR_COMMITTEE':
      case 'RISK_ASSESSMENT_SUBMITTED_COMMITTEE':
        return { label: 'Endorsed for Committee Review', color: 'purple', dot: true };
      case 'AUDIT_PLAN_APPROVED':
        return { label: 'Plan Approved (Fieldwork)', color: 'emerald', dot: false };
      case 'IN_PROGRESS':
        return { label: 'Field Execution', color: 'blue', dot: false };
      case 'SUBMITTED_FOR_PO_REVIEW':
        return { label: 'Report Awaiting Sign-Off', color: 'rose', dot: true };
      case 'COMPLETED':
      case 'CLOSED':
        return { label: 'Audit Closed', color: 'gray', dot: false };
      default:
        return { label: status?.replace(/_/g, ' ') || 'Pending', color: 'slate', dot: false };
    }
  };

  // Filtered cases for All Cases tab
  const filteredCases = cases.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchQuery = !q || 
      (c.caseNumber || '').toLowerCase().includes(q) ||
      (c.taxpayerName || '').toLowerCase().includes(q) ||
      (c.taxpayerId || '').toLowerCase().includes(q) ||
      (c.sector || '').toLowerCase().includes(q);

    if (!matchQuery) return false;
    if (phaseFilter === 'ALL') return true;
    if (phaseFilter === 'UNASSIGNED_TL') return !c.assignedTeamLeaderId;
    if (phaseFilter === 'INTAKE') return c.status === 'ASSIGNED_TO_COMMITTEE' || c.tpCurrentPhase === 'COMMITTEE_INTAKE';
    if (phaseFilter === 'HYPOTHESIS') return c.status === 'TP_INTAKE_ACCEPTED' || c.tpCurrentPhase === 'HYPOTHESIS_DEVELOPMENT';
    if (phaseFilter === 'PLANNING') return c.tpCurrentPhase === 'PLANNING_MEETING' || c.status === 'PLANNING_TRIGGERED' || c.tpCurrentPhase === 'PLANNING';
    if (phaseFilter === 'EXECUTION') return c.status === 'IN_PROGRESS';
    if (phaseFilter === 'COMPLETED') return c.status === 'COMPLETED' || c.status === 'CLOSED';
    return true;
  });

  // Strictly enforce Tax Center scoping for Transfer Pricing Team Leaders
  const filteredTeamLeaders = teamLeaders.filter(tl => {
    if (!effectiveTaxCenter) return true;
    const norm = (s) => (s || '').toLowerCase().replace(/[-_]/g, '');
    const targetNorm = norm(effectiveTaxCenter);
    const tlLoc = norm(tl.assignedLocation || '');
    const tlUser = norm(tl.username || '');
    return tlLoc.includes(targetNorm) || tlUser.includes(targetNorm);
  });

  // Render Full Case Workspace if selected
  if (tpWorkspaceCase) {
    return (
      <TpCommitteeWorkspace
        caseData={tpWorkspaceCase}
        user={user}
        initialGate={tpWorkspaceGate}
        onClose={() => {
          setTpWorkspaceCase(null);
          setTpWorkspaceGate(null);
        }}
        onRefresh={() => {
          fetchCases();
          setTpWorkspaceCase(null);
          setTpWorkspaceGate(null);
        }}
      />
    );
  }

  // Navigation Tabs Configuration
  const tabs = [
    { id: 'queue', label: 'Action Required', count: actionRequiredCount },
    { id: 'assign', label: 'Assign to Team Leaders', count: unassignedTLCases.length },
    { id: 'intake', label: 'Intake & Hypotheses', count: intakeCases.length + hypothesisCases.length },
    { id: 'planning', label: 'Planning & Mandates', count: planningMeetingCases.length + activeExecutionCases.length },
    { id: 'approvals', label: 'Plan & Report Approvals', count: planApprovalCases.length + reportApprovalCases.length },
    { id: 'deliberations', label: 'Statutory Resolutions', count: deliberations.length },
    { id: 'cases', label: 'All TP Cases', count: cases.length },
    { id: 'reports', label: 'Management Reports' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ── Executive Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded-xl">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Transfer Pricing Process Owner / Review Committee
                </h1>
                <Badge color="purple" size="sm">Statutory Authority</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ministry of Revenues • Federal & Regional Transfer Pricing Governance & Quality Review
                {user?.taxCenter && <span className="font-semibold text-slate-700 dark:text-slate-300"> • Jurisdiction: {user.taxCenter.replace(/-/g, ' ').toUpperCase()}</span>}
                {user?.username && <span className="text-slate-400"> • Actor: {user.username}</span>}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="secondary"
            icon={RefreshCw}
            onClick={() => { fetchCases(); fetchTeamLeaders(); }}
            disabled={loading}
            className="border-slate-300 dark:border-slate-700"
          >
            {loading ? 'Syncing...' : 'Refresh'}
          </Button>

          <Button
            size="sm"
            variant="secondary"
            icon={UserPlus}
            onClick={() => setTab('assign')}
            className="border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40"
          >
            Assign Team Leaders
          </Button>

          <Button
            size="sm"
            variant="primary"
            icon={Landmark}
            onClick={() => setDeliberationModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
          >
            Convene Committee Session
          </Button>
        </div>
      </div>

      {/* ── Success Alert ── */}
      {delibSuccess && (
        <Alert 
          type="success" 
          title="Action Completed Successfully"
          onClose={() => setDelibSuccess('')}
        >
          {delibSuccess}
        </Alert>
      )}

      {/* ── Executive Stat KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          label="New Intakes Pending"
          value={intakeCases.length}
          icon={ClipboardList}
          color={intakeCases.length > 0 ? 'amber' : 'slate'}
          sub="Requires intake review"
        />
        <StatCard
          label="Awaiting TL Assignment"
          value={unassignedTLCases.length}
          icon={Target}
          color={unassignedTLCases.length > 0 ? 'purple' : 'slate'}
          sub="Assign to Team Leader"
        />
        <StatCard
          label="Hypotheses Modeling"
          value={hypothesisCases.length}
          icon={FileText}
          color={hypothesisCases.length > 0 ? 'blue' : 'slate'}
          sub="Revenue at risk calculation"
        />
        <StatCard
          label="Planning Sessions Due"
          value={planningMeetingCases.length}
          icon={Users}
          color={planningMeetingCases.length > 0 ? 'indigo' : 'slate'}
          sub="Unblocks audit team"
        />
        <StatCard
          label="Plans for Approval"
          value={planApprovalCases.length}
          icon={Calendar}
          color={planApprovalCases.length > 0 ? 'purple' : 'slate'}
          sub="Submitted by Team Leaders"
        />
        <StatCard
          label="Revenue at Risk"
          value={formatRevenue(totalRevenueAtRisk)}
          icon={DollarSign}
          color="emerald"
          sub="Active TP portfolio"
        />
      </div>

      {/* ── Main Workspace Navigation Card ── */}
      <Card padding={false} className="shadow-xs overflow-hidden">
        <div className="px-6 pt-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
        </div>

        {/* ═══ TAB 1: ACTION REQUIRED QUEUE ═══ */}
        {tab === 'queue' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Mandatory Statutory Action Queue</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cases requiring immediate Committee intake, team leader assignment, or statutory approval to unblock the audit lifecycle.
                </p>
              </div>
              <Badge color={actionRequiredCount > 0 ? 'amber' : 'green'} size="sm">
                {actionRequiredCount} Action(s) Pending
              </Badge>
            </div>

            {actionRequiredCount === 0 ? (
              <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">All Clear! No Pending Actions Required</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  All assigned transfer pricing cases are progressing through audit planning or active field examination. Check other tabs to monitor active cases.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1. New Intakes */}
                {intakeCases.map(c => {
                  const tlName = teamLeaders.find(tl => tl.username === c.assignedTeamLeaderId)?.fullName || c.assignedTeamLeaderId;
                  return (
                    <div key={c.id} className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-xs transition">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge color="amber" size="xs">New Intake Assignment</Badge>
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{c.caseNumber}</span>
                          {c.assignedTeamLeaderId ? (
                            <Badge color="teal" size="xs">TL: {tlName}</Badge>
                          ) : (
                            <Badge color="red" size="xs">Team Leader Not Assigned</Badge>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.taxpayerName || c.taxpayerId}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Sector: {c.sector || 'Commercial'} • Portfolio Value: {formatRevenueWithCurrency(c.estimatedRevenue)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={UserCheck}
                          className="border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-50"
                          onClick={() => {
                            setAssignModalCase(c);
                            setSelectedTL(c.assignedTeamLeaderId || '');
                          }}
                        >
                          {c.assignedTeamLeaderId ? 'Reassign TL' : 'Assign TP Team Leader'}
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          icon={ClipboardList}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                          onClick={() => handleOpenWorkspace(c, 'INTAKE_REVIEW')}
                        >
                          Accept Case & Review Dossier
                        </Button>
                      </div>
                    </div>
                  );
                })}

                {/* 2. Hypotheses in Development */}
                {hypothesisCases.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-blue-300 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-xs transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge color="blue" size="xs">Working Hypothesis Needed</Badge>
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{c.caseNumber}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.taxpayerName || c.taxpayerId}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Intake accepted. Formulate economic hypothesis and compute Net Amount of Revenue at Risk.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="primary"
                        icon={FileText}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        onClick={() => handleOpenWorkspace(c, 'WORKING_HYPOTHESIS')}
                      >
                        Develop Working Hypothesis
                      </Button>
                    </div>
                  </div>
                ))}

                {/* 3. Planning Meeting Due */}
                {planningMeetingCases.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-xs transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge color="indigo" size="xs">Planning Session Due</Badge>
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{c.caseNumber}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.taxpayerName || c.taxpayerId}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Hypothesis formulated. Convene formal Planning Meeting, issue Mandate Directives, and trigger audit planning.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="primary"
                        icon={Users}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                        onClick={() => handleOpenWorkspace(c, 'PLANNING_MEETING')}
                      >
                        Convene Planning Session & Issue Mandate
                      </Button>
                    </div>
                  </div>
                ))}

                {/* 4. Plan Approval Due */}
                {planApprovalCases.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-xs transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge color="purple" size="xs">Audit Plan for Approval</Badge>
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{c.caseNumber}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.taxpayerName || c.taxpayerId}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Team Leader has reviewed and submitted the Audit Plan & IDR-01. Review and authorize to unlock field work.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="primary"
                        icon={Calendar}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                        onClick={() => handleOpenWorkspace(c, 'PLAN_APPROVAL')}
                      >
                        Review & Authorize Audit Plan
                      </Button>
                    </div>
                  </div>
                ))}

                {/* 5. Report / Notice Approval Due */}
                {reportApprovalCases.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-xs transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge color="rose" size="xs">Final Report & Assessment</Badge>
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{c.caseNumber}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.taxpayerName || c.taxpayerId}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Field work and economic analysis completed. Conduct statutory review of draft report, clear exit conference, and authorize assessment.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="primary"
                        icon={Scale}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                        onClick={() => handleOpenWorkspace(c, 'REPORT_APPROVAL')}
                      >
                        Review & Sign-Off Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB: ASSIGN CASES TO TEAM LEADERS ═══ */}
        {tab === 'assign' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>Assign Cases to Transfer Pricing Team Leaders</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assign received Transfer Pricing cases to specialized TP Team Leaders to supervise audit planning, technical IDRs, and field examination.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/80 text-xs font-semibold text-purple-900 dark:text-purple-200 shadow-2xs">
                  <Landmark className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Tax Center: {effectiveTaxCenter.replace(/[-_]/g, ' ').toUpperCase()}</span>
                </div>
                <Badge color="purple" size="sm">Jurisdiction Scoped</Badge>
              </div>
            </div>

            {/* Team Leader Workload & Capacity Cards */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <span>Transfer Pricing Team Leaders — {effectiveTaxCenter.replace(/[-_]/g, ' ').toUpperCase()}</span>
                  <span className="text-purple-600 font-semibold font-mono">({filteredTeamLeaders.length} Available)</span>
                </h4>
                <span className="text-[11px] text-slate-500">
                  Stationed at {effectiveTaxCenter.replace(/[-_]/g, ' ').toUpperCase()} • Cross-center delegation restricted
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredTeamLeaders.map(tl => {
                  const assignedCount = cases.filter(c => c.assignedTeamLeaderId === tl.username).length;
                  return (
                    <div
                      key={tl.userId || tl.username}
                      className="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-purple-400 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{tl.fullName || tl.username}</p>
                          <p className="font-mono text-[10px] text-slate-400">{tl.username}</p>
                          <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-medium">
                            {tl.assignedLocation || effectiveTaxCenter} • TP Supervisor
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-slate-900 dark:text-white">{assignedCount}</span>
                          <p className="text-[9px] text-slate-400 uppercase font-semibold">Active Cases</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Batch Action Toolbar */}
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 text-white rounded-lg">
                  <UserCheck size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-purple-950 dark:text-purple-200">
                    Batch Case Assignment ({selectedCaseIds.size} selected)
                  </p>
                  <p className="text-[11px] text-purple-700 dark:text-purple-400">
                    Select cases below, choose an eligible TP Team Leader, and dispatch assignments.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={batchAssignTL}
                  onChange={e => setBatchAssignTL(e.target.value)}
                  className="text-xs bg-white dark:bg-slate-800 min-w-[220px]"
                >
                  <option value="">Select Target TP Team Leader...</option>
                  {filteredTeamLeaders.map(tl => (
                    <option key={tl.userId || tl.username} value={tl.username}>
                      {tl.fullName || tl.username} ({tl.assignedLocation || 'TC'})
                    </option>
                  ))}
                </Select>
                <Button
                  size="sm"
                  variant="primary"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold whitespace-nowrap"
                  disabled={selectedCaseIds.size === 0 || !batchAssignTL || assigning}
                  onClick={handleBatchAssign}
                >
                  {assigning ? 'Assigning...' : `Assign ${selectedCaseIds.size} Case(s)`}
                </Button>
              </div>
            </div>

            {/* Cases Table for Assignment */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={cases.length > 0 && selectedCaseIds.size === cases.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCaseIds(new Set(cases.map(c => c.id)));
                          } else {
                            setSelectedCaseIds(new Set());
                          }
                        }}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="p-3 font-semibold">Case Number</th>
                    <th className="p-3 font-semibold">Taxpayer / Enterprise</th>
                    <th className="p-3 font-semibold">Sector</th>
                    <th className="p-3 font-semibold">Revenue at Risk</th>
                    <th className="p-3 font-semibold">Current Status</th>
                    <th className="p-3 font-semibold">Assigned Team Leader</th>
                    <th className="p-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cases.map(c => {
                    const isSelected = selectedCaseIds.has(c.id);
                    const tlName = teamLeaders.find(tl => tl.username === c.assignedTeamLeaderId)?.fullName || c.assignedTeamLeaderId;
                    const badgeInfo = getStatusBadge(c.status);

                    return (
                      <tr key={c.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition ${isSelected ? 'bg-purple-50/40 dark:bg-purple-950/20' : ''}`}>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const next = new Set(selectedCaseIds);
                              if (e.target.checked) next.add(c.id);
                              else next.delete(c.id);
                              setSelectedCaseIds(next);
                            }}
                            className="rounded text-purple-600 focus:ring-purple-500"
                          />
                        </td>
                        <td className="p-3 font-mono font-bold text-purple-700 dark:text-purple-400">{c.caseNumber}</td>
                        <td className="p-3">
                          <p className="font-bold text-slate-900 dark:text-white">{c.taxpayerName || c.taxpayerId}</p>
                          <p className="text-[10px] text-slate-400">TIN: {c.taxpayerId}</p>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{c.sector || 'General'}</td>
                        <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatRevenueWithCurrency(c.estimatedRevenue)}
                        </td>
                        <td className="p-3">
                          <Badge color={badgeInfo.color} size="xs" dot={badgeInfo.dot}>
                            {badgeInfo.label}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {c.assignedTeamLeaderId ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 font-medium text-[11px]">
                              <UserCheck size={12} className="text-teal-600" />
                              <span>{tlName}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-medium text-[11px]">
                              <AlertTriangle size={12} className="text-amber-500" />
                              <span>Not Assigned</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="xs"
                              variant="secondary"
                              onClick={() => setDossierCase(c)}
                            >
                              View Dossier
                            </Button>
                            <Button
                              size="xs"
                              variant={c.assignedTeamLeaderId ? 'secondary' : 'primary'}
                              className={c.assignedTeamLeaderId ? '' : 'bg-purple-600 hover:bg-purple-700 text-white'}
                              onClick={() => {
                                setAssignModalCase(c);
                                setSelectedTL(c.assignedTeamLeaderId || '');
                              }}
                            >
                              {c.assignedTeamLeaderId ? 'Reassign' : 'Assign TL'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ TAB 2: INTAKE & HYPOTHESES ═══ */}
        {tab === 'intake' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Case Intake & Working Hypothesis Development
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Initial intake confirmation, risk dossier evaluation, and Revenue at Risk mathematical modeling under Directive No. 43/2015.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 font-semibold">Case Number</th>
                    <th className="p-3 font-semibold">Taxpayer / Enterprise</th>
                    <th className="p-3 font-semibold">Sector</th>
                    <th className="p-3 font-semibold">Base Turnover</th>
                    <th className="p-3 font-semibold">Stage Status</th>
                    <th className="p-3 font-semibold">Team Leader</th>
                    <th className="p-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[...intakeCases, ...hypothesisCases].length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No cases currently in Intake or Hypothesis stage.
                      </td>
                    </tr>
                  ) : (
                    [...intakeCases, ...hypothesisCases].map(c => {
                      const isIntake = c.status === 'ASSIGNED_TO_COMMITTEE';
                      const tlName = teamLeaders.find(tl => tl.username === c.assignedTeamLeaderId)?.fullName || c.assignedTeamLeaderId;
                      return (
                        <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                          <td className="p-3 font-mono font-bold text-purple-700 dark:text-purple-400">{c.caseNumber}</td>
                          <td className="p-3">
                            <p className="font-bold text-slate-900 dark:text-white">{c.taxpayerName || c.taxpayerId}</p>
                            <p className="text-[10px] text-slate-400">TIN: {c.taxpayerId}</p>
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-300">{c.sector || 'General'}</td>
                          <td className="p-3 font-semibold">{formatRevenueWithCurrency(c.estimatedRevenue)}</td>
                          <td className="p-3">
                            <Badge color={isIntake ? 'amber' : 'blue'} size="xs" dot>
                              {isIntake ? 'Awaiting Intake Confirmation' : 'Hypothesis Formulation'}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {c.assignedTeamLeaderId ? (
                              <span className="text-teal-700 dark:text-teal-300 font-medium">{tlName}</span>
                            ) : (
                              <Button
                                size="xs"
                                variant="secondary"
                                onClick={() => {
                                  setAssignModalCase(c);
                                  setSelectedTL('');
                                }}
                              >
                                Assign TL
                              </Button>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="xs"
                                variant="secondary"
                                onClick={() => setDossierCase(c)}
                              >
                                View Dossier
                              </Button>
                              <Button
                                size="xs"
                                variant={isIntake ? 'primary' : 'secondary'}
                                className={isIntake ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}
                                onClick={() => handleOpenWorkspace(c, isIntake ? 'INTAKE_REVIEW' : 'WORKING_HYPOTHESIS')}
                              >
                                {isIntake ? 'Accept Intake' : 'Model Hypothesis'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ TAB 3: PLANNING & MANDATES ═══ */}
        {tab === 'planning' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Committee Planning Meetings & Audit Mandates
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Formal review committee sessions, continue determinations, and statutory audit directives handed off to audit teams.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 font-semibold">Case Number</th>
                    <th className="p-3 font-semibold">Taxpayer</th>
                    <th className="p-3 font-semibold">Supervisory Team</th>
                    <th className="p-3 font-semibold">Meeting Status</th>
                    <th className="p-3 font-semibold">Revenue at Risk</th>
                    <th className="p-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[...planningMeetingCases, ...activeExecutionCases].length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No cases currently in planning meeting or mandate phase.
                      </td>
                    </tr>
                  ) : (
                    [...planningMeetingCases, ...activeExecutionCases].map(c => {
                      const isPendingSession = c.status === 'DEVELOPED_BY_PO' || c.status === 'AWAITING_COMMITTEE_DECISION' || c.tpCurrentPhase === 'PLANNING_MEETING';
                      const tlName = teamLeaders.find(tl => tl.username === c.assignedTeamLeaderId)?.fullName || c.assignedTeamLeaderId;
                      return (
                        <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                          <td className="p-3 font-mono font-bold text-purple-700 dark:text-purple-400">{c.caseNumber}</td>
                          <td className="p-3">
                            <p className="font-bold text-slate-900 dark:text-white">{c.taxpayerName || c.taxpayerId}</p>
                            <p className="text-[10px] text-slate-400">{c.sector}</p>
                          </td>
                          <td className="p-3">
                            <p className="font-medium text-slate-800 dark:text-slate-200">{tlName || 'Pending TL'}</p>
                            <p className="text-[10px] text-slate-400">{c.assignedAuditorId || 'Pending Auditor'}</p>
                          </td>
                          <td className="p-3">
                            <Badge color={isPendingSession ? 'indigo' : 'teal'} size="xs" dot={isPendingSession}>
                              {isPendingSession ? 'Session Ready to Convene' : 'Mandate Issued (In Planning)'}
                            </Badge>
                          </td>
                          <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatRevenueWithCurrency(c.estimatedRevenue)}
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              size="xs"
                              variant={isPendingSession ? 'primary' : 'secondary'}
                              className={isPendingSession ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}
                              onClick={() => handleOpenWorkspace(c, 'PLANNING_MEETING')}
                            >
                              {isPendingSession ? 'Hold Session & Direct' : 'View Mandate Directives'}
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ TAB 4: PLAN & REPORT APPROVALS ═══ */}
        {tab === 'approvals' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Audit Plan & Final TP Report Technical Reviews
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Statutory review gates where Team Leaders have submitted audit plans or completed draft TP reports for Committee authorization.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 font-semibold">Case Number</th>
                    <th className="p-3 font-semibold">Taxpayer</th>
                    <th className="p-3 font-semibold">Review Gate</th>
                    <th className="p-3 font-semibold">Submitting Team Leader</th>
                    <th className="p-3 font-semibold">Proposed Demand</th>
                    <th className="p-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[...planApprovalCases, ...reportApprovalCases].length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No plans or reports currently awaiting Committee review.
                      </td>
                    </tr>
                  ) : (
                    [...planApprovalCases, ...reportApprovalCases].map(c => {
                      const isPlan = ['AUDIT_PLAN_SUBMITTED_TL', 'AUDIT_PLAN_SUBMITTED_COMMITTEE', 'UNDER_REVIEW', 'AUDIT_PLAN_SUBMITTED'].includes(c.status);
                      const isRisk = ['SUBMITTED_FOR_COMMITTEE', 'RISK_ASSESSMENT_SUBMITTED_COMMITTEE'].includes(c.status);
                      const tlName = teamLeaders.find(tl => tl.username === c.assignedTeamLeaderId)?.fullName || c.assignedTeamLeaderId;
                      return (
                        <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                          <td className="p-3 font-mono font-bold text-purple-700 dark:text-purple-400">{c.caseNumber}</td>
                          <td className="p-3">
                            <p className="font-bold text-slate-900 dark:text-white">{c.taxpayerName || c.taxpayerId}</p>
                            <p className="text-[10px] text-slate-400">TIN: {c.taxpayerId}</p>
                          </td>
                          <td className="p-3">
                            <Badge color={isPlan ? 'purple' : isRisk ? 'indigo' : 'rose'} size="xs" dot>
                              {isPlan ? 'Audit Plan & IDR Approval' : isRisk ? 'Risk Assessment Review & Mandate' : 'Final Report & Notice Sign-Off'}
                            </Badge>
                          </td>
                          <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                            {tlName || 'Supervisory Team'}
                          </td>
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">
                            {formatRevenueWithCurrency(c.estimatedRevenue)}
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              size="xs"
                              variant="primary"
                              className={isPlan ? 'bg-purple-600 hover:bg-purple-700 text-white' : isRisk ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'}
                              onClick={() => handleOpenWorkspace(c, isPlan ? 'PLAN_APPROVAL' : isRisk ? 'WORKING_HYPOTHESIS' : 'REPORT_APPROVAL')}
                            >
                              {isPlan ? 'Review & Approve Plan' : isRisk ? 'Review & Issue Mandate' : 'Review & Sign Report'}
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ TAB 5: DELIBERATIONS & RESOLUTIONS REGISTRY ═══ */}
        {tab === 'deliberations' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-purple-600" />
                  <span>Statutory Committee Resolutions & Deliberation Registry</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official historical register of formal Transfer Pricing Review Committee sessions, quorum records, and binding decisions under Directive No. 43/2015.
                </p>
              </div>
              <Button
                variant="primary"
                icon={Landmark}
                size="sm"
                onClick={() => setDeliberationModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-xs shrink-0"
              >
                Convene Session
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 font-semibold uppercase">Resolution #</th>
                    <th className="p-3 font-semibold uppercase">Date & Session Title</th>
                    <th className="p-3 font-semibold uppercase">Case / Taxpayer</th>
                    <th className="p-3 font-semibold uppercase">Quorum Members</th>
                    <th className="p-3 font-semibold uppercase">Decision</th>
                    <th className="p-3 font-semibold uppercase text-right">Adjustment</th>
                    <th className="p-3 font-semibold uppercase text-right">Extract</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {deliberations.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono font-bold text-purple-700 dark:text-purple-400">
                        {d.resolutionNumber}
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-slate-900 dark:text-white">{d.sessionTitle}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{d.sessionDate}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{d.taxpayerName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{d.caseNumber}</p>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {d.quorum.map((m, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {m.split('(')[0].trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge
                          color={d.decision === 'APPROVED' ? 'green' : d.decision === 'APPROVED_WITH_CONDITIONS' ? 'blue' : 'amber'}
                          size="xs"
                        >
                          {d.decision.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="p-3 text-right font-semibold text-slate-900 dark:text-white">
                        {d.proposedAdjustment > 0 ? formatRevenueWithCurrency(d.proposedAdjustment) : '—'}
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          size="xs"
                          variant="secondary"
                          icon={Printer}
                          onClick={() => setSelectedDelibView(d)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ TAB 6: ALL TP CASES ═══ */}
        {tab === 'cases' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <Input
                  className="pl-9 text-xs"
                  placeholder="Search by taxpayer, TIN, sector or case number..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <Select
                  value={phaseFilter}
                  onChange={e => setPhaseFilter(e.target.value)}
                  className="text-xs"
                >
                  <option value="ALL">All Stages ({cases.length})</option>
                  <option value="UNASSIGNED_TL">Awaiting Team Leader ({unassignedTLCases.length})</option>
                  <option value="INTAKE">Intake Review ({intakeCases.length})</option>
                  <option value="HYPOTHESIS">Hypothesis Development ({hypothesisCases.length})</option>
                  <option value="PLANNING">Planning & Mandates ({planningMeetingCases.length + activeExecutionCases.length})</option>
                  <option value="EXECUTION">Field Execution ({activeExecutionCases.length})</option>
                  <option value="COMPLETED">Completed / Closed ({completedCases.length})</option>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 font-semibold">Case Number</th>
                    <th className="p-3 font-semibold">Taxpayer / Enterprise</th>
                    <th className="p-3 font-semibold">Sector</th>
                    <th className="p-3 font-semibold">Stage & Status</th>
                    <th className="p-3 font-semibold">Assigned Team Leader</th>
                    <th className="p-3 font-semibold">Estimated Revenue</th>
                    <th className="p-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCases.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">
                        No transfer pricing cases match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredCases.map(c => {
                      const badgeInfo = getStatusBadge(c.status);
                      const tlName = teamLeaders.find(tl => tl.username === c.assignedTeamLeaderId)?.fullName || c.assignedTeamLeaderId;
                      return (
                        <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                          <td className="p-3 font-mono font-bold text-purple-700 dark:text-purple-400">{c.caseNumber}</td>
                          <td className="p-3">
                            <p className="font-bold text-slate-900 dark:text-white">{c.taxpayerName || c.taxpayerId}</p>
                            <p className="text-[10px] text-slate-400">TIN: {c.taxpayerId}</p>
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-300">{c.sector || 'Commercial'}</td>
                          <td className="p-3">
                            <Badge color={badgeInfo.color} size="xs" dot={badgeInfo.dot}>
                              {badgeInfo.label}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {c.assignedTeamLeaderId ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium text-slate-800 dark:text-slate-200">{tlName}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAssignModalCase(c);
                                    setSelectedTL(c.assignedTeamLeaderId || '');
                                  }}
                                  className="text-[10px] text-purple-600 hover:text-purple-800 underline ml-1"
                                >
                                  change
                                </button>
                              </div>
                            ) : (
                              <Button
                                size="xs"
                                variant="secondary"
                                icon={UserCheck}
                                className="text-purple-700 border-purple-300 hover:bg-purple-50"
                                onClick={() => {
                                  setAssignModalCase(c);
                                  setSelectedTL('');
                                }}
                              >
                                Assign TL
                              </Button>
                            )}
                          </td>
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">
                            {formatRevenueWithCurrency(c.estimatedRevenue)}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="xs"
                                variant="secondary"
                                onClick={() => setDossierCase(c)}
                              >
                                View Dossier
                              </Button>
                              <Button
                                size="xs"
                                variant="secondary"
                                icon={ChevronRight}
                                onClick={() => handleOpenWorkspace(c, 'INTAKE_REVIEW')}
                              >
                                Open Workspace
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ TAB 7: MANAGEMENT REPORTS ═══ */}
        {tab === 'reports' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Transfer Pricing Statutory Management Reports
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standardized compliance and operational analytics reports generated under Ministry of Revenues Transfer Pricing Examination Guidelines.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'Audit Yield & Recovery Report',
                  desc: 'Aggregate TP audit assessments vs. annual yield targets. Disaggregates principal tax, penalties, and late payment interest.',
                  icon: <BarChart2 className="w-5 h-5 text-blue-600" />,
                  tag: 'Revenue Yield'
                },
                {
                  title: 'Auditor Productivity & Case Allocation',
                  desc: 'Officer-level operational performance: cases completed, hours logged, and average adjustment yield per examiner.',
                  icon: <Users className="w-5 h-5 text-purple-600" />,
                  tag: 'Operational'
                },
                {
                  title: 'Multi-Stage Assessment History',
                  desc: 'Assessments issued, adjustments sustained post-objection, appeals defended, and amounts confirmed at each stage.',
                  icon: <Scale className="w-5 h-5 text-amber-600" />,
                  tag: 'Statutory Defense'
                },
                {
                  title: 'Tax Fraud & Investigation Referrals',
                  desc: 'Register of TP cases escalated to the MoR Tax Fraud & Criminal Investigation Directorate with current prosecution status.',
                  icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
                  tag: 'Criminal Referral'
                },
                {
                  title: 'Enterprise Examination History',
                  desc: 'Multi-year statutory audit trail per taxpayer: examination dates, teams assigned, issues tested, and past settlements.',
                  icon: <FileText className="w-5 h-5 text-teal-600" />,
                  tag: 'Taxpayer Trail'
                },
                {
                  title: 'Real-Time Cross-Center Status Report',
                  desc: 'Real-time status breakdown of all active transfer pricing audit cases by phase, tax center, and economic sector.',
                  icon: <Clock className="w-5 h-5 text-slate-600" />,
                  tag: 'Portfolio Status'
                },
              ].map((r, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                        {r.icon}
                      </div>
                      <Badge color="slate" size="xs">{r.tag}</Badge>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{r.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{r.desc}</p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                    <Button size="xs" variant="secondary" icon={FileText} className="flex-1">
                      PDF Export
                    </Button>
                    <Button size="xs" variant="secondary" className="flex-1">
                      CSV Data
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* ── ASSIGN CASE TO TEAM LEADER MODAL ── */}
      {assignModalCase && (
        <Modal
          open={!!assignModalCase}
          onClose={() => { setAssignModalCase(null); setSelectedTL(''); setAssignNotes(''); }}
          title={`Assign Case to TP Team Leader: ${assignModalCase.caseNumber}`}
          size="md"
          footer={
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => { setAssignModalCase(null); setSelectedTL(''); setAssignNotes(''); }}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={UserCheck}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!selectedTL || assigning}
                onClick={() => handleAssignCaseToTL(assignModalCase.id, selectedTL, assignNotes)}
              >
                {assigning ? 'Assigning...' : 'Confirm Assignment'}
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-purple-700 dark:text-purple-400 font-bold">{assignModalCase.caseNumber}</span>
                <Badge color="purple" size="xs">{assignModalCase.taxCenterCode || user?.taxCenter || 'Federal LTO'}</Badge>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{assignModalCase.taxpayerName || assignModalCase.taxpayerId}</h4>
              <p className="text-slate-500">
                Sector: {assignModalCase.sector || 'Commercial'} • Portfolio Value: {formatRevenueWithCurrency(assignModalCase.estimatedRevenue)}
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select TP Team Leader <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedTL}
                onChange={e => setSelectedTL(e.target.value)}
                className="text-xs"
              >
                <option value="">Select an eligible TP Team Leader...</option>
                {filteredTeamLeaders.map(tl => (
                  <option key={tl.userId || tl.username} value={tl.username}>
                    {tl.fullName || tl.username} ({tl.username}) — {tl.assignedLocation || effectiveTaxCenter}
                  </option>
                ))}
              </Select>
              <p className="text-[11px] text-slate-500 mt-1">
                The selected Team Leader will receive the case on their dashboard to supervise audit planning, technical reviews, and team assignment.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Committee Directives / Assignment Instructions (Optional)
              </label>
              <Textarea
                rows={3}
                placeholder="Enter directives on priority audit issues, statutory deadlines, or specific cross-border transactions to test..."
                value={assignNotes}
                onChange={e => setAssignNotes(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* ── CONVENE DELIBERATION SESSION MODAL ── */}
      {deliberationModal && (
        <Modal
          open={deliberationModal}
          onClose={() => setDeliberationModal(false)}
          title="Convene Statutory Committee Deliberation Session"
          size="lg"
          footer={
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setDeliberationModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={Landmark}
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleRecordDeliberation}
              >
                Record Statutory Resolution
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <Alert type="info">
              Formal committee sessions record statutory quorum, deliberations, and binding decisions under Directive No. 43/2015 and Tax Proclamation 979/2016.
            </Alert>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Session Title <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Q3 Transfer Pricing Scope & Assessment Review"
                  value={newDelib.sessionTitle}
                  onChange={e => setNewDelib({ ...newDelib, sessionTitle: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Case Under Deliberation
                </label>
                <Select
                  value={newDelib.caseId}
                  onChange={e => setNewDelib({ ...newDelib, caseId: e.target.value })}
                >
                  <option value="">Select a case...</option>
                  {cases.slice(0, 30).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} — {c.taxpayerName || c.taxpayerId}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Agenda / Statutory Matter Examined
              </label>
              <Input
                placeholder="e.g. Cross-border management fee deductions & intercompany brand royalties"
                value={newDelib.agenda}
                onChange={e => setNewDelib({ ...newDelib, agenda: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Committee Decision / Vote
                </label>
                <Select
                  value={newDelib.decision}
                  onChange={e => setNewDelib({ ...newDelib, decision: e.target.value })}
                >
                  <option value="APPROVED">APPROVED (Authorize Full Audit / Notice)</option>
                  <option value="APPROVED_WITH_CONDITIONS">APPROVED WITH CONDITIONS (Require Additional IDR)</option>
                  <option value="DEFERRED">DEFERRED (Require Updated Comparable Study)</option>
                  <option value="DISMISSED">DISMISSED (Close TP Inquiry)</option>
                </Select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Proposed TP Adjustment (ETB)
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 24500000"
                  value={newDelib.proposedAdjustment}
                  onChange={e => setNewDelib({ ...newDelib, proposedAdjustment: e.target.value })}
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-800 dark:text-slate-200 mb-1.5">Confirmed Quorum Members Present:</p>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Committee Chair (Presiding)</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Senior TP Economist</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Tax Legal & Treaty Counsel</span>
                <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Large Taxpayer Office (LTO) Delegate</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Formal Committee Resolution Minutes & Directives <span className="text-red-500">*</span>
              </label>
              <Textarea
                rows={3}
                placeholder="Enter detailed statutory findings, comparable benchmark evaluation, and binding directions to the audit team..."
                value={newDelib.decisionNotes}
                onChange={e => setNewDelib({ ...newDelib, decisionNotes: e.target.value })}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* ── VIEW FORMAL RESOLUTION EXTRACT MODAL ── */}
      {selectedDelibView && (
        <Modal
          open={!!selectedDelibView}
          onClose={() => setSelectedDelibView(null)}
          title={`Official Committee Resolution: ${selectedDelibView.resolutionNumber}`}
          size="lg"
          footer={
            <div className="flex justify-between items-center w-full">
              <span className="text-xs text-slate-500 font-mono">Directive No. 43/2015 Compliance Stamp Verified</span>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" icon={Printer} onClick={() => window.print()}>
                  Print Extract
                </Button>
                <Button size="sm" variant="primary" onClick={() => setSelectedDelibView(null)}>
                  Close
                </Button>
              </div>
            </div>
          }
        >
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-purple-700 dark:text-purple-400">Federal Democratic Republic of Ethiopia</p>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Ministry of Revenues • Transfer Pricing Review Committee</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">Statutory Decision & Resolution Registry Extract</p>
              </div>
              <div className="text-right font-mono">
                <Badge color="purple">{selectedDelibView.resolutionNumber}</Badge>
                <p className="text-[10px] text-slate-400 mt-1">{selectedDelibView.sessionDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500 uppercase text-[10px] font-bold">Taxpayer / Enterprise</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedDelibView.taxpayerName}</p>
                <p className="font-mono text-slate-400 text-[11px]">Case Number: {selectedDelibView.caseNumber}</p>
              </div>
              <div>
                <p className="text-slate-500 uppercase text-[10px] font-bold">Official Decision</p>
                <Badge
                  color={selectedDelibView.decision === 'APPROVED' ? 'green' : 'blue'}
                  size="md"
                >
                  {selectedDelibView.decision.replace(/_/g, ' ')}
                </Badge>
                {selectedDelibView.proposedAdjustment > 0 && (
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    Proposed Adjustment: {formatRevenueWithCurrency(selectedDelibView.proposedAdjustment)}
                  </p>
                )}
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Quorum Attestation:</p>
              <div className="flex flex-wrap gap-2">
                {selectedDelibView.quorum.map((q, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-medium">
                    ✓ {q}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Resolution Deliberation Record & Directives:</p>
              <p className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed">
                {selectedDelibView.decisionNotes}
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Taxpayer Dossier Modal */}
      {dossierCase && (
        <CaseDetailModal
          caseData={dossierCase}
          onClose={() => setDossierCase(null)}
        />
      )}
    </div>
  );
}
