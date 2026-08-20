import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { auditConfig } from '../config/auditConfig';
import { ANNUAL_PLANNING_STAGES, STAGE_STATUS } from '../config/planningProcess';
import { useAppData } from './useAppData';
import {
  loadAssignmentsByUser,
  loadAuditors,
  loadTeamLeaders,
  loadAuditorsByTaxCenter,
} from '../utils/assignmentData';

function countSentAllocations(plans) {
  let sent = 0;
  let total = 0;
  plans.forEach((plan) => {
    if (plan.allocationStatus) {
      Object.values(plan.allocationStatus).forEach((status) => {
        total++;
        if (status.status === 'SENT') sent++;
      });
    }
  });
  return { sent, total };
}

function countFeedback(plans) {
  let received = 0;
  let expected = 0;
  plans.forEach((plan) => {
    if (plan.taxCenterAllocations) {
      Object.values(plan.taxCenterAllocations).forEach((regionTCs) => {
        expected += Object.keys(regionTCs).length;
      });
    }
    if (plan.taxCenterFeedback) {
      Object.values(plan.taxCenterFeedback).forEach((regionFeedback) => {
        Object.values(regionFeedback).forEach((fb) => {
          if (fb?.status === 'SUBMITTED' || fb?.status === 'submitted') {
            received++;
          }
        });
      });
    }
  });
  return { received, expected };
}

function computeActiveStage(plans) {
  if (plans.length === 0) return 0;

  const hasAllocation = plans.some(
    (p) => p.regionalAllocation || (p.regionalAllocations && p.regionalAllocations.length > 0)
  );
  if (!hasAllocation) return 0;

  const { sent, total } = countSentAllocations(plans);
  if (total === 0 || sent < total) return 2;

  const { received, expected } = countFeedback(plans);
  if (expected > 0 && received < expected) return 3;

  const finalized = plans.filter(
    (p) => p.status === 'APPROVED' || p.status === 'FINALIZED' || p.status === 'DIRECTOR_APPROVED'
  ).length;
  if (finalized < plans.length) return 4;

  return 5;
}

function resolveStageStatuses(activeIndex) {
  return ANNUAL_PLANNING_STAGES.map((_, index) => {
    if (index < activeIndex) return STAGE_STATUS.COMPLETE;
    if (index === activeIndex) return STAGE_STATUS.IN_PROGRESS;
    return STAGE_STATUS.PENDING;
  });
}

export function useSidebarStats() {
  const { data } = useAppData();

  return useMemo(() => {
    const cases = (data.cases || []).length + (data.auditCases || []).length;
    const plans = (data.plans || []).length;
    const assigned = (data.assignments || []).length;
    return { cases, plans, assigned };
  }, [data]);
}

