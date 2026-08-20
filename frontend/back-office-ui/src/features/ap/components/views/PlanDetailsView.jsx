import React, { useState } from 'react';
import Badge from '../Badge';
import { getStatusDisplay, getBadgeClass } from '../../utils/businessLogic';
import { auditConfig } from '../../config/auditConfig';

function PlanDetailsView({ plan, onBack }) {
  // Default to expand audit-types section so the dashboard content is visible right away
  const [expandedSections, setExpandedSections] = useState({
    planning: true,
    'audit-types': true,
    regional: true,
    capacity: true,
    strategy: true,
    history: false
  });
  const [selectedRegion, setSelectedRegion] = useState(null);

  if (!plan) return null;

  // Get stored audit type allocation from plan
  const auditTypeAllocation = plan.auditTypeAllocation || {};
  const regionalAllocation = plan.regionalAllocation || {};

  // Helper function to toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Calculate total cases from audit types
  const totalCasesFromAuditTypes = Object.values(auditTypeAllocation).reduce((sum, val) => sum + (parseInt(val) || 0), 0) || plan.totalVolume || 0;

  // Calculate regional allocation
  const calculateRegionalAllocation = (regionName, auditTypeId) => {
    if (regionalAllocation[regionName]?.[auditTypeId] !== undefined) {
      return parseInt(regionalAllocation[regionName][auditTypeId]);
    }
    
    const region = auditConfig.regions.find(r => r.name === regionName);
    if (!region) return 0;
    
    const regionPercent = region.taxpayers / auditConfig.getTotalTaxpayers();
    const nationalAllocation = parseInt(auditTypeAllocation[auditTypeId]) || 0;
    return Math.round(nationalAllocation * regionPercent);
  };

  // Calculate capacity requirements
  const calculateCapacity = () => {
    let totalEffortHours = 0;
    Object.entries(auditTypeAllocation).forEach(([typeId, count]) => {
      const type = auditConfig.auditTypes.find(t => t.id === typeId);
      if (type) {
        totalEffortHours += parseInt(count) * type.effortPerCase;
      }
    });
    return totalEffortHours;
  };

  const totalEffortHours = calculateCapacity();
  const totalAuditorsNeeded = Math.ceil(totalEffortHours / 2000); // ~2000 hours per auditor per year
  const totalAvailableAuditors = auditConfig.regions.reduce((sum, r) => sum + r.availableAuditors, 0);
  const capacityAvailableHours = totalAvailableAuditors * 2000;
  const capacitySufficient = totalEffortHours <= capacityAvailableHours;

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* ACTION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
        <button 
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
          onClick={onBack}
        >
          <i className="fas fa-arrow-left text-slate-400"></i> Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <button 
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-500/50 transition-all"
            title="Download plan as PDF"
            onClick={() => alert(`Downloading PDF for Plan ${plan.id}...`)}
          >
            <i className="fas fa-download text-cyan-400"></i> Download Plan
          </button>
          <button 
            className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/50 hover:border-indigo-500/50 transition-all"
            title="Print plan"
            onClick={() => window.print()}
          >
            <i className="fas fa-print text-indigo-400"></i> Print Summary
          </button>
        </div>
      </div>

      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                <i className="fas fa-calendar-alt text-indigo-400"></i> Fiscal Year {plan.fiscalYear}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                <i className="fas fa-code-branch text-purple-400"></i> Version {plan.version}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {plan.name || `Annual Audit Plan (${plan.id})`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
              <i className="fas fa-[#10B981] fa-fingerprint text-slate-500"></i> Plan ID: <code className="font-mono text-indigo-300">{plan.id}</code> 
              <span className="text-slate-600">•</span>
              <span>Last Modified: {plan.lastModified ? new Date(plan.lastModified).toLocaleDateString() : 'Recent'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 backdrop-blur-md self-start md:self-auto">
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Status</div>
              <div className="mt-1">
                <Badge status={getStatusDisplay(plan.status)} className={getBadgeClass(plan.status)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KEY METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Cases Card */}
        <div 
          onClick={() => toggleSection('audit-types')}
          className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Cases</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <i className="fas fa-list-check"></i>
            </div>
          </div>
          <div className="mt-3">
            <span className="font-sans text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {totalCasesFromAuditTypes.toLocaleString()}
            </span>
            <span className="ml-1 text-xs text-slate-400">cases</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-cyan-400 group-hover:underline">
            <span>View breakdown</span>
            <i className="fas fa-chevron-right text-[9px]"></i>
          </div>
        </div>

        {/* Total Effort Card */}
        <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md hover:border-indigo-500/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Effort</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
              <i className="fas fa-clock"></i>
            </div>
          </div>
          <div className="mt-3">
            <span className="font-sans text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {totalEffortHours.toLocaleString()}
            </span>
            <span className="ml-1 text-xs text-slate-400">hours</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Avg ~{totalCasesFromAuditTypes > 0 ? Math.round(totalEffortHours / totalCasesFromAuditTypes) : 0}h / case
          </div>
        </div>

        {/* Auditors Needed Card */}
        <div 
          onClick={() => toggleSection('capacity')}
          className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md hover:border-emerald-500/50 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Auditors Needed</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <i className="fas fa-users font-semibold"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-sans text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {totalAuditorsNeeded}
            </span>
            <span className="text-xs text-slate-400">/ {totalAvailableAuditors} avail.</span>
          </div>
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${capacitySufficient ? 'text-emerald-400' : 'text-amber-400'}`}>
              <i className={`fas ${capacitySufficient ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
              {capacitySufficient ? 'Adequate Capacity' : 'Capacity Deficit'}
            </span>
          </div>
        </div>

        {/* Regions Card */}
        <div 
          onClick={() => toggleSection('regional')}
          className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md hover:border-amber-500/50 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Regions</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <i className="fas fa-map-location-dot"></i>
            </div>
          </div>
          <div className="mt-3">
            <span className="font-sans text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {auditConfig.regions.length}
            </span>
            <span className="ml-1 text-xs text-slate-400">tax centers</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-400 group-hover:underline">
            <span>Regional matrix</span>
            <i className="fas fa-chevron-right text-[9px]"></i>
          </div>
        </div>

        {/* Version Card */}
        <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-md hover:border-purple-500/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Plan Version</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-400">
              <i className="fas fa-code-branch"></i>
            </div>
          </div>
          <div className="mt-3">
            <span className="font-sans text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              v{plan.version || 1}
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            {plan.approvalHistory?.length ? `${plan.approvalHistory.length} revisions` : 'Initial draft'}
          </div>
        </div>
      </div>

      {/* SECTION 1: PLANNING PERIOD */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur-md">
        <button 
          onClick={() => toggleSection('planning')}
          className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-slate-800/60"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 shadow-inner">
              <i className="fas fa-calendar-alt text-base"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Planning Period</h3>
              <p className="text-xs text-slate-400">Schedule timelines and operating timeframe</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!expandedSections['planning'] && (
              <span className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1 text-xs text-slate-300 font-mono">
                {plan.startDate || 'Jul 1, 2026'} - {plan.endDate || 'Jun 30, 2027'} ({plan.duration || 365} days)
              </span>
            )}
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition-transform duration-200 ${expandedSections['planning'] ? 'rotate-180 text-cyan-400 border-cyan-500/40' : ''}`}>
              <i className="fas fa-chevron-down text-xs"></i>
            </div>
          </div>
        </button>

        {expandedSections['planning'] && (
          <div className="border-t border-slate-800/80 p-5 bg-slate-950/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Start Date</span>
                <span className="text-sm font-semibold text-slate-100 font-mono">{plan.startDate || 'Jul 1, 2026'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">End Date</span>
                <span className="text-sm font-semibold text-slate-100 font-mono">{plan.endDate || 'Jun 30, 2027'}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Duration</span>
                <span className="text-sm font-semibold text-cyan-300 font-mono">{plan.duration || 365} Calendar Days</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Plan Identifier</span>
                <span className="text-sm font-semibold text-indigo-300 font-mono">{plan.name || plan.id}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: AUDIT TYPES & VOLUME */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur-md">
        <button 
          onClick={() => toggleSection('audit-types')}
          className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-slate-800/60"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-inner">
              <i className="fas fa-layer-group text-base"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Audit Types & Volume Breakdown</h3>
              <p className="text-xs text-slate-400">Distribution of audit types and total estimated work hours</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!expandedSections['audit-types'] && (
              <span className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1 text-xs text-indigo-300 font-medium">
                {auditConfig.auditTypes.length} Audit Types • {totalCasesFromAuditTypes.toLocaleString()} Cases
              </span>
            )}
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition-transform duration-200 ${expandedSections['audit-types'] ? 'rotate-180 text-indigo-400 border-indigo-500/40' : ''}`}>
              <i className="fas fa-chevron-down text-xs"></i>
            </div>
          </div>
        </button>

        {expandedSections['audit-types'] && (
          <div className="border-t border-slate-800/80 p-5 bg-slate-950/30">
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-3.5">Audit Type</th>
                    <th className="px-5 py-3.5 text-center">Allocated Cases</th>
                    <th className="px-5 py-3.5 text-center">Effort / Case</th>
                    <th className="px-5 py-3.5 text-center">Total Workhours</th>
                    <th className="px-5 py-3.5 text-center">% Allocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {auditConfig.auditTypes.map((type, idx) => {
                    const cases = parseInt(auditTypeAllocation[type.id]) || 0;
                    const effort = cases * type.effortPerCase;
                    const percent = totalCasesFromAuditTypes > 0 ? ((cases / totalCasesFromAuditTypes) * 100).toFixed(1) : 0;
                    return (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-200">{type.name}</div>
                          <div className="text-[11px] text-slate-500">{type.description || 'Standard regulatory audit'}</div>
                        </td>
                        <td className="px-5 py-4 text-center font-semibold text-white">
                          {cases.toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-center text-slate-300">
                          {type.effortPerCase}h
                        </td>
                        <td className="px-5 py-4 text-center font-bold text-indigo-400">
                          {effort.toLocaleString()}h
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center gap-2">
                            <span className="text-xs text-slate-300 font-mono w-10">{percent}%</span>
                            <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-t-2 border-slate-700 bg-slate-900/90 font-bold text-white">
                    <td className="px-5 py-4">TOTAL SUMMARY</td>
                    <td className="px-5 py-4 text-center text-cyan-400">{totalCasesFromAuditTypes.toLocaleString()}</td>
                    <td className="px-5 py-4 text-center text-slate-400">-</td>
                    <td className="px-5 py-4 text-center text-indigo-300">{totalEffortHours.toLocaleString()}h</td>
                    <td className="px-5 py-4 text-center text-emerald-400">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: REGIONAL DISTRIBUTION */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur-md">
        <button 
          onClick={() => toggleSection('regional')}
          className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-slate-800/60"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400 shadow-inner">
              <i className="fas fa-map-marked-alt text-base"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Regional Distribution by Audit Type</h3>
              <p className="text-xs text-slate-400">Case breakdown across tax centers and geographical jurisdictions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!expandedSections['regional'] && (
              <span className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1 text-xs text-amber-300 font-medium">
                {auditConfig.regions.length} Regions Assigned
              </span>
            )}
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition-transform duration-200 ${expandedSections['regional'] ? 'rotate-180 text-amber-400 border-amber-500/40' : ''}`}>
              <i className="fas fa-chevron-down text-xs"></i>
            </div>
          </div>
        </button>

        {expandedSections['regional'] && (
          <div className="border-t border-slate-800/80 p-5 bg-slate-950/30 space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-3.5">Region</th>
                    <th className="px-4 py-3.5 text-center">Taxpayer %</th>
                    {auditConfig.auditTypes.map((type, i) => (
                      <th key={i} className="px-3 py-3.5 text-center">{type.name.substring(0, 10)}</th>
                    ))}
                    <th className="px-4 py-3.5 text-center">Total</th>
                    <th className="px-4 py-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {auditConfig.regions.map((region, ridx) => {
                    const regionPercent = ((region.taxpayers / auditConfig.getTotalTaxpayers()) * 100).toFixed(1);
                    let regionTotal = 0;
                    
                    return (
                      <tr key={region.name} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4 font-semibold text-slate-200">
                          {region.name}
                        </td>
                        <td className="px-4 py-4 text-center text-xs text-slate-400 font-mono">
                          {regionPercent}%
                        </td>
                        {auditConfig.auditTypes.map((type) => {
                          const allocation = calculateRegionalAllocation(region.name, type.id);
                          regionTotal += allocation;
                          return (
                            <td 
                              key={type.id} 
                              className="px-3 py-4 text-center cursor-pointer hover:bg-slate-800/80 transition-colors"
                              onClick={() => setSelectedRegion({ region: region.name, type: type.name, allocation })}
                              title={`Click to view details for ${type.name} in ${region.name}`}
                            >
                              <span className="font-semibold text-cyan-300 hover:underline">{allocation}</span>
                            </td>
                          );
                        })}
                        <td className="px-4 py-4 text-center font-bold text-white">
                          {regionTotal}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button 
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-900/50 transition-colors"
                            onClick={() => alert(`Send ${regionTotal} allocated cases to ${region.name} regional director`)}
                          >
                            <i className="fas fa-paper-plane text-[10px]"></i> Dispatch
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-t-2 border-slate-700 bg-slate-900/90 font-bold text-white">
                    <td className="px-5 py-4">NATIONAL TOTAL</td>
                    <td className="px-4 py-4 text-center text-slate-400">100%</td>
                    {auditConfig.auditTypes.map((type) => {
                      const totalByType = auditConfig.regions.reduce((sum, region) => {
                        return sum + calculateRegionalAllocation(region.name, type.id);
                      }, 0);
                      return (
                        <td key={type.id} className="px-3 py-4 text-center text-indigo-300">{totalByType}</td>
                      );
                    })}
                    <td className="px-4 py-4 text-center text-cyan-400">{totalCasesFromAuditTypes.toLocaleString()}</td>
                    <td className="px-4 py-4 text-center text-slate-500">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {selectedRegion && (
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/40 p-4 backdrop-blur-md flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                    <i className="fas fa-info-circle"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-cyan-200">{selectedRegion.region} Region — {selectedRegion.type}</h4>
                    <p className="text-xs text-cyan-300/80">
                      <strong>{selectedRegion.allocation} cases</strong> assigned to this audit classification.
                    </p>
                  </div>
                </div>
                <button 
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  onClick={() => setSelectedRegion(null)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 4: CAPACITY & RESOURCES */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur-md">
        <button 
          onClick={() => toggleSection('capacity')}
          className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-slate-800/60"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-inner">
              <i className="fas fa-users-cog text-base"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Capacity & Resource Feasibility</h3>
              <p className="text-xs text-slate-400">Staffing, audit hours required vs. available workforce capacity</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden sm:inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs font-semibold ${capacitySufficient ? 'border-emerald-500/30 bg-emerald-950/50 text-emerald-300' : 'border-amber-500/30 bg-amber-950/50 text-amber-300'}`}>
              <i className={`fas ${capacitySufficient ? 'fa-check' : 'fa-exclamation'}`}></i>
              {capacitySufficient ? 'Workforce Sufficient' : 'Staffing Alert'}
            </span>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition-transform duration-200 ${expandedSections['capacity'] ? 'rotate-180 text-emerald-400 border-emerald-500/40' : ''}`}>
              <i className="fas fa-chevron-down text-xs"></i>
            </div>
          </div>
        </button>

        {expandedSections['capacity'] && (
          <div className="border-t border-slate-800/80 p-5 bg-slate-950/30">
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-3.5">Resource Metric</th>
                    <th className="px-5 py-3.5 text-center">Required</th>
                    <th className="px-5 py-3.5 text-center">Available</th>
                    <th className="px-5 py-3.5 text-center">Variance / Surplus</th>
                    <th className="px-5 py-3.5 text-center">Feasibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-200">
                      <div>Total Auditor Hours</div>
                      <div className="text-[11px] text-slate-500">Calculated based on audit type effort rates</div>
                    </td>
                    <td className="px-5 py-4 text-center font-mono font-semibold text-white">
                      {totalEffortHours.toLocaleString()}h
                    </td>
                    <td className="px-5 py-4 text-center font-mono text-slate-300">
                      {capacityAvailableHours.toLocaleString()}h
                    </td>
                    <td className={`px-5 py-4 text-center font-mono font-bold ${capacityAvailableHours >= totalEffortHours ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {(capacityAvailableHours - totalEffortHours > 0 ? '+' : '')}{(capacityAvailableHours - totalEffortHours).toLocaleString()}h
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${capacityAvailableHours >= totalEffortHours ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border border-rose-500/30 bg-rose-500/10 text-rose-300'}`}>
                        <i className={`fas ${capacityAvailableHours >= totalEffortHours ? 'fa-check' : 'fa-times'}`}></i>
                        {capacityAvailableHours >= totalEffortHours ? 'Sufficient' : 'Shortage'}
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-200">
                      <div>Full-Time Auditors</div>
                      <div className="text-[11px] text-slate-500">Standard 2,000 hours per auditor/year</div>
                    </td>
                    <td className="px-5 py-4 text-center font-mono font-semibold text-white">
                      {totalAuditorsNeeded} FTE
                    </td>
                    <td className="px-5 py-4 text-center font-mono text-slate-300">
                      {totalAvailableAuditors} FTE
                    </td>
                    <td className={`px-5 py-4 text-center font-mono font-bold ${totalAvailableAuditors >= totalAuditorsNeeded ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {(totalAvailableAuditors - totalAuditorsNeeded > 0 ? '+' : '')}{totalAvailableAuditors - totalAuditorsNeeded} FTE
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${totalAvailableAuditors >= totalAuditorsNeeded ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border border-rose-500/30 bg-rose-500/10 text-rose-300'}`}>
                        <i className={`fas ${totalAvailableAuditors >= totalAuditorsNeeded ? 'fa-check' : 'fa-times'}`}></i>
                        {totalAvailableAuditors >= totalAuditorsNeeded ? 'Adequate' : 'Deficit'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: AUDIT STRATEGY & TACTICS */}
      {plan.strategy && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur-md">
          <button 
            onClick={() => toggleSection('strategy')}
            className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-slate-800/60"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400 shadow-inner">
                <i className="fas fa-bullseye text-base"></i>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Audit Strategy & Focus Areas</h3>
                <p className="text-xs text-slate-400">Strategic directives and enforcement policies</p>
              </div>
            </div>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition-transform duration-200 ${expandedSections['strategy'] ? 'rotate-180 text-purple-400 border-purple-500/40' : ''}`}>
              <i className="fas fa-chevron-down text-xs"></i>
            </div>
          </button>

          {expandedSections['strategy'] && (
            <div className="border-t border-slate-800/80 p-5 bg-slate-950/30">
              <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-5 text-slate-300 leading-relaxed text-sm">
                <p className="m-0 whitespace-pre-line">{plan.strategy}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 6: APPROVAL HISTORY */}
      {plan.approvalHistory && plan.approvalHistory.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden backdrop-blur-md">
          <button 
            onClick={() => toggleSection('history')}
            className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-slate-800/60"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 shadow-inner">
                <i className="fas fa-history text-base"></i>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Approval Audit Trail</h3>
                <p className="text-xs text-slate-400">Historical log of revisions, submissions, and approvals</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1 text-xs text-slate-400 font-mono">
                {plan.approvalHistory.length} Events Logged
              </span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition-transform duration-200 ${expandedSections['history'] ? 'rotate-180 text-slate-200 border-slate-600' : ''}`}>
                <i className="fas fa-chevron-down text-xs"></i>
              </div>
            </div>
          </button>

          {expandedSections['history'] && (
            <div className="border-t border-slate-800/80 p-5 bg-slate-950/30">
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="px-5 py-3.5">Action Executed</th>
                      <th className="px-5 py-3.5">Performed By</th>
                      <th className="px-5 py-3.5">Timestamp</th>
                      <th className="px-5 py-3.5">Version</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {plan.approvalHistory.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4 font-semibold text-slate-200">
                          {entry.action.replace(/_/g, ' ')}
                          {entry.notes && (
                            <div className="text-xs text-slate-400 font-normal mt-0.5">{entry.notes}</div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-slate-300">{entry.by}</td>
                        <td className="px-5 py-4 text-slate-400 text-xs font-mono">
                          {entry.date ? new Date(entry.date).toLocaleString() : '-'}
                        </td>
                        <td className="px-5 py-4 text-indigo-300 font-mono">v{entry.version}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PlanDetailsView;
