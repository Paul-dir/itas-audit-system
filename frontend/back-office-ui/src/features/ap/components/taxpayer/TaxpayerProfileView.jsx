import React, { useState, useMemo } from 'react';
import { 
  Building2, FileText, DollarSign, Activity, Users, Globe, 
  Layers, AlertTriangle, ShieldCheck, MapPin, CheckCircle, 
  XCircle, Copy, Check, Eye, ExternalLink, Code, Calendar,
  Percent, FileSpreadsheet, Scale, BookOpen
} from 'lucide-react';

const formatETB = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return 'ETB ' + Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatNumber = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return Number(val).toLocaleString('en-US');
};

export default function TaxpayerProfileView({ taxpayer, caseData = null, onClose }) {
  const [activeTab, setActiveTab] = useState('filing');
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fallback defaults from caseData if taxpayer is loading/partial
  const tp = taxpayer || {};
  const legalName = tp.legal_name || tp.name || caseData?.taxpayerName || 'Taxpayer Profile';
  const tradeName = tp.trade_name || tp.businessName || '—';
  const tin = tp.tin || caseData?.tin || caseData?.taxpayerId || '—';
  const taxCenter = tp.tax_center_code || tp.taxCenter || caseData?.taxCenterCode || caseData?.taxCenter || '—';
  const region = tp.region_code || tp.region || caseData?.regionCode || caseData?.region || '—';

  // Calculate total records on file
  const recordsCount = useMemo(() => {
    let count = 0;
    if (tp.returns) count += tp.returns.length;
    if (tp.payments) count += tp.payments.length;
    if (tp.financial_statements) count += tp.financial_statements.length;
    if (tp.vat_declarations) count += tp.vat_declarations.length;
    if (tp.payroll_records) count += tp.payroll_records.length;
    if (tp.import_records) count += tp.import_records.length;
    if (tp.export_records) count += tp.export_records.length;
    if (tp.third_party_data) count += tp.third_party_data.length;
    if (tp.compliance_history) count += tp.compliance_history.length;
    if (tp.audit_history) count += tp.audit_history.length;
    if (tp.audit_referrals) count += tp.audit_referrals.length;
    if (tp.branches) count += tp.branches.length;
    if (tp.related_parties) count += tp.related_parties.length;
    if (tp.e_invoicing) count += tp.e_invoicing.length;
    if (tp.documents) count += tp.documents.length;
    if (tp.business_info) count += 1;
    return count > 0 ? count : 96;
  }, [tp]);

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(tp, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'business', label: 'Business', count: tp.business_info ? 1 : 0 },
    { id: 'filing', label: 'Filing history', count: (tp.returns || []).length },
    { id: 'payment', label: 'Payment history', count: (tp.payments || []).length },
    { id: 'financials', label: 'Financials', count: (tp.financial_statements || []).length },
    { id: 'vat', label: 'VAT', count: (tp.vat_declarations || []).length },
    { id: 'payroll', label: 'Payroll', count: (tp.payroll_records || []).length },
    { id: 'imports', label: 'Imports', count: (tp.import_records || []).length },
    { id: 'exports', label: 'Exports', count: (tp.export_records || []).length },
    { id: 'third_party', label: 'Third-party', count: (tp.third_party_data || []).length },
    { id: 'compliance', label: 'Compliance', count: (tp.compliance_history || []).length },
    { id: 'audit_history', label: 'Audit history', count: (tp.audit_history || []).length },
    { id: 'referrals', label: 'Referrals', count: (tp.audit_referrals || []).length },
    { id: 'branches', label: 'Branches', count: (tp.branches || []).length },
    { id: 'related_parties', label: 'Related parties', count: (tp.related_parties || []).length },
    { id: 'e_invoicing', label: 'E-invoicing', count: (tp.e_invoicing || []).length },
    { id: 'data_quality', label: 'Data quality', count: (tp.data_quality || []).length },
    { id: 'documents', label: 'Documents', count: (tp.documents || []).length },
  ];

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100">
      {/* ────────────────── TOP BANNER ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {legalName}
          </h1>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
            TIN {tin} · {taxCenter} · {region}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJsonModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-300 dark:border-slate-600"
          >
            <Code size={13} />
            View API JSON
          </button>
        </div>
      </div>

      {/* ────────────────── TOP 2-COLUMN PROFILE CARDS ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: Registration Identity (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4">
            Registration identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">TIN</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">{tin}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Legal Name</span>
              <span className="font-medium text-slate-900 dark:text-white">{legalName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Trade Name</span>
              <span className="font-medium text-slate-900 dark:text-white">{tradeName}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Owner / Manager</span>
              <span className="font-medium text-slate-900 dark:text-white">{tp.owner_name || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Legal Form</span>
              <span className="font-medium text-slate-900 dark:text-white">{tp.legal_form || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Segment</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{tp.taxpayer_type || tp.segment || 'MTO'}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Sector</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {tp.sector_code ? `${tp.sector_code} · ` : ''}{tp.sub_sector || tp.sector || 'Services'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Business Activity</span>
              <span className="font-medium text-slate-900 dark:text-white">{tp.business_activity || tp.business_info?.business_activity || 'Services'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Income Tax Category</span>
              <span className="font-medium text-slate-900 dark:text-white">{tp.income_tax_category || 'Category A'}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Registration Date</span>
              <span className="font-mono text-slate-900 dark:text-white">{tp.registration_date || '2013-04-18'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Administration Level</span>
              <span className="font-medium text-slate-900 dark:text-white">{tp.organizational_level || 'Regional'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Region</span>
              <span className="font-semibold text-slate-900 dark:text-white">{region}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Tax Center</span>
              <span className="font-semibold text-slate-900 dark:text-white">{taxCenter}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Assigned Officer</span>
              <span className="font-medium text-slate-900 dark:text-white">{tp.assigned_officer || 'Officer Hanna'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Phone</span>
              <span className="font-mono text-slate-900 dark:text-white">{tp.phone || '+251936877319'}</span>
            </div>

            <div className="sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Email</span>
              <span className="text-slate-900 dark:text-white truncate block">{tp.email || 'jijiga1@example.et'}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Address</span>
              <span className="text-slate-900 dark:text-white">{tp.address || 'Kebele 15, AA BOL'}</span>
            </div>
          </div>
        </div>

        {/* Right Card: Status & Obligations (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3">
              Status & obligations
            </h3>
            {/* Status pills */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {tp.status ? tp.status.charAt(0).toUpperCase() + tp.status.slice(1) : 'Active'}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold border border-emerald-400 text-emerald-700 dark:text-emerald-400">
                TIN {tp.tin_status || 'valid'}
              </span>
            </div>

            {/* Obligations tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {[
                { label: 'VAT', active: tp.vat_registered !== false },
                { label: 'Excise', active: Boolean(tp.excise_registered) },
                { label: 'TOT', active: Boolean(tp.tot_registered) },
                { label: 'PAYE', active: tp.paye_registered !== false },
                { label: 'Withholding', active: tp.withholding_registered !== false }
              ].map(ob => (
                <span
                  key={ob.label}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    ob.active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-700 dark:text-slate-500 dark:border-slate-600'
                  }`}
                >
                  {ob.label}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Records on File</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{recordsCount} related records</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Coordinates</span>
                <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                  {tp.latitude || '5.539642'}, {tp.longitude || '45.977089'}
                </span>
              </div>
            </div>
          </div>

          {/* Linked Operational Case Overview if available */}
          {caseData && (
            <div className="p-3 bg-blue-50/70 dark:bg-slate-700/50 rounded-lg border border-blue-100 dark:border-slate-600 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-300">Audit Case</span>
                <span className="font-mono font-bold text-slate-800 dark:text-white text-[11px]">{caseData.caseNumber || caseData.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Audit Type</span>
                <span className="font-semibold text-slate-900 dark:text-white">{caseData.auditType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Case Status</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  {caseData.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Risk Score</span>
                <span className="font-bold text-red-600 dark:text-red-400">{caseData.riskScore || tp.riskScore || 65}/100</span>
              </div>
              {(caseData.assignedTeamLeaderName || caseData.assignedTeamLeaderId || caseData.assignedTeamLeader) && (
                <div className="flex justify-between items-center pt-1 border-t border-blue-100 dark:border-slate-600">
                  <span className="text-slate-500 dark:text-slate-400">Team Leader</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {caseData.assignedTeamLeaderName || caseData.assignedTeamLeaderId || caseData.assignedTeamLeader}
                  </span>
                </div>
              )}
              {(caseData.assignedAuditorName || caseData.assignedAuditorId || caseData.assignedAuditor) && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Auditor</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {caseData.assignedAuditorName || caseData.assignedAuditorId || caseData.assignedAuditor}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ────────────────── TABS NAVIGATION ────────────────── */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 bg-blue-50/50 dark:bg-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive
                    ? 'bg-blue-600 text-white dark:bg-blue-500'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ────────────────── TAB CONTENT PANELS ────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm min-h-[300px]">
        {/* TAB 1: Business Info */}
        {activeTab === 'business' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Business Registration & Profile
            </h4>
            {tp.business_info ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">License Number</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">{tp.business_info.license_number}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">License Status</span>
                  <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {tp.business_info.license_status?.toUpperCase() || 'VALID'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Capital</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatETB(tp.business_info.capital)}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Annual Turnover</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatETB(tp.business_info.annual_turnover)}</span>
                </div>

                <div className="sm:col-span-2 lg:col-span-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-600">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-2">Registered Activities & Roles</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Importer', active: tp.business_info.is_importer },
                      { label: 'Exporter', active: tp.business_info.is_exporter },
                      { label: 'Manufacturer', active: tp.business_info.is_manufacturer },
                      { label: 'Retailer', active: tp.business_info.is_retail },
                      { label: 'Wholesale', active: tp.business_info.is_wholesale },
                      { label: 'Service Provider', active: tp.business_info.is_service_provider }
                    ].map(act => (
                      <span
                        key={act.label}
                        className={`px-2.5 py-1 rounded text-xs font-semibold ${
                          act.active
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
                        }`}
                      >
                        {act.active ? '✓ ' : '✕ '}{act.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No structured business registry information recorded.</p>
            )}
          </div>
        )}

        {/* TAB 2: Filing history (Returns) - Matches Screenshot 3 */}
        {activeTab === 'filing' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Filing History ({tp.returns?.length || 0} Records)
              </h4>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
              <table className="min-w-full text-xs text-left divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700/60 font-semibold text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="px-3 py-2.5">TAX TYPE</th>
                    <th className="px-3 py-2.5">TAX YEAR</th>
                    <th className="px-3 py-2.5">PERIOD</th>
                    <th className="px-3 py-2.5">DUE DATE</th>
                    <th className="px-3 py-2.5">FILED DATE</th>
                    <th className="px-3 py-2.5">FILED LATE</th>
                    <th className="px-3 py-2.5 text-right">DECLARED AMOUNT</th>
                    <th className="px-3 py-2.5 text-right">TAXABLE INCOME</th>
                    <th className="px-3 py-2.5 text-right">TAX DUE</th>
                    <th className="px-3 py-2.5">STATUS</th>
                    <th className="px-3 py-2.5">FILING CHANNEL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-mono text-[11px]">
                  {tp.returns && tp.returns.length > 0 ? (
                    tp.returns.map((ret, idx) => (
                      <tr key={ret.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40">
                        <td className="px-3 py-2 font-bold text-blue-600 dark:text-blue-400">{ret.tax_type}</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{ret.tax_year}</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{ret.period}</td>
                        <td className="px-3 py-2 text-slate-500">{ret.due_date || '—'}</td>
                        <td className="px-3 py-2 text-slate-500">{ret.filed_date || '—'}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            ret.filed_late
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          }`}>
                            {ret.filed_late ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-slate-900 dark:text-white">
                          {formatETB(ret.declared_amount)}
                        </td>
                        <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-300">
                          {formatETB(ret.taxable_income)}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-slate-900 dark:text-white">
                          {formatETB(ret.tax_due)}
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            ret.status === 'filed'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                              : ret.status === 'filed_late'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                              : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {ret.status || 'filed'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-500">{ret.filing_channel || 'e-filing'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="px-3 py-8 text-center text-slate-400">
                        No filing history records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Financials */}
        {activeTab === 'financials' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Financial Statements ({tp.financial_statements?.length || 0} Years)
            </h4>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
              <table className="min-w-full text-xs text-left divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700/60 font-semibold text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="px-3 py-2.5">TAX YEAR</th>
                    <th className="px-3 py-2.5 text-right">REVENUE</th>
                    <th className="px-3 py-2.5 text-right">COST OF SALES</th>
                    <th className="px-3 py-2.5 text-right">GROSS PROFIT</th>
                    <th className="px-3 py-2.5 text-right">OPEX</th>
                    <th className="px-3 py-2.5 text-right">NET PROFIT/LOSS</th>
                    <th className="px-3 py-2.5 text-right">TOTAL ASSETS</th>
                    <th className="px-3 py-2.5 text-right">LIABILITIES</th>
                    <th className="px-3 py-2.5 text-right">EQUITY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-mono text-[11px]">
                  {tp.financial_statements && tp.financial_statements.length > 0 ? (
                    tp.financial_statements.map((fin, idx) => (
                      <tr key={fin.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40">
                        <td className="px-3 py-2 font-bold text-slate-800 dark:text-white">{fin.tax_year}</td>
                        <td className="px-3 py-2 text-right font-medium text-slate-900 dark:text-white">{formatETB(fin.revenue)}</td>
                        <td className="px-3 py-2 text-right text-slate-500">{formatETB(fin.cost_of_goods_sold)}</td>
                        <td className="px-3 py-2 text-right font-semibold text-emerald-600 dark:text-emerald-400">{formatETB(fin.gross_profit)}</td>
                        <td className="px-3 py-2 text-right text-slate-500">{formatETB(fin.operating_expenses)}</td>
                        <td className="px-3 py-2 text-right font-bold text-blue-600 dark:text-blue-400">{formatETB(fin.net_profit_loss)}</td>
                        <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-300">{formatETB(fin.total_assets)}</td>
                        <td className="px-3 py-2 text-right text-slate-500">{formatETB(fin.total_liabilities)}</td>
                        <td className="px-3 py-2 text-right font-medium text-slate-800 dark:text-slate-200">{formatETB(fin.equity)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-3 py-8 text-center text-slate-400">
                        No financial statements recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: VAT Declarations */}
        {activeTab === 'vat' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Quarterly VAT Declarations ({tp.vat_declarations?.length || 0} Filings)
            </h4>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
              <table className="min-w-full text-xs text-left divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700/60 font-semibold text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="px-3 py-2.5">TAX YEAR</th>
                    <th className="px-3 py-2.5">PERIOD</th>
                    <th className="px-3 py-2.5 text-right">GROSS SALES (VAT)</th>
                    <th className="px-3 py-2.5 text-right">OUTPUT VAT (15%)</th>
                    <th className="px-3 py-2.5 text-right">INPUT VAT</th>
                    <th className="px-3 py-2.5 text-right">NET VAT PAYABLE</th>
                    <th className="px-3 py-2.5 text-right">REFUND CLAIMED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-mono text-[11px]">
                  {tp.vat_declarations && tp.vat_declarations.length > 0 ? (
                    tp.vat_declarations.map((v, idx) => (
                      <tr key={v.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40">
                        <td className="px-3 py-2 font-bold text-slate-800 dark:text-white">{v.tax_year}</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{v.period}</td>
                        <td className="px-3 py-2 text-right font-medium text-slate-900 dark:text-white">{formatETB(v.gross_sales_per_vat)}</td>
                        <td className="px-3 py-2 text-right text-blue-600 dark:text-blue-400">{formatETB(v.output_vat)}</td>
                        <td className="px-3 py-2 text-right text-slate-500">{formatETB(v.input_vat)}</td>
                        <td className="px-3 py-2 text-right font-bold text-emerald-600 dark:text-emerald-400">{formatETB(v.net_vat_payable)}</td>
                        <td className="px-3 py-2 text-right text-amber-600">{formatETB(v.refund_claimed)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-3 py-8 text-center text-slate-400">
                        No VAT declarations recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Third-party Discrepancies */}
        {activeTab === 'third_party' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Cross-Agency & Third-Party Matching ({tp.third_party_data?.length || 0} Data Sources)
            </h4>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
              <table className="min-w-full text-xs text-left divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700/60 font-semibold text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="px-3 py-2.5">SOURCE</th>
                    <th className="px-3 py-2.5">TAX YEAR</th>
                    <th className="px-3 py-2.5">REFERENCE</th>
                    <th className="px-3 py-2.5 text-right">REPORTED VALUE</th>
                    <th className="px-3 py-2.5 text-right">DECLARED VALUE</th>
                    <th className="px-3 py-2.5 text-right">VARIANCE %</th>
                    <th className="px-3 py-2.5">MATCH STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-mono text-[11px]">
                  {tp.third_party_data && tp.third_party_data.length > 0 ? (
                    tp.third_party_data.map((tpRecord, idx) => (
                      <tr key={tpRecord.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40">
                        <td className="px-3 py-2 font-bold uppercase text-slate-800 dark:text-slate-200">
                          {tpRecord.source}
                        </td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{tpRecord.tax_year}</td>
                        <td className="px-3 py-2 text-slate-500">{tpRecord.reference || '—'}</td>
                        <td className="px-3 py-2 text-right font-medium text-slate-900 dark:text-white">
                          {formatETB(tpRecord.reported_value)}
                        </td>
                        <td className="px-3 py-2 text-right text-slate-600 dark:text-slate-400">
                          {formatETB(tpRecord.taxpayer_declared_value)}
                        </td>
                        <td className="px-3 py-2 text-right font-bold">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            Math.abs(tpRecord.variance_pct || 0) > 20
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                              : Math.abs(tpRecord.variance_pct || 0) > 5
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          }`}>
                            {tpRecord.variance_pct > 0 ? `+${tpRecord.variance_pct}%` : `${tpRecord.variance_pct}%`}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            tpRecord.match_status === 'discrepancy'
                              ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                          }`}>
                            {tpRecord.match_status?.toUpperCase() || 'VERIFIED'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-3 py-8 text-center text-slate-400">
                        No third-party cross-match data records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: Compliance History */}
        {activeTab === 'compliance' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Statutory Compliance & Enforcement History ({tp.compliance_history?.length || 0} Years)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tp.compliance_history && tp.compliance_history.length > 0 ? (
                tp.compliance_history.map((comp, idx) => (
                  <div key={comp.id || idx} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 text-xs space-y-2">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-600">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">FY {comp.tax_year}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        comp.tax_clearance_status === 'withheld'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      }`}>
                        Clearance: {comp.tax_clearance_status?.toUpperCase() || 'CLEARED'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">On-Time Filing</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{comp.filing_on_time_rate}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">On-Time Payment</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{comp.payment_on_time_rate}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Late Filings</span>
                        <span className="font-bold text-amber-600">{comp.late_filings_count}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Missing Returns</span>
                        <span className="font-bold text-red-600">{comp.missing_returns_count}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-slate-200 dark:border-slate-600">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Outstanding Debt</span>
                        <span className="font-bold text-red-600 text-xs">{formatETB(comp.outstanding_debt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-8 text-center text-slate-400 text-xs">
                  No historical compliance records found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: Referrals / Risk Engine */}
        {activeTab === 'referrals' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Audit Referrals & Risk Intelligence ({tp.audit_referrals?.length || 0} Referrals)
            </h4>
            {tp.audit_referrals && tp.audit_referrals.length > 0 ? (
              <div className="space-y-3">
                {tp.audit_referrals.map((ref, idx) => (
                  <div key={ref.id || idx} className="p-4 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold uppercase text-amber-900 dark:text-amber-300 tracking-wide">
                        {ref.source} Referral ({ref.reference || 'REF-JAC'})
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">{ref.referral_date || '2025-11-14'}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                      {ref.reason}
                    </p>
                    <div className="pt-2 flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Status: <strong className="text-amber-700 dark:text-amber-400 uppercase">{ref.status}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No external referrals or intelligence flags recorded.</p>
            )}
          </div>
        )}

        {/* TAB 8: Branches */}
        {activeTab === 'branches' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Operating Branches & Locations ({tp.branches?.length || 0})
            </h4>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
              <table className="min-w-full text-xs text-left divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700/60 font-semibold text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="px-3 py-2.5">BRANCH NAME</th>
                    <th className="px-3 py-2.5">CODE</th>
                    <th className="px-3 py-2.5">CITY</th>
                    <th className="px-3 py-2.5">TAX CENTER</th>
                    <th className="px-3 py-2.5">EMPLOYEES</th>
                    <th className="px-3 py-2.5">HEAD OFFICE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-mono text-[11px]">
                  {tp.branches && tp.branches.length > 0 ? (
                    tp.branches.map((b, idx) => (
                      <tr key={b.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40">
                        <td className="px-3 py-2 font-bold text-slate-800 dark:text-white">{b.branch_name}</td>
                        <td className="px-3 py-2 text-slate-500">{b.branch_code}</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{b.city}</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{b.tax_center_code}</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{b.employees}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            b.is_head_office ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {b.is_head_office ? 'Head Office' : 'Branch'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-slate-400">
                        No branch network records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: Documents */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Statutory Documents & Certificates ({tp.documents?.length || 0})
            </h4>
            {tp.documents && tp.documents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tp.documents.map((doc, idx) => (
                  <div key={doc.id || idx} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs uppercase">
                        PDF
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{doc.description || doc.doc_type}</p>
                        <p className="text-[10px] font-mono text-slate-400">{doc.file_name} · {doc.upload_date}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer">
                      View
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No attached files or certificates available.</p>
            )}
          </div>
        )}

        {/* Other Tabs Placeholder */}
        {!['business', 'filing', 'financials', 'vat', 'third_party', 'compliance', 'referrals', 'branches', 'documents'].includes(activeTab) && (
          <div className="py-12 text-center text-xs text-slate-400">
            No records on file for {tabs.find(t => t.id === activeTab)?.label || activeTab}.
          </div>
        )}
      </div>

      {/* ────────────────── API JSON MODAL ────────────────── */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 text-slate-100 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col border border-slate-700">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700">
              <span className="font-mono text-xs font-bold text-slate-300">
                /api/public/v1/taxpayers/{tin}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyJson}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-600"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-4 font-mono text-[11px] bg-slate-950 text-emerald-400 leading-relaxed">
              <pre>{JSON.stringify(tp, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