export function useAuditTeamMetrics() {
  const { data, refresh } = useAppData();

  return useMemo(() => {
    const plans = data.plans || [];
    const regionCount = auditConfig.regions.length;

    const totalPlans = plans.length;
    const approvedPlans = plans.filter(
      (p) => p.status === 'APPROVED' || p.status === 'FINALIZED' || p.status === 'DIRECTOR_APPROVED'
    ).length;
    const submittedPlans = plans.filter((p) => p.status === 'SUBMITTED').length;

    const { sent, total: totalAllocations } = countSentAllocations(plans);
    const { received: feedbackReceived, expected: feedbackExpected } = countFeedback(plans);

    const completionRate = totalPlans > 0 ? Math.round((approvedPlans / totalPlans) * 100) : 0;
    const feedbackRate =
      feedbackExpected > 0 ? Math.round((feedbackReceived / feedbackExpected) * 100) : 0;

    const activeStageIndex = computeActiveStage(plans);
    const stageStatuses = resolveStageStatuses(activeStageIndex);

    const stages = ANNUAL_PLANNING_STAGES.map((stage, index) => ({
      ...stage,
      status: stageStatuses[index],
    }));

    const activeStage = ANNUAL_PLANNING_STAGES[activeStageIndex];

    return {
      summaryMetrics: [
        {
          id: 'sent-regions',
          title: 'Sent to regions',
          value: sent,
          subtitle: `of ${totalAllocations || regionCount * Math.max(totalPlans, 1)} total allocations distributed`,
          color: 'amber',
          progress: totalAllocations > 0 ? Math.round((sent / totalAllocations) * 100) : 0,
        },
        {
          id: 'feedback-received',
          title: 'Feedback received',
          value: feedbackReceived,
          subtitle: 'tax center capacity confirmations',
          color: 'blue',
          progress: feedbackExpected > 0 ? Math.round((feedbackReceived / feedbackExpected) * 100) : 0,
        },
        {
          id: 'completion-rate',
          title: 'Completion rate',
          value: `${completionRate}%`,
          subtitle: `${approvedPlans} of ${totalPlans} plans finalized`,
          color: 'teal',
          progress: completionRate,
        },
      ],
      bottomMetrics: [
        { id: 'submitted', label: 'Submitted plans', value: submittedPlans, color: 'blue' },
        { id: 'regions', label: 'Regions covered', value: regionCount, color: 'teal' },
        { id: 'feedback-rate', label: 'Avg. feedback rate', value: `${feedbackRate}%`, color: 'amber' },
      ],
      stages,
      activeStageTitle: activeStage?.title || 'Create plan',
      timelineTitle: 'Annual planning process',
      refresh,
    };
  }, [data, refresh]);
}

export function useAuditDirectorMetrics() {
  const { data } = useAppData();

  return useMemo(() => {
    const plans = data.plans || [];
    const plansToReview = plans.filter((p) => p.status === 'SUBMITTED').length;
    const feedbackSent = data.feedback?.length || 0;
    const underRevision = plans.filter((p) => p.status === 'REVISION_REQUESTED').length;
    const approvedPlans = plans.filter((p) => p.status === 'DIRECTOR_APPROVED').length;
    const finalizedPlans = plans.filter((p) => p.status === 'FINALIZED').length;
    const total = plans.length;
    const reviewProgress = total > 0 ? Math.round(((approvedPlans + finalizedPlans) / total) * 100) : 0;

    return {
      summaryMetrics: [
        {
          id: 'to-review',
          title: 'Plans to review',
          value: plansToReview,
          subtitle: 'awaiting director decision',
          color: 'amber',
          progress: total > 0 ? Math.round((plansToReview / total) * 100) : 0,
        },
        {
          id: 'feedback-sent',
          title: 'Feedback sent',
          value: feedbackSent,
          subtitle: 'regional feedback requests issued',
          color: 'blue',
          progress: Math.min(100, feedbackSent * 10),
        },
        {
          id: 'approved',
          title: 'Approval rate',
          value: `${reviewProgress}%`,
          subtitle: `${approvedPlans + finalizedPlans} of ${total} plans approved`,
          color: 'teal',
          progress: reviewProgress,
        },
      ],
      bottomMetrics: [
        { id: 'revision', label: 'Under revision', value: underRevision, color: 'amber' },
        { id: 'approved', label: 'Approved plans', value: approvedPlans, color: 'teal' },
        { id: 'finalized', label: 'Finalized plans', value: finalizedPlans, color: 'blue' },
      ],
      stages: null,
      activeStageTitle: '',
      timelineTitle: '',
    };
  }, [data]);
}

