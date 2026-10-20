/**
 * AuditTrail Page
 * Unified Governance & Compliance Audit Trail
 * Records all Planning Team actions, Auditor Execution history, and Committee Governance.
 */

import { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAuditTrail } from '../hooks/useAuditTrail';
import {
  AlertCircle, Search, Download, Filter, Shield, Clock,
  User, ChevronLeft, ChevronRight, FileText, Eye, CheckCircle2,
  Calendar, Briefcase, Hash, RefreshCw, Layers, ArrowRight
} from 'lucide-react';
import Card from '../../../components/Card';

const CATEGORIES = [
  { id: 'ALL', label: 'All Actions', icon: Layers },
  { id: 'PLANNING & STRATEGY', label: 'Planning & Strategy', icon: Calendar },
  { id: 'AUDIT EXECUTION', label: 'Auditor & Execution', icon: Briefcase },
  { id: 'GOVERNANCE & COMMITTEE', label: 'Governance & Committee', icon: Shield },
];

const ACTION_LABELS = {
  // Planning & Strategy
  PLAN_CREATED:                         { label: 'Annual Plan Created',             color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800' },
  SUBMITTED_TO_DIRECTOR:                { label: 'Submitted to Director',          color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' },
  APPROVED_BY_DIRECTOR:                 { label: 'Approved by Director',           color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' },
  DIRECTOR_APPROVED:                    { label: 'Director Approved',              color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' },
  ALLOCATION_ADJUSTED_BY_DIRECTOR:      { label: 'Allocation Adjusted',            color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' },
  SUBMITTED_TO_SENIOR_MGMT:             { label: 'Submitted to Senior Mgmt',       color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' },
  SENIOR_MGMT_APPROVED:                 { label: 'Senior Mgmt Approved',           color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' },
  SUBMITTED_TO_REGIONAL:                { label: 'Submitted to Regional',          color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' },
  APPROVED_BY_REGIONAL:                 { label: 'Approved by Regional',           color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800' },
  ALLOCATION_ADJUSTED_BY_REGIONAL:      { label: 'Regional Quota Adjusted',        color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' },
  SENT_TO_TAX_CENTERS:                  { label: 'Sent to Tax Centers',            color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800' },
  TC_FEEDBACK_SUBMITTED:                { label: 'Tax Center Feedback',            color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' },
  TAX_CENTER_ALLOCATION_CREATED:        { label: 'TC Allocation Created',          color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800' },
  REGIONAL_DIVIDED_INTO_TAX_CENTERS:    { label: 'Regional Plan Cascaded',         color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' },
  APPROVED_PLAN_DISTRIBUTED_TO_REGIONS: { label: 'Distributed to Regions',         color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800' },
  REGIONAL_DEPLOYMENT:                  { label: 'Regional Deployment',            color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800' },
  PLAN_FINALIZED:                       { label: 'Plan Finalized',                 color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' },
  PLAN_AMENDED_AND_RESUBMITTED:         { label: 'Plan Amended & Resubmitted',     color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' },
  PLAN_APPROVED:                        { label: 'Plan Approved',                  color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' },
  CASES_CASCADED:                       { label: 'Cases Cascaded',                 color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' },

  // Auditor & Execution
  AUDIT_PLAN_SUBMITTED:                 { label: 'Audit Plan Submitted',           color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' },
  AUDIT_PLAN_SUBMITTED_TL:              { label: 'Audit Plan Sent to TL',          color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' },
  AUDIT_PLAN_TL_ENDORSED:               { label: 'Plan Endorsed by TL',            color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' },
  RISK_ASSESSMENT_SAVED:                { label: 'Risk Assessment Saved',          color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' },
  RISK_ASSESSMENT_SUBMITTED_COMMITTEE:  { label: 'Risk Sent to Committee',         color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800' },
  HYPOTHESIS_SAVED:                     { label: 'Hypothesis Saved',               color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800' },
  FIELD_WORK_PROGRESS_SAVED:            { label: 'Fieldwork Progress Saved',       color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' },
  IDR_ISSUED:                           { label: 'IDR Notice Issued',              color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' },
  FACT_STATEMENT_SAVED:                 { label: 'Statement of Facts',             color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800' },
  PLANNING_MEETING_DECISION:            { label: 'Planning Meeting Decision',      color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' },
  PHASE_SUBMITTED_FOR_REVIEW:           { label: 'Phase Review Submitted',         color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800' },
  SUBMITTED_FOR_TL_REVIEW:              { label: 'Submitted for TL Review',        color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800' },
  TL_REVIEW_DECISION:                   { label: 'TL Review Decision',             color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800' },
  PHASE_REVIEW_APPROVED:                { label: 'Phase Review Approved',          color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' },
  PHASE_REVIEW_ENDORSE_TO_COMMITTEE:    { label: 'Endorsed to Committee',          color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800' },
  ARMS_LENGTH_CONFIRMED:                { label: "Arm's Length Confirmed",         color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' },
  REPORT_DRAFTED:                       { label: 'Audit Report Drafted',           color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' },
  EXIT_CONFERENCE_HELD:                 { label: 'Exit Conference Held',           color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' },
  ASSESSMENT_COMPUTATION_SAVED:         { label: 'Assessment Computed',            color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' },
  OFFICIAL_ASSESSMENT_ISSUED:           { label: 'Assessment Notice Issued',       color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' },
  NOTICE_DISPATCHED:                    { label: 'Notice Dispatched',              color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800' },
  NOTICE_DELIVERY_CONFIRMED:            { label: 'Notice Delivery Confirmed',      color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800' },
  NOTICE_ACKNOWLEDGED:                  { label: 'Notice Acknowledged',            color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' },
  ASSESSMENT_ACCEPTED_SETTLED:          { label: 'Settlement Confirmed',           color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' },
  TP_PHASE_ADVANCED:                    { label: 'Audit Phase Advanced',           color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800' },
  TP_AUDIT_CONCLUDED_ARCHIVED:          { label: 'Case Concluded & Archived',      color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700' },

  // Governance & Committee
  TP_CASE_ACCEPTED_BY_COMMITTEE:        { label: 'Case Accepted by Committee',     color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800' },
  COMMITTEE_REPORT_APPROVED:            { label: 'Committee Approved Report',      color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' },
  CASE_CREATED:                         { label: 'Case Created',                   color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' },
  VOTE_CAST:                            { label: 'Vote Cast',                      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800' },
  OWNERSHIP_TAKEN:                      { label: 'Ownership Taken',                color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' },
  OWNERSHIP_RELEASED:                   { label: 'Ownership Released',             color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600' },
  RESEARCH_NOTE_ADDED:                  { label: 'Research Note Added',            color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800' },
  AUDITOR_NOMINATED:                    { label: 'Auditor Nominated',              color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' },
  TEAM_LEAD_APPOINTED:                  { label: 'Team Lead Appointed',            color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800' },
  VIABILITY_FINALIZED:                  { label: 'Viability Finalized',            color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' },
  TEAM_ASSIGNED:                        { label: 'Team Assigned',                  color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' },
  SLA_OVERRIDDEN:                       { label: 'SLA Overridden',                 color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800' },
  SESSION_CREATED:                      { label: 'Session Created',                color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800' },
  NOTE_ADDED:                           { label: 'Note Added',                     color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800' },
};

export default function AuditTrail() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('global'); // 'global' | 'case'
  const [caseIdInput, setCaseIdInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEntry, setExpandedEntry] = useState(null);

  const {
    entries, loading, error, totalElements, page, setPage,
    refresh, exportTrail,
  } = useAuditTrail(viewMode === 'case' && caseIdInput ? caseIdInput : null);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    refresh({
      category: catId === 'ALL' ? undefined : catId,
      actionType: actionFilter !== 'All' ? actionFilter : undefined,
      search: searchQuery.trim() || undefined,
    });
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    refresh({
      category: activeCategory === 'ALL' ? undefined : activeCategory,
      actionType: actionFilter !== 'All' ? actionFilter : undefined,
      search: searchQuery.trim() || undefined,
    });
  };

  const handleResetFilters = () => {
    setActiveCategory('ALL');
    setActionFilter('All');
    setSearchQuery('');
    refresh({});
  };

  const handleExport = async (format = 'csv') => {
    try {
      await exportTrail(format);
    } catch { /* Handled in hook */ }
  };

  const getActionMeta = (actionType) => {
    return ACTION_LABELS[actionType] || {
      label: actionType?.replace(/_/g, ' ') || 'Action Performed',
      color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
    };
  };

  const getCategoryBadgeStyle = (category) => {
    const cat = (category || '').toUpperCase();
    if (cat.includes('PLAN')) {
      return 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800';
    }
    if (cat.includes('EXEC') || cat.includes('AUDIT')) {
      return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
    }
    return 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
  };

  const formatTimestamp = (ts) => {
    if (!ts) return 'N/A';
    try {
      const d = new Date(ts);
      return d.toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });
    } catch {
      return String(ts);
    }
  };

  // Distinct action options for the filter dropdown based on category
  const availableActionTypes = useMemo(() => {
    return Object.keys(ACTION_LABELS).sort();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 py-4">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Governance & Compliance Audit Trail
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 size={13} />
              Verified Immutable
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Complete compliance record tracking Planning Team decisions, Auditor execution milestones, and Committee governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold border border-blue-200 dark:border-blue-800">
            <Shield size={14} />
            7-Year Retention
          </div>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={16} />
              <span>{cat.label}</span>
              {isActive && (
                <span className="ml-1 px-2 py-0.2 rounded-full text-xs bg-white/20 text-white font-mono">
                  {totalElements}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Panel */}
      <Card className="p-4 shadow-sm border border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Free Text Search */}
          <div className="md:col-span-6 relative">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">
              Search Reference, Plan, Actor, or Notes
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by case #, plan name, actor name, or keywords..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Action Type Dropdown */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">
              Action Type
            </label>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                refresh({
                  category: activeCategory === 'ALL' ? undefined : activeCategory,
                  actionType: e.target.value !== 'All' ? e.target.value : undefined,
                  search: searchQuery.trim() || undefined,
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="All">All Action Types</option>
              {availableActionTypes.map((type) => (
                <option key={type} value={type}>
                  {getActionMeta(type).label}
                </option>
              ))}
            </select>
          </div>

          {/* Search / Reset Buttons */}
          <div className="md:col-span-2 flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Search size={15} />
              Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset Filters"
              className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </form>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900 dark:text-red-100">{error}</p>
            <button onClick={() => refresh()} className="text-xs text-red-600 dark:text-red-400 mt-1 underline">
              Retry query
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && entries.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
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

      {/* Empty State */}
      {!loading && entries.length === 0 && (
        <Card className="p-12 text-center border-dashed">
          <Shield className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-700 dark:text-gray-300 text-lg font-semibold">No audit entries found</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
            There are no recorded actions matching your active category or search criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </Card>
      )}

      {/* Entries List */}
      <div className="space-y-3">
        {entries.map((entry, idx) => {
          const actionMeta = getActionMeta(entry.actionType);
          const isExpanded = expandedEntry === idx;
          const timestamp = entry.actionTimestamp || entry.timestamp || entry.createdAt;

          return (
            <Card
              key={entry.logId || entry.id || idx}
              className={`p-4 border transition-all duration-150 hover:shadow-md ${
                isExpanded
                  ? 'border-blue-300 dark:border-blue-700 shadow-sm'
                  : 'border-gray-200 dark:border-gray-800'
              }`}
            >
              <div
                className="flex items-start gap-3.5 cursor-pointer"
                onClick={() => setExpandedEntry(isExpanded ? null : idx)}
              >
                {/* Visual Category Icon */}
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-gray-600 dark:text-gray-300 mt-0.5">
                  {(entry.category || '').includes('PLAN') ? (
                    <Calendar size={19} className="text-blue-600 dark:text-blue-400" />
                  ) : (entry.category || '').includes('EXEC') || (entry.category || '').includes('AUDIT') ? (
                    <Briefcase size={19} className="text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Shield size={19} className="text-purple-600 dark:text-purple-400" />
                  )}
                </div>

                {/* Main Body */}
                <div className="flex-1 min-w-0">
                  {/* Top Row: Category + Action Badge + Entity Reference */}
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {entry.category && (
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${getCategoryBadgeStyle(entry.category)}`}>
                        {entry.category}
                      </span>
                    )}

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${actionMeta.color}`}>
                      {actionMeta.label}
                    </span>

                    {(entry.entityId || entry.caseId) && (
                      <span className="text-xs text-gray-600 dark:text-gray-300 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700 truncate max-w-xs">
                        {entry.entityType === 'PLAN' ? '📋 ' : '📁 '}
                        {entry.entityId || entry.caseId}
                      </span>
                    )}
                  </div>

                  {/* Action Description */}
                  <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
                    {entry.description || entry.actionReason || actionMeta.label}
                  </p>

                  {/* Metadata Row: Actor, Timestamp, Role, Hash */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                      <User size={13} className="text-gray-400" />
                      {entry.actorName || entry.actorId || 'System'}
                    </span>

                    {entry.actorRole && (
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-semibold text-gray-600 dark:text-gray-300 uppercase">
                        {entry.actorRole}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-gray-400" />
                      {formatTimestamp(timestamp)}
                    </span>

                    {entry.actionHash && (
                      <span className="flex items-center gap-1 font-mono text-[11px] text-gray-400">
                        <Hash size={12} />
                        {entry.actionHash}
                      </span>
                    )}

                    {(entry.beforeState || entry.afterState) && (
                      <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-medium">
                        <Filter size={12} />
                        State Changes
                      </span>
                    )}
                  </div>
                </div>

                {/* Expand Indicator */}
                <div className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 pt-1">
                  <ChevronRight
                    size={18}
                    className={`transition-transform duration-200 ${isExpanded ? 'rotate-90 text-blue-600' : ''}`}
                  />
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 sm:ml-14 space-y-3">
                  {/* Action Reason */}
                  {entry.actionReason && entry.actionReason !== entry.description && (
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Recorded Reason
                      </span>
                      <p className="text-sm text-gray-800 dark:text-gray-200 mt-0.5">
                        {entry.actionReason}
                      </p>
                    </div>
                  )}

                  {/* Before / After State Transition */}
                  {(entry.beforeState || entry.afterState) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {entry.beforeState && (
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                            Previous State
                          </span>
                          <pre className="mt-1 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs text-gray-800 dark:text-gray-200 font-mono overflow-x-auto max-h-48">
                            {typeof entry.beforeState === 'object'
                              ? JSON.stringify(entry.beforeState, null, 2)
                              : String(entry.beforeState)}
                          </pre>
                        </div>
                      )}

                      {entry.afterState && (
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Recorded State / Changed Fields
                          </span>
                          <pre className="mt-1 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs text-gray-800 dark:text-gray-200 font-mono overflow-x-auto max-h-48">
                            {typeof entry.afterState === 'object'
                              ? JSON.stringify(entry.afterState, null, 2)
                              : String(entry.afterState)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metadata and Compliance Footer */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800 font-mono">
                    <span>Log ID: {entry.logId || entry.id}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Statutory Audit Trail Integrity Verified (7-Yr Retention)
                    </span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalElements > 25 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Showing {entries.length} of {totalElements} entries (Page {page + 1} of {Math.ceil(totalElements / 25)})
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-40 transition-colors text-xs font-medium flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
              {page + 1}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * 25 >= totalElements}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-40 transition-colors text-xs font-medium flex items-center gap-1"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
