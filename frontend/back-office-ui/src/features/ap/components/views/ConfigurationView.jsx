import React, { useState } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import { auditConfig } from '../../config/auditConfig';
import { useData, clearAllPlans, resetAllData } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import { getDisplayRegionName } from '../../utils/regionNormalizer';

/**
 * ConfigurationView
 * System-wide configuration interface with tabs for managing audit types, tax types,
 * industries, taxpayer categories, skills, regions, risk indicators, standards,
 * workflow settings, risk thresholds, feature flags, and data management.
 * Design: Dark theme with organized tabs for different configuration modules.
 * Styling: 100% Tailwind CSS with dark mode support.
 */

function ConfigurationView() {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [editingRows, setEditingRows] = useState({});
  const { getUserInfo, hasPermission } = useAuth();
  const { data, updateData } = useData();
  
  const forceUpdate = () => setUpdateTrigger(prev => prev + 1);
  const toggleEditRow = (id) => setEditingRows(prev => ({...prev, [id]: !prev[id]}));
  
  const userInfo = getUserInfo();
  const role = userInfo?.role || 'audit_team';
  
  // Access Control Logic
  const isNationalLevel = ['audit_team', 'audit_director', 'senior_management'].includes(role);
  const isRegionalLevel = role === 'regional_director';
  const isTaxCenterLevel = role === 'tax_center_manager';
  
  // Edit Permissions
  const canEditConfig = role === 'audit_team' || hasPermission('manage_configuration');
  const isReadOnly = isNationalLevel && !canEditConfig;

  const getRoleSpecificTitle = () => {
    if (isRegionalLevel) return `${getDisplayRegionName(userInfo.orgContext?.assignedRegion)} Regional Configuration`;
    if (isTaxCenterLevel) return `${userInfo.orgContext?.assignedTaxCenter} Tax Center Configuration`;
    return 'National Configuration & Standards';
  };

  const renderOverview = () => {
    // Define modules based on role
    let modules = [];
    
    if (isNationalLevel) {
      modules = [
        { id: 'audit-types', icon: 'fas fa-tasks', title: 'Audit Types', count: auditConfig.auditTypes.length },
        { id: 'tax-types', icon: 'fas fa-percent', title: 'Tax Types', count: auditConfig.taxTypes.length },
        { id: 'industries', icon: 'fas fa-industry', title: 'Industries', count: auditConfig.industries.length },
        { id: 'taxpayer-categories', icon: 'fas fa-users', title: 'Taxpayer Categories', count: 4 },
        { id: 'skills', icon: 'fas fa-graduation-cap', title: 'Auditor Skills', count: auditConfig.skills.length },
        { id: 'capacity', icon: 'fas fa-calendar-alt', title: 'Capacity & Leave', desc: 'Working hours & limits' },
        { id: 'regions', icon: 'fas fa-map', title: 'Regions & Tax Centers', desc: `${auditConfig.regions.length} regions, ${auditConfig.taxCenters.length} tax centers` },
        { id: 'risk-indicators', icon: 'fas fa-exclamation-circle', title: 'Risk Indicators', desc: 'Rules & thresholds' },
        { id: 'workflow', icon: 'fas fa-sitemap', title: 'Workflow & Approvals', desc: 'SLA & Hierarchies' },
      ];
      // Only show Data Management to those who can edit
      if (canEditConfig) {
        modules.push({ id: 'data-management', icon: 'fas fa-database', title: 'Data Management', desc: 'Clear plans, reset data' });
      }
    } else if (isRegionalLevel) {
      modules = [
        { id: 'regional-risk', icon: 'fas fa-chart-line', title: 'Regional Risk Profiles', desc: 'Industry multipliers' },
        { id: 'tax-center-capacity', icon: 'fas fa-building', title: 'Tax Center Capacities', desc: 'Configure TC resources' },
        { id: 'allocation-rules', icon: 'fas fa-balance-scale', title: 'Allocation Rules', desc: 'Distribution formulas' }
      ];
    } else if (isTaxCenterLevel) {
      modules = [
        { id: 'team-formation', icon: 'fas fa-users-cog', title: 'Team Formation', desc: 'Manage audit teams' },
        { id: 'auditor-skills', icon: 'fas fa-user-graduate', title: 'Auditor Skills', desc: 'Update expertise levels' },
        { id: 'capacity-planning', icon: 'fas fa-calendar-alt', title: 'Capacity & Leave', desc: 'Manage availability' }
      ];
    }

    return (
      <div>
        <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-gold dark:border-gold">
          <h2 className="text-3xl font-bold text-text-hi dark:text-text-hi">
            <i className="fas fa-cog mr-3"></i> {getRoleSpecificTitle()}
          </h2>
          <Badge status="System Configuration" className="director-approved" />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-hi dark:text-text-hi mb-4 flex items-center gap-2">
            <i className="fas fa-th-large text-gold dark:text-gold"></i> Configuration Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-4 border rounded-sm text-left cursor-pointer transition-all ${
                  item.id === 'data-management'
                    ? 'bg-ink dark:bg-ink border-gold dark:border-gold hover:bg-panel dark:hover:bg-panel'
                    : 'bg-panel dark:bg-panel-dark border-border dark:border-border-dark hover:bg-border dark:hover:bg-border-dark'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-text-hi dark:text-text-hi font-semibold flex items-center gap-2">
                      <i className={item.icon}></i> {item.title}
                    </h3>
                    <p className="text-text-mid dark:text-text-mid text-sm mt-1">
                      {item.count !== undefined ? `${item.count} configured` : item.desc}
                    </p>
                  </div>
                  <i className={`fas fa-chevron-right text-text-mid dark:text-text-mid ${item.id === 'data-management' ? 'text-coral dark:text-coral' : ''}`}></i>
                </div>
              </button>
            ))}
          </div>
        </div>

        {isReadOnly && (
          <div className="mb-6 bg-warning dark:bg-warning bg-opacity-10 border border-warning dark:border-warning rounded-sm p-4">
            <strong className="text-warning dark:text-warning"><i className="fas fa-lock mr-2"></i> Read-Only Mode</strong>
            <p className="text-text-mid dark:text-text-mid text-sm mt-1">
              Your role ({userInfo.fullName}) has read-only access to national configurations. Only the Audit Planning Team can modify these settings.
            </p>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-500 dark:border-blue-600 rounded-sm p-4 text-blue-900 dark:text-blue-100">
          <strong className="text-blue-900 dark:text-blue-100">
            <i className="fas fa-info-circle mr-2"></i> Information
          </strong>
          <p className="text-sm leading-relaxed mt-2">
            Click on any module to view and manage its configuration. All changes apply system-wide immediately.
          </p>
        </div>
      </div>
    );
  };

  const renderGenericConfigTable = (tabId, title, icon, dataArray, columns, onAdd, description) => {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setActiveTab('overview')} className="px-4 py-2 border border-border dark:border-border-dark rounded-sm bg-panel dark:bg-panel-dark text-text-hi dark:text-text-hi hover:bg-border dark:hover:bg-border-dark transition-colors"><i className="fas fa-arrow-left mr-2"></i> Back</button>
        </div>
        <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-gold dark:border-gold">
          <h2 className="text-3xl font-bold text-text-hi dark:text-text-hi"><i className={`${icon} mr-3`}></i> {title} Configuration</h2>
          <Badge status="System Configuration" className="director-approved" />
        </div>
        <div className="overflow-x-auto border border-border dark:border-border-dark rounded-sm mb-6">
          {canEditConfig && onAdd && (
            <div className="p-4 border-b border-border dark:border-border-dark bg-ink dark:bg-ink flex">
              <button onClick={() => { 
                const newItem = onAdd(); 
                if (newItem && newItem.id) {
                  setEditingRows(prev => ({...prev, [newItem.id]: true}));
                }
                forceUpdate(); 
              }} className="flex items-center gap-2 text-gold dark:text-gold hover:opacity-80 font-semibold text-sm">
                <i className="fas fa-plus"></i> Add New {title}
              </button>
            </div>
          )}
          <table className="w-full text-sm">
            <thead className="bg-panel dark:bg-panel-dark border-b border-border dark:border-border-dark">
              <tr>
                {columns.map(c => <th key={c.key} className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">{c.label}</th>)}
                {canEditConfig && <th className="text-right px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {dataArray.map((item, i) => {
                const isEditing = editingRows[item.id];
                return (
                  <tr key={i} className="border-b border-border dark:border-border-dark hover:bg-panel dark:hover:bg-panel-dark">
                    {columns.map(c => (
                      <td key={c.key} className="px-4 py-3">
                        {isEditing ? (
                          <input 
                            type={c.type || 'text'} 
                            defaultValue={item[c.key]} 
                            className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-2 py-1 w-full rounded-sm focus:outline-none focus:border-gold"
                            onChange={(e) => { 
                              item[c.key] = c.type === 'number' ? Number(e.target.value) : e.target.value; 
                              if(c.onChange) c.onChange();
                            }}
                          />
                        ) : <span className="text-text-hi dark:text-text-hi">{item[c.key]}</span>}
                      </td>
                    ))}
                    {canEditConfig && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => toggleEditRow(item.id)} className="text-info dark:text-info hover:opacity-80">
                            {isEditing ? <i className="fas fa-check" title="Save"></i> : <i className="fas fa-edit" title="Edit"></i>}
                          </button>
                          <button onClick={() => { dataArray.splice(i, 1); forceUpdate(); }} className="text-danger dark:text-danger hover:opacity-80">
                            <i className="fas fa-trash" title="Delete"></i>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAuditTypes = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className="px-4 py-2 border border-border dark:border-border-dark rounded-sm bg-panel dark:bg-panel-dark text-text-hi dark:text-text-hi hover:bg-border dark:hover:bg-border-dark transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i> Back
          </button>
        </div>

        <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-gold dark:border-gold">
          <h2 className="text-3xl font-bold text-text-hi dark:text-text-hi">
            <i className="fas fa-tasks mr-3"></i> Audit Types Configuration
          </h2>
          <Badge status="System Configuration" className="director-approved" />
        </div>

        <div className="overflow-x-auto border border-border dark:border-border-dark rounded-sm mb-6">
          {canEditConfig && (
            <div className="p-4 border-b border-border dark:border-border-dark bg-ink dark:bg-ink flex">
              <button 
                onClick={() => {
                  const newItem = {
                    id: `custom_${Date.now()}`,
                    name: 'New Audit Type',
                    effortPerCase: 40,
                    skillsRequired: ['Basic Analysis'],
                    description: 'Description of the new audit type',
                    complexity: 'Medium'
                  };
                  auditConfig.auditTypes.unshift(newItem);
                  setEditingRows(prev => ({...prev, [newItem.id]: true}));
                  forceUpdate();
                }}
                className="flex items-center gap-2 text-gold dark:text-gold hover:opacity-80 font-semibold text-sm"
              >
                <i className="fas fa-plus"></i> Add New Audit Type
              </button>
            </div>
          )}
          <table className="w-full text-sm">
            <thead className="bg-panel dark:bg-panel-dark border-b border-border dark:border-border-dark">
              <tr>
                <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Audit Type</th>
                <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Effort Hours</th>
                <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Complexity</th>
                <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Required Skills</th>
                <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Description</th>
                {canEditConfig && <th className="text-right px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {auditConfig.auditTypes.map((type, i) => {
                const isEditing = editingRows[type.id];
                return (
                <tr key={i} className="border-b border-border dark:border-border-dark hover:bg-panel dark:hover:bg-panel-dark">
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input type="text" defaultValue={type.name} className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-2 py-1 w-full rounded-sm focus:outline-none focus:border-gold" onChange={(e) => { type.name = e.target.value; }} />
                    ) : <strong className="text-text-hi dark:text-text-hi">{type.name}</strong>}
                  </td>
                  <td className="px-4 py-3 text-text-hi dark:text-text-hi">
                    {isEditing ? (
                      <input 
                        type="number" 
                        defaultValue={type.effortPerCase} 
                        className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-2 py-1 w-20 rounded-sm focus:outline-none focus:border-gold"
                        onChange={(e) => { type.effortPerCase = Number(e.target.value); }}
                      />
                    ) : (
                      `${type.effortPerCase}h`
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <select 
                        defaultValue={type.complexity}
                        className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-2 py-1 rounded-sm focus:outline-none focus:border-gold"
                        onChange={(e) => { type.complexity = e.target.value; }}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Very High">Very High</option>
                      </select>
                    ) : (
                      <span className={`inline-block px-2 py-1 rounded-sm text-xs font-bold text-white ${
                        type.complexity === 'Low' ? 'bg-success dark:bg-success' :
                        type.complexity === 'Medium' ? 'bg-info dark:bg-info' : 'bg-danger dark:bg-danger'
                      }`}>
                        {type.complexity}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-hi dark:text-text-hi text-sm">
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={type.skillsRequired.join(', ')} 
                        className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-2 py-1 w-full rounded-sm focus:outline-none focus:border-gold"
                        onChange={(e) => { type.skillsRequired = e.target.value.split(',').map(s => s.trim()); }}
                      />
                    ) : type.skillsRequired.join(', ')}
                  </td>
                  <td className="px-4 py-3 text-text-mid dark:text-text-mid text-sm">
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={type.description} 
                        className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-2 py-1 w-full rounded-sm focus:outline-none focus:border-gold"
                        onChange={(e) => { type.description = e.target.value; }}
                      />
                    ) : type.description}
                  </td>
                  {canEditConfig && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => toggleEditRow(type.id)} className="text-info dark:text-info hover:opacity-80">
                          {isEditing ? <i className="fas fa-check" title="Save"></i> : <i className="fas fa-edit" title="Edit"></i>}
                        </button>
                        <button 
                          onClick={() => {
                            auditConfig.auditTypes.splice(i, 1);
                            forceUpdate();
                          }}
                          className="text-danger dark:text-danger hover:opacity-80"
                          title="Delete Audit Type"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              )})}
            </tbody>
          </table>
        </div>

        <div className={`border rounded-sm p-4 ${editMode ? 'bg-gold dark:bg-gold bg-opacity-10 border-gold dark:border-gold' : 'bg-ink dark:bg-ink border-border dark:border-border-dark'}`}>
          {editMode ? (
            <>
              <strong className="text-gold dark:text-gold"><i className="fas fa-check-circle mr-2"></i> Edit Mode Active</strong>
              <p className="text-text-mid dark:text-text-mid text-sm mt-2">
                Make changes directly in the table above. Values are updated in real-time for the current session.
              </p>
            </>
          ) : (
            <>
              <strong className="text-info dark:text-info"><i className="fas fa-info-circle mr-2"></i> Configuration Active</strong>
              <p className="text-text-mid dark:text-text-mid text-sm mt-2">
                Click "Edit Configuration" to adjust effort hours and complexity multipliers.
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderTaxTypes = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className="px-4 py-2 border border-border dark:border-border-dark rounded-sm bg-panel dark:bg-panel-dark text-text-hi dark:text-text-hi hover:bg-border dark:hover:bg-border-dark transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i> Back
          </button>
        </div>

        <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-gold dark:border-gold">
          <h2 className="text-3xl font-bold text-text-hi dark:text-text-hi">
            <i className="fas fa-percent mr-3"></i> Tax Types Configuration
          </h2>
          <Badge status="System Configuration" className="director-approved" />
        </div>

        <div className="overflow-x-auto border border-border dark:border-border-dark rounded-sm mb-6">
          {canEditConfig && (
            <div className="p-4 border-b border-border dark:border-border-dark bg-ink dark:bg-ink flex">
              <button 
                onClick={() => {
                  const newItem = {
                    id: `tax_${Date.now()}`,
                    name: 'New Tax Type',
                    riskWeight: 1.0,
                    compliance: 80
                  };
                  auditConfig.taxTypes.unshift(newItem);
                  setEditingRows(prev => ({...prev, [newItem.id]: true}));
                  forceUpdate();
                }}
                className="flex items-center gap-2 text-gold dark:text-gold hover:opacity-80 font-semibold text-sm"
              >
                <i className="fas fa-plus"></i> Add New Tax Type
              </button>
            </div>
          )}
          <table className="w-full text-sm">
            <thead className="bg-panel dark:bg-panel-dark border-b border-border dark:border-border-dark">
              <tr>
                <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Tax Type</th>
                <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Risk Weight</th>
                <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Compliance %</th>
                <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Priority</th>
                {canEditConfig && <th className="text-right px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {auditConfig.taxTypes.map((tax, i) => {
                const isEditing = editingRows[tax.id];
                return (
                <tr key={i} className="border-b border-border dark:border-border-dark hover:bg-panel dark:hover:bg-panel-dark">
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={tax.name} 
                        className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-2 py-1 w-full rounded-sm focus:outline-none focus:border-gold"
                        onChange={(e) => { tax.name = e.target.value; }}
                      />
                    ) : <strong className="text-text-hi dark:text-text-hi">{tax.name}</strong>}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input 
                        type="number" 
                        step="0.1"
                        defaultValue={tax.riskWeight} 
                        className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-2 py-1 w-20 rounded-sm focus:outline-none focus:border-gold"
                        onChange={(e) => { tax.riskWeight = Number(e.target.value); forceUpdate(); }}
                      />
                    ) : <span className="text-text-hi dark:text-text-hi">{tax.riskWeight}x</span>}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input 
                        type="number" 
                        defaultValue={tax.compliance} 
                        className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-2 py-1 w-20 rounded-sm focus:outline-none focus:border-gold"
                        onChange={(e) => { tax.compliance = Number(e.target.value); }}
                      />
                    ) : <span className="text-text-hi dark:text-text-hi">{tax.compliance}%</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-text-hi dark:text-text-hi">
                      {tax.riskWeight > 1.2 ? '🔴 Critical' :
                        tax.riskWeight > 1.0 ? '🟠 High' :
                        tax.riskWeight > 0.9 ? '🟡 Medium' : '🟢 Normal'}
                    </span>
                  </td>
                  {canEditConfig && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => toggleEditRow(tax.id)} className="text-info dark:text-info hover:opacity-80">
                          {isEditing ? <i className="fas fa-check" title="Save"></i> : <i className="fas fa-edit" title="Edit"></i>}
                        </button>
                        <button 
                          onClick={() => {
                            auditConfig.taxTypes.splice(i, 1);
                            forceUpdate();
                          }}
                          className="text-danger dark:text-danger hover:opacity-80"
                          title="Delete Tax Type"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              )})}
            </tbody>
          </table>
        </div>

        <div className={`border rounded-sm p-4 mt-6 ${editMode ? 'bg-gold dark:bg-gold bg-opacity-10 border-gold dark:border-gold' : 'bg-ink dark:bg-ink border-border dark:border-border-dark'}`}>
          {editMode ? (
            <>
              <strong className="text-gold dark:text-gold"><i className="fas fa-check-circle mr-2"></i> Edit Mode Active</strong>
              <p className="text-text-mid dark:text-text-mid text-sm mt-2">
                Make changes directly in the table above. Values are updated in real-time for the current session.
              </p>
            </>
          ) : (
            <>
              <strong className="text-info dark:text-info"><i className="fas fa-info-circle mr-2"></i> Configuration Active</strong>
              <p className="text-text-mid dark:text-text-mid text-sm mt-2">
                Click "Edit Configuration" to adjust risk weights and compliance ratios.
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderRegions = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className="px-4 py-2 border border-border dark:border-border-dark rounded-sm bg-panel dark:bg-panel-dark text-text-hi dark:text-text-hi hover:bg-border dark:hover:bg-border-dark transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i> Back
          </button>
        </div>

        <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-gold dark:border-gold">
          <h2 className="text-3xl font-bold text-text-hi dark:text-text-hi">
            <i className="fas fa-map mr-3"></i> Regions & Tax Centers Configuration
          </h2>
          <Badge status="System Configuration" className="director-approved" />
        </div>

        <div className="overflow-x-auto border border-border dark:border-border-dark rounded-sm mb-6">
          {canEditConfig && (
            <div className="p-4 border-b border-border dark:border-border-dark bg-ink dark:bg-ink flex">
              <button 
                onClick={() => {
                  const newItem = {
                    id: `region_${Date.now()}`,
                    name: 'New Region',
                    taxpayers: 1000,
                    availableAuditors: 10,
                    taxCenters: ['New Region TC1'],
                    availableSkills: { 'Basic Analysis': 5 }
                  };
                  auditConfig.regions.unshift(newItem);
                  setEditingRows(prev => ({...prev, [newItem.id]: true}));
                  forceUpdate();
                }}
                className="flex items-center gap-2 text-gold dark:text-gold hover:opacity-80 font-semibold text-sm"
              >
                <i className="fas fa-plus"></i> Add New Region
              </button>
            </div>
          )}
          <table className="w-full text-sm">
            <thead className="bg-panel dark:bg-panel-dark border-b border-border dark:border-border-dark">
              <tr>
                <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Region Name</th>
                <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Taxpayers</th>
                <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Auditors</th>
                <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Tax Centers</th>
                {canEditConfig && <th className="text-right px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {auditConfig.regions.map((region, i) => {
                const isEditing = editingRows[region.id];
                return (
                <tr key={i} className="border-b border-border dark:border-border-dark hover:bg-panel dark:hover:bg-panel-dark">
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={region.name} 
                        className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-2 py-1 w-full rounded-sm focus:outline-none focus:border-gold"
                        onChange={(e) => { region.name = e.target.value; }}
                      />
                    ) : <strong className="text-text-hi dark:text-text-hi">{region.name}</strong>}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input 
                        type="number" 
                        defaultValue={region.taxpayers} 
                        className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-2 py-1 w-24 rounded-sm focus:outline-none focus:border-gold"
                        onChange={(e) => { region.taxpayers = Number(e.target.value); }}
                      />
                    ) : <span className="text-text-hi dark:text-text-hi">{region.taxpayers?.toLocaleString()}</span>}
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input 
                        type="number" 
                        defaultValue={region.availableAuditors} 
                        className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-2 py-1 w-20 rounded-sm focus:outline-none focus:border-gold"
                        onChange={(e) => { region.availableAuditors = Number(e.target.value); }}
                      />
                    ) : <span className="text-text-hi dark:text-text-hi">{region.availableAuditors}</span>}
                  </td>
                  <td className="px-4 py-3 text-text-hi dark:text-text-hi text-sm">
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={region.taxCenters?.join(', ')} 
                        className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-2 py-1 w-full rounded-sm focus:outline-none focus:border-gold"
                        onChange={(e) => { region.taxCenters = e.target.value.split(',').map(s => s.trim()); }}
                      />
                    ) : region.taxCenters?.join(', ')}
                  </td>
                  {canEditConfig && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => toggleEditRow(region.id)} className="text-info dark:text-info hover:opacity-80">
                          {isEditing ? <i className="fas fa-check" title="Save"></i> : <i className="fas fa-edit" title="Edit"></i>}
                        </button>
                        <button 
                          onClick={() => {
                            auditConfig.regions.splice(i, 1);
                            forceUpdate();
                          }}
                          className="text-danger dark:text-danger hover:opacity-80"
                          title="Delete Region"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              )})}
            </tbody>
          </table>
        </div>

        <div className={`border rounded-sm p-4 ${editMode ? 'bg-gold dark:bg-gold bg-opacity-10 border-gold dark:border-gold' : 'bg-ink dark:bg-ink border-border dark:border-border-dark'}`}>
          {editMode ? (
            <>
              <strong className="text-gold dark:text-gold"><i className="fas fa-check-circle mr-2"></i> Edit Mode Active</strong>
              <p className="text-text-mid dark:text-text-mid text-sm mt-2">
                Make changes directly in the table above. Values are updated in real-time for the current session.
              </p>
            </>
          ) : (
            <>
              <strong className="text-info dark:text-info"><i className="fas fa-info-circle mr-2"></i> Configuration Active</strong>
              <p className="text-text-mid dark:text-text-mid text-sm mt-2">
                Click "Edit Configuration" to adjust region settings and tax center mappings.
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderDataManagement = () => {
    // Using data from hook
    const planCount = data.plans?.length || 0;

    const handleClearPlans = () => {
      if (planCount === 0) {
        alert('No plans to delete.');
        return;
      }
      if (window.confirm(`⚠️ DELETE ${planCount} PLAN${planCount !== 1 ? 'S' : ''}? This cannot be undone!\n\nAll created audit plans will be permanently removed.`)) {
        try {
          console.log('Clearing all plans...');
          clearAllPlans();
          console.log('✅ Plans cleared successfully');
          alert(`✅ All ${planCount} plan${planCount !== 1 ? 's' : ''} deleted successfully!\n\nPage will refresh now...`);
          setTimeout(() => {
            console.log('Reloading page...');
            window.location.reload();
          }, 1000);
        } catch (e) {
          console.error('Error:', e);
          alert('❌ Error deleting plans: ' + e.message);
        }
      }
    };

    const handleResetAll = () => {
      if (window.confirm('⚠️ RESET ALL DATA to defaults? This cannot be undone!\n\nYou will lose:\n- All created audit plans\n- All feedback data\n- All allocations\n- All system configurations (will reset to defaults)')) {
        try {
          console.log('Resetting all data...');
          resetAllData();
          console.log('✅ Data reset successfully');
          alert('✅ All data reset to defaults!\n\nPage will refresh now...');
          setTimeout(() => {
            console.log('Reloading page...');
            window.location.reload();
          }, 1000);
        } catch (e) {
          console.error('Error:', e);
          alert('❌ Error resetting data: ' + e.message);
        }
      }
    };

    const handleExportData = () => {
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-planning-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      alert('✅ Data exported successfully!');
    };

    return (
      <div>
        <button 
          onClick={() => setActiveTab('overview')}
          className="mb-6 px-4 py-2 border border-border dark:border-border-dark rounded-sm bg-panel dark:bg-panel-dark text-text-hi dark:text-text-hi hover:bg-border dark:hover:bg-border-dark transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i> Back
        </button>

        <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-gold dark:border-gold">
          <h2 className="text-3xl font-bold text-text-hi dark:text-text-hi">
            <i className="fas fa-database mr-3"></i> Data Management
          </h2>
          <Badge status="Advanced Options" className="director-approved" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card title="Total Plans" number={planCount} icon="fas fa-file-contract" />
          <Card title="Storage Size" number={`${(new Blob([JSON.stringify(data)]).size / 1024).toFixed(1)} KB`} icon="fas fa-hdd" />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-hi dark:text-text-hi mb-4 flex items-center gap-2">
            <i className="fas fa-tools text-gold dark:text-gold"></i> Data Actions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Delete Plans */}
            <div className="bg-ink dark:bg-ink border-2 border-danger dark:border-danger rounded-sm p-6 text-center">
              <i className="fas fa-trash-alt text-danger dark:text-danger text-4xl mb-4 block"></i>
              <h3 className="text-danger dark:text-danger font-semibold mb-2">Delete All Plans</h3>
              <p className="text-text-mid dark:text-text-mid text-sm mb-4">
                Remove all {planCount} created plans. Keep system data intact.
              </p>
              <button
                onClick={handleClearPlans}
                disabled={planCount === 0}
                className={`w-full px-4 py-2 rounded-sm font-semibold text-ink dark:text-ink border-none cursor-pointer transition-opacity ${
                  planCount === 0 
                    ? 'bg-text-mid dark:bg-text-mid opacity-50 cursor-not-allowed' 
                    : 'bg-danger dark:bg-danger hover:opacity-90'
                }`}
              >
                <i className="fas fa-trash mr-2"></i> {planCount > 0 ? `Delete ${planCount} Plan${planCount !== 1 ? 's' : ''}` : 'No Plans'}
              </button>
            </div>

            {/* Reset All */}
            <div className="bg-ink dark:bg-ink border-2 border-info dark:border-info rounded-sm p-6 text-center">
              <i className="fas fa-redo text-warning dark:text-warning text-4xl mb-4 block"></i>
              <h3 className="text-info dark:text-info font-semibold mb-2">Reset All Data</h3>
              <p className="text-text-mid dark:text-text-mid text-sm mb-4">
                Reset entire system to default state including all plans and data.
              </p>
              <button
                onClick={handleResetAll}
                className="w-full px-4 py-2 bg-info dark:bg-info text-ink dark:text-ink rounded-sm font-semibold border-none cursor-pointer hover:opacity-90 transition-opacity"
              >
                <i className="fas fa-sync mr-2"></i> Reset All
              </button>
            </div>

            {/* Export Data */}
            <div className="bg-blue-50 dark:bg-blue-900 border-2 border-blue-500 dark:border-blue-600 rounded-sm p-6 text-center">
              <i className="fas fa-download text-info dark:text-info text-4xl mb-4 block"></i>
              <h3 className="text-info dark:text-info font-semibold mb-2">Export Data</h3>
              <p className="text-blue-900 dark:text-blue-100 text-sm mb-4">
                Download all system data as JSON file for backup.
              </p>
              <button
                onClick={handleExportData}
                className="w-full px-4 py-2 bg-info dark:bg-info text-ink dark:text-ink rounded-sm font-semibold border-none cursor-pointer hover:opacity-90 transition-opacity"
              >
                <i className="fas fa-download mr-2"></i> Export
              </button>
            </div>
          </div>
        </div>

        <div className="bg-danger dark:bg-danger bg-opacity-10 border-2 border-danger dark:border-danger rounded-sm p-4">
          <strong className="text-danger dark:text-danger">
            <i className="fas fa-exclamation-triangle mr-2"></i> WARNING
          </strong>
          <p className="text-danger dark:text-danger text-sm leading-relaxed mt-2">
            ⚠️ These operations are DESTRUCTIVE and CANNOT BE UNDONE. Please be careful!<br/>
            • Deleting plans will remove all created audit plans<br/>
            • Resetting data will erase everything including plans, feedback, and allocations
          </p>
        </div>
      </div>
    );
  };

  // Render other config sections (simplified)
  const renderPlaceholder = (title, icon) => (
    <div>
      <button 
        onClick={() => setActiveTab('overview')}
        className="mb-6 px-4 py-2 border border-border dark:border-border-dark rounded-sm bg-panel dark:bg-panel-dark text-text-hi dark:text-text-hi hover:bg-border dark:hover:bg-border-dark transition-colors"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back
      </button>
      <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-gold dark:border-gold">
        <h2 className="text-3xl font-bold text-text-hi dark:text-text-hi">
          <i className={`${icon} mr-3`}></i> {title}
        </h2>
        <Badge status="System Configuration" className="director-approved" />
      </div>
      <div className="bg-panel dark:bg-panel-dark border border-border dark:border-border-dark rounded-sm p-8 text-center text-text-mid dark:text-text-mid">
        <p>Configuration table for {title.toLowerCase()} will be displayed here</p>
      </div>
    </div>
  );

  const renderCapacity = () => {
    const config = auditConfig.effortCalculation;
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setActiveTab('overview')} className="px-4 py-2 border border-border dark:border-border-dark rounded-sm bg-panel dark:bg-panel-dark text-text-hi dark:text-text-hi hover:bg-border dark:hover:bg-border-dark transition-colors"><i className="fas fa-arrow-left mr-2"></i> Back</button>
          {canEditConfig && (
            <button onClick={() => setEditMode(!editMode)} className="px-4 py-2 bg-gold dark:bg-gold text-ink dark:text-ink rounded-sm font-semibold hover:opacity-90 transition-opacity">
              <i className="fas fa-edit mr-2"></i> {editMode ? 'Done Editing' : 'Edit Configuration'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-gold dark:border-gold">
          <h2 className="text-3xl font-bold text-text-hi dark:text-text-hi"><i className="fas fa-calendar-alt mr-3"></i> Capacity & Leave Configuration</h2>
          <Badge status="System Configuration" className="director-approved" />
        </div>
        
        <div className="bg-panel dark:bg-panel-dark border border-border dark:border-border-dark rounded-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-text-hi dark:text-text-hi mb-4 border-b border-border dark:border-border-dark pb-2">Effort Calculation Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-text-mid dark:text-text-mid text-sm mb-1">Standard Working Hours / Year</label>
              {editMode ? (
                <input type="number" defaultValue={config.hoursPerAuditorPerYear} className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-3 py-2 w-full rounded-sm focus:border-gold" onChange={e => {config.hoursPerAuditorPerYear = Number(e.target.value); forceUpdate();}} />
              ) : <div className="text-text-hi dark:text-text-hi font-semibold">{config.hoursPerAuditorPerYear} hours</div>}
            </div>
            <div>
              <label className="block text-text-mid dark:text-text-mid text-sm mb-1">Holidays & Leave Days</label>
              {editMode ? (
                <input type="number" defaultValue={config.holidaysAndLeave} className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-3 py-2 w-full rounded-sm focus:border-gold" onChange={e => {config.holidaysAndLeave = Number(e.target.value); forceUpdate();}} />
              ) : <div className="text-text-hi dark:text-text-hi font-semibold">{config.holidaysAndLeave} days</div>}
            </div>
            <div>
              <label className="block text-text-mid dark:text-text-mid text-sm mb-1">Training Days</label>
              {editMode ? (
                <input type="number" defaultValue={config.trainingDays} className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-3 py-2 w-full rounded-sm focus:border-gold" onChange={e => {config.trainingDays = Number(e.target.value); forceUpdate();}} />
              ) : <div className="text-text-hi dark:text-text-hi font-semibold">{config.trainingDays} days</div>}
            </div>
            <div>
              <label className="block text-text-mid dark:text-text-mid text-sm mb-1">Administration Overhead (%)</label>
              {editMode ? (
                <input type="number" step="0.01" defaultValue={config.administrationOverhead} className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-3 py-2 w-full rounded-sm focus:border-gold" onChange={e => {config.administrationOverhead = Number(e.target.value); forceUpdate();}} />
              ) : <div className="text-text-hi dark:text-text-hi font-semibold">{(config.administrationOverhead * 100).toFixed(0)}%</div>}
            </div>
            <div>
              <label className="block text-text-mid dark:text-text-mid text-sm mb-1">Buffer Percentage (%)</label>
              {editMode ? (
                <input type="number" step="0.01" defaultValue={config.bufferPercentage} className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-3 py-2 w-full rounded-sm focus:border-gold" onChange={e => {config.bufferPercentage = Number(e.target.value); forceUpdate();}} />
              ) : <div className="text-text-hi dark:text-text-hi font-semibold">{(config.bufferPercentage * 100).toFixed(0)}%</div>}
            </div>
          </div>
        </div>

        <div className={`border rounded-sm p-4 ${editMode ? 'bg-gold dark:bg-gold bg-opacity-10 border-gold dark:border-gold' : 'bg-ink dark:bg-ink border-border dark:border-border-dark'}`}>
          {editMode ? (
            <>
              <strong className="text-gold dark:text-gold"><i className="fas fa-check-circle mr-2"></i> Edit Mode Active</strong>
              <p className="text-text-mid dark:text-text-mid text-sm mt-2">Adjust capacity calculation formulas directly.</p>
            </>
          ) : (
            <>
              <strong className="text-info dark:text-info"><i className="fas fa-info-circle mr-2"></i> Configuration Active</strong>
              <p className="text-text-mid dark:text-text-mid text-sm mt-2">Click "Edit Configuration" to adjust working hours and capacity parameters.</p>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderWorkflow = () => {
    const config = auditConfig.workflowApproval;
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setActiveTab('overview')} className="px-4 py-2 border border-border dark:border-border-dark rounded-sm bg-panel dark:bg-panel-dark text-text-hi dark:text-text-hi hover:bg-border dark:hover:bg-border-dark transition-colors"><i className="fas fa-arrow-left mr-2"></i> Back</button>
          {canEditConfig && (
            <button onClick={() => setEditMode(!editMode)} className="px-4 py-2 bg-gold dark:bg-gold text-ink dark:text-ink rounded-sm font-semibold hover:opacity-90 transition-opacity">
              <i className="fas fa-edit mr-2"></i> {editMode ? 'Done Editing' : 'Edit Configuration'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-gold dark:border-gold">
          <h2 className="text-3xl font-bold text-text-hi dark:text-text-hi"><i className="fas fa-sitemap mr-3"></i> Workflow & Approvals Configuration</h2>
          <Badge status="System Configuration" className="director-approved" />
        </div>
        
        <div className="bg-panel dark:bg-panel-dark border border-border dark:border-border-dark rounded-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-text-hi dark:text-text-hi mb-4 border-b border-border dark:border-border-dark pb-2">Approval Rules & SLAs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-text-mid dark:text-text-mid text-sm mb-1 flex items-center gap-2">
                <i className="fas fa-check-square"></i> Requires Director Approval
              </label>
              {editMode ? (
                <select defaultValue={config.requiresDirectorApproval ? 'true' : 'false'} className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-3 py-2 w-full rounded-sm focus:border-gold" onChange={e => {config.requiresDirectorApproval = e.target.value === 'true'; forceUpdate();}}>
                  <option value="true">Yes, Required</option>
                  <option value="false">No, Not Required</option>
                </select>
              ) : <div className="text-text-hi dark:text-text-hi font-semibold">{config.requiresDirectorApproval ? 'Yes' : 'No'}</div>}
            </div>
            <div>
              <label className="block text-text-mid dark:text-text-mid text-sm mb-1 flex items-center gap-2">
                <i className="fas fa-comments"></i> Requires Regional Feedback
              </label>
              {editMode ? (
                <select defaultValue={config.requiresRegionalFeedback ? 'true' : 'false'} className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-3 py-2 w-full rounded-sm focus:border-gold" onChange={e => {config.requiresRegionalFeedback = e.target.value === 'true'; forceUpdate();}}>
                  <option value="true">Yes, Required</option>
                  <option value="false">No, Not Required</option>
                </select>
              ) : <div className="text-text-hi dark:text-text-hi font-semibold">{config.requiresRegionalFeedback ? 'Yes' : 'No'}</div>}
            </div>
            <div>
              <label className="block text-text-mid dark:text-text-mid text-sm mb-1 flex items-center gap-2">
                <i className="fas fa-crown"></i> Requires Senior Mgmt Approval
              </label>
              {editMode ? (
                <select defaultValue={config.requiresSeniorManagementApproval ? 'true' : 'false'} className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-3 py-2 w-full rounded-sm focus:border-gold" onChange={e => {config.requiresSeniorManagementApproval = e.target.value === 'true'; forceUpdate();}}>
                  <option value="true">Yes, Required</option>
                  <option value="false">No, Not Required</option>
                </select>
              ) : <div className="text-text-hi dark:text-text-hi font-semibold">{config.requiresSeniorManagementApproval ? 'Yes' : 'No'}</div>}
            </div>
            <div>
              <label className="block text-text-mid dark:text-text-mid text-sm mb-1 flex items-center gap-2">
                <i className="fas fa-undo"></i> Allow Rejection
              </label>
              {editMode ? (
                <select defaultValue={config.allowRejection ? 'true' : 'false'} className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-3 py-2 w-full rounded-sm focus:border-gold" onChange={e => {config.allowRejection = e.target.value === 'true'; forceUpdate();}}>
                  <option value="true">Yes, Allow Rejection</option>
                  <option value="false">No, Amend Only</option>
                </select>
              ) : <div className="text-text-hi dark:text-text-hi font-semibold">{config.allowRejection ? 'Yes' : 'No'}</div>}
            </div>
            <div>
              <label className="block text-text-mid dark:text-text-mid text-sm mb-1">Max Rounds of Amendments</label>
              {editMode ? (
                <input type="number" defaultValue={config.maxRoundOfAmendments} className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-3 py-2 w-full rounded-sm focus:border-gold" onChange={e => {config.maxRoundOfAmendments = Number(e.target.value); forceUpdate();}} />
              ) : <div className="text-text-hi dark:text-text-hi font-semibold">{config.maxRoundOfAmendments} rounds</div>}
            </div>
            <div>
              <label className="block text-text-mid dark:text-text-mid text-sm mb-1">Feedback Deadline (Days)</label>
              {editMode ? (
                <input type="number" defaultValue={config.feedbackDeadlineDays} className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-3 py-2 w-full rounded-sm focus:border-gold" onChange={e => {config.feedbackDeadlineDays = Number(e.target.value); forceUpdate();}} />
              ) : <div className="text-text-hi dark:text-text-hi font-semibold">{config.feedbackDeadlineDays} days</div>}
            </div>
            <div>
              <label className="block text-text-mid dark:text-text-mid text-sm mb-1">Review Deadline (Days)</label>
              {editMode ? (
                <input type="number" defaultValue={config.reviewDeadlineDays} className="bg-ink dark:bg-ink border border-border dark:border-border-dark text-text-hi dark:text-text-hi px-3 py-2 w-full rounded-sm focus:border-gold" onChange={e => {config.reviewDeadlineDays = Number(e.target.value); forceUpdate();}} />
              ) : <div className="text-text-hi dark:text-text-hi font-semibold">{config.reviewDeadlineDays} days</div>}
            </div>
          </div>
        </div>

        <div className={`border rounded-sm p-4 ${editMode ? 'bg-gold dark:bg-gold bg-opacity-10 border-gold dark:border-gold' : 'bg-ink dark:bg-ink border-border dark:border-border-dark'}`}>
          {editMode ? (
            <>
              <strong className="text-gold dark:text-gold"><i className="fas fa-check-circle mr-2"></i> Edit Mode Active</strong>
              <p className="text-text-mid dark:text-text-mid text-sm mt-2">Adjust workflow SLA parameters directly.</p>
            </>
          ) : (
            <>
              <strong className="text-info dark:text-info"><i className="fas fa-info-circle mr-2"></i> Configuration Active</strong>
              <p className="text-text-mid dark:text-text-mid text-sm mt-2">Click "Edit Configuration" to adjust approval processes.</p>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render appropriate view based on active tab
  switch (activeTab) {
    case 'audit-types':
      return renderAuditTypes();
    case 'tax-types':
      return renderTaxTypes();
    case 'industries':
      return renderGenericConfigTable('industries', 'Industries', 'fas fa-industry', auditConfig.industries, [
        { key: 'name', label: 'Industry Name' },
        { key: 'riskScore', label: 'Risk Score (0-100)', type: 'number' },
        { key: 'compliance', label: 'Compliance Level (%)', type: 'number' }
      ], () => {
        const newItem = { id: `ind_${Date.now()}`, name: 'New Industry', riskScore: 50, compliance: 50 };
        auditConfig.industries.unshift(newItem);
        return newItem;
      }, 'Configure risk and compliance thresholds per industry.');
    case 'taxpayer-categories':
      return renderGenericConfigTable('taxpayer-categories', 'Taxpayer Categories', 'fas fa-users', auditConfig.taxpayerCategories, [
        { key: 'name', label: 'Category' },
        { key: 'annualTurnover', label: 'Annual Turnover' },
        { key: 'auditFrequency', label: 'Audit Frequency (Years)', type: 'number' },
        { key: 'description', label: 'Description' }
      ], () => {
        const newItem = { id: `cat_${Date.now()}`, name: 'New Category', annualTurnover: 'Variable', auditFrequency: 1, description: 'Desc' };
        auditConfig.taxpayerCategories.unshift(newItem);
        return newItem;
      }, 'Configure classification rules for taxpayers.');
    case 'skills':
    case 'auditor-skills':
      return renderGenericConfigTable('skills', 'Auditor Skills', 'fas fa-graduation-cap', auditConfig.skills, [
        { key: 'name', label: 'Skill Name' },
        { key: 'level', label: 'Level (1-5)', type: 'number' },
        { key: 'category', label: 'Category' }
      ], () => {
        const newItem = { id: `skill_${Date.now()}`, name: 'New Skill', level: 1, category: 'General' };
        auditConfig.skills.unshift(newItem);
        return newItem;
      }, 'Configure taxonomy of auditor skills required for complex audits.');
    case 'risk-indicators':
      return renderGenericConfigTable('risk-indicators', 'Risk Indicators', 'fas fa-exclamation-circle', auditConfig.riskIndicators, [
        { key: 'name', label: 'Indicator' },
        { key: 'weight', label: 'Weight Multiplier', type: 'number' },
        { key: 'description', label: 'Description' }
      ], () => {
        const newItem = { id: `risk_${Date.now()}`, name: 'New Risk', weight: 1.0, description: 'Description', sources: [] };
        auditConfig.riskIndicators.unshift(newItem);
        return newItem;
      }, 'Configure weights for automated risk profiling engine.');
    case 'capacity':
    case 'capacity-planning':
      return renderCapacity();
    case 'regions':
      return renderRegions();
    case 'standards':
      return renderPlaceholder('Audit Quality Standards', 'fas fa-certificate');
    case 'workflow':
      return renderWorkflow();
    case 'risk-thresholds':
      return renderPlaceholder('Risk & Compliance Thresholds', 'fas fa-sliders-h');
    case 'feature-flags':
      return renderPlaceholder('Feature Flags', 'fas fa-toggle-on');
    case 'data-management':
      return renderDataManagement();
    case 'regional-risk':
      return renderPlaceholder('Regional Risk Profiles', 'fas fa-chart-line');
    case 'tax-center-capacity':
      return renderPlaceholder('Tax Center Capacities', 'fas fa-building');
    case 'allocation-rules':
      return renderPlaceholder('Allocation Rules', 'fas fa-balance-scale');
    case 'team-formation':
      return renderPlaceholder('Team Formation', 'fas fa-users-cog');
    case 'auditor-skills':
      return renderPlaceholder('Auditor Skills', 'fas fa-user-graduate');
    case 'capacity-planning':
      return renderPlaceholder('Capacity & Leave', 'fas fa-calendar-alt');
    default:
      return renderOverview();
  }
}

export default ConfigurationView;
