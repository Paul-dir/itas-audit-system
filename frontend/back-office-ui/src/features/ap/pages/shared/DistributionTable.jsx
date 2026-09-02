import { REGIONS, TAX_CENTERS, AUDIT_TYPES, getRegionById } from '../../data/constants.js';

const TYPE_COLORS = {
  desk_audit: 'bg-blue-50 text-blue-700',
  field_audit: 'bg-green-50 text-green-700',
  joint_audit: 'bg-purple-50 text-purple-700',
  transfer_pricing: 'bg-orange-50 text-orange-700',
  comprehensive: 'bg-red-50 text-red-700',
  issue_audit: 'bg-teal-50 text-teal-700',
};

// ── Backend Regions Mapping ────────────────────────────────────────────────
const BACKEND_REGIONS = [
  { id: 'addis_ababa', name: 'Addis Ababa', code: 'AA' },
  { id: 'amhara', name: 'Amhara', code: 'BA' },
  { id: 'oromia', name: 'Oromia', code: 'BB' },
  { id: 'dire_dawa', name: 'Dire Dawa', code: 'AB' },
  { id: 'snnpr', name: 'SNNPR', code: 'CA' },
  { id: 'somali', name: 'Somalia', code: 'SO' },
];

// Estimated Revenue multipliers per case by audit type (in ETB)
const REVENUE_PER_CASE = {
  desk_audit: 150000,        // 150k ETB per case
  field_audit: 350000,       // 350k ETB per case
  joint_audit: 750000,       // 750k ETB per case
  transfer_pricing: 1500000, // 1.5M ETB per case
  comprehensive: 1000000,    // 1M ETB per case
  issue_audit: 250000,       // 250k ETB per case
};

