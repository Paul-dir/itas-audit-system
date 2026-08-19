/**
 * useRiskEngine
 * Fetches live data from the Risk Engine & Taxpayer Registration APIs.
 * Falls back to locally-computed estimates (from auditConfig) when the APIs
 * are unreachable (CORS, network, etc.).
 *
 * Returns structured data ready for the Risk Analysis Dashboard and
 * plan-creation defaults.
 */
import { useState, useEffect, useCallback } from 'react';
import riskEngineClient from '../api/riskEngineClient.js';
import taxpayerClient from '../api/taxpayerClient.js';
import { auditConfig } from '../config/auditConfig.js';
import { REGIONS, AUDIT_TYPES } from '../data/constants.js';

// ── Audit-type keyword mapper ──────────────────────────────────────────────
const AUDIT_TYPE_KEYWORDS = {
  desk_audit:       ['desk', 'remote', 'office'],
  field_audit:      ['field', 'on-site', 'onsite', 'visit'],
  joint_audit:      ['joint', 'coordinated', 'multi'],
  transfer_pricing: ['transfer', 'cross-border', 'pricing'],
  comprehensive:    ['comprehensive', 'full', 'complete'],
  issue_audit:      ['issue', 'single', 'specific', 'focused'],
};

export function mapSuggestedAuditType(suggested) {
  if (!suggested) return 'desk_audit';
  const s = suggested.toLowerCase();
  for (const [id, keywords] of Object.entries(AUDIT_TYPE_KEYWORDS)) {
    if (keywords.some(k => s.includes(k))) return id;
  }
  return 'desk_audit';
}

// ── Local fallback computation ─────────────────────────────────────────────
function computeLocalData() {
  const cfgRegions = auditConfig.regions; // has taxpayer counts
  const dist = auditConfig.riskDistribution;
  const byAuditType = auditConfig.riskDistribution.byAuditType;

  const totalTaxpayers = cfgRegions.reduce((s, r) => s + r.taxpayers, 0);
  const totalRisky = Math.round(totalTaxpayers * (dist.percentageRisky / 100));

  const national = {
    totalTaxpayers,
    totalRisky,
    percentRisky: dist.percentageRisky,
    byRiskLevel: {
      critical: { count: Math.round(totalRisky * dist.split.critical), pct: (dist.split.critical * 100).toFixed(1) },
      high:     { count: Math.round(totalRisky * dist.split.high),     pct: (dist.split.high * 100).toFixed(1)     },
      medium:   { count: Math.round(totalRisky * dist.split.medium),   pct: (dist.split.medium * 100).toFixed(1)   },
      low:      { count: Math.round(totalRisky * dist.split.low),      pct: (dist.split.low * 100).toFixed(1)      },
    },
    byAuditType: AUDIT_TYPES.map(a => ({
      ...a,
      count: Math.round(totalRisky * (byAuditType[a.id] || 0)),
      pct: ((byAuditType[a.id] || 0) * 100).toFixed(1),
    })),
    auditRecommended: Math.round(totalRisky * (dist.split.critical + dist.split.high)),
  };

  // Build per-region data — map config regions to REGIONS constant
  const byRegion = REGIONS.map(region => {
    // match config region by name
    const cfgR = cfgRegions.find(r =>
      r.name.toLowerCase().replace(/\s+/g, '_') === region.id ||
      r.id === region.id ||
      r.name.toLowerCase().includes(region.name.toLowerCase().split(' ')[0].toLowerCase())
    ) || { taxpayers: 200000 };

    const regionRisky = Math.round(cfgR.taxpayers * (dist.percentageRisky / 100));
    return {
      id: region.id,
      name: region.name,
      code: region.code,
      totalTaxpayers: cfgR.taxpayers,
      totalRisky: regionRisky,
      percentRisky: dist.percentageRisky,
      byAuditType: AUDIT_TYPES.map(a => ({
        ...a,
        count: Math.round(regionRisky * (byAuditType[a.id] || 0)),
        pct: ((byAuditType[a.id] || 0) * 100).toFixed(1),
      })),
    };
  });

  // Compute plan defaults — scale risk to a ~1400-case plan
  const PLAN_SCALE = 1400 / totalRisky;
  const planDefaults = {};
  REGIONS.forEach(region => {
    const rd = byRegion.find(r => r.id === region.id);
    if (!rd) return;
    planDefaults[region.id] = {};
    AUDIT_TYPES.forEach(a => {
      planDefaults[region.id][a.id] = Math.max(0, Math.round(rd.byAuditType.find(x => x.id === a.id)?.count * PLAN_SCALE || 0));
    });
  });

  return { national, byRegion, planDefaults };
}

