import { useState, useMemo, useEffect, useCallback } from 'react';
import { Package, Users, CheckCircle, Clock, Search, Send, Eye, RefreshCw, Layers3, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, StatCard, Button, Modal, Badge, Alert, Input, Select, Tabs, Pagination } from '../../../../components/ui/index.jsx';
import { AUDIT_TYPES, CASE_STATUS, normalizeBackendStatus, getAuditTypeDef, COMMITTEE_AUDIT_TYPES } from '../../data/constants.js';
import { formatRevenue } from '../../utils/revenueFormatter.js';
import TpAuditWorkspace from '../../../tp/pages/TpAuditWorkspace.jsx';
import TpWorkflowTaskPanel from '../../../tp/components/TpWorkflowTaskPanel.jsx';

const API = '/api/v1/backoffice/ap/cases';

// Map frontend tax-center ID → backend code
const TC_MAP = {
  'addis_ababa-tc1':'TC-AA-01','addis_ababa-tc2':'TC-AA-02','addis_ababa-tc3':'TC-AA-03',
  'amhara-tc1':'TC-BA-01','amhara-tc2':'TC-BA-02','amhara-tc3':'TC-BA-03',
  'oromia-tc1':'TC-BB-01','oromia-tc2':'TC-BB-02','oromia-tc3':'TC-BB-03',
  'dire_dawa-tc1':'TC-AB-01','dire_dawa-tc2':'TC-AB-02','dire_dawa-tc3':'TC-AB-03',
  'snnpr-tc1':'TC-CA-01','snnpr-tc2':'TC-CA-02','snnpr-tc3':'TC-CA-03',
  'somali-tc1':'TC-SO-01','somali-tc2':'TC-SO-02','somali-tc3':'TC-SO-03',
};

const riskColors = { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'blue' };