// Read-only distribution table (region × audit type)
export function DistributionTable({ distribution, regions = REGIONS }) {
  console.log('📊 [DistributionTable] Received distribution:', distribution);
  
  if (!distribution) {
    return null;
  }

  const totals = {};
  const revenueTotals = {};
  
  AUDIT_TYPES.forEach(a => {
    const caseCount = regions.reduce((sum, r) => {
      const dist = distribution[r.id] || distribution[r.code] || distribution[r.id?.toLowerCase()] || {};
      return sum + (dist[a.id] || dist[a.shortName] || 0);
    }, 0);
    totals[a.id] = caseCount;
    revenueTotals[a.id] = caseCount * (REVENUE_PER_CASE[a.id] || 250000);
  });
  
  const grandTotalCases = Object.values(totals).reduce((s, v) => s + v, 0);
  const grandTotalRevenue = Object.values(revenueTotals).reduce((s, v) => s + v, 0);

  const formatCurrency = (val) => {
    if (val >= 1000000000) return `${(val / 1000000000).toFixed(2)}B ETB`;
    if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M ETB`;
    return `${(val / 1000).toFixed(0)}k ETB`;
  };

  return (
    <div className="space-y-4">
      {/* Revenue Aggregate Summary Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-xl shadow-md border border-slate-700">
        <div>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Total Planned Cases</p>
          <p className="text-xl font-bold text-blue-400 mt-0.5">{grandTotalCases.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Est. Revenue Aggregate</p>
          <p className="text-xl font-bold text-emerald-400 mt-0.5">{formatCurrency(grandTotalRevenue)}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Top Revenue Driver</p>
          <p className="text-sm font-semibold text-orange-300 mt-1">Transfer Pricing (1.5M/case)</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Hierarchical Scoping</p>
          <p className="text-xs font-medium text-emerald-300 mt-1">✓ Strict Isolated 1:1 Tax Center & Taxpayer Ownership</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-600">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-slate-300 sticky left-0 bg-gray-50 dark:bg-slate-700">Region</th>
              {AUDIT_TYPES.map(a => (
                <th key={a.id} className="px-3 py-2.5 text-center font-semibold text-gray-600 dark:text-slate-300 whitespace-nowrap">
                  {a.shortName}
                  <span className="block text-[10px] font-normal text-slate-400">({formatCurrency(REVENUE_PER_CASE[a.id])}/case)</span>
                </th>
              ))}
              <th className="px-3 py-2.5 text-center font-semibold text-gray-700 dark:text-slate-200 bg-gray-100 dark:bg-slate-600">Total Cases</th>
              <th className="px-3 py-2.5 text-right font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950">Est. Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-600 bg-white dark:bg-slate-700">
            {regions.map(region => {
              const dist = distribution[region.id] || distribution[region.code] || distribution[region.id?.toLowerCase()] || {};
              const rowCases = AUDIT_TYPES.reduce((sum, a) => sum + (dist[a.id] || dist[a.shortName] || 0), 0);
              const rowRevenue = AUDIT_TYPES.reduce((sum, a) => sum + ((dist[a.id] || dist[a.shortName] || 0) * (REVENUE_PER_CASE[a.id] || 250000)), 0);
              return (
                <tr key={region.id} className="hover:bg-gray-50 dark:hover:bg-slate-600">
                  <td className="px-3 py-2.5 font-medium text-gray-700 dark:text-slate-200 sticky left-0 bg-white dark:bg-slate-700 whitespace-nowrap">{region.name}</td>
                  {AUDIT_TYPES.map(a => (
                    <td key={a.id} className="px-3 py-2.5 text-center text-gray-600 dark:text-slate-300">
                      {dist[a.id] || dist[a.shortName] || 0}
                    </td>
                  ))}
                  <td className="px-3 py-2.5 text-center font-bold text-gray-800 dark:text-slate-200 bg-gray-50 dark:bg-slate-600">{rowCases}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/50">{formatCurrency(rowRevenue)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-100 dark:bg-slate-600">
            <tr>
              <td className="px-3 py-2.5 font-bold text-gray-700 dark:text-slate-200">Total Cases</td>
              {AUDIT_TYPES.map(a => (
                <td key={a.id} className="px-3 py-2.5 text-center font-bold text-gray-700 dark:text-slate-200">{totals[a.id]}</td>
              ))}
              <td className="px-3 py-2.5 text-center font-bold text-blue-700 dark:text-blue-400 text-sm">{grandTotalCases}</td>
              <td className="px-3 py-2.5 text-right font-bold text-emerald-700 dark:text-emerald-300 text-sm bg-emerald-100 dark:bg-emerald-900">{formatCurrency(grandTotalRevenue)}</td>
            </tr>
            <tr className="bg-emerald-50 dark:bg-emerald-950/80 border-t border-emerald-200 dark:border-emerald-800">
              <td className="px-3 py-2 font-semibold text-emerald-900 dark:text-emerald-200">Revenue per Type</td>
              {AUDIT_TYPES.map(a => (
                <td key={a.id} className="px-3 py-2 text-center font-semibold text-emerald-800 dark:text-emerald-300 text-[11px] whitespace-nowrap">
                  {formatCurrency(revenueTotals[a.id])}
                </td>
              ))}
              <td colSpan={2} className="px-3 py-2 text-right font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                Total Est: {formatCurrency(grandTotalRevenue)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// Editable distribution table for plan creation
export function EditableDistributionTable({ distribution, onChange, regions = REGIONS }) {
  const handleChange = (regionId, auditTypeId, rawValue) => {
    const value = Math.max(0, parseInt(rawValue) || 0);
    const newDist = {
      ...distribution,
      [regionId]: { ...(distribution[regionId] || {}), [auditTypeId]: value },
    };
    onChange(newDist);
  };

  // Show ALL regions (no filtering)
  const regionsToDisplay = regions;

  // Calculate Federal Level (for federal-licensed taxpayers only - smaller subset)
  const federalTotals = {};
  AUDIT_TYPES.forEach(a => {
    federalTotals[a.id] = regionsToDisplay.reduce((sum, r) => sum + (distribution[r.id]?.[a.id] || 0), 0);
  });
  const federalGrandTotal = Object.values(federalTotals).reduce((s, v) => s + v, 0);

  // Regional totals
  const totals = {};
  AUDIT_TYPES.forEach(a => {
    totals[a.id] = regionsToDisplay.reduce((sum, r) => sum + (distribution[r.id]?.[a.id] || 0), 0);
  });
  const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-6">
      {/* Federal Level Summary */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">🏛️ Federal Level Summary</h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Taxpayers with federal business license</p>
        <div className="overflow-x-auto rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
          <table className="min-w-full text-xs">
            <thead className="bg-blue-100 dark:bg-blue-900">
              <tr>
                <th className="px-3 py-2.5 text-left font-bold text-blue-900 dark:text-blue-100 min-w-[120px]">Federal Level</th>
                {AUDIT_TYPES.map(a => (
                  <th key={a.id} className="px-2 py-2.5 text-center font-bold text-blue-900 dark:text-blue-100 min-w-[70px] whitespace-nowrap">{a.shortName}</th>
                ))}
                <th className="px-3 py-2.5 text-center font-bold text-blue-900 dark:text-blue-100">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-blue-950">
              <tr>
                <td className="px-3 py-2.5 font-bold text-blue-900 dark:text-blue-100">Federal Taxpayers</td>
                {AUDIT_TYPES.map(a => (
                  <td key={a.id} className="px-2 py-2.5 text-center font-bold text-blue-900 dark:text-blue-200 tabular-nums">
                    {federalTotals[a.id]}
                  </td>
                ))}
                <td className="px-3 py-2.5 text-center font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 tabular-nums text-base">
                  {federalGrandTotal}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Regional Distribution */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">🗺️ Regional Distribution</h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-600">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-slate-300 min-w-[120px]">Region</th>
                {AUDIT_TYPES.map(a => (
                  <th key={a.id} className="px-2 py-2.5 text-center font-semibold text-gray-600 dark:text-slate-300 min-w-[70px] whitespace-nowrap">{a.shortName}</th>
                ))}
                <th className="px-3 py-2.5 text-center font-semibold text-gray-700 dark:text-slate-200 bg-gray-100 dark:bg-slate-600">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-600 bg-white dark:bg-slate-700">
              {regionsToDisplay.map(region => {
                const dist = distribution[region.id] || {};
                const rowTotal = AUDIT_TYPES.reduce((sum, a) => sum + (dist[a.id] || 0), 0);
                return (
                  <tr key={region.id} className="hover:bg-blue-50 dark:hover:bg-slate-600">
                    <td className="px-3 py-2 font-medium text-gray-700 dark:text-slate-200 whitespace-nowrap">{region.name}</td>
                    {AUDIT_TYPES.map(a => (
                      <td key={a.id} className="px-1.5 py-1.5">
                        <input
                          type="number"
                          min={0}
                          value={dist[a.id] || ''}
                          onChange={e => handleChange(region.id, a.id, e.target.value)}
                          placeholder="0"
                          className="w-16 text-center border border-gray-200 dark:border-slate-500 rounded-lg py-1.5 text-xs bg-white dark:bg-slate-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                      </td>
                    ))}
                    <td className="px-3 py-2 text-center font-bold text-gray-800 dark:text-slate-200 bg-gray-50 dark:bg-slate-600 tabular-nums">{rowTotal}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-100 dark:bg-slate-600">
              <tr>
                <td className="px-3 py-2.5 font-bold text-gray-700 dark:text-slate-200">Total</td>
                {AUDIT_TYPES.map(a => (
                  <td key={a.id} className="px-2 py-2.5 text-center font-bold text-gray-700 dark:text-slate-200 tabular-nums">{totals[a.id]}</td>
                ))}
                <td className="px-3 py-2.5 text-center font-bold text-blue-700 dark:text-blue-400 text-sm tabular-nums">{grandTotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

// Tax center allocation table (editable)
export function TaxCenterDistributionTable({ regionId, regionDist, tcAllocations, onChange }) {
  const tcs = TAX_CENTERS[regionId] || [];
  const auditTypes = AUDIT_TYPES;

  const handleChange = (tcId, auditTypeId, rawValue) => {
    const value = Math.max(0, parseInt(rawValue) || 0);
    const newAlloc = {
      ...tcAllocations,
      [tcId]: { ...(tcAllocations[tcId] || {}), [auditTypeId]: value },
    };
    onChange(newAlloc);
  };

  const columnTotals = {};
  auditTypes.forEach(a => {
    columnTotals[a.id] = tcs.reduce((sum, tc) => sum + (tcAllocations[tc.id]?.[a.id] || 0), 0);
  });
  const grandTotal = Object.values(columnTotals).reduce((s, v) => s + v, 0);
  const regionGrandTotal = Object.values(regionDist).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-slate-400">Distribute <strong className="text-gray-800 dark:text-gray-200">{regionGrandTotal} cases</strong> across {tcs.length} tax centers</span>
        <span className={`font-semibold ${grandTotal === regionGrandTotal ? 'text-green-600' : 'text-orange-600'}`}>
          Allocated: {grandTotal} / {regionGrandTotal}
        </span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-600">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-50 dark:bg-gray-800 dark:bg-slate-700">
            <tr>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-slate-400">Tax Center</th>
              {auditTypes.map(a => {
                const colMatch = columnTotals[a.id] === (regionDist[a.id] || 0);
                return (
                  <th key={a.id} className={`px-2 py-2.5 text-center font-semibold min-w-[70px] whitespace-nowrap ${colMatch ? 'text-green-600' : 'text-gray-600'}`}>
                    {a.shortName}
                    <span className="block text-[9px] font-normal text-gray-400 dark:text-gray-500">/ {regionDist[a.id] || 0}</span>
                  </th>
                );
              })}
              <th className="px-3 py-2.5 text-center font-semibold text-gray-700 bg-gray-100">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:bg-gray-800">
            {tcs.map(tc => {
              const alloc = tcAllocations[tc.id] || {};
              const rowTotal = auditTypes.reduce((sum, a) => sum + (alloc[a.id] || 0), 0);
              return (
                <tr key={tc.id} className="hover:bg-blue-50 dark:hover:bg-slate-600">
                  <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap">{tc.name}</td>
                  {auditTypes.map(a => (
                    <td key={a.id} className="px-1.5 py-1.5">
                      <input
                        type="number" min={0}
                        value={alloc[a.id] || ''}
                        onChange={e => handleChange(tc.id, a.id, e.target.value)}
                        placeholder="0"
                        className="w-16 text-center border border-gray-200 rounded-lg py-1.5 text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2 text-center font-bold text-gray-800 bg-gray-50 tabular-nums dark:bg-slate-700">{rowTotal}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td className="px-3 py-2.5 font-bold text-gray-700 dark:text-slate-200">Total</td>
              {auditTypes.map(a => {
                const colMatch = columnTotals[a.id] === (regionDist[a.id] || 0);
                return (
                  <td key={a.id} className={`px-2 py-2.5 text-center font-bold tabular-nums ${colMatch ? 'text-green-600' : 'text-orange-600'}`}>
                    {columnTotals[a.id]}
                  </td>
                );
              })}
              <td className={`px-3 py-2.5 text-center font-bold text-sm tabular-nums ${grandTotal === regionGrandTotal ? 'text-green-600' : 'text-orange-600'}`}>
                {grandTotal}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {auditTypes.map(a => columnTotals[a.id] !== (regionDist[a.id] || 0)).some(Boolean) && (
        <p className="text-xs text-orange-600">⚠ Some columns don't match their regional targets. Each column must equal the target shown.</p>
      )}
    </div>
  );
}
