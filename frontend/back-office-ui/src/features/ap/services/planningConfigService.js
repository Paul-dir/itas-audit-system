/**
 * planningConfigService.js
 * 
 * Central service for retrieving, updating, and computing planning parameters:
 * - Dynamic Audit Types (name, effort hours, complexity, revenue, governance routing, active status)
 * - Configurable Regions & Optional Nested Tax Centers (Add / Remove / Edit regions and tax centers)
 * - Auditor Capacity & Available Resources (work days, productive hours, regional headcount)
 * - Effort Estimation & Multipliers (complexity multipliers, contingency buffer)
 */

import { storage, STORE_KEYS } from './storage.js';

const CONFIG_API_URL = '/api/v1/backoffice/ap/config/planning';

export const DEFAULT_PLANNING_CONFIG = {
  auditTypes: [
    {
      id: 'desk_audit',
      name: 'Desk Audit',
      shortName: 'Desk',
      effortPerCase: 40,
      complexity: 'Low',
      revenuePerCase: 150000,
      governanceRouting: 'TEAM_LEADER',
      color: 'blue',
      description: 'Remote audit using taxpayer electronic records & ITAS cross-matching',
      active: true,
    },
    {
      id: 'field_audit',
      name: 'Field Audit',
      shortName: 'Field',
      effortPerCase: 120,
      complexity: 'Medium',
      revenuePerCase: 350000,
      governanceRouting: 'TEAM_LEADER',
      color: 'green',
      description: 'Comprehensive on-site audit with physical premises verification',
      active: true,
    },
    {
      id: 'joint_audit',
      name: 'Joint Audit',
      shortName: 'Joint',
      effortPerCase: 160,
      complexity: 'High',
      revenuePerCase: 750000,
      governanceRouting: 'COMMITTEE',
      color: 'purple',
      description: 'Cross-directorate coordinated audit with Customs and Regional offices',
      active: true,
    },
    {
      id: 'transfer_pricing',
      name: 'Transfer Pricing',
      shortName: 'TP',
      effortPerCase: 80,
      complexity: 'High',
      revenuePerCase: 1500000,
      governanceRouting: 'COMMITTEE',
      color: 'orange',
      description: 'Specialized cross-border intercompany transaction & BEPS examination',
      active: true,
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive',
      shortName: 'Comp',
      effortPerCase: 200,
      complexity: 'Very High',
      revenuePerCase: 1000000,
      governanceRouting: 'TEAM_LEADER',
      color: 'red',
      description: 'Full-scope statutory corporate income tax, VAT, and excise audit',
      active: true,
    },
    {
      id: 'issue_audit',
      name: 'Issue Audit',
      shortName: 'Issue',
      effortPerCase: 50,
      complexity: 'Medium',
      revenuePerCase: 250000,
      governanceRouting: 'TEAM_LEADER',
      color: 'teal',
      description: 'Targeted single-issue or specific risk transaction examination',
      active: true,
    },
  ],
  capacity: {
    workingDaysPerYear: 220,
    hoursPerDay: 8.0,
    directProductiveRatio: 0.75,
    annualTrainingDays: 5,
    annualLeaveDays: 20,
    regionalHeadcount: {
      federal_level: 120,
      addis_ababa: 600,
      oromia: 400,
      amhara: 250,
      dire_dawa: 50,
      snnpr: 80,
      somali: 100,
      sidama: 100,
    },
  },
  regions: [
    {
      id: 'federal_level',
      name: 'Federal Level (LTO)',
      code: 'FED',
      headcount: 120,
      taxpayers: 150000,
      active: true,
      taxCenters: [
        { id: 'federal-lto1', name: 'Federal Large Taxpayers Office 1', shortName: 'FED-LTO1' },
        { id: 'federal-lto2', name: 'Federal Large Taxpayers Office 2', shortName: 'FED-LTO2' },
      ],
    },
    {
      id: 'addis_ababa',
      name: 'Addis Ababa',
      code: 'AA',
      headcount: 600,
      taxpayers: 2500000,
      active: true,
      taxCenters: [
        { id: 'addis_ababa-tc1', name: 'Addis Ababa TC1', shortName: 'AA-TC1' },
        { id: 'addis_ababa-tc2', name: 'Addis Ababa TC2', shortName: 'AA-TC2' },
        { id: 'addis_ababa-tc3', name: 'Addis Ababa TC3', shortName: 'AA-TC3' },
      ],
    },
    {
      id: 'oromia',
      name: 'Oromia',
      code: 'BB',
      headcount: 400,
      taxpayers: 1300000,
      active: true,
      taxCenters: [
        { id: 'oromia-tc1', name: 'Oromia TC1', shortName: 'BB-TC1' },
        { id: 'oromia-tc2', name: 'Oromia TC2', shortName: 'BB-TC2' },
        { id: 'oromia-tc3', name: 'Oromia TC3', shortName: 'BB-TC3' },
      ],
    },
    {
      id: 'amhara',
      name: 'Amhara',
      code: 'BA',
      headcount: 250,
      taxpayers: 750000,
      active: true,
      taxCenters: [
        { id: 'amhara-tc1', name: 'Amhara TC1', shortName: 'BA-TC1' },
        { id: 'amhara-tc2', name: 'Amhara TC2', shortName: 'BA-TC2' },
        { id: 'amhara-tc3', name: 'Amhara TC3', shortName: 'BA-TC3' },
      ],
    },
    {
      id: 'dire_dawa',
      name: 'Dire Dawa',
      code: 'AB',
      headcount: 50,
      taxpayers: 100000,
      active: true,
      taxCenters: [
        { id: 'dire_dawa-tc1', name: 'Dire Dawa TC1', shortName: 'AB-TC1' },
        { id: 'dire_dawa-tc2', name: 'Dire Dawa TC2', shortName: 'AB-TC2' },
        { id: 'dire_dawa-tc3', name: 'Dire Dawa TC3', shortName: 'AB-TC3' },
      ],
    },
    {
      id: 'snnpr',
      name: 'SNNPR',
      code: 'CA',
      headcount: 80,
      taxpayers: 280000,
      active: true,
      taxCenters: [
        { id: 'snnpr-tc1', name: 'SNNPR TC1', shortName: 'CA-TC1' },
        { id: 'snnpr-tc2', name: 'SNNPR TC2', shortName: 'CA-TC2' },
        { id: 'snnpr-tc3', name: 'SNNPR TC3', shortName: 'CA-TC3' },
      ],
    },
    {
      id: 'somali',
      name: 'Somali',
      code: 'SO',
      headcount: 100,
      taxpayers: 200000,
      active: true,
      taxCenters: [
        { id: 'somali-tc1', name: 'Somali TC1', shortName: 'SO-TC1' },
        { id: 'somali-tc2', name: 'Somali TC2', shortName: 'SO-TC2' },
        { id: 'somali-tc3', name: 'Somali TC3', shortName: 'SO-TC3' },
      ],
    },
    {
      id: 'sidama',
      name: 'Sidama',
      code: 'SI',
      headcount: 100,
      taxpayers: 350000,
      active: true,
      taxCenters: [],
    },
  ],
  effortEstimation: {
    complexityMultipliers: {
      Low: 0.85,
      Medium: 1.0,
      High: 1.35,
      'Very High': 1.70,
    },
    contingencyBufferPercentage: 15,
    travelOverheadHoursPerFieldCase: 16,
  },
  lastUpdated: new Date().toISOString(),
  updatedBy: 'SYSTEM_DEFAULT',
  version: 1,
};

