import { useState, useMemo } from 'react';
import { Package, Users, CheckCircle, Clock, Filter, Search, Send, Eye } from 'lucide-react';
import { useApp } from '../../../../context/AppContext.jsx';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, StatCard, Button, Modal, Badge, Alert, Input, Select, Tabs } from '../../../../components/ui/index.jsx';
import { AUDIT_TYPES, CASE_STATUS } from '../../data/constants.js';

export default function TeamLeaderDashboard() {
  const { state, actions, selectors } = useApp();
  const { user } = useAuth();
  
  const [selectedCases, setSelectedCases] = useState([]);
  const [viewCaseModal, setViewCaseModal] = useState(null);
  const [assignModal, setAssignModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL'); // NEW: Year selection
  const [tab, setTab] = useState('pending');

  // Get cases assigned to this team leader
  const myCases = selectors.getCasesForTeamLeader(user.id) || [];

  // Get auditors assigned to THIS team leader only
  const myAuditors = useMemo(() => {
    return state.users.filter(u => 
      u.role === 'auditor' && 
      u.teamLeader === user.id
    );
  }, [state.users, user.id]);
  
  // Get available years from plans associated with this team leader's cases
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

  // Check if this is a joint committee member
  const isJointCommittee = user.isJointCommittee === true;

  // Filter cases
  const filteredCases = useMemo(() => {
    return yearFilteredCases.filter(c => {
      // Tab filter
      if (tab === 'pending' && c.status !== 'ASSIGNED') return false;
      if (tab === 'in_progress' && c.status !== 'IN_PROGRESS') return false;
      if (tab === 'completed' && !['COMPLETED', 'CLOSED'].includes(c.status)) return false;

      // Status filter
      if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;

      // Priority filter
      if (filterPriority !== 'ALL' && c.priority !== filterPriority) return false;

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.taxpayerName?.toLowerCase().includes(q) ||
          c.tin?.toLowerCase().includes(q) ||
          c.sector?.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [yearFilteredCases, tab, filterStatus, filterPriority, searchQuery]);

  // Statistics
  const stats = useMemo(() => ({
    total: yearFilteredCases.length,
    pending: yearFilteredCases.filter(c => c.status === 'ASSIGNED').length,
    inProgress: yearFilteredCases.filter(c => c.status === 'IN_PROGRESS').length,
    completed: yearFilteredCases.filter(c => ['COMPLETED', 'CLOSED'].includes(c.status)).length,
  }), [yearFilteredCases]);

  // Toggle case selection
  const toggleCaseSelection = (caseId) => {
    setSelectedCases(prev => {
      if (prev.includes(caseId)) {
        return prev.filter(id => id !== caseId);
      } else {
        return [...prev, caseId];
      }
    });
  };

  // Select all filtered cases
  const toggleSelectAll = () => {
    const selectableCases = filteredCases.filter(c => c.status === 'ASSIGNED');
    if (selectedCases.length === selectableCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(selectableCases.map(c => c.id));
    }
  };

  // Open assignment modal
  const openAssignModal = () => {
    if (selectedCases.length === 0) {
      alert('Please select at least one case to assign.');
      return;
    }

    if (myAuditors.length === 0) {
      alert('⚠️ No Auditors Available\n\nYou do not have any auditors in your team yet.\n\nPlease contact your Tax Center Manager.');
      return;
    }

    setAssignModal(true);
  };

  // Assign cases to auditors (load balanced)
  const handleAssignToAuditors = () => {
    if (selectedCases.length === 0 || myAuditors.length === 0) return;

    let assignedCount = 0;

    // Calculate current workload for each auditor
    const auditorWorkload = myAuditors.map(auditor => ({
      auditor,
      count: state.cases.filter(c => 
        c.assignedAuditor === auditor.id && 
        c.status !== 'COMPLETED'
      ).length
    }));

    // Assign each selected case to the least loaded auditor
    selectedCases.forEach(caseId => {
      // Find least loaded auditor
      const leastLoaded = auditorWorkload.reduce((min, curr) => 
        curr.count < min.count ? curr : min
      );

      // Assign case
      actions.assignCaseToAuditor(caseId, leastLoaded.auditor.id);
      
      // Update local workload tracking
      leastLoaded.count++;
      assignedCount++;
    });

    alert(`✅ Success!\n\n${assignedCount} case(s) assigned to auditors.\n\nCases automatically distributed based on workload balancing.`);
    
    setSelectedCases([]);
    setAssignModal(false);
  };

  const riskColors = { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'blue' };
  const priorityColors = { HIGH: 'red', MEDIUM: 'yellow', NORMAL: 'blue', LOW: 'gray' };

  const tabs = [
    { id: 'pending', label: 'Pending Assignment', count: stats.pending },
    { id: 'in_progress', label: 'In Progress', count: stats.inProgress },
    { id: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isJointCommittee ? 'Joint Committee Dashboard' : 'Team Leader Dashboard'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {isJointCommittee 
            ? `Managing joint audit cases for ${user.taxCenter?.replace(/-/g, ' ').toUpperCase()}`
            : `Manage and assign cases to your audit team - ${AUDIT_TYPES.find(at => at.id === user.auditType)?.name || user.auditType}`
          }
        </p>
      </div>

      {/* Special Alert for Joint Committee */}
      {isJointCommittee && (
        <Alert type="info" title="Joint Committee Workflow">
          As a Joint Committee member, you manage joint audit cases. Joint audits require coordination between multiple teams and special approval processes.
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard 
          label="Total Cases" 
          value={stats.total} 
          icon={Package} 
          color="blue"
          sub="Assigned to you"
        />
        <StatCard 
          label="Pending Assignment" 
          value={stats.pending} 
          icon={Clock} 
          color="yellow"
          sub="Awaiting auditor"
        />
        <StatCard 
          label="In Progress" 
          value={stats.inProgress} 
          icon={Users} 
          color="purple"
          sub="Active audits"
        />
        <StatCard 
          label="Completed" 
          value={stats.completed} 
          icon={CheckCircle} 
          color="green"
          sub="Finished"
        />
      </div>

      {/* Team Overview */}
      {myAuditors.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">👥 Your Audit Team</h3>
            <Badge color="blue">{myAuditors.length} Auditor{myAuditors.length > 1 ? 's' : ''}</Badge>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {myAuditors.map(auditor => {
              const auditorCases = state.cases.filter(c => 
                c.assignedAuditor === auditor.id && 
                c.status !== 'COMPLETED'
              ).length;

              return (
                <div key={auditor.id} className="bg-gray-50 rounded-lg p-3 dark:bg-slate-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{auditor.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {auditorCases} active case{auditorCases !== 1 ? 's' : ''}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Selection Banner */}
      {selectedCases.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-blue-600" size={24} />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                {selectedCases.length} case{selectedCases.length > 1 ? 's' : ''} selected
              </p>
              <p className="text-xs text-blue-700">
                Ready to assign to your auditors
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => setSelectedCases([])}
            >
              Clear Selection
            </Button>
            <Button 
              size="sm" 
              variant="success"
              icon={Send}
              onClick={openAssignModal}
            >
              Assign to Auditors
            </Button>
          </div>
        </div>
      )}

      {/* Filters & Tabs */}
      <Card padding={false}>
        <div className="px-6 pt-4 pb-0">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
        </div>

        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 dark:bg-gray-800 dark:bg-slate-700">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <Input
              icon={Search}
              placeholder="Search taxpayer, TIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="ALL">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>

            <Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="NORMAL">Normal Priority</option>
              <option value="LOW">Low Priority</option>
            </Select>

            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="ALL">All Statuses</option>
              {Object.entries(CASE_STATUS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </Select>

            <Button size="sm" variant="secondary" icon={Filter}>
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Case Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 dark:border-slate-600 dark:bg-slate-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCases.length === filteredCases.filter(c => c.status === 'ASSIGNED').length && 
                             filteredCases.filter(c => c.status === 'ASSIGNED').length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200">Taxpayer</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Risk</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Priority</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Assigned Auditor</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500 dark:text-slate-400">
                    No cases found matching your filters
                  </td>
                </tr>
              ) : (
                filteredCases.map(caseItem => {
                  const auditor = caseItem.assignedAuditor 
                    ? selectors.getUserById(caseItem.assignedAuditor)
                    : null;

                  return (
                    <tr key={caseItem.id} className="hover:bg-blue-50 dark:hover:bg-slate-600">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedCases.includes(caseItem.id)}
                          onChange={() => toggleCaseSelection(caseItem.id)}
                          disabled={caseItem.status !== 'ASSIGNED'}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{caseItem.taxpayerName}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{caseItem.tin} • {caseItem.sector}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge color={riskColors[caseItem.riskLevel]} dot size="sm">
                          {caseItem.riskLevel}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge color={priorityColors[caseItem.priority]} size="sm">
                          {caseItem.priority}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge 
                          color={CASE_STATUS[caseItem.status]?.color || 'gray'} 
                          dot 
                          size="sm"
                        >
                          {CASE_STATUS[caseItem.status]?.label || caseItem.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {auditor ? (
                          <div className="text-xs">
                            <p className="font-medium text-gray-900 dark:text-white">{auditor.name}</p>
                            <p className="text-gray-500 dark:text-slate-400">Auditor</p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500">Not assigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={Eye}
                          onClick={() => setViewCaseModal(caseItem)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Case Modal */}
      {viewCaseModal && (
        <Modal
          open={!!viewCaseModal}
          onClose={() => setViewCaseModal(null)}
          title="Case Details"
          size="xl"
          footer={
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setViewCaseModal(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Case Overview */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-blue-700">Case ID</p>
                  <p className="text-sm font-mono font-semibold text-blue-900">{viewCaseModal.id}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-700">Status</p>
                  <Badge color={CASE_STATUS[viewCaseModal.status]?.color || 'gray'} dot>
                    {CASE_STATUS[viewCaseModal.status]?.label || viewCaseModal.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-blue-700">Created</p>
                  <p className="text-sm font-semibold text-blue-900">
                    {new Date(viewCaseModal.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Taxpayer Profile */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">🏢 Taxpayer Profile</h3>
              <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Business Name</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{viewCaseModal.taxpayerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">TIN Number</p>
                    <p className="text-base font-mono font-semibold text-gray-900 dark:text-white">{viewCaseModal.tin}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Sector / Industry</p>
                    <p className="text-sm text-gray-900 dark:text-white">{viewCaseModal.sector}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Annual Revenue</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {(viewCaseModal.annualRevenue / 1000000).toFixed(1)}M ETB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Number of Employees</p>
                    <p className="text-sm text-gray-900 dark:text-white">{viewCaseModal.employees} employees</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Risk Score</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            viewCaseModal.riskLevel === 'CRITICAL' ? 'bg-red-500' :
                            viewCaseModal.riskLevel === 'HIGH' ? 'bg-orange-500' :
                            viewCaseModal.riskLevel === 'MEDIUM' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          }`}
                          style={{ width: `${viewCaseModal.riskScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{viewCaseModal.riskScore}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Info */}
            {viewCaseModal.assignedAuditor && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">👤 Assignment</h3>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Assigned Auditor</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectors.getUserById(viewCaseModal.assignedAuditor)?.name || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Start Date</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {viewCaseModal.startDate 
                          ? new Date(viewCaseModal.startDate).toLocaleDateString()
                          : 'Not started'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Assignment Modal */}
      {assignModal && (
        <Modal
          open={assignModal}
          onClose={() => setAssignModal(false)}
          title="Assign Cases to Auditors"
          size="lg"
          footer={
            <div className="flex justify-between w-full">
              <Button variant="secondary" onClick={() => setAssignModal(false)}>
                Cancel
              </Button>
              <Button variant="success" icon={Send} onClick={handleAssignToAuditors}>
                Assign {selectedCases.length} Case{selectedCases.length > 1 ? 's' : ''}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Alert type="info" title="Automatic Workload Balancing">
              Selected cases will be automatically distributed among your auditors based on their current workload. The system ensures fair distribution.
            </Alert>

            {/* Auditor Workload Preview */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Auditor Workload</h3>
              <div className="space-y-2">
                {myAuditors.map(auditor => {
                  const currentLoad = state.cases.filter(c => 
                    c.assignedAuditor === auditor.id && 
                    c.status !== 'COMPLETED'
                  ).length;

                  return (
                    <div key={auditor.id} className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{auditor.name}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{auditor.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{currentLoad}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">active cases</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-3 text-sm text-green-800">
              <strong>Ready to assign:</strong> {selectedCases.length} case(s) will be distributed to {myAuditors.length} auditor{myAuditors.length > 1 ? 's' : ''}.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