// ── Parse live Risk Engine statistics ─────────────────────────────────────
function parseLiveStats(stats, tpStats) {
  // stats comes from /api/public/v1/statistics on the risk engine
  // tpStats comes from /api/public/v1/statistics on the taxpayer registration service
  // Both have flexible shapes — we extract what we need defensively.

  const totalTaxpayers = tpStats?.total || tpStats?.total_taxpayers ||
    (typeof tpStats === 'object' ? Object.values(tpStats).reduce((s, v) => typeof v === 'number' ? s + v : s, 0) : 0) ||
    auditConfig.regions.reduce((s, r) => s + r.taxpayers, 0);

  const totalAssessed = stats?.total_assessments || stats?.total || 0;

  // by_risk_level: { critical, high, medium, low }
  const byRiskLevelRaw = stats?.by_risk_level || stats?.risk_level || {};
  const riskCounts = {
    critical: byRiskLevelRaw.critical || 0,
    high:     byRiskLevelRaw.high     || 0,
    medium:   byRiskLevelRaw.medium   || 0,
    low:      byRiskLevelRaw.low      || 0,
  };
  const totalRisky = Object.values(riskCounts).reduce((s, v) => s + v, 0) ||
    Math.round(totalTaxpayers * (auditConfig.riskDistribution.percentageRisky / 100));

  // by_suggested_audit_type or by_recommendation
  const auditTypeRaw = stats?.by_suggested_audit_type || stats?.by_audit_type || {};
  const byAuditType = AUDIT_TYPES.map(a => {
    // Try direct ID match first, then keyword match
    const rawCount = auditTypeRaw[a.id] || auditTypeRaw[a.name] ||
      Object.entries(auditTypeRaw).find(([k]) => mapSuggestedAuditType(k) === a.id)?.[1] || 0;
    const dist = auditConfig.riskDistribution.byAuditType;
    const count = rawCount || Math.round(totalRisky * (dist[a.id] || 0));
    return { ...a, count, pct: totalRisky > 0 ? ((count / totalRisky) * 100).toFixed(1) : '0' };
  });

  const national = {
    totalTaxpayers,
    totalAssessed,
    totalRisky,
    percentRisky: totalTaxpayers > 0 ? ((totalRisky / totalTaxpayers) * 100).toFixed(2) : '0',
    byRiskLevel: {
      critical: { count: riskCounts.critical, pct: totalRisky > 0 ? ((riskCounts.critical / totalRisky) * 100).toFixed(1) : '0' },
      high:     { count: riskCounts.high,     pct: totalRisky > 0 ? ((riskCounts.high     / totalRisky) * 100).toFixed(1) : '0' },
      medium:   { count: riskCounts.medium,   pct: totalRisky > 0 ? ((riskCounts.medium   / totalRisky) * 100).toFixed(1) : '0' },
      low:      { count: riskCounts.low,      pct: totalRisky > 0 ? ((riskCounts.low      / totalRisky) * 100).toFixed(1) : '0' },
    },
    byAuditType,
    auditRecommended: (stats?.by_recommendation?.audit_immediately || 0) + (stats?.by_recommendation?.select_for_audit || 0) ||
      riskCounts.critical + riskCounts.high,
  };

  return national;
}

