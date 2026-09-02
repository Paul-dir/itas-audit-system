import { useState } from 'react';
import { MapPin, Send, CheckCircle, Clock, Eye, Package, ArrowRight, Search, Timer, Truck, Rocket, ClipboardCheck, FileCheck, ChevronRight, CircleDot, Inbox, ArrowUpCircle, Shield, TrendingUp } from 'lucide-react';
import { useApp } from '../../../../context/AppContext.jsx';
import { useAuth } from '../../../../context/AuthContext.jsx';
import { Card, Button, Alert, Badge, StatCard, Modal, Textarea, Tabs, Empty, Table, Input } from '../../../../components/ui/index.jsx';
import { formatRevenue } from '../../utils/revenueFormatter.js';
import PlanStatusBadge from '../shared/PlanStatusBadge.jsx';
import { DistributionTable, TaxCenterDistributionTable } from '../shared/DistributionTable.jsx';
import DistributionModal from './DistributionModal.jsx';
import FeedbackSubmissionModal from './FeedbackSubmissionModal.jsx';
import { AUDIT_TYPES, REGIONS, CASE_STATUS, getTaxCentersForRegion } from '../../data/constants.js';
import PlanTimeline from '../shared/PlanTimeline.jsx';
import { useEffect } from 'react';

export default function RegionalDashboard({ view }) {
  const { state, actions, selectors } = useApp();
  const { user } = useAuth();
  const region = user.region;
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [tcAllocations, setTcAllocations] = useState({});
  const [regionalAggregate, setRegionalAggregate] = useState({}); // NEW: For aggregated view
  const [aggregateView, setAggregateView] = useState(false); // NEW: Toggle between TC and aggregate view
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [distributing, setDistributing] = useState(false);
  const [distributed, setDistributed] = useState(false);
  const [viewPlan, setViewPlan] = useState(null);
  const [viewTab, setViewTab] = useState('overview');
  const [tcFeedbackReviewModal, setTcFeedbackReviewModal] = useState(null);
  const [aggregateOverrides, setAggregateOverrides] = useState({}); // Regional Director can override aggregate
  const [editMode, setEditMode] = useState(false); // ✅ NEW: Edit mode for TC Capacity table
  const [editedAggregation, setEditedAggregation] = useState({}); // ✅ NEW: Edited aggregation values
  // Case viewer for finalized plans
  const [casePlanFilter, setCasePlanFilter] = useState(null); // planId to filter cases
  const [caseSearch, setCaseSearch] = useState('');
  const [regionalPlans, setRegionalPlans] = useState([]); // ✅ Plans fetched from backend for this region
  const [plansLoading, setPlansLoading] = useState(false);
  const [filteredPlansView, setFilteredPlansView] = useState('awaiting'); // DEFAULT: Show only "Awaiting Your Feedback"
  
  // NEW MODAL STATES FOR WORKFLOW SEPARATION
  const [distributionModalOpen, setDistributionModalOpen] = useState(false);
  const [feedbackSubmissionModalOpen, setFeedbackSubmissionModalOpen] = useState(false);
  const [distributionModalPlan, setDistributionModalPlan] = useState(null);
  const [feedbackModalPlan, setFeedbackModalPlan] = useState(null);
  const [capacityOverrides, setCapacityOverrides] = useState({}); // Regional director's capacity adjustments
  const [revenueStats, setRevenueStats] = useState(null);

  // Load regional revenue stats
  useEffect(() => {
    const loadRevenue = async () => {
      try {
        const res = await fetch(`/api/v1/backoffice/ap/revenue/regional?regionCode=${(region || 'AA').toUpperCase()}`);
        if (res.ok) {
          const data = await res.json();
          setRevenueStats(data);
        }
      } catch (err) {
        console.error('Failed to load revenue stats:', err);
      }
    };
    loadRevenue();
  }, [region]);

  // ✅ Fetch plans for this region from backend on component mount
  useEffect(() => {
    const loadRegionalPlans = async () => {
      setPlansLoading(true);
      try {
        const { default: planService } = await import('../../services/planService.js');
        const plans = await planService.getPlansForRegion(region);
        console.log(`✅ Loaded ${plans.length} plans for region ${region}`);
        setRegionalPlans(plans);
      } catch (error) {
        console.error('❌ Failed to load regional plans:', error);
        setRegionalPlans([]);
      } finally {
        setPlansLoading(false);
      }
    };

    if (region) {
      loadRegionalPlans();
    }
  }, [region]);

  const allPlans = regionalPlans; // ✅ Use backend-fetched regional plans instead of state.plans

  // ✅ PERSIST ALL PLAN STATUSES - Don't remove plans from visibility
  // Plans awaiting regional director feedback (not yet sent to tax centers)
  const awaitingDistribution = allPlans.filter(p => 
    p.status === 'AWAITING_REGIONAL_FEEDBACK' && !p.tcDistributions?.[region]
  );
  
  // ✅ Plans sent to tax centers - STILL visible, waiting for tax center feedback
  // Only applies to plans in pre-approval feedback phase (AWAITING_REGIONAL_FEEDBACK or SENT_TO_TAX_CENTERS)
  const waitingTaxCenterFeedback = allPlans.filter(p => {
    if (['APPROVED_TO_REGIONS', 'FINALIZED', 'FEEDBACK_COLLECTED', 'SUBMITTED_TO_SENIOR_MGMT', 'SENIOR_MGMT_APPROVED'].includes(p.status)) return false;
    const isDistributed = p.tcDistributions?.[region];
    const isPostDistribution = ['AWAITING_REGIONAL_FEEDBACK', 'SENT_TO_TAX_CENTERS'].includes(p.status);
    if (!isDistributed || !isPostDistribution) return false;

    // Check if all TCs for this region have submitted feedback
    const taxCenters = getTaxCentersForRegion(region);
    const tcFeedback = p.taxCenterFeedback?.[region] || {};
    const allSubmitted = taxCenters.every(tc => tcFeedback[tc.id]);
    
    // Also, if the region has already submitted regional feedback, it's not waiting for TC feedback anymore
    const regionSubmitted = p.regionalFeedback?.[region];

    return !allSubmitted && !regionSubmitted;
  });
  
  // Plans where all tax centers have submitted feedback (and Regional Director hasn't submitted yet)
  const submitted = allPlans.filter(p => {
    if (['APPROVED_TO_REGIONS', 'FINALIZED', 'FEEDBACK_COLLECTED', 'SUBMITTED_TO_SENIOR_MGMT', 'SENIOR_MGMT_APPROVED'].includes(p.status)) return false;
    const isDistributed = p.tcDistributions?.[region];
    const isPostDistribution = ['AWAITING_REGIONAL_FEEDBACK', 'SENT_TO_TAX_CENTERS'].includes(p.status);
    if (!isDistributed || !isPostDistribution) return false;

    const taxCenters = getTaxCentersForRegion(region);
    const tcFeedback = p.taxCenterFeedback?.[region] || {};
    const allSubmitted = taxCenters.every(tc => tcFeedback[tc.id]);
    
    // If all TCs submitted but region hasn't submitted yet, it's ready for Regional Director
    return allSubmitted && !p.regionalFeedback?.[region];
  });
  
  // NEW: Plans approved by Senior Mgmt - ready for Regional deployment
  const approvedToRegions = allPlans.filter(p => 
    p.status === 'APPROVED_TO_REGIONS' && !p.regionalDeployments?.[region]
  );
  
  // Plans in any post-feedback or final state visible to this region
  const finalizedPlans = allPlans.filter(p =>
    ['FEEDBACK_COLLECTED', 'AMENDMENT_REQUIRED', 'SUBMITTED_TO_SENIOR_MGMT', 'SENIOR_MGMT_APPROVED', 'SENIOR_MGMT_REJECTED', 'APPROVED_TO_REGIONS', 'FINALIZED'].includes(p.status)
  );

  // Debug: Log all plans and their statuses
  useEffect(() => {
    console.log('📊 REGIONAL DASHBOARD DEBUG:');
    console.log('Region:', region);
    console.log('Total plans loaded:', allPlans.length);
    console.log('Plans by status:', {
      awaitingDistribution: awaitingDistribution.length,
      waitingTaxCenterFeedback: waitingTaxCenterFeedback.length,
      submitted: submitted.length,
      approvedToRegions: approvedToRegions.length,
      finalizedPlans: finalizedPlans.length,
    });
    allPlans.forEach(p => {
      console.log(`Plan: ${p.name || p.planName} (ID: ${p.id}) - Status: ${p.status} - Region allocation: ${p.distribution?.[region] ? JSON.stringify(p.distribution[region]) : p.regionAllocatedCases ? JSON.stringify(p.regionAllocatedCases) : 'NONE'}`);
    });
  }, [allPlans, region, awaitingDistribution.length, waitingTaxCenterFeedback.length, submitted.length, approvedToRegions.length, finalizedPlans.length]);
  // Cases for this region
  const regionCases = selectors.getCasesForRegion(region);

  const regionDist = feedbackModal?.distribution?.[region] || {};
  const regionTotal = Object.values(regionDist).reduce((s, v) => s + v, 0);

  const openFeedback = (plan) => {
    setFeedbackModal(plan);
    setFeedbackText('');
    setDistributed(false);
    setAggregateView(false); // Reset view mode when opening feedback
    setEditMode(false); // Reset edit mode
    setEditedAggregation({}); // Clear edits

    const alreadyDistributed = !!(plan.tcDistributions?.[region]);
    const tcFeedback = plan.taxCenterFeedback?.[region] || {};
    const hasTCFeedback = Object.keys(tcFeedback).length > 0;

    if (hasTCFeedback) {
      const summaryLines = Object.entries(tcFeedback).map(([tcId, fb]) => {
        const tc = getTaxCentersForRegion(region).find(t => t.id === tcId);
        return `${tc?.name || tcId}: "${fb.feedback}"`;
      });
      setFeedbackText(`Consolidated Tax Center Feedback:\n${summaryLines.join('\n')}`);
    }

    const regionDist = plan.distribution?.[region] || {};
    const taxCenters = getTaxCentersForRegion(region);
    const autoAllocations = {};

    if (alreadyDistributed) {
      taxCenters.forEach(tc => {
        const existing = plan.tcDistributions[region].allocations?.[tc.id];
        if (existing) {
          const tcAdjusted = tcFeedback[tc.id]?.adjustedAllocation;
          autoAllocations[tc.id] = tcAdjusted ? { ...tcAdjusted } : { ...existing };
        } else {
          autoAllocations[tc.id] = {};
          AUDIT_TYPES.forEach(a => { autoAllocations[tc.id][a.id] = 0; });
        }
      });
    } else if (hasTCFeedback) {
      taxCenters.forEach(tc => {
        const tcFeedbackData = tcFeedback[tc.id];
        if (tcFeedbackData?.adjustedAllocation) {
          autoAllocations[tc.id] = { ...tcFeedbackData.adjustedAllocation };
        } else {
          autoAllocations[tc.id] = {};
          AUDIT_TYPES.forEach(a => { autoAllocations[tc.id][a.id] = 0; });
        }
      });
    } else {
      taxCenters.forEach((tc, index) => {
        autoAllocations[tc.id] = {};
        AUDIT_TYPES.forEach(auditType => {
          const totalForType = regionDist[auditType.id] || 0;
          const perTC = Math.floor(totalForType / taxCenters.length);
          const remainder = totalForType % taxCenters.length;
          autoAllocations[tc.id][auditType.id] = perTC + (index < remainder ? 1 : 0);
        });
      });
    }

    setTcAllocations(autoAllocations);
    setStep(alreadyDistributed ? 4 : 1);
  };

  const allColsMatch = () => {
    return AUDIT_TYPES.every(a => {
      const tcTotal = getTaxCentersForRegion(region).reduce((sum, tc) => sum + (tcAllocations[tc.id]?.[a.id] || 0), 0);
      return tcTotal === (regionDist[a.id] || 0);
    });
  };

  // ✅ NEW: Edit Mode Handlers for TC Capacity Table
  const handleEnterEditMode = () => {
    // Copy current aggregation to editable state
    const copy = {};
    AUDIT_TYPES.forEach(a => {
      const target = regionDist[a.id] || 0;
      if (target > 0) {
        copy[a.id] = {
          target: target,
          aggregated: calculateRegionalAggregate()[a.id] || 0,
          edited: false
        };
      }
    });
    setEditedAggregation(copy);
    setEditMode(true);
    console.log('✅ Edit mode entered for TC Capacity');
  };

  const handleEditProposedAmount = (auditTypeId, newValue) => {
    const parsed = parseInt(newValue) || 0;
    setEditedAggregation(prev => ({
      ...prev,
      [auditTypeId]: {
        ...prev[auditTypeId],
        aggregated: parsed,
        edited: true
      }
    }));
  };

  const handleExitEditMode = () => {
    setEditMode(false);
    setEditedAggregation({});
    console.log('✅ Edit mode cancelled');
  };

  const getDisplayedAggregation = () => {
    if (!editMode || Object.keys(editedAggregation).length === 0) {
      return calculateRegionalAggregate();
    }
    // Return edited values, falling back to calculated
    const result = {};
    AUDIT_TYPES.forEach(a => {
      result[a.id] = editedAggregation[a.id]?.aggregated ?? calculateRegionalAggregate()[a.id] ?? 0;
    });
    return result;
  };

  // NEW: Calculate regional aggregate from tax center allocations
  const calculateRegionalAggregate = () => {
    const aggregate = {};
    AUDIT_TYPES.forEach(auditType => {
      const total = getTaxCentersForRegion(region).reduce((sum, tc) => {
        return sum + (tcAllocations[tc.id]?.[auditType.id] || 0);
      }, 0);
      aggregate[auditType.id] = total;
    });
    return aggregate;
  };

  const allTCsSubmitted = () => {
    if (!feedbackModal) return false;
    const taxCenters = getTaxCentersForRegion(region);
    const tcFeedback = feedbackModal.taxCenterFeedback?.[region] || {};
    return taxCenters.every(tc => tcFeedback[tc.id]);
  };

  const doDistributeToTC = async () => {
    setDistributing(true);
    try {
      await actions.distributeToTaxCenters(feedbackModal.id, region, tcAllocations, user.id);
      setDistributed(true);
      setStep(4);
      // Refresh plans to show updated state
      try {
        const { default: planService } = await import('../../services/planService.js');
        const updatedPlans = await planService.getPlansForRegion(region);
        setRegionalPlans(updatedPlans);
      } catch (refreshErr) {
        console.warn('⚠️ Could not refresh plans:', refreshErr);
      }
    } catch (error) {
      console.error('❌ Failed to distribute to tax centers:', error);
      alert('❌ Failed to distribute to tax centers:\n\n' + (error.message || 'Unknown error'));
    } finally {
      setDistributing(false);
    }
  };

  const doSubmit = async () => {
    if (!allColsMatch()) {
      alert('❌ Validation Failed!\n\nThe tax center allocations do not match the regional targets.\n\nPlease go back to Step 2 and ensure all columns add up correctly.');
      return;
    }
    if (!feedbackText.trim()) {
      alert('❌ Feedback Required!\n\nPlease provide your regional feedback comments before submitting.');
      return;
    }
    setLoading(true);
    try {
      await actions.submitRegionalFeedback(feedbackModal.id, region, feedbackText, tcAllocations, user.id);
      setFeedbackModal(null);
      // Refresh plans to show updated state
      try {
        const { default: planService } = await import('../../services/planService.js');
        const updatedPlans = await planService.getPlansForRegion(region);
        setRegionalPlans(updatedPlans);
      } catch (refreshErr) {
        console.warn('⚠️ Could not refresh plans:', refreshErr);
      }
    } catch (error) {
      console.error('❌ Failed to submit regional feedback:', error);
      alert('❌ Failed to submit feedback:\n\n' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Cases for the case viewer modal
  const visibleCases = regionCases.filter(c => {
    if (casePlanFilter && c.planId !== casePlanFilter) return false;
    if (caseSearch) {
      const q = caseSearch.toLowerCase();
      return c.taxpayerName?.toLowerCase().includes(q) || c.tin?.toLowerCase().includes(q);
    }
    return true;
  });

  const riskColor = { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'blue' };
  const caseCols = [
    { key: 'tin', label: 'TIN', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'taxpayerName', label: 'Taxpayer', render: (v, row) => (
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{v}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{row.sector}</p>
      </div>
    )},
    { key: 'auditType', label: 'Audit Type', render: v => {
      const at = AUDIT_TYPES.find(a => a.id === v);
      return <Badge color={at?.color || 'gray'}>{at?.shortName || v}</Badge>;
    }},
    { key: 'riskLevel', label: 'Risk', render: v => <Badge color={riskColor[v] || 'gray'} dot>{v}</Badge> },
    { key: 'taxCenter', label: 'Tax Center', render: v => {
      const tc = getTaxCentersForRegion(region).find(t => t.id === v);
      return <span className="text-xs text-gray-600 dark:text-slate-400">{tc?.shortName || v}</span>;
    }},
    { key: 'status', label: 'Status', render: v => {
      const s = CASE_STATUS[v];
      return s ? <Badge color={s.color} dot>{s.label}</Badge> : <Badge>{v}</Badge>;
    }},
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard 
          label="Awaiting Your Feedback" 
          value={awaitingDistribution.length} 
          icon={Clock} 
          color="yellow"
          sub={awaitingDistribution.length > 0 ? 'Action required' : 'All done'}
          onClick={() => {
            setFilteredPlansView('awaiting');
          }}
        />
        <StatCard 
          label="Waiting TC Feedback" 
          value={waitingTaxCenterFeedback.length} 
          icon={Clock} 
          color="orange"
          sub={waitingTaxCenterFeedback.length > 0 ? 'Pending from tax centers' : 'None'}
          onClick={() => {
            setFilteredPlansView('waiting-tc');
          }}
        />
        <StatCard 
          label="Ready to Deploy" 
          value={approvedToRegions.length} 
          icon={Send} 
          color="purple"
          sub={approvedToRegions.length > 0 ? 'Deploy to tax centers' : 'No pending deployments'}
          onClick={() => {
            setFilteredPlansView('approved');
          }}
        />
        <StatCard 
          label="Region Cases" 
          value={regionCases.length} 
          icon={Package} 
          color="blue"
          sub={regionCases.length > 0 ? 'Click below to view' : 'Deployed on finalization'}
          onClick={() => {
            if (regionCases.length > 0) {
              setCasePlanFilter(null);
            }
          }}
        />
      </div>

      {/* Regional Revenue by Audit Type */}
      {revenueStats && revenueStats.regionBreakdown && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">💰 Regional Revenue by Audit Type ({formatRevenue(revenueStats.totalRevenue)} ETB)</h3>
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(revenueStats.regionBreakdown.find(r => r.regionCode === (region || '').toUpperCase())?.revenueByAuditType || {
              DESK_AUDIT: 0, ISSUE_AUDIT: 0, JOINT_AUDIT: 0, COMPREHENSIVE_AUDIT: 0, TRANSFER_PRICING: 0
            }).map(([type, rev]) => (
              <div key={type} className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formatRevenue(rev)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Loading state */}
      {plansLoading && (
        <Alert type="info" title="Loading plans...">
          Fetching plans for {region.replace(/_/g, ' ').toUpperCase()} region from backend.
        </Alert>
      )}

      {/* Debug: Show if no plans loaded */}
      {!plansLoading && allPlans.length === 0 && (
        <Alert type="warning" title="No plans for this region">
          No plans have been sent to your region yet. Contact your director for plan assignments.
        </Alert>
      )}

      {/* ✅ NEW: Plan List with Category Tabs - Only one category shown at a time */}
      {!plansLoading && allPlans.length > 0 && (
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Plans by Category</h3>
            
            {/* Category Tabs/Buttons - Enterprise style */}
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setFilteredPlansView('awaiting')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  filteredPlansView === 'awaiting'
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Timer size={14} strokeWidth={2} />
                <span>Awaiting Feedback</span>
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${filteredPlansView === 'awaiting' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'}`}>{awaitingDistribution.length}</span>
              </button>
              <button
                onClick={() => setFilteredPlansView('waiting-tc')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  filteredPlansView === 'waiting-tc'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Truck size={14} strokeWidth={2} />
                <span>Waiting TC</span>
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${filteredPlansView === 'waiting-tc' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'}`}>{waitingTaxCenterFeedback.length}</span>
              </button>
              <button
                onClick={() => setFilteredPlansView('approved')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  filteredPlansView === 'approved'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Rocket size={14} strokeWidth={2} />
                <span>Ready to Deploy</span>
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${filteredPlansView === 'approved' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'}`}>{approvedToRegions.length}</span>
              </button>
              <button
                onClick={() => setFilteredPlansView('submitted')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  filteredPlansView === 'submitted'
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <ClipboardCheck size={14} strokeWidth={2} />
                <span>Submitted</span>
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${filteredPlansView === 'submitted' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'}`}>{submitted.length}</span>
              </button>
              <button
                onClick={() => setFilteredPlansView('finalized')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  filteredPlansView === 'finalized'
                    ? 'bg-gray-600 text-white shadow-sm shadow-gray-600/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <FileCheck size={14} strokeWidth={2} />
                <span>Finalized</span>
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${filteredPlansView === 'finalized' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'}`}>{finalizedPlans.length}</span>
              </button>
            </div>
          </div>

          {/* Table - Only shows selected category */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan Name</th>
                  <th className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                  <th className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Allocated Cases</th>
                  <th className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {(() => {
                  const plansToShow = filteredPlansView === 'awaiting' ? awaitingDistribution :
                                      filteredPlansView === 'waiting-tc' ? waitingTaxCenterFeedback :
                                      filteredPlansView === 'approved' ? approvedToRegions :
                                      filteredPlansView === 'submitted' ? submitted :
                                      filteredPlansView === 'finalized' ? finalizedPlans :
                                      awaitingDistribution;
                  
                  if (plansToShow.length === 0) {
                    return (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-slate-400">
                          <p className="text-sm">No plans in this category</p>
                        </td>
                      </tr>
                    );
                  }

                  return plansToShow.map(plan => {
                    const dist = plan.distribution?.[region] || plan.regionAllocatedCases || {};
                    const total = Object.values(dist).reduce((s, v) => s + v, 0);
                    const statusConfig = {
                      'AWAITING_REGIONAL_FEEDBACK': { color: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800', icon: Timer, label: 'Awaiting Feedback' },
                      'SENT_TO_TAX_CENTERS': { color: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800', icon: Truck, label: 'Sent to TCs' },
                      'FEEDBACK_COLLECTED': { color: 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800', icon: ClipboardCheck, label: 'Feedback Collected' },
                      'SUBMITTED_TO_SENIOR_MGMT': { color: 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800', icon: ArrowUpCircle, label: 'To Senior Mgmt' },
                      'SENIOR_MGMT_APPROVED': { color: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800', icon: Shield, label: 'Approved' },
                      'APPROVED_TO_REGIONS': { color: 'bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800', icon: Rocket, label: 'Ready to Deploy' },
                      'FINALIZED': { color: 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600', icon: CheckCircle, label: 'Finalized' },
                    };
                    
                    return (
                      <tr key={plan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{plan.name || plan.planName}</p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 font-mono">{plan.id?.slice(0, 8)}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                          FY {plan.year || plan.planYear || 'N/A'}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{total.toLocaleString()}</span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          {(() => {
                            const sc = statusConfig[plan.status];
                            if (!sc) return <span className="text-xs text-gray-500">{plan.status}</span>;
                            const Icon = sc.icon;
                            return (
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${sc.color}`}>
                                <Icon size={12} strokeWidth={2.5} />
                                {sc.label}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <Button 
                              size="xs" 
                              variant="ghost" 
                              icon={Eye}
                              onClick={() => {
                                setViewPlan(plan);
                                setViewTab('distribution');
                              }}
                            >
                              View
                            </Button>
                            
                            {/* Show "Deploy to Tax Centers" for Ready to Deploy plans */}
                            {filteredPlansView === 'approved' && (
                              <Button 
                                size="xs" 
                                variant="primary" 
                                icon={Rocket}
                                onClick={() => {
                                  setDistributionModalPlan(plan);
                                  setTcAllocations({});
                                  setDistributionModalOpen(true);
                                }}
                              >
                                Deploy to Tax Centers
                              </Button>
                            )}

                            {/* Show "Distribute to Tax Centers" only for Awaiting Feedback plans */}
                            {filteredPlansView === 'awaiting' && !plan.tcDistributions?.[region] && (
                              <Button 
                                size="xs" 
                                variant="ghost" 
                                icon={Send}
                                onClick={() => {
                                  setDistributionModalPlan(plan);
                                  setTcAllocations({});
                                  setDistributionModalOpen(true);
                                }}
                              >
                                Distribute
                              </Button>
                            )}

                            {/* Show "Submit Feedback" for plans with at least one TC feedback that haven't been submitted yet */}
                            {(filteredPlansView === 'waiting-tc' || filteredPlansView === 'submitted') && Object.keys(plan.taxCenterFeedback?.[region] || {}).length > 0 && !plan.regionalFeedback?.[region] && !plan.regionalFeedbackSubmitted && (
                              <Button 
                                size="xs" 
                                variant="ghost" 
                                icon={Send}
                                onClick={() => {
                                  setFeedbackModalPlan(plan);
                                  
                                  const taxCenters = getTaxCentersForRegion(region);
                                  const tcFeedback = plan.taxCenterFeedback?.[region] || {};
                                  const autoAllocations = {};
                                  const rDist = plan.distribution?.[region] || plan.regionAllocatedCases || {};
                                  
                                  taxCenters.forEach(tc => {
                                    if (tcFeedback[tc.id]?.adjustedAllocation) {
                                      autoAllocations[tc.id] = { ...tcFeedback[tc.id].adjustedAllocation };
                                    }
                                  });
                                  
                                  const missingTCs = taxCenters.filter(tc => !tcFeedback[tc.id]);
                                  if (missingTCs.length > 0) {
                                    missingTCs.forEach(tc => autoAllocations[tc.id] = {});
                                    AUDIT_TYPES.forEach(auditType => {
                                      const totalTarget = rDist[auditType.id] || 0;
                                      let submittedTotal = 0;
                                      taxCenters.forEach(tc => {
                                        if (tcFeedback[tc.id]?.adjustedAllocation) {
                                          submittedTotal += (tcFeedback[tc.id].adjustedAllocation[auditType.id] || 0);
                                        }
                                      });
                                      let remaining = Math.max(0, totalTarget - submittedTotal);
                                      const perMissing = Math.floor(remaining / missingTCs.length);
                                      const remainder = remaining % missingTCs.length;
                                      missingTCs.forEach((tc, index) => {
                                        autoAllocations[tc.id][auditType.id] = perMissing + (index < remainder ? 1 : 0);
                                      });
                                    });
                                  }
                                  
                                  setTcAllocations(autoAllocations);
                                  setFeedbackText('');
                                  setFeedbackSubmissionModalOpen(true);
                                }}
                              >
                                Submit
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Remove all old card-based sections - using new tabbed view instead */}

      {/* ── POST-FEEDBACK PLANS (finalized / in senior review / etc.) ── */}
      {finalizedPlans.length > 0 && (
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Plans — Post Feedback</h3>
                <p className="text-xs text-gray-500 mt-0.5">Plans past the regional feedback stage. View plan details and status.</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {finalizedPlans.map(plan => {
              const planCases = regionCases.filter(c => c.planId === plan.id);
              const pendingCases = planCases.filter(c => c.status === 'PENDING').length;
              const activeCases = planCases.filter(c => ['ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length;
              const doneCases = planCases.filter(c => ['COMPLETED', 'CLOSED'].includes(c.status)).length;
              const dist = plan.distribution?.[region] || {};
              const planTotal = Object.values(dist).reduce((s, v) => s + v, 0);

              return (
                <div key={plan.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{plan.planName}</p>
                        <PlanStatusBadge status={plan.status} />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400">FY {plan.planYear} · {planTotal.toLocaleString()} cases allocated to your region</p>

                      {/* Case stats (only when plan is FINALIZED and cases exist) */}
                      {plan.status === 'FINALIZED' && planCases.length > 0 && (
                        <div className="flex gap-4 mt-2">
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            <span className="font-semibold text-gray-700 dark:text-slate-200">{planCases.length}</span> total cases
                          </span>
                          {pendingCases > 0 && (
                            <span className="text-xs text-amber-600 font-medium">
                              ⏳ {pendingCases} pending assignment
                            </span>
                          )}
                          {activeCases > 0 && (
                            <span className="text-xs text-blue-600 font-medium">
                              ▶ {activeCases} in progress
                            </span>
                          )}
                          {doneCases > 0 && (
                            <span className="text-xs text-green-600 font-medium">
                              ✓ {doneCases} completed
                            </span>
                          )}
                        </div>
                      )}

                      {plan.status !== 'FINALIZED' && (
                        <p className="text-xs text-indigo-600 mt-1 italic">
                          {plan.status === 'FEEDBACK_COLLECTED' && 'Feedback collected — Director is preparing amendment'}
                          {plan.status === 'AMENDMENT_REQUIRED' && 'Amendment requested — planning team is revising'}
                          {plan.status === 'SUBMITTED_TO_SENIOR_MGMT' && 'Pending Senior Management approval'}
                          {plan.status === 'SENIOR_MGMT_APPROVED' && 'Senior Management approved — awaiting Director deployment'}
                          {plan.status === 'SENIOR_MGMT_REJECTED' && 'Rejected by Senior Management — Director is reviewing'}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="xs" variant="ghost" icon={Eye}
                        onClick={() => { setViewPlan(plan); setViewTab('distribution'); }}>
                        View
                      </Button>
                      {/* Remove View Cases button - Regional Directors don't view cases directly */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {awaitingDistribution.length === 0 && submitted.length === 0 && finalizedPlans.length === 0 && (
        <Card>
          <Empty icon={MapPin} title="No plans to action" description="You'll be notified when the director sends a plan for regional feedback." />
        </Card>
      )}

      {/* ── CASE VIEWER MODAL ── */}
      <Modal
        open={casePlanFilter !== null || (casePlanFilter === null && regionCases.length > 0 && false)}
        onClose={() => setCasePlanFilter(null)}
        title={casePlanFilter
          ? `Cases — ${allPlans.find(p => p.id === casePlanFilter)?.name || casePlanFilter}`
          : `All Cases — ${region.replace(/_/g, ' ').toUpperCase()} Region`}
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                icon={Search}
                placeholder="Search by taxpayer name or TIN..."
                value={caseSearch}
                onChange={e => setCaseSearch(e.target.value)}
              />
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">{visibleCases.length} cases</span>
          </div>

          {/* Summary by tax center */}
          {visibleCases.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {getTaxCentersForRegion(region).map(tc => {
                const tcCases = visibleCases.filter(c => c.taxCenter === tc.id);
                const pending = tcCases.filter(c => c.status === 'PENDING').length;
                return (
                  <div key={tc.id} className="bg-gray-50 rounded-lg p-3 text-center dark:bg-slate-700">
                    <p className="text-xs font-semibold text-gray-600 dark:text-slate-400">{tc.shortName}</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{tcCases.length}</p>
                    {pending > 0 && <p className="text-xs text-amber-600">{pending} pending</p>}
                  </div>
                );
              })}
            </div>
          )}

          {visibleCases.length === 0
            ? <Empty icon={Package} title="No cases found" description="No cases match your search." />
            : <Table columns={caseCols} rows={visibleCases} />
          }
        </div>
      </Modal>

      {/* Feedback modal */}
      <Modal
        open={!!feedbackModal}
        onClose={() => setFeedbackModal(null)}
        title={
          step === 1 ? '📊 Step 1: Review Regional Allocation' :
          step === 2 ? '📤 Step 2: Distribute to Tax Centers' :
          step === 3 ? '✓ Step 3: Send to Tax Centers' :
          step === 4 ? '📋 Step 4: Review Tax Center Feedback' :
          '✍️ Step 5: Confirm & Submit Regional Feedback'
        }
        size="xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-gray-400 dark:text-gray-500">Step {step} of 5</span>
            <div className="flex gap-2">
              {step > 1 && step !== 4 && <Button variant="secondary" onClick={() => setStep(s => s - 1)}>← Back</Button>}
              {step === 1 && <Button variant="secondary" onClick={() => setFeedbackModal(null)}>Cancel</Button>}
              {step < 3 && <Button onClick={() => setStep(s => s + 1)}>Next →</Button>}
              {step === 3 && (
                <Button variant="primary" icon={Send} loading={distributing} onClick={doDistributeToTC}>
                  Send to Tax Centers
                </Button>
              )}
              {step === 4 && (
                <Button
                  variant={allTCsSubmitted() ? 'primary' : 'warning'}
                  onClick={() => setStep(5)}
                  disabled={!allTCsSubmitted()}
                  title={!allTCsSubmitted() ? 'All tax centers must submit feedback first' : ''}
                >
                  {allTCsSubmitted() ? 'Proceed to Submit →' : 'Waiting for TC Feedback…'}
                </Button>
              )}
              {step === 5 && (
                <Button variant="success" icon={Send} loading={loading} onClick={doSubmit} disabled={!allColsMatch()}>
                  Submit Regional Feedback
                </Button>
              )}
            </div>
          </div>
        }
      >
        {feedbackModal && (
          <div className="space-y-4">
            {step === 1 && (
              <>
                <Alert type="info" title={`Your region (${region.replace(/_/g,' ').toUpperCase()}) allocation`}>
                  {regionTotal.toLocaleString()} total cases assigned to your region. Review the distribution by audit type, then proceed to allocate across tax centers.
                </Alert>
                <div className="bg-gray-50 rounded-xl p-4 dark:bg-slate-700">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Regional Allocation Breakdown</p>
                  <div className="grid grid-cols-3 gap-3">
                    {AUDIT_TYPES.map(a => (
                      <div key={a.id} className="bg-white rounded-lg border border-gray-200 px-3 py-2 text-center">
                        <p className="text-xs text-gray-500 dark:text-slate-400">{a.name}</p>
                        <p className="text-lg font-bold text-gray-800 tabular-nums">{regionDist[a.id] || 0}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {feedbackModal.directorComment && (
                  <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-800">
                    <strong>Director's note:</strong> {feedbackModal.directorComment}
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Alert type="info">
                  <strong>Step 2:</strong> Distribute all cases across your {getTaxCentersForRegion(region).length} tax centers. Each audit type column total must match the regional target shown.
                  <br/>
                  <strong style={{color: 'var(--color-warning, #ff9800)'}}>💡 TIP: Click "Regional Aggregate" tab to view editable summary and use [Edit] button to override values</strong>
                </Alert>
                
                {/* NEW: View Toggle */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 dark:bg-slate-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-200">📊 View Mode:</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setAggregateView(false);
                        console.log('✅ Switched to Tax Center Breakdown view');
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        !aggregateView 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-white text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      Tax Center Breakdown
                    </button>
                    <button
                      onClick={() => {
                        setAggregateView(true);
                        console.log('✅ Switched to Regional Aggregate view - [Edit] button available');
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        aggregateView 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-white text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      🎯 Regional Aggregate (EDITABLE)
                    </button>
                  </div>
                </div>

                {/* Tax Center Breakdown View */}
                {!aggregateView && (
                  <TaxCenterDistributionTable
                    regionId={region}
                    regionDist={regionDist}
                    tcAllocations={tcAllocations}
                    onChange={setTcAllocations}
                  />
                )}

                {/* Regional Aggregate View */}
                {aggregateView && (
                  <div className="space-y-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-slate-700 dark:border-blue-900">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">📊 Regional Aggregate Summary</p>
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            This is the consolidated view combining all {getTaxCentersForRegion(region).length} tax centers. 
                            You can <strong>override individual audit type allocations</strong> before submitting to the Director.
                          </p>
                        </div>
                        {!editMode && (
                          <Button 
                            size="sm" 
                            variant="primary"
                            onClick={handleEnterEditMode}
                            className="ml-4"
                          >
                            [Edit]
                          </Button>
                        )}
                        {editMode && (
                          <div className="flex gap-2 ml-4">
                            <Button 
                              size="sm" 
                              variant="success"
                              onClick={() => {
                                setEditMode(false);
                                console.log('✅ TC Capacity edits saved:', editedAggregation);
                              }}
                            >
                              [Save]
                            </Button>
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={handleExitEditMode}
                            >
                              [Cancel]
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden dark:bg-slate-800 dark:border-gray-700">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800 dark:bg-slate-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200">Audit Type</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Target</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">{editMode ? 'Override Value' : 'Aggregated'}</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-200">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {AUDIT_TYPES.map(a => {
                            const target = regionDist[a.id] || 0;
                            const displayedAgg = getDisplayedAggregation();
                            const allocated = displayedAgg[a.id] || 0;
                            const matches = target === allocated;
                            const isEdited = editedAggregation[a.id]?.edited;
                            return (
                              <tr key={a.id} className={`hover:bg-gray-50 dark:hover:bg-slate-700 ${isEdited ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-block w-3 h-3 rounded`} style={{backgroundColor: `var(--color-${a.color}, #999)`}}></span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{a.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-slate-300">{target}</td>
                                <td className="px-4 py-3 text-center">
                                  {editMode ? (
                                    <input
                                      type="number"
                                      value={allocated}
                                      onChange={(e) => handleEditProposedAmount(a.id, e.target.value)}
                                      className="w-20 px-2 py-1 rounded border border-blue-400 bg-blue-50 dark:bg-blue-900 text-center font-bold text-gray-900 dark:text-white"
                                    />
                                  ) : (
                                    <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">{allocated}</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {matches ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                                      <CheckCircle size={14} /> Match
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                                      <Clock size={14} /> {allocated > target ? '+' : ''}{allocated - target}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-gray-50 border-t-2 border-gray-200 dark:border-slate-600 dark:bg-slate-700">
                          <tr>
                            <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">TOTAL</td>
                            <td className="px-4 py-3 text-center text-sm font-bold text-gray-900 dark:text-white">{regionTotal}</td>
                            <td className="px-4 py-3 text-center text-sm font-bold text-gray-900 dark:text-white">
                              {Object.values(getDisplayedAggregation()).reduce((sum, v) => sum + v, 0)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {AUDIT_TYPES.every(a => {
                                const displayedAgg = getDisplayedAggregation();
                                const allocated = displayedAgg[a.id] || 0;
                                const target = regionDist[a.id] || 0;
                                return target === allocated;
                              }) ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                  <CheckCircle size={14} /> Ready
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                                  <Clock size={14} /> Adjust
                                </span>
                              )}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {!allColsMatch() && (
                      <Alert type="warning" title="Allocation mismatch">
                        Some audit types don't match the target. Switch to Tax Center Breakdown view to adjust allocations.
                      </Alert>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Alert type="success" title="Ready to send to tax centers">
                  Your allocation is complete. Review the breakdown below and click "Send to Tax Centers".
                </Alert>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 dark:bg-slate-700">
                  <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Tax Center Allocations</p>
                  {getTaxCentersForRegion(region).map(tc => {
                    const tcTotal = AUDIT_TYPES.reduce((sum, a) => sum + (tcAllocations[tc.id]?.[a.id] || 0), 0);
                    return (
                      <div key={tc.id} className="bg-white rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{tc.name}</p>
                          <p className="text-lg font-bold text-blue-600">{tcTotal} cases</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          {AUDIT_TYPES.map(a => (
                            <div key={a.id} className="flex justify-between">
                              <span className="text-gray-600 dark:text-slate-400">{a.name.split(' ')[0]}:</span>
                              <span className="font-semibold text-gray-800 dark:text-gray-200">{tcAllocations[tc.id]?.[a.id] || 0}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                {(() => {
                  const tcFeedback = feedbackModal?.taxCenterFeedback?.[region] || {};
                  const tcCount = Object.keys(tcFeedback).length;
                  const taxCenters = getTaxCentersForRegion(region);

                  if (tcCount === 0) {
                    return (
                      <Alert type="warning" title="Waiting for Tax Center feedback — action required">
                        You have distributed the plan to your {taxCenters.length} tax centers.
                        They must submit their feedback before you can submit regional feedback.
                        <br /><strong>You cannot proceed until all Tax Centers respond.</strong>
                      </Alert>
                    );
                  }

                  return (
                    <>
                      <Alert type="success" title={`${tcCount} tax center(s) provided feedback`}>
                        Review their adjusted allocations and feedback comments below.
                      </Alert>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3 dark:bg-slate-700">
                        <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Tax Center Feedback Summary</p>
                        {taxCenters.map(tc => {
                          const tcFeedbackData = tcFeedback[tc.id];
                          if (!tcFeedbackData) {
                            return (
                              <div key={tc.id} className="bg-white rounded-lg border border-gray-200 p-3">
                                <div className="flex items-center justify-between">
                                  <p className="font-semibold text-gray-700 dark:text-slate-200">{tc.name}</p>
                                  <Badge color="gray">No feedback yet</Badge>
                                </div>
                              </div>
                            );
                          }
                          const originalAlloc = tcAllocations[tc.id] || {};
                          const adjustedAlloc = tcFeedbackData.adjustedAllocation || {};
                          const hasChanges = AUDIT_TYPES.some(a =>
                            (originalAlloc[a.id] || 0) !== (adjustedAlloc[a.id] || 0)
                          );
                          return (
                            <div key={tc.id} className="bg-white rounded-lg border border-gray-200 p-3">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{tc.name}</p>
                                {hasChanges ? <Badge color="yellow">Adjusted</Badge> : <Badge color="green">Accepted</Badge>}
                              </div>
                              {tcFeedbackData.feedback && (
                                <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-blue-900 italic">
                                  <strong>Comment:</strong> {tcFeedbackData.feedback}
                                </div>
                              )}
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                {AUDIT_TYPES.map(a => {
                                  const adjusted = adjustedAlloc[a.id] || 0;
                                  const hasChange = (originalAlloc[a.id] || 0) !== adjusted;
                                  return (
                                    <div key={a.id} className="flex justify-between items-center">
                                      <span className="text-gray-600 dark:text-slate-400">{a.name.split(' ')[0]}:</span>
                                      <span className={`font-semibold ${hasChange ? 'text-orange-600' : 'text-gray-800'}`}>
                                        {adjusted}{hasChange && <span className="ml-1 text-xs">*</span>}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-900">
                        <strong>Note:</strong> Tax center adjustments have been automatically applied to your allocations.
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                {!allColsMatch() && (
                  <Alert type="error" title="Allocation incomplete">Please ensure all audit type column totals match the regional targets before submitting.</Alert>
                )}
                <Alert type="info" title="Final step: Your regional feedback">
                  All allocations have been sent to your tax centers. Now provide your regional feedback for the audit director.
                </Alert>
                <Textarea
                  label="Regional Feedback / Comments *"
                  placeholder="Describe your region's capacity, concerns, or special considerations..."
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                />
                <div className="bg-gray-50 rounded-xl p-4 dark:bg-slate-700">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Summary</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Total cases allocated: <strong className="text-blue-700">{regionTotal.toLocaleString()}</strong></p>
                  <p className="text-sm text-gray-600 mt-1">Tax centers: <strong>{getTaxCentersForRegion(region).length}</strong></p>
                  <p className="text-sm text-gray-600 mt-1">Allocations sent: <strong>✓ Yes</strong></p>
                  <p className={`text-sm mt-1 font-medium ${allColsMatch() ? 'text-green-600' : 'text-red-600'}`}>
                    {allColsMatch() ? '✓ All column totals validated' : '✗ Column totals do not match targets'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* View plan modal */}
      {viewPlan && (
        <Modal open={!!viewPlan} onClose={() => setViewPlan(null)} title={viewPlan.name || viewPlan.planName} size="xl">
          <div className="space-y-4">
            <Tabs
              tabs={[{ id: 'distribution', label: 'Full Distribution' }, { id: 'timeline', label: 'Timeline' }]}
              active={viewTab} onChange={setViewTab}
            />
            {viewTab === 'distribution' && (
              <div>
                <Alert type="info" className="mb-4">
                  Showing allocation for <strong>{region.replace(/_/g, ' ').toUpperCase()}</strong> region only
                </Alert>
                <DistributionTable
                  distribution={{ 
                    [region]: viewPlan.distribution?.[region] || viewPlan.regionAllocatedCases || {} 
                  }}
                  regions={[REGIONS.find(r => r.id === region)].filter(Boolean)}
                />
              </div>
            )}
            {viewTab === 'timeline' && <PlanTimeline plan={viewPlan} />}
          </div>
        </Modal>
      )}

      {/* Tax Center Feedback Review Modal */}
      {tcFeedbackReviewModal && (
        <Modal
          open={!!tcFeedbackReviewModal}
          onClose={() => setTcFeedbackReviewModal(null)}
          title="Tax Center Feedback Review"
          size="xl"
        >
          <div className="space-y-4">
            {(() => {
              const tcFeedback = tcFeedbackReviewModal.taxCenterFeedback?.[region] || {};
              const tcCount = Object.keys(tcFeedback).length;
              const taxCenters = getTaxCentersForRegion(region);

              if (tcCount === 0) {
                return (
                  <Alert type="info" title="No feedback submitted yet">
                    None of your tax centers have submitted feedback for this plan yet.
                  </Alert>
                );
              }

              return (
                <>
                  <Alert type="success" title={`${tcCount} of ${taxCenters.length} tax center(s) submitted feedback`}>
                    Review their adjusted allocations and comments below.
                  </Alert>
                  <div className="space-y-3">
                    {taxCenters.map(tc => {
                      const tcFeedbackData = tcFeedback[tc.id];
                      if (!tcFeedbackData) {
                        return (
                          <div key={tc.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 dark:bg-slate-700">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-700 dark:text-slate-200">{tc.name}</p>
                              <Badge color="gray">Pending</Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">No feedback submitted yet</p>
                          </div>
                        );
                      }
                      const adjustedAlloc = tcFeedbackData.adjustedAllocation || {};
                      const totalCases = AUDIT_TYPES.reduce((sum, a) => sum + (adjustedAlloc[a.id] || 0), 0);
                      return (
                        <div key={tc.id} className="bg-white rounded-lg border-2 border-green-200 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{tc.name}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">
                                Submitted {new Date(tcFeedbackData.submittedAt).toLocaleDateString()} at {new Date(tcFeedbackData.submittedAt).toLocaleTimeString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge color="green" dot>Submitted</Badge>
                              <p className="text-lg font-bold text-blue-600 mt-1">{totalCases} cases</p>
                            </div>
                          </div>
                          {tcFeedbackData.feedback && (
                            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-xs font-semibold text-blue-900 mb-1">Feedback Comment:</p>
                              <p className="text-sm text-blue-900 italic">"{tcFeedbackData.feedback}"</p>
                            </div>
                          )}
                          <div className="bg-gray-50 rounded-lg p-3 dark:bg-slate-700">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Adjusted Allocation by Audit Type:</p>
                            <div className="grid grid-cols-3 gap-3">
                              {AUDIT_TYPES.map(a => (
                                <div key={a.id} className="bg-white rounded border border-gray-200 px-3 py-2 text-center">
                                  <p className="text-xs text-gray-600 dark:text-slate-400">{a.name}</p>
                                  <p className="text-lg font-bold text-gray-900 dark:text-white">{adjustedAlloc[a.id] || 0}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        </Modal>
      )}

      {/* NEW MODAL: DISTRIBUTION WORKFLOW */}
      <DistributionModal
        open={distributionModalOpen}
        onClose={() => setDistributionModalOpen(false)}
        plan={distributionModalPlan}
        region={region}
        tcAllocations={tcAllocations}
        onTcAllocationsChange={setTcAllocations}
        onDistribute={async () => {
          setDistributing(true);
          try {
            // Call backend API to save distribution
            const { default: planService } = await import('../../services/planService.js');
            await planService.sendDistributionToTaxCenters(
              distributionModalPlan.id,
              region,
              tcAllocations,
              user.id
            );
            console.log('✅ Distribution sent to tax centers');
            setDistributing(false);
            setDistributionModalOpen(false);
            // Refresh plans
            const updatedPlans = await planService.getPlansForRegion(region);
            setRegionalPlans(updatedPlans);
          } catch (error) {
            console.error('❌ Failed to send distribution:', error);
            setDistributing(false);
          }
        }}
        loading={distributing}
      />

      {/* NEW MODAL: FEEDBACK SUBMISSION WORKFLOW */}
      <FeedbackSubmissionModal
        open={feedbackSubmissionModalOpen}
        onClose={() => setFeedbackSubmissionModalOpen(false)}
        plan={feedbackModalPlan}
        region={region}
        tcAllocations={tcAllocations}
        capacityOverrides={capacityOverrides}
        feedbackText={feedbackText}
        onFeedbackTextChange={setFeedbackText}
        onSubmit={async (overrides) => {
          setLoading(true);
          try {
            // Call backend API to submit feedback with capacity overrides
            const { default: planService } = await import('../../services/planService.js');
            await planService.submitRegionalFeedback(
              feedbackModalPlan.id,
              region,
              feedbackText,
              tcAllocations,
              overrides, // Pass capacity overrides
              user.id
            );
            console.log('✅ Regional feedback submitted with overrides:', overrides);
            setLoading(false);
            setFeedbackSubmissionModalOpen(false);
            setFeedbackText('');
            setCapacityOverrides({}); // Reset overrides
            // Refresh plans
            const updatedPlans = await planService.getPlansForRegion(region);
            setRegionalPlans(updatedPlans);
          } catch (error) {
            console.error('❌ Failed to submit feedback:', error);
            setLoading(false);
            alert('❌ Failed to submit feedback:\n\n' + (error.message || 'Unknown error'));
          }
        }}
        loading={loading}
      />
    </div>
  );
}
