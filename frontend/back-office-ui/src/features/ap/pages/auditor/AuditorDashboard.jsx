import { useState, useMemo, useEffect, useCallback } from 'react';
import { Search as SearchIcon, Clock, CheckCircle, PlayCircle, Eye, BarChart3, Layers, Layers3, AlertTriangle } from 'lucide-react';
import { useApp } from '../../../../context/AppContext.jsx';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, StatCard, Button, Modal, Select, Badge, Table, Empty, Alert, Textarea, Input, Pagination } from '../../../../components/ui/index.jsx';
import { AUDIT_TYPES, CASE_STATUS, normalizeBackendStatus, getAuditTypeDef } from '../../data/constants.js';
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
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const PHASE_MAP = {
    'phase-1': 'DETAILED_RISK_ASSESSMENT',
    'phase-2': 'WORKING_HYPOTHESIS',
    'phase-3': 'PLANNING',
    'phase-4': 'FIELD_WORK',
    'phase-5': 'ANALYSIS',
    'phase-6': 'REPORT',
    'phase-assessment': 'ASSESSMENT',
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
    if (!user?.id) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}?auditor=${user.id}`, {
        headers: { 'X-Actor-Id': user.id }
      });
      if (r.ok) {
        const res = await r.json();
        const fetched = (res.data || []).map(c => ({
          ...c,
          id: c.id || c.caseNumber,
          taxpayerName: c.taxpayerName || c.taxpayerId,
          tin: c.taxpayerId,
          sector: c.sector || 'Unknown',
          riskLevel: c.riskLevel || (c.riskScore >= 80 ? 'CRITICAL' : c.riskScore >= 60 ? 'HIGH' : 'MEDIUM'),
          frontendStatus: c.frontendStatus || normalizeBackendStatus(c.status),
          auditTypeDef: getAuditTypeDef(c.auditType),
        }));
        setCases(fetched);
      }
    } catch (e) {
      console.error('fetchMyCases error', e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

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
    return raw.filter(c => {
      // Must be assigned to this specific auditor ID (or unassigned/demo auditor matching)
      if (c.assignedAuditorId && c.assignedAuditorId !== user?.id && c.assignedAuditorId !== user?.userId) {
        return false;
      }
      // If user has a specific auditType specialization, filter out mismatching cases
      if (user?.auditType) {
        const userType = user.auditType.toUpperCase().replace(/_/g, '');
        const caseType = (c.auditTypeDef?.id || c.auditType || '').toUpperCase().replace(/_/g, '');
        if (userType === 'ISSUE' || userType === 'ISSUEAUDIT') {
          if (caseType !== 'ISSUE' && caseType !== 'ISSUEAUDIT') return false;
        } else if (userType === 'TRANSFERPRICING' || userType === 'TP') {
          if (caseType !== 'TRANSFERPRICING' && caseType !== 'TP') return false;
        }
      }
      return true;
    });
  }, [cases, selectors, user?.id, user?.userId, user?.auditType]);

  
  // Get available years from plans associated with this auditor's cases
  const availableYears = useMemo(() => {
    const years = [...new Set(myCases.map(c => c.planYear || 2026))].sort((a, b) => b - a);
    return years;
  }, [myCases]);

  // Filter by year
  const yearFilteredCases = useMemo(() => {
    if (selectedYear === 'ALL') return myCases;
    return myCases.filter(c => String(c.planYear || 2026) === String(selectedYear));
  }, [myCases, selectedYear]);

  const inProgress = yearFilteredCases.filter(c => c.frontendStatus === 'IN_PROGRESS' || c.status === 'IN_PROGRESS');
  const completed = yearFilteredCases.filter(c => ['COMPLETED', 'CLOSED'].includes(c.frontendStatus || c.status));

  const filtered = yearFilteredCases.filter(c =>
    !search || (c.taxpayerName && c.taxpayerName.toLowerCase().includes(search.toLowerCase())) || (c.tin && c.tin.includes(search))
  );

  const handleUpdateStatus = () => {
    if (!statusModal || !newStatus) return;
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
      <div><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{v}</p><p className="text-xs text-gray-400 dark:text-gray-500">{row.sector}</p></div>
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
      const isTp = row.auditType === 'TRANSFER_PRICING' || row.auditTypeDef?.id === 'TRANSFER_PRICING';
      const isIssue = row.auditType === 'ISSUE' || row.auditTypeDef?.id === 'ISSUE';
      return (
        <div className="flex gap-1 justify-end" onClick={e => e.stopPropagation()}>
          {isTp ? (
            <Button size="xs" variant="primary" icon={Layers3} className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setTpWorkspaceCase(row)}>
              Execute TP Audit
            </Button>
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
            <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="ALL">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
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
