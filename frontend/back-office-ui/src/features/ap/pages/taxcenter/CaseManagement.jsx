import { useState, useMemo, useEffect, useCallback } from 'react';
import { Package, Users, CheckCircle, AlertTriangle, Eye, Send, Search, RefreshCw, UserCheck } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, StatCard, Button, Modal, Badge, Alert, Input, Select, Tabs, Pagination } from '../../../../components/ui/index.jsx';
import { AUDIT_TYPES, CASE_STATUS, normalizeBackendStatus, getAuditTypeDef, COMMITTEE_AUDIT_TYPES } from '../../data/constants.js';
import { formatRevenue } from '../../utils/revenueFormatter.js';

// Map frontend tax-center ID → backend code (AA-TC1 format)
const TC_MAP = {
  'addis_ababa-tc1':'AA-TC1','addis_ababa-tc2':'AA-TC2','addis_ababa-tc3':'AA-TC3',
  'amhara-tc1':'BA-TC1','amhara-tc2':'BA-TC2','amhara-tc3':'BA-TC3',
  'oromia-tc1':'BB-TC1','oromia-tc2':'BB-TC2','oromia-tc3':'BB-TC3',
  'dire_dawa-tc1':'AB-TC1','dire_dawa-tc2':'AB-TC2','dire_dawa-tc3':'AB-TC3',
  'snnpr-tc1':'CA-TC1','snnpr-tc2':'CA-TC2','snnpr-tc3':'CA-TC3',
  'somali-tc1':'SO-TC1','somali-tc2':'SO-TC2','somali-tc3':'SO-TC3',
};

const API = '/api/v1/backoffice/ap/cases';

const riskColors   = { CRITICAL:'red', HIGH:'orange', MEDIUM:'yellow', LOW:'blue' };
const priorityColors = { HIGH:'red', MEDIUM:'yellow', NORMAL:'blue', LOW:'gray' };

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
  // Extract plan year from caseNumber prefix (e.g. "5002-85241c1a..." -> 5002) if planYear is missing
  let year = c.planYear;
  if (!year && c.caseNumber && c.caseNumber.includes('-')) {
    const prefix = c.caseNumber.split('-')[0];
    if (!isNaN(prefix)) year = parseInt(prefix, 10);
  }
  return {
    ...c,
    id: c.id || c.caseNumber,
    planYear: year || 2026,
    taxpayerName: c.taxpayerName || c.taxpayerId,
    tin: c.taxpayerId,
    sector: c.sector || 'Unknown',
    auditTypeDef: auditDef,
    auditTypeFrontendId: auditDef?.id || c.auditType,
    riskLevel,
    priority: riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? 'HIGH' : riskLevel === 'MEDIUM' ? 'MEDIUM' : 'NORMAL',
    frontendStatus,
    isCommittee: c.isCommitteeCase || COMMITTEE_AUDIT_TYPES.has(c.auditType),
  };
}

