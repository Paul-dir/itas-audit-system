import { useState, useCallback, useEffect } from 'react';
import { Building2, Clock, CheckCircle, Send, Eye, AlertTriangle, Check, ArrowLeft, FileText, Shield, Play, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, StatCard, Button, Modal, Badge, Alert, Textarea, Empty, ConfirmModal, Pagination } from '../../../../components/ui/index.jsx';
import { AUDIT_TYPES } from '../../data/constants.js';
import { formatRevenue } from '../../utils/revenueFormatter.js';
import PlanStatusBadge from '../shared/PlanStatusBadge.jsx';

export default function TaxCenterDashboard({ view }) {
  const { user } = useAuth();
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [feedbackStep, setFeedbackStep] = useState('review');
  const [feedbackText, setFeedbackText] = useState('');
  const [adjustedAllocation, setAdjustedAllocation] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewDetailModal, setViewDetailModal] = useState(null);
  const [tcAllocations, setTcAllocations] = useState([]);
  const [allocationsLoading, setAllocationsLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [auditCases, setAuditCases] = useState(null);
  const [casesLoading, setCasesLoading] = useState(false);
  const [cascading, setCascading] = useState(null); // planId being cascaded
  const [cascadeResult, setCascadeResult] = useState(null);
  const [cascadeModal, setCascadeModal] = useState(false);
  const [revenueStats, setRevenueStats] = useState(null);
  const [casePage, setCasePage] = useState(1);
  const [caseItemsPerPage, setCaseItemsPerPage] = useState(10);

  const allCasesList = auditCases?.cases || [];
  const totalCaseCount = auditCases?.totalCases || allCasesList.length;
  const totalCasePages = Math.ceil(totalCaseCount / caseItemsPerPage) || 1;
  const paginatedCases = allCasesList.slice((casePage - 1) * caseItemsPerPage, casePage * caseItemsPerPage);

  const mapTaxCenterToBackendFormat = (tcFromUser) => {
    if (!tcFromUser) return null;
    const mapping = {
      'addis_ababa-tc1': 'AA-TC1', 'addis_ababa-tc2': 'AA-TC2', 'addis_ababa-tc3': 'AA-TC3',
      'amhara-tc1': 'BA-TC1', 'amhara-tc2': 'BA-TC2', 'amhara-tc3': 'BA-TC3',
      'oromia-tc1': 'BB-TC1', 'oromia-tc2': 'BB-TC2', 'oromia-tc3': 'BB-TC3',
      'dire_dawa-tc1': 'AB-TC1', 'dire_dawa-tc2': 'AB-TC2', 'dire_dawa-tc3': 'AB-TC3',
      'snnpr-tc1': 'CA-TC1', 'snnpr-tc2': 'CA-TC2', 'snnpr-tc3': 'CA-TC3',
      'somali-tc1': 'SO-TC1', 'somali-tc2': 'SO-TC2', 'somali-tc3': 'SO-TC3',
    };
    return mapping[tcFromUser] || tcFromUser;
  };

  const mapRegionToBackendFormat = (regionFromUser) => {
    if (!regionFromUser) return null;
    const mapping = {
      'addis_ababa': 'AA', 'amhara': 'BA', 'oromia': 'BB',
      'dire_dawa': 'AB', 'snnpr': 'CA', 'somali': 'SO',
    };
    return mapping[regionFromUser] || regionFromUser;
  };

  const taxCenter = mapTaxCenterToBackendFormat(user?.taxCenter);
  const region = mapRegionToBackendFormat(user?.region);

  // Load tax center revenue stats
  useEffect(() => {
    const loadRevenue = async () => {
      try {
        const tcCode = taxCenter || user?.taxCenterCode;
        if (!tcCode) return;
        const res = await fetch(`/api/v1/backoffice/ap/revenue/taxcenter?taxCenterCode=${encodeURIComponent(tcCode)}`);
        if (res.ok) {
          const data = await res.json();
          setRevenueStats(data);
        }
      } catch (err) {
        console.error('Failed to load revenue stats:', err);
      }
    };
    loadRevenue();
  }, [user, taxCenter]);

  // Fetch allocations from backend
  const loadTcAllocations = useCallback(async () => {
    setAllocationsLoading(true);
    try {
      if (!taxCenter) { setTcAllocations([]); return; }
      const response = await fetch(
        `/api/v1/backoffice/ap/tax-center/allocations?taxCenterId=${taxCenter}`,
        { headers: { 'X-Actor-Id': user.id || 'tax-center-staff' } }
      );
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const result = await response.json();
      setTcAllocations(result.data || []);
    } catch (error) {
      console.error('Failed to load allocations:', error);
      setTcAllocations([]);
    } finally {
      setAllocationsLoading(false);
    }
  }, [taxCenter, user.id]);

  // Fetch cases from backend
  const loadCases = useCallback(async () => {
    if (!taxCenter) return;
    setCasesLoading(true);
    try {
      const response = await fetch(
        `/api/v1/backoffice/ap/tax-center/cases?taxCenterCode=${taxCenter}`,
        { headers: { 'X-Actor-Id': user.id || 'tax-center-staff' } }
      );
      if (response.ok) {
        const result = await response.json();
        setAuditCases(result.data || null);
        console.log('✅ Cases loaded:', result.data?.totalCases || 0);
      }
    } catch (error) {
      console.error('Failed to load cases:', error);
    } finally {
      setCasesLoading(false);
    }
  }, [taxCenter, user.id]);

  useEffect(() => {
    if (taxCenter && region) loadTcAllocations();
  }, [taxCenter, region, loadTcAllocations]);

  useEffect(() => { loadCases(); }, [loadCases]);

  // ── Separate allocations ──
  // pendingFeedback: pre-approval plan review stage (AWAITING_REGIONAL_FEEDBACK) -> Submit capacity feedback ONLY (NO case creation)
  // pendingCascade: post-approval deployed plan stage (APPROVED_TO_REGIONS / SENT_TO_TAX_CENTERS / FINALIZED) -> Create Cases via Risk Engine
  const pendingFeedback = tcAllocations.filter(a => 
    !a.acknowledged && (a.planStatus === 'AWAITING_REGIONAL_FEEDBACK' || !['APPROVED_TO_REGIONS', 'SENT_TO_TAX_CENTERS', 'FINALIZED'].includes(a.planStatus))
  );
  const pendingCascade = tcAllocations.filter(a => 
    !a.acknowledged && ['APPROVED_TO_REGIONS', 'SENT_TO_TAX_CENTERS', 'FINALIZED'].includes(a.planStatus)
  );
  const acknowledged = tcAllocations.filter(a => a.acknowledged);

  // Check if a plan already has cases
  const planHasCases = (planId) => {
    if (!auditCases || !auditCases.cases) return false;
    return auditCases.cases.some(c => c.planId === planId);
  };

  // ── CASCADE: trigger backend to create cases from plan allocation ──
  const handleCascade = async (allocation) => {
    if (planHasCases(allocation.planId)) {
      alert("This audit plan has already been cascaded into cases. Re-cascading is disabled to protect existing audit assignments.");
      return;
    }
    setCascading(allocation.planId);
    try {
      const response = await fetch(
        `/api/v1/backoffice/ap/plans/${allocation.planId}/cascade-to-cases`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor-Id': user.id || 'tax-center-staff'
          },
          body: JSON.stringify({ taxCenterCode: taxCenter })
        }
      );
      const result = await response.json();
      if (result.status === 'ERROR' || result.error) {
        throw new Error(result.error?.message || result.message || 'Cascade failed');
      }
      setCascadeResult({
        planName: allocation.planName,
        ...result.data
      });
      setCascadeModal(true);
      // Reload cases and allocations
      await loadCases();
      await loadTcAllocations();
      // Force reload window/state so other dashboards pick up FINALIZED status
      window.location.reload();
    } catch (error) {
      console.error('Cascade failed:', error);
      alert(`❌ Cascade Failed\n\n${error.message}`);
    } finally {
      setCascading(null);
    }
  };

  // ── FEEDBACK (acknowledge allocation) ──
  const openFeedback = (allocation) => {
    setFeedbackModal(allocation);
    setFeedbackStep('review');
    setFeedbackText('');
    setSubmissionResult(null);
    setSubmissionError(null);
    const adjustments = {};
    const backendAlloc = allocation.allocationsByAuditType || {};
    const normalizedBackend = {};
    Object.keys(backendAlloc).forEach(key => {
      let normKey = key.toLowerCase();
      if (normKey === 'comprehensive_audit') normKey = 'comprehensive';
      normalizedBackend[normKey] = backendAlloc[key];
    });
    AUDIT_TYPES.forEach(at => { adjustments[at.id] = normalizedBackend[at.id] || 0; });
    setAdjustedAllocation(adjustments);
  };

  const handleAllocationChange = (auditTypeId, value) => {
    setAdjustedAllocation(prev => ({ ...prev, [auditTypeId]: Math.max(0, parseInt(value) || 0) }));
  };

  const totalAdjusted = Object.values(adjustedAllocation).reduce((sum, val) => sum + (parseInt(val) || 0), 0);
  const originalTotal = feedbackModal?.proposedCount || 0;
  const reduction = originalTotal - totalAdjusted;
  const reductionPercent = originalTotal > 0 ? Math.round((reduction / originalTotal) * 100) : 0;

  const goToConfirm = () => {
    if (!feedbackText.trim()) {
      setSubmissionError('Please provide comments explaining your adjustments before submitting.');
      return;
    }
    setSubmissionError(null);
    setFeedbackStep('confirm');
  };

  const handleSubmit = useCallback(async () => {
    if (!feedbackModal) return;
    setLoading(true);
    setSubmissionError(null);
    try {
      const response = await fetch(
        `/api/v1/backoffice/ap/tax-center/allocations/${feedbackModal.allocationId}/acknowledge`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Actor-Id': user.id || 'tax-center-staff' },
          body: JSON.stringify({
            taxCenterId: taxCenter, feedback: feedbackText,
            adjustedAllocations: adjustedAllocation, totalAdjusted, originalTotal
          })
        }
      );
      const result = await response.json();
      if (result.status === 'ERROR' || result.error) {
        setSubmissionError(result.error?.message || result.message || 'Failed');
        setFeedbackStep('error');
        return;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setSubmissionResult({
        planName: feedbackModal.planName, proposedCount: originalTotal,
        adjustedCount: totalAdjusted, reduction, reductionPercent,
        timestamp: new Date().toLocaleString(),
      });
      setFeedbackStep('success');
      await loadTcAllocations();
    } catch (error) {
      setSubmissionError(error.message);
      setFeedbackStep('error');
    } finally {
      setLoading(false);
    }
  }, [feedbackModal, feedbackText, adjustedAllocation, totalAdjusted, originalTotal, taxCenter, user.id, reduction, reductionPercent, loadTcAllocations]);

  const closeModal = () => {
    setFeedbackModal(null); setFeedbackStep('review'); setFeedbackText('');
    setAdjustedAllocation({}); setSubmissionResult(null); setSubmissionError(null);
  };

  const totalAllocations = tcAllocations.reduce((sum, a) => sum + (a.proposedCount || 0), 0);
  const totalCasesCount = auditCases?.totalCases || 0;

  const getModalTitle = () => {
    switch (feedbackStep) {
      case 'review': return '📋 Step 1: Review & Adjust Your Allocation';
      case 'confirm': return '⚠️ Step 2: Confirm Submission';
      case 'success': return '✅ Submission Successful';
      case 'error': return '❌ Submission Failed';
      default: return 'Feedback';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Plans Assigned" value={tcAllocations.length} icon={Building2} color="blue"
          sub={taxCenter?.replace(/-/g, ' ').toUpperCase()} />
        <StatCard label="Total Cases" value={totalCasesCount > 0 ? totalCasesCount.toLocaleString() : totalAllocations.toLocaleString()}
          icon={CheckCircle} color="green"
          sub={totalCasesCount > 0 ? 'Generated by risk engine' : 'Allocated from plans'} />
        <StatCard label="Pending Feedback" value={pendingFeedback.length} icon={Clock} color="orange"
          sub={pendingFeedback.length > 0 ? 'Review & submit feedback' : 'No feedback pending'} />
        <StatCard label="Pending Cascade" value={pendingCascade.length} icon={Play} color="yellow"
          sub={pendingCascade.length > 0 ? 'Ready to create cases' : 'All cascaded'} />
      </div>

      {/* TC Revenue by Audit Type - ONLY for current logged in tax center */}
      {revenueStats && revenueStats.taxCenterBreakdown && revenueStats.taxCenterBreakdown.some(tc => tc.taxCenterCode === taxCenter) && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            💰 Estimated Revenue by Audit Type ({taxCenter})
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {revenueStats.taxCenterBreakdown
              .filter(tc => tc.taxCenterCode === taxCenter)
              .map((tc) => (
                Object.entries(tc.revenueByAuditType || {}).map(([type, rev]) => (
                  <div key={`${tc.taxCenterCode}-${type}`} className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{formatRevenue(rev)}</p>
                    <p className="text-xs text-blue-600 font-semibold">{tc.taxCenterCode}</p>
                  </div>
                ))
              ))}
          </div>
        </Card>
      )}

      {pendingFeedback.length > 0 && (
        <Alert type="info" title="Plans awaiting capacity feedback">
          The Regional Director has distributed draft allocations for review. Click <strong>"Submit Feedback"</strong> to review auditor capacity and submit feedback. (No cases will be created at this stage).
        </Alert>
      )}

      {pendingCascade.length > 0 && (
        <Alert type="warning" title="Plans ready for case cascade">
          These plans have been fully approved and deployed by your Regional Director. Click <strong>"Create Cases"</strong> to run the risk engine classification and generate audit cases.
        </Alert>
      )}

      {/* ═══ PENDING FEEDBACK TABLE (Pre-Approval Review) ═══ */}
      {pendingFeedback.length > 0 && (
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">📝 Pending Capacity Feedback (Pre-Approval Review)</h3>
            <p className="text-xs text-gray-500 mt-0.5">Draft plan allocations waiting for tax center capacity review and feedback submission</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Plan Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Allocated Cases</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Region</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingFeedback.map(alloc => (
                  <tr key={alloc.allocationId}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                    onClick={() => openFeedback(alloc)}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">{alloc.planName || `Plan`}</p>
                      <p className="text-xs text-gray-500 mt-0.5">FY {alloc.planYear}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">{alloc.proposedCount?.toLocaleString() || 0}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{alloc.regionCode || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge color="blue" dot>Awaiting Feedback</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" icon={Eye}
                          onClick={(e) => { e.stopPropagation(); openFeedback(alloc); }}>
                          Review Allocation
                        </Button>
                        <Button size="sm" variant="primary" icon={Send}
                          onClick={(e) => { e.stopPropagation(); openFeedback(alloc); }}>
                          Submit Feedback
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ═══ PENDING CASCADE TABLE (Post-Approval Deployment) ═══ */}
      {pendingCascade.length > 0 && (
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">🚀 Pending Case Cascade (Post-Approval Execution)</h3>
            <p className="text-xs text-gray-500 mt-0.5">Approved & deployed plans waiting to be cascaded to audit cases via the risk engine</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Plan Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Allocated Cases</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Region</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingCascade.map(alloc => (
                  <tr key={alloc.allocationId}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-amber-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                    onClick={() => setViewDetailModal(alloc)}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">{alloc.planName || `Plan`}</p>
                      <p className="text-xs text-gray-500 mt-0.5">FY {alloc.planYear}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">{alloc.proposedCount?.toLocaleString() || 0}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{alloc.regionCode || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge color="yellow" dot>Approved - Ready for Cascade</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" icon={Eye}
                          onClick={(e) => { e.stopPropagation(); setViewDetailModal(alloc); }}>
                          View
                        </Button>
                        <Button size="sm" variant="success" icon={Play} loading={cascading === alloc.planId}
                          onClick={(e) => { e.stopPropagation(); handleCascade(alloc); }}>
                          {cascading === alloc.planId ? 'Cascading...' : 'Create Cases'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ═══ ACKNOWLEDGED TABLE ═══ */}
      {acknowledged.length > 0 && (
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">✅ Acknowledged Plans</h3>
            <p className="text-xs text-gray-500 mt-0.5">Plans you have acknowledged — cases created from cascade</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Plan Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Allocated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Your Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {acknowledged.map(alloc => {
                  const allocated = alloc.proposedCount || 0;
                  const accepted = alloc.tcAdjustedCount || allocated;
                  const diff = allocated - accepted;
                  return (
                    <tr key={alloc.allocationId}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                      onClick={() => setViewDetailModal(alloc)}>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 dark:text-white">{alloc.planName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {alloc.acknowledgedAt ? new Date(alloc.acknowledgedAt).toLocaleDateString() : ''}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 dark:text-white">{allocated.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-blue-600 dark:text-blue-400">{accepted.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge color="green" dot>Acknowledged</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button size="sm" variant="secondary" icon={Eye}
                          onClick={(e) => { e.stopPropagation(); setViewDetailModal(alloc); }}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tcAllocations.length === 0 && !allocationsLoading && (
        <Card>
          <Empty icon={Building2} title="No plans assigned yet" description="Plans will appear here once your regional director allocates cases to your tax center." />
        </Card>
      )}

      {allocationsLoading && (
        <Card>
          <div className="text-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500 mx-auto mb-2" />
            <p className="text-gray-500">Loading allocations...</p>
          </div>
        </Card>
      )}

      {/* ═══ AUDIT CASES ═══ */}
      {auditCases && auditCases.totalCases > 0 && (
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">📊 Audit Cases — Risk Engine Cascade</h3>
                <p className="text-xs text-gray-500 mt-0.5">{auditCases.totalCases.toLocaleString()} cases generated from plan allocation via risk engine classification</p>
              </div>
              <div className="flex gap-2">
                <Badge color="green" dot>{auditCases.status === 'CASES_READY' ? 'Ready' : 'Pending'}</Badge>
                <Button size="sm" variant="secondary" icon={RefreshCw} onClick={loadCases}>Refresh</Button>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-5 gap-3 mb-4">
              {Object.entries(auditCases.casesByAuditType || {}).map(([auditType, count]) => (
                <div key={auditType} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{auditType.replace(/_/g, ' ')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{count.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Case #</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Taxpayer</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Audit Type</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Risk Score</th>
                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {paginatedCases.map((c, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-2 font-mono text-xs text-gray-600 dark:text-gray-400">{c.caseNumber}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-white">{c.taxpayerId}</td>
                      <td className="px-4 py-2 text-center">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {c.auditType?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className={`font-bold ${
                          c.riskScore >= 50 ? 'text-red-600' :
                          c.riskScore >= 35 ? 'text-orange-500' :
                          c.riskScore >= 20 ? 'text-yellow-600' : 'text-green-600'
                        }`}>{c.riskScore}</span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <Badge color={c.status === 'PENDING_ASSIGNMENT' ? 'yellow' : c.status === 'IN_PROGRESS' ? 'blue' : 'green'}>
                          {c.status?.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={casePage}
              totalPages={totalCasePages}
              totalItems={totalCaseCount}
              itemsPerPage={caseItemsPerPage}
              onPageChange={setCasePage}
              onItemsPerPageChange={(newVal) => { setCaseItemsPerPage(newVal); setCasePage(1); }}
            />
          </div>
        </Card>
      )}

      {auditCases && auditCases.totalCases === 0 && (
        <Card>
          <Empty icon={AlertTriangle} title="No audit cases yet"
            description="Click 'Create Cases' on a pending plan to fetch taxpayers, run risk engine classification, and generate audit cases." />
        </Card>
      )}

      {/* ═══ CASCADE SUCCESS MODAL ═══ */}
      <Modal open={cascadeModal} onClose={() => setCascadeModal(false)}
        title="✅ Case Cascade Complete" size="lg"
        footer={<Button variant="primary" onClick={() => setCascadeModal(false)}>Done</Button>}>
        {cascadeResult && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-700">{cascadeResult.totalCasesCreated || 0} Audit Cases Created</h3>
              <p className="text-sm text-gray-600 mt-2">
                Plan "{cascadeResult.planName}" (FY {cascadeResult.planYear}) cascaded through the risk engine.
              </p>
              {cascadeResult.previousCasesDeleted > 0 && (
                <p className="text-xs text-orange-600 mt-1">🗑️ Previous {cascadeResult.previousCasesDeleted} cases replaced</p>
              )}
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-green-700 font-medium">Plan:</p><p className="font-bold">{cascadeResult.planName}</p></div>
                <div><p className="text-green-700 font-medium">Tax Centers:</p><p className="font-bold">{cascadeResult.taxCentersProcessed || 0}</p></div>
                <div><p className="text-green-700 font-medium">Status:</p><Badge color="green" dot>{cascadeResult.status}</Badge></div>
                <div><p className="text-green-700 font-medium">Plan Year:</p><p className="font-bold">FY {cascadeResult.planYear}</p></div>
              </div>
              {cascadeResult.casesByAuditType && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-sm font-semibold text-green-900 mb-2">Cases by Audit Type:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(cascadeResult.casesByAuditType).map(([type, count]) => (
                      <Badge key={type} color="blue">{type.replace(/_/g, ' ')}: {count}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {cascadeResult.casesByTeamLeader && Object.keys(cascadeResult.casesByTeamLeader).length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-2">👤 Auto-Assigned Team Leaders:</p>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {Object.entries(cascadeResult.casesByTeamLeader).map(([tlId, count]) => (
                    <div key={tlId} className="flex justify-between">
                      <span className="text-gray-600">{tlId}</span>
                      <span className="font-bold text-blue-700">{count} cases</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Alert type="info" title="What happens next?">
              Cases have been auto-assigned to team leaders (by audit type) and are ready for further assignment to auditors.
            </Alert>
          </div>
        )}
      </Modal>

      {/* ═══ FEEDBACK MODAL ═══ */}
      <Modal open={!!feedbackModal} onClose={closeModal} title={getModalTitle()} size="2xl"
        footer={
          feedbackStep === 'review' ? (
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeModal}>Cancel</Button>
              <Button variant="primary" icon={Send} onClick={goToConfirm} disabled={!feedbackText.trim()}>Review & Submit →</Button>
            </div>
          ) : feedbackStep === 'confirm' ? (
            <div className="flex justify-end gap-2">
              <Button variant="secondary" icon={ArrowLeft} onClick={() => setFeedbackStep('review')}>← Back</Button>
              <Button variant="success" icon={Send} loading={loading} onClick={handleSubmit}>{loading ? 'Submitting...' : 'Confirm & Submit'}</Button>
            </div>
          ) : (
            <div className="flex justify-end gap-2"><Button variant="primary" onClick={closeModal}>Done</Button></div>
          )
        }>
        {feedbackModal && feedbackStep === 'review' && (
          <div className="space-y-5">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-blue-800">
                You have been allocated <strong>{feedbackModal.proposedCount?.toLocaleString()} cases</strong> from plan <strong>"{feedbackModal.planName}"</strong>.
              </p>
            </div>
            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-100 dark:bg-slate-800">
                  <th className="px-4 py-3 text-left font-semibold">Audit Type</th>
                  <th className="px-4 py-3 text-right font-semibold">Allocated</th>
                  <th className="px-4 py-3 text-right font-semibold">Your Capacity</th>
                </tr></thead>
                <tbody>
                  {AUDIT_TYPES.map(at => {
                    const orig = feedbackModal.allocationsByAuditType?.[at.id] || feedbackModal.allocationsByAuditType?.[at.id.toUpperCase()] || 0;
                    const curr = adjustedAllocation[at.id] || 0;
                    return (
                      <tr key={at.id} className="border-b border-gray-200">
                        <td className="px-4 py-3"><Badge color={at.color} className="text-xs">{at.shortName}</Badge> <span className="font-medium">{at.name}</span></td>
                        <td className="px-4 py-3 text-right">{orig.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <input type="number" min="0" value={curr}
                            onChange={(e) => handleAllocationChange(at.id, e.target.value)}
                            className="w-24 px-2 py-1 text-right font-semibold border rounded bg-white dark:bg-slate-700" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Textarea label="Comments *" placeholder="Explain your capacity constraints..." value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)} rows={3} />
            {submissionError && <Alert type="error">{submissionError}</Alert>}
          </div>
        )}
        {feedbackModal && feedbackStep === 'confirm' && (
          <div className="space-y-4">
            <Alert type="warning">Review before submitting — this cannot be undone.</Alert>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p><strong>Plan:</strong> {feedbackModal.planName}</p>
              <p><strong>Original:</strong> {originalTotal.toLocaleString()} | <strong>Your Acceptance:</strong> {totalAdjusted.toLocaleString()}</p>
              <p><strong>Comments:</strong> "{feedbackText}"</p>
            </div>
          </div>
        )}
        {feedbackModal && feedbackStep === 'success' && (
          <div className="text-center py-4">
            <Check className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-700">Feedback Submitted!</h3>
            <p className="text-sm text-gray-600 mt-2">Your acknowledgment has been recorded.</p>
          </div>
        )}
        {feedbackModal && feedbackStep === 'error' && (
          <div className="text-center py-4">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-red-700">Failed</h3>
            <p className="text-sm text-gray-600 mt-2">{submissionError}</p>
          </div>
        )}
      </Modal>

      {/* ═══ VIEW DETAIL MODAL ═══ */}
      <Modal open={!!viewDetailModal} onClose={() => setViewDetailModal(null)} title="Allocation Details" size="2xl"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setViewDetailModal(null)}>Close</Button>
            {!viewDetailModal?.acknowledged && (
              <Button variant="success" icon={Play} loading={cascading === viewDetailModal?.planId}
                onClick={() => { handleCascade(viewDetailModal); setViewDetailModal(null); }}>
                Create Cases
              </Button>
            )}
          </div>
        }>
        {viewDetailModal && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-gray-500">Plan Name</p><p className="font-semibold">{viewDetailModal.planName}</p></div>
                <div><p className="text-xs text-gray-500">Status</p>
                  <Badge color={viewDetailModal.acknowledged ? 'green' : 'yellow'} dot>
                    {viewDetailModal.acknowledged ? 'Acknowledged' : 'Pending Cascade'}
                  </Badge>
                </div>
                <div><p className="text-xs text-gray-500">Region</p><p className="font-semibold">{viewDetailModal.regionCode}</p></div>
                <div><p className="text-xs text-gray-500">Plan Year</p><p className="font-semibold">{viewDetailModal.planYear}</p></div>
              </div>
            </div>
            {viewDetailModal.allocationsByAuditType && (
              <div>
                <p className="text-sm font-semibold mb-2">Allocation by Audit Type</p>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(viewDetailModal.allocationsByAuditType).map(([type, count]) => (
                    <div key={type} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center text-sm border">
                      <p className="text-xs text-gray-500">{type.replace(/_/g, ' ')}</p>
                      <p className="font-bold">{count.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
