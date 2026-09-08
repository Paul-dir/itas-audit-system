/**
 * UnifiedCaseDetail Component
 * 
 * A shared case detail view that displays consistent information across all roles:
 * Committee, Team Leader, Auditor, and Tax Center Manager.
 * 
 * Roles may hide/show sections via the `sections` prop and add role-specific
 * action panels through the `sidebar` and `children` render props.
 */

import { useState } from 'react';
import {
  FileText, User, MapPin, AlertTriangle, TrendingUp,
  Shield, CheckCircle, ClipboardList, Users as UsersIcon,
} from 'lucide-react';
import Card from '../Card.jsx';

// ── Risk color helpers ──────────────────────────────────────────────────────
const RISK_COLOR = {
  CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'blue',
};

const riskBadgeClass = (level) => {
  const map = {
    CRITICAL: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800',
    HIGH:     'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800',
    MEDIUM:   'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
    LOW:      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
  };
  return map[level] || map.LOW;
};

// ── Reusable field row ─────────────────────────────────────────────────────
function Field({ label, value, mono, bold, className = '' }) {
  return (
    <div className={className}>
      <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
        {label}
      </label>
      <p className={`text-gray-900 dark:text-white mt-1 ${mono ? 'font-mono' : ''} ${bold ? 'font-semibold' : ''}`}>
        {value || 'N/A'}
      </p>
    </div>
  );
}

function SectionTitle({ icon: Icon, children, className = '' }) {
  return (
    <h3 className={`text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 ${className}`}>
      {Icon && <Icon size={20} className="text-blue-500" />}
      {children}
    </h3>
  );
}

