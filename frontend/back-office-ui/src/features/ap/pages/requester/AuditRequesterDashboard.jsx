import React, { useState, useEffect } from 'react';
import { 
  Building2, Send, FileText, CheckCircle, Clock, AlertTriangle, 
  Search, Shield, Plus, Filter, ArrowRight, Check, Eye, HelpCircle, UserCheck
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, StatCard, Button, Modal, Badge, Alert, Textarea, Input, Select, Pagination } from '../../../../components/ui/index.jsx';
import { TAX_CENTERS, AUDIT_TYPES } from '../../data/constants.js';

// Pre-seeded referral audit cases for demonstration and testing
const INITIAL_REFERRALS = [
  {
    id: 'ref-1001',
    caseNumber: 'REF-2026-TC-001',
    taxpayerId: 'TIN-908123451',
    taxpayerName: 'Abyssinia Beverages Share Company',
    sector: 'Manufacturing & Industrial',
    requestingEntity: 'Tax Clearance Directorate',
    requestingOfficer: 'Getachew Zewde',
    referralReason: 'Tax Clearance Certificate Application for $4.2M Foreign Credit License',
    auditType: 'comprehensive',
    priority: 'CRITICAL',
    targetTaxCenter: 'federal-lto1',
    estimatedRevenue: 42000000,
    riskParameters: ['Customs Import Discrepancy (>35%)', 'Continuous Losses 3+ Years', 'VAT Return Mismatch'],
    evidenceAttached: 'Clearance_Application_Ref_8912.pdf, Customs_Declaration_Manifest.xlsx',
    status: 'PENDING_TAX_CENTER_REVIEW',
    submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'ref-1002',
    caseNumber: 'REF-2026-BC-002',
    taxpayerId: 'TIN-443210982',
    taxpayerName: 'Ethio-Logistics Solutions PLC',
    sector: 'Transport & Freight Logistics',
    requestingEntity: 'Business Closure & Deregistration Directorate',
    requestingOfficer: 'Tigist Worku',
    referralReason: 'Voluntary Deregistration Request - Final Liquidation Audit Required',
    auditType: 'issue_audit',
    priority: 'HIGH',
    targetTaxCenter: 'addis_ababa-tc1',
    estimatedRevenue: 18500000,
    riskParameters: ['Unresolved Tax Liabilities', 'Capital Asset Transfer Discrepancy'],
    evidenceAttached: 'Liquidation_Balance_Sheet.pdf',
    status: 'ASSIGNED_TO_TEAM_LEADER',
    assignedTeamLeaderId: 'u-tl-aa1a',
    assignedTeamLeaderName: 'Henok Belay (Desk TL)',
    submittedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'ref-1003',
    caseNumber: 'REF-2026-FI-003',
    taxpayerId: 'TIN-776512399',
    taxpayerName: 'Blue Nile Holdings Trading Corp',
    sector: 'Wholesale & Import-Export',
    requestingEntity: 'Intelligence & Fraud Investigation Directorate',
    requestingOfficer: 'Deriba Alemayehu',
    referralReason: 'Cross-Border Transfer Pricing Discrepancy Referral from Customs Anti-Smuggling Unit',
    auditType: 'transfer_pricing',
    priority: 'CRITICAL',
    targetTaxCenter: 'federal-lto1',
    estimatedRevenue: 89000000,
    riskParameters: ['Related Party Over-Invoicing', 'Tax Haven Royalty Payments', 'IQR Outlier'],
    evidenceAttached: 'Intelligence_Brief_TP_2026_09.pdf, Bank_Wire_Audit.xlsx',
    status: 'ASSIGNED_TO_COMMITTEE',
    assignedCommitteeId: 'u-com-fed-tpchair',
    assignedCommitteeName: 'Federal TP Committee Chair',
    submittedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'ref-1004',
    caseNumber: 'REF-2026-EXT-004',
    taxpayerId: 'TIN-551122334',
    taxpayerName: 'Horn Telecom Equipment Supplier',
    sector: 'Telecommunications & ICT',
    requestingEntity: 'Ministry of Trade & Regional Integration (External)',
    requestingOfficer: 'External Trade Enforcement Unit',
    referralReason: 'Import License Renewal Audit Triggered by Trade Discrepancy Reporting System',
    auditType: 'desk_audit',
    priority: 'MEDIUM',
    targetTaxCenter: 'addis_ababa-tc2',
    estimatedRevenue: 9200000,
    riskParameters: ['Under-reporting of Turnover', 'Customs Value Discrepancy'],
    evidenceAttached: 'MoTRI_Trade_License_Audit_Request.pdf',
    status: 'IN_PROGRESS',
    assignedAuditorId: 'u-aud-aa2a',
    assignedAuditorName: 'Meseret Hailu',
    submittedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  }
];