// ── Main hook ──────────────────────────────────────────────────────────────
export function useRiskEngine() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    source: 'estimated',
    lastUpdated: null,
    national: null,
    byRegion: [],
    planDefaults: {},
  });

  const load = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));

    try {
      // Try live APIs in parallel
      const [statsResult, tpStatsResult, regionRankingsResult] = await Promise.allSettled([
        riskEngineClient.getStatistics(),
        taxpayerClient.getStatistics(),
        riskEngineClient.getRegionRankings(),
      ]);

      const liveStats    = statsResult.status    === 'fulfilled' ? statsResult.value.data    : null;
      const liveTpStats  = tpStatsResult.status  === 'fulfilled' ? tpStatsResult.value.data  : null;
      const liveRegions  = regionRankingsResult.status === 'fulfilled' ? regionRankingsResult.value.data : null;

      if (liveStats) {
        // ── Live path ────────────────────────────────────────────────────
        const national = parseLiveStats(liveStats, liveTpStats);

        // Build per-region data from region rankings if available
        let byRegion;
        if (Array.isArray(liveRegions) && liveRegions.length > 0) {
          byRegion = REGIONS.map(region => {
            const rd = liveRegions.find(r =>
              r.region_code === region.code ||
              (r.region_name || '').toLowerCase().includes(region.name.toLowerCase().slice(0, 4))
            );
            const regionRisky = rd?.count || rd?.total_risky ||
              Math.round((auditConfig.regions.find(r => r.id === region.id)?.taxpayers || 200000) *
                (auditConfig.riskDistribution.percentageRisky / 100));

            const cfgRegion = auditConfig.regions.find(r =>
              r.name.toLowerCase().includes(region.name.toLowerCase().split(' ')[0])
            ) || { taxpayers: 200000 };

            return {
              id: region.id,
              name: region.name,
              code: region.code,
              totalTaxpayers: rd?.total_taxpayers || cfgRegion.taxpayers,
              totalRisky: regionRisky,
              percentRisky: cfgRegion.taxpayers > 0
                ? ((regionRisky / cfgRegion.taxpayers) * 100).toFixed(2)
                : '0',
              byAuditType: AUDIT_TYPES.map(a => ({
                ...a,
                count: Math.round(regionRisky * (auditConfig.riskDistribution.byAuditType[a.id] || 0)),
                pct: ((auditConfig.riskDistribution.byAuditType[a.id] || 0) * 100).toFixed(1),
              })),
            };
          });
        } else {
          // Fall back for regional data
          byRegion = computeLocalData().byRegion;
          // Adjust totals proportionally to live national total
          const scale = national.totalRisky / (byRegion.reduce((s, r) => s + r.totalRisky, 0) || 1);
          byRegion = byRegion.map(r => ({
            ...r,
            totalRisky: Math.round(r.totalRisky * scale),
            byAuditType: r.byAuditType.map(a => ({ ...a, count: Math.round(a.count * scale) })),
          }));
        }

        // Plan defaults
        const planDefaults = {};
        const PLAN_SCALE = 1400 / (national.totalRisky || 1);
        REGIONS.forEach(region => {
          const rd = byRegion.find(r => r.id === region.id);
          planDefaults[region.id] = {};
          AUDIT_TYPES.forEach(a => {
            planDefaults[region.id][a.id] = Math.max(0,
              Math.round((rd?.byAuditType.find(x => x.id === a.id)?.count || 0) * PLAN_SCALE)
            );
          });
        });

        setState({
          loading: false,
          error: null,
          source: 'live',
          lastUpdated: new Date(),
          national,
          byRegion,
          planDefaults,
        });
      } else {
        throw new Error('Risk engine returned no data');
      }
    } catch (err) {
      console.warn('[useRiskEngine] Live API unavailable, using local estimates:', err.message);
      const local = computeLocalData();
      setState({
        loading: false,
        error: null,
        source: 'estimated',
        lastUpdated: new Date(),
        ...local,
      });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { ...state, reload: load };
}
