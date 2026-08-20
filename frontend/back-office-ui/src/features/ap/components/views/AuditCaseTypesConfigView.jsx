import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import { useData } from '../../services/dataService';

/**
 * AuditCaseTypesConfigView - Process Owner
 * Define and configure audit case types with scope, coverage, duration, etc.
 */

function AuditCaseTypesConfigView() {
  const [caseTypes, setCaseTypes] = useState([]);
  const { data, updateData } = useData();
  const [editingId, setEditingId] = useState(null);
  const [newType, setNewType] = useState({
    id: '',
    name: '',
    description: '',
    scope: '',
    coverage: '',
    estimatedDuration: 0,
    minDuration: 0,
    maxDuration: 0,
    riskLevel: 'Medium',
    complexity: 'Medium',
    requiredCertifications: [],
    resourceRequirement: 0,
    status: 'Active'
  });

  useEffect(() => {
    loadCaseTypes();
  }, []);

  const loadCaseTypes = () => {
    // Using data from hook
    if (!data.auditCaseTypes) {
      data.auditCaseTypes = getDefaultCaseTypes();
      updateData(data);
    }
    setCaseTypes(data.auditCaseTypes);
  };

  const getDefaultCaseTypes = () => [
    {
      id: 'desk_audit',
      name: 'Desk Audit',
      description: 'Audit performed primarily using desk-based analysis',
      scope: 'Review of documents, records, and systems without physical visit',
      coverage: '20-50 taxpayers per batch',
      estimatedDuration: 30,
      minDuration: 20,
      maxDuration: 45,
      riskLevel: 'Low',
      complexity: 'Low',
      requiredCertifications: [],
      resourceRequirement: 1,
      status: 'Active'
    },
    {
      id: 'field_audit',
      name: 'Field Audit',
      description: 'Comprehensive audit with physical inspection',
      scope: 'On-site verification of books, records, and physical assets',
      coverage: '10-20 taxpayers per batch',
      estimatedDuration: 60,
      minDuration: 45,
      maxDuration: 90,
      riskLevel: 'Medium',
      complexity: 'Medium',
      requiredCertifications: ['CAP', 'CPA'],
      resourceRequirement: 2,
      status: 'Active'
    },
    {
      id: 'comprehensive_audit',
      name: 'Comprehensive Audit',
      description: 'Deep-dive audit covering all aspects of operations',
      scope: 'Complete review of business operations, financials, and compliance',
      coverage: '5-10 taxpayers per batch',
      estimatedDuration: 120,
      minDuration: 90,
      maxDuration: 180,
      riskLevel: 'High',
      complexity: 'High',
      requiredCertifications: ['CAP', 'CPA', 'ACPA'],
      resourceRequirement: 3,
      status: 'Active'
    },
    {
      id: 'transfer_pricing_audit',
      name: 'Transfer Pricing Audit',
      description: 'Audit focused on inter-company transactions and pricing',
      scope: 'Analysis of transfer pricing policies and arm\'s length principle compliance',
      coverage: '2-5 multinational entities',
      estimatedDuration: 90,
      minDuration: 60,
      maxDuration: 150,
      riskLevel: 'High',
      complexity: 'Very High',
      requiredCertifications: ['CAP', 'CPA', 'TP_CERT'],
      resourceRequirement: 4,
      status: 'Active'
    },
    {
      id: 'issue_audit',
      name: 'Issue Audit',
      description: 'Focused audit on specific tax issues or discrepancies',
      scope: 'Investigation of specific compliance issues or abnormalities',
      coverage: '10-30 cases per batch',
      estimatedDuration: 45,
      minDuration: 30,
      maxDuration: 75,
      riskLevel: 'Medium',
      complexity: 'Medium',
      requiredCertifications: [],
      resourceRequirement: 1,
      status: 'Active'
    },
    {
      id: 'joint_audit',
      name: 'Joint Audit',
      description: 'Multi-disciplinary audit with various expertise',
      scope: 'Combined expertise audit (tax, customs, internal audit)',
      coverage: '5-15 complex entities',
      estimatedDuration: 75,
      minDuration: 50,
      maxDuration: 120,
      riskLevel: 'High',
      complexity: 'High',
      requiredCertifications: ['CAP', 'CPA'],
      resourceRequirement: 3,
      status: 'Active'
    }
  ];

  const handleEditType = (type) => {
    setEditingId(type.id);
    setNewType(type);
  };

  const handleSaveType = () => {
    if (!newType.name || !newType.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Using data from hook
    if (!data.auditCaseTypes) {
      data.auditCaseTypes = [];
    }

    const index = data.auditCaseTypes.findIndex(t => t.id === newType.id);
    if (index >= 0) {
      data.auditCaseTypes[index] = newType;
    } else {
      data.auditCaseTypes.push(newType);
    }

    updateData(data);
    loadCaseTypes();
    setEditingId(null);
    setNewType(getEmptyType());
    alert('✓ Case type saved successfully');
  };

  const handleDeleteType = (id) => {
    if (window.confirm('Are you sure you want to delete this case type?')) {
      // Using data from hook
      data.auditCaseTypes = data.auditCaseTypes.filter(t => t.id !== id);
      updateData(data);
      loadCaseTypes();
      alert('✓ Case type deleted');
    }
  };

  const handleAddNew = () => {
    setEditingId('new');
    setNewType(getEmptyType());
  };

  const getEmptyType = () => ({
    id: `case_type_${Date.now()}`,
    name: '',
    description: '',
    scope: '',
    coverage: '',
    estimatedDuration: 0,
    minDuration: 0,
    maxDuration: 0,
    riskLevel: 'Medium',
    complexity: 'Medium',
    requiredCertifications: [],
    resourceRequirement: 0,
    status: 'Active'
  });

  const handleCancel = () => {
    setEditingId(null);
    setNewType(getEmptyType());
  };

  if (editingId) {
    return (
      <div style={{ padding: '24px' }}>
        <div className="detail-header">
          <h2><i className="fas fa-cogs"></i> {editingId === 'new' ? 'Add New' : 'Edit'} Audit Case Type</h2>
          <Badge status={editingId === 'new' ? 'New' : 'Editing'} className="director-approved" />
        </div>

        <div style={{
          background: '#1c2128',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '24px',
          border: '1px solid #30363d'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Case Type ID
              </label>
              <input
                type="text"
                value={newType.id}
                onChange={(e) => setNewType({ ...newType, id: e.target.value })}
                placeholder="desk_audit"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  background: '#0f1419',
                  color: '#f0f6fc',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Case Type Name
              </label>
              <input
                type="text"
                value={newType.name}
                onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                placeholder="Desk Audit"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  background: '#0f1419',
                  color: '#f0f6fc',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              value={newType.description}
              onChange={(e) => setNewType({ ...newType, description: e.target.value })}
              placeholder="Describe this audit case type..."
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #30363d',
                borderRadius: '6px',
                background: '#0f1419',
                color: '#f0f6fc',
                fontSize: '13px',
                minHeight: '80px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Scope
              </label>
              <textarea
                value={newType.scope}
                onChange={(e) => setNewType({ ...newType, scope: e.target.value })}
                placeholder="What is included in this audit?"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  background: '#0f1419',
                  color: '#f0f6fc',
                  fontSize: '12px',
                  minHeight: '60px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Coverage
              </label>
              <textarea
                value={newType.coverage}
                onChange={(e) => setNewType({ ...newType, coverage: e.target.value })}
                placeholder="How many entities/cases per batch?"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  background: '#0f1419',
                  color: '#f0f6fc',
                  fontSize: '12px',
                  minHeight: '60px',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Est. Duration (days)
              </label>
              <input
                type="number"
                value={newType.estimatedDuration}
                onChange={(e) => setNewType({ ...newType, estimatedDuration: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  background: '#0f1419',
                  color: '#f0f6fc',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Min Duration (days)
              </label>
              <input
                type="number"
                value={newType.minDuration}
                onChange={(e) => setNewType({ ...newType, minDuration: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  background: '#0f1419',
                  color: '#f0f6fc',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Max Duration (days)
              </label>
              <input
                type="number"
                value={newType.maxDuration}
                onChange={(e) => setNewType({ ...newType, maxDuration: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  background: '#0f1419',
                  color: '#f0f6fc',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Resource Requirement
              </label>
              <input
                type="number"
                value={newType.resourceRequirement}
                onChange={(e) => setNewType({ ...newType, resourceRequirement: parseInt(e.target.value) || 0 })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  background: '#0f1419',
                  color: '#f0f6fc',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Risk Level
              </label>
              <select
                value={newType.riskLevel}
                onChange={(e) => setNewType({ ...newType, riskLevel: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  background: '#0f1419',
                  color: '#f0f6fc',
                  fontSize: '13px'
                }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#8b949e', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                Complexity Level
              </label>
              <select
                value={newType.complexity}
                onChange={(e) => setNewType({ ...newType, complexity: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  background: '#0f1419',
                  color: '#f0f6fc',
                  fontSize: '13px'
                }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={handleCancel}
              style={{
                padding: '10px 20px',
                border: '1px solid #30363d',
                borderRadius: '6px',
                background: '#0f1419',
                color: '#8b949e',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveType}
              style={{
                padding: '10px 20px',
                background: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-save"></i> Save Case Type
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div className="detail-header">
        <h2><i className="fas fa-cogs"></i> Audit Case Types Configuration</h2>
        <Badge status={`${caseTypes.length} Types`} className="director-approved" />
      </div>

      {/* Summary */}
      <div style={{ background: '#e3f2fd', color: '#0c4a6e', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #1976d2' }}>
        <strong style={{ color: '#0c4a6e' }}><i className="fas fa-info-circle"></i> Case Type Management</strong>
        <p style={{ color: '#0c4a6e', margin: '8px 0 0 0', fontSize: '13px', lineHeight: '1.6' }}>
          Define and configure audit case types, including scope, coverage, estimated duration, and other parameters.
          Total Types: <strong>{caseTypes.length}</strong>
        </p>
      </div>

      {/* Add New Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleAddNew}
          style={{
            padding: '10px 20px',
            background: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-plus"></i> Add New Case Type
        </button>
      </div>

      {/* Case Types Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>CASE TYPE</th>
              <th>DESCRIPTION</th>
              <th>SCOPE</th>
              <th>COVERAGE</th>
              <th>EST. DURATION</th>
              <th>COMPLEXITY</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {caseTypes.map(type => (
              <tr key={type.id}>
                <td><strong>{type.name}</strong></td>
                <td style={{ fontSize: '12px', maxWidth: '200px' }}>{type.description}</td>
                <td style={{ fontSize: '12px', maxWidth: '180px', color: '#a0aec0' }}>{type.scope}</td>
                <td style={{ fontSize: '12px' }}>{type.coverage}</td>
                <td>
                  <span style={{
                    background: '#e3f2fd',
                    color: '#0c4a6e',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {type.minDuration}-{type.maxDuration} days
                  </span>
                </td>
                <td>
                  <span style={{
                    background: type.complexity === 'Very High' ? '#ffebee' : type.complexity === 'High' ? '#fff3e0' : type.complexity === 'Medium' ? '#fff9c4' : '#e8f5e9',
                    color: type.complexity === 'Very High' ? '#c62828' : type.complexity === 'High' ? '#e65100' : type.complexity === 'Medium' ? '#f57f17' : '#2e7d32',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {type.complexity}
                  </span>
                </td>
                <td>{type.status}</td>
                <td>
                  <button
                    onClick={() => handleEditType(type)}
                    style={{
                      padding: '4px 8px',
                      background: '#2196f3',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      marginRight: '4px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteType(type.id)}
                    style={{
                      padding: '4px 8px',
                      background: '#f44336',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={{
        background: '#1a3a1a',
        color: '#4caf50',
        padding: '16px',
        borderRadius: '8px',
        marginTop: '24px',
        border: '1px solid #388e3c'
      }}>
        <strong><i className="fas fa-chart-bar"></i> Configuration Summary</strong>
        <p style={{ color: '#a8d5a8', margin: '8px 0 0 0', fontSize: '13px', lineHeight: '1.6' }}>
          Total Audit Case Types: <strong>{caseTypes.length}</strong> | 
          Active: <strong>{caseTypes.filter(t => t.status === 'Active').length}</strong>
        </p>
      </div>
    </div>
  );
}

export default AuditCaseTypesConfigView;
