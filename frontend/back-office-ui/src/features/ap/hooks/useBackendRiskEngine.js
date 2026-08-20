/**
 * useBackendRiskEngine.js
 * 
 * Hook that fetches data from the ITAS backend instead of external APIs.
 * Transforms backend response into the same format that RiskAnalysisDashboard and CreatePlanModal expect.
 * 
 * Backend endpoints:
 * - GET /api/v1/backoffice/ap/plans/pre-filled-data (risk-based case distribution)
 * - GET /api/v1/backoffice/ap/plans/risk-analysis/dashboard (comprehensive risk analysis)
 */

import { useState, useEffect, useCallback } from 'react';
import backendClient from '../services/backendClient.js';
import { REGIONS, AUDIT_TYPES } from '../data/constants.js';

/**
 * Transform backend pre-filled data to frontend format
 */
function transformBackendPreFilledData(backendData) {
  try {
    const riskDefaults = backendData.riskBasedDefaults || {};
    const caseDistTable = riskDefaults.caseDistributionTable || [];
    const suggestedQuotas = riskDefaults.suggestedQuotas || {};

    // Transform case distribution table to frontend distribution format
    const planDefaults = {};
    REGIONS.forEach(region => {
      planDefaults[region.id] = {};
      const regionRow = caseDistTable.find(row => row.region === region.code);
      
      if (regionRow) {
        // Map backend audit type names to frontend audit type IDs
        AUDIT_TYPES.forEach(auditType => {
          // Backend returns: desk, field, joint, tprice, comp, issue
          const backendKey = auditType.id.replace('_audit', '').replace('_pricing', 'price');
          const backendValue = regionRow[backendKey] || regionRow[auditType.id] || 0;
          planDefaults[region.id][auditType.id] = backendValue;
        });
      } else {
        AUDIT_TYPES.forEach(auditType => {
          planDefaults[region.id][auditType.id] = 0;
        });
      }
    });

    return planDefaults;
  } catch (err) {
    console.error('[useBackendRiskEngine] Error transforming pre-filled data:', err);
    return {};
  }
}

/**
 * Transform backend risk analysis dashboard to frontend format
 */
function transformBackendDashboard(backendData) {
  try {
    const riskData = backendData.riskBasedDefaults || backendData || {};
    const national = riskData.nationalAggregate || {};
    const regionalData = riskData.regionalBreakdown || {};
    const auditDistribution = riskData.auditTypeDistribution || {};
    const riskDistribution = riskData.riskLevelDistribution || {};

    // National aggregate
    const nationalAgg = {
      totalTaxpayers: national.totalTaxpayers || 5200000,
      totalRisky: national.totalRiskyTaxpayers || 430000,
      percentRisky: national.riskPercentage ? parseFloat(national.riskPercentage) : 8.27,
      byRiskLevel: {
        critical: {
          count: riskDistribution.critical?.count || national.riskLevelCounts?.critical || 0,
          pct: riskDistribution.critical?.percentage?.toString() || '5.0',
        },
        high: {
          count: riskDistribution.high?.count || national.riskLevelCounts?.high || 0,
          pct: riskDistribution.high?.percentage?.toString() || '18.6',
        },
        medium: {
          count: riskDistribution.medium?.count || national.riskLevelCounts?.medium || 0,
          pct: riskDistribution.medium?.percentage?.toString() || '34.8',
        },
        low: {
          count: riskDistribution.low?.count || national.riskLevelCounts?.low || 0,
          pct: riskDistribution.low?.percentage?.toString() || '41.6',
        },
      },
      byAuditType: AUDIT_TYPES.map(at => ({
        ...at,
        count: auditDistribution[at.id]?.suggestedCount || 0,
        pct: auditDistribution[at.id]?.percentage?.toString() || '0',
      })),
      auditRecommended: (national.totalAuditsRequired || 430000),
    };

    // Regional breakdown
    const byRegion = Object.entries(regionalData).map(([code, regionData]) => {
      const riskCounts = regionData.riskLevelCounts || {};
      return {
        id: code.toLowerCase(),
        code: code,
        name: regionData.regionName || code,
        totalTaxpayers: regionData.taxpayers || 0,
        totalRisky: regionData.riskyTaxpayers || 0,
        percentRisky: regionData.taxpayers > 0
          ? ((regionData.riskyTaxpayers / regionData.taxpayers) * 100).toFixed(2)
          : '0',
        byAuditType: AUDIT_TYPES.map(at => {
          const auditKey = at.id.replace('_audit', '').replace('_pricing', 'price');
          const regionBreakdown = regionData.riskLevelBreakdown || {};
          // Estimate audit count based on risk distribution
          const totalRegionRisky = regionData.riskyTaxpayers || 0;
          const percentage = auditDistribution[at.id]?.percentage || 0;
          const count = Math.round(totalRegionRisky * (percentage / 100));
          
          return {
            ...at,
            count: count,
            pct: percentage.toFixed(1),
          };
        }),
      };
    });

    return { national: nationalAgg, byRegion };
  } catch (err) {
    console.error('[useBackendRiskEngine] Error transforming dashboard:', err);
    return { national: {}, byRegion: [] };
  }
}

/**
 * Main hook - fetches from backend and transforms data for frontend use
 */
export function useBackendRiskEngine(actorId = 'planning-team-001') {
  const [state, setState] = useState({
    loading: true,
    error: null,
    source: 'backend',
    lastUpdated: null,
    national: null,
    byRegion: [],
    planDefaults: {},
  });

  const load = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));

    try {
      // Fetch both endpoints in parallel for efficiency
      const [preFilledResult, dashboardResult] = await Promise.allSettled([
        backendClient.getPreFilledPlanData(actorId),
        backendClient.getRiskAnalysisDashboard(actorId),
      ]);

      if (preFilledResult.status === 'rejected') throw preFilledResult.reason;
      if (dashboardResult.status === 'rejected') throw dashboardResult.reason;

      const preFilledData = preFilledResult.value;
      const dashboardData = dashboardResult.value;

      // Transform backend data to frontend format
      const planDefaults = transformBackendPreFilledData(preFilledData);
      const { national, byRegion } = transformBackendDashboard(dashboardData);

      setState({
        loading: false,
        error: null,
        source: 'backend',
        lastUpdated: new Date(),
        national,
        byRegion,
        planDefaults,
      });
    } catch (err) {
      console.error('[useBackendRiskEngine] Failed to load backend data:', err);
      setState(s => ({
        ...s,
        loading: false,
        error: err.message || 'Failed to connect to backend. Ensure server is running on localhost:8080',
        source: 'backend',
      }));
    }
  }, [actorId]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}

export default useBackendRiskEngine;