/**
 * Fetch current planning configuration from backend, fallback to storage / defaults.
 */
export async function getPlanningConfig() {
  try {
    const res = await fetch(CONFIG_API_URL, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.auditTypes) {
        // Ensure regions exist in returned data
        const data = {
          ...DEFAULT_PLANNING_CONFIG,
          ...json.data,
          regions: json.data.regions || DEFAULT_PLANNING_CONFIG.regions,
        };
        storage.set(STORE_KEYS.PLANNING_CONFIG, data);
        return data;
      }
    }
  } catch (err) {
    console.warn('[planningConfigService] Backend fetch failed, reading local storage:', err);
  }

  return storage.get(STORE_KEYS.PLANNING_CONFIG, DEFAULT_PLANNING_CONFIG);
}

/**
 * Save updated planning configuration to backend and localStorage.
 */
export async function savePlanningConfig(newConfig, updatedBy = 'Planning Team') {
  // Sync capacity.regionalHeadcount with regions array
  const updatedHeadcount = {};
  if (Array.isArray(newConfig.regions)) {
    newConfig.regions.forEach(r => {
      if (r.active !== false) {
        updatedHeadcount[r.id] = parseInt(r.headcount) || 0;
      }
    });
  }

  const payload = {
    ...newConfig,
    capacity: {
      ...(newConfig.capacity || {}),
      regionalHeadcount: updatedHeadcount,
    },
    updatedBy,
    lastUpdated: new Date().toISOString(),
  };

  storage.set(STORE_KEYS.PLANNING_CONFIG, payload);

  try {
    const res = await fetch(CONFIG_API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        const finalData = {
          ...payload,
          ...json.data,
          regions: json.data.regions || payload.regions,
        };
        storage.set(STORE_KEYS.PLANNING_CONFIG, finalData);
        return finalData;
      }
    }
  } catch (err) {
    console.warn('[planningConfigService] Backend update failed, saved locally:', err);
  }

  return payload;
}

