import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Badge from '../Badge';
import { useData } from '../../services/dataService';

/**
 * StoredCasesView
 * Displays all audit cases stored for execution with filtering, sorting, and removal capabilities.
 * Features: risk level filtering, audit type selection, revenue tracking, and pagination.
 * Design: Dark theme with navy background and teal/coral accents for status indicators.
 * Styling: 100% Tailwind CSS with dark mode support.
 */

function StoredCasesView() {
  const [storedCases, setStoredCases] = useState([]);
  const { data, updateData } = useData();
  const [filteredCases, setFilteredCases] = useState([]);
  
  // Filters
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterAuditType, setFilterAuditType] = useState('All');
  const [filterRiskLevel, setFilterRiskLevel] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sorting & Pagination
  const [sortBy, setSortBy] = useState('stored_date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Load stored cases
  useEffect(() => {
    loadStoredCases();
  }, []);

  const loadStoredCases = () => {
    // Using data from hook
    const cases = data.storedAuditCases || [];
    
    console.log('📦 StoredCasesView - Cases loaded:', {
      total: cases.length,
      cases: cases.map(c => ({ id: c.id, taxpayer: c.taxpayerName, storedId: c.storedId }))
    });
    
    setStoredCases(cases);
  };

  // Apply filters
  useEffect(() => {
    let filtered = storedCases;

    if (filterBranch !== 'All') {
      filtered = filtered.filter(c => c.region === filterBranch);
    }

    if (filterAuditType !== 'All') {
      filtered = filtered.filter(c => c.auditType === filterAuditType);
    }

    if (filterRiskLevel !== 'All') {
      filtered = filtered.filter(c => c.riskLevel === filterRiskLevel);
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
      
      if (sortBy === 'stored_date') {
        aVal = new Date(a.storedDate || '');
        bVal = new Date(b.storedDate || '');
      } else if (sortBy === 'risk_score') {
        const riskOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        aVal = riskOrder[a.riskLevel] || 0;
        bVal = riskOrder[b.riskLevel] || 0;
      } else if (sortBy === 'taxpayer_name') {
        aVal = a.taxpayerName;
        bVal = b.taxpayerName;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredCases(sorted);
    setCurrentPage(1);
  }, [storedCases, filterBranch, filterAuditType, filterRiskLevel, searchTerm, sortBy, sortOrder]);

  // Get unique filter options
  const getBranches = () => ['All', ...new Set(storedCases.map(c => c.region))];
  const getAuditTypes = () => ['All', ...new Set(storedCases.map(c => c.auditType))];
  const getRiskLevels = () => ['All', 'Critical', 'High', 'Medium', 'Low'];

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

  // Remove a stored case
  const handleRemoveCase = (storedId) => {
    if (!window.confirm('Remove this case from storage?')) return;

    // Using data from hook
    data.storedAuditCases = data.storedAuditCases.filter(c => c.storedId !== storedId);
    updateData(data);
    
    loadStoredCases();
    alert('✓ Case removed from storage');
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-ink dark:bg-ink p-8">
      <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-gold dark:border-gold">
        <h2 className="text-3xl font-bold text-text-hi dark:text-text-hi">
          <i className="fas fa-folder-open mr-3"></i> Stored Cases
        </h2>
        <Badge status={`${filteredCases.length} Cases`} className="director-approved" />
      </div>

      {storedCases.length === 0 ? (
        <div className="bg-panel dark:bg-panel-dark border border-border dark:border-border-dark rounded-sm p-10 text-center">
          <i className="fas fa-inbox text-text-mid dark:text-text-mid text-5xl mb-4 block"></i>
          <h3 className="text-text-hi dark:text-text-hi text-lg font-semibold mb-2">No Stored Cases Yet</h3>
          <p className="text-text-mid dark:text-text-mid text-sm">
            Go to "Audit Case Selection" to select and store cases for audit execution.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Info */}
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-500 dark:border-blue-600 rounded-sm p-4 mb-6 text-blue-900 dark:text-blue-100">
            <strong className="text-blue-900 dark:text-blue-100">
              <i className="fas fa-check-circle mr-2"></i> Stored Cases Ready for Audit
            </strong>
            <p className="text-blue-900 dark:text-blue-100 text-sm leading-relaxed mt-2">
              These cases have been selected and stored for audit execution. 
              Total stored: <strong>{storedCases.length}</strong> cases | Displayed: <strong>{filteredCases.length}</strong>
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card title="Total Stored" number={filteredCases.length} icon="fas fa-inbox" />
            <Card title="Critical Risk" number={stats.riskLevels.Critical} icon="fas fa-exclamation-circle" />
            <Card title="High Risk" number={stats.riskLevels.High} icon="fas fa-warning" />
            <Card title="Revenue at Risk" number={`${(stats.totalRevenue / 1000000).toFixed(1)}M`} icon="fas fa-money-bill" />
          </div>

          {/* Filters */}
          <div className="bg-panel dark:bg-panel-dark border border-border dark:border-border-dark rounded-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search TIN, name, or case ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[180px] px-3 py-2 border border-border dark:border-border-dark rounded-sm bg-ink dark:bg-ink text-text-hi dark:text-text-hi text-sm focus:outline-none focus:border-gold"
            />

            <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}
              className="px-3 py-2 border border-border dark:border-border-dark rounded-sm bg-ink dark:bg-ink text-text-hi dark:text-text-hi text-sm focus:outline-none focus:border-gold">
              {getBranches().map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>

            <select value={filterAuditType} onChange={(e) => setFilterAuditType(e.target.value)}
              className="px-3 py-2 border border-border dark:border-border-dark rounded-sm bg-ink dark:bg-ink text-text-hi dark:text-text-hi text-sm focus:outline-none focus:border-gold">
              {getAuditTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select value={filterRiskLevel} onChange={(e) => setFilterRiskLevel(e.target.value)}
              className="px-3 py-2 border border-border dark:border-border-dark rounded-sm bg-ink dark:bg-ink text-text-hi dark:text-text-hi text-sm focus:outline-none focus:border-gold">
              {getRiskLevels().map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm('');
                setFilterBranch('All');
                setFilterAuditType('All');
                setFilterRiskLevel('All');
              }}
              className="px-3 py-2 border border-border dark:border-border-dark rounded-sm bg-ink dark:bg-ink text-text-mid dark:text-text-mid text-sm cursor-pointer hover:bg-panel dark:hover:bg-panel transition-colors"
            >
              Clear Filters
            </button>
          </div>

          {/* Sort Options */}
          <div className="bg-ink dark:bg-ink border border-border dark:border-border-dark rounded-sm p-3 mb-4 flex gap-3 items-center text-text-mid dark:text-text-mid text-sm">
            <span className="font-semibold">Sort by:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1 border border-border dark:border-border-dark rounded-sm bg-panel dark:bg-panel-dark text-text-hi dark:text-text-hi text-xs focus:outline-none focus:border-gold">
              <option value="stored_date">Storage Date (Newest)</option>
              <option value="risk_score">Risk Score</option>
              <option value="taxpayer_name">Taxpayer Name</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-2 py-1 border border-border dark:border-border-dark rounded-sm bg-panel dark:bg-panel-dark text-text-mid dark:text-text-mid text-xs cursor-pointer hover:bg-border dark:hover:bg-border-dark transition-colors"
            >
              {sortOrder === 'desc' ? '↓ Descending' : '↑ Ascending'}
            </button>
          </div>

          {/* Cases Table */}
          <div className="overflow-x-auto mb-6 border border-border dark:border-border-dark rounded-sm">
            <table className="w-full text-sm">
              <thead className="bg-panel dark:bg-panel-dark border-b border-border dark:border-border-dark">
                <tr>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">STORED ID</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">CASE ID</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">TIN</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">TAXPAYER</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">BRANCH</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">AUDIT TYPE</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">RISK</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">REVENUE</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">STORED DATE</th>
                  <th className="text-left px-4 py-3 text-text-mid dark:text-text-mid font-semibold text-xs">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCases.map(auditCase => (
                  <tr key={auditCase.storedId} className="border-b border-border dark:border-border-dark hover:bg-panel dark:hover:bg-panel-dark transition-colors">
                    <td className="px-4 py-3"><strong className="text-success dark:text-success">{auditCase.storedId?.substring(0, 20)}...</strong></td>
                    <td className="px-4 py-3 text-text-hi dark:text-text-hi">{auditCase.id?.substring(0, 25)}...</td>
                    <td className="px-4 py-3 text-text-hi dark:text-text-hi">{auditCase.tin}</td>
                    <td className="px-4 py-3 text-text-hi dark:text-text-hi">{auditCase.taxpayerName}</td>
                    <td className="px-4 py-3 text-text-hi dark:text-text-hi">{auditCase.region}</td>
                    <td className="px-4 py-3 text-text-hi dark:text-text-hi">{auditCase.auditType}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 rounded-sm text-xs font-bold text-white" style={{ backgroundColor: getRiskColor(auditCase.riskLevel) }}>
                        {auditCase.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-hi dark:text-text-hi">{(auditCase.revenueAtRisk / 1000000).toFixed(1)}M</td>
                    <td className="px-4 py-3 text-text-mid dark:text-text-mid text-xs">{formatDate(auditCase.storedDate)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRemoveCase(auditCase.storedId)}
                        className="px-2 py-1 bg-danger dark:bg-danger text-white border-none rounded-sm text-xs cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center py-3 text-text-mid dark:text-text-mid text-sm">
            <span>Showing {paginatedCases.length} of {filteredCases.length} cases</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2 py-1 border border-border dark:border-border-dark rounded-sm text-xs cursor-pointer transition-colors ${
                    currentPage === page 
                      ? 'bg-info dark:bg-info text-white font-semibold' 
                      : 'bg-ink dark:bg-ink text-text-mid dark:text-text-mid hover:bg-panel dark:hover:bg-panel'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 bg-green-900 dark:bg-green-900 border border-success dark:border-success rounded-sm p-4 text-success dark:text-success">
            <strong><i className="fas fa-chart-bar mr-2"></i> Stored Cases Summary</strong>
            <p className="text-green-200 dark:text-green-200 text-sm leading-relaxed mt-2">
              Total Stored: <strong>{storedCases.length}</strong> | 
              Critical Risk: <strong>{stats.riskLevels.Critical}</strong> | 
              High Risk: <strong>{stats.riskLevels.High}</strong> | 
              Total Revenue at Risk: <strong>{(stats.totalRevenue / 1000000).toFixed(1)}M ETB</strong>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default StoredCasesView;