export default function CaseManagement() {
  const { user } = useAuth();
  const tcCode = TC_MAP[user?.taxCenter] || user?.taxCenter;

  const [cases, setCases]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [selected, setSelected]   = useState([]);
  const [tab, setTab]             = useState('pending');
  const [filterAT, setFilterAT]   = useState('ALL');
  const [searchQ, setSearchQ]     = useState('');
  const [viewCase, setViewCase]   = useState(null);
  const [assignModal, setAssignModal] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignResult, setAssignResult]   = useState(null);
  const [page, setPage]                   = useState(1);
  const [itemsPerPage, setItemsPerPage]   = useState(10);

  // Team leaders for this tax center (from user management API)
  const [teamLeaders, setTeamLeaders] = useState([]);

  // ── Fetch cases ─────────────────────────────────────────────────────────────
  const fetchCases = useCallback(async () => {
    if (!tcCode) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}?taxCenter=${encodeURIComponent(tcCode)}`, {
        headers: { 'X-Actor-Id': user?.id || 'tc-manager' }
      });
      if (r.ok) {
        const res = await r.json();
        setCases((res.data || []).map(mapCase));
      }
    } catch (e) { console.error('fetchCases', e); }
    finally { setLoading(false); }
  }, [tcCode, user?.id]);

  const fetchTeamLeaders = useCallback(async () => {
    if (!tcCode) return;
    try {
      const r = await fetch(`/api/v1/backoffice/ap/users?role=team_leader&taxCenter=${encodeURIComponent(tcCode)}`, {
        headers: { 'X-Actor-Id': user?.id || 'tc-manager' }
      });
      if (r.ok) {
        const res = await r.json();
        const list = res.data || res || [];
        if (list.length > 0) {
          setTeamLeaders(list);
          return;
        }
      }
    } catch (e) { console.error('fetchTeamLeaders', e); }

    // Fallback team leaders matching SEED_USERS for this tax center
    try {
      const { SEED_USERS } = await import('../../data/seed.js');
      const seedTLs = SEED_USERS.filter(u => u.role === 'team_leader' && u.taxCenter === (user?.taxCenter || 'addis_ababa-tc1'));
      if (seedTLs.length > 0) {
        setTeamLeaders(seedTLs);
        return;
      }
    } catch (err) {}

    setTeamLeaders([
      { id: 'u-tl-aa1a', fullName: 'Henok Belay (Desk TL)', name: 'Henok Belay', auditType: 'DESK_AUDIT' },
      { id: 'u-tl-aa1b', fullName: 'Tigist Alemu (Field TL)', name: 'Tigist Alemu', auditType: 'FIELD_AUDIT' },
      { id: 'u-tl-aa1d', fullName: 'Seble Tesfaye (Comp TL)', name: 'Seble Tesfaye', auditType: 'COMPREHENSIVE_AUDIT' },
      { id: 'u-tl-aa1f', fullName: 'Sara Negash (Issue TL)', name: 'Sara Negash', auditType: 'ISSUE_AUDIT' }
    ]);
  }, [tcCode, user?.id]);

  useEffect(() => { fetchCases(); fetchTeamLeaders(); }, [fetchCases, fetchTeamLeaders]);

  const [yearFilter, setYearFilter]       = useState('ALL');

  // Available Plan Years
  const availableYears = useMemo(() => {
    const years = new Set(cases.map(c => c.planYear || 2026));
    return ['ALL', ...Array.from(years).sort()];
  }, [cases]);

  // ── Derived lists ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return cases.filter(c => {
      if (yearFilter !== 'ALL' && String(c.planYear || 2026) !== String(yearFilter)) return false;
      if (tab === 'pending'   && c.frontendStatus !== 'PENDING')   return false;
      if (tab === 'assigned'  && !['ASSIGNED','IN_PROGRESS'].includes(c.frontendStatus)) return false;
      if (tab === 'completed' && !['COMPLETED','CLOSED'].includes(c.frontendStatus))     return false;
      if (filterAT !== 'ALL'  && c.auditTypeFrontendId !== filterAT) return false;
      if (searchQ) {
        const q = searchQ.toLowerCase();
        return c.taxpayerName?.toLowerCase().includes(q) || c.tin?.toLowerCase().includes(q) || c.sector?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [cases, tab, filterAT, searchQ, yearFilter]);

  const yearFilteredCases = useMemo(() => {
    if (yearFilter === 'ALL') return cases;
    return cases.filter(c => String(c.planYear || 2026) === String(yearFilter));
  }, [cases, yearFilter]);

  const stats = useMemo(() => ({
    total:     yearFilteredCases.length,
    pending:   yearFilteredCases.filter(c => c.frontendStatus === 'PENDING').length,
    assigned:  yearFilteredCases.filter(c => ['ASSIGNED','IN_PROGRESS'].includes(c.frontendStatus)).length,
    completed: yearFilteredCases.filter(c => ['COMPLETED','CLOSED'].includes(c.frontendStatus)).length,
  }), [yearFilteredCases]);

  const tabs = [
    { id:'pending',   label:'Pending Assignment', count: stats.pending   },
    { id:'assigned',  label:'Assigned / In Progress', count: stats.assigned  },
    { id:'completed', label:'Completed',          count: stats.completed },
  ];

  // ── Selection ────────────────────────────────────────────────────────────────
  const toggleAll = () => {
    const selectablePending = filtered.filter(c => c.frontendStatus === 'PENDING').map(c => c.id);
    setSelected(prev => prev.length === selectablePending.length ? [] : selectablePending);
  };
  const toggle = id => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // ── Smart Assignment ─────────────────────────────────────────────────────────
  const handleAssign = async () => {
    if (!selected.length) return;
    setAssignLoading(true);
    setAssignResult(null);
    try {
      // Build assignments: for each selected case find the right TL by audit type
      // Group team leaders by audit type
      const tlByType = {};
      teamLeaders.forEach(tl => {
        let rawAt = (tl.auditType || '').toUpperCase().replace(/\s+/g, '_');
        if (rawAt === 'DESK') rawAt = 'DESK_AUDIT';
        if (rawAt === 'FIELD') rawAt = 'FIELD_AUDIT';
        if (rawAt === 'COMPREHENSIVE') rawAt = 'COMPREHENSIVE_AUDIT';
        if (rawAt === 'ISSUE') rawAt = 'ISSUE_AUDIT';
        if (!tlByType[rawAt]) tlByType[rawAt] = [];
        tlByType[rawAt].push(tl);
      });
      // Round-robin index per audit type
      const rrIdx = {};

      const selectedCaseObjects = cases.filter(c => selected.includes(c.id));
      const assignments = [];
      const warnings = [];

      for (const c of selectedCaseObjects) {
        const backendType = c.auditType; // Already backend format (DESK_AUDIT etc.)
        const isCommittee = c.isCommittee;

        if (isCommittee) {
          // Route Joint Audit to Joint Committee Chair, TP to TP Committee Chair
          const commChair = backendType === 'TRANSFER_PRICING' 
            ? '5d3b32e2-be93-4889-bf01-de527a80cec6' // tp.committee1
            : '99a64010-645c-4752-bf57-e046d220cfe4'; // aa.committee1
          assignments.push({ caseId: c.id, teamLeaderId: commChair, status: 'ASSIGNED_TO_COMMITTEE' });
          warnings.push(`Case ${c.caseNumber} (${c.auditTypeDef?.shortName || c.auditType}) assigned to Committee.`);
          continue;
        }

        let candidates = tlByType[backendType] || [];

        if (!candidates.length) {
          // No matching standard TL — assign to available standard TL
          const standardTLs = Object.values(tlByType).flat().filter(t => t.auditType !== 'joint_audit' && t.auditType !== 'transfer_pricing');
          if (standardTLs.length) {
            candidates = standardTLs;
            warnings.push(`No specialized TL for ${backendType}, assigning to available TL`);
          } else {
            warnings.push(`No team leader found for case ${c.caseNumber}`);
            continue;
          }
        }

        const idx = (rrIdx[backendType] || 0) % candidates.length;
        rrIdx[backendType] = idx + 1;
        const tl = candidates[idx];

        assignments.push({ caseId: c.id, teamLeaderId: tl.userId || tl.id });
      }

      if (!assignments.length) {
        setAssignResult({ status:'FAILED', message:'No valid assignments could be built. Ensure team leaders exist for this tax center.' });
        return;
      }

      const r = await fetch(`${API}/bulk-assign-team-leader`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Actor-Id': user?.id || 'tc-manager' },
        body: JSON.stringify({ assignments }),
      });

      const res = await r.json();
      const resultData = res.data || res;
      const committeeCount = warnings.filter(w => w.includes('routed to Joint Audit Committee')).length;
      const otherWarnings = warnings.filter(w => !w.includes('routed to Joint Audit Committee'));
      
      let summaryMsg = null;
      if (committeeCount > 0) {
        summaryMsg = `${committeeCount} Joint/TP cases automatically routed to Joint Audit Committee.`;
      }
      if (otherWarnings.length > 0) {
        summaryMsg = summaryMsg ? `${summaryMsg} (${otherWarnings.join('; ')})` : otherWarnings.join('; ');
      }

      setAssignResult({
        status: resultData.status || (res.status === 'SUCCESS' ? 'SUCCESS' : 'DONE'),
        assigned: resultData.assigned || 0,
        failed: resultData.failed || 0,
        warnings,
        message: summaryMsg,
      });

      // Refresh cases from backend
      await fetchCases();
      setSelected([]);
      setAssignModal(false);
    } catch(e) {
      setAssignResult({ status:'ERROR', message: e.message });
    } finally { setAssignLoading(false); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Case Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading cases…' : `${stats.total} cases for ${tcCode || user?.taxCenter}`}
          </p>
        </div>
        <Button size="sm" variant="secondary" icon={RefreshCw} onClick={fetchCases} disabled={loading}>
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Cases"         value={stats.total}     icon={Package}       color="blue"   sub="All cases" />
        <StatCard label="Pending Assignment"  value={stats.pending}   icon={AlertTriangle} color="yellow" sub="Awaiting team leader" />
        <StatCard label="Active"              value={stats.assigned}  icon={Users}         color="purple" sub="Assigned or in progress" />
        <StatCard label="Completed"           value={stats.completed} icon={CheckCircle}   color="green"  sub="Audit finished" />
      </div>

      {/* Selection banner */}
      {selected.length > 0 && (
        <div className="bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-600 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCheck className="text-blue-600" size={22} />
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
              {selected.length} case{selected.length > 1 ? 's' : ''} selected — ready to assign to team leaders
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setSelected([])}>Clear</Button>
            <Button size="sm" variant="success" icon={Send} onClick={() => { setAssignResult(null); setAssignModal(true); }}>
              Assign to Team Leaders
            </Button>
          </div>
        </div>
      )}

      {assignResult && (
        <Alert type={assignResult.status === 'SUCCESS' || assignResult.assigned > 0 ? 'success' : 'error'}
          title={assignResult.status === 'SUCCESS' ? `✅ ${assignResult.assigned} cases assigned` : '⚠️ Assignment issue'}>
          {assignResult.message || `${assignResult.assigned || 0} assigned, ${assignResult.failed || 0} failed.`}
        </Alert>
      )}

      {/* Filters + table */}
      <Card padding={false}>
        <div className="px-6 pt-4 pb-0">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
        </div>

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
                    checked={filtered.filter(c=>c.frontendStatus==='PENDING').length > 0 &&
                             selected.length === filtered.filter(c=>c.frontendStatus==='PENDING').length}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded" />
                </th>
                {['Taxpayer','Plan Year','Risk','Audit Type','Status','Assigned To',''].map((h,i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                  {loading ? 'Loading…' : 'No cases found'}
                </td></tr>
              ) : filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(c => {
                const atDef = c.auditTypeDef;
                const statusDef = CASE_STATUS[c.status] || CASE_STATUS[c.frontendStatus];
                return (
                  <tr key={c.id} className="hover:bg-blue-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(c.id)}
                        onChange={() => toggle(c.id)}
                        disabled={c.frontendStatus !== 'PENDING'}
                        className="w-4 h-4 rounded disabled:opacity-40" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{c.taxpayerName}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{c.tin} • {c.sector}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color="purple" size="sm">FY {c.planYear || 2026}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={riskColors[c.riskLevel]} dot size="sm">{c.riskLevel}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={atDef?.color || 'gray'} size="sm">
                        {atDef?.shortName || c.auditType}
                        {c.isCommittee && <span className="ml-1 opacity-70">(Cmte)</span>}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={statusDef?.color || 'gray'} dot size="sm">
                        {statusDef?.label || c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300">
                      {c.assignedTeamLeaderId
                        ? <span className="font-medium">{teamLeaders.find(t=>(t.userId||t.id)===c.assignedTeamLeaderId)?.name || c.assignedTeamLeaderId}</span>
                        : <span className="text-gray-400">Not assigned</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="secondary" icon={Eye} onClick={() => setViewCase(c)}>View</Button>
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
      </Card>

      {/* View Case Modal */}
      {viewCase && (
        <Modal open onClose={() => setViewCase(null)} title="Case Details" size="lg"
          footer={<Button variant="secondary" onClick={() => setViewCase(null)}>Close</Button>}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 bg-blue-50 dark:bg-slate-800 rounded-xl p-4 border border-blue-200 dark:border-slate-600">
              <div><p className="text-xs text-blue-600 dark:text-blue-400">Case Number</p>
                <p className="text-sm font-mono font-bold text-blue-900 dark:text-white">{viewCase.caseNumber}</p></div>
              <div><p className="text-xs text-blue-600 dark:text-blue-400">Status</p>
                <Badge color={CASE_STATUS[viewCase.status]?.color || 'gray'} dot>
                  {CASE_STATUS[viewCase.status]?.label || viewCase.status}
                </Badge></div>
              <div><p className="text-xs text-blue-600 dark:text-blue-400">Audit Type</p>
                <Badge color={viewCase.auditTypeDef?.color || 'gray'}>{viewCase.auditTypeDef?.name || viewCase.auditType}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold">🏢 Taxpayer</p>
                <p className="font-medium">{viewCase.taxpayerName}</p>
                <p className="text-xs text-gray-500">TIN: {viewCase.tin}</p>
                <p className="text-xs text-gray-500">Sector: {viewCase.sector}</p>
                {viewCase.estimatedRevenue && <p className="text-xs text-gray-500">Est. Revenue: {formatRevenue(viewCase.estimatedRevenue)} ETB</p>}
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold">⚠️ Risk</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div className={`h-2 rounded-full ${viewCase.riskLevel==='CRITICAL'?'bg-red-500':viewCase.riskLevel==='HIGH'?'bg-orange-500':viewCase.riskLevel==='MEDIUM'?'bg-yellow-500':'bg-blue-400'}`}
                      style={{width:`${Math.min(viewCase.riskScore||0,100)}%`}} />
                  </div>
                  <span className="text-lg font-bold">{viewCase.riskScore}</span>
                </div>
                <Badge color={riskColors[viewCase.riskLevel]} dot>{viewCase.riskLevel}</Badge>
                {viewCase.assignedTeamLeaderId && (
                  <div className="pt-2 border-t border-gray-200 dark:border-slate-600">
                    <p className="text-xs text-gray-500">Assigned TL:</p>
                    <p className="text-sm font-medium">{teamLeaders.find(t=>(t.userId||t.id)===viewCase.assignedTeamLeaderId)?.name || viewCase.assignedTeamLeaderId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Assignment Confirmation Modal */}
      {assignModal && (
        <Modal open onClose={() => setAssignModal(false)} title="Assign Cases to Team Leaders" size="lg"
          footer={
            <div className="flex justify-between w-full">
              <Button variant="secondary" onClick={() => setAssignModal(false)}>Cancel</Button>
              <Button variant="success" icon={Send} onClick={handleAssign} disabled={assignLoading}>
                {assignLoading ? 'Assigning…' : `Assign ${selected.length} Cases`}
              </Button>
            </div>
          }>
          <div className="space-y-4">
            <Alert type="info" title="Automatic Assignment">
              Cases will be assigned to team leaders based on their audit type specialization using round-robin load balancing.
              Joint Audit and Transfer Pricing cases will be routed to the committee.
            </Alert>
            <div>
              <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-slate-200">Selected Cases by Audit Type</p>
              {AUDIT_TYPES.map(at => {
                const typeCases = cases.filter(c => selected.includes(c.id) && c.auditTypeFrontendId === at.id);
                if (!typeCases.length) return null;
                return (
                  <div key={at.id} className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 rounded-lg p-3 mb-2">
                    <Badge color={at.color}>{at.shortName}</Badge>
                    <span className="text-sm">{typeCases.length} case{typeCases.length > 1 ? 's' : ''}</span>
                    <span className="text-xs text-gray-500">
                      {at.id === 'joint_audit' || at.id === 'transfer_pricing' ? '→ Joint Committee / Specialized TL' : '→ Team Leader'}
                    </span>
                  </div>
                );
              })}
            </div>
            {teamLeaders.length === 0 && (
              <Alert type="warning" title="No Team Leaders Found">
                No team leaders found for {tcCode}. Cases will remain PENDING. Please register team leaders first.
              </Alert>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