export function useRegionalDirectorMetrics() {
  const { data } = useAppData();

  return useMemo(() => {
    const plans = data.plans || [];
    let allocatedTaxCenters = 0;
    let feedbackProvided = 0;
    let sentAllocations = 0;
    let pendingFeedback = 0;

    plans.forEach((plan) => {
      if (plan.taxCenterAllocations) {
        Object.values(plan.taxCenterAllocations).forEach((regionTCs) => {
          allocatedTaxCenters += Object.keys(regionTCs).length;
        });
      }
      if (plan.taxCenterFeedback) {
        Object.values(plan.taxCenterFeedback).forEach((regionFeedback) => {
          Object.values(regionFeedback).forEach((fb) => {
            if (fb?.status === 'SUBMITTED' || fb?.status === 'submitted') {
              feedbackProvided++;
            } else {
              pendingFeedback++;
            }
          });
        });
      }
      if (plan.allocationStatus) {
        Object.values(plan.allocationStatus).forEach((s) => {
          if (s.status === 'SENT') sentAllocations++;
        });
      }
    });

    const feedbackRate =
      allocatedTaxCenters > 0 ? Math.round((feedbackProvided / allocatedTaxCenters) * 100) : 0;

    return {
      summaryMetrics: [
        {
          id: 'plans',
          title: 'Plans received',
          value: plans.length,
          subtitle: 'regional plans in workflow',
          color: 'blue',
          progress: Math.min(100, plans.length * 20),
        },
        {
          id: 'feedback',
          title: 'Feedback received',
          value: feedbackProvided,
          subtitle: 'tax center capacity confirmations',
          color: 'amber',
          progress: feedbackRate,
        },
        {
          id: 'sent',
          title: 'Allocations sent',
          value: sentAllocations,
          subtitle: `${allocatedTaxCenters} tax centers allocated`,
          color: 'teal',
          progress: allocatedTaxCenters > 0 ? Math.round((sentAllocations / allocatedTaxCenters) * 100) : 0,
        },
      ],
      bottomMetrics: [
        { id: 'centers', label: 'Tax centers', value: allocatedTaxCenters, color: 'blue' },
        { id: 'pending', label: 'Pending feedback', value: pendingFeedback, color: 'amber' },
        { id: 'rate', label: 'Feedback rate', value: `${feedbackRate}%`, color: 'teal' },
      ],
      stages: null,
      activeStageTitle: '',
      timelineTitle: '',
    };
  }, [data]);
}

export function useTaxCenterManagerMetrics() {
  const { data } = useAppData();

  return useMemo(() => {
    const plans = data.plans || [];
    const cases = data.auditCases || data.cases || [];
    const totalCases = cases.length;
    const inProgress = cases.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'in_progress').length;
    const closed = cases.filter((c) => c.status === 'CLOSED' || c.status === 'closed' || c.status === 'COMPLETED').length;
    const completionRate = totalCases > 0 ? Math.round((closed / totalCases) * 100) : 0;

    let feedbackSubmitted = 0;
    let pendingFeedback = 0;
    plans.forEach((plan) => {
      if (plan.taxCenterFeedback) {
        Object.values(plan.taxCenterFeedback).forEach((regionFeedback) => {
          Object.values(regionFeedback).forEach((fb) => {
            if (fb?.status === 'SUBMITTED' || fb?.status === 'submitted') {
              feedbackSubmitted++;
            } else {
              pendingFeedback++;
            }
          });
        });
      }
    });

    return {
      summaryMetrics: [
        {
          id: 'plans',
          title: 'Allocated plans',
          value: plans.length,
          subtitle: 'approved plans assigned to center',
          color: 'blue',
          progress: Math.min(100, plans.length * 25),
        },
        {
          id: 'cases',
          title: 'Cases assigned',
          value: totalCases,
          subtitle: `${inProgress} currently in progress`,
          color: 'amber',
          progress: totalCases > 0 ? Math.round((inProgress / totalCases) * 100) : 0,
        },
        {
          id: 'completion',
          title: 'Completion rate',
          value: `${completionRate}%`,
          subtitle: `${closed} of ${totalCases} cases completed`,
          color: 'teal',
          progress: completionRate,
        },
      ],
      bottomMetrics: [
        { id: 'feedback', label: 'Feedback submitted', value: feedbackSubmitted, color: 'blue' },
        { id: 'pending', label: 'Pending feedback', value: pendingFeedback, color: 'amber' },
        { id: 'closed', label: 'Cases closed', value: closed, color: 'teal' },
      ],
      stages: null,
      activeStageTitle: '',
      timelineTitle: '',
    };
  }, [data]);
}



