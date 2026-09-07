import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, Plus, Trash2, Edit2, Check, X, RotateCcw, Save, 
  Users, Clock, Shield, Sliders, DollarSign, Calculator, AlertCircle, 
  CheckCircle2, ChevronDown, ChevronRight, Building2, MapPin
} from 'lucide-react';
import { Card, Button, Badge, Modal, Input, Select, Alert } from '../../../../components/ui/index.jsx';
import { 
  getPlanningConfig, 
  savePlanningConfig, 
  resetPlanningConfig, 
  calculateCapacityMetrics,
  DEFAULT_PLANNING_CONFIG 
} from '../../services/planningConfigService.js';

const COMPLEXITY_COLORS = {
  'Low': 'green',
  'Medium': 'yellow',
  'High': 'orange',
  'Very High': 'red',
};

const COLOR_OPTIONS = [
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' },
  { value: 'red', label: 'Red' },
  { value: 'teal', label: 'Teal' },
  { value: 'indigo', label: 'Indigo' },
];

export default function PlanConfigurationPage() {
  const [config, setConfig] = useState(DEFAULT_PLANNING_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('auditTypes'); // 'auditTypes' | 'capacity' | 'multipliers'
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  // Modal State for Add/Edit Audit Type
  const [auditTypeModalOpen, setAuditTypeModalOpen] = useState(false);
  const [isEditingAuditType, setIsEditingAuditType] = useState(false);
  const [auditTypeForm, setAuditTypeForm] = useState({
    id: '',
    name: '',
    shortName: '',
    effortPerCase: 80,
    complexity: 'Medium',
    revenuePerCase: 300000,
    governanceRouting: 'TEAM_LEADER',
    color: 'blue',
    description: '',
    active: true,
  });

  // Modal State for Add/Edit Region
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [isEditingRegion, setIsEditingRegion] = useState(false);
  const [regionForm, setRegionForm] = useState({
    id: '',
    name: '',
    code: '',
    headcount: 100,
    taxpayers: 250000,
    active: true,
  });

  // Modal State for Add Nested Tax Center
  const [tcModalOpen, setTcModalOpen] = useState(false);
  const [tcTargetRegionId, setTcTargetRegionId] = useState(null);
  const [tcForm, setTcForm] = useState({
    id: '',
    name: '',
    shortName: '',
  });

  // Accordion expansion state for nested tax centers per region
  const [expandedRegions, setExpandedRegions] = useState({});

  const toggleRegionExpand = (regId) => {
    setExpandedRegions(prev => ({
      ...prev,
      [regId]: !prev[regId],
    }));
  };

  // Simulator State in Multipliers tab
  const [simAuditType, setSimAuditType] = useState('desk_audit');
  const [simCaseCount, setSimCaseCount] = useState(100);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getPlanningConfig();
        if (data) setConfig(data);
      } catch (e) {
        console.error('Failed to load planning configuration:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Computed Capacity Metrics
  const metrics = useMemo(() => calculateCapacityMetrics(config), [config]);

  // Save changes to backend
  const handleSave = async () => {
    setSaving(true);
    setFeedback({ type: null, message: '' });
    try {
      const saved = await savePlanningConfig(config, 'Audit Planning Team');
      setConfig(saved);
      setFeedback({ type: 'success', message: 'Planning configuration & regional hierarchy successfully saved and synchronized!' });
      setTimeout(() => setFeedback({ type: null, message: '' }), 5000);
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to save configuration to backend. Saved locally in browser.' });
    } finally {
      setSaving(false);
    }
  };

  // Reset to ministry defaults
  const handleReset = async () => {
    if (!window.confirm('Reset all planning, regional, and capacity settings to statutory Ministry defaults? This cannot be undone.')) {
      return;
    }
    setSaving(true);
    try {
      const restored = await resetPlanningConfig();
      setConfig(restored);
      setFeedback({ type: 'success', message: 'Restored statutory Ministry defaults successfully.' });
      setTimeout(() => setFeedback({ type: null, message: '' }), 4000);
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Error resetting configuration.' });
    } finally {
      setSaving(false);
    }
  };

  // ── AUDIT TYPES HANDLERS ────────────────────────────────────
  const openNewAuditTypeModal = () => {
    setIsEditingAuditType(false);
    setAuditTypeForm({
      id: `audit_${Date.now()}`,
      name: '',
      shortName: '',
      effortPerCase: 80,
      complexity: 'Medium',
      revenuePerCase: 250000,
      governanceRouting: 'TEAM_LEADER',
      color: 'blue',
      description: '',
      active: true,
    });
    setAuditTypeModalOpen(true);
  };

  const openEditAuditTypeModal = (type) => {
    setIsEditingAuditType(true);
    setAuditTypeForm({ ...type });
    setAuditTypeModalOpen(true);
  };

  const handleAuditTypeSubmit = (e) => {
    e.preventDefault();
    if (!auditTypeForm.name || !auditTypeForm.name.trim()) return;

    const id = auditTypeForm.id || `type_${auditTypeForm.name.toLowerCase().replace(/\s+/g, '_')}`;
    const shortName = auditTypeForm.shortName?.trim() || auditTypeForm.name.slice(0, 5);

    const updatedType = {
      ...auditTypeForm,
      id,
      shortName,
      effortPerCase: Number(auditTypeForm.effortPerCase) || 40,
      revenuePerCase: Number(auditTypeForm.revenuePerCase) || 100000,
    };

    if (isEditingAuditType) {
      setConfig(prev => ({
        ...prev,
        auditTypes: prev.auditTypes.map(t => t.id === updatedType.id ? updatedType : t),
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        auditTypes: [...prev.auditTypes, updatedType],
      }));
    }

    setAuditTypeModalOpen(false);
  };

  const handleDeleteAuditType = (id) => {
    if (config.auditTypes.length <= 1) {
      alert('At least one audit type must remain configured.');
      return;
    }
    if (!window.confirm(`Are you sure you want to remove audit type '${id}'?`)) return;
    setConfig(prev => ({
      ...prev,
      auditTypes: prev.auditTypes.filter(t => t.id !== id),
    }));
  };

  const handleToggleActiveAuditType = (id) => {
    setConfig(prev => ({
      ...prev,
      auditTypes: prev.auditTypes.map(t => t.id === id ? { ...t, active: !t.active } : t),
    }));
  };

  // ── REGIONS HANDLERS (ADD / REMOVE / EDIT) ───────────────────
  const openNewRegionModal = () => {
    setIsEditingRegion(false);
    setRegionForm({
      id: `reg_${Date.now()}`,
      name: '',
      code: '',
      headcount: 80,
      taxpayers: 200000,
      active: true,
    });
    setRegionModalOpen(true);
  };

  const openEditRegionModal = (region) => {
    setIsEditingRegion(true);
    setRegionForm({
      id: region.id,
      name: region.name,
      code: region.code,
      headcount: region.headcount || 0,
      taxpayers: region.taxpayers || 0,
      active: region.active !== false,
    });
    setRegionModalOpen(true);
  };

  const handleRegionSubmit = (e) => {
    e.preventDefault();
    if (!regionForm.name?.trim()) return;

    const code = regionForm.code?.trim().toUpperCase() || regionForm.name.slice(0, 2).toUpperCase();
    const id = regionForm.id || regionForm.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const headcount = Math.max(0, parseInt(regionForm.headcount) || 0);
    const taxpayers = Math.max(0, parseInt(regionForm.taxpayers) || 0);

    if (isEditingRegion) {
      setConfig(prev => ({
        ...prev,
        regions: (prev.regions || []).map(r => r.id === id ? {
          ...r,
          name: regionForm.name,
          code,
          headcount,
          taxpayers,
        } : r),
        capacity: {
          ...prev.capacity,
          regionalHeadcount: {
            ...prev.capacity?.regionalHeadcount,
            [id]: headcount,
          },
        },
      }));
    } else {
      const newRegion = {
        id,
        name: regionForm.name,
        code,
        headcount,
        taxpayers,
        active: true,
        taxCenters: [], // Initially empty, nested addition when needed!
      };
      setConfig(prev => ({
        ...prev,
        regions: [...(prev.regions || []), newRegion],
        capacity: {
          ...prev.capacity,
          regionalHeadcount: {
            ...prev.capacity?.regionalHeadcount,
            [id]: headcount,
          },
        },
      }));
    }

    setRegionModalOpen(false);
  };

  const handleDeleteRegion = (regionId) => {
    if ((config.regions || []).length <= 1) {
      alert('At least one region must remain configured.');
      return;
    }
    if (!window.confirm(`Are you sure you want to remove region '${regionId}'? Its auditor headcount and nested tax centers will also be removed.`)) {
      return;
    }

    setConfig(prev => {
      const updatedHeadcount = { ...(prev.capacity?.regionalHeadcount || {}) };
      delete updatedHeadcount[regionId];
      return {
        ...prev,
        regions: (prev.regions || []).filter(r => r.id !== regionId),
        capacity: {
          ...prev.capacity,
          regionalHeadcount: updatedHeadcount,
        },
      };
    });
  };

  const updateRegionHeadcountDirect = (regionId, value) => {
    const headcount = Math.max(0, parseInt(value) || 0);
    setConfig(prev => ({
      ...prev,
      regions: (prev.regions || []).map(r => r.id === regionId ? { ...r, headcount } : r),
      capacity: {
        ...prev.capacity,
        regionalHeadcount: {
          ...prev.capacity?.regionalHeadcount,
          [regionId]: headcount,
        },
      },
    }));
  };

  // ── NESTED TAX CENTERS HANDLERS (OPTIONAL PER REGION) ─────────
  const openAddTaxCenterModal = (regionId) => {
    setTcTargetRegionId(regionId);
    const reg = (config.regions || []).find(r => r.id === regionId);
    const existingCount = reg?.taxCenters?.length || 0;
    const defaultCode = reg ? `${reg.code}-TC${existingCount + 1}` : 'TC1';
    setTcForm({
      id: `${regionId}-tc${Date.now().toString().slice(-4)}`,
      name: `${reg?.name || 'Region'} Tax Center ${existingCount + 1}`,
      shortName: defaultCode,
    });
    setTcModalOpen(true);
  };

  const handleTaxCenterSubmit = (e) => {
    e.preventDefault();
    if (!tcTargetRegionId || !tcForm.name?.trim()) return;

    const newTC = {
      id: tcForm.id || `${tcTargetRegionId}-tc${Date.now().toString().slice(-4)}`,
      name: tcForm.name.trim(),
      shortName: tcForm.shortName?.trim() || tcForm.name.slice(0, 6),
    };

    setConfig(prev => ({
      ...prev,
      regions: (prev.regions || []).map(r => {
        if (r.id === tcTargetRegionId) {
          const list = r.taxCenters || [];
          return {
            ...r,
            taxCenters: [...list, newTC],
          };
        }
        return r;
      }),
    }));

    // Auto expand the region
    setExpandedRegions(prev => ({ ...prev, [tcTargetRegionId]: true }));
    setTcModalOpen(false);
  };

  const handleDeleteTaxCenter = (regionId, tcId) => {
    if (!window.confirm(`Remove tax center '${tcId}' from region?`)) return;
    setConfig(prev => ({
      ...prev,
      regions: (prev.regions || []).map(r => {
        if (r.id === regionId) {
          return {
            ...r,
            taxCenters: (r.taxCenters || []).filter(tc => tc.id !== tcId),
          };
        }
        return r;
      }),
    }));
  };

  // ── CAPACITY & MULTIPLIER HANDLERS ───────────────────────────
  const updateCapacityField = (field, value) => {
    setConfig(prev => ({
      ...prev,
      capacity: {
        ...prev.capacity,
        [field]: Number(value),
      },
    }));
  };

  const updateMultiplier = (complexity, value) => {
    setConfig(prev => ({
      ...prev,
      effortEstimation: {
        ...prev.effortEstimation,
        complexityMultipliers: {
          ...prev.effortEstimation.complexityMultipliers,
          [complexity]: Number(value),
        },
      },
    }));
  };

  const updateContingency = (value) => {
    setConfig(prev => ({
      ...prev,
      effortEstimation: {
        ...prev.effortEstimation,
        contingencyBufferPercentage: Number(value),
      },
    }));
  };

  const formatCurrency = (val) => {
    if (val >= 1000000000) return `${(val / 1000000000).toFixed(2)}B ETB`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M ETB`;
    return `${(val / 1000).toFixed(0)}k ETB`;
  };

  const simTypeObj = config.auditTypes.find(t => t.id === simAuditType) || config.auditTypes[0];
  const simMultiplier = config.effortEstimation?.complexityMultipliers?.[simTypeObj?.complexity] || 1.0;
  const simBuffer = (config.effortEstimation?.contingencyBufferPercentage || 15) / 100;
  const simTotalHours = simTypeObj ? Math.round(simCaseCount * simTypeObj.effortPerCase * simMultiplier * (1 + simBuffer)) : 0;
  const simTotalRevenue = simTypeObj ? simCaseCount * (simTypeObj.revenuePerCase || 250000) : 0;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">Loading Planning Configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ── Top Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white dark:bg-[#161b26] p-6 rounded-2xl border border-gray-200 dark:border-[#1e2736] shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-800">
              <Sliders size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                Audit Planning & Resource Configuration
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Configure statutory audit types, regional boundaries, nested tax centers, and auditor capacity limits.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-500 dark:text-gray-400">
            <span>Config Version: <strong className="text-gray-800 dark:text-gray-200">v{config.version || 1}</strong></span>
            <span>•</span>
            <span>Last Updated: <strong className="text-gray-800 dark:text-gray-200">{new Date(config.lastUpdated).toLocaleString()}</strong></span>
            <span>•</span>
            <span>Updated By: <strong className="text-gray-800 dark:text-gray-200">{config.updatedBy}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button 
            variant="secondary" 
            size="sm" 
            icon={RotateCcw} 
            disabled={saving} 
            onClick={handleReset}
          >
            Reset to Defaults
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            icon={Save} 
            loading={saving} 
            onClick={handleSave}
          >
            Save Configuration
          </Button>
        </div>
      </div>

      {/* ── Feedback Notification ──────────────────────────────── */}
      {feedback.message && (
        <Alert type={feedback.type} title={feedback.type === 'success' ? 'Configuration Saved' : 'Notice'}>
          {feedback.message}
        </Alert>
      )}

      {/* ── Live Feasibility Metrics Bar ──────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card accent="blue" padding={true}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Available Auditor Pool</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">
                {metrics.totalAuditors.toLocaleString()}
              </p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-0.5">
                {(config.regions || []).length} Configured Regions
              </p>
            </div>
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">
              <Users size={20} />
            </div>
          </div>
        </Card>

        <Card accent="green" padding={true}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Productive Hours / Auditor</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                {metrics.productiveHoursPerAuditor.toLocaleString()} hrs
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                {(config.capacity?.directProductiveRatio * 100).toFixed(0)}% direct audit ratio
              </p>
            </div>
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
              <Clock size={20} />
            </div>
          </div>
        </Card>

        <Card accent="purple" padding={true}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Audit Hours</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1 tabular-nums">
                {(metrics.totalProductiveHours / 1000000).toFixed(2)}M hrs
              </p>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-0.5">Annual National Capacity</p>
            </div>
            <div className="p-2.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg">
              <Calculator size={20} />
            </div>
          </div>
        </Card>

        <Card accent="teal" padding={true}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Max Caseload Capacity</p>
              <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mt-1 tabular-nums">
                ~{metrics.estimatedMaxCases.toLocaleString()}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Avg ~{metrics.avgEffortPerCase} hrs/case
              </p>
            </div>
            <div className="p-2.5 bg-teal-50 dark:bg-teal-900/30 text-teal-600 rounded-lg">
              <Shield size={20} />
            </div>
          </div>
        </Card>
      </div>

      {/* ── Sub-navigation Tabs ──────────────────────────────────── */}
      <div className="flex border-b border-gray-200 dark:border-[#1e2736] gap-2">
        <button
          onClick={() => setActiveTab('auditTypes')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-150 flex items-center gap-2 ${
            activeTab === 'auditTypes'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Settings size={15} />
          1. Audit Types & Governance ({config.auditTypes.length})
        </button>
        <button
          onClick={() => setActiveTab('capacity')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-150 flex items-center gap-2 ${
            activeTab === 'capacity'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <MapPin size={15} />
          2. Regions & Nested Tax Centers ({(config.regions || []).length})
        </button>
        <button
          onClick={() => setActiveTab('multipliers')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-150 flex items-center gap-2 ${
            activeTab === 'multipliers'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Calculator size={15} />
          3. Effort Estimation & Multipliers
        </button>
      </div>

      {/* ── TAB 1: AUDIT TYPES & GOVERNANCE ──────────────────────── */}
      {activeTab === 'auditTypes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Configured Audit Types</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Define the case categories available for planning, their effort requirements, projected revenue, and sign-off governance.
              </p>
            </div>
            <Button variant="primary" size="sm" icon={Plus} onClick={openNewAuditTypeModal}>
              Add Audit Type
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-[#1e2736] bg-white dark:bg-[#161b26] shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#111520] border-b border-gray-200 dark:border-[#1e2736] text-gray-600 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Audit Type Name</th>
                  <th className="px-3 py-3 font-semibold">Tag</th>
                  <th className="px-3 py-3 font-semibold text-center">Effort (Hours)</th>
                  <th className="px-3 py-3 font-semibold text-center">Complexity</th>
                  <th className="px-3 py-3 font-semibold text-right">Est. Revenue</th>
                  <th className="px-4 py-3 font-semibold">Governance Workflow</th>
                  <th className="px-3 py-3 font-semibold text-center">Active</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#1e2736]">
                {config.auditTypes.map((type) => {
                  const isCommittee = type.governanceRouting === 'COMMITTEE';
                  return (
                    <tr key={type.id} className={`hover:bg-gray-50/50 dark:hover:bg-[#1c2333]/40 ${!type.active ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900 dark:text-white">{type.name}</div>
                        <div className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{type.description}</div>
                      </td>
                      <td className="px-3 py-3">
                        <Badge color={type.color || 'blue'}>{type.shortName || type.name.slice(0, 4)}</Badge>
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-gray-800 dark:text-gray-200">
                        {type.effortPerCase} hrs
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Badge color={COMPLEXITY_COLORS[type.complexity] || 'gray'}>{type.complexity}</Badge>
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-emerald-700 dark:text-emerald-400">
                        {formatCurrency(type.revenuePerCase || 250000)}
                      </td>
                      <td className="px-4 py-3">
                        {isCommittee ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">
                            <Shield size={11} />
                            Specialized Committee Oversight
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                            <Users size={11} />
                            Team Leader Approval
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={type.active !== false}
                          onChange={() => handleToggleActiveAuditType(type.id)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            icon={Edit2} 
                            onClick={() => openEditAuditTypeModal(type)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            icon={Trash2} 
                            onClick={() => handleDeleteAuditType(type.id)}
                          >
                            Delete
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

      {/* ── TAB 2: REGIONS & NESTED TAX CENTERS ─────────────────── */}
      {activeTab === 'capacity' && (
        <div className="space-y-6">
          {/* Base working hours settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card accent="blue">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-3">
                Working Days & Time Standards
              </h3>
              <div className="space-y-3">
                <Input
                  label="Annual Statutory Working Days"
                  type="number"
                  value={config.capacity?.workingDaysPerYear || 220}
                  onChange={(e) => updateCapacityField('workingDaysPerYear', e.target.value)}
                  helper="Excludes statutory public holidays & standard weekends"
                />
                <Input
                  label="Daily Working Hours"
                  type="number"
                  step="0.5"
                  value={config.capacity?.hoursPerDay || 8.0}
                  onChange={(e) => updateCapacityField('hoursPerDay', e.target.value)}
                  helper="Standard civil service workday length"
                />
              </div>
            </Card>

            <Card accent="green">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-3">
                Productive Ratio & Leave
              </h3>
              <div className="space-y-3">
                <Input
                  label="Direct Audit Productive Ratio"
                  type="number"
                  step="0.05"
                  min="0.4"
                  max="1.0"
                  value={config.capacity?.directProductiveRatio || 0.75}
                  onChange={(e) => updateCapacityField('directProductiveRatio', e.target.value)}
                  helper="Casework vs meetings / training / administration"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Training Days"
                    type="number"
                    value={config.capacity?.annualTrainingDays || 5}
                    onChange={(e) => updateCapacityField('annualTrainingDays', e.target.value)}
                  />
                  <Input
                    label="Leave Days"
                    type="number"
                    value={config.capacity?.annualLeaveDays || 20}
                    onChange={(e) => updateCapacityField('annualLeaveDays', e.target.value)}
                  />
                </div>
              </div>
            </Card>

            <Card accent="purple">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-3">
                Productive Capacity Output
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#1e2736]">
                  <span className="text-gray-500">Gross Hours / Auditor:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {(config.capacity?.workingDaysPerYear || 220) * (config.capacity?.hoursPerDay || 8)} hrs
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#1e2736]">
                  <span className="text-gray-500">Productive Audit Hours:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {metrics.productiveHoursPerAuditor} hrs / auditor
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#1e2736]">
                  <span className="text-gray-500">Total National Pool:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {metrics.totalAuditors} auditors
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Total Productive Hours:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {metrics.totalProductiveHours.toLocaleString()} hrs
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Configurable Regions Table with Nested Tax Centers */}
          <div className="bg-white dark:bg-[#161b26] rounded-xl border border-gray-200 dark:border-[#1e2736] p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600" />
                  Configured Jurisdictions & Regions ({(config.regions || []).length})
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Add or remove regions, configure auditor headcount, and optionally nest tax centers for regional sub-allocation when needed.
                </p>
              </div>
              <Button variant="primary" size="sm" icon={Plus} onClick={openNewRegionModal}>
                Add Region
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-[#111520] text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-[#1e2736]">
                  <tr>
                    <th className="px-3 py-2.5 font-semibold w-8"></th>
                    <th className="px-4 py-2.5 font-semibold">Region / Jurisdiction</th>
                    <th className="px-3 py-2.5 font-semibold">Code</th>
                    <th className="px-4 py-2.5 font-semibold text-center">Active Auditors</th>
                    <th className="px-4 py-2.5 font-semibold text-center">Productive Hours</th>
                    <th className="px-4 py-2.5 font-semibold text-center">Feasible Caseload</th>
                    <th className="px-3 py-2.5 font-semibold text-center">Nested Tax Centers</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#1e2736]">
                  {(config.regions || []).map((region) => {
                    const count = region.headcount || 0;
                    const regHours = count * metrics.productiveHoursPerAuditor;
                    const regMaxCases = metrics.avgEffortPerCase > 0 ? Math.round(regHours / metrics.avgEffortPerCase) : 0;
                    const isExpanded = !!expandedRegions[region.id];
                    const tcList = region.taxCenters || [];

                    return (
                      <React.Fragment key={region.id}>
                        <tr className={`hover:bg-gray-50/50 dark:hover:bg-[#1c2333]/40 ${isExpanded ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''}`}>
                          <td className="px-3 py-3 text-center">
                            <button
                              onClick={() => toggleRegionExpand(region.id)}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500"
                              title="Toggle nested tax centers"
                            >
                              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <span>{region.name}</span>
                              {region.taxpayers ? (
                                <span className="text-[10px] text-gray-400 font-normal">
                                  ({(region.taxpayers / 1000).toFixed(0)}k taxpayers)
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="px-3 py-3 font-mono font-bold text-gray-600 dark:text-gray-300">
                            {region.code}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="number"
                              min="0"
                              value={count}
                              onChange={(e) => updateRegionHeadcountDirect(region.id, e.target.value)}
                              className="w-20 text-center px-2 py-1 rounded-lg border border-gray-300 dark:border-[#2a3348] dark:bg-[#111520] dark:text-white font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
                            {regHours.toLocaleString()} hrs
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                            ~{regMaxCases.toLocaleString()}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <button
                              onClick={() => toggleRegionExpand(region.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                                tcList.length > 0 
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300' 
                                  : 'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-400'
                              }`}
                            >
                              <Building2 size={11} />
                              {tcList.length} {tcList.length === 1 ? 'Tax Center' : 'Tax Centers'}
                              <span className="text-[10px] opacity-70">
                                {isExpanded ? '▲' : '▼'}
                              </span>
                            </button>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button 
                                variant="ghost" 
                                size="xs" 
                                icon={Edit2} 
                                onClick={() => openEditRegionModal(region)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="xs" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                icon={Trash2} 
                                onClick={() => handleDeleteRegion(region.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* ── NESTED TAX CENTERS ACCORDION ROW ── */}
                        {isExpanded && (
                          <tr className="bg-slate-50/80 dark:bg-[#111520]/80">
                            <td colSpan={8} className="px-6 py-3.5 border-y border-blue-100 dark:border-blue-900/40">
                              <div className="space-y-3 pl-4 border-l-2 border-blue-500">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Building2 size={15} className="text-blue-600 dark:text-blue-400" />
                                    <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">
                                      Nested Tax Centers for {region.name}
                                    </span>
                                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                      (Optional addition for granular allocation)
                                    </span>
                                  </div>
                                  <Button 
                                    variant="secondary" 
                                    size="xs" 
                                    icon={Plus} 
                                    onClick={() => openAddTaxCenterModal(region.id)}
                                  >
                                    Add Tax Center
                                  </Button>
                                </div>

                                {tcList.length === 0 ? (
                                  <p className="text-xs text-gray-400 italic">
                                    No nested tax centers configured for this region yet. (Optional — cases will default to regional management).
                                  </p>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                    {tcList.map((tc) => (
                                      <div 
                                        key={tc.id} 
                                        className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#161b26] border border-gray-200 dark:border-[#2a3348] text-xs shadow-xs"
                                      >
                                        <div>
                                          <p className="font-semibold text-gray-900 dark:text-white">{tc.name}</p>
                                          <p className="text-[10px] font-mono text-gray-400">{tc.shortName || tc.id}</p>
                                        </div>
                                        <button
                                          onClick={() => handleDeleteTaxCenter(region.id, tc.id)}
                                          className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                                          title="Remove tax center"
                                        >
                                          <X size={13} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: EFFORT ESTIMATION & MULTIPLIERS ──────────────── */}
      {activeTab === 'multipliers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Complexity Multipliers Card */}
            <Card accent="orange">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                Complexity Effort Multipliers
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Scales baseline hours according to transaction complexity and audit depth.
              </p>

              <div className="space-y-3">
                {Object.entries(config.effortEstimation?.complexityMultipliers || {}).map(([level, val]) => (
                  <div key={level} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-[#111520]">
                    <div className="flex items-center gap-2">
                      <Badge color={COMPLEXITY_COLORS[level] || 'gray'}>{level}</Badge>
                      <span className="text-xs text-gray-600 dark:text-gray-300">Complexity Multiplier</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.05"
                        min="0.5"
                        max="3.0"
                        value={val}
                        onChange={(e) => updateMultiplier(level, e.target.value)}
                        className="w-20 text-center px-2 py-1 rounded-md border border-gray-300 dark:border-[#2a3348] dark:bg-[#161b26] dark:text-white font-bold text-xs"
                      />
                      <span className="text-xs text-gray-400">× base</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contingency Buffer Card */}
            <Card accent="teal">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                Contingency & Fieldwork Buffers
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Protects against audit delays, taxpayer disputes, and logistical travel overhead.
              </p>

              <div className="space-y-4">
                <Input
                  label="Contingency Buffer Percentage (%)"
                  type="number"
                  min="0"
                  max="50"
                  value={config.effortEstimation?.contingencyBufferPercentage || 15}
                  onChange={(e) => updateContingency(e.target.value)}
                  helper="Added on top of calculated audit hours to absorb taxpayer response delays"
                />

                <div className="p-3.5 rounded-xl bg-teal-50/50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 text-xs space-y-1.5">
                  <p className="font-semibold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                    <Shield size={14} /> Buffer Formula Application
                  </p>
                  <p className="text-teal-700 dark:text-teal-400 text-[11px]">
                    Total Required Hours = Cases × Base Effort × Multiplier × (1 + Contingency%)
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Interactive Live Caseload Effort Calculator */}
          <Card accent="blue">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              Live Effort & Revenue Estimator
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Simulate required hours and estimated tax revenue for any proposed audit caseload.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#111520] mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Audit Type</label>
                <select
                  value={simAuditType}
                  onChange={(e) => setSimAuditType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#2a3348] dark:bg-[#161b26] dark:text-white"
                >
                  {config.auditTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.effortPerCase} hrs)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Proposed Cases</label>
                <input
                  type="number"
                  min="1"
                  value={simCaseCount}
                  onChange={(e) => setSimCaseCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#2a3348] dark:bg-[#161b26] dark:text-white font-bold"
                />
              </div>

              <div className="border-l border-gray-200 dark:border-[#2a3348] pl-4">
                <p className="text-[10px] font-bold uppercase text-gray-500">Estimated Effort</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
                  {simTotalHours.toLocaleString()} hrs
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {(simTotalHours / (metrics.productiveHoursPerAuditor || 1320)).toFixed(1)} Full-Time Auditors
                </p>
              </div>

              <div className="border-l border-gray-200 dark:border-[#2a3348] pl-4">
                <p className="text-[10px] font-bold uppercase text-gray-500">Estimated Revenue</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                  {formatCurrency(simTotalRevenue)}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">Projected yield</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── Modal for Adding / Editing Audit Type ───────────────── */}
      <Modal
        open={auditTypeModalOpen}
        onClose={() => setAuditTypeModalOpen(false)}
        title={isEditingAuditType ? `Edit Audit Type: ${auditTypeForm.name}` : 'Add New Audit Type'}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setAuditTypeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAuditTypeSubmit}>
              {isEditingAuditType ? 'Save Audit Type' : 'Add Audit Type'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleAuditTypeSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Type Name"
              value={auditTypeForm.name}
              onChange={(e) => setAuditTypeForm({ ...auditTypeForm, name: e.target.value })}
              placeholder="e.g. Forensic Audit"
              required
            />
            <Input
              label="Short Tag / Code"
              value={auditTypeForm.shortName}
              onChange={(e) => setAuditTypeForm({ ...auditTypeForm, shortName: e.target.value })}
              placeholder="e.g. Foren"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Effort Per Case (Hours)"
              type="number"
              min="1"
              value={auditTypeForm.effortPerCase}
              onChange={(e) => setAuditTypeForm({ ...auditTypeForm, effortPerCase: e.target.value })}
            />

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Complexity
              </label>
              <select
                value={auditTypeForm.complexity}
                onChange={(e) => setAuditTypeForm({ ...auditTypeForm, complexity: e.target.value })}
                className="w-full rounded-lg border border-gray-200 dark:border-[#2a3348] dark:bg-[#111520] dark:text-white px-3 py-2 text-xs"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>

            <Input
              label="Est. Revenue (ETB)"
              type="number"
              value={auditTypeForm.revenuePerCase}
              onChange={(e) => setAuditTypeForm({ ...auditTypeForm, revenuePerCase: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Governance Workflow
              </label>
              <select
                value={auditTypeForm.governanceRouting}
                onChange={(e) => setAuditTypeForm({ ...auditTypeForm, governanceRouting: e.target.value })}
                className="w-full rounded-lg border border-gray-200 dark:border-[#2a3348] dark:bg-[#111520] dark:text-white px-3 py-2 text-xs"
              >
                <option value="TEAM_LEADER">Team Leader Approval (Standard)</option>
                <option value="COMMITTEE">Specialized Committee Oversight (Joint / TP)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Badge Color
              </label>
              <select
                value={auditTypeForm.color}
                onChange={(e) => setAuditTypeForm({ ...auditTypeForm, color: e.target.value })}
                className="w-full rounded-lg border border-gray-200 dark:border-[#2a3348] dark:bg-[#111520] dark:text-white px-3 py-2 text-xs"
              >
                {COLOR_OPTIONS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Description"
            value={auditTypeForm.description}
            onChange={(e) => setAuditTypeForm({ ...auditTypeForm, description: e.target.value })}
            placeholder="Operational scope and statutory audit requirements..."
          />
        </form>
      </Modal>

      {/* ── Modal for Adding / Editing Region ───────────────────── */}
      <Modal
        open={regionModalOpen}
        onClose={() => setRegionModalOpen(false)}
        title={isEditingRegion ? `Edit Region: ${regionForm.name}` : 'Add New Region'}
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setRegionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRegionSubmit}>
              {isEditingRegion ? 'Save Region' : 'Add Region'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleRegionSubmit} className="space-y-4 text-xs">
          <Input
            label="Region Name *"
            value={regionForm.name}
            onChange={(e) => setRegionForm({ ...regionForm, name: e.target.value })}
            placeholder="e.g. Tigray"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Region Code (2 Letters) *"
              value={regionForm.code}
              onChange={(e) => setRegionForm({ ...regionForm, code: e.target.value })}
              placeholder="e.g. TG"
              maxLength={4}
              required
            />
            <Input
              label="Auditor Headcount *"
              type="number"
              min="0"
              value={regionForm.headcount}
              onChange={(e) => setRegionForm({ ...regionForm, headcount: e.target.value })}
              required
            />
          </div>

          <Input
            label="Estimated Taxpayers Count"
            type="number"
            min="0"
            value={regionForm.taxpayers}
            onChange={(e) => setRegionForm({ ...regionForm, taxpayers: e.target.value })}
            placeholder="e.g. 350000"
          />
        </form>
      </Modal>

      {/* ── Modal for Adding Nested Tax Center ──────────────────── */}
      <Modal
        open={tcModalOpen}
        onClose={() => setTcModalOpen(false)}
        title="Add Tax Center to Region"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setTcModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleTaxCenterSubmit}>
              Add Tax Center
            </Button>
          </div>
        }
      >
        <form onSubmit={handleTaxCenterSubmit} className="space-y-4 text-xs">
          <Alert type="info" title="Optional Sub-Jurisdiction">
            Adding a tax center provides a nested 1:1 taxpayer and auditor assignment unit inside this region.
          </Alert>

          <Input
            label="Tax Center Name *"
            value={tcForm.name}
            onChange={(e) => setTcForm({ ...tcForm, name: e.target.value })}
            placeholder="e.g. Mekelle South TC"
            required
          />

          <Input
            label="Short Code *"
            value={tcForm.shortName}
            onChange={(e) => setTcForm({ ...tcForm, shortName: e.target.value })}
            placeholder="e.g. TG-TC1"
            required
          />
        </form>
      </Modal>
    </div>
  );
}
