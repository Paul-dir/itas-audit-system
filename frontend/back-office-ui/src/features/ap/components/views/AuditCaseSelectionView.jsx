import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import { useData } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

/**
 * AuditCaseSelectionView - Process Owner View
 * Displays audit cases selected by Risk Engine based on risk ranking
 * Allows filtering, random selection, and case management
 */

function AuditCaseSelectionView() {
  const { getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();

  const [allCases, setAllCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [selectedCases, setSelectedCases] = useState(new Set());
  
  // Filters
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterSegment, setFilterSegment] = useState('All');
  const [filterAuditType, setFilterAuditType] = useState('All');
  const [filterRiskLevel, setFilterRiskLevel] = useState('All');
  const [filterSource, setFilterSource] = useState('All'); // All, Risk Engine, Audit Requests
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sorting & Pagination
  const [sortBy, setSortBy] = useState('risk_score'); // risk_score, taxpayer_name, revenue
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Load cases from localStorage
  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = () => {
    // Using data from hook
    
    // Load risk engine / cascade plan cases that need prioritization
    const riskEngineCases = (data.auditCases || []).filter(c => 
      (!c.createdFrom || c.createdFrom !== 'AUDIT_REQUEST') && 
      c.status !== 'ASSIGNED_TO_TEAM_LEADER' &&
      c.storageStatus !== 'STORED'
    );
    
    // Load request-based cases (approved requests that created cases)
    const requestCases = (data.auditCases || []).filter(c => 
      c.createdFrom === 'AUDIT_REQUEST' && 
      c.status !== 'ASSIGNED_TO_TEAM_LEADER' &&
      c.storageStatus !== 'STORED'
    );
    
    // Combine all cases
    const allCombinedCases = [...riskEngineCases, ...requestCases];
    
    console.log('📊 AuditCaseSelectionView - Cases loaded:', {
      total: allCombinedCases.length,
      riskEngine: riskEngineCases.length,
      requests: requestCases.length,
      cases: allCombinedCases.map(c => ({ id: c.id, risk: c.riskLevel, type: c.auditType, source: c.createdFrom || 'RISK_ENGINE' }))
    });
    
    setAllCases(allCombinedCases);
  };

  // Apply filters
  useEffect(() => {
    let filtered = allCases;

    if (filterBranch !== 'All') {
      filtered = filtered.filter(c => c.region === filterBranch);
    }

    if (filterSegment !== 'All') {
      filtered = filtered.filter(c => c.taxpayerSegment === filterSegment || (filterSegment === 'All Segments' && true));
    }

    if (filterAuditType !== 'All') {
      filtered = filtered.filter(c => c.auditType === filterAuditType);
    }

    if (filterRiskLevel !== 'All') {
      filtered = filtered.filter(c => c.riskLevel === filterRiskLevel);
    }

    if (filterSource !== 'All') {
      if (filterSource === 'Risk Engine') {
        filtered = filtered.filter(c => !c.createdFrom || c.createdFrom !== 'AUDIT_REQUEST');
      } else if (filterSource === 'Audit Requests') {
        filtered = filtered.filter(c => c.createdFrom === 'AUDIT_REQUEST');
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.tin.includes(searchTerm) ||
        c.taxpayerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.includes(searchTerm)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let aVal, bVal;
      
      if (sortBy === 'risk_score') {
        const riskOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        aVal = riskOrder[a.riskLevel] || 0;
        bVal = riskOrder[b.riskLevel] || 0;
      } else if (sortBy === 'taxpayer_name') {
        aVal = a.taxpayerName;
        bVal = b.taxpayerName;
      } else if (sortBy === 'revenue') {
        aVal = a.revenueAtRisk || 0;
        bVal = b.revenueAtRisk || 0;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredCases(sorted);
    setCurrentPage(1);
  }, [allCases, filterBranch, filterSegment, filterAuditType, filterRiskLevel, filterSource, searchTerm, sortBy, sortOrder]);

  // Get unique filter options
  const getBranches = () => ['All', ...new Set(allCases.map(c => c.region))];
  const getSegments = () => ['All', 'Large Taxpayer', 'Medium Taxpayer', 'Small Taxpayer', 'Micro Taxpayer'];
  const getAuditTypes = () => ['All', ...new Set(allCases.map(c => c.auditType))];
  const getRiskLevels = () => ['All', 'Critical', 'High', 'Medium', 'Low'];
  const getSources = () => ['All', 'Risk Engine', 'Audit Requests'];

  // Calculate statistics
  const getStats = () => {
    const riskLevels = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    const auditTypes = {};
    let totalRevenue = 0;
    
    filteredCases.forEach(c => {
      if (riskLevels.hasOwnProperty(c.riskLevel)) riskLevels[c.riskLevel]++;
      auditTypes[c.auditType] = (auditTypes[c.auditType] || 0) + 1;
      totalRevenue += c.revenueAtRisk || 0;
    });

    return { riskLevels, auditTypes, totalRevenue };
  };

  // Random selection
  const handleRandomSelection = (count = 10) => {
    const available = filteredCases.filter(c => !selectedCases.has(c.id));
    if (available.length === 0) {
      alert('No more cases available to randomly select');
      return;
    }

    const selectCount = Math.min(count, available.length);
    const newSelected = new Set(selectedCases);
    
    for (let i = 0; i < selectCount; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      newSelected.add(available[randomIndex].id);
      available.splice(randomIndex, 1);
    }

    setSelectedCases(newSelected);
    alert(`✓ Randomly selected ${selectCount} cases`);
  };

  // Toggle case selection
  const toggleCaseSelection = (caseId) => {
    const newSelected = new Set(selectedCases);
    if (newSelected.has(caseId)) {
      newSelected.delete(caseId);
    } else {
      newSelected.add(caseId);
    }
    setSelectedCases(newSelected);
  };

  // Select/Deselect all visible
  const handleSelectAll = () => {
    if (selectedCases.size === filteredCases.length) {
      setSelectedCases(new Set());
    } else {
      const allIds = new Set(filteredCases.map(c => c.id));
      setSelectedCases(allIds);
    }
  };

  // Prioritize, Rank and Auto-Assign cases to Team Leaders
  const handleStoreSelectedCases = () => {
    if (selectedCases.size === 0) {
      alert('Please select at least one case');
      return;
    }

    console.log('=== AUTO-ASSIGN CASES START ===');
    // Using data from hook
    
    // Initialize Team Leaders if empty for this tax center
    if (!data.teamLeaders) data.teamLeaders = [];
    if (!data.assignments) data.assignments = [];

    const casesToProcess = Array.from(selectedCases)
      .map(caseId => allCases.find(c => c.id === caseId))
      .filter(c => c !== null)
      .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));

    // Dynamic Team Leader assignment tracking
    const tlAssignmentCounters = {}; 

    casesToProcess.forEach((auditCase, index) => {
      const caseIdx = data.auditCases.findIndex(c => c.id === auditCase.id);
      
      if (caseIdx !== -1) {
        // 1. Process Owner Prioritizes and Ranks
        data.auditCases[caseIdx].priorityRank = index + 1;
        data.auditCases[caseIdx].storageStatus = 'STORED';
        data.auditCases[caseIdx].storedDate = new Date().toISOString();
        data.auditCases[caseIdx].storedBy = userInfo?.fullName || 'Process Owner';
        
        // 2. Map to Team Leader based on Audit Type
        const taxCenter = auditCase.taxCenter || 'Unknown-TC';
        const region = auditCase.region || 'Unknown-Region';
        const auditTypeKey = auditCase.auditType.toLowerCase().replace(/\s+/g, '_');
        
        // Find existing team leaders for this tax center and audit type
        let matchingTLs = data.teamLeaders.filter(tl => 
          tl.taxCenter === taxCenter && tl.auditType === auditTypeKey
        );
        
        // If no TL exists, create dynamic ones for this tax center/audit type
        if (matchingTLs.length === 0) {
          const newTL = {
            id: `TL-${auditTypeKey.toUpperCase()}-${taxCenter.replace(/\s+/g, '-')}-001`,
            region,
            taxCenter,
            auditType: auditTypeKey,
            fullName: `${auditCase.auditType} Team Leader (${taxCenter} - TL-1)`,
            email: `tl.${auditTypeKey}@mor.gov.et`,
            currentWorkload: 0,
            maxCapacity: 12,
            status: 'ACTIVE'
          };
          data.teamLeaders.push(newTL);
          matchingTLs = [newTL];
        }

        // Round robin assignment if multiple TLs exist
        const tlGroupKey = `${taxCenter}-${auditTypeKey}`;
        if (tlAssignmentCounters[tlGroupKey] === undefined) {
          tlAssignmentCounters[tlGroupKey] = 0;
        } else {
          tlAssignmentCounters[tlGroupKey] = (tlAssignmentCounters[tlGroupKey] + 1) % matchingTLs.length;
        }
        
        const selectedTL = matchingTLs[tlAssignmentCounters[tlGroupKey]];
        
        // Update case status
        data.auditCases[caseIdx].assignedTeamLeader = selectedTL.fullName;
        data.auditCases[caseIdx].assignedTeamLeaderId = selectedTL.id;
        data.auditCases[caseIdx].status = 'ASSIGNED_TO_TEAM_LEADER';
        
        // Create Assignment Object for the system
        const existingAssignmentIdx = data.assignments.findIndex(a => a.caseId === auditCase.id);
        const newAssignment = {
          id: `ASN-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          caseId: auditCase.id,
          region,
          taxCenter,
          auditType: auditTypeKey,
          currentState: 'ASSIGNED_TO_TEAM_LEADER',
          currentOwner: selectedTL.id,
          currentOwnerRole: 'TEAM_LEADER',
          history: [{
            state: 'ASSIGNED_TO_TEAM_LEADER',
            date: new Date().toISOString(),
            byUser: userInfo?.id || 'PROCESS_OWNER',
            notes: `Auto-assigned by Process Owner (Rank ${index + 1})`
          }]
        };

        if (existingAssignmentIdx >= 0) {
          data.assignments[existingAssignmentIdx] = newAssignment;
        } else {
          data.assignments.push(newAssignment);
        }

        console.log(`Assigned case ${auditCase.id} to TL: ${selectedTL.fullName}`);
      }
    });

    // Save to localStorage
    updateData(data);

    console.log('=== AUTO-ASSIGN CASES END ===');

    // Show success message with details
    alert(`✅ Successfully Prioritized and Auto-Assigned ${casesToProcess.length} cases to respective Team Leaders!`);
    
    setSelectedCases(new Set());
    loadCases();
  };

  // Pagination
  const paginatedCases = filteredCases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const stats = getStats();

  const getRiskColor = (riskLevel) => {
    const colors = {
      'Critical': '#ff5252',
      'High': '#ff9800',
      'Medium': '#ffc107',
      'Low': '#4caf50'
    };
    return colors[riskLevel] || '#999';
  };

  return (
    <div style={{ padding: '24px' }}>
      <div className="detail-header">
        <h2><i className="fas fa-list-check"></i> Audit Case Selection</h2>
        <Badge status={`${filteredCases.length} Cases`} className="director-approved" />
      </div>

      {/* Summary Info */}
      <div style={{ background: '#e3f2fd', color: '#0c4a6e', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #1976d2' }}>
        <strong style={{ color: '#0c4a6e' }}><i className="fas fa-info-circle"></i> Audit Cases - Multiple Sources</strong>
        <p style={{ color: '#0c4a6e', margin: '8px 0 0 0', fontSize: '13px', lineHeight: '1.6' }}>
          View and select audit cases from both Risk Engine and approved audit requests. Total cases available: <strong>{allCases.length}</strong> | 
          Risk Engine: <strong>{allCases.filter(c => !c.createdFrom || c.createdFrom !== 'AUDIT_REQUEST').length}</strong> | 
          Audit Requests: <strong>{allCases.filter(c => c.createdFrom === 'AUDIT_REQUEST').length}</strong> | 
          Selected: <strong>{selectedCases.size}</strong>
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="cards" style={{ marginBottom: '24px' }}>
        <Card title="Total Cases" number={filteredCases.length} icon="fas fa-list-check" />
        <Card title="Critical Risk" number={stats.riskLevels.Critical} icon="fas fa-exclamation-circle" />
        <Card title="High Risk" number={stats.riskLevels.High} icon="fas fa-warning" />
        <Card title="Revenue at Risk" number={`${(stats.totalRevenue / 1000000).toFixed(1)}M`} icon="fas fa-money-bill" />
      </div>

      {/* Filters */}
      <div style={{
        background: '#1c2128',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '24px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search TIN, name, or case ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '180px',
            padding: '8px 12px',
            border: '1px solid #30363d',
            borderRadius: '6px',
            background: '#0f1419',
            color: '#f0f6fc',
            fontSize: '12px'
          }}
        />

        <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #30363d',
            borderRadius: '6px',
            background: '#0f1419',
            color: '#f0f6fc',
            fontSize: '12px'
          }}>
          {getBranches().map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>

        <select value={filterAuditType} onChange={(e) => setFilterAuditType(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #30363d',
            borderRadius: '6px',
            background: '#0f1419',
            color: '#f0f6fc',
            fontSize: '12px'
          }}>
          {getAuditTypes().map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select value={filterRiskLevel} onChange={(e) => setFilterRiskLevel(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #30363d',
            borderRadius: '6px',
            background: '#0f1419',
            color: '#f0f6fc',
            fontSize: '12px'
          }}>
          {getRiskLevels().map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #30363d',
            borderRadius: '6px',
            background: '#0f1419',
            color: '#f0f6fc',
            fontSize: '12px'
          }}>
          {getSources().map(source => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>

        <button
          onClick={() => {
            setSearchTerm('');
            setFilterBranch('All');
            setFilterSegment('All');
            setFilterAuditType('All');
            setFilterRiskLevel('All');
            setFilterSource('All');
          }}
          style={{
            padding: '8px 12px',
            border: '1px solid #30363d',
            borderRadius: '6px',
            background: '#0f1419',
            color: '#8b949e',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Actions */}
      <div style={{
        background: '#1a3a1a',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '24px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <button
          onClick={() => handleRandomSelection(10)}
          style={{
            padding: '8px 14px',
            background: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-random"></i> Random Select (10)
        </button>

        <button
          onClick={handleSelectAll}
          style={{
            padding: '8px 14px',
            background: '#2196f3',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-check-square"></i> {selectedCases.size === filteredCases.length ? 'Deselect' : 'Select'} All
        </button>

        {selectedCases.size > 0 && (
          <button
            onClick={handleStoreSelectedCases}
            style={{
              padding: '8px 14px',
              background: '#ff9800',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              marginLeft: 'auto'
            }}
          >
            <i className="fas fa-save"></i> Prioritize & Auto-Assign {selectedCases.size} Cases
          </button>
        )}
      </div>

      {/* Sort Options */}
      <div style={{
        background: '#0f1419',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '12px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        fontSize: '12px',
        color: '#8b949e'
      }}>
        <span>Sort by:</span>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '4px 8px',
            border: '1px solid #30363d',
            borderRadius: '4px',
            background: '#1c2128',
            color: '#f0f6fc',
            fontSize: '11px'
          }}>
          <option value="risk_score">Risk Score</option>
          <option value="taxpayer_name">Taxpayer Name</option>
          <option value="revenue">Revenue at Risk</option>
        </select>
        
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          style={{
            padding: '4px 8px',
            border: '1px solid #30363d',
            borderRadius: '4px',
            background: '#1c2128',
            color: '#8b949e',
            fontSize: '11px',
            cursor: 'pointer'
          }}
        >
          {sortOrder === 'desc' ? '↓ Descending' : '↑ Ascending'}
        </button>
      </div>

      {/* Cases Table */}
      <div className="table-container" style={{ marginBottom: '24px' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedCases.size === filteredCases.length && filteredCases.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>CASE ID</th>
              <th>TIN</th>
              <th>TAXPAYER</th>
              <th>BRANCH</th>
              <th>AUDIT TYPE</th>
              <th>RISK</th>
              <th>SOURCE</th>
              <th>REVENUE</th>
              <th>EST. HOURS</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCases.map(auditCase => (
              <tr key={auditCase.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCases.has(auditCase.id)}
                    onChange={() => toggleCaseSelection(auditCase.id)}
                  />
                </td>
                <td><strong style={{ color: '#4caf50' }}>{auditCase.id?.substring(0, 25)}...</strong></td>
                <td>{auditCase.tin}</td>
                <td>{auditCase.taxpayerName}</td>
                <td>{auditCase.region}</td>
                <td>{auditCase.auditType}</td>
                <td>
                  <span style={{
                    background: getRiskColor(auditCase.riskLevel),
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {auditCase.riskLevel}
                  </span>
                </td>
                <td>
                  <span style={{
                    background: auditCase.createdFrom === 'AUDIT_REQUEST' ? '#ff9800' : '#4a8fd9',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {auditCase.createdFrom === 'AUDIT_REQUEST' ? '🔔 Request' : '⚙️ Risk Engine'}
                  </span>
                </td>
                <td>{(auditCase.revenueAtRisk / 1000000).toFixed(1)}M</td>
                <td>{auditCase.estimatedHours}</td>
                <td>{auditCase.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        fontSize: '12px',
        color: '#8b949e'
      }}>
        <span>Showing {paginatedCases.length} of {filteredCases.length} cases</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                padding: '4px 8px',
                border: '1px solid #30363d',
                borderRadius: '4px',
                background: currentPage === page ? '#4a8fd9' : '#0f1419',
                color: currentPage === page ? '#fff' : '#8b949e',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div style={{
        background: '#e3f2fd', color: '#0c4a6e',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #1976d2',
        color: '#0c4a6e'
      }}>
        <strong style={{ color: '#0c4a6e' }}><i className="fas fa-chart-bar"></i> Case Selection Summary</strong>
        <p style={{ color: '#0c4a6e', margin: '8px 0 0 0', fontSize: '13px', lineHeight: '1.6' }}>
          Total Cases: <strong>{filteredCases.length}</strong> | Selected: <strong>{selectedCases.size}</strong> | 
          Critical: <strong>{stats.riskLevels.Critical}</strong> | High: <strong>{stats.riskLevels.High}</strong> |
          Total Revenue at Risk: <strong>{(stats.totalRevenue / 1000000).toFixed(1)}M ETB</strong>
        </p>
      </div>
    </div>
  );
}

export default AuditCaseSelectionView;