/**
 * Team Leader Metrics — scoped to the logged-in user.
 * Counts only cases assigned TO this team leader and their team's work.
 */
export function useTeamLeaderMetrics() {
  const { data } = useAppData();
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();

  return useMemo(() => {
    // Get the current user's ID (from auth context)
    const userId = userInfo?.id || userInfo?.userId;

    // Load assignments that belong to THIS team leader only
    const allAssignments = data.assignments || [];
    const myAssignments = allAssignments.filter(
      (a) => a.currentOwner === userId && a.currentOwnerRole === 'TEAM_LEADER'
    );

    // Count cases assigned to my team leaders (by way of being assigned to me)
    const cases = data.auditCases || data.cases || [];

    // Get the case IDs that belong to my assignments
    const myCaseIds = new Set(myAssignments.map((a) => a.caseId));
    const myCases = cases.filter((c) => myCaseIds.has(c.id));

    // Load my auditors (team members under this team leader)
    const myAuditors = loadAuditors(userId);

    // Count auditor assignments that went out from me
    const auditorAssignments = allAssignments.filter(
      (a) => a.currentOwnerRole === 'AUDITOR' && myAuditors.some((aud) => aud.id === a.currentOwner)
    );

    const inProgress = myCases.filter(
      (c) => c.status === 'IN_PROGRESS' || c.status === 'in_progress'
    ).length;
    const closed = myCases.filter(
      (c) => c.status === 'CLOSED' || c.status === 'closed' || c.status === 'COMPLETED'
    ).length;

    const teamCapacity = Math.max(myAuditors.length * 5, 10);
    const casesAssignedToAuditors = auditorAssignments.length;
    const capacityUsed =
      teamCapacity > 0 ? Math.round((casesAssignedToAuditors / teamCapacity) * 100) : 0;
    const completionRate =
      myCases.length > 0 ? Math.round((closed / myCases.length) * 100) : 0;

    return {
      summaryMetrics: [
        {
          id: 'team',
          title: 'Team auditors',
          value: myAuditors.length,
          subtitle: 'active team members under you',
          color: 'blue',
          progress: Math.min(100, myAuditors.length * 20),
        },
        {
          id: 'assigned',
          title: 'Cases assigned to you',
          value: myAssignments.length,
          subtitle: `${inProgress} currently in progress`,
          color: 'amber',
          progress: capacityUsed,
        },
        {
          id: 'completion',
          title: 'Completion rate',
          value: `${completionRate}%`,
          subtitle: `${closed} of ${myCases.length} your cases closed`,
          color: 'teal',
          progress: completionRate,
        },
      ],
      bottomMetrics: [
        { id: 'progress', label: 'In progress', value: inProgress, color: 'amber' },
        { id: 'closed', label: 'Your cases closed', value: closed, color: 'teal' },
        { id: 'capacity', label: 'Team capacity used', value: `${capacityUsed}%`, color: 'blue' },
      ],
      stages: null,
      activeStageTitle: '',
      timelineTitle: '',
    };
  }, [data, userInfo]);
}

/**
 * Auditor Metrics — scoped to the logged-in user.
 * Counts only cases assigned TO this auditor specifically.
 */
