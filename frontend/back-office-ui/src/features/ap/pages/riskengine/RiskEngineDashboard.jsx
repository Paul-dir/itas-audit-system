import { useState, useMemo } from 'react';
import { TrendingUp, AlertTriangle, Target, Database, Filter, Download, Play, CheckCircle, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Card, StatCard, Button, Badge, Table, Input, Select, Modal, Alert, Tabs } from '../../components/ui/index.jsx';
import { AUDIT_TYPES, REGIONS, getRiskLevel, getTaxCentersForRegion } from '../../data/constants.js';
import { ADDIS_ABABA_TAXPAYERS, REGIONAL_TAXPAYER_COUNTS, getTaxpayersForTaxCenter, selectTopRiskTaxpayers } from '../../data/taxpayers.js';

export default function RiskEngineDashboard() {
  const { state, actions } = useApp();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [mappingModal, setMappingModal] = useState(false);
  const [mappingResults, setMappingResults] = useState(null);
  const [tab, setTab] = useState('analysis');
  
  // NEW: Manual selection state
  const [selectedTaxpayers, setSelectedTaxpayers] = useState([]);
  const [showCreateCasesModal, setShowCreateCasesModal] = useState(false);
  const [selectedAuditTypes, setSelectedAuditTypes] = useState({});
  const [selectedPlanForCases, setSelectedPlanForCases] = useState(null); // Plan to link cases to

  // Get user's tax center and region
  const userTaxCenter = user.taxCenter;
  const userRegion = user.region;

  // Get taxpayers for this tax center only
  const taxpayers = useMemo(() => {
    if (userTaxCenter) {
      return getTaxpayersForTaxCenter(userTaxCenter);
    }
    return ADDIS_ABABA_TAXPAYERS;
  }, [userTaxCenter]);

  // Filter taxpayers
  const filteredTaxpayers = useMemo(() => {
    return taxpayers.filter(tp => {
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch = 
          tp.name?.toLowerCase().includes(q) ||
          tp.tin?.toLowerCase().includes(q) ||
          tp.sector?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Risk filter
      if (riskFilter !== 'ALL' && tp.riskLevel !== riskFilter) return false;

      // Sector filter
      if (sectorFilter !== 'ALL' && tp.sector !== sectorFilter) return false;

      return true;
    });
  }, [taxpayers, searchQuery, riskFilter, sectorFilter]);

  // Get unique sectors
  const sectors = useMemo(() => {
    const unique = [...new Set(taxpayers.map(tp => tp.sector))];
    return unique.sort();
  }, [taxpayers]);

  // Risk distribution stats
  const riskStats = useMemo(() => {
    const stats = {
      CRITICAL: filteredTaxpayers.filter(tp => tp.riskLevel === 'CRITICAL').length,
      HIGH: filteredTaxpayers.filter(tp => tp.riskLevel === 'HIGH').length,
      MEDIUM: filteredTaxpayers.filter(tp => tp.riskLevel === 'MEDIUM').length,
      LOW: filteredTaxpayers.filter(tp => tp.riskLevel === 'LOW').length,
    };
    stats.total = filteredTaxpayers.length;
    return stats;
  }, [filteredTaxpayers]);

  // Audit type recommendations
  const auditTypeStats = useMemo(() => {
    const stats = {};
    AUDIT_TYPES.forEach(at => {
      stats[at.id] = filteredTaxpayers.filter(tp => tp.suggestedAuditType === at.id).length;
    });
    return stats;
  }, [filteredTaxpayers]);

  // Get plans that are deployed to this tax center
  const mappablePlans = state.plans.filter(p => {
    // Must be deployed or finalized
    if (!['APPROVED_TO_REGIONS', 'FINALIZED'].includes(p.status)) return false;
    
    // Must have allocation for this tax center
    if (userTaxCenter && userRegion) {
      const tcAlloc = p.regionalFeedback?.[userRegion]?.taxCenterAllocations?.[userTaxCenter];
      if (!tcAlloc) return false;
      const total = Object.values(tcAlloc).reduce((s, v) => s + v, 0);
      return total > 0;
    }
    
    return true;
  });

  // NEW: Check if a plan already has cases generated (scoped to this tax center)
  const planHasCases = (planId) => {
    return state.cases.some(c => c.planId === planId && c.taxCenter === userTaxCenter);
  };

  // NEW: Get available plans (not yet used for case creation BY THIS TAX CENTER)
  const availablePlansForCaseCreation = mappablePlans.filter(p => !planHasCases(p.id));

  // Map taxpayers to plan (only for user's tax center)
  const mapTaxpayersToPlan = (plan) => {
    const results = {
      planId: plan.id,
      planName: plan.name,
      mappedCases: [],
      summary: {},
      totalMapped: 0,
    };

    // Only map for user's region and tax center
    if (!userRegion || !userTaxCenter) return results;

    const regionalFeedback = plan.regionalFeedback || {};
    const tcAllocations = regionalFeedback[userRegion]?.taxCenterAllocations || {};
    const tcAllocation = tcAllocations[userTaxCenter] || {};
    
    // Get taxpayers for this tax center
    const tcTaxpayers = getTaxpayersForTaxCenter(userTaxCenter);
    
    results.summary[userRegion] = {};
    results.summary[userRegion][userTaxCenter] = {};

    // For each audit type
    AUDIT_TYPES.forEach(auditType => {
      const needed = tcAllocation[auditType.id] || 0;
      if (needed === 0) return;

      // Select top risk taxpayers for this audit type
      const selected = selectTopRiskTaxpayers(tcTaxpayers, auditType.id, needed);
      
      results.summary[userRegion][userTaxCenter][auditType.id] = selected.length;
      results.totalMapped += selected.length;

      // Add to mapped cases
      selected.forEach(tp => {
        results.mappedCases.push({
          taxpayerId: tp.id,
          tin: tp.tin,
          taxpayerName: tp.name,
          sector: tp.sector,
          riskScore: tp.riskScore,
          riskLevel: tp.riskLevel,
          auditType: auditType.id,
          region: userRegion,
          taxCenter: userTaxCenter,
          annualRevenue: tp.annualRevenue,
          employees: tp.employees,
        });
      });
    });

    return results;
  };

  const handleMapToPlan = (plan) => {
    setSelectedPlan(plan);
    const results = mapTaxpayersToPlan(plan);
    setMappingResults(results);
    setMappingModal(true);
  };

  const handleGenerateCases = () => {
    if (!selectedPlan || !mappingResults) return;

    // Generate actual cases
    const cases = mappingResults.mappedCases.map((mc, idx) => ({
      id: `CASE-${selectedPlan.id}-${Date.now()}-${idx}`,
      planId: selectedPlan.id,
      ...mc,
      status: 'PENDING',
      priority: mc.riskLevel === 'CRITICAL' ? 'HIGH' : mc.riskLevel === 'HIGH' ? 'MEDIUM' : 'NORMAL',
      assignedTeamLeader: null,
      assignedAuditor: null,
      createdAt: new Date().toISOString(),
    }));

    // Add cases to state
    cases.forEach(c => {
      actions.updateCaseStatus(c.id, 'PENDING');
    });

    alert(`✅ Success!\n\n${cases.length} audit cases generated from risk engine analysis.`);
    setMappingModal(false);
  };

  // NEW: Toggle taxpayer selection
  const toggleTaxpayerSelection = (taxpayerId) => {
    setSelectedTaxpayers(prev => {
      if (prev.includes(taxpayerId)) {
        return prev.filter(id => id !== taxpayerId);
      } else {
        return [...prev, taxpayerId];
      }
    });
  };

  // NEW: Select/deselect all filtered taxpayers
  const toggleSelectAll = () => {
    if (selectedTaxpayers.length === filteredTaxpayers.length) {
      // Deselect all
      setSelectedTaxpayers([]);
    } else {
      // Select all filtered
      setSelectedTaxpayers(filteredTaxpayers.map(tp => tp.id));
    }
  };

  // NEW: Open create cases modal
  const openCreateCasesModal = () => {
    if (selectedTaxpayers.length === 0) {
      alert('Please select at least one taxpayer to create cases.');
      return;
    }
    
    // Check if there are available plans
    if (availablePlansForCaseCreation.length === 0) {
      alert('No available plans for case creation.\n\nAll deployed plans already have cases generated.\nPlease wait for a new plan to be deployed.');
      return;
    }
    
    // Initialize audit type selections with suggested types
    const auditTypeSelections = {};
    selectedTaxpayers.forEach(tpId => {
      const tp = taxpayers.find(t => t.id === tpId);
      if (tp) {
        auditTypeSelections[tpId] = tp.suggestedAuditType || 'desk_audit';
      }
    });
    setSelectedAuditTypes(auditTypeSelections);
    
    // Pre-select the first available plan
    setSelectedPlanForCases(availablePlansForCaseCreation[0]?.id || null);
    
    setShowCreateCasesModal(true);
  };

  // NEW: Create cases from manual selection
  const handleCreateCasesFromSelection = () => {
    if (!selectedPlanForCases) {
      alert('Please select a plan to link these cases to.');
      return;
    }

    // Verify plan hasn't been used
    if (planHasCases(selectedPlanForCases)) {
      alert('❌ Cases already exist for this plan!\n\nPlease select a different plan or wait for a new plan to be deployed.');
      return;
    }

    const selectedPlan = state.plans.find(p => p.id === selectedPlanForCases);
    if (!selectedPlan) {
      alert('Selected plan not found.');
      return;
    }

    const casesToCreate = selectedTaxpayers.map((tpId, idx) => {
      const tp = taxpayers.find(t => t.id === tpId);
      if (!tp) return null;

      return {
        id: `CASE-${selectedPlanForCases}-${Date.now()}-${idx}`,
        planId: selectedPlanForCases, // Link to selected plan
        taxpayerId: tp.id,
        tin: tp.tin,
        taxpayerName: tp.name,
        sector: tp.sector,
        riskScore: tp.riskScore,
        riskLevel: tp.riskLevel,
        auditType: selectedAuditTypes[tpId] || tp.suggestedAuditType,
        region: userRegion,
        taxCenter: userTaxCenter,
        annualRevenue: tp.annualRevenue,
        employees: tp.employees,
        status: 'PENDING',
        priority: tp.riskLevel === 'CRITICAL' ? 'HIGH' : tp.riskLevel === 'HIGH' ? 'MEDIUM' : 'NORMAL',
        assignedTeamLeader: null,
        assignedAuditor: null,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
        creationMethod: 'risk_engine_manual_selection', // Track how case was created
      };
    }).filter(c => c !== null);

    // Add cases to app state
    actions.addManualCases && actions.addManualCases(casesToCreate);

    alert(`✅ Success!\n\n${casesToCreate.length} audit cases created and linked to plan:\n"${selectedPlan.name}"\n\nCases are now available in your case management dashboard.`);
    
    // Reset selections
    setSelectedTaxpayers([]);
    setSelectedAuditTypes({});
    setSelectedPlanForCases(null);
    setShowCreateCasesModal(false);
  };

  // NEW: Change audit type for selected taxpayer
  const handleAuditTypeChange = (taxpayerId, auditType) => {
    setSelectedAuditTypes(prev => ({
      ...prev,
      [taxpayerId]: auditType
    }));
  };

  // Table columns
  const columns = [
    {
      key: 'select',
      label: (
        <input
          type="checkbox"
          checked={selectedTaxpayers.length === filteredTaxpayers.length && filteredTaxpayers.length > 0}
          onChange={toggleSelectAll}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
        />
      ),
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedTaxpayers.includes(row.id)}
          onChange={() => toggleTaxpayerSelection(row.id)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
        />
      )
    },
    { 
      key: 'tin', 
      label: 'TIN',
      render: v => <span className="font-mono text-xs text-gray-600 dark:text-slate-400">{v}</span>
    },
    { 
      key: 'name', 
      label: 'Taxpayer',
      render: (v, row) => (
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{v}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400">{row.sector}</p>
        </div>
      )
    },
    { 
      key: 'riskScore', 
      label: 'Risk Score',
      render: (v, row) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                row.riskLevel === 'CRITICAL' ? 'bg-red-500' :
                row.riskLevel === 'HIGH' ? 'bg-orange-500' :
                row.riskLevel === 'MEDIUM' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${v}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-900 tabular-nums">{v}</span>
        </div>
      )
    },
    { 
      key: 'riskLevel', 
      label: 'Risk',
      render: v => {
        const colors = { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'blue' };
        return <Badge color={colors[v]} dot>{v}</Badge>;
      }
    },
    { 
      key: 'suggestedAuditType', 
      label: 'Suggested Audit',
      render: v => {
        const at = AUDIT_TYPES.find(a => a.id === v);
        return <Badge color={at?.color || 'gray'}>{at?.shortName || v}</Badge>;
      }
    },
    { 
      key: 'annualRevenue', 
      label: 'Revenue',
      render: v => <span className="text-xs text-gray-600 dark:text-slate-400">{(v / 1000000).toFixed(1)}M ETB</span>
    },
  ];

  const tabs = [
    { id: 'analysis', label: 'Risk Analysis', count: filteredTaxpayers.length },
    { id: 'mapping', label: 'Plan Mapping', count: mappablePlans.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Risk Engine Analysis</h1>
        <p className="text-sm text-gray-500 mt-1">
          AI-powered risk assessment and taxpayer mapping for {userTaxCenter ? userTaxCenter.replace(/-/g, ' ').replace(/_/g, ' ').toUpperCase() : 'your tax center'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          label="Total Taxpayers" 
          value={riskStats.total} 
          icon={Database} 
          color="blue"
          sub="In database"
        />
        <StatCard 
          label="Critical Risk" 
          value={riskStats.CRITICAL} 
          icon={AlertTriangle} 
          color="red"
          sub="Immediate attention"
        />
        <StatCard 
          label="High Risk" 
          value={riskStats.HIGH} 
          icon={TrendingUp} 
          color="orange"
          sub="Priority audits"
        />
        <StatCard 
          label="Medium Risk" 
          value={riskStats.MEDIUM} 
          icon={Target} 
          color="yellow"
          sub="Regular monitoring"
        />
        <StatCard 
          label="Low Risk" 
          value={riskStats.LOW} 
          icon={CheckCircle} 
          color="green"
          sub="Compliant"
        />
      </div>

      {/* Tabs */}
      <Card padding={false}>
        <div className="px-6 pt-4 pb-0">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
        </div>

        {/* Tab Content */}
        {tab === 'analysis' && (
          <div className="p-6 space-y-4">
            {/* Selection Info & Actions */}
            {selectedTaxpayers.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-blue-600" size={24} />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      {selectedTaxpayers.length} taxpayer{selectedTaxpayers.length > 1 ? 's' : ''} selected
                    </p>
                    <p className="text-xs text-blue-700">
                      You can create audit cases from selected taxpayers
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => setSelectedTaxpayers([])}
                  >
                    Clear Selection
                  </Button>
                  <Button 
                    size="sm" 
                    variant="success"
                    icon={Play}
                    onClick={openCreateCasesModal}
                  >
                    Create Cases
                  </Button>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Input
                placeholder="Search taxpayer, TIN, sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <Select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="ALL">All Risk Levels</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </Select>

              <Select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
              >
                <option value="ALL">All Sectors</option>
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </Select>

              <Button variant="secondary" icon={Download} size="sm">
                Export CSV
              </Button>
            </div>

            {/* Audit Type Distribution */}
            <div className="bg-gray-50 rounded-xl p-4 dark:bg-slate-700">
              <p className="text-sm font-semibold text-gray-700 mb-3">Recommended Audit Types</p>
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                {AUDIT_TYPES.map(at => (
                  <div key={at.id} className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-center">
                    <p className="text-xs text-gray-500 dark:text-slate-400">{at.shortName}</p>
                    <p className="text-lg font-bold text-gray-900 tabular-nums">{auditTypeStats[at.id]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Taxpayer Table */}
            <Table 
              columns={columns} 
              rows={filteredTaxpayers}
              emptyMessage="No taxpayers match your filters"
            />
          </div>
        )}

        {tab === 'mapping' && (
          <div className="p-6 space-y-4">
            <Alert type="info" title="Plan Mapping">
              Map taxpayers from the risk engine to approved audit plans. The system will automatically select the highest-risk taxpayers for each audit type.
            </Alert>

            {mappablePlans.length === 0 && (
              <Alert type="warning" title="No plans available">
                No approved plans found. Plans must be approved by Senior Management before they can be mapped to taxpayers.
              </Alert>
            )}

            {/* Available Plans (not yet used) */}
            {availablePlansForCaseCreation.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">📋 Available Plans for Case Creation</h3>
                <div className="space-y-3">
                  {availablePlansForCaseCreation.map(plan => {
                    const dist = plan.distribution || {};
                    const totalCases = Object.values(dist).reduce((sum, regionDist) => {
                      return sum + Object.values(regionDist).reduce((s, v) => s + v, 0);
                    }, 0);

                    return (
                      <Card key={plan.id}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-900 dark:text-white">{plan.name}</p>
                              <Badge color={
                                plan.status === 'FINALIZED' ? 'green' :
                                plan.status === 'APPROVED_TO_REGIONS' ? 'purple' :
                                'blue'
                              } dot>
                                {plan.status === 'FINALIZED' ? 'Finalized' :
                                 plan.status === 'APPROVED_TO_REGIONS' ? 'Approved to Regions' :
                                 'Senior Approved'}
                              </Badge>
                              <Badge color="green" size="sm">✓ Ready</Badge>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-slate-400">
                              FY {plan.year} · {totalCases} total cases across all regions
                            </p>
                            <p className="text-xs text-green-600 mt-1 font-medium">
                              ✓ No cases created yet - You can use this plan
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="primary" 
                            icon={Play}
                            onClick={() => handleMapToPlan(plan)}
                          >
                            Map Taxpayers
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Plans with Cases Already Created */}
            {mappablePlans.filter(p => planHasCases(p.id)).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">✓ Plans with Cases Already Created</h3>
                <div className="space-y-3">
                  {mappablePlans.filter(p => planHasCases(p.id)).map(plan => {
                    const planCases = state.cases.filter(c => c.planId === plan.id && c.taxCenter === userTaxCenter);
                    
                    return (
                      <Card key={plan.id}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-900 dark:text-white">{plan.name}</p>
                              <Badge color="green" dot>Cases Created</Badge>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-slate-400">
                              FY {plan.year} · {planCases.length} cases created for your tax center
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Cases created on {new Date(planCases[0]?.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            icon={Eye}
                            onClick={() => {
                              // Navigate to case management or show cases
                              alert(`${planCases.length} cases exist for this plan.\n\nGo to Case Management to view and manage them.`);
                            }}
                          >
                            View Cases
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Mapping Modal */}
      {mappingModal && mappingResults && (
        <Modal
          open={mappingModal}
          onClose={() => setMappingModal(false)}
          title="Risk Engine Mapping Results"
          size="xl"
          footer={
            <div className="flex justify-between w-full">
              <Button variant="secondary" onClick={() => setMappingModal(false)}>
                Cancel
              </Button>
              <Button variant="success" icon={CheckCircle} onClick={handleGenerateCases}>
                Generate {mappingResults.totalMapped} Cases
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Alert type="success" title={`Successfully mapped ${mappingResults.totalMapped} taxpayers`}>
              The risk engine has selected the highest-risk taxpayers for each audit type based on risk scores and sector analysis.
            </Alert>

            {/* Summary by Region */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Mapping Summary</p>
              {REGIONS.map(region => {
                const regionSummary = mappingResults.summary[region.id] || {};
                const regionTotal = Object.values(regionSummary).reduce((sum, tcSummary) => {
                  return sum + Object.values(tcSummary).reduce((s, v) => s + v, 0);
                }, 0);

                if (regionTotal === 0) return null;

                return (
                  <div key={region.id} className="mb-4">
                    <p className="text-sm font-medium text-gray-800 mb-2">
                      {region.name} — {regionTotal} taxpayers
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 dark:bg-slate-700">
                      {Object.entries(regionSummary).map(([tcId, tcSummary]) => {
                        const tcTotal = Object.values(tcSummary).reduce((s, v) => s + v, 0);
                        if (tcTotal === 0) return null;

                        const tc = getTaxCentersForRegion(region.id).find(t => t.id === tcId);
                        
                        return (
                          <div key={tcId} className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 dark:text-slate-400">{tc?.shortName || tcId}:</span>
                            <div className="flex gap-2">
                              {AUDIT_TYPES.map(at => {
                                const count = tcSummary[at.id] || 0;
                                if (count === 0) return null;
                                return (
                                  <Badge key={at.id} color={at.color} size="sm">
                                    {at.shortName}: {count}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Risk Distribution of Mapped Taxpayers */}
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">Risk Distribution</p>
              <div className="grid grid-cols-4 gap-3">
                {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(level => {
                  const count = mappingResults.mappedCases.filter(mc => mc.riskLevel === level).length;
                  const colors = { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'blue' };
                  return (
                    <div key={level} className="text-center">
                      <Badge color={colors[level]} dot>{level}</Badge>
                      <p className="text-lg font-bold text-gray-900 mt-1">{count}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* NEW: Create Cases from Selection Modal */}
      {showCreateCasesModal && (
        <Modal
          open={showCreateCasesModal}
          onClose={() => setShowCreateCasesModal(false)}
          title="Create Cases from Selected Taxpayers"
          size="xl"
          footer={
            <div className="flex justify-between w-full">
              <Button variant="secondary" onClick={() => setShowCreateCasesModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="success" 
                icon={CheckCircle} 
                onClick={handleCreateCasesFromSelection}
                disabled={!selectedPlanForCases}
              >
                Create {selectedTaxpayers.length} Cases
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Alert type="info" title="Select plan and review taxpayers">
              {selectedTaxpayers.length} taxpayer{selectedTaxpayers.length > 1 ? 's' : ''} selected. Choose which plan to link these cases to, then review and customize audit types.
            </Alert>

            {/* Plan Selection */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <label className="block text-sm font-semibold text-blue-900 mb-2">
                Select Plan to Link Cases *
              </label>
              <select
                value={selectedPlanForCases || ''}
                onChange={(e) => setSelectedPlanForCases(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800"
              >
                <option value="">-- Select a Plan --</option>
                {availablePlansForCaseCreation.map(plan => {
                  const tcAlloc = plan.regionalFeedback?.[userRegion]?.taxCenterAllocations?.[userTaxCenter] || {};
                  const allocatedCases = Object.values(tcAlloc).reduce((s, v) => s + v, 0);
                  
                  return (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - FY {plan.year} ({allocatedCases} cases allocated)
                    </option>
                  );
                })}
              </select>
              
              {selectedPlanForCases && (
                <div className="mt-3 text-xs text-blue-700">
                  <p className="font-semibold">✓ Selected Plan:</p>
                  <p className="mt-1">
                    {state.plans.find(p => p.id === selectedPlanForCases)?.name}
                  </p>
                  <p className="text-blue-600 mt-1">
                    ⚠️ Note: You can only create cases once per plan. After creation, this plan cannot be used again.
                  </p>
                </div>
              )}
              
              {availablePlansForCaseCreation.length === 0 && (
                <div className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <strong>⚠️ No available plans</strong>
                  <p className="mt-1 text-xs">All deployed plans already have cases. Wait for a new plan to be deployed.</p>
                </div>
              )}
            </div>

            {/* List of selected taxpayers with audit type selection */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 dark:bg-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200">Taxpayer</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Risk</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Suggested</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200">Audit Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedTaxpayers.map(tpId => {
                    const tp = taxpayers.find(t => t.id === tpId);
                    if (!tp) return null;

                    const riskColors = { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'blue' };

                    return (
                      <tr key={tpId} className="hover:bg-blue-50 dark:hover:bg-slate-600">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{tp.name}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">{tp.sector} • {tp.tin}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge color={riskColors[tp.riskLevel]} dot size="sm">
                            {tp.riskLevel}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge color={AUDIT_TYPES.find(at => at.id === tp.suggestedAuditType)?.color || 'gray'} size="sm">
                            {AUDIT_TYPES.find(at => at.id === tp.suggestedAuditType)?.shortName || 'N/A'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={selectedAuditTypes[tpId] || tp.suggestedAuditType}
                            onChange={(e) => handleAuditTypeChange(tpId, e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            {AUDIT_TYPES.map(at => (
                              <option key={at.id} value={at.id}>
                                {at.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm font-semibold text-green-900 mb-2">📊 Case Creation Summary</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-green-700">Total Cases:</p>
                  <p className="text-xl font-bold text-green-900">{selectedTaxpayers.length}</p>
                </div>
                <div>
                  <p className="text-green-700">Tax Center:</p>
                  <p className="text-lg font-semibold text-green-900">{userTaxCenter?.replace(/-/g, ' ').toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-green-700">Linked to Plan:</p>
                  <p className="text-sm font-semibold text-green-900">
                    {selectedPlanForCases ? '✓ Selected' : '⚠️ Required'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
