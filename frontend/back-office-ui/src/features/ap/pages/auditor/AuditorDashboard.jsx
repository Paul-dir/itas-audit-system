import { useState, useMemo, useEffect, useCallback } from 'react';
import { Search as SearchIcon, Clock, CheckCircle, PlayCircle, Eye, BarChart3, Layers, Layers3, AlertTriangle } from 'lucide-react';
import { useApp } from '../../../../context/AppContext.jsx';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, StatCard, Button, Modal, Select, Badge, Table, Empty, Alert, Textarea, Input, Pagination } from '../../../../components/ui/index.jsx';
import { AUDIT_TYPES, CASE_STATUS, normalizeBackendStatus, getAuditTypeDef, isAuditTypeMatch } from '../../data/constants.js';
import CaseDetailModal from '../shared/CaseDetailModal.jsx';
import TpAuditWorkspace from '../../../tp/pages/TpAuditWorkspace.jsx';
import IssueAuditWorkspace from '../../../issue/pages/IssueAuditWorkspace.jsx';
import TpWorkflowTaskPanel from '../../../tp/components/TpWorkflowTaskPanel.jsx';

const API = '/api/v1/backoffice/ap/cases';

export default function AuditorDashboard({ view }) {
  const { state, actions, selectors } = useApp();
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [tpWorkspaceCase, setTpWorkspaceCase] = useState(null);
  const [tpWorkspacePhase, setTpWorkspacePhase] = useState(null);
  const [issueWorkspaceCase, setIssueWorkspaceCase] = useState(null);
  const [initialPhase, setInitialPhase] = useState(null);

  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [availablePlanYears, setAvailablePlanYears] = useState([2026, 2027, 2028, 2029, 2030, 2031, 2032]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const PHASE_MAP = {
    'phase-1': 'DETAILED_RISK_ASSESSMENT',
    'phase-2': 'PLANNING',
    'phase-3': 'FIELD_WORK',
    'phase-4': 'ANALYSIS',
    'phase-5': 'REPORT',
    'phase-6': 'ASSESSMENT',
    'phase-7': 'NOTICE',
    'phase-8': 'COMPLETION'
  };

  const ISSUE_PHASE_MAP = {
    'issue-phase-1': 'NOTIFICATION',
    'issue-phase-2': 'EVIDENCE_GATHERING',
    'issue-phase-3': 'REPORT_DRAFT',
    'issue-phase-4': 'REVIEW_CHAIN',
    'issue-phase-5': 'DIRECTOR_DECISION'
  };

  const [issueInitialPhase, setIssueInitialPhase] = useState('NOTIFICATION');

  const fetchMyCases = useCallback(async () => {
    if (!user?.id && !user?.username && !user?.email) return;
    setLoading(true);
    try {
      const auditorParam = user.username || user.id || user.email;
      let r = await fetch(`${API}?auditor=${encodeURIComponent(auditorParam)}`, {
        headers: { 'X-Actor-Id': user.id || user.username || 'auditor' }
      });
      let res = r.ok ? await r.json() : null;
      let data = res?.data || [];

      // Fallback query if first identifier yielded 0 cases
      if (data.length === 0 && user.email && user.email !== auditorParam) {
        const r2 = await fetch(`${API}?auditor=${encodeURIComponent(user.email)}`, {
          headers: { 'X-Actor-Id': user.id || user.username || 'auditor' }
        });
        if (r2.ok) {
          const res2 = await r2.json();
          if (res2?.data?.length > 0) data = res2.data;
        }
      }

      if (data.length === 0 && user.id && user.id !== auditorParam) {
        const r3 = await fetch(`${API}?auditor=${encodeURIComponent(user.id)}`, {
          headers: { 'X-Actor-Id': user.id || user.username || 'auditor' }
        });
        if (r3.ok) {
          const res3 = await r3.json();
          if (res3?.data?.length > 0) data = res3.data;
        }
      }

      const fetched = data.map(c => {
        let planYear = c.planYear;
        if (!planYear && c.caseNumber && c.caseNumber.includes('-')) {
          const prefix = c.caseNumber.split('-')[0];
          if (!isNaN(prefix) && prefix.length === 4) {
            planYear = parseInt(prefix, 10);
          }
        }
        if (!planYear && c.planName) {
          const m = c.planName.match(/20\d\d/);
          if (m) planYear = parseInt(m[0], 10);
        }
        planYear = planYear ? parseInt(planYear, 10) : 2026;

        return {
          ...c,
          id: c.id || c.caseNumber,
          taxpayerName: c.taxpayerName || c.taxpayerId,
          tin: c.taxpayerId,
          sector: c.sector || 'Unknown',
          riskLevel: c.riskLevel || (c.riskScore >= 80 ? 'CRITICAL' : c.riskScore >= 60 ? 'HIGH' : 'MEDIUM'),
          frontendStatus: c.frontendStatus || normalizeBackendStatus(c.status),
          auditTypeDef: getAuditTypeDef(c.auditType),
          planYear,
        };
      });
      setCases(fetched);
    } catch (e) {
      console.error('fetchMyCases error', e);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.username, user?.email]);

  useEffect(() => {
    fetchMyCases();
  }, [fetchMyCases]);

  useEffect(() => {
    const userType = (user?.auditType || '').toUpperCase().replace(/_/g, '');
    if (view && PHASE_MAP[view]) {
      if (userType === 'TRANSFERPRICING' || userType === 'TP') {
        setInitialPhase(PHASE_MAP[view]);
        if (cases.length > 0) {
          const activeCase = cases.find(c => (c.auditType || '').toUpperCase().includes('TP') || (c.auditType || '').toUpperCase().includes('TRANSFER')) || cases[0];
          if (activeCase) {
            setTpWorkspaceCase(activeCase);
          }
        }
      }
    } else if (view && ISSUE_PHASE_MAP[view]) {
      if (userType === 'ISSUE' || userType === 'ISSUEAUDIT') {
        setIssueInitialPhase(ISSUE_PHASE_MAP[view]);
        if (cases.length > 0) {
          const activeCase = cases.find(c => (c.auditType || '').toUpperCase().includes('ISSUE')) || cases[0];
          if (activeCase) {
            setIssueWorkspaceCase(activeCase);
          }
        }
      }
    } else if (view === 'dashboard' || view === 'cases') {
      setTpWorkspaceCase(null);
      setIssueWorkspaceCase(null);
    }
  }, [view, cases, user?.auditType]);


  // Strictly filter cases: must be assigned to this specific auditor AND match user's audit type specialization (if defined)
  const myCases = useMemo(() => {
    const raw = cases.length > 0 ? cases : selectors.getCasesForAuditor(user?.id);
    const userIdentifiers = [user?.id, user?.userId, user?.username, user?.email].filter(Boolean);
    return raw.filter(c => {
      // Must be assigned to this specific auditor ID (or unassigned/demo auditor matching)
      if (c.assignedAuditorId && userIdentifiers.length > 0 && !userIdentifiers.includes(c.assignedAuditorId)) {
        return false;
      }
      // If user has a specific auditType specialization, filter out mismatching cases
      if (user?.auditType) {
        if (!isAuditTypeMatch(user.auditType, c.auditTypeDef?.id || c.auditType)) {
          return false;
        }
      }
      return true;
    });
  }, [cases, selectors, user?.id, user?.userId, user?.username, user?.email, user?.auditType]);

  
  // Load distinct plan years from backend plans
  useEffect(() => {
    async function loadPlanYears() {
      try {
        const res = await fetch('/api/v1/backoffice/ap/plans');
        if (res.ok) {
          const json = await res.json();
          const plans = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
          const years = [...new Set(plans.map(p => p.planYear || p.year).filter(Boolean))].sort();
          if (years.length > 0) {
            setAvailablePlanYears(years);
          }
        }
      } catch (e) {
        // Fallback default years
      }
    }
    loadPlanYears();
  }, []);

  // Combined available years
  const availableYears = useMemo(() => {
    const caseYears = myCases.map(c => c.planYear).filter(Boolean);
    const combined = [...new Set([...availablePlanYears, ...caseYears])].sort((a, b) => b - a);
    return combined;
  }, [availablePlanYears, myCases]);

  // Filter by year
  const yearFilteredCases = useMemo(() => {
    if (selectedYear === 'ALL') return myCases;
    return myCases.filter(c => String(c.planYear || 2026) === String(selectedYear));
  }, [myCases, selectedYear]);

  const inProgress = yearFilteredCases.filter(c => c.frontendStatus === 'IN_PROGRESS' || c.status === 'IN_PROGRESS');
  const completed = yearFilteredCases.filter(c => ['COMPLETED', 'CLOSED'].includes(c.frontendStatus || c.status));

  const isIssueUser = ((user?.auditType || '').toUpperCase().includes('ISSUE') || myCases.some(c => ['ISSUE', 'ISSUE_AUDIT', 'issue_audit'].includes((c.auditType || '').toUpperCase())));
  const issueReturnedCases = myCases.filter(c =>
    ['ISSUE', 'ISSUE_AUDIT', 'issue_audit'].includes((c.auditType || '').toUpperCase()) &&
    ['REVISION_REQUESTED', 'RETURNED_TO_AUDITOR'].includes(c.status)
  );

  const filtered = yearFilteredCases.filter(c =>
    !search ||
    (c.taxpayerName && c.taxpayerName.toLowerCase().includes(search.toLowerCase())) ||
    (c.tin && c.tin.includes(search)) ||
    (c.caseNumber && c.caseNumber.toLowerCase().includes(search.toLowerCase()))
  );

  const handleUpdateStatus = async () => {
    if (!statusModal || !newStatus) return;
    try {
      await fetch(`${API}/${statusModal.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': user?.username || user?.id || 'auditor'
        },
        body: JSON.stringify({ status: newStatus, notes })
      });
    } catch (e) {
      console.error('Failed to update status on server', e);
    }
    actions.updateCaseStatus(statusModal.id, newStatus, notes);
    setStatusModal(null);
    setNewStatus('');
    setNotes('');
    fetchMyCases();
  };

  const riskColor = { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'blue' };
  const statusOptions = [
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CLOSED', label: 'Closed' },
  ];

  const cols = [
    { key: 'tin', label: 'TIN', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'taxpayerName', label: 'Taxpayer', render: (v, row) => (
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{v}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{row.caseNumber || row.tin} • {row.sector}</p>
      </div>
    )},
    { key: 'planYear', label: 'Plan Year', render: (_, row) => (
      <Badge color="blue" size="xs">FY {row.planYear || 2026}</Badge>
    )},
    { key: 'auditType', label: 'Audit Type', render: v => {
      const at = AUDIT_TYPES.find(a => a.id === v);
      return <Badge color={at?.color || 'gray'}>{at?.shortName || v}</Badge>;
    }},
    { key: 'riskLevel', label: 'Risk', render: v => <Badge color={riskColor[v] || 'gray'} dot>{v}</Badge> },
    { key: 'riskScore', label: 'Score', render: v => <span className="font-mono text-sm font-bold">{v}</span> },
    { key: 'status', label: 'Status', render: v => {
      const s = CASE_STATUS[v];
      return s ? <Badge color={s.color} dot>{s.label}</Badge> : <Badge>{v}</Badge>;
    }},
    { key: 'startDate', label: 'Started', render: v => <span className="text-xs text-gray-400 dark:text-gray-500">{v ? new Date(v).toLocaleDateString() : '—'}</span> },
    { key: '_act', label: '', render: (_, row) => {
      const isTp = isAuditTypeMatch('TRANSFER_PRICING', row.auditType) || isAuditTypeMatch('TRANSFER_PRICING', row.auditTypeDef?.id);
      const isIssue = isAuditTypeMatch('ISSUE_AUDIT', row.auditType) || isAuditTypeMatch('ISSUE_AUDIT', row.auditTypeDef?.id);
      return (
        <div className="flex gap-1 justify-end items-center" onClick={e => e.stopPropagation()}>
          {isTp ? (
            <div className="flex items-center gap-1">
              <Button size="xs" variant="primary" icon={Layers3} className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm" onClick={() => { setTpWorkspacePhase('DETAILED_RISK_ASSESSMENT'); setTpWorkspaceCase(row); }}>
                Execute TP Audit
              </Button>
              <Button size="xs" variant="secondary" onClick={() => { setTpWorkspacePhase('ANALYSIS'); setTpWorkspaceCase(row); }}>
                IQR Analysis
              </Button>
            </div>
          ) : isIssue ? (
            <Button size="xs" variant="primary" icon={Layers} className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIssueWorkspaceCase(row)}>
              Execute Issue Audit
            </Button>
          ) : (
            <Button size="xs" variant="ghost" icon={Eye} onClick={() => setSelectedCase(row)}>View</Button>
          )}
          {['IN_PROGRESS'].includes(row.status || row.frontendStatus) && (
            <Button size="xs" variant="secondary" icon={PlayCircle} onClick={() => { setStatusModal(row); setNewStatus('COMPLETED'); setNotes(''); }}>
              Update
            </Button>
          )}
        </div>
      );
    }},
  ];

  if (tpWorkspaceCase) {
    return (
      <TpAuditWorkspace
        caseData={tpWorkspaceCase}
        user={user}
        initialPhase={tpWorkspacePhase || initialPhase}
        onClose={() => { setTpWorkspaceCase(null); setTpWorkspacePhase(null); }}
        onRefresh={() => {
          fetchMyCases();
          setTpWorkspaceCase(null);
          setTpWorkspacePhase(null);
        }}
      />
    );
  }

  if (issueWorkspaceCase) {
    return (
      <IssueAuditWorkspace
        caseData={issueWorkspaceCase}
        user={user}
        initialPhase={issueInitialPhase}
        onClose={() => setIssueWorkspaceCase(null)}
        onRefresh={() => {
          fetchMyCases();
          setIssueWorkspaceCase(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="My Cases" value={yearFilteredCases.length} icon={SearchIcon} color="blue" />
        <StatCard label="In Progress" value={inProgress.length} icon={PlayCircle} color="yellow" sub="Active audits" />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle} color="green" sub="Audits done" />
      </div>

      {/* ── TP 8-Phase Statutory Audit Progression Guide ───────────────────── */}
      {((user?.auditType || '').toUpperCase().includes('TRANSFER') || cases.some(c => c.auditType === 'TRANSFER_PRICING')) && (
        <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
            <div>
              <p className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers3 className="w-4 h-4 text-purple-600" />
                <span>Transfer Pricing Field Audit Execution — 8 Statutory Phases (Directive No. 43/2015)</span>
              </p>
              <p className="text-xs text-purple-700 dark:text-purple-400 mt-0.5">
                Select any audit milestone below to launch your assigned case directly into that specialized phase:
              </p>
            </div>
            {cases.length > 0 && (
              <Button
                size="sm"
                variant="primary"
                icon={Layers3}
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                onClick={() => {
                  const targetCase = cases.find(c => (c.auditType || '').toUpperCase().includes('TP') || (c.auditType || '').toUpperCase().includes('TRANSFER')) || cases[0];
                  setTpWorkspacePhase('DETAILED_RISK_ASSESSMENT');
                  setTpWorkspaceCase(targetCase);
                }}
              >
                Launch Primary TP Workspace
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-2 border-t border-purple-200/60 dark:border-purple-800/60">
            {[
              { id: 'DETAILED_RISK_ASSESSMENT', num: '1', label: 'Risk Assessment' },
              { id: 'PLANNING',                 num: '2', label: 'Audit Planning' },
              { id: 'FIELD_WORK',               num: '3', label: 'Field Work' },
              { id: 'ANALYSIS',                 num: '4', label: 'Economic Analysis' },
              { id: 'REPORT',                   num: '5', label: 'TP Report' },
              { id: 'ASSESSMENT',               num: '6', label: 'Assessment' },
              { id: 'NOTICE',                   num: '7', label: 'Notice & Objection' },
              { id: 'COMPLETION',               num: '8', label: 'Audit Closure' },
            ].map(phase => (
              <button
                key={phase.id}
                type="button"
                onClick={() => {
                  const targetCase = cases.find(c => (c.auditType || '').toUpperCase().includes('TP') || (c.auditType || '').toUpperCase().includes('TRANSFER')) || cases[0];
                  if (targetCase) {
                    setTpWorkspacePhase(phase.id);
                    setTpWorkspaceCase(targetCase);
                  }
                }}
                className="p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-700 text-center transition group cursor-pointer shadow-xs"
              >
                <span className="block text-[10px] font-bold text-purple-600 dark:text-purple-400 font-mono">Phase {phase.num}</span>
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 mt-0.5 truncate">{phase.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── TP Workflow Tasks Routed Back to Auditor ───────────────────── */}
      {(user?.auditType || '').toUpperCase().includes('TRANSFER') && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <p className="text-sm font-bold text-slate-800 dark:text-white">TP Workflow — Items Returned to You</p>
          </div>
          <TpWorkflowTaskPanel
            role="auditor"
            user={user}
            onOpenWorkspace={(caseData, targetPhase) => {
              setTpWorkspacePhase(targetPhase);
              setTpWorkspaceCase(caseData);
            }}
          />
        </div>
      )}

      {/* ── Issue Audit 5-Phase Progression Guide (FR-04.6 / FR-04.7) ───────── */}
      {isIssueUser && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
            <div>
              <p className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Issue Audit Execution Framework — 5 Statutory Phases (FR-04.6 / FR-04.7)</span>
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                Targeted single-issue audit workflow. Routes strictly from Auditor → Team Leader → Tax Center Director (NO Committee):
              </p>
            </div>
            {myCases.length > 0 && (
              <Button
                size="sm"
                variant="primary"
                icon={Layers}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                onClick={() => {
                  const targetCase = myCases.find(c => ['ISSUE', 'ISSUE_AUDIT', 'issue_audit'].includes((c.auditType || '').toUpperCase())) || myCases[0];
                  setIssueInitialPhase('NOTIFICATION');
                  setIssueWorkspaceCase(targetCase);
                }}
              >
                Launch Primary Issue Workspace
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2 border-t border-blue-200/60 dark:border-blue-800/60">
            {[
              { id: 'NOTIFICATION',       num: '1', label: 'Notify & Select' },
              { id: 'EVIDENCE_GATHERING', num: '2', label: 'Evidence & Verification' },
              { id: 'REPORT_DRAFT',       num: '3', label: 'Findings & Draft Report' },
              { id: 'REVIEW_CHAIN',       num: '4', label: 'Team Leader Review' },
              { id: 'DIRECTOR_DECISION',  num: '5', label: 'Directorate Follow-Up' },
            ].map(phase => (
              <button
                key={phase.id}
                type="button"
                onClick={() => {
                  const targetCase = myCases.find(c => ['ISSUE', 'ISSUE_AUDIT', 'issue_audit'].includes((c.auditType || '').toUpperCase())) || myCases[0];
                  if (targetCase) {
                    setIssueInitialPhase(phase.id);
                    setIssueWorkspaceCase(targetCase);
                  }
                }}
                className="p-2.5 rounded-lg bg-white/90 dark:bg-slate-800/90 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-700 text-center transition group cursor-pointer shadow-xs"
              >
                <span className="block text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono">Phase {phase.num}</span>
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 mt-0.5 truncate">{phase.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Issue Audit Workflow — Revision Requests Alert ─────────────────── */}
      {issueReturnedCases.length > 0 && (
        <Alert
          type="warning"
          title={`⚠️ Issue Audit Revision Requested (${issueReturnedCases.length})`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>
              Your Issue Audit Team Leader has returned {issueReturnedCases.length} case(s) with revision directives before technical endorsement.
            </span>
            <Button
              size="xs"
              variant="primary"
              className="bg-amber-600 hover:bg-amber-700 text-white shrink-0 font-semibold"
              onClick={() => {
                setIssueInitialPhase('REPORT_DRAFT');
                setIssueWorkspaceCase(issueReturnedCases[0]);
              }}
            >
              Open Workspace to Revise →
            </Button>
          </div>
        </Alert>
      )}

      {yearFilteredCases.length === 0 && (
        <Alert type="info" title="No cases assigned yet">
          Cases will appear here once your Team Leader assigns them to you.
        </Alert>
      )}

      {inProgress.length > 0 && (
        <Alert type="info" title={`${inProgress.length} active audit${inProgress.length > 1 ? 's' : ''}`}>
          Remember to update case status as you progress through the audit.
        </Alert>
      )}

      <Card padding={false}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">My Audit Cases</h3>
            <p className="text-xs text-gray-500 mt-0.5">Track and update your assigned audit cases</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value); setPage(1); }}>
              <option value="ALL">All Plan Years ({myCases.length})</option>
              {availableYears.map(year => {
                const count = myCases.filter(c => String(c.planYear || 2026) === String(year)).length;
                return (
                  <option key={year} value={year}>
                    FY {year} ({count})
                  </option>
                );
              })}
            </Select>
            <Input icon={SearchIcon} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="p-4">
          {filtered.length === 0
            ? <Empty icon={SearchIcon} title="No cases" description="Cases assigned to you will appear here." />
            : (
              <>
                <Table columns={cols} rows={filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)} onRowClick={row => setSelectedCase(row)} />
                <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(filtered.length / itemsPerPage) || 1}
                  totalItems={filtered.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setPage}
                  onItemsPerPageChange={(val) => { setItemsPerPage(val); setPage(1); }}
                />
              </>
            )
          }
        </div>
      </Card>

      <Modal open={!!statusModal} onClose={() => setStatusModal(null)} title="Update Case Status" size="sm"
        footer={<>
          <Button variant="secondary" onClick={() => setStatusModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdateStatus} disabled={!newStatus}>Update Status</Button>
        </>}
      >
        {statusModal && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-3 dark:bg-slate-700">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{statusModal.taxpayerName}</p>
              <p className="text-xs text-gray-500 mt-0.5">{statusModal.tin}</p>
            </div>
            <Select
              label="New Status"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              options={statusOptions}
              placeholder="Select status..."
            />
            <Textarea
              label="Progress Notes (optional)"
              placeholder="Add any notes about this audit..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        )}
      </Modal>

      {selectedCase && (
        <CaseDetailModal
          caseData={state.cases.find(c => c.id === selectedCase.id) || selectedCase}
          onClose={() => setSelectedCase(null)}
          users={state.users}
        />
      )}
    </div>
  );
}
