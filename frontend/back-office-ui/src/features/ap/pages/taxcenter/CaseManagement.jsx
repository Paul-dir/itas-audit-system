import { useState, useMemo } from 'react';
import { Package, Users, CheckCircle, AlertTriangle, Eye, Send, Filter, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Card, StatCard, Button, Modal, Badge, Alert, Input, Select, Tabs } from '../../components/ui/index.jsx';
import { AUDIT_TYPES, CASE_STATUS } from '../../data/constants.js';

export default function CaseManagement() {
  const { state, actions, selectors } = useApp();
  const { user } = useAuth();
  
  const [selectedCases, setSelectedCases] = useState([]);
  const [viewCaseModal, setViewCaseModal] = useState(null);
  const [assignModal, setAssignModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterAuditType, setFilterAuditType] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState('pending');
  const [selectedPlanId, setSelectedPlanId] = useState('ALL'); // NEW: Plan filter

  // Get cases for this tax center
  const taxCenterCases = selectors.getCasesForTaxCenter(user.taxCenter) || [];
  
  // Get team leaders for this tax center
  const teamLeaders = selectors.getUsersByTaxCenterAndRole(user.taxCenter, 'team_leader') || [];

  // Get plans that have cases for this tax center
  const plansWithCases = useMemo(() => {
    const planIds = [...new Set(taxCenterCases.map(c => c.planId).filter(Boolean))];
    return planIds.map(id => state.plans.find(p => p.id === id)).filter(Boolean);
  }, [taxCenterCases, state.plans]);

  // Check if a plan has been assigned to team leaders
  const planIsAssigned = (planId) => {
    const plan = state.plans.find(p => p.id === planId);
    return plan?.teamLeaderAssignments?.[user.taxCenter]?.status === 'ASSIGNED';
  };

  // Filter cases by selected plan
  const planFilteredCases = useMemo(() => {
    if (selectedPlanId === 'ALL') return taxCenterCases;
    return taxCenterCases.filter(c => c.planId === selectedPlanId);
  }, [taxCenterCases, selectedPlanId]);

  // Filter cases
  const filteredCases = useMemo(() => {
    return planFilteredCases.filter(c => {
      // Tab filter
      if (tab === 'pending' && c.status !== 'PENDING') return false;
      if (tab === 'assigned' && !['ASSIGNED', 'IN_PROGRESS'].includes(c.status)) return false;
      if (tab === 'completed' && !['COMPLETED', 'CLOSED'].includes(c.status)) return false;

      // Status filter
      if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;

      // Audit type filter
      if (filterAuditType !== 'ALL' && c.auditType !== filterAuditType) return false;

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
  }, [planFilteredCases, tab, filterStatus, filterAuditType, filterPriority, searchQuery]);

  // Statistics (based on plan-filtered cases)
  const stats = useMemo(() => ({
    total: planFilteredCases.length,
    pending: planFilteredCases.filter(c => c.status === 'PENDING').length,
    assigned: planFilteredCases.filter(c => ['ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length,
    completed: planFilteredCases.filter(c => ['COMPLETED', 'CLOSED'].includes(c.status)).length,
  }), [planFilteredCases]);

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
    if (selectedCases.length === filteredCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(filteredCases.map(c => c.id));
    }
  };

  // Update case priority
  const handlePriorityChange = (caseId, newPriority) => {
    actions.updateCasePriority(caseId, newPriority);
  };

  // Open assignment modal
  const openAssignModal = () => {
    if (selectedCases.length === 0) {
      alert('Please select at least one case to assign.');
      return;
    }
    setAssignModal(true);
  };

  // Smart auto-assignment based on audit type
  const handleSmartAssignment = () => {
    if (selectedCases.length === 0) return;

    // Check if current plan (if filtered) is already assigned
    if (selectedPlanId !== 'ALL' && planIsAssigned(selectedPlanId)) {
      alert(`❌ Assignment Already Done!\n\nPlan "${state.plans.find(p => p.id === selectedPlanId)?.name}" has already been assigned to team leaders for your tax center.\n\nEach plan can only be assigned once per tax center.\n\nPlease select a different plan.`);
      return;
    }

    // If multiple plans in selection, check each
    const casePlans = [...new Set(selectedCases.map(id => {
      const c = state.cases.find(cs => cs.id === id);
      return c?.planId;
    }).filter(Boolean))];

    const alreadyAssignedPlans = casePlans.filter(planId => planIsAssigned(planId));
    if (alreadyAssignedPlans.length > 0) {
      const planNames = alreadyAssignedPlans.map(id => 
        state.plans.find(p => p.id === id)?.name || id
      ).join(', ');
      alert(`❌ Some Plans Already Assigned!\n\nThe following plans have already been assigned:\n${planNames}\n\nPlease filter by a specific unassigned plan.`);
      return;
    }

    let assignedCount = 0;
    let errors = [];

    selectedCases.forEach(caseId => {
      const caseItem = state.cases.find(c => c.id === caseId);
      if (!caseItem) return;

      // Find team leader specialized in this audit type
      const specializedTLs = teamLeaders.filter(tl => tl.auditType === caseItem.auditType);

      if (specializedTLs.length === 0) {
        errors.push(`No team leader found for ${AUDIT_TYPES.find(at => at.id === caseItem.auditType)?.name || caseItem.auditType}`);
        return;
      }

      // Load balance: assign to TL with fewest cases
      const tlCaseCounts = specializedTLs.map(tl => ({
        tl,
        count: state.cases.filter(c => c.assignedTeamLeader === tl.id && c.status !== 'COMPLETED').length
      }));

      const leastLoadedTL = tlCaseCounts.reduce((min, curr) => 
        curr.count < min.count ? curr : min
      ).tl;

      // Assign case
      actions.assignCaseToTeamLeader(caseId, leastLoadedTL.id);
      assignedCount++;
    });

    // Mark plan(s) as assigned for this tax center
    casePlans.forEach(planId => {
      if (planId) {
        actions.markPlanAsAssigned(planId, user.taxCenter);
      }
    });

    // Show results
    if (assignedCount > 0) {
      alert(`✅ Success!\n\n${assignedCount} case(s) assigned to specialized team leaders.\n\nCases automatically distributed based on:\n- Audit type specialization\n- Team leader workload balancing\n\nThis plan cannot be assigned again for your tax center.`);
    }

    if (errors.length > 0) {
      alert(`⚠️ Partial Assignment\n\n${errors.length} case(s) could not be assigned:\n${errors.join('\n')}\n\nPlease ensure team leaders are available for all audit types.`);
    }

    setSelectedCases([]);
    setAssignModal(false);
  };

  const riskColors = { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'blue' };
  const priorityColors = { HIGH: 'red', MEDIUM: 'yellow', NORMAL: 'blue', LOW: 'gray' };

  const tabs = [
    { id: 'pending', label: 'Pending Assignment', count: stats.pending },
    { id: 'assigned', label: 'Assigned / In Progress', count: stats.assigned },
    { id: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Case Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage audit cases for {user.taxCenter?.replace(/-/g, ' ').toUpperCase()}
        </p>
      </div>

      {/* Plan Selector */}
      {plansWithCases.length > 0 && (
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📋 Select Plan to Manage
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => {
                  setSelectedPlanId(e.target.value);
                  setSelectedCases([]); // Clear selections when changing plan
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 appearance-none"
              >
                <option value="ALL">All Plans ({taxCenterCases.length} total cases)</option>
                {plansWithCases.map(plan => {
                  const planCases = taxCenterCases.filter(c => c.planId === plan.id);
                  const isAssigned = planIsAssigned(plan.id);
                  return (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - FY {plan.year} ({planCases.length} cases) {isAssigned ? '✓ Assigned' : '○ Pending'}
                    </option>
                  );
                })}
              </select>
            </div>
            {selectedPlanId !== 'ALL' && (
              <div className="text-sm">
                {planIsAssigned(selectedPlanId) ? (
                  <Badge color="green" dot>Already Assigned</Badge>
                ) : (
                  <Badge color="yellow" dot>Pending Assignment</Badge>
                )}
              </div>
            )}
          </div>
          {selectedPlanId !== 'ALL' && (
            <div className="mt-3 text-xs text-gray-600 dark:text-slate-400">
              <strong>Note:</strong> Viewing cases for "{state.plans.find(p => p.id === selectedPlanId)?.name}". 
              Each plan can be assigned to team leaders only once per tax center.
            </div>
          )}
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard 
          label="Total Cases" 
          value={stats.total} 
          icon={Package} 
          color="blue"
          sub="All cases"
        />
        <StatCard 
          label="Pending Assignment" 
          value={stats.pending} 
          icon={AlertTriangle} 
          color="yellow"
          sub="Awaiting team leader"
        />
        <StatCard 
          label="Active" 
          value={stats.assigned} 
          icon={Users} 
          color="purple"
          sub="Assigned or in progress"
        />
        <StatCard 
          label="Completed" 
          value={stats.completed} 
          icon={CheckCircle} 
          color="green"
          sub="Audit finished"
        />
      </div>

      {/* Selection Banner */}
      {selectedCases.length > 0 && (
        <div className="bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-600 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-blue-600 dark:text-blue-400" size={24} />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                {selectedCases.length} case{selectedCases.length > 1 ? 's' : ''} selected
              </p>
              <p className="text-xs text-blue-700">
                Ready for assignment to specialized team leaders
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
              Assign Selected
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
            
            <Select value={filterAuditType} onChange={(e) => setFilterAuditType(e.target.value)}>
              <option value="ALL">All Audit Types</option>
              {AUDIT_TYPES.map(at => (
                <option key={at.id} value={at.id}>{at.name}</option>
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
                    checked={selectedCases.length === filteredCases.length && filteredCases.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200">Taxpayer</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Risk</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Audit Type</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Priority</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Assigned To</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-500 dark:text-slate-400">
                    No cases found matching your filters
                  </td>
                </tr>
              ) : (
                filteredCases.map(caseItem => {
                  const auditType = AUDIT_TYPES.find(at => at.id === caseItem.auditType);
                  const teamLeader = caseItem.assignedTeamLeader 
                    ? selectors.getUserById(caseItem.assignedTeamLeader)
                    : null;

                  return (
                    <tr key={caseItem.id} className="hover:bg-blue-50 dark:hover:bg-slate-600">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedCases.includes(caseItem.id)}
                          onChange={() => toggleCaseSelection(caseItem.id)}
                          disabled={caseItem.status !== 'PENDING'}
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
                        <Badge color={auditType?.color || 'gray'} size="sm">
                          {auditType?.shortName || caseItem.auditType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {caseItem.status === 'PENDING' ? (
                          <select
                            value={caseItem.priority}
                            onChange={(e) => handlePriorityChange(caseItem.id, e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="NORMAL">Normal</option>
                            <option value="LOW">Low</option>
                          </select>
                        ) : (
                          <Badge color={priorityColors[caseItem.priority]} size="sm">
                            {caseItem.priority}
                          </Badge>
                        )}
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
                        {teamLeader ? (
                          <div className="text-xs">
                            <p className="font-medium text-gray-900 dark:text-white">{teamLeader.name}</p>
                            <p className="text-gray-500 dark:text-slate-400">{auditType?.shortName} TL</p>
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
            <div className="bg-blue-50 dark:bg-slate-800 rounded-xl p-4 border border-blue-200 dark:border-slate-600">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-blue-700 dark:text-slate-400">Case ID</p>
                  <p className="text-sm font-mono font-semibold text-blue-900 dark:text-slate-200">{viewCaseModal.id}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-700 dark:text-slate-400">Status</p>
                  <Badge color={CASE_STATUS[viewCaseModal.status]?.color || 'gray'} dot>
                    {CASE_STATUS[viewCaseModal.status]?.label || viewCaseModal.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-blue-700 dark:text-slate-400">Created</p>
                  <p className="text-sm font-semibold text-blue-900 dark:text-slate-200">
                    {new Date(viewCaseModal.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Taxpayer Profile */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">🏢 Taxpayer Profile</h3>
              <div className="bg-blue-50 dark:!bg-slate-700 rounded-xl border border-blue-200 dark:border-slate-600 p-4 space-y-3">
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
                    <p className="text-xs text-gray-500 dark:text-slate-400">Tax Center</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {viewCaseModal.taxCenter?.replace(/-/g, ' ').toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">⚠️ Risk Assessment</h3>
              <div className="bg-yellow-50 dark:!bg-slate-700 rounded-xl border border-yellow-200 dark:border-slate-600 p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Risk Score</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
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
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{viewCaseModal.riskScore}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Risk Level</p>
                    <div className="mt-1">
                      <Badge color={riskColors[viewCaseModal.riskLevel]} dot>
                        {viewCaseModal.riskLevel}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Priority</p>
                    <div className="mt-1">
                      <Badge color={priorityColors[viewCaseModal.priority]} dot>
                        {viewCaseModal.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">📋 Audit Information</h3>
              <div className="bg-green-50 dark:!bg-slate-700 rounded-xl border border-green-200 dark:border-slate-600 p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Audit Type</p>
                    <div className="mt-1">
                      <Badge color={AUDIT_TYPES.find(at => at.id === viewCaseModal.auditType)?.color || 'gray'}>
                        {AUDIT_TYPES.find(at => at.id === viewCaseModal.auditType)?.name || viewCaseModal.auditType}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Linked Plan</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {viewCaseModal.planId ? (
                        <span className="font-medium">
                          {state.plans.find(p => p.id === viewCaseModal.planId)?.name || viewCaseModal.planId}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">Manual case (no plan)</span>
                      )}
                    </p>
                  </div>
                </div>

                {viewCaseModal.assignedTeamLeader && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Assigned Team Leader</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectors.getUserById(viewCaseModal.assignedTeamLeader)?.name || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Assignment Date</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {viewCaseModal.assignedAt 
                          ? new Date(viewCaseModal.assignedAt).toLocaleDateString()
                          : 'Not assigned'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Creation Info */}
            {viewCaseModal.creationMethod && (
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 dark:text-slate-400 dark:bg-slate-700">
                <strong>Creation Method:</strong> {viewCaseModal.creationMethod === 'risk_engine_manual_selection' 
                  ? 'Risk Engine Manual Selection' 
                  : 'Automatic Plan Mapping'}
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
          title="Smart Assignment to Team Leaders"
          size="lg"
          footer={
            <div className="flex justify-between w-full">
              <Button variant="secondary" onClick={() => setAssignModal(false)}>
                Cancel
              </Button>
              <Button variant="success" icon={Send} onClick={handleSmartAssignment}>
                Assign {selectedCases.length} Case{selectedCases.length > 1 ? 's' : ''}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Alert type="info" title="Intelligent Assignment">
              The system will automatically assign selected cases to team leaders based on:
              <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                <li><strong>Audit Type Specialization</strong> - Each TL handles specific audit types</li>
                <li><strong>Workload Balancing</strong> - Cases distributed evenly among specialized TLs</li>
                <li><strong>Instant Assignment</strong> - No manual TL selection needed</li>
              </ul>
            </Alert>

            {/* Show assignment preview */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Assignment Preview</h3>
              <div className="space-y-2">
                {AUDIT_TYPES.map(auditType => {
                  const casesOfType = selectedCases
                    .map(id => state.cases.find(c => c.id === id))
                    .filter(c => c && c.auditType === auditType.id);

                  if (casesOfType.length === 0) return null;

                  const specializedTLs = teamLeaders.filter(tl => tl.auditType === auditType.id);

                  return (
                    <div key={auditType.id} className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge color={auditType.color}>{auditType.shortName}</Badge>
                          <span className="text-sm text-gray-700 dark:text-slate-200">{casesOfType.length} case(s)</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-slate-400">
                          → {specializedTLs.length} specialized TL{specializedTLs.length > 1 ? 's' : ''} available
                        </div>
                      </div>
                      {specializedTLs.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {specializedTLs.map(tl => {
                            const currentLoad = state.cases.filter(
                              c => c.assignedTeamLeader === tl.id && c.status !== 'COMPLETED'
                            ).length;
                            return (
                              <span key={tl.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                {tl.name} ({currentLoad} cases)
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {specializedTLs.length === 0 && (
                        <p className="mt-2 text-xs text-red-600">
                          ⚠️ No team leader specialized in {auditType.name}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-slate-800 rounded-xl p-3 text-sm text-green-800 dark:text-green-400 border border-green-200 dark:border-slate-600">
              <strong>Ready to assign:</strong> Click "Assign" to automatically distribute {selectedCases.length} case(s) to the appropriate team leaders.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
