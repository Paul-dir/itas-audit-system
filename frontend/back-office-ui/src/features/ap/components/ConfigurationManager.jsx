import React, { useState, useEffect } from 'react';
import { auditConfig } from '../config/auditConfig';
import { deletePlan, deleteAllPlans, getStatusDisplay } from '../utils/businessLogic';
import Card from './Card';

function ConfigurationManager() {
  const [activeTab, setActiveTab] = useState('auditTypes');
  const [configurations, setConfigurations] = useState({
    auditTypes: [...auditConfig.auditTypes],
    skills: [...auditConfig.skills],
    regions: [...auditConfig.regions],
    riskLevels: { ...auditConfig.riskLevels },
    allocationRules: { ...auditConfig.allocationRules },
    validation: { ...auditConfig.validation },
    workflowApproval: { ...auditConfig.workflowApproval }
  });

  const [plans, setPlans] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [resetConfirmation, setResetConfirmation] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load plans from localStorage
  useEffect(() => {
    const data = localStorage.getItem('audit_planning_system_v2');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setPlans(parsed.plans || []);
      } catch (err) {
        console.error('Error loading plans:', err);
        setPlans([]);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('auditConfigurations', JSON.stringify(configurations));
  }, [configurations]);

  // Show success message
  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle delete plan
  const handleDeletePlan = (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) return;

    if (deletePlan(planId)) {
      const data = localStorage.getItem('audit_planning_system_v2');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          setPlans(parsed.plans || []);
          showSuccess('Plan deleted successfully!');
        } catch (err) {
          console.error('Error reloading plans:', err);
        }
      }
    }
  };

  // Handle delete all plans
  const handleDeleteAllPlans = () => {
    if (resetConfirmation !== 'RESET ALL PLANS') {
      alert('Please type "RESET ALL PLANS" to confirm deletion of all plans');
      return;
    }

    const count = deleteAllPlans();
    setPlans([]);
    setResetConfirmation('');
    setShowResetConfirm(false);
    showSuccess(`${count} plan(s) deleted successfully!`);
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({});
    setShowForm(true);
  };

  // Handle edit
  const handleEdit = (id, index) => {
    const item = configurations[activeTab][index];
    setEditingItem(id);
    setFormData({ ...item, _index: index });
    setShowForm(true);
  };

  // Handle save
  const handleSave = () => {
    const updatedConfig = { ...configurations[activeTab] };
    
    if (Array.isArray(updatedConfig)) {
      if (editingItem !== null && formData._index !== undefined) {
        updatedConfig[formData._index] = { ...formData };
        delete updatedConfig[formData._index]._index;
      } else {
        updatedConfig.push(formData);
      }
    } else {
      Object.assign(updatedConfig, formData);
    }

    setConfigurations({
      ...configurations,
      [activeTab]: updatedConfig
    });

    setShowForm(false);
    showSuccess(`Configuration ${editingItem ? 'updated' : 'added'} successfully!`);
  };

  // Handle delete
  const handleDelete = (index) => {
    if (!window.confirm('Are you sure you want to delete this configuration?')) return;

    const updatedConfig = [...configurations[activeTab]];
    updatedConfig.splice(index, 1);
    
    setConfigurations({
      ...configurations,
      [activeTab]: updatedConfig
    });

    showSuccess('Configuration deleted successfully!');
  };

  // Render audit types tab
  const renderAuditTypesTab = () => (
    <div style={{ display: 'grid', gap: '12px' }}>
      {configurations.auditTypes.map((type, idx) => (
        <div key={type.id} style={{
          padding: '16px',
          background: '#0f1419',
          border: '1px solid #30363d',
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontWeight: '600', color: '#f0f6fc' }}>{type.name}</div>
            <div style={{ fontSize: '12px', color: '#8b949e', marginTop: '4px' }}>
              Effort: {type.effortPerCase}h | Complexity: {type.complexity}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => handleEdit(type.id, idx)} style={{
              padding: '6px 12px',
              background: '#1f6feb',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}>Edit</button>
            <button onClick={() => handleDelete(idx)} style={{
              padding: '6px 12px',
              background: '#da3633',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );

  // Render skills tab
  const renderSkillsTab = () => (
    <div style={{ display: 'grid', gap: '12px' }}>
      {configurations.skills.map((skill, idx) => (
        <div key={skill.id} style={{
          padding: '16px',
          background: '#0f1419',
          border: '1px solid #30363d',
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontWeight: '600', color: '#f0f6fc' }}>{skill.name}</div>
            <div style={{ fontSize: '12px', color: '#8b949e', marginTop: '4px' }}>
              Level: {skill.level} | Category: {skill.category}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => handleEdit(skill.id, idx)} style={{
              padding: '6px 12px',
              background: '#1f6feb',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}>Edit</button>
            <button onClick={() => handleDelete(idx)} style={{
              padding: '6px 12px',
              background: '#da3633',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );

  // Render regions tab
  const renderRegionsTab = () => (
    <div style={{ display: 'grid', gap: '12px' }}>
      {configurations.regions.map((region, idx) => (
        <div key={region.id} style={{
          padding: '16px',
          background: '#0f1419',
          border: '1px solid #30363d',
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontWeight: '600', color: '#f0f6fc' }}>{region.name}</div>
            <div style={{ fontSize: '12px', color: '#8b949e', marginTop: '4px' }}>
              Taxpayers: {region.taxpayers} | Auditors: {region.availableAuditors} | Tax Centers: {region.taxCenters.length}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => handleEdit(region.id, idx)} style={{
              padding: '6px 12px',
              background: '#1f6feb',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}>Edit</button>
            <button onClick={() => handleDelete(idx)} style={{
              padding: '6px 12px',
              background: '#da3633',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );

  // Render allocation rules tab
  const renderAllocationRulesTab = () => (
    <div style={{
      padding: '20px',
      background: '#0f1419',
      border: '1px solid #30363d',
      borderRadius: '6px'
    }}>
      <div style={{ display: 'grid', gap: '16px' }}>
        {Object.entries(configurations.allocationRules).map(([key, value]) => (
          <div key={key}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#f0f6fc' }}>
              {key.replace(/_/g, ' ').toUpperCase()}
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={value}
              onChange={(e) => setConfigurations({
                ...configurations,
                allocationRules: {
                  ...configurations.allocationRules,
                  [key]: parseFloat(e.target.value)
                }
              })}
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
            <div style={{ fontSize: '11px', color: '#8b949e', marginTop: '4px' }}>
              {Math.round(value * 100)}% allocation weight
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setConfigurations({
          ...configurations,
          allocationRules: configurations.allocationRules
        })}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: '#238636',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        Save Changes
      </button>
    </div>
  );

  // Render plans tab
  const renderPlansTab = () => (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div>
        <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#f0f6fc' }}>
          <i className="fas fa-file-alt"></i> Plans Management ({plans.length} total)
        </h3>
        
        {plans.length === 0 ? (
          <div style={{
            padding: '24px',
            background: '#0f1419',
            border: '1px solid #30363d',
            borderRadius: '6px',
            textAlign: 'center',
            color: '#8b949e'
          }}>
            No plans found. Create your first plan to get started.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {plans.map((plan) => (
              <div key={plan.id} style={{
                padding: '16px',
                background: '#0f1419',
                border: '1px solid #30363d',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#f0f6fc', marginBottom: '4px' }}>
                    {plan.id} - {plan.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8b949e', display: 'grid', gap: '2px' }}>
                    <div>FY: {plan.fiscalYear} | Status: {getStatusDisplay(plan.status)}</div>
                    <div>Created: {new Date(plan.createdDate).toLocaleDateString()} | Version: {plan.version}</div>
                    <div>Total Cases: {plan.totalCases || 0} | Regions: {Object.keys(plan.regionalAllocation || {}).length}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  style={{
                    padding: '8px 16px',
                    background: '#da3633',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    marginLeft: '12px'
                  }}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        padding: '20px',
        background: '#3d1f1f',
        border: '2px solid #da3633',
        borderRadius: '6px'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#f0f6fc' }}>
          <i className="fas fa-exclamation-triangle" style={{ color: '#da3633' }}></i> Danger Zone
        </h3>
        
        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#8b949e', fontSize: '13px', marginBottom: '12px' }}>
            Delete all plans at once. This action cannot be undone.
          </p>
          
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              style={{
                padding: '10px 20px',
                background: '#da3633',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              <i className="fas fa-trash-alt"></i> Reset All Plans
            </button>
          ) : (
            <div style={{
              padding: '16px',
              background: '#1c2128',
              border: '1px solid #30363d',
              borderRadius: '6px'
            }}>
              <p style={{ color: '#f0f6fc', fontSize: '13px', marginBottom: '12px', fontWeight: '600' }}>
                ⚠️ This will permanently delete {plans.length} plan(s). Type "RESET ALL PLANS":
              </p>
              <input
                type="text"
                placeholder='Type "RESET ALL PLANS" to confirm'
                value={resetConfirmation}
                onChange={(e) => setResetConfirmation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #30363d',
                  borderRadius: '4px',
                  background: '#0f1419',
                  color: '#f0f6fc',
                  boxSizing: 'border-box',
                  marginBottom: '12px',
                  fontFamily: 'monospace'
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleDeleteAllPlans}
                  disabled={resetConfirmation !== 'RESET ALL PLANS'}
                  style={{
                    padding: '8px 16px',
                    background: resetConfirmation === 'RESET ALL PLANS' ? '#da3633' : '#30363d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: resetConfirmation === 'RESET ALL PLANS' ? 'pointer' : 'not-allowed',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  Yes, Delete All
                </button>
                <button
                  onClick={() => {
                    setShowResetConfirm(false);
                    setResetConfirmation('');
                  }}
                  style={{
                    padding: '8px 16px',
                    background: '#30363d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render form
  const renderForm = () => {
    if (activeTab === 'auditTypes') {
      return (
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>ID</label>
            <input type="text" value={formData.id || ''} onChange={(e) => setFormData({ ...formData, id: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #30363d', borderRadius: '4px', background: '#1c2128', color: '#f0f6fc', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Name</label>
            <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #30363d', borderRadius: '4px', background: '#1c2128', color: '#f0f6fc', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Effort Per Case (Hours)</label>
            <input type="number" value={formData.effortPerCase || ''} onChange={(e) => setFormData({ ...formData, effortPerCase: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #30363d', borderRadius: '4px', background: '#1c2128', color: '#f0f6fc', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Complexity</label>
            <select value={formData.complexity || ''} onChange={(e) => setFormData({ ...formData, complexity: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #30363d', borderRadius: '4px', background: '#1c2128', color: '#f0f6fc', boxSizing: 'border-box', cursor: 'pointer' }}>
              <option value="">Select Complexity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Very High">Very High</option>
            </select>
          </div>
        </div>
      );
    }

    if (activeTab === 'skills') {
      return (
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>ID</label>
            <input type="text" value={formData.id || ''} onChange={(e) => setFormData({ ...formData, id: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #30363d', borderRadius: '4px', background: '#1c2128', color: '#f0f6fc', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Name</label>
            <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #30363d', borderRadius: '4px', background: '#1c2128', color: '#f0f6fc', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Level</label>
            <input type="number" min="1" max="5" value={formData.level || ''} onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #30363d', borderRadius: '4px', background: '#1c2128', color: '#f0f6fc', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Category</label>
            <input type="text" value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #30363d', borderRadius: '4px', background: '#1c2128', color: '#f0f6fc', boxSizing: 'border-box' }} />
          </div>
        </div>
      );
    }

    if (activeTab === 'regions') {
      return (
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>ID</label>
            <input type="text" value={formData.id || ''} onChange={(e) => setFormData({ ...formData, id: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #30363d', borderRadius: '4px', background: '#1c2128', color: '#f0f6fc', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Name</label>
            <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #30363d', borderRadius: '4px', background: '#1c2128', color: '#f0f6fc', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Taxpayers</label>
            <input type="number" value={formData.taxpayers || ''} onChange={(e) => setFormData({ ...formData, taxpayers: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #30363d', borderRadius: '4px', background: '#1c2128', color: '#f0f6fc', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Available Auditors</label>
            <input type="number" value={formData.availableAuditors || ''} onChange={(e) => setFormData({ ...formData, availableAuditors: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #30363d', borderRadius: '4px', background: '#1c2128', color: '#f0f6fc', boxSizing: 'border-box' }} />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Card>
      <div style={{ padding: '24px' }}>
        <h1 style={{ marginTop: 0, marginBottom: '24px', color: '#f0f6fc' }}>
          <i className="fas fa-cog"></i> Audit Configuration Manager
        </h1>

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

        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '1px solid #30363d',
          overflowX: 'auto'
        }}>
          {[
            { id: 'auditTypes', label: 'Audit Types' },
            { id: 'skills', label: 'Skills' },
            { id: 'regions', label: 'Regions' },
            { id: 'allocationRules', label: 'Allocation Rules' },
            { id: 'plans', label: 'Plans' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
              style={{
                padding: '12px 16px',
                border: 'none',
                background: activeTab === tab.id ? '#238636' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#8b949e',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== 'allocationRules' && activeTab !== 'plans' && !showForm && (
          <button
            onClick={handleAddNew}
            style={{
              marginBottom: '24px',
              padding: '8px 16px',
              background: '#238636',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            <i className="fas fa-plus"></i> Add New
          </button>
        )}

        {!showForm ? (
          <div>
            {activeTab === 'auditTypes' && renderAuditTypesTab()}
            {activeTab === 'skills' && renderSkillsTab()}
            {activeTab === 'regions' && renderRegionsTab()}
            {activeTab === 'allocationRules' && renderAllocationRulesTab()}
            {activeTab === 'plans' && renderPlansTab()}
          </div>
        ) : (
          <div style={{
            padding: '24px',
            background: '#0f1419',
            border: '1px solid #30363d',
            borderRadius: '6px'
          }}>
            <h3 style={{ marginTop: 0, color: '#f0f6fc' }}>
              {editingItem ? 'Edit Configuration' : 'Add New Configuration'}
            </h3>
            {renderForm()}
            <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
              <button
                onClick={handleSave}
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
                Save
              </button>
              <button
                onClick={() => setShowForm(false)}
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
      </div>
    </Card>
  );
}

export default ConfigurationManager;
