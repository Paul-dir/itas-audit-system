/**
 * RiskAnalysisDashboard
 * Shows live (or estimated) data from the Risk Engine and Taxpayer
 * Registration APIs before a plan is created.
 *
 * National level → Regional breakdown → "Use as Plan Defaults" CTA
 */
import { useState } from 'react';
import {
  Activity, AlertTriangle, BarChart2, ChevronDown, ChevronUp,
  RefreshCw, TrendingUp, Users, Zap, ArrowRight, CheckCircle,
  Info, Globe
} from 'lucide-react';
import { useRiskEngine } from '../../hooks/useRiskEngine.js';
import { Card, StatCard, Button, Badge, Alert } from '../../components/ui/index.jsx';
import { AUDIT_TYPES } from '../../data/constants.js';

// ── Colour helpers ─────────────────────────────────────────────────────────
const RISK_COLORS = {
  critical: { bg: 'bg-red-500',    light: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200'   },
  high:     { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200'},
  medium:   { bg: 'bg-yellow-400', light: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200'},
  low:      { bg: 'bg-green-400',  light: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
};

const AUDIT_COLORS = {
  desk_audit:       'bg-blue-500',
  field_audit:      'bg-green-500',
  joint_audit:      'bg-purple-500',
  transfer_pricing: 'bg-orange-500',
  comprehensive:    'bg-red-500',
  issue_audit:      'bg-teal-500',
};

function fmt(n) { return typeof n === 'number' ? n.toLocaleString() : (n ?? '—'); }

// ── Horizontal progress bar ────────────────────────────────────────────────
function Bar({ pct, colorClass = 'bg-blue-500' }) {
  return (
    <div className="h-1.5 bg-gray-100 dark:bg-slate-600 rounded-full overflow-hidden flex-1 min-w-0">
      <div className={`h-full ${colorClass} rounded-full transition-all duration-700`} style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  );
}

// ── Skeleton loader ────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-700 rounded-2xl border border-gray-100 dark:border-slate-600 p-5 animate-pulse">
      <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded w-1/3 mb-3" />
      <div className="h-8 bg-gray-200 dark:bg-slate-600 rounded w-1/2 mb-2" />
      <div className="h-2 bg-gray-100 dark:bg-slate-600 rounded w-2/3" />
    </div>
  );
}

// ── Regional row ───────────────────────────────────────────────────────────
function RegionRow({ region, maxRisky, expanded, onToggle }) {
  const pct = maxRisky > 0 ? (region.totalRisky / maxRisky) * 100 : 0;
  return (
    <>
      <tr
        className="hover:bg-blue-50 dark:hover:bg-slate-600 cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 text-xs font-bold">
              {region.code}
            </div>
            <span className="font-medium text-gray-900 dark:text-slate-200 text-sm">{region.name}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600 dark:text-slate-300 tabular-nums">{fmt(region.totalTaxpayers)}</td>
        <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-slate-200 tabular-nums">{fmt(region.totalRisky)}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Bar pct={pct} colorClass="bg-red-400" />
            <span className="text-xs text-gray-500 dark:text-slate-400 w-10 text-right">{region.percentRisky}%</span>
          </div>
        </td>
        <td className="px-4 py-3 text-center">
          {expanded ? <ChevronUp size={14} className="text-gray-400 dark:text-slate-400 mx-auto" /> : <ChevronDown size={14} className="text-gray-400 dark:text-slate-400 mx-auto" />}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-blue-50/40 dark:bg-slate-700/50">
          <td colSpan={5} className="px-4 pb-4 pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {region.byAuditType.map(at => (
                <div key={at.id} className="bg-white dark:bg-slate-600 rounded-lg border border-gray-200 dark:border-slate-500 p-2.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className={`w-2 h-2 rounded-full ${AUDIT_COLORS[at.id] || 'bg-gray-400'}`} />
                    <span className="text-xs font-medium text-gray-700 dark:text-slate-200">{at.shortName || at.name}</span>
                  </div>
                  <p className="text-base font-bold text-gray-900 dark:text-white tabular-nums">{fmt(at.count)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Bar pct={parseFloat(at.pct)} colorClass={AUDIT_COLORS[at.id]} />
                    <span className="text-[10px] text-gray-400 dark:text-slate-400">{at.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function RiskAnalysisDashboard({ onUsePlanDefaults }) {
  const { loading, source, lastUpdated, national, byRegion, planDefaults, reload } = useRiskEngine();
  const [expandedRegion, setExpandedRegion] = useState(null);

  const maxRisky = byRegion.reduce((m, r) => Math.max(m, r.totalRisky), 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Risk Engine Analysis</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Fetching live risk data…</p>
          </div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm">Loading</span>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={22} className="text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Risk Engine Analysis</h2>
            <Badge color={source === 'live' ? 'green' : 'yellow'} dot>
              {source === 'live' ? 'Live Data' : 'Estimated'}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            {source === 'live'
              ? `Connected to Risk Engine · Updated ${lastUpdated?.toLocaleTimeString()}`
              : 'Estimates based on configured risk parameters (live API unavailable)'}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={reload}>Refresh</Button>
          {onUsePlanDefaults && (
            <Button variant="primary" size="sm" icon={ArrowRight} onClick={() => onUsePlanDefaults(planDefaults)}>
              Create Plan with Defaults
            </Button>
          )}
        </div>
      </div>

      {source === 'estimated' && (
        <Alert type="info" title="Using estimated data">
          The Risk Engine API is currently unreachable. Figures below are computed from your configured risk parameters.
          Connect to the live API for real taxpayer risk data.
        </Alert>
      )}

      {/* ── National KPIs ── */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Globe size={12} /> National Overview
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Taxpayers"
            value={national?.totalTaxpayers?.toLocaleString()}
            icon={Users}
            color="blue"
            sub="Registered in MOR system"
          />
          <StatCard
            label="Risky Taxpayers"
            value={national?.totalRisky?.toLocaleString()}
            icon={AlertTriangle}
            color="orange"
            sub={`${national?.percentRisky}% of registered`}
          />
          <StatCard
            label="High / Critical Risk"
            value={((national?.byRiskLevel?.critical?.count || 0) + (national?.byRiskLevel?.high?.count || 0)).toLocaleString()}
            icon={Zap}
            color="red"
            sub="Require immediate audit priority"
          />
          <StatCard
            label="Recommended for Audit"
            value={national?.auditRecommended?.toLocaleString()}
            icon={CheckCircle}
            color="green"
            sub="audit_immediately + select_for_audit"
          />
        </div>
      </div>

      {/* ── Risk Level Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <BarChart2 size={16} className="text-gray-500 dark:text-slate-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Risk Level Distribution</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(national?.byRiskLevel || {}).map(([level, info]) => {
              const c = RISK_COLORS[level] || RISK_COLORS.low;
              return (
                <div key={level}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${c.bg}`} />
                      <span className="text-sm font-medium text-gray-700 dark:text-slate-200 capitalize">{level}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 dark:text-slate-400">{info.pct}%</span>
                      <span className="text-sm font-bold text-gray-800 dark:text-slate-200 tabular-nums w-20 text-right">{fmt(info.count)}</span>
                    </div>
                  </div>
                  <Bar pct={parseFloat(info.pct)} colorClass={c.bg} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-gray-500 dark:text-slate-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recommended Audit Type Distribution</h3>
          </div>
          <div className="space-y-3">
            {(national?.byAuditType || []).map(at => (
              <div key={at.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${AUDIT_COLORS[at.id] || 'bg-gray-400'}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-200">{at.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 dark:text-slate-400">{at.pct}%</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-slate-200 tabular-nums w-20 text-right">{fmt(at.count)}</span>
                  </div>
                </div>
                <Bar pct={parseFloat(at.pct)} colorClass={AUDIT_COLORS[at.id] || 'bg-gray-400'} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Regional Breakdown ── */}
      <Card padding={false}>
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-600 flex items-center gap-2">
          <Globe size={16} className="text-gray-500 dark:text-slate-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Regional Risk Breakdown</h3>
          <span className="text-xs text-gray-400 dark:text-slate-400 ml-1">— click a row to see audit type detail</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-600 bg-gray-50/60 dark:bg-slate-700">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-slate-400">Region</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-slate-400">Taxpayers</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-slate-400">Risky</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 w-48">Risk %</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-500 dark:text-slate-400 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-600">
              {byRegion.map(region => (
                <RegionRow
                  key={region.id}
                  region={region}
                  maxRisky={maxRisky}
                  expanded={expandedRegion === region.id}
                  onToggle={() => setExpandedRegion(expandedRegion === region.id ? null : region.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── CTA ── */}
      {onUsePlanDefaults && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">Ready to create your audit plan?</h3>
            <p className="text-blue-100 text-sm mt-0.5">
              The risk analysis above will pre-fill the case distribution table. You can review and override any values before submitting.
            </p>
          </div>
          <Button
            variant="secondary"
            icon={ArrowRight}
            onClick={() => onUsePlanDefaults(planDefaults)}
            className="flex-shrink-0"
          >
            Create Plan with Defaults
          </Button>
        </div>
      )}

      {/* ── Data source note ── */}
      <p className="text-xs text-gray-400 dark:text-slate-400 flex items-center gap-1.5">
        <Info size={11} />
        Data source: {source === 'live' ? 'MOR Risk Engine API (audit-ally-score.lovable.app) + Taxpayer Registration API' : 'Locally configured risk parameters (auditConfig.js)'}
        {lastUpdated && ` · ${lastUpdated.toLocaleString()}`}
      </p>
    </div>
  );
}
