/**
 * AuditTrail Page
 * Immutable audit log viewer for compliance and governance.
 *
 * Features:
 * - Global audit trail across all committee cases
 * - Case-specific audit trail
 * - Filter by action type and actor
 * - Export to CSV
 * - 7-year retention compliance display
 */

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAuditTrail } from '../hooks/useAuditTrail';
import {
  AlertCircle, Search, Download, Filter, Shield, Clock,
  User, ChevronLeft, ChevronRight, Loader, FileText, Eye,
} from 'lucide-react';
import Card from '../../../components/Card';

const ACTION_TYPES = [
  'All', 'CASE_CREATED', 'VOTE_CAST', 'OWNERSHIP_TAKEN', 'OWNERSHIP_RELEASED',
  'RESEARCH_NOTE_ADDED', 'AUDITOR_NOMINATED', 'TEAM_LEAD_APPOINTED',
  'VIABILITY_FINALIZED', 'TEAM_ASSIGNED',
  'SLA_OVERRIDDEN', 'SESSION_CREATED', 'NOTE_ADDED',
];

const ACTION_LABELS = {
  CASE_CREATED:            { label: 'Case Created',       color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' },
  VOTE_CAST:               { label: 'Vote Cast',          color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200' },
  OWNERSHIP_TAKEN:         { label: 'Ownership Taken',    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200' },
  OWNERSHIP_RELEASED:      { label: 'Ownership Released', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
  RESEARCH_NOTE_ADDED:     { label: 'Research Note',      color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-200' },
  AUDITOR_NOMINATED:       { label: 'Auditor Nominated',  color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200' },
  TEAM_LEAD_APPOINTED:     { label: 'Team Lead Appointed',color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-200' },
  VIABILITY_FINALIZED:     { label: 'Viability Decision', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200' },
  TEAM_ASSIGNED:           { label: 'Team Assigned',      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' },
  SLA_OVERRIDDEN:          { label: 'SLA Override',       color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200' },
  SESSION_CREATED:         { label: 'Session Created',    color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-200' },
  NOTE_ADDED:              { label: 'Note Added',         color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-200' },
};

export default function AuditTrail() {
  const { authContext } = useAuth();
  const taxCenter = authContext?.taxCenter || authContext?.org_context?.assignedTaxCenter || null;
  const [viewMode, setViewMode] = useState('global'); // 'global' | 'case'
  const [caseId, setCaseId] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [actorFilter, setActorFilter] = useState('');
  const [expandedEntry, setExpandedEntry] = useState(null);

  const {
    entries, loading, error, totalElements, page, setPage,
    refresh, exportTrail,
  } = useAuditTrail(viewMode === 'case' && caseId ? caseId : null, taxCenter);

  const handleSearch = () => {
    const filters = {};
    if (actionFilter !== 'All') filters.actionType = actionFilter;
    if (actorFilter.trim()) filters.actorId = actorFilter.trim();
    if (viewMode === 'global') {
      refresh(filters);
    } else {
      refresh();
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      await exportTrail(format);
    } catch { /* handled by hook */ }
  };

  const getActionStyle = (actionType) => {
    return ACTION_LABELS[actionType]?.color || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  const getActionLabel = (actionType) => {
    return ACTION_LABELS[actionType]?.label || actionType?.replace(/_/g, ' ') || 'Unknown';
  };

  const formatTimestamp = (ts) => {
    if (!ts) return 'N/A';
    return new Date(ts).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Audit Trail</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Immutable compliance log — every committee action recorded for 7-year retention.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-semibold">
            <Shield size={14} />
            7-Year Retention
          </div>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setViewMode('global')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'global'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Eye size={14} className="inline mr-1.5" />
            Global Trail
          </button>
          <button
            onClick={() => setViewMode('case')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'case'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <FileText size={14} className="inline mr-1.5" />
            Case-Specific
          </button>
        </div>

        {viewMode === 'case' && (
          <div className="mb-4">
            <input
              type="text"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="Enter case UUID..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase">Action Type</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ACTION_TYPES.map(t => <option key={t} value={t}>{t === 'All' ? 'All Actions' : getActionLabel(t)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase">Actor ID</label>
            <input
              type="text"
              value={actorFilter}
              onChange={(e) => setActorFilter(e.target.value)}
              placeholder="Filter by actor..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={viewMode === 'case' && !caseId}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Search size={16} />
              Apply Filters
            </button>
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900 dark:text-red-100">{error}</p>
            <button onClick={refresh} className="text-xs text-red-600 dark:text-red-400 mt-1 underline">Try again</button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && entries.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && entries.length === 0 && (
        <Card className="p-12 text-center">
          <Shield className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No audit entries found</p>
          <p className="text-sm text-gray-500 mt-1">
            {viewMode === 'case' && !caseId ? 'Enter a case UUID to view its audit trail.' : 'Try adjusting your filters.'}
          </p>
        </Card>
      )}

      {/* Audit Entries */}
      {entries.map((entry, idx) => (
        <Card key={entry.id || idx} className="p-4 hover:shadow-md transition-shadow">
          <div
            className="flex items-start gap-4 cursor-pointer"
            onClick={() => setExpandedEntry(expandedEntry === idx ? null : idx)}
          >
            {/* Action icon */}
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              <Clock size={18} className="text-gray-600 dark:text-gray-400" />
            </div>

            {/* Entry content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getActionStyle(entry.actionType)}`}>
                  {getActionLabel(entry.actionType)}
                </span>
                {entry.caseId && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-mono truncate max-w-[180px]">
                    Case: {entry.caseId.substring(0, 12)}...
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                {entry.description || entry.actionType?.replace(/_/g, ' ') || 'Action performed'}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <User size={12} />
                  {entry.actorId || entry.actorName || 'System'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatTimestamp(entry.timestamp || entry.createdAt)}
                </span>
                {entry.beforeState && (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Filter size={12} />
                    State change recorded
                  </span>
                )}
              </div>
            </div>

            <ChevronRight
              size={18}
              className={`text-gray-400 transition-transform flex-shrink-0 ${expandedEntry === idx ? 'rotate-90' : ''}`}
            />
          </div>

          {/* Expanded details */}
          {expandedEntry === idx && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ml-14 space-y-3">
              {entry.description && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Description</label>
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{entry.description}</p>
                </div>
              )}
              {entry.beforeState && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Before State</label>
                  <pre className="text-xs text-gray-700 dark:text-gray-300 mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto">
                    {typeof entry.beforeState === 'string' ? entry.beforeState : JSON.stringify(entry.beforeState, null, 2)}
                  </pre>
                </div>
              )}
              {entry.afterState && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">After State</label>
                  <pre className="text-xs text-gray-700 dark:text-gray-300 mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto">
                    {typeof entry.afterState === 'string' ? entry.afterState : JSON.stringify(entry.afterState, null, 2)}
                  </pre>
                </div>
              )}
              {entry.metadata && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Metadata</label>
                  <pre className="text-xs text-gray-700 dark:text-gray-300 mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto">
                    {JSON.stringify(entry.metadata, null, 2)}
                  </pre>
                </div>
              )}
              <div className="text-xs text-gray-400 dark:text-gray-500 italic">
                Entry ID: {entry.id} · Retention: 7 years
              </div>
            </div>
          )}
        </Card>
      ))}

      {/* Pagination */}
      {totalElements > 25 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">{totalElements} entries total</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">Page {page + 1}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * 25 >= totalElements}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
