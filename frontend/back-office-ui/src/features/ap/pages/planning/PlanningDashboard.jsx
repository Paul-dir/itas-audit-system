import { useState } from 'react';
import { Plus, ClipboardList, Clock, CheckCircle, FileText, ArrowRight, Eye, Send, Edit, RotateCcw, Activity, AlertOctagon, Settings, Trash2, Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../../../context/AppContext.jsx';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, CardHeader, StatCard, Button, Badge, Table, Empty, Modal, Alert } from '../../../../components/ui/index.jsx';
import PlanStatusBadge from '../shared/PlanStatusBadge.jsx';
import CreatePlanModal from './CreatePlanModal.jsx';
import PlanDetailModal from './PlanDetailModal.jsx';
import AmendmentEditModal from './AmendmentEditModal.jsx';
import RiskAnalysisDashboard from './RiskAnalysisDashboard.jsx';
import PlanConfigurationPage from './PlanConfigurationPage.jsx';

export default function PlanningDashboard({ view }) {
  const { state, actions, selectors } = useApp();
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(null);
  const [amendmentEditPlan, setAmendmentEditPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('plans');

  // Show full configuration page if view is 'plan-configuration'
  if (view === 'plan-configuration') {
    return <PlanConfigurationPage />;
  }

  // Config panel state
  const [expandedSections, setExpandedSections] = useState({ auditTypes: true, skills: false });
  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({});

  const [planningConfig, setPlanningConfig] = useState({
    auditTypes: [
      { id: 'desk_audit', name: 'Desk Audit', effortPerCase: 40, complexity: 'Low', skillsRequired: ['Basic Analysis', 'Document Review'] },
      { id: 'field_audit', name: 'Field Audit', effortPerCase: 120, complexity: 'Medium', skillsRequired: ['Fieldwork', 'Investigation', 'Taxpayer Engagement'] },
      { id: 'joint_audit', name: 'Joint Audit', effortPerCase: 160, complexity: 'High', skillsRequired: ['Fieldwork', 'Investigation', 'Multi-team Coordination', 'Senior Auditor'] },
      { id: 'transfer_pricing', name: 'Transfer Pricing', effortPerCase: 80, complexity: 'High', skillsRequired: ['Transfer Pricing Specialist', 'International Tax'] },
      { id: 'comprehensive', name: 'Comprehensive', effortPerCase: 200, complexity: 'Very High', skillsRequired: ['Senior Auditor', 'Advanced Analysis', 'CAAT'] },
      { id: 'issue_audit', name: 'Issue Audit', effortPerCase: 50, complexity: 'Medium', skillsRequired: ['Specialized Auditor', 'Issue Expert'] },
    ],
    skills: [
      { id: 'basic_analysis', name: 'Basic Analysis', level: 1, category: 'Foundation' },
      { id: 'document_review', name: 'Document Review', level: 1, category: 'Foundation' },
      { id: 'fieldwork', name: 'Fieldwork', level: 2, category: 'Execution' },
      { id: 'investigation', name: 'Investigation', level: 2, category: 'Execution' },
      { id: 'taxpayer_engagement', name: 'Taxpayer Engagement', level: 2, category: 'Execution' },
      { id: 'senior_auditor', name: 'Senior Auditor', level: 3, category: 'Leadership' },
      { id: 'advanced_analysis', name: 'Advanced Analysis', level: 3, category: 'Specialized' },
      { id: 'caat', name: 'CAAT', level: 3, category: 'Technology' },
      { id: 'tp_specialist', name: 'Transfer Pricing Specialist', level: 3, category: 'Specialized' },
      { id: 'international_tax', name: 'International Tax', level: 3, category: 'Specialized' },
      { id: 'multi_team_coord', name: 'Multi-team Coordination', level: 2, category: 'Management' },
      { id: 'issue_expert', name: 'Issue Expert', level: 3, category: 'Specialized' },
    ],
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const startEdit = (item, type) => {
    setEditingId(item.id);
    setEditingType(type);
    setFormData({ ...item });
  };

  const saveEdit = () => {
    if (editingType === 'auditType') {
      setPlanningConfig(prev => ({
        ...prev,
        auditTypes: prev.auditTypes.map(at => at.id === editingId ? { ...at, ...formData } : at)
      }));
    } else {
      setPlanningConfig(prev => ({
        ...prev,
        skills: prev.skills.map(s => s.id === editingId ? { ...s, ...formData } : s)
      }));
    }
    setEditingId(null);
    setFormData({});
  };

  const deleteItem = (id, type) => {
    if (type === 'auditType') {
      setPlanningConfig(prev => ({ ...prev, auditTypes: prev.auditTypes.filter(at => at.id !== id) }));
    } else {
      setPlanningConfig(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
    }
  };

  const addNew = (type) => {
    const newId = `custom_${type}_${Date.now()}`;
    if (type === 'auditType') {
      setPlanningConfig(prev => ({
        ...prev,
        auditTypes: [...prev.auditTypes, { id: newId, name: 'New Type', effortPerCase: 80, complexity: 'Medium', skillsRequired: [] }]
      }));
    } else {
      setPlanningConfig(prev => ({
        ...prev,
        skills: [...prev.skills, { id: newId, name: 'New Skill', level: 2, category: 'Custom' }]
      }));
    }
  };

  const complexityColors = {
    'Low': 'bg-green-50 text-green-700 border-green-200',
    'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'High': 'bg-orange-50 text-orange-700 border-orange-200',
    'Very High': 'bg-red-50 text-red-700 border-red-200',
  };

  const levelLabels = { 1: 'Foundation', 2: 'Advanced', 3: 'Expert' };

  const stats = selectors.getPlanStats();
  const plans = state.plans;
  const amendmentPlans = plans.filter(p => ['AMENDMENT_REQUIRED', 'SENIOR_MGMT_REJECTED'].includes(p.status));

  const handleSubmit = (plan) => {
    actions.submitToDirector(plan.id, user.id);
    setConfirmSubmit(null);
  };

  const handleAmendmentUpdate = (updatedPlan) => {
    actions.updatePlanDraft(updatedPlan.id, updatedPlan);
    setAmendmentEditPlan(null);
  };

  const columns = [
    { key: 'id', label: 'Plan ID', render: (v) => <span className="font-mono text-xs text-gray-500 dark:text-slate-400">{v}</span> },
    { key: 'name', label: 'Plan Name', render: (v, row) => (
      <div>
        <p className="font-medium text-gray-900 text-sm">{v}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500">FY {row.year}</p>
          {row.riskBased && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-medium rounded-full"><Activity size={9} /> Risk-based</span>}
        </div>
      </div>
    )},
    { key: 'totalCases', label: 'Cases', render: (v) => <span className="font-semibold text-gray-700 tabular-nums">{v?.toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: (v) => <PlanStatusBadge status={v} /> },
    { key: 'createdAt', label: 'Created', render: (v) => <span className="text-xs text-gray-500 dark:text-slate-400">{new Date(v).toLocaleDateString()}</span> },
    { key: '_actions', label: '', render: (_, row) => (
      <div className="flex items-center gap-1.5 justify-end" onClick={e => e.stopPropagation()}>
        <Button size="xs" variant="ghost" icon={Eye} onClick={() => setSelectedPlan(row)}>View</Button>
        {(row.status === 'DRAFT' || row.status === 'REVISION_REQUESTED' || row.status === 'AMENDMENT_REQUIRED' || row.status === 'SENIOR_MGMT_REJECTED') && (
          <Button size="xs" variant="primary" icon={Send} onClick={() => setConfirmSubmit(row)}>
            {(row.status === 'AMENDMENT_REQUIRED' || row.status === 'SENIOR_MGMT_REJECTED') ? 'Resubmit' : 'Submit'}
          </Button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* Tab strip */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button onClick={() => setActiveTab('plans')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'plans' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <ClipboardList size={14} /> Audit Plans
        </button>
        <button onClick={() => setActiveTab('risk')} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'risk' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <Activity size={14} /> Risk Analysis
          <span className="ml-0.5 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-semibold">Live</span>
        </button>
      </div>

      {/* Risk Analysis tab */}
      {activeTab === 'risk' && <RiskAnalysisDashboard onUsePlanDefaults={() => { setActiveTab('plans'); setShowCreate(true); }} />}

      {/* Plans tab */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Main content (2 cols) */}
          <div className="col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Plans" value={stats.total} icon={ClipboardList} color="blue" />
              <StatCard label="Draft" value={stats.draft} icon={Edit} color="gray" />
              <StatCard label="Pending Approval" value={stats.pendingDirector + stats.pendingSenior} icon={Clock} color="yellow" />
              <StatCard label="Finalized" value={stats.finalized} icon={CheckCircle} color="green" />
            </div>

            {/* Amendment Plans Alert */}
            {amendmentPlans.length > 0 && (
              <Card padding={false}>
                <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 dark:bg-slate-700 dark:border-amber-900">
                  <h3 className="text-base font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-2">
                    <AlertOctagon size={18} />
                    Amendment Required
                  </h3>
                </div>
                <div className="divide-y divide-amber-100 dark:divide-slate-600">
                  {amendmentPlans.map(plan => (
                    <div key={plan.id} className="px-6 py-4 hover:bg-amber-50 dark:hover:bg-slate-600">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">{plan.name}</p>
                          <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{plan.amendmentComment}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge color={plan.status === 'SENIOR_MGMT_REJECTED' ? 'red' : 'amber'}>
                              {plan.status === 'SENIOR_MGMT_REJECTED' ? 'Rejected by Senior Mgmt' : 'Amendment Requested'}
                            </Badge>
                            <span className="text-xs text-gray-500">Last updated {new Date(plan.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            icon={Eye}
                            onClick={() => setAmendmentEditPlan(plan)}
                          >
                            Review
                          </Button>
                          <Button 
                            size="sm" 
                            variant="primary" 
                            icon={Edit2}
                            onClick={() => setAmendmentEditPlan(plan)}
                          >
                            Edit & Resubmit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Plans Table */}
            <Card padding={false}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Audit Plans</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Manage and track all national audit plans</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" icon={Activity} onClick={() => setActiveTab('risk')}>View Risk Data</Button>
                  <Button icon={Plus} onClick={() => setShowCreate(true)}>Create Plan</Button>
                </div>
              </div>
              {plans.length === 0 ? <div className="py-8"><Empty icon={FileText} title="No plans yet" description="View the risk analysis first, then create your first audit plan." action={<Button icon={Plus} onClick={() => setShowCreate(true)}>Create Plan</Button>} /></div> : <Table columns={columns} rows={plans} onRowClick={(row) => setSelectedPlan(row)} />}
            </Card>
          </div>

          {/* Right: Config Panel (1 col) */}
          <div className="col-span-1">
            <Card className="sticky top-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-slate-600">
                  <Settings size={18} className="text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Planning Config</h4>
                    <span className="text-[10px] text-blue-600">Planning Only</span>
                  </div>
                </div>

                {/* Audit Types */}
                <div className="space-y-2">
                  <button onClick={() => toggleSection('auditTypes')} className="flex w-full items-center justify-between px-2 py-1.5 hover:bg-gray-50 rounded dark:bg-slate-700">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Audit Types <span className="text-xs text-gray-500 ml-1">({planningConfig.auditTypes.length})</span></span>
                    {expandedSections.auditTypes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {expandedSections.auditTypes && (
                    <div className="space-y-2 pl-2 max-h-48 overflow-y-auto">
                      {planningConfig.auditTypes.map(at => (
                        <div key={at.id}>
                          {editingId === at.id && editingType === 'auditType' ? (
                            <div className="bg-blue-50 border border-blue-300 rounded p-2 space-y-1">
                              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                              <div className="grid grid-cols-2 gap-1">
                                <input type="number" value={formData.effortPerCase} onChange={(e) => setFormData({ ...formData, effortPerCase: parseInt(e.target.value) })} className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                                <select value={formData.complexity} onChange={(e) => setFormData({ ...formData, complexity: e.target.value })} className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                                  <option>Low</option>
                                  <option>Medium</option>
                                  <option>High</option>
                                  <option>Very High</option>
                                </select>
                              </div>
                              <div className="flex gap-1">
                                <Button size="xs" variant="success" icon={Check} onClick={saveEdit}>Save</Button>
                                <Button size="xs" variant="ghost" icon={X} onClick={() => setEditingId(null)}>Cancel</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="border border-gray-200 rounded p-2 flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:bg-slate-700">
                              <div>
                                <p className="text-xs font-medium text-gray-900 dark:text-white">{at.name}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <span className="text-[10px] text-gray-600 dark:text-slate-400">{at.effortPerCase}h</span>
                                  <Badge variant="gray" className={`text-[9px] ${complexityColors[at.complexity]}`}>{at.complexity}</Badge>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button onClick={() => startEdit(at, 'auditType')} className="p-0.5 hover:bg-gray-200 rounded text-amber-600"><Edit2 size={12} /></button>
                                <button onClick={() => deleteItem(at.id, 'auditType')} className="p-0.5 hover:bg-gray-200 rounded text-red-600"><Trash2 size={12} /></button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <Button size="xs" variant="ghost" icon={Plus} onClick={() => addNew('auditType')} className="w-full text-blue-600 hover:bg-blue-50">Add Type</Button>
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <button onClick={() => toggleSection('skills')} className="flex w-full items-center justify-between px-2 py-1.5 hover:bg-gray-50 rounded dark:bg-slate-700">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Skills <span className="text-xs text-gray-500 ml-1">({planningConfig.skills.length})</span></span>
                    {expandedSections.skills ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {expandedSections.skills && (
                    <div className="space-y-1 pl-2 max-h-32 overflow-y-auto">
                      {planningConfig.skills.map(skill => (
                        <div key={skill.id}>
                          {editingId === skill.id && editingType === 'skill' ? (
                            <div className="bg-blue-50 border border-blue-300 rounded p-1.5 space-y-1">
                              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full text-xs px-1.5 py-0.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                              <div className="grid grid-cols-2 gap-0.5">
                                <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })} className="text-xs px-1 py-0.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                                  <option value={1}>Foundation</option>
                                  <option value={2}>Advanced</option>
                                  <option value={3}>Expert</option>
                                </select>
                                <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="text-xs px-1 py-0.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                              </div>
                              <div className="flex gap-0.5">
                                <Button size="xs" variant="success" icon={Check} onClick={saveEdit}>Save</Button>
                                <Button size="xs" variant="ghost" icon={X} onClick={() => setEditingId(null)}>Cancel</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="border border-gray-200 rounded p-1.5 flex items-center justify-between hover:bg-gray-50 dark:bg-gray-800 dark:bg-slate-700">
                              <div>
                                <p className="text-xs font-medium text-gray-900 dark:text-white">{skill.name}</p>
                                <span className="text-[9px] text-gray-600 dark:text-slate-400">{levelLabels[skill.level]}</span>
                              </div>
                              <div className="flex gap-0.5">
                                <button onClick={() => startEdit(skill, 'skill')} className="p-0.5 hover:bg-gray-200 rounded text-amber-600"><Edit2 size={11} /></button>
                                <button onClick={() => deleteItem(skill.id, 'skill')} className="p-0.5 hover:bg-gray-200 rounded text-red-600"><Trash2 size={11} /></button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <Button size="xs" variant="ghost" icon={Plus} onClick={() => addNew('skill')} className="w-full text-blue-600 hover:bg-blue-50 text-xs">Add Skill</Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreatePlanModal open={showCreate} onClose={() => setShowCreate(false)} />
      {selectedPlan && <PlanDetailModal plan={selectors.getPlanById(selectedPlan.id)} onClose={() => setSelectedPlan(null)} />}

      {/* Submit confirmation */}
      <Modal open={!!confirmSubmit} onClose={() => setConfirmSubmit(null)} title={confirmSubmit?.status === 'AMENDMENT_REQUIRED' ? 'Resubmit Amended Plan' : 'Submit Plan for Director Approval'} size="sm"
        footer={<><Button variant="secondary" onClick={() => setConfirmSubmit(null)}>Cancel</Button><Button variant="primary" icon={Send} onClick={() => handleSubmit(confirmSubmit)}>{confirmSubmit?.status === 'AMENDMENT_REQUIRED' ? 'Resubmit' : 'Submit'}</Button></>}>
        {confirmSubmit?.status === 'AMENDMENT_REQUIRED' ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-slate-400">Resubmit the amended plan <strong>{confirmSubmit?.name}</strong> back to the Audit Director?</p>
            {confirmSubmit?.amendmentComment && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-orange-700 mb-1">Director's amendment instructions:</p>
                <p className="text-xs text-orange-600">{confirmSubmit.amendmentComment}</p>
              </div>
            )}
          </div>
        ) : confirmSubmit?.status === 'SENIOR_MGMT_REJECTED' ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-slate-400">Resubmit <strong>{confirmSubmit?.name}</strong> back to the Audit Director after addressing Senior Management's concerns?</p>
            {confirmSubmit?.seniorComment && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-700 mb-1">Senior Management rejection reason:</p>
                <p className="text-xs text-red-600">{confirmSubmit.seniorComment}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-slate-400">Submit <strong>{confirmSubmit?.name}</strong> for Audit Director review? You will not be able to edit it while under review.</p>
        )}
      </Modal>

      {/* Amendment Edit Modal */}
      <AmendmentEditModal
        plan={amendmentEditPlan}
        open={!!amendmentEditPlan}
        onClose={() => setAmendmentEditPlan(null)}
        onUpdate={handleAmendmentUpdate}
      />
    </div>
  );
}