function getRiskLevel(score) {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

function mapCase(c) {
  const frontendStatus = c.frontendStatus || normalizeBackendStatus(c.status);
  const riskLevel = getRiskLevel(c.riskScore || 0);
  const auditDef = getAuditTypeDef(c.auditType);
  return {
    ...c,
    id: c.id || c.caseNumber,
    taxpayerName: c.taxpayerName || c.taxpayerId,
    tin: c.taxpayerId,
    sector: c.sector || 'Unknown',
    riskLevel,
    auditTypeDef: auditDef,
    frontendStatus,
    isCommittee: c.isCommitteeCase || COMMITTEE_AUDIT_TYPES.has(c.auditType),
  };
}

export default function TeamLeaderDashboard() {
  const { user } = useAuth();
  const isCommitteeUser = user?.role === 'committee';

  const [cases, setCases]         = useState([]);
  const [auditors, setAuditors]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [selected, setSelected]   = useState([]);
  const [tab, setTab]             = useState('pending');
  const [searchQ, setSearchQ]     = useState('');
  const [filterAT, setFilterAT]   = useState('ALL');
  const [viewCase, setViewCase]   = useState(null);
  const [tpWorkspaceCase, setTpWorkspaceCase] = useState(null);
  const [tpWorkspacePhase, setTpWorkspacePhase] = useState(null);
  const [showTpTasks, setShowTpTasks] = useState(false);
  const [assignModal, setAssignModal]     = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignResult, setAssignResult]   = useState(null);
  const [page, setPage]                   = useState(1);
  const [itemsPerPage, setItemsPerPage]   = useState(10);
  const [yearFilter, setYearFilter]       = useState('ALL');

  // ── Fetch cases assigned to this TL / committee member ──────────────────────
  const fetchCases = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const tcCode = TC_MAP[user?.taxCenter] || user?.taxCenter;
      const atParam = user?.auditType ? `&auditType=${encodeURIComponent(user.auditType)}` : '';
      const param = isCommitteeUser
        ? `committeeId=${user.id}${tcCode ? '&taxCenter=' + encodeURIComponent(tcCode) : ''}${atParam}`
        : `teamLeader=${user.id}`;
      const r = await fetch(`${API}?${param}`, {
        headers: { 'X-Actor-Id': user.id }
      });
      if (r.ok) {
        const res = await r.json();
        let fetched = (res.data || []).map(mapCase);
        // If committee query by ID returned 0 cases, fallback to fetching joint audit / committee cases for this tax center
        if (isCommitteeUser && fetched.length === 0 && tcCode) {
          const fallbackRes = await fetch(`${API}?taxCenter=${encodeURIComponent(tcCode)}`, {
            headers: { 'X-Actor-Id': user.id }
          });
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            const allTcCases = (fallbackData.data || []).map(mapCase);
            fetched = allTcCases.filter(c => c.isCommittee || c.assignedTeamLeaderId === user.id);
          }
        }
        setCases(fetched);
      }
    } catch (e) { console.error('fetchCases', e); }
    finally { setLoading(false); }
  }, [user?.id, user?.taxCenter, isCommitteeUser]);

  // ── Fetch auditors under this TL ────────────────────────────────────────────
  const fetchAuditors = useCallback(async () => {
    if (!user?.id || isCommitteeUser) return;
    try {
      const tcCode = TC_MAP[user?.taxCenter] || user?.taxCenter || '';
      const r = await fetch(`/api/v1/backoffice/ap/users?role=auditor&teamLeader=${user.id}&taxCenter=${encodeURIComponent(tcCode)}`, {
        headers: { 'X-Actor-Id': user.id }
      });
      let loaded = [];
      if (r.ok) {
        const res = await r.json();
        loaded = res.data || res || [];
      }
      // Strictly match auditors assigned to this specific Team Leader
      if (!Array.isArray(loaded) || loaded.length === 0) {
        const { SEED_USERS } = await import('../../data/seed.js');
        loaded = SEED_USERS.filter(u => u.role === 'auditor' && u.teamLeader === user.id);
        // Fallback if specific ID mapping is missing but tax center matches
        if (loaded.length === 0) {
          loaded = SEED_USERS.filter(u => u.role === 'auditor' && u.taxCenter === user.taxCenter).slice(0, 2);
        }
      }
      setAuditors(loaded);
    } catch (e) { 
      console.error('fetchAuditors', e);
      try {
        const { SEED_USERS } = await import('../../data/seed.js');
        setAuditors(SEED_USERS.filter(u => u.role === 'auditor' && u.teamLeader === user.id));
      } catch (err) {}
    }
  }, [user?.id, user?.taxCenter, isCommitteeUser]);

  useEffect(() => { fetchCases(); fetchAuditors(); }, [fetchCases, fetchAuditors]);

  // Available Plan Years
  const availableYears = useMemo(() => {
    const years = new Set(cases.map(c => c.planYear || 2026));
    return ['ALL', ...Array.from(years).sort()];
  }, [cases]);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return cases.filter(c => {
      // Filter by Plan Year
      if (yearFilter !== 'ALL' && String(c.planYear || 2026) !== String(yearFilter)) {
        return false;
      }
      // Standard Team Leaders must NOT see cases still undergoing Joint Committee approval
      if (!isCommitteeUser && (c.status === 'ASSIGNED_TO_COMMITTEE' || c.frontendStatus === 'ASSIGNED_TO_COMMITTEE')) {
        return false;
      }
      // Strictly isolate by assigned team leader OR audit type specialization
      if (!isCommitteeUser) {
        if (c.assignedTeamLeaderId && c.assignedTeamLeaderId !== user?.id) {
          return false;
        }
        if (user?.auditType) {
          const userType = user.auditType.toLowerCase().replace(/_/g, '');
          const caseType = (c.auditTypeDef?.id || c.auditType || '').toLowerCase().replace(/_/g, '');
          if (userType !== caseType && !caseType.includes(userType) && !userType.includes(caseType)) {
            return false;
          }
        }
      } else {
        // Enforce strict separation for specialized committees
        const caseType = (c.auditTypeDef?.id || c.auditType || '').toUpperCase();
        if (user?.auditType) {
          const userType = user.auditType.toUpperCase();
          if (userType === 'JOINT_AUDIT' || userType === 'JOINT') {
            if (caseType !== 'JOINT_AUDIT' && caseType !== 'JOINT') {
              return false;
            }
          } else if (userType === 'TRANSFER_PRICING' || userType === 'TP') {
            if (caseType !== 'TRANSFER_PRICING' && caseType !== 'TP') {
              return false;
            }
          }
        }
      }
      // Tab filters for Team Leader view
      if (tab === 'pending'     && (c.frontendStatus === 'IN_PROGRESS' || c.status === 'IN_PROGRESS')) return false;
      if (tab === 'in_progress' && c.frontendStatus !== 'IN_PROGRESS' && c.status !== 'IN_PROGRESS') return false;
      if (tab === 'completed'   && !['COMPLETED','CLOSED'].includes(c.frontendStatus)) return false;
      if (filterAT !== 'ALL' && c.auditTypeDef?.id !== filterAT) return false;
      if (searchQ) {
        const q = searchQ.toLowerCase();
        return c.taxpayerName?.toLowerCase().includes(q) || c.tin?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [cases, tab, filterAT, searchQ, yearFilter, user?.id, user?.auditType, isCommitteeUser]);

  const scopedCases = useMemo(() => {
    return cases.filter(c => {
      if (!isCommitteeUser && (c.status === 'ASSIGNED_TO_COMMITTEE' || c.frontendStatus === 'ASSIGNED_TO_COMMITTEE')) {
        return false;
      }
      if (!isCommitteeUser && c.assignedTeamLeaderId && c.assignedTeamLeaderId !== user?.id) {
        return false;
      }
      if (!user?.auditType || isCommitteeUser) return true;
      const userType = user.auditType.toLowerCase();
      const caseType = (c.auditTypeDef?.id || c.auditType || '').toLowerCase();
      return userType === caseType || caseType.includes(userType) || userType.includes(caseType);
    });
  }, [cases, user?.id, user?.auditType, isCommitteeUser]);

  const stats = useMemo(() => ({
    total:      scopedCases.length,
    pending:    scopedCases.filter(c => c.frontendStatus !== 'IN_PROGRESS' && c.status !== 'IN_PROGRESS' && !['COMPLETED','CLOSED'].includes(c.frontendStatus)).length,
    inProgress: scopedCases.filter(c => c.frontendStatus === 'IN_PROGRESS' || c.status === 'IN_PROGRESS').length,
    completed:  scopedCases.filter(c => ['COMPLETED','CLOSED'].includes(c.frontendStatus)).length,
  }), [scopedCases]);

  const tpCasesCount = scopedCases.filter(c => (c.auditType || '').toUpperCase() === 'TRANSFER_PRICING').length;

  const tabs = [
    { id:'pending',     label: isCommitteeUser ? 'Assigned to Committee' : 'Pending Auditor Assignment', count: stats.pending     },
    { id:'in_progress', label: 'In Progress',   count: stats.inProgress },
    { id:'completed',   label: 'Completed',     count: stats.completed  },
    { id:'tp_tasks',    label: '⚡ TP Workflow Tasks', count: tpCasesCount },
  ];

  // ── Selection ────────────────────────────────────────────────────────────────
  const selectableInTab = filtered.filter(c => ['ASSIGNED', 'ASSIGNED_TO_TEAM_LEADER', 'ASSIGNED_TO_COMMITTEE', 'PENDING_ASSIGNMENT', 'IN_PROGRESS'].includes(c.frontendStatus) || c.status === 'ASSIGNED_TO_TEAM_LEADER' || c.status === 'ASSIGNED_TO_COMMITTEE');
  const toggleAll = () => setSelected(prev =>
    prev.length === selectableInTab.length ? [] : selectableInTab.map(c => c.id));
  const toggle = id => setSelected(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const [selectedAuditorId, setSelectedAuditorId] = useState('');

  // ── Assign to auditors ───────────────────────────────────────────────────────
  const handleAssignAuditors = async () => {
    if (!selected.length || !auditors.length) return;
    setAssignLoading(true);
    setAssignResult(null);

    try {
      let assignments = [];

      if (selectedAuditorId) {
        // Direct assignment to manually selected auditor
        assignments = selected.map(caseId => ({ caseId, auditorId: selectedAuditorId }));
      } else {
        // Automatic load-balanced distribution
        const workload = auditors.map(a => ({ auditor: a, count: cases.filter(c => c.assignedAuditorId === (a.userId||a.id)).length }));
        assignments = selected.map(caseId => {
          const min = workload.reduce((a, b) => b.count < a.count ? b : a);
          min.count++;
          return { caseId, auditorId: min.auditor.userId || min.auditor.id };
        });
      }

      const r = await fetch(`${API}/bulk-assign-auditor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Actor-Id': user?.id },
        body: JSON.stringify({ assignments }),
      });
      const res = await r.json();
      const d = res.data || res;
      setAssignResult({ status: d.status, assigned: d.assigned, failed: d.failed });
      await fetchCases();
      setSelected([]);
      setSelectedAuditorId('');
      setAssignModal(false);
    } catch (e) {
      setAssignResult({ status: 'ERROR', message: e.message });
    } finally { setAssignLoading(false); }
  };


  // If TpAuditWorkspace is open (for TL review), render fullscreen
  if (tpWorkspaceCase && tpWorkspacePhase) {
    return (
      <TpAuditWorkspace
        caseData={tpWorkspaceCase}
        user={{ ...user, role: 'team_leader' }}
        initialPhase={tpWorkspacePhase}
        onClose={() => { setTpWorkspaceCase(null); setTpWorkspacePhase(null); }}
        onRefresh={() => { fetchCases(); setTpWorkspaceCase(null); setTpWorkspacePhase(null); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.role === 'committee' ? 'Joint Committee Dashboard' : 'Team Leader Dashboard'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading cases…' : `${stats.total} cases assigned to you`}
          </p>
        </div>
        <Button size="sm" variant="secondary" icon={RefreshCw} onClick={fetchCases} disabled={loading}>Refresh</Button>
      </div>

      {user?.role === 'committee' && (
        <Alert type="info" title="Joint Committee Workflow">
          You manage Joint Audit and Transfer Pricing cases. These require inter-department coordination and follow a special approval process.
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total"      value={stats.total}      icon={Package}     color="blue"   sub="Assigned to you" />
        <StatCard label="Pending"    value={stats.pending}    icon={Clock}       color="yellow" sub="Need auditor" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Users}      color="purple" sub="Active audits" />
        <StatCard label="Completed"  value={stats.completed}  icon={CheckCircle} color="green"  sub="Finished" />
      </div>

      {/* Auditor team overview */}
      {auditors.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">👥 Your Audit Team</h3>
            <Badge color="blue">{auditors.length} Auditor{auditors.length > 1 ? 's' : ''}</Badge>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {auditors.map(a => {
              const load = cases.filter(c => c.assignedAuditorId === (a.userId || a.id) && c.frontendStatus !== 'COMPLETED').length;
              return (
                <div key={a.userId || a.id} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{a.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{load} active case{load !== 1 ? 's' : ''}</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Selection banner */}
      {selected.length > 0 && (
        <div className="bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-600 rounded-xl p-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
            {selected.length} case{selected.length > 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setSelected([])}>Clear</Button>
            <Button size="sm" variant="success" icon={Send}
              onClick={() => { setAssignResult(null); setAssignModal(true); }}>
              {isCommitteeUser ? 'Assign to Team Leader' : 'Assign to Auditors'}
            </Button>
          </div>
        </div>
      )}

      {assignResult && (
        <Alert type={assignResult.status === 'SUCCESS' || assignResult.assigned > 0 ? 'success' : 'error'}
          title={assignResult.status === 'SUCCESS' ? `✅ ${assignResult.assigned} cases assigned to auditors` : '⚠️ Assignment issue'}>
          {assignResult.message || `${assignResult.assigned || 0} assigned, ${assignResult.failed || 0} failed.`}
        </Alert>
      )}

      {/* TP Workflow Task Panel — shows when TP Tasks tab is active */}
      <Card padding={false}>
        <div className="px-6 pt-4 pb-0">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
        </div>
        {tab === 'tp_tasks' && (
          <div className="p-6 space-y-4">
            <Alert type="info" title="Transfer Pricing Workflow — Team Leader Action Queue">
              The tasks below are routed to your dashboard because they require YOUR action to proceed. Each task is a workflow gate — the auditor cannot advance until you complete these steps.
            </Alert>
            <TpWorkflowTaskPanel
              role={isCommitteeUser ? 'process_owner' : 'team_leader'}
              user={user}
              onOpenWorkspace={(caseData, targetPhase) => {
                setTpWorkspacePhase(targetPhase);
                setTpWorkspaceCase(caseData);
              }}
            />
          </div>
        )}
      </Card>

      {/* Case Table — hidden when TP Tasks tab is active */}
      {tab !== 'tp_tasks' && <Card padding={false}>
        <div className="px-6 pt-2 pb-0"> </div>
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex gap-3 flex-wrap items-center">
          <Input icon={Search} placeholder="Search taxpayer / TIN…" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
          <Select value={filterAT} onChange={e => setFilterAT(e.target.value)}>
            <option value="ALL">All Audit Types</option>
            {AUDIT_TYPES.map(at => <option key={at.id} value={at.id}>{at.name}</option>)}
          </Select>
          <Select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
            {availableYears.map(y => (
              <option key={y} value={y}>{y === 'ALL' ? 'All Plan Years' : `FY ${y}`}</option>
            ))}
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
              <tr>
                <th className="px-4 py-3">
                  <input type="checkbox"
                    checked={selectableInTab.length > 0 && selected.length === selectableInTab.length}
                    onChange={toggleAll} className="w-4 h-4 rounded" />
                </th>
                {[
                  'Taxpayer',
                  'Risk',
                  'Audit Type',
                  'Status',
                  isCommitteeUser ? 'Assigned Team Leader' : 'Assigned Auditor',
                  ''
                ].map((h,i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">
                  {loading ? 'Loading…' : 'No cases found'}
                </td></tr>
              ) : filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(c => {
                const statusDef = CASE_STATUS[c.status] || CASE_STATUS[c.frontendStatus];
                const auditor = auditors.find(a => (a.userId||a.id) === c.assignedAuditorId);
                const assignedTlName = c.assignedTeamLeaderId || null;
                return (
                  <tr key={c.id} className="hover:bg-blue-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(c.id)}
                        onChange={() => toggle(c.id)}
                        disabled={!['ASSIGNED', 'ASSIGNED_TO_TEAM_LEADER', 'IN_PROGRESS', 'PENDING_ASSIGNMENT'].includes(c.frontendStatus) && c.status !== 'ASSIGNED_TO_TEAM_LEADER' && c.status !== 'ASSIGNED_TO_COMMITTEE'}
                        className="w-4 h-4 rounded disabled:opacity-40" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{c.taxpayerName}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{c.tin} • {c.sector}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={riskColors[c.riskLevel]} dot size="sm">{c.riskLevel} ({c.riskScore})</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={c.auditTypeDef?.color || 'gray'} size="sm">
                        {c.auditTypeDef?.shortName || c.auditType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={statusDef?.color || 'gray'} dot size="sm">
                        {statusDef?.label || c.frontendStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {isCommitteeUser ? (
                        assignedTlName
                          ? <span className="font-medium text-purple-700 dark:text-purple-300">{assignedTlName}</span>
                          : <span className="text-gray-400">Not assigned</span>
                      ) : (
                        auditor
                          ? <span className="font-medium text-gray-900 dark:text-white">{auditor.name}</span>
                          : <span className="text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Button size="sm" variant="secondary" icon={Eye} onClick={() => setViewCase(c)}>View</Button>
                        {(c.auditType || '').toUpperCase() === 'TRANSFER_PRICING' && (
                          <Button
                            size="sm"
                            variant="primary"
                            icon={Layers3}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => { setTpWorkspacePhase('REPORT'); setTpWorkspaceCase(c); }}
                          >
                            TP Review
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(filtered.length / itemsPerPage) || 1}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setPage}
          onItemsPerPageChange={(val) => { setItemsPerPage(val); setPage(1); }}
        />
      </Card>}


      {/* View Case Modal */}
      {viewCase && (
        <Modal open onClose={() => setViewCase(null)} title="Case Details" size="lg"
          footer={<Button variant="secondary" onClick={() => setViewCase(null)}>Close</Button>}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 bg-blue-50 dark:bg-slate-800 rounded-xl p-4 border border-blue-100 dark:border-slate-600">
              <div><p className="text-xs text-blue-600">Case #</p>
                <p className="text-sm font-mono font-bold text-blue-900 dark:text-white">{viewCase.caseNumber}</p></div>
              <div><p className="text-xs text-blue-600">Status</p>
                <Badge color={CASE_STATUS[viewCase.status]?.color || 'gray'} dot>
                  {CASE_STATUS[viewCase.status]?.label || viewCase.status}
                </Badge></div>
              <div><p className="text-xs text-blue-600">Audit Type</p>
                <Badge color={viewCase.auditTypeDef?.color || 'gray'}>{viewCase.auditTypeDef?.name || viewCase.auditType}</Badge></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 space-y-1">
                <p className="text-sm font-semibold mb-2">🏢 Taxpayer</p>
                <p className="font-medium text-gray-900 dark:text-white">{viewCase.taxpayerName}</p>
                <p className="text-xs text-gray-500">TIN: {viewCase.tin}</p>
                <p className="text-xs text-gray-500">Sector: {viewCase.sector}</p>
                {viewCase.estimatedRevenue && <p className="text-xs text-gray-500">Revenue: {formatRevenue(viewCase.estimatedRevenue)} ETB</p>}
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                <p className="text-sm font-semibold mb-2">⚠️ Risk Score</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div className={`h-2 rounded-full ${viewCase.riskLevel==='CRITICAL'?'bg-red-500':viewCase.riskLevel==='HIGH'?'bg-orange-500':viewCase.riskLevel==='MEDIUM'?'bg-yellow-500':'bg-blue-400'}`}
                      style={{width:`${Math.min(viewCase.riskScore||0,100)}%`}}/>
                  </div>
                  <span className="text-lg font-bold">{viewCase.riskScore}</span>
                </div>
                <Badge color={riskColors[viewCase.riskLevel]} dot>{viewCase.riskLevel}</Badge>
                {viewCase.assignedAuditorId && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600">
                    <p className="text-xs text-gray-500">Assigned Auditor:</p>
                    <p className="text-sm font-medium">{auditors.find(a=>(a.userId||a.id)===viewCase.assignedAuditorId)?.name || viewCase.assignedAuditorId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Assign to Auditors / Team Leader Modal */}
      {assignModal && (
        <Modal open onClose={() => setAssignModal(false)} title="Assign Cases to Auditors" size="lg"
          footer={
            <div className="flex justify-between w-full">
              <Button variant="secondary" onClick={() => setAssignModal(false)}>Cancel</Button>
              <Button variant="success" icon={Send} onClick={handleAssignAuditors} disabled={assignLoading || !auditors.length}>
                {assignLoading ? 'Assigning…' : `Assign ${selected.length} Case${selected.length > 1 ? 's' : ''}`}
              </Button>
            </div>
          }>
          <div className="space-y-4">
            <Alert type="info" title="Auditor Assignment">
              Assign selected cases directly to a specific auditor or leave set to Automatic to balance workload evenly.
            </Alert>

            <Select
              label="Select Target Auditor"
              value={selectedAuditorId}
              onChange={(e) => setSelectedAuditorId(e.target.value)}
            >
              <option value="">⚡ Automatic Load Balancing (Distribute evenly)</option>
              {auditors.map(a => (
                <option key={a.userId || a.id} value={a.userId || a.id}>
                  👤 {a.name} ({a.email || a.userId || a.id})
                </option>
              ))}
            </Select>

            <div>
              <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200">Current Auditor Workload</p>
              {auditors.length === 0
                ? <Alert type="warning" title="No Auditors">You have no auditors in your team. Please contact your Tax Center Manager.</Alert>
                : auditors.map(a => {
                    const load = cases.filter(c => c.assignedAuditorId === (a.userId||a.id) && c.frontendStatus !== 'COMPLETED').length;
                    return (
                      <div key={a.userId||a.id} className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 rounded-lg p-3 mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{a.name}</p>
                          <p className="text-xs text-gray-500">{a.email || a.userId || a.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{load}</p>
                          <p className="text-xs text-gray-500">active cases</p>
                        </div>
                      </div>
                    );
                  })
              }
            </div>
            <div className="bg-green-50 dark:bg-slate-800 rounded-xl p-3 text-sm text-green-800 dark:text-green-400">
              <strong>Ready to assign:</strong> {selected.length} case{selected.length > 1 ? 's' : ''} → {selectedAuditorId ? auditors.find(a => (a.userId||a.id) === selectedAuditorId)?.name : `${auditors.length} auditors (Balanced)`}
            </div>
          </div>
        </Modal>
      )}


      {/* Transfer Pricing Execution Workspace Modal */}
      {tpWorkspaceCase && (
        <TpAuditWorkspace
          caseData={tpWorkspaceCase}
          user={user}
          onClose={() => setTpWorkspaceCase(null)}
          onRefresh={fetchCases}
        />
      )}
    </div>
  );
}