// ── Section: Case Overview ─────────────────────────────────────────────────
function CaseOverviewSection({ caseData }) {
  const caseId = caseData.committeeCaseId || caseData.caseNumber || caseData.caseId || caseData.id;
  const createdDate = caseData.createdDate || caseData.createdAt;

  return (
    <Card className="p-6">
      <SectionTitle icon={FileText}>Case Overview</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Case ID" value={caseId} mono />
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Status</label>
          <div className="mt-1">
            <span className={`inline-flex items-center gap-1.5 rounded-full text-xs font-semibold px-2.5 py-1 ${
              caseData.status === 'APPROVED' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
              caseData.status === 'REJECTED' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
              'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {caseData.status?.replace(/_/g, ' ') || 'N/A'}
            </span>
          </div>
        </div>
        <Field
          label="Created Date"
          value={createdDate ? new Date(createdDate).toLocaleDateString() : null}
        />
        <Field
          label="Case Code"
          value={caseData.caseCode}
          mono
          bold
        />
      </div>
      {caseData.description && (
        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <Field label="Description" value={caseData.description} />
        </div>
      )}
    </Card>
  );
}

// ── Section: Taxpayer Profile ──────────────────────────────────────────────
function TaxpayerProfileSection({ caseData }) {
  const tin = caseData.taxIdNumber || caseData.tin;

  return (
    <Card className="p-6">
      <SectionTitle icon={UsersIcon}>Taxpayer Profile</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Taxpayer Name" value={caseData.taxpayerName} bold />
        <Field label="TIN Number" value={tin} mono />
        <Field
          label="Total Amount"
          value={caseData.totalAmount ? `ETB ${parseFloat(caseData.totalAmount).toLocaleString()}` : null}
          bold
        />
        <Field label="Assessment Score" value={caseData.assessmentScore} />
        <Field label="Business Type" value={caseData.businessType} />
        <Field label="Sector / Industry" value={caseData.sector} />
        <Field
          label="Annual Revenue"
          value={caseData.annualRevenue ? `ETB ${(caseData.annualRevenue / 1000000).toFixed(1)}M` : null}
        />
        <Field label="Number of Employees" value={caseData.employees} />
      </div>
    </Card>
  );
}

// ── Section: Address ───────────────────────────────────────────────────────
function AddressSection({ caseData }) {
  return (
    <Card className="p-6">
      <SectionTitle icon={MapPin}>Address Details</SectionTitle>
      <div className="space-y-3">
        <Field label="Street Address" value={caseData.address} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" value={caseData.city} />
          <Field label="Region" value={caseData.region} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tax Center" value={caseData.taxCenter} />
          <Field label="Segment" value={caseData.segment} bold />
        </div>
      </div>
    </Card>
  );
}

// ── Section: Risk Assessment ───────────────────────────────────────────────
function RiskAssessmentSection({ caseData, compact = false }) {
  const riskLevel = caseData.riskPriority || caseData.riskLevel;
  const riskScore = caseData.riskScore || 0;
  const donutColor = riskScore > 70 ? '#ef4444' : riskScore > 40 ? '#f59e0b' : '#10b981';

  return (
    <Card className="p-6">
      <SectionTitle icon={Shield}>Risk Assessment</SectionTitle>

      {compact ? (
        /* Compact layout: score bar + badges */
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Risk Level</label>
            <div className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full text-xs font-semibold px-2.5 py-1 ${riskBadgeClass(riskLevel)}`}>
              {riskLevel || 'N/A'}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Risk Score</label>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    riskLevel === 'CRITICAL' ? 'bg-red-500' :
                    riskLevel === 'HIGH' ? 'bg-orange-500' :
                    riskLevel === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${riskScore}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">{riskScore}</span>
            </div>
          </div>
          <Field label="Assessment Score" value={caseData.assessmentScore} />
        </div>
      ) : (
        /* Full layout: priority + score donut + indicators */
        <>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Risk Priority</label>
              <div className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full text-xs font-semibold px-2.5 py-1 ${riskBadgeClass(riskLevel)}`}>
                {riskLevel || 'N/A'}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Risk Score</label>
              <p className="text-gray-900 dark:text-white mt-1 font-bold text-lg">{riskScore}/100</p>
            </div>
            <div className="flex justify-center">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="45" fill="none"
                    stroke={donutColor}
                    strokeWidth="10"
                    strokeDasharray={`${riskScore * 2.83} 283`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{riskScore}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Indicators */}
          {caseData.riskIndicators && caseData.riskIndicators.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
                  Risk Indicators
                </label>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                  {caseData.riskIndicators.length} detected
                </span>
              </div>
              <div className="space-y-2">
                {caseData.riskIndicators.map((indicator, idx) => (
                  <div
                    key={indicator.id || idx}
                    className={`flex items-start gap-2 p-2.5 rounded-lg border text-sm ${
                      indicator.severity === 'HIGH'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : indicator.severity === 'MEDIUM'
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                        : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    }`}
                  >
                    <AlertTriangle
                      size={14}
                      className={`mt-0.5 flex-shrink-0 ${
                        indicator.severity === 'HIGH'
                          ? 'text-red-600 dark:text-red-400'
                          : indicator.severity === 'MEDIUM'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white text-xs">{indicator.name}</span>
                        <span className={`text-[10px] font-medium px-1 py-0.5 rounded ${
                          indicator.severity === 'HIGH'
                            ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                            : indicator.severity === 'MEDIUM'
                            ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                            : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                        }`}>{indicator.severity}</span>
                        {indicator.weight && (
                          <span className="text-[10px] text-gray-400">w:{indicator.weight}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{indicator.description}</p>
                      {indicator.source && (
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">Source: {indicator.source}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Factors (alternate data shape) */}
          {!caseData.riskIndicators && caseData.riskFactors && caseData.riskFactors.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-2 block">
                Risk Factors
              </label>
              <div className="flex flex-wrap gap-1.5">
                {caseData.riskFactors.map((factor, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-1 rounded border border-red-200 dark:border-red-900"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Assessment Score */}
          {caseData.assessmentScore && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Field label="Assessment Score" value={caseData.assessmentScore} />
            </div>
          )}
        </>
      )}
    </Card>
  );
}

// ── Section: Audit Information ─────────────────────────────────────────────
function AuditInfoSection({ caseData }) {
  if (!caseData.auditType && !caseData.planId && !caseData.segment) return null;

  return (
    <Card className="p-6">
      <SectionTitle icon={ClipboardList}>Audit Information</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Audit Type" value={caseData.auditType} bold />
        <Field label="Linked Plan" value={caseData.planId} mono />
        <Field label="Segment" value={caseData.segment} bold />
        <Field label="Region" value={caseData.region} />
      </div>
    </Card>
  );
}

// ── Section: Committee Decision ────────────────────────────────────────────
function CommitteeDecisionSection({ caseData }) {
  if (!caseData.decision && !caseData.decisionDate) return null;

  return (
    <Card className="p-6">
      <SectionTitle icon={CheckCircle}>Committee Decision</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Decision" value={caseData.decision} />
        <Field
          label="Decision Date"
          value={caseData.decisionDate ? new Date(caseData.decisionDate).toLocaleDateString() : null}
        />
      </div>
      {caseData.decisionReason && (
        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <Field label="Decision Reason" value={caseData.decisionReason} />
        </div>
      )}
    </Card>
  );
}

// ── Section: Segment & History ─────────────────────────────────────────────
function SegmentHistorySection({ caseData }) {
  return (
    <Card className="p-6">
      <SectionTitle icon={TrendingUp}>Segment & History</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Segment" value={caseData.segment} bold />
        <Field
          label="Queue Aging"
          value={caseData.extensionCount ? `${caseData.extensionCount} extensions` : 'Standard'}
        />
      </div>
      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-3">Status History</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded bg-gray-50 dark:bg-gray-800">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-gray-900 dark:text-white">{caseData.status || 'N/A'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXPORT: UnifiedCaseDetail
// ═══════════════════════════════════════════════════════════════════════════

/**
 * UnifiedCaseInfo — core case information sections, shared across all roles.
 *
 * Props:
 *   caseData     – the case object from the backend
 *   sections     – object of section keys to enable/disable (all enabled by default)
 *   compactRisk  – use compact risk layout (score bar instead of donut)
 *   className    – extra classes for the root wrapper
 *   showAuditInfo – force show/hide audit info section (auto-detected by default)
 */
export function UnifiedCaseInfo({
  caseData,
  sections = {},
  compactRisk = false,
  showAuditInfo,
  className = '',
}) {
  if (!caseData) return null;

  const s = {
    overview: true,
    taxpayer: true,
    address: true,
    risk: true,
    auditInfo: true,
    committeeDecision: false,
    segmentHistory: false,
    ...sections,
  };

  // Auto-detect audit info visibility if not explicitly set
  const showAudit = showAuditInfo !== undefined
    ? showAuditInfo
    : (caseData.auditType || caseData.planId || caseData.segment);

  // Auto-detect committee decision
  const showCommitteeDecision = caseData.decision || caseData.decisionDate;

  return (
    <div className={`space-y-6 ${className}`}>
      {s.overview && <CaseOverviewSection caseData={caseData} />}
      {s.taxpayer && <TaxpayerProfileSection caseData={caseData} />}
      {s.address && <AddressSection caseData={caseData} />}
      {s.risk && <RiskAssessmentSection caseData={caseData} compact={compactRisk} />}
      {showAudit && s.auditInfo && <AuditInfoSection caseData={caseData} />}
      {showCommitteeDecision && s.committeeDecision && <CommitteeDecisionSection caseData={caseData} />}
      {s.segmentHistory && <SegmentHistorySection caseData={caseData} />}
    </div>
  );
}

/**
 * UnifiedCaseHeader — consistent header bar with back button and title.
 */
export function UnifiedCaseHeader({ caseData, onBack, backLabel = 'Back', children }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <span className="text-lg">←</span>
        <span>{backLabel}</span>
      </button>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {caseData?.taxpayerName || 'Case Detail'}
      </h1>
      {children || <div className="w-32" />}
    </div>
  );
}

/**
 * UnifiedCaseTabNav — standard tab navigation for case detail views.
 */
export function UnifiedCaseTabNav({ tabs, activeTab, onTabChange }) {
  return (
    <Card className="p-4">
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 -mx-4 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {Icon && <Icon size={16} />}
              {tab.label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default UnifiedCaseInfo;
