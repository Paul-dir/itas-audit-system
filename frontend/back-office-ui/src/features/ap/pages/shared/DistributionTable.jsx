import { REGIONS, AUDIT_TYPES, getRegionById } from '../../data/constants.js';

const TYPE_COLORS = {
  desk_audit: 'bg-blue-50 text-blue-700',
  field_audit: 'bg-green-50 text-green-700',
  joint_audit: 'bg-purple-50 text-purple-700',
  transfer_pricing: 'bg-orange-50 text-orange-700',
  comprehensive: 'bg-red-50 text-red-700',
  issue_audit: 'bg-teal-50 text-teal-700',
};

// Read-only distribution table (region × audit type)
export function DistributionTable({ distribution, regions = REGIONS }) {
  if (!distribution) return null;

  const totals = {};
  AUDIT_TYPES.forEach(a => {
    totals[a.id] = regions.reduce((sum, r) => sum + (distribution[r.id]?.[a.id] || 0), 0);
  });
  const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-600">
      <table className="min-w-full text-xs">
        <thead className="bg-gray-50 dark:bg-slate-700 dark:bg-slate-700">
          <tr>
            <th className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-slate-300 sticky left-0 bg-gray-50 dark:bg-slate-700 dark:bg-slate-700">Region</th>
            {AUDIT_TYPES.map(a => (
              <th key={a.id} className="px-3 py-2.5 text-center font-semibold text-gray-600 dark:text-slate-300 whitespace-nowrap">{a.shortName}</th>
            ))}
            <th className="px-3 py-2.5 text-center font-semibold text-gray-700 dark:text-slate-200 bg-gray-100 dark:bg-slate-600">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-600 bg-white dark:bg-slate-700">
          {regions.map(region => {
            const dist = distribution[region.id] || {};
            const rowTotal = AUDIT_TYPES.reduce((sum, a) => sum + (dist[a.id] || 0), 0);
            return (
              <tr key={region.id} className="hover:bg-gray-50 dark:hover:bg-slate-600 dark:bg-slate-700">
                <td className="px-3 py-2.5 font-medium text-gray-700 dark:text-slate-200 sticky left-0 bg-white dark:bg-slate-700 whitespace-nowrap">{region.name}</td>
                {AUDIT_TYPES.map(a => (
                  <td key={a.id} className="px-3 py-2.5 text-center text-gray-600 dark:text-slate-300">
                    {dist[a.id] || 0}
                  </td>
                ))}
                <td className="px-3 py-2.5 text-center font-bold text-gray-800 dark:text-slate-200 bg-gray-50 dark:bg-slate-600 dark:bg-slate-700">{rowTotal}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="bg-gray-100 dark:bg-slate-600">
          <tr>
            <td className="px-3 py-2.5 font-bold text-gray-700 dark:text-slate-200">Total</td>
            {AUDIT_TYPES.map(a => (
              <td key={a.id} className="px-3 py-2.5 text-center font-bold text-gray-700 dark:text-slate-200">{totals[a.id]}</td>
            ))}
            <td className="px-3 py-2.5 text-center font-bold text-blue-700 dark:text-blue-400 text-sm">{grandTotal}</td>
          </tr>
        </tfoot>
      </table>
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

  const totals = {};
  AUDIT_TYPES.forEach(a => {
    totals[a.id] = regions.reduce((sum, r) => sum + (distribution[r.id]?.[a.id] || 0), 0);
  });
  const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0);

  return (
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
          {regions.map(region => {
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
  );
}

// Tax center allocation table (editable)
export function TaxCenterDistributionTable({ regionId, regionDist, tcAllocations, onChange }) {
  const { TAX_CENTERS, AUDIT_TYPES: AT } = { TAX_CENTERS: null, AUDIT_TYPES: null };
  // Import inline to avoid circular
  const tcs = (() => {
    const TC = {
      addis_ababa: [{ id: 'addis_ababa-tc1', name: 'AA-TC1' }, { id: 'addis_ababa-tc2', name: 'AA-TC2' }, { id: 'addis_ababa-tc3', name: 'AA-TC3' }],
      amhara: [{ id: 'amhara-tc1', name: 'AM-TC1' }, { id: 'amhara-tc2', name: 'AM-TC2' }, { id: 'amhara-tc3', name: 'AM-TC3' }],
      oromia: [{ id: 'oromia-tc1', name: 'OR-TC1' }, { id: 'oromia-tc2', name: 'OR-TC2' }, { id: 'oromia-tc3', name: 'OR-TC3' }],
      snnpr: [{ id: 'snnpr-tc1', name: 'SN-TC1' }, { id: 'snnpr-tc2', name: 'SN-TC2' }, { id: 'snnpr-tc3', name: 'SN-TC3' }],
      somali: [{ id: 'somali-tc1', name: 'SO-TC1' }, { id: 'somali-tc2', name: 'SO-TC2' }, { id: 'somali-tc3', name: 'SO-TC3' }],
    };
    return TC[regionId] || [];
  })();
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