/**
 * Reset planning configuration to statutory Ministry defaults.
 */
export async function resetPlanningConfig() {
  try {
    const res = await fetch(`${CONFIG_API_URL}/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        storage.set(STORE_KEYS.PLANNING_CONFIG, json.data);
        return json.data;
      }
    }
  } catch (err) {
    console.warn('[planningConfigService] Backend reset failed, resetting locally:', err);
  }

  storage.set(STORE_KEYS.PLANNING_CONFIG, DEFAULT_PLANNING_CONFIG);
  return DEFAULT_PLANNING_CONFIG;
}

/**
 * Calculate capacity metrics from configuration.
 */
export function calculateCapacityMetrics(config = DEFAULT_PLANNING_CONFIG) {
  const cap = config?.capacity || DEFAULT_PLANNING_CONFIG.capacity;
  const auditTypes = config?.auditTypes || DEFAULT_PLANNING_CONFIG.auditTypes;
  const regions = config?.regions || DEFAULT_PLANNING_CONFIG.regions;

  const productiveHoursPerAuditor = Math.round(
    (cap.workingDaysPerYear || 220) * (cap.hoursPerDay || 8) * (cap.directProductiveRatio || 0.75)
  );

  const activeRegions = regions.filter(r => r.active !== false);
  const totalAuditors = activeRegions.reduce((sum, r) => sum + (parseInt(r.headcount) || 0), 0);
  const totalProductiveHours = totalAuditors * productiveHoursPerAuditor;

  const activeTypes = auditTypes.filter(t => t.active !== false);
  const avgEffortPerCase = activeTypes.length > 0
    ? Math.round(activeTypes.reduce((s, t) => s + (t.effortPerCase || 80), 0) / activeTypes.length)
    : 100;

  const estimatedMaxCases = avgEffortPerCase > 0 ? Math.round(totalProductiveHours / avgEffortPerCase) : 0;

  return {
    productiveHoursPerAuditor,
    totalAuditors,
    totalProductiveHours,
    avgEffortPerCase,
    estimatedMaxCases,
    regionalCapacity: activeRegions.reduce((acc, reg) => {
      const auditors = parseInt(reg.headcount) || 0;
      acc[reg.id] = {
        name: reg.name,
        code: reg.code,
        auditors,
        availableHours: auditors * productiveHoursPerAuditor,
        maxCases: avgEffortPerCase > 0 ? Math.round((auditors * productiveHoursPerAuditor) / avgEffortPerCase) : 0,
        taxCentersCount: reg.taxCenters?.length || 0,
      };
      return acc;
    }, {}),
  };
}

/**
 * Calculate estimated effort required for a given distribution map:
 * distribution: { [regionId]: { [auditTypeId]: cases } }
 */
export function calculatePlanEffort(distribution = {}, config = DEFAULT_PLANNING_CONFIG) {
  if (!distribution) return { totalRequiredHours: 0, totalCases: 0, byAuditType: {} };

  const auditTypes = config?.auditTypes || DEFAULT_PLANNING_CONFIG.auditTypes;
  const multipliers = config?.effortEstimation?.complexityMultipliers || DEFAULT_PLANNING_CONFIG.effortEstimation.complexityMultipliers;
  const contingency = (config?.effortEstimation?.contingencyBufferPercentage || 15) / 100;

  let totalCases = 0;
  let totalRequiredHours = 0;
  const byAuditType = {};

  auditTypes.forEach(t => {
    byAuditType[t.id] = { cases: 0, hours: 0, revenue: 0 };
  });

  Object.values(distribution).forEach(regDist => {
    if (!regDist) return;
    Object.entries(regDist).forEach(([typeId, cases]) => {
      const numCases = parseInt(cases) || 0;
      if (numCases <= 0) return;

      const typeDef = auditTypes.find(t => t.id === typeId) || { effortPerCase: 80, complexity: 'Medium', revenuePerCase: 250000 };
      const mult = multipliers[typeDef.complexity] || 1.0;
      const baseHours = numCases * (typeDef.effortPerCase || 80) * mult;
      const bufferedHours = Math.round(baseHours * (1 + contingency));
      const estRevenue = numCases * (typeDef.revenuePerCase || 250000);

      totalCases += numCases;
      totalRequiredHours += bufferedHours;

      if (!byAuditType[typeId]) {
        byAuditType[typeId] = { cases: 0, hours: 0, revenue: 0 };
      }
      byAuditType[typeId].cases += numCases;
      byAuditType[typeId].hours += bufferedHours;
      byAuditType[typeId].revenue += estRevenue;
    });
  });

  return {
    totalCases,
    totalRequiredHours,
    byAuditType,
  };
}