export default function AuditRequesterDashboard() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState(() => {
    const saved = localStorage.getItem('mor_audit_referrals');
    return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
  });

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterTaxCenter, setFilterTaxCenter] = useState('ALL');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Request Form State
  const [formData, setFormData] = useState({
    taxpayerName: '',
    taxpayerId: '',
    sector: 'Manufacturing & Industrial',
    requestingEntity: user?.name ? `${user.name} (${user.role.replace(/_/g, ' ')})` : 'Tax Clearance Directorate',
    referralReason: '',
    auditType: 'issue_audit',
    priority: 'HIGH',
    targetTaxCenter: 'federal-lto1',
    estimatedRevenue: '',
    riskParameters: [],
    evidenceDetails: '',
  });

  // Save to localStorage when referrals change
  useEffect(() => {
    localStorage.setItem('mor_audit_referrals', JSON.stringify(referrals));
  }, [referrals]);

  // Handle Form Change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRiskParameterToggle = (param) => {
    setFormData(prev => {
      const exists = prev.riskParameters.includes(param);
      return {
        ...prev,
        riskParameters: exists
          ? prev.riskParameters.filter(p => p !== param)
          : [...prev.riskParameters, param]
      };
    });
  };

  // Submit Referral Request
  const handleSubmitReferral = async (e) => {
    e.preventDefault();
    if (!formData.taxpayerName || !formData.taxpayerId || !formData.referralReason) {
      alert('Please fill out all required fields (*)');
      return;
    }

    setSubmitting(true);
    try {
      // Post to backend API if available, or fallback to state
      const refNumber = `REF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newRef = {
        id: `ref-${Date.now()}`,
        caseNumber: refNumber,
        taxpayerId: formData.taxpayerId.toUpperCase(),
        taxpayerName: formData.taxpayerName,
        sector: formData.sector,
        requestingEntity: formData.requestingEntity,
        requestingOfficer: user?.name || 'Audit Referral Officer',
        referralReason: formData.referralReason,
        auditType: formData.auditType,
        priority: formData.priority,
        targetTaxCenter: formData.targetTaxCenter,
        estimatedRevenue: Number(formData.estimatedRevenue) || 15000000,
        riskParameters: formData.riskParameters.length > 0 ? formData.riskParameters : ['Direct Referral Risk Flag'],
        evidenceAttached: formData.evidenceDetails || 'Supporting_Referral_Document.pdf',
        status: 'PENDING_TAX_CENTER_REVIEW',
        submittedAt: new Date().toISOString(),
      };

      // Try sending to backend API
      try {
        await fetch('/api/v1/backoffice/ap/cases/referrals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor-Id': user?.id || 'requester-user'
          },
          body: JSON.stringify(newRef)
        });
      } catch (err) {
        console.warn('Backend API submission fallback to local state:', err);
      }

      setReferrals(prev => [newRef, ...prev]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowRequestModal(false);
        // Reset form
        setFormData({
          taxpayerName: '',
          taxpayerId: '',
          sector: 'Manufacturing & Industrial',
          requestingEntity: user?.name ? `${user.name}` : 'Tax Clearance Directorate',
          referralReason: '',
          auditType: 'issue_audit',
          priority: 'HIGH',
          targetTaxCenter: 'federal-lto1',
          estimatedRevenue: '',
          riskParameters: [],
          evidenceDetails: '',
        });
      }, 1500);
    } catch (err) {
      alert('Failed to submit audit referral request: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered referrals list
  const filteredReferrals = referrals.filter(ref => {
    const matchesSearch = 
      ref.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.taxpayerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.taxpayerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.requestingEntity.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = filterPriority === 'ALL' || ref.priority === filterPriority;
    const matchesStatus = filterStatus === 'ALL' || ref.status === filterStatus;
    const matchesTaxCenter = filterTaxCenter === 'ALL' || ref.targetTaxCenter === filterTaxCenter;

    return matchesSearch && matchesPriority && matchesStatus && matchesTaxCenter;
  });

  // Stat counters
  const totalCount = referrals.length;
  const pendingCount = referrals.filter(r => r.status === 'PENDING_TAX_CENTER_REVIEW').length;
  const inProgressCount = referrals.filter(r => ['ASSIGNED_TO_TEAM_LEADER', 'ASSIGNED_TO_COMMITTEE', 'IN_PROGRESS'].includes(r.status)).length;
  const completedCount = referrals.filter(r => r.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-2xl p-6 text-white shadow-xl border border-blue-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <Shield size={13} /> Official Statutory Audit Request Portal
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Directorate Audit Referral & Case Flagging Console
            </h1>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Submit formal audit referrals for tax clearance requests, business closures, cross-border intelligence flags, and external statutory inquiries. Cases route directly to Tax Center Managers for workload evaluation and team allocation.
            </p>
          </div>
          <Button
            variant="primary"
            icon={Plus}
            size="lg"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-950/50 shrink-0"
            onClick={() => setShowRequestModal(true)}
          >
            Submit Audit Referral
          </Button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Referrals Submitted"
          value={totalCount}
          icon={FileText}
          color="blue"
          sub="Statutory case referrals"
        />
        <StatCard
          label="Pending Manager Review"
          value={pendingCount}
          icon={Clock}
          color="orange"
          sub="Awaiting Tax Center assignment"
        />
        <StatCard
          label="Active Audits In-Progress"
          value={inProgressCount}
          icon={Building2}
          color="yellow"
          sub="Assigned to audit teams"
        />
        <StatCard
          label="Completed Audit Reports"
          value={completedCount}
          icon={CheckCircle}
          color="green"
          sub="Finalized case dossiers"
        />
      </div>

      {/* Filter and Search Bar */}
      <Card padding={true}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search TIN, Taxpayer name, Case # or Entity..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Priority:</span>
              <select
                value={filterPriority}
                onChange={e => setFilterPriority(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium"
              >
                <option value="ALL">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Status:</span>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING_TAX_CENTER_REVIEW">Pending Manager Review</option>
                <option value="ASSIGNED_TO_TEAM_LEADER">Assigned to Team Leader</option>
                <option value="ASSIGNED_TO_COMMITTEE">Assigned to Committee</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Target Tax Center:</span>
              <select
                value={filterTaxCenter}
                onChange={e => setFilterTaxCenter(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium"
              >
                <option value="ALL">All Tax Centers</option>
                <option value="federal-lto1">Federal LTO-1</option>
                <option value="addis_ababa-tc1">Addis Ababa TC1</option>
                <option value="addis_ababa-tc2">Addis Ababa TC2</option>
                <option value="addis_ababa-tc3">Addis Ababa TC3</option>
                <option value="oromia-tc1">Oromia Regional TC1</option>
                <option value="amhara-tc1">Amhara Regional TC1</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Referrals Table */}
      <Card padding={false}>
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">📑 Submitted Audit Case Referrals</h3>
            <p className="text-xs text-gray-500">Track real-time status of statutory audit requests across MOR Tax Centers</p>
          </div>
          <Badge color="blue">{filteredReferrals.length} Cases</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Case / Taxpayer</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Requesting Entity</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Audit Type</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-600 dark:text-gray-300">Priority</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Target Center</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredReferrals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No referral audit cases match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReferrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-blue-600 dark:text-blue-400">{ref.caseNumber}</div>
                      <div className="font-semibold text-gray-900 dark:text-white mt-0.5">{ref.taxpayerName}</div>
                      <div className="text-[11px] text-gray-500 font-mono">TIN: {ref.taxpayerId} | {ref.sector}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{ref.requestingEntity}</div>
                      <div className="text-[11px] text-gray-500">Officer: {ref.requestingOfficer}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        {ref.auditType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge color={
                        ref.priority === 'CRITICAL' ? 'red' :
                        ref.priority === 'HIGH' ? 'orange' :
                        ref.priority === 'MEDIUM' ? 'yellow' : 'blue'
                      }>
                        {ref.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                      {ref.targetTaxCenter?.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge color={
                        ref.status === 'PENDING_TAX_CENTER_REVIEW' ? 'orange' :
                        ref.status === 'IN_PROGRESS' ? 'blue' :
                        ref.status === 'COMPLETED' ? 'green' : 'purple'
                      } dot>
                        {ref.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Eye}
                        onClick={() => setSelectedReferral(ref)}
                      >
                        View Dossier
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ═══ SUBMIT NEW AUDIT REFERRAL MODAL ═══ */}
      <Modal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        title="📝 Submit Statutory Audit Referral Request"
        size="2xl"
      >
        {submitSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
              <Check size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Audit Referral Submitted Successfully!</h3>
            <p className="text-xs text-gray-500">
              The audit request has been registered and routed to the Tax Center Manager queue for allocation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReferral} className="space-y-4">
            <Alert type="info">
              Formally flag a taxpayer for desk, comprehensive, issue, or transfer pricing audit based on tax clearance application, business closure, customs discrepancy, or statutory referral.
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              {/* Taxpayer Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Taxpayer / Company Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Nile Cement Share Company"
                  value={formData.taxpayerName}
                  onChange={e => handleInputChange('taxpayerName', e.target.value)}
                  required
                />
              </div>

              {/* Taxpayer TIN */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Taxpayer TIN Number <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. TIN-998877112"
                  value={formData.taxpayerId}
                  onChange={e => handleInputChange('taxpayerId', e.target.value)}
                  required
                />
              </div>

              {/* Sector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Business Sector
                </label>
                <select
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs"
                  value={formData.sector}
                  onChange={e => handleInputChange('sector', e.target.value)}
                >
                  <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
                  <option value="Wholesale & Import-Export">Wholesale & Import-Export</option>
                  <option value="Transport & Freight Logistics">Transport & Freight Logistics</option>
                  <option value="Telecommunications & ICT">Telecommunications & ICT</option>
                  <option value="Construction & Real Estate">Construction & Real Estate</option>
                  <option value="Banking & Financial Services">Banking & Financial Services</option>
                </select>
              </div>

              {/* Target Tax Center */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Target Tax Center <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs"
                  value={formData.targetTaxCenter}
                  onChange={e => handleInputChange('targetTaxCenter', e.target.value)}
                >
                  <option value="federal-lto1">Federal Large Taxpayers Office (LTO-1)</option>
                  <option value="addis_ababa-tc1">Addis Ababa Tax Center 1 (AA-TC1)</option>
                  <option value="addis_ababa-tc2">Addis Ababa Tax Center 2 (AA-TC2)</option>
                  <option value="addis_ababa-tc3">Addis Ababa Tax Center 3 (AA-TC3)</option>
                  <option value="oromia-tc1">Oromia Regional Tax Center (BB-TC1)</option>
                  <option value="amhara-tc1">Amhara Regional Tax Center (BA-TC1)</option>
                </select>
              </div>

              {/* Audit Type Requested */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Audit Type Requested <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-semibold"
                  value={formData.auditType}
                  onChange={e => handleInputChange('auditType', e.target.value)}
                >
                  <option value="issue_audit">Issue Audit (Specific Risk Item)</option>
                  <option value="desk_audit">Desk Audit (Returns & Declarations)</option>
                  <option value="comprehensive">Comprehensive Field Audit (All Tax Types)</option>
                  <option value="transfer_pricing">Transfer Pricing Audit (Arm's Length / Cross-border)</option>
                  <option value="joint_audit">Joint Audit (Multi-Agency / Inter-State)</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Referral Priority <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold text-red-600"
                  value={formData.priority}
                  onChange={e => handleInputChange('priority', e.target.value)}
                >
                  <option value="CRITICAL">CRITICAL (Immediate Freeze / Action Required)</option>
                  <option value="HIGH">HIGH (30-day Regulatory Deadline)</option>
                  <option value="MEDIUM">MEDIUM (Standard Annual Plan Priority)</option>
                  <option value="LOW">LOW (Informational Referral)</option>
                </select>
              </div>
            </div>

            {/* Estimated Revenue */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Estimated Revenue Impact / Risk Exposure (ETB)
              </label>
              <Input
                type="number"
                placeholder="e.g. 25000000"
                value={formData.estimatedRevenue}
                onChange={e => handleInputChange('estimatedRevenue', e.target.value)}
              />
            </div>

            {/* Statutory Rationale */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Referral Rationale & Statutory Basis <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Detail the audit trigger reason: e.g. Tax Clearance application pending for $5M bank transfer, continuous loss claims despite revenue growth, customs value mismatch, or business deregistration request."
                rows={3}
                value={formData.referralReason}
                onChange={e => handleInputChange('referralReason', e.target.value)}
                required
              />
            </div>

            {/* Risk Indicators / Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                Identified Risk Parameters (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'Customs Import Discrepancy (>35%)',
                  'Continuous Losses 3+ Years',
                  'VAT Return & Income Mismatch',
                  'Related Party Loan / Royalty Payment',
                  'Non-Submission of Annual Return',
                  'Unexplained Capital Asset Reduction',
                  'Tax Clearance Certificate Flag',
                  'Business Deregistration Application'
                ].map(param => (
                  <label key={param} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.riskParameters.includes(param)}
                      onChange={() => handleRiskParameterToggle(param)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{param}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Evidence Details */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Attached Evidence Files / Reference Dossier
              </label>
              <Input
                placeholder="e.g. Clearance_App_8912.pdf, Customs_Manifest.xlsx"
                value={formData.evidenceDetails}
                onChange={e => handleInputChange('evidenceDetails', e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <Button variant="secondary" type="button" onClick={() => setShowRequestModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={submitting} icon={Send}>
                {submitting ? 'Submitting...' : 'Submit Audit Referral Request'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* ═══ VIEW REFERRAL DOSSIER MODAL ═══ */}
      <Modal
        open={!!selectedReferral}
        onClose={() => setSelectedReferral(null)}
        title={`📋 Audit Referral Dossier — ${selectedReferral?.caseNumber}`}
        size="2xl"
      >
        {selectedReferral && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-900 text-white rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-[10px] font-mono uppercase">Taxpayer</p>
                <h3 className="text-base font-bold text-white">{selectedReferral.taxpayerName}</h3>
                <p className="text-blue-300 text-xs font-mono">TIN: {selectedReferral.taxpayerId} | Sector: {selectedReferral.sector}</p>
              </div>
              <div className="text-right">
                <Badge color={
                  selectedReferral.priority === 'CRITICAL' ? 'red' : 'orange'
                }>
                  {selectedReferral.priority} PRIORITY
                </Badge>
                <p className="text-slate-400 text-[10px] mt-1">Submitted: {new Date(selectedReferral.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-gray-500 font-semibold">Requesting Entity:</p>
                <p className="font-bold text-gray-900 dark:text-white">{selectedReferral.requestingEntity}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Requesting Officer:</p>
                <p className="font-bold text-gray-900 dark:text-white">{selectedReferral.requestingOfficer}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Audit Type Requested:</p>
                <p className="font-bold text-blue-600 dark:text-blue-400 capitalize">{selectedReferral.auditType.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Target Tax Center:</p>
                <p className="font-bold text-gray-900 dark:text-white">{selectedReferral.targetTaxCenter?.toUpperCase()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 font-semibold">Estimated Revenue Impact:</p>
                <p className="font-bold text-green-600 dark:text-green-400 text-sm">
                  {selectedReferral.estimatedRevenue?.toLocaleString()} ETB
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-gray-700 dark:text-gray-300">Referral Rationale & Statutory Basis:</p>
              <p className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                {selectedReferral.referralReason}
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-gray-700 dark:text-gray-300">Identified Risk Parameters:</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedReferral.riskParameters.map((p, i) => (
                  <Badge key={i} color="blue">{p}</Badge>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-gray-700 dark:text-gray-300">Evidence Files & Dossier References:</p>
              <div className="p-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 font-mono text-[11px] text-gray-600 dark:text-gray-300">
                📁 {selectedReferral.evidenceAttached}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setSelectedReferral(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
