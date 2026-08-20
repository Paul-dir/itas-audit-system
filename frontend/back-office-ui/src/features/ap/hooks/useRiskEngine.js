/**
 * useRiskEngine (UPDATED)
 * NOW FETCHES DATA FROM ITAS BACKEND (localhost:8080) AS PRIMARY SOURCE
 * DOES NOT FALL BACK TO LOCAL DATA - backend is required
 * 
 * Filters out FIELD_AUDIT from backend response
 * Returns structured data ready for the Risk Analysis Dashboard and
 * plan-creation defaults.
 */
import { useState, useEffect, useCallback } from 'react';
import backendClient from '../services/backendClient.js';
import { REGIONS, AUDIT_TYPES } from '../data/constants.js';

// ── Main hook ──────────────────────────────────────────────────────────────
export function useRiskEngine(actorId = 'planning-team-001') {
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
      // Fetch both endpoints from ITAS backend (REQUIRED - no fallback)
      const [preFilledData, dashboardData] = await Promise.all([
        backendClient.getPreFilledPlanData(actorId),
        backendClient.getRiskAnalysisDashboard(actorId),
      ]);

      // Transform backend data to frontend format
      const riskDefaults = preFilledData.riskBasedDefaults || {};
      const caseDistTable = riskDefaults.caseDistributionTable || [];
      
      const backendRisk = dashboardData.riskBasedDefaults || dashboardData || {};
      const regionalData = backendRisk.regionalBreakdown || {};
      const auditDistribution = backendRisk.auditTypeDistribution || {};
      const riskDistribution = backendRisk.riskLevelDistribution || {};
      const nationalData = backendRisk.nationalAggregate || {};

      // National aggregate - FILTER OUT FIELD_AUDIT
      const national = {
        totalTaxpayers: nationalData.totalTaxpayers || 5200000,
        totalRisky: nationalData.totalRiskyTaxpayers || 430000,
        percentRisky: nationalData.riskPercentage ? parseFloat(nationalData.riskPercentage) : 8.27,
        byRiskLevel: {
          critical: {
            count: riskDistribution.critical?.count || 0,
            pct: (riskDistribution.critical?.percentage || 5.0).toString(),
          },
          high: {
            count: riskDistribution.high?.count || 0,
            pct: (riskDistribution.high?.percentage || 18.6).toString(),
          },
          medium: {
            count: riskDistribution.medium?.count || 0,
            pct: (riskDistribution.medium?.percentage || 34.8).toString(),
          },
          low: {
            count: riskDistribution.low?.count || 0,
            pct: (riskDistribution.low?.percentage || 41.6).toString(),
          },
        },
        byAuditType: AUDIT_TYPES.map(a => {
          // Backend returns uppercase keys: DESK_AUDIT, FIELD_AUDIT, etc.
          // Frontend only has: DESK_AUDIT, JOINT_AUDIT, TRANSFER_PRICING, COMPREHENSIVE, ISSUE_AUDIT (no FIELD_AUDIT)
          // Skip FIELD_AUDIT entries in mapping
          const backendKey = a.id.toUpperCase();
          
          // Only include non-FIELD_AUDIT types
          if (backendKey === 'FIELD_AUDIT') {
            return null; // Skip FIELD_AUDIT
          }
          
          const auditData = auditDistribution[backendKey];
          const count = auditData?.suggestedCount || 0;
          const percentage = auditData?.percentage || 0;
          return {
            ...a,
            count: count,
            pct: percentage.toFixed(1),
          };
        }).filter(Boolean), // Remove null entries
        auditRecommended: nationalData.totalAuditsRequired || 430000,
      };

      // Regional breakdown - FILTER OUT FIELD_AUDIT
      const byRegion = Object.entries(regionalData).map(([code, regionData]) => {
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
            // Backend returns uppercase keys: DESK_AUDIT, FIELD_AUDIT, etc.
            const backendKey = at.id.toUpperCase();
            
            // Skip FIELD_AUDIT
            if (backendKey === 'FIELD_AUDIT') {
              return null;
            }
            
            const auditData = auditDistribution[backendKey];
            const percentage = auditData?.percentage || 0;
            const totalRegionRisky = regionData.riskyTaxpayers || 0;
            const count = Math.round(totalRegionRisky * (percentage / 100));
            
            return {
              ...at,
              count: count,
              pct: percentage.toFixed(1),
            };
          }).filter(Boolean), // Remove null entries
        };
      });

      // Plan defaults - calculate from caseDistributionTable
      const planDefaults = {};
      REGIONS.forEach(region => {
        planDefaults[region.id] = {};
        const regionRow = caseDistTable.find(row => row.region === region.code);
        
        if (regionRow) {
          AUDIT_TYPES.forEach(auditType => {
            // Skip FIELD_AUDIT
            if (auditType.id === 'field_audit') {
              return;
            }
            
            // Map field names from caseDistributionTable
            let value = 0;
            if (auditType.id === 'desk_audit') value = regionRow.desk || 0;
            else if (auditType.id === 'joint_audit') value = regionRow.joint || 0;
            else if (auditType.id === 'transfer_pricing') value = regionRow.tprice || 0;
            else if (auditType.id === 'comprehensive') value = regionRow.comp || 0;
            else if (auditType.id === 'issue_audit') value = regionRow.issue || 0;
            
            planDefaults[region.id][auditType.id] = value;
          });
        } else {
          AUDIT_TYPES.forEach(auditType => {
            if (auditType.id !== 'field_audit') {
              planDefaults[region.id][auditType.id] = 0;
            }
          });
        }
      });

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
      console.error('[useRiskEngine] Backend API failed:', err.message);
      setState({
        loading: false,
        error: `Failed to fetch data from backend: ${err.message}`,
        source: 'backend',
        lastUpdated: null,
        national: null,
        byRegion: [],
        planDefaults: {},
      });
    }
  }, [actorId]);

  useEffect(() => { load(); }, [load]);

  return { ...state, reload: load };
}
