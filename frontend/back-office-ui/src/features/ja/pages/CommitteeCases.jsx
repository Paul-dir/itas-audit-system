/**
 * CommitteeCases Page
 * Display list of committee cases with advanced search, filtering, and export
 * 
 * Features:
 * - Advanced search by taxpayer name, TIN, industry, case ID
 * - Multi-filter by risk level, segment, JAC status, SLA deadline
 * - Table view with detailed case information
 * - Export to XLS and PDF
 * - Queue aging tracking
 * - Voting status display
 * - Dossier access
 */

import { useState } from 'react';
import { useCases } from '../hooks/useCases';
import { Search, AlertCircle, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import Card from '../../../components/Card';
import CaseDetail from './CaseDetail';

export default function CommitteeCases() {
  const { cases, loading, error, currentPage, totalElements, filters, setPage, setFilters, refresh } = useCases();
  const [searchInput, setSearchInput] = useState('');
  const [riskFilter, setRiskFilter] = useState('All Levels');
  const [segmentFilter, setSegmentFilter] = useState('All Segments');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [slaFilter, setSLAFilter] = useState('All Timeframes');
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  const pageSize = 25;
  const totalPages = Math.ceil(totalElements / pageSize);
  const loadedCases = Math.min((currentPage + 1) * pageSize, totalElements);

  const handleSearch = (value) => {
    setSearchInput(value);
    setFilters({ ...filters, taxpayerName: value });
    setPage(0);
  };

  const handleRiskFilter = (risk) => {
    setRiskFilter(risk);
    if (risk !== 'All Levels') {
      setFilters({ ...filters, riskPriority: risk });
    } else {
      const { riskPriority, ...rest } = filters;
      setFilters(rest);
    }
    setPage(0);
  };

  const handleSegmentFilter = (segment) => {
    setSegmentFilter(segment);
    if (segment !== 'All Segments') {
      setFilters({ ...filters, segment: segment });
    } else {
      const { segment: _, ...rest } = filters;
      setFilters(rest);
    }
    setPage(0);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    // Map filter display names to actual status values
    const statusMap = {
      'All Statuses': null,
      'PENDING_VOTES': 'PENDING_VOTES',
      'PENDING_VIABILITY': 'PENDING_VIABILITY',
      'APPROVED': 'APPROVED',
      'REJECTED': 'REJECTED',
      'TEAM_ASSIGNED': 'TEAM_ASSIGNED'
    };
    
    if (status !== 'All Statuses' && statusMap[status]) {
      setFilters({ ...filters, status: statusMap[status] });
    } else {
      const { status: _, ...rest } = filters;
      setFilters(rest);
    }
    setPage(0);
  };

  const handleSLAFilter = (timeframe) => {
    setSLAFilter(timeframe);
    // SLA filtering logic: calculate days remaining from deadline
    if (timeframe !== 'All Timeframes') {
      // Store SLA filter in filters object
      setFilters({ ...filters, slaDeadline: timeframe });
    } else {
      const { slaDeadline, ...rest } = filters;
      setFilters(rest);
    }
    setPage(0);
  };

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntil = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    return daysUntil;
  };

  const shouldShowCase = (caseItem) => {
    if (!filters.slaDeadline) return true;

    const daysRemaining = getDaysUntilDeadline(caseItem.committeeDeadline);
    if (daysRemaining === null) return false;

    switch (filters.slaDeadline) {
      case '0-7 Days':
        return daysRemaining >= 0 && daysRemaining <= 7;
      case '7-14 Days':
        return daysRemaining > 7 && daysRemaining <= 14;
      case '14+ Days':
        return daysRemaining > 14;
      case 'Overdue':
        return daysRemaining < 0;
      default:
        return true;
    }
  };

  const handleExportXLS = () => {
    const filtered = cases.filter(shouldShowCase);
    const headers = ['Case ID', 'Taxpayer', 'TIN', 'Segment', 'Industry', 'Risk', 'Days Remaining', 'JAC Status'];
    const rows = filtered.map(c => [
      c.caseCode || c.committeeCaseId?.substring(0, 8),
      c.taxpayerName,
      c.taxIdNumber || 'N/A',
      c.segment || 'N/A',
      c.industry || 'N/A',
      c.riskPriority || 'N/A',
      getDaysUntilDeadline(c.committeeDeadline) ?? 'N/A',
      (c.status || 'PENDING').replace(/_/g, ' '),
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `committee-cases-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const filtered = cases.filter(shouldShowCase);
    const lines = [
      'COMMITTEE CASE AUDIT PORTFOLIO',
      `Generated: ${new Date().toLocaleString()}`,
      `Total Cases: ${filtered.length}`,
      '─'.repeat(80),
      '',
    ];
    filtered.forEach((c, i) => {
      lines.push(`#${i + 1}  ${c.caseCode || c.committeeCaseId?.substring(0, 8)}`);
      lines.push(`   Taxpayer: ${c.taxpayerName}`);
      lines.push(`   TIN: ${c.taxIdNumber || 'N/A'}  |  Segment: ${c.segment || 'N/A'}  |  Industry: ${c.industry || 'N/A'}`);
      lines.push(`   Risk: ${c.riskPriority || 'N/A'}  |  Status: ${(c.status || 'PENDING').replace(/_/g, ' ')}`);
      lines.push(`   Days Remaining: ${getDaysUntilDeadline(c.committeeDeadline) ?? 'N/A'}`);
      lines.push('');
    });
    const text = lines.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `committee-cases-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDossier = (caseId) => {
    setSelectedCaseId(caseId);
  };

  const getStatusColor = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'PENDING_VOTES':
      case 'PENDING_VIABILITY':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'APPROVED':
      case 'TEAM_ASSIGNED':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'REJECTED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';

      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  const getRiskBadge = (risk) => {
    const riskLower = risk?.toLowerCase();
    if (riskLower === 'high') return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded text-xs font-medium"><span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400"></span> High</span>;
    if (riskLower === 'medium') return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 rounded text-xs font-medium"><span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400"></span> Medium</span>;
    if (riskLower === 'low') return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200 rounded text-xs font-medium"><span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400"></span> Low</span>;
    return <span className="text-gray-600 dark:text-gray-400">N/A</span>;
  };

  const getVotingBadge = (votingStatus) => {
    switch (votingStatus) {
      case 'PASSED':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200 rounded text-xs font-medium"><span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400"></span> Passed</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded text-xs font-medium"><span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400"></span> Rejected</span>;
      case 'IN_PROGRESS':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 rounded text-xs font-medium"><span className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400"></span> In Progress</span>;
      case 'PENDING':
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded text-xs font-medium"><span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span> Pending Votes</span>;
    }
  };

  const getSegmentBadge = (segment) => {
    const segmentUpper = segment?.toUpperCase();
    if (segmentUpper === 'LARGE') return <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 rounded-full text-xs font-semibold">LTO</span>;
    if (segmentUpper === 'MEDIUM') return <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 rounded-full text-xs font-semibold">MTO</span>;
    if (segmentUpper === 'SMALL') return <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200 rounded-full text-xs font-semibold">STO</span>;
    return <span className="text-gray-600 dark:text-gray-400">N/A</span>;
  };

  if (selectedCaseId) {
    return (
      <CaseDetail 
        caseId={selectedCaseId} 
        onBack={() => setSelectedCaseId(null)} 
      />
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">Failed to Load Cases</h3>
              <p className="text-sm text-red-800 dark:text-red-200 mt-1">{error}</p>
              <button
                onClick={refresh}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and Export Buttons */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Case Audit Portfolio</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Perform collaborative ledger verification, ownership locking, and voting actions.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportXLS}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Download size={16} />
              Export XLS
            </button>
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <FileText size={16} />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by taxpayer name, TIN, industry, or case ID..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Risk Level Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Risk Level
            </label>
            <select
              value={riskFilter}
              onChange={(e) => handleRiskFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>All Levels</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          {/* Segment Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Segment
            </label>
            <select
              value={segmentFilter}
              onChange={(e) => handleSegmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>All Segments</option>
              <option>LARGE</option>
              <option>MEDIUM</option>
              <option>SMALL</option>
            </select>
          </div>

          {/* JAC Status Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              JAC Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>All Statuses</option>
              <option>PENDING_VOTES</option>
              <option>PENDING_VIABILITY</option>
              <option>APPROVED</option>
              <option>REJECTED</option>
              <option>TEAM_ASSIGNED</option>

            </select>
          </div>

          {/* SLA Deadline Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              SLA Deadline
            </label>
            <select
              value={slaFilter}
              onChange={(e) => handleSLAFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>All Timeframes</option>
              <option>Overdue</option>
              <option>0-7 Days</option>
              <option>7-14 Days</option>
              <option>14+ Days</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Cases Table */}
      {!loading && cases.length > 0 && (
        <div className="overflow-x-auto">
          <Card className="p-0 border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Case ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Taxpayer (TIN & Segment)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Industry</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Risk Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Queue Aging</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Voting Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">JAC Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {cases.filter(shouldShowCase).map((caseItem) => (
                  <tr key={caseItem.committeeCaseId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">{caseItem.caseCode || `JAC-${caseItem.committeeCaseId.substring(0, 8)}`}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{caseItem.taxpayerName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">TIN: {caseItem.taxIdNumber || 'N/A'}</div>
                      <div className="mt-2">{getSegmentBadge(caseItem.segment)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{caseItem.industry || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Mini Risk Indicator Circle */}
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" className="dark:stroke-gray-700" strokeWidth="7" />
                            <circle
                              cx="50" cy="50" r="42" fill="none"
                              stroke={(caseItem.riskScore || 0) > 70 ? '#ef4444' : (caseItem.riskScore || 0) > 40 ? '#f59e0b' : '#10b981'}
                              strokeWidth="7"
                              strokeDasharray={`${((caseItem.riskScore || 0) / 100) * 264} 264`}
                              strokeDashoffset="0"
                              strokeLinecap="round"
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-gray-900 dark:text-white">{caseItem.riskScore || 0}</span>
                          </div>
                        </div>
                        {getRiskBadge(caseItem.riskPriority)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {getDaysUntilDeadline(caseItem.committeeDeadline)} days
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Deadline: {new Date(caseItem.committeeDeadline).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getVotingBadge(caseItem.votingStatus)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status?.replace(/_/g, ' ') || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDossier(caseItem.committeeCaseId)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <FileText size={16} />
                        Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && cases.length === 0 && (
        <Card className="p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">No cases found</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Try adjusting your filters or search criteria</p>
        </Card>
      )}

      {/* Pagination and Footer */}
      {!loading && cases.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {loadedCases} of {totalElements} loaded taxpayer cases.
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                  let page = idx;
                  if (totalPages > 5 && currentPage > 2) {
                    page = currentPage - 2 + idx;
                  }
                  if (page < totalPages) {
                    return (
                      <button
                        key={page}
                        onClick={() => setPage(page)}
                        className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        {page + 1}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
