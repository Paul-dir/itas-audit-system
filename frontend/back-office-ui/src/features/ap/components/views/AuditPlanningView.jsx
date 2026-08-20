import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import Button from '../Button';
import CreateAnnualPlanModal from '../modals/CreateAnnualPlanModal';
import ConfigurationManagementView from './ConfigurationManagementView';
import ConfigurationView from './ConfigurationView';
import RiskEngineView from './RiskEngineView';
import { useData } from '../../services/dataService';
import { submitPlanToDirector, getStatusDisplay, getBadgeClass } from '../../utils/businessLogic';
import { auditConfig } from '../../config/auditConfig';

/**
 * AuditPlanningView - Modern Enterprise Audit Planning Interface
 * 
 * Features:
 * - Dashboard with KPI metrics and status overview
 * - Create Annual Audit Plan workflow
 * - Plan details and MOR analysis
 * - Regional breakdown visualization
 * - Modern dark theme with semantic colors
 * - Responsive design for all screen sizes
 * - Professional typography and spacing
 */

function AuditPlanningView({ currentView }) {
  const [plans, setPlans] = useState([]);
  const { data, updateData, refreshData } = useData();
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [detailView, setDetailView] = useState(null);
  const taxpayerPool = data?.config?.taxpayerCategories || [];

  const loadPlans = () => {
    // Using data from hook
    setPlans(data.plans || []);
  };

  // Helper function to map status to badge variant
  const getBadgeVariant = (status) => {
    switch(status) {
      case 'DRAFT':
        return 'draft';
      case 'SUBMITTED_TO_DIRECTOR':
        return 'submitted';
      case 'DIRECTOR_APPROVED':
        return 'approved';
      case 'REVISION_REQUESTED':
        return 'warning';
      case 'FINALIZED':
        return 'success';
      default:
        return 'info';
    }
  };

  useEffect(() => {
    loadPlans();
  }, [data.plans]);

  // Handle sidebar navigation
  useEffect(() => {
    if (currentView === 'create-plan') {
      setSelectedPlan(null);
      setShowModal(true);
    } else if (currentView === 'my-plans' || currentView === 'plans') {
      setDetailView(null);
      setSelectedPlan(null);
    } else if (currentView === 'revisions') {
      setDetailView(null);
      setSelectedPlan(null);
    } else if (currentView === 'dashboard') {
      setDetailView(null);
      setSelectedPlan(null);
    } else if (currentView === 'risk-engine') {
      setDetailView(null);
      setSelectedPlan(null);
    }
  }, [currentView]);

  const handleSubmitToDirector = (planId) => {
    if (window.confirm('Submit this plan to Director for review?')) {
      if (submitPlanToDirector(planId)) {
        alert('Plan submitted successfully!');
        refreshData();
      } else {
        alert('Cannot submit. Plan must be in DRAFT or REVISION_REQUESTED status.');
      }
    }
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleViewDetails = (plan) => {
    setSelectedPlan(plan);
    setDetailView('details');
  };

  const handleViewMORAnalysis = (plan) => {
    setSelectedPlan(plan);
    setDetailView('mor-analysis');
  };

  const handleViewRegionalBreakdown = (plan) => {
    setSelectedPlan(plan);
    setDetailView('regional-breakdown');
  };

  const stats = {
    draft: plans.filter(p => p.status === 'DRAFT').length,
    submitted: plans.filter(p => p.status === 'SUBMITTED_TO_DIRECTOR').length,
    approved: plans.filter(p => p.status === 'DIRECTOR_APPROVED').length,
    inRevision: plans.filter(p => p.status === 'REVISION_REQUESTED').length,
    finalized: plans.filter(p => p.status === 'FINALIZED').length,
    totalVolume: plans.reduce((sum, p) => sum + (p.totalVolume || 0), 0),
    totalEffort: plans.reduce((sum, p) => sum + (p.totalEffortHours || 0), 0)
  };

  // Render MOR Analysis View with Modern Design
  const renderMORAnalysis = () => {
    if (!selectedPlan) return null;

    const morData = {
      totalCases: selectedPlan.totalVolume,
      totalEffort: selectedPlan.totalEffortHours,
      coverageRate: ((selectedPlan.totalVolume / taxpayerPool.total) * 100).toFixed(2),
      regions: selectedPlan.locations?.length || 0
    };

    const auditTypeAggregation = {};
    selectedPlan.locations?.forEach(loc => {
      auditConfig.auditTypes.forEach((type, i) => {
        if (!auditTypeAggregation[i]) {
          auditTypeAggregation[i] = { count: 0, effort: 0, name: type.name };
        }
        auditTypeAggregation[i].count += loc[`type_${i}`] || 0;
        auditTypeAggregation[i].effort += (loc[`type_${i}`] || 0) * type.effortPerCase;
      });
    });

    return (
      <div className="bg-neutral-900 min-h-screen">
        {/* Header */}
        <div className="bg-neutral-800 border-b border-neutral-700 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="tertiary" 
                onClick={() => setDetailView(null)}
              >
                <i className="fas fa-arrow-left"></i>
              </Button>
              <div>
                <h1 className="text-3xl font-serif font-bold text-neutral-50">
                  <i className="fas fa-building mr-3"></i>National Audit Allocation Analysis
                </h1>
                <p className="text-neutral-400 text-sm mt-1">Ministry of Revenue (MOR) Planning</p>
              </div>
            </div>
            <Badge status={`${selectedPlan.id} (v${selectedPlan.version})`} variant="approved" size="lg" />
          </div>
        </div>

        <div className="p-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <Card title="Total Taxpayers" number={taxpayerPool.total.toLocaleString()} icon="fas fa-users" accent="info" />
            <Card title="Planned Audits" number={morData.totalCases.toLocaleString()} icon="fas fa-clipboard-check" accent="primary" />
            <Card title="Coverage Rate" number={`${morData.coverageRate}%`} icon="fas fa-percentage" accent="success" />
            <Card title="Total Effort" number={`${morData.totalEffort.toLocaleString()}h`} icon="fas fa-clock" accent="warning" />
            <Card title="Regions Covered" number={morData.regions} icon="fas fa-map-marked-alt" accent="info" />
            <Card title="Fiscal Year" number={selectedPlan.fiscalYear} icon="fas fa-calendar-alt" accent="primary" />
          </div>

          {/* Audit Distribution Table */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-primary-600 rounded-sm"></div>
              <h2 className="text-xl font-semibold text-neutral-50">National Audit Distribution by Type</h2>
            </div>
            <div className="card rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-neutral-800 border-b border-neutral-700">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300 uppercase tracking-wider">Audit Type</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-300 uppercase tracking-wider">Total Cases</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-300 uppercase tracking-wider">% of Total</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-300 uppercase tracking-wider">Total Effort (hrs)</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-300 uppercase tracking-wider">% of Effort</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-300 uppercase tracking-wider">Avg Effort/Case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-700">
                    {auditConfig.auditTypes.map((type, i) => (
                      <tr key={`type_${i}`} className="hover:bg-neutral-700/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-neutral-50">{type.name}</td>
                        <td className="px-6 py-4 text-sm text-right text-neutral-300">{auditTypeAggregation[i]?.count || 0}</td>
                        <td className="px-6 py-4 text-sm text-right text-neutral-400">
                          {morData.totalCases > 0 ? ((auditTypeAggregation[i]?.count / morData.totalCases) * 100).toFixed(1) : 0}%
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-neutral-300">{auditTypeAggregation[i]?.effort.toLocaleString() || 0}</td>
                        <td className="px-6 py-4 text-sm text-right text-neutral-400">
                          {morData.totalEffort > 0 ? ((auditTypeAggregation[i]?.effort / morData.totalEffort) * 100).toFixed(1) : 0}%
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-neutral-300 font-medium">{type.effortPerCase}h</td>
                      </tr>
                    ))}
                    <tr className="bg-primary-900/20 border-t-2 border-primary-600 font-semibold">
                      <td className="px-6 py-4 text-sm text-primary-300">TOTAL (MOR)</td>
                      <td className="px-6 py-4 text-sm text-right text-primary-300">{morData.totalCases}</td>
                      <td className="px-6 py-4 text-sm text-right text-primary-300">100%</td>
                      <td className="px-6 py-4 text-sm text-right text-primary-300">{morData.totalEffort.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-right text-primary-300">100%</td>
                      <td className="px-6 py-4 text-sm text-right text-primary-300">
                        {morData.totalCases > 0 ? Math.round(morData.totalEffort / morData.totalCases) : 0}h
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Regional Allocation Table */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-success-600 rounded-sm"></div>
              <h2 className="text-xl font-semibold text-neutral-50">Regional Allocation Overview</h2>
            </div>
            <div className="card rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-800 border-b border-neutral-700">
                      <th className="px-6 py-4 text-left font-semibold text-neutral-300 uppercase tracking-wider">Region</th>
                      <th className="px-6 py-4 text-right font-semibold text-neutral-300 uppercase tracking-wider">Taxpayer Base</th>
                      <th className="px-6 py-4 text-right font-semibold text-neutral-300 uppercase tracking-wider">Allocated Cases</th>
                      <th className="px-6 py-4 text-right font-semibold text-neutral-300 uppercase tracking-wider">Coverage %</th>
                      <th className="px-6 py-4 text-right font-semibold text-neutral-300 uppercase tracking-wider">Total Effort (hrs)</th>
                      <th className="px-6 py-4 text-right font-semibold text-neutral-300 uppercase tracking-wider">% of National Effort</th>
                      <th className="px-6 py-4 text-left font-semibold text-neutral-300 uppercase tracking-wider">Available Skills</th>
                      <th className="px-6 py-4 text-left font-semibold text-neutral-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-700">
                    {selectedPlan.locations?.map(loc => (
                      <tr key={loc.name} className="hover:bg-neutral-700/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-neutral-50">{loc.name}</td>
                        <td className="px-6 py-4 text-right text-neutral-300">{loc.taxpayers?.toLocaleString() || 'N/A'}</td>
                        <td className="px-6 py-4 text-right text-neutral-300 font-medium">{loc.cases}</td>
                        <td className="px-6 py-4 text-right text-neutral-400">
                          {loc.taxpayers > 0 ? ((loc.cases / loc.taxpayers) * 100).toFixed(2) : 0}%
                        </td>
                        <td className="px-6 py-4 text-right text-neutral-300">{loc.totalEffort?.toLocaleString() || 0}</td>
                        <td className="px-6 py-4 text-right text-neutral-400">
                          {morData.totalEffort > 0 ? ((loc.totalEffort / morData.totalEffort) * 100).toFixed(1) : 0}%
                        </td>
                        <td className="px-6 py-4 text-neutral-300">{loc.availableSkills}</td>
                        <td className="px-6 py-4">
                          <Badge 
                            status={loc.capacityStatus} 
                            variant={loc.capacityStatus === 'Sufficient' ? 'approved' : 'danger'}
                            size="sm"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Strategy Section */}
          {selectedPlan.tactics && (
            <div className="bg-primary-900/20 border border-primary-600/50 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <i className="fas fa-bullseye text-primary-400 text-lg mt-1"></i>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-50 mb-2">National Audit Strategy</h3>
                  <p className="text-neutral-300 leading-relaxed">{selectedPlan.tactics}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-between">
            <Button 
              variant="tertiary" 
              onClick={() => setDetailView(null)}
            >
              <i className="fas fa-arrow-left mr-2"></i>Back to Plans
            </Button>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                onClick={() => handleViewRegionalBreakdown(selectedPlan)}
              >
                <i className="fas fa-map mr-2"></i>Regional Breakdown
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Regional Breakdown View
  const renderRegionalBreakdown = () => {
    if (!selectedPlan) return null;

    return (
      <div>
        <div className="action-bar">
          <button className="btn btn-outline" onClick={() => setDetailView(null)}>
            <i className="fas fa-arrow-left"></i> Back to Plans
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary" onClick={() => handleViewMORAnalysis(selectedPlan)}>
              <i className="fas fa-building"></i> MOR Analysis
            </button>
            <button className="btn btn-info" onClick={() => handleViewDetails(selectedPlan)}>
              <i className="fas fa-file-alt"></i> Plan Details
            </button>
          </div>
        </div>

        <div className="detail-header">
          <h2><i className="fas fa-map-marked-alt"></i> Detailed Regional Breakdown</h2>
          <Badge status={`${selectedPlan.id} (v${selectedPlan.version})`} className="director-approved" />
        </div>

        {selectedPlan.locations?.map(loc => {
          const coverageRate = loc.taxpayers > 0 ? ((loc.cases / loc.taxpayers) * 100).toFixed(2) : 0;
          const avgEffortPerCase = loc.cases > 0 ? Math.round(loc.totalEffort / loc.cases) : 0;
          
          return (
            <div key={loc.name} style={{ marginBottom: '32px' }}>
              <div className="section-title">
                <i className="fas fa-map-pin"></i> {loc.name} Region
              </div>
              
              <div className="cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                <Card title="Taxpayer Base" number={loc.taxpayers?.toLocaleString()} icon="fas fa-users" />
                <Card title="Total Cases" number={loc.cases} icon="fas fa-clipboard-list" />
                <Card title="Coverage Rate" number={`${coverageRate}%`} icon="fas fa-percentage" />
                <Card title="Total Effort" number={`${loc.totalEffort}h`} icon="fas fa-clock" />
                <Card title="Avg Effort" number={`${avgEffortPerCase}h/case`} icon="fas fa-chart-bar" />
                <Card title="Available Skills" number={loc.availableSkills} icon="fas fa-users-cog" />
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Audit Type</th>
                      <th>Cases</th>
                      <th>% of Region</th>
                      <th>Effort/Case</th>
                      <th>Total Effort</th>
                      <th>% of Region Effort</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Desk Audit</strong></td>
                      <td>{loc.desk}</td>
                      <td>{loc.cases > 0 ? ((loc.desk / loc.cases) * 100).toFixed(1) : 0}%</td>
                      <td>40h</td>
                      <td>{loc.desk * 40}h</td>
                      <td>{loc.totalEffort > 0 ? (((loc.desk * 40) / loc.totalEffort) * 100).toFixed(1) : 0}%</td>
                    </tr>
                    <tr>
                      <td><strong>Field Audit</strong></td>
                      <td>{loc.field}</td>
                      <td>{loc.cases > 0 ? ((loc.field / loc.cases) * 100).toFixed(1) : 0}%</td>
                      <td>120h</td>
                      <td>{loc.field * 120}h</td>
                      <td>{loc.totalEffort > 0 ? (((loc.field * 120) / loc.totalEffort) * 100).toFixed(1) : 0}%</td>
                    </tr>
                    <tr>
                      <td><strong>Joint Audit</strong></td>
                      <td>{loc.joint}</td>
                      <td>{loc.cases > 0 ? ((loc.joint / loc.cases) * 100).toFixed(1) : 0}%</td>
                      <td>160h</td>
                      <td>{loc.joint * 160}h</td>
                      <td>{loc.totalEffort > 0 ? (((loc.joint * 160) / loc.totalEffort) * 100).toFixed(1) : 0}%</td>
                    </tr>
                    <tr>
                      <td><strong>Transfer Pricing</strong></td>
                      <td>{loc.tp}</td>
                      <td>{loc.cases > 0 ? ((loc.tp / loc.cases) * 100).toFixed(1) : 0}%</td>
                      <td>80h</td>
                      <td>{loc.tp * 80}h</td>
                      <td>{loc.totalEffort > 0 ? (((loc.tp * 80) / loc.totalEffort) * 100).toFixed(1) : 0}%</td>
                    </tr>
                    <tr>
                      <td><strong>Comprehensive</strong></td>
                      <td>{loc.comprehensive}</td>
                      <td>{loc.cases > 0 ? ((loc.comprehensive / loc.cases) * 100).toFixed(1) : 0}%</td>
                      <td>200h</td>
                      <td>{loc.comprehensive * 200}h</td>
                      <td>{loc.totalEffort > 0 ? (((loc.comprehensive * 200) / loc.totalEffort) * 100).toFixed(1) : 0}%</td>
                    </tr>
                    <tr style={{ background: '#f8f9fc', color: '#0c4a6e', fontWeight: 'bold' }}>
                      <td>{loc.name} TOTAL</td>
                      <td>{loc.cases}</td>
                      <td>100%</td>
                      <td>-</td>
                      <td>{loc.totalEffort}h</td>
                      <td>100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ background: loc.capacityStatus === 'Sufficient' ? '#1a3a1a' : '#3a1a1a', padding: '12px', borderRadius: '8px', marginTop: '12px' }}>
                <strong>
                  <i className={`fas ${loc.capacityStatus === 'Sufficient' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i> 
                  {' '}Capacity Status: {loc.capacityStatus}
                </strong>
                <p style={{ color: '#0c4a6e', margin: '8px 0 0 0', fontSize: '14px' }}>
                  Available Skills: {loc.availableSkills} | Required: {Math.ceil(loc.totalEffort / 2000)} | 
                  {loc.capacityStatus === 'Sufficient' ? ' Capacity is adequate for planned audits.' : ' Additional resources may be needed.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render Plan Details View
  const renderPlanDetails = () => {
    if (!selectedPlan) return null;
    return (
      <PlanDetailsView 
        plan={selectedPlan}
        onBack={() => setDetailView(null)}
      />
    );
  };

  // Render Actions based on plan status
  const renderActions = (plan) => {
    if (plan.status === 'DRAFT' || plan.status === 'REVISION_REQUESTED') {
      return (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button className="btn btn-sm btn-info" onClick={() => handleViewMORAnalysis(plan)}>
            <i className="fas fa-chart-pie"></i> MOR Analysis
          </button>
          <button className="btn btn-sm btn-warning" onClick={() => handleEditPlan(plan)}>
            <i className="fas fa-edit"></i> Edit
          </button>
          <button className="btn btn-sm btn-primary" onClick={() => handleSubmitToDirector(plan.id)}>
            <i className="fas fa-paper-plane"></i> Submit
          </button>
        </div>
      );
    } else {
      return (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button className="btn btn-sm btn-info" onClick={() => handleViewMORAnalysis(plan)}>
            <i className="fas fa-chart-pie"></i> MOR Analysis
          </button>
          <Badge status={getStatusDisplay(plan.status)} className={getBadgeClass(plan.status)} />
        </div>
      );
    }
  };

  // Main Dashboard View - Filter based on currentView
  const renderDashboard = () => {
    let displayPlans = plans;
    
    // Filter based on current view
    if (currentView === 'revisions') {
      displayPlans = plans.filter(p => p.status === 'REVISION_REQUESTED');
    } else if (currentView === 'my-plans') {
      displayPlans = plans.filter(p => ['DRAFT', 'REVISION_REQUESTED', 'SUBMITTED_TO_DIRECTOR'].includes(p.status));
    }

    return (
      <div className="space-y-6 p-8 bg-neutral-900 min-h-screen">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-primary-600 rounded-sm"></div>
            <h1 className="text-3xl font-serif font-bold text-neutral-50">Audit Planning Workspace</h1>
          </div>
          <p className="text-neutral-400 text-sm">Annual audit cycle — regional allocation and feedback tracking</p>
        </div>

        {/* KPI Cards - Same pattern as dashboard */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-7">
          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-primary-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2 break-words line-clamp-2">Draft Plans</h3>
            <div className="text-2xl font-bold leading-tight mb-2 text-neutral-50 break-words line-clamp-2">{stats.draft}</div>
            <div className="text-lg text-neutral-400 opacity-75"><i className="fas fa-file-alt"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-info-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2 break-words line-clamp-2">Under Review</h3>
            <div className="text-2xl font-bold leading-tight mb-2 text-neutral-50 break-words line-clamp-2">{stats.submitted}</div>
            <div className="text-lg text-neutral-400 opacity-75"><i className="fas fa-hourglass-half"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-success-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2 break-words line-clamp-2">Approved</h3>
            <div className="text-2xl font-bold leading-tight mb-2 text-neutral-50 break-words line-clamp-2">{stats.approved}</div>
            <div className="text-lg text-neutral-400 opacity-75"><i className="fas fa-check-circle"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-warning-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2 break-words line-clamp-2">In Revision</h3>
            <div className="text-2xl font-bold leading-tight mb-2 text-neutral-50 break-words line-clamp-2">{stats.inRevision}</div>
            <div className="text-lg text-neutral-400 opacity-75"><i className="fas fa-redo"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-success-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2 break-words line-clamp-2">Finalized</h3>
            <div className="text-2xl font-bold leading-tight mb-2 text-neutral-50 break-words line-clamp-2">{stats.finalized}</div>
            <div className="text-lg text-neutral-400 opacity-75"><i className="fas fa-flag-checkered"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-info-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2 break-words line-clamp-2">Total Cases</h3>
            <div className="text-2xl font-bold leading-tight mb-2 text-neutral-50 break-words line-clamp-2">{(stats.totalVolume || 0).toLocaleString()}</div>
            <div className="text-lg text-neutral-400 opacity-75"><i className="fas fa-calculator"></i></div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 border-l-4 border-l-warning-600 rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-neutral-400 mb-2 break-words line-clamp-2">Total Effort</h3>
            <div className="text-2xl font-bold leading-tight mb-2 text-neutral-50 break-words line-clamp-2">{(stats.totalEffort || 0).toLocaleString()}h</div>
            <div className="text-lg text-neutral-400 opacity-75"><i className="fas fa-clock"></i></div>
          </div>
        </div>

        {/* Section Header */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary-600 rounded-sm"></div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-neutral-50">
                  {currentView === 'revisions' ? 'Plans in Revision' : 'Audit Plans'}
                </h2>
                <p className="text-neutral-400 text-sm mt-1">{displayPlans.length} plan{displayPlans.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => {setSelectedPlan(null); setShowModal(true);}}
            >
              <i className="fas fa-plus-circle mr-2"></i>
              Create New Plan
            </Button>
          </div>
        </div>

        {/* Plans Table */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-800 border-b border-neutral-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Plan ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Version</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Fiscal Year</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Total Cases</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Effort (hrs)</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {displayPlans.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <i className="fas fa-inbox text-4xl text-neutral-600 mb-4"></i>
                        <p className="text-neutral-400 text-lg">
                          {currentView === 'revisions' ? 'No plans in revision.' : 'No audit plans yet. Create your first plan to get started.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayPlans.map(plan => (
                    <tr 
                      key={plan.id}
                      className="hover:bg-neutral-700/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm font-mono font-semibold text-neutral-50">{plan.id}</td>
                      <td className="px-6 py-4 text-sm text-neutral-400">v{plan.version}</td>
                      <td className="px-6 py-4 text-sm font-medium text-neutral-300">{plan.fiscalYear}</td>
                      <td className="px-6 py-4 text-sm text-neutral-400">{plan.startDate} to {plan.endDate}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-neutral-50">{(plan.totalVolume || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-neutral-400">{(plan.totalEffortHours || 0).toLocaleString()}h</td>
                      <td className="px-6 py-4">
                        <Badge 
                          status={getStatusDisplay(plan.status)} 
                          variant={getBadgeVariant(plan.status)}
                          size="sm"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleViewMORAnalysis(plan)}
                          >
                            <i className="fas fa-chart-pie"></i>
                          </Button>
                          {(plan.status === 'DRAFT' || plan.status === 'REVISION_REQUESTED') && (
                            <>
                              <Button 
                                variant="tertiary" 
                                size="sm"
                                onClick={() => handleEditPlan(plan)}
                              >
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button 
                                variant="primary" 
                                size="sm"
                                onClick={() => handleSubmitToDirector(plan.id)}
                              >
                                <i className="fas fa-paper-plane"></i>
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <CreateAnnualPlanModal 
            onClose={() => { 
              setShowModal(false); 
              setSelectedPlan(null);
              loadPlans(); 
            }} 
          />
        )}
      </div>
    );
  };

  // Determine what to render
  if (detailView === 'mor-analysis') {
    return renderMORAnalysis();
  }

  if (detailView === 'regional-breakdown') {
    return renderRegionalBreakdown();
  }

  if (currentView === 'configuration') {
    return <ConfigurationManagementView />;
  }

  if (currentView === 'risk-engine') {
    return <RiskEngineView userRole="audit_team" />;
  }

  if (detailView === 'details') {
    return renderPlanDetails();
  }

  return renderDashboard();
}

export default AuditPlanningView;