export function useAuditorMetrics() {
  const { data } = useAppData();
  const { getUserInfo } = useAuth();
  const userInfo = getUserInfo();

  return useMemo(() => {
    const userId = userInfo?.id || userInfo?.userId;

    // Filter to ONLY this auditor's assignments
    const allAssignments = data.assignments || [];
    const myAssignments = allAssignments.filter(
      (a) => a.currentOwner === userId && a.currentOwnerRole === 'AUDITOR'
    );

    // Get the case details for my assignments only
    const cases = data.auditCases || data.cases || [];
    const myCaseIds = new Set(myAssignments.map((a) => a.caseId));
    const myCases = cases.filter((c) => myCaseIds.has(c.id));

    const inProgress = myCases.filter(
      (c) => c.status === 'IN_PROGRESS' || c.status === 'in_progress'
    ).length;
    const closed = myCases.filter(
      (c) => c.status === 'CLOSED' || c.status === 'closed' || c.status === 'COMPLETED'
    ).length;
    const pending = myAssignments.filter(
      (a) =>
        a.currentState === 'ASSIGNED_TO_AUDITOR'
    ).length;
    const completionRate = myCases.length > 0 ? Math.round((closed / myCases.length) * 100) : 0;

    return {
      summaryMetrics: [
        {
          id: 'assigned',
          title: 'Assigned to you',
          value: myAssignments.length,
          subtitle: 'total cases on your queue',
          color: 'blue',
          progress: Math.min(100, myAssignments.length * 10),
        },
        {
          id: 'progress',
          title: 'In progress',
          value: inProgress,
          subtitle: `${pending} awaiting your response`,
          color: 'amber',
          progress: myCases.length > 0 ? Math.round((inProgress / myCases.length) * 100) : 0,
        },
        {
          id: 'completion',
          title: 'Completion rate',
          value: `${completionRate}%`,
          subtitle: `${closed} of ${myCases.length} your cases completed`,
          color: 'teal',
          progress: completionRate,
        },
      ],
      bottomMetrics: [
        { id: 'pending', label: 'Awaiting response', value: pending, color: 'amber' },
        { id: 'closed', label: 'Your completed', value: closed, color: 'teal' },
        { id: 'rate', label: 'Your completion rate', value: `${completionRate}%`, color: 'blue' },
      ],
      stages: null,
      activeStageTitle: '',
      timelineTitle: '',
    };
  }, [data, userInfo]);
}

export function useSeniorManagementMetrics() {
  const { data } = useAppData();

  return useMemo(() => {
    const plans = data.plans || [];
    const pending = plans.filter((p) => p.status === 'SUBMITTED' || p.status === 'DIRECTOR_APPROVED').length;
    const approved = plans.filter((p) => p.status === 'APPROVED' || p.status === 'FINALIZED').length;
    const rejected = plans.filter((p) => p.status === 'REJECTED').length;
    const total = plans.length;
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

    return {
      summaryMetrics: [
        {
          id: 'pending',
          title: 'Pending approval',
          value: pending,
          subtitle: 'plans awaiting executive sign-off',
          color: 'amber',
          progress: total > 0 ? Math.round((pending / total) * 100) : 0,
        },
        {
          id: 'approved',
          title: 'Approved plans',
          value: approved,
          subtitle: 'executive approvals granted',
          color: 'teal',
          progress: approvalRate,
        },
        {
          id: 'rejected',
          title: 'Rejected plans',
          value: rejected,
          subtitle: 'plans returned for revision',
          color: 'blue',
          progress: total > 0 ? Math.round((rejected / total) * 100) : 0,
        },
      ],
      bottomMetrics: [
        { id: 'total', label: 'Total plans', value: total, color: 'blue' },
        { id: 'approved', label: 'Approved', value: approved, color: 'teal' },
        { id: 'rate', label: 'Approval rate', value: `${approvalRate}%`, color: 'amber' },
      ],
      stages: null,
      activeStageTitle: '',
      timelineTitle: '',
    };
  }, [data]);
}

const METRIC_HOOKS = {
  audit_team: useAuditTeamMetrics,
  audit_director: useAuditDirectorMetrics,
  regional_director: useRegionalDirectorMetrics,
  tax_center_manager: useTaxCenterManagerMetrics,

  team_leader: useTeamLeaderMetrics,
  auditor: useAuditorMetrics,
  senior_management: useSeniorManagementMetrics,
};

export function useRoleDashboardMetrics(role) {
  const hook = METRIC_HOOKS[role] || useAuditTeamMetrics;
  return hook();
}
