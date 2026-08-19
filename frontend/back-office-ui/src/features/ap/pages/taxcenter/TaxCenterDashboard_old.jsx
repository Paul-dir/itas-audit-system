import { useState } from 'react';
import { Building2, Users, Clock, CheckCircle, AlertCircle, Eye, UserCheck, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Card, StatCard, Button, Modal, Select, Badge, Table, Empty, Alert, Tabs, Input } from '../../components/ui/index.jsx';
import { AUDIT_TYPES, CASE_STATUS, RISK_LEVELS } from '../../data/constants.js';
import CaseDetailModal from '../shared/CaseDetailModal.jsx';

export default function TaxCenterDashboard({ view }) {
  const { state, actions, selectors } = useApp();
  const { user } = useAuth();
  const [assignModal, setAssignModal] = useState(null);
  const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAuditType, setFilterAuditType] = useState('');
  const [tab, setTab] = useState('all');

  const taxCenter = user.taxCenter;
  const allCases = selectors.getCasesForTaxCenter(taxCenter);
  const teamLeaders = selectors.getUsersByTaxCenterAndRole(taxCenter, 'team_leader');

  const filtered = allCases.filter(c => {
    // Tab filter (quick-status tabs take priority over the status dropdown)
    if (tab === 'pending'     && c.status !== 'PENDING')     return false;
    if (tab === 'in_progress' && c.status !== 'IN_PROGRESS') return false;
    if (tab === 'completed'   && c.status !== 'COMPLETED')   return false;
    // Dropdown / search filters (only active when tab === 'all')
    if (tab === 'all' && filterStatus && c.status !== filterStatus) return false;
    if (filterAuditType && c.auditType !== filterAuditType) return false;
    if (search && !c.taxpayerName.toLowerCase().includes(search.toLowerCase()) && !c.tin.includes(search)) return false;
    return true;
  });

  const pending = allCases.filter(c => c.status === 'PENDING');
  const inProgress = allCases.filter(c => c.status === 'IN_PROGRESS');
  const completed = allCases.filter(c => c.status === 'COMPLETED');

  const handleAssign = () => {
    if (!assignModal || !selectedTeamLeader) return;
    actions.assignCaseToTeamLeader(assignModal.id, selectedTeamLeader);
    setAssignModal(null);
    setSelectedTeamLeader('');
  };

  const riskColor = { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'blue' };

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
    { key: 'riskScore', label: 'Score', render: v => <span className="font-mono text-sm font-semibold">{v}</span> },
    { key: 'status', label: 'Status', render: v => {
      const s = CASE_STATUS[v];
      return s ? <Badge color={s.color} dot>{s.label}</Badge> : <Badge>{v}</Badge>;
    }},
    { key: '_act', label: '', render: (_, row) => (
      <div className="flex gap-1 justify-end" onClick={e => e.stopPropagation()}>
        <Button size="xs" variant="ghost" icon={Eye} onClick={() => setSelectedCase(row)}>View</Button>
        {row.status === 'PENDING' && teamLeaders.length > 0 && (
          <Button size="xs" variant="primary" icon={UserCheck} onClick={() => { setAssignModal(row); setSelectedTeamLeader(''); }}>
            Assign
          </Button>
        )}
      </div>
    )},
  ];

  const tabCounts = { all: allCases.length, pending: pending.length, in_progress: inProgress.length, completed: completed.length };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Cases" value={allCases.length} icon={Building2} color="blue" sub={taxCenter?.replace(/-/g, ' ')} />
        <StatCard label="Pending Assignment" value={pending.length} icon={Clock} color="yellow" />
        <StatCard label="In Progress" value={inProgress.length} icon={AlertCircle} color="purple" />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle} color="green" />
      </div>

      {pending.length > 0 && teamLeaders.length === 0 && (
        <Alert type="warning" title="No team leaders found">
          No team leaders are registered for your tax center. Cases cannot be assigned until team leaders are added.
        </Alert>
      )}

      {allCases.length === 0 && (
        <Alert type="info" title="No cases yet">
          Cases will appear here once an audit plan is finalized and deployed to your tax center.
        </Alert>
      )}

      <Card padding={false}>
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Case Management</h3>
              <p className="text-xs text-gray-500 mt-0.5">Assign and track audit cases for your tax center</p>
            </div>
          </div>
          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input icon={Search} placeholder="Search by name or TIN..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              placeholder="All Statuses"
              options={Object.values(CASE_STATUS).map(s => ({ value: s.id, label: s.label }))}
              className="min-w-[160px]"
            />
            <Select
              value={filterAuditType}
              onChange={e => setFilterAuditType(e.target.value)}
              placeholder="All Audit Types"
              options={AUDIT_TYPES.map(a => ({ value: a.id, label: a.name }))}
              className="min-w-[160px]"
            />
          </div>
        </div>

        <div className="px-6 pt-3 pb-0">
          <Tabs
            tabs={[
              { id: 'all', label: 'All', count: tabCounts.all },
              { id: 'pending', label: 'Pending', count: tabCounts.pending },
              { id: 'in_progress', label: 'In Progress', count: tabCounts.in_progress },
              { id: 'completed', label: 'Completed', count: tabCounts.completed },
            ]}
            active={tab} onChange={setTab}
          />
        </div>

        <div className="p-4">
          {filtered.length === 0
            ? <Empty icon={Building2} title="No cases found" description="Try adjusting your filters." />
            : <Table columns={cols} rows={filtered} onRowClick={row => setSelectedCase(row)} />
          }
        </div>
      </Card>

      {/* Assign modal */}
      <Modal open={!!assignModal} onClose={() => setAssignModal(null)} title="Assign Case to Team Leader" size="sm"
        footer={<>
          <Button variant="secondary" onClick={() => setAssignModal(null)}>Cancel</Button>
          <Button variant="primary" icon={UserCheck} onClick={handleAssign} disabled={!selectedTeamLeader}>Assign</Button>
        </>}
      >
        {assignModal && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-3 text-sm dark:bg-slate-700">
              <p className="font-medium text-gray-800 dark:text-gray-200">{assignModal.taxpayerName}</p>
              <p className="text-gray-500 text-xs mt-0.5">{assignModal.tin} · {AUDIT_TYPES.find(a => a.id === assignModal.auditType)?.name}</p>
            </div>
            <Select
              label="Select Team Leader"
              value={selectedTeamLeader}
              onChange={e => setSelectedTeamLeader(e.target.value)}
              placeholder="Choose team leader..."
              options={teamLeaders.map(tl => ({ value: tl.id, label: tl.name }))}
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
