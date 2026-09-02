import { useState, useMemo } from 'react';
import { Search as SearchIcon, Clock, CheckCircle, PlayCircle, Eye, BarChart3 } from 'lucide-react';
import { useApp } from '../../../../context/AppContext.jsx';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, StatCard, Button, Modal, Select, Badge, Table, Empty, Alert, Textarea, Input, Pagination } from '../../../../components/ui/index.jsx';
import { AUDIT_TYPES, CASE_STATUS } from '../../data/constants.js';
import CaseDetailModal from '../shared/CaseDetailModal.jsx';

export default function AuditorDashboard({ view }) {
  const { state, actions, selectors } = useApp();
  const { user } = useAuth();
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const myCases = selectors.getCasesForAuditor(user.id);
  
  // Get available years from plans associated with this auditor's cases
  const availableYears = useMemo(() => {
    const years = [...new Set(myCases.map(c => {
      const plan = state.plans.find(p => p.id === c.planId);
      return plan?.year;
    }).filter(Boolean))].sort((a, b) => b - a);
    return years;
  }, [myCases, state.plans]);

  // Filter by year
  const yearFilteredCases = useMemo(() => {
    if (selectedYear === 'ALL') return myCases;
    return myCases.filter(c => {
      const plan = state.plans.find(p => p.id === c.planId);
      return plan?.year === parseInt(selectedYear);
    });
  }, [myCases, selectedYear, state.plans]);

  const inProgress = yearFilteredCases.filter(c => c.status === 'IN_PROGRESS');
  const completed = yearFilteredCases.filter(c => c.status === 'COMPLETED');

  const filtered = yearFilteredCases.filter(c =>
    !search || c.taxpayerName.toLowerCase().includes(search.toLowerCase()) || c.tin.includes(search)
  );

  const handleUpdateStatus = () => {
    if (!statusModal || !newStatus) return;
    actions.updateCaseStatus(statusModal.id, newStatus, notes);
    setStatusModal(null);
    setNewStatus('');
    setNotes('');
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
    { key: '_act', label: '', render: (_, row) => (
      <div className="flex gap-1 justify-end" onClick={e => e.stopPropagation()}>
        <Button size="xs" variant="ghost" icon={Eye} onClick={() => setSelectedCase(row)}>View</Button>
        {['IN_PROGRESS'].includes(row.status) && (
          <Button size="xs" variant="primary" icon={PlayCircle} onClick={() => { setStatusModal(row); setNewStatus('COMPLETED'); setNotes(''); }}>
            Update
          </Button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="My Cases" value={yearFilteredCases.length} icon={SearchIcon} color="blue" />
        <StatCard label="In Progress" value={inProgress.length} icon={PlayCircle} color="yellow" sub="Active audits" />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle} color="green" sub="Audits done" />
      </div>

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
