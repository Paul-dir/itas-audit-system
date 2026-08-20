/**
 * Dynamic Audit Plan Component
 * Creates audit plans based on configurable parameters
 * - Allocates cases by audit type based on configuration
 * - Calculates effort hours
 * - Considers available capacity
 * - Shows all allocated plans (past, current, future)
 * - Allows filtering and viewing
 */

import React, { useState, useEffect } from 'react';
import { auditConfig } from '../config/auditConfig';
import Card from './Card';

function DynamicAuditPlan() {
  const [allPlans, setAllPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    fiscalYear: new Date().getFullYear(),
    region: '',
    status: 'draft'
  });
  const [planDetails, setPlanDetails] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Load plans from localStorage
  useEffect(() => {
    const savedPlans = localStorage.getItem('auditPlans');
    if (savedPlans) {
      setAllPlans(JSON.parse(savedPlans));
    }
  }, []);

  // Filter plans based on tab and region
  useEffect(() => {
    let filtered = allPlans;

    // Filter by region
    if (selectedRegion) {
      filtered = filtered.filter(plan => plan.region === selectedRegion);
    }

    // Filter by status
    if (activeTab === 'active') {
      filtered = filtered.filter(plan => plan.status === 'approved' || plan.status === 'in_progress');
    } else if (activeTab === 'draft') {
      filtered = filtered.filter(plan => plan.status === 'draft');
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(plan => plan.status === 'completed' || plan.status === 'closed');
    }

    setFilteredPlans(filtered);
  }, [allPlans, activeTab, selectedRegion]);

  // Show success message
  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Create new plan
  const handleCreatePlan = () => {
    if (!newPlan.name || !newPlan.region) {
      alert('Please fill in all required fields');
      return;
    }

    const plan = {
      id: `PLAN-${Date.now()}`,
      ...newPlan,
      createdAt: new Date().toISOString(),
      cases: allocateCasesForPlan(newPlan.region),
      totalEffort: 0,
      status: 'draft',
      version: 1,
      allocations: []
    };

    // Calculate total effort
    plan.totalEffort = plan.cases.reduce((sum, c) => sum + c.effort, 0);

    const updated = [plan, ...allPlans];
    setAllPlans(updated);
    localStorage.setItem('auditPlans', JSON.stringify(updated));

    setNewPlan({ name: '', fiscalYear: new Date().getFullYear(), region: '', status: 'draft' });
    setShowNewPlanForm(false);
    showSuccess('Audit plan created successfully!');
  };

  // Allocate cases based on configuration
  const allocateCasesForPlan = (region) => {
    const regionConfig = auditConfig.regions.find(r => r.id === region || r.name === region);
    if (!regionConfig) return [];

    const auditTypes = auditConfig.auditTypes;
    const allocation = [];

    // Calculate total cases to allocate
    const totalTaxpayers = regionConfig.taxpayers;
    const totalCases = Math.round(totalTaxpayers * 0.05); // 5% of taxpayers

    // Allocate by audit type distribution
    auditTypes.forEach(type => {
      const distribution = auditConfig.riskDistribution.byAuditType[type.id] || 0;
      const casesForType = Math.round(totalCases * distribution);

      if (casesForType > 0) {
        allocation.push({
          id: `CASE-${Date.now()}-${type.id}`,
          auditType: type.name,
          auditTypeId: type.id,
          count: casesForType,
          effort: casesForType * type.effortPerCase,
          skillsRequired: type.skillsRequired,
          complexity: type.complexity,
          status: 'pending_allocation'
        });
      }
    });

    return allocation;
  };

  // Update plan status
  const updatePlanStatus = (planId, newStatus) => {
    const updated = allPlans.map(plan => {
      if (plan.id === planId) {
        return { ...plan, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return plan;
    });

    setAllPlans(updated);
    localStorage.setItem('auditPlans', JSON.stringify(updated));
    showSuccess(`Plan status updated to ${newStatus}`);
  };

  // Delete plan
  const handleDeletePlan = (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    const updated = allPlans.filter(plan => plan.id !== planId);
    setAllPlans(updated);
    localStorage.setItem('auditPlans', JSON.stringify(updated));
    showSuccess('Plan deleted successfully');
  };

  // Get region name
  const getRegionName = (regionId) => {
    const region = auditConfig.regions.find(r => r.id === regionId || r.name === regionId);
    return region ? region.name : regionId;
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      draft: '#8b949e',
      in_progress: '#1f6feb',
      approved: '#238636',
      completed: '#238636',
      closed: '#6e40aa',
      rejected: '#da3633'
    };
    return colors[status] || '#8b949e';
  };

  return (
    <Card>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ margin: 0, color: '#f0f6fc' }}>
            <i className="fas fa-calendar-alt"></i> Audit Plans ({filteredPlans.length})
          </h1>
          <button
            onClick={() => setShowNewPlanForm(!showNewPlanForm)}
            style={{
              padding: '8px 16px',
              background: '#238636',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px'
            }}
          >
            <i className="fas fa-plus"></i> New Plan
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div style={{
            padding: '12px',
            background: '#238636',
            color: '#fff',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '13px'
          }}>
            ✓ {successMessage}
          </div>
        )}

        {/* New Plan Form */}
        {showNewPlanForm && (
          <div style={{
            padding: '20px',
            background: '#0f1419',
            border: '1px solid #30363d',
            borderRadius: '6px',
            marginBottom: '24px'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#f0f6fc' }}>Create New Audit Plan</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#f0f6fc' }}>Plan Name</label>
                <input
                  type="text"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  placeholder="e.g., Annual Audit Plan 2025"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #30363d',
                    borderRadius: '4px',
                    background: '#1c2128',
                    color: '#f0f6fc',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#f0f6fc' }}>Fiscal Year</label>
                <input
                  type="number"
                  value={newPlan.fiscalYear}
                  onChange={(e) => setNewPlan({ ...newPlan, fiscalYear: parseInt(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #30363d',
                    borderRadius: '4px',
                    background: '#1c2128',
                    color: '#f0f6fc',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#f0f6fc' }}>Region</label>
                <select
                  value={newPlan.region}
                  onChange={(e) => setNewPlan({ ...newPlan, region: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #30363d',
                    borderRadius: '4px',
                    background: '#1c2128',
                    color: '#f0f6fc',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select Region</option>
                  {auditConfig.regions.map(region => (
                    <option key={region.id} value={region.id}>{region.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleCreatePlan}
                style={{
                  padding: '10px 20px',
                  background: '#238636',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Create Plan
              </button>
              <button
                onClick={() => setShowNewPlanForm(false)}
                style={{
                  padding: '10px 20px',
                  background: '#30363d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'auto auto 1fr', gap: '12px', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Filter by Region:</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{
                padding: '6px 10px',
                border: '1px solid #30363d',
                borderRadius: '4px',
                background: '#1c2128',
                color: '#f0f6fc',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              <option value="">All Regions</option>
              {auditConfig.regions.map(region => (
                <option key={region.id} value={region.id}>{region.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid #30363d'
        }}>
          {['active', 'draft', 'completed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 16px',
                border: 'none',
                background: activeTab === tab ? '#238636' : 'transparent',
                color: activeTab === tab ? '#fff' : '#8b949e',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTab === tab ? '600' : '500',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({allPlans.filter(p => {
                if (tab === 'active') return p.status === 'approved' || p.status === 'in_progress';
                if (tab === 'draft') return p.status === 'draft';
                if (tab === 'completed') return p.status === 'completed' || p.status === 'closed';
                return false;
              }).length})
            </button>
          ))}
        </div>

        {/* Plans List */}
        <div style={{ display: 'grid', gap: '12px' }}>
          {filteredPlans.length === 0 ? (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              color: '#8b949e',
              background: '#0f1419',
              borderRadius: '6px',
              border: '1px solid #30363d'
            }}>
              No plans found
            </div>
          ) : (
            filteredPlans.map(plan => (
              <div
                key={plan.id}
                style={{
                  padding: '16px',
                  background: '#0f1419',
                  border: '1px solid #30363d',
                  borderRadius: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#f0f6fc', fontSize: '14px' }}>
                      {plan.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8b949e', marginTop: '4px' }}>
                      {plan.id} | FY {plan.fiscalYear} | {getRegionName(plan.region)}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    background: getStatusColor(plan.status),
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {plan.status.replace(/_/g, ' ').toUpperCase()}
                  </div>
                </div>

                {/* Plan Summary */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  marginBottom: '12px',
                  fontSize: '12px'
                }}>
                  <div>
                    <div style={{ color: '#8b949e' }}>Total Cases</div>
                    <div style={{ color: '#f0f6fc', fontWeight: '600' }}>
                      {plan.cases.reduce((sum, c) => sum + c.count, 0)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#8b949e' }}>Total Effort</div>
                    <div style={{ color: '#f0f6fc', fontWeight: '600' }}>
                      {plan.totalEffort} hrs
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#8b949e' }}>Created</div>
                    <div style={{ color: '#f0f6fc', fontWeight: '600' }}>
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#8b949e' }}>Version</div>
                    <div style={{ color: '#f0f6fc', fontWeight: '600' }}>
                      v{plan.version}
                    </div>
                  </div>
                </div>

                {/* Cases breakdown */}
                <div style={{
                  background: '#1c2128',
                  padding: '12px',
                  borderRadius: '4px',
                  marginBottom: '12px',
                  fontSize: '11px'
                }}>
                  <div style={{ fontWeight: '600', color: '#f0f6fc', marginBottom: '8px' }}>Cases by Type:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
                    {plan.cases.map((c, idx) => (
                      <div key={idx} style={{ color: '#8b949e' }}>
                        {c.auditType}: <strong style={{ color: '#f0f6fc' }}>{c.count}</strong> cases ({c.effort}h)
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {plan.status === 'draft' && (
                    <>
                      <button
                        onClick={() => updatePlanStatus(plan.id, 'in_progress')}
                        style={{
                          padding: '6px 12px',
                          background: '#238636',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                      >
                        Start
                      </button>
                      <button
                        onClick={() => updatePlanStatus(plan.id, 'approved')}
                        style={{
                          padding: '6px 12px',
                          background: '#1f6feb',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                      >
                        Approve
                      </button>
                    </>
                  )}
                  {(plan.status === 'approved' || plan.status === 'in_progress') && (
                    <button
                      onClick={() => updatePlanStatus(plan.id, 'completed')}
                      style={{
                        padding: '6px 12px',
                        background: '#238636',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#da3633',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}

export default DynamicAuditPlan;
