import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { storage, STORE_KEYS } from '../features/ap/services/storage.js';
import { SEED_USERS, SEED_PLANS, generateCases } from '../features/ap/data/seed.js';
import { REGIONS, getTaxCentersForRegion } from '../features/ap/data/constants.js';

const AppContext = createContext({ state: { plans: [], cases: [], users: [] }, actions: {}, selectors: {}, ready: false });

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'CREATE_PLAN':
      return { ...state, plans: [...state.plans, action.payload] };
    case 'UPDATE_PLAN':
      return { ...state, plans: state.plans.map(p => p.id === action.payload.id ? action.payload : p) };
    case 'ADD_CASES':
      return { ...state, cases: [...state.cases, ...action.payload] };
    case 'UPDATE_CASE':
      return { ...state, cases: state.cases.map(c => c.id === action.payload.id ? action.payload : c) };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { plans: [], cases: [], users: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const SEED_VERSION = 'v5-auditors-added'; // Change this to force re-seed
    const seeded = storage.get(STORE_KEYS.SEEDED);
    if (seeded !== SEED_VERSION) {
      storage.set(STORE_KEYS.USERS, SEED_USERS);
      storage.set(STORE_KEYS.PLANS, SEED_PLANS);
      storage.set(STORE_KEYS.CASES, []);
      storage.set(STORE_KEYS.SEEDED, SEED_VERSION);
    }
    dispatch({
      type: 'LOAD',
      payload: {
        users: storage.get(STORE_KEYS.USERS, SEED_USERS),
        plans: storage.get(STORE_KEYS.PLANS, SEED_PLANS),
        cases: storage.get(STORE_KEYS.CASES, []),
      },
    });
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    storage.set(STORE_KEYS.PLANS, state.plans);
    storage.set(STORE_KEYS.CASES, state.cases);
    storage.set(STORE_KEYS.USERS, state.users);
  }, [state, ready]);

  const timeline = (plan, status, actor, comment = '') => ({
    ...plan,
    status,
    timeline: [...(plan.timeline || []), { status, actor, comment, timestamp: new Date().toISOString() }],
  });

  const getPlan = (id) => state.plans.find(p => p.id === id);
  const getCase = (id) => state.cases.find(c => c.id === id);

  const actions = {
    // ── Plan creation ──────────────────────────────────────────────────────
    createPlan: async (data) => {
      try {
        const { default: planService } = await import('../features/ap/services/planService.js');
        // Call backend API
        const createdPlan = await planService.createPlan(data, data.createdBy);
        
        // Ensure plan meets UI expectations with local timeline logic
        const plan = {
          id: createdPlan.id,
          ...data,
          status: createdPlan.status || 'DRAFT',
          createdAt: createdPlan.createdAt || new Date().toISOString(),
          directorComment: '',
          revisions: [],
          regionalFeedback: {},
          seniorComment: '',
          amendmentComment: '',
          timeline: [{ status: createdPlan.status || 'DRAFT', actor: data.createdBy, comment: 'Plan created via Backend API', timestamp: new Date().toISOString() }],
        };
        dispatch({ type: 'CREATE_PLAN', payload: plan });
        return plan;
      } catch (error) {
        console.error("Error creating plan:", error);
        throw error;
      }
    },

    updatePlanDraft: (planId, updates) => {
      const plan = getPlan(planId);
      if (plan) dispatch({ type: 'UPDATE_PLAN', payload: { ...plan, ...updates } });
    },

    // ── Planning Team → Director ───────────────────────────────────────────
    submitToDirector: (planId, actorId) => {
      const plan = getPlan(planId);
      if (plan) dispatch({
        type: 'UPDATE_PLAN',
        payload: timeline(plan, 'SUBMITTED_TO_DIRECTOR', actorId, 'Submitted for director review'),
      });
    },

    // ── Director actions ───────────────────────────────────────────────────
    approvePlan: (planId, actorId, comment) => {
      const plan = getPlan(planId);
      if (plan) dispatch({
        type: 'UPDATE_PLAN',
        payload: timeline({ ...plan, directorComment: comment }, 'DIRECTOR_APPROVED', actorId, comment || 'Approved'),
      });
    },

    requestRevision: (planId, actorId, comment) => {
      const plan = getPlan(planId);
      if (!plan) return;
      const updated = {
        ...plan,
        directorComment: comment,
        revisions: [...(plan.revisions || []), { comment, timestamp: new Date().toISOString(), by: actorId }],
      };
      dispatch({ type: 'UPDATE_PLAN', payload: timeline(updated, 'REVISION_REQUESTED', actorId, comment) });
    },

    sendToRegions: (planId, actorId) => {
      const plan = getPlan(planId);
      if (plan) dispatch({
        type: 'UPDATE_PLAN',
        payload: timeline(plan, 'AWAITING_REGIONAL_FEEDBACK', actorId, 'Sent to all regions for feedback'),
      });
    },

    // Director: after all feedback collected, send back to planning team for amendment
    sendAmendmentToPlanningTeam: (planId, actorId, comment) => {
      const plan = getPlan(planId);
      if (!plan) return;
      const updated = {
        ...plan,
        amendmentComment: comment,
        revisions: [...(plan.revisions || []), { comment, timestamp: new Date().toISOString(), by: actorId, type: 'amendment' }],
      };
      dispatch({ type: 'UPDATE_PLAN', payload: timeline(updated, 'AMENDMENT_REQUIRED', actorId, comment || 'Feedback sent for amendment') });
    },

    // Director: submit amended plan directly to senior management (after amendment cycle)
    submitToSeniorMgmt: (planId, actorId) => {
      const plan = getPlan(planId);
      if (plan) dispatch({
        type: 'UPDATE_PLAN',
        payload: timeline(plan, 'SUBMITTED_TO_SENIOR_MGMT', actorId, 'Submitted for senior management approval'),
      });
    },

    // Director: send senior-management-approved plan to regions (NOT finalized yet!)
    sendApprovedToRegions: (planId, actorId) => {
      const plan = getPlan(planId);
      if (!plan) return;
      dispatch({
        type: 'UPDATE_PLAN',
        payload: timeline(plan, 'APPROVED_TO_REGIONS', actorId, 'Approved plan sent to all regions - awaiting regional deployment to tax centers'),
      });
    },

    // NEW: Regional Director deploys to their tax centers
    deployToTaxCenters: (planId, regionId, actorId) => {
      const plan = getPlan(planId);
      if (!plan) return;
      
      // Mark this region as deployed
      const deployments = plan.regionalDeployments || {};
      deployments[regionId] = {
        deployedAt: new Date().toISOString(),
        deployedBy: actorId,
        status: 'DEPLOYED'
      };
      
      // Check if all regions have deployed
      const allRegionsDeployed = REGIONS.every(r => deployments[r.id]);
      
      const newStatus = allRegionsDeployed ? 'FINALIZED' : 'APPROVED_TO_REGIONS';
      const msg = allRegionsDeployed 
        ? `All regions deployed - Plan finalized` 
        : `${regionId} deployed to tax centers`;
      
      const updated = {
        ...plan,
        regionalDeployments: deployments
      };
      
      dispatch({
        type: 'UPDATE_PLAN',
        payload: timeline(updated, newStatus, actorId, msg)
      });
      
      // If all regions deployed, generate cases
      if (allRegionsDeployed) {
        dispatch({ type: 'ADD_CASES', payload: generateCases(planId, plan.distribution, plan.regionalFeedback || {}) });
      }
    },

    // ── Regional actions ───────────────────────────────────────────────────

    // Step 1: Regional Director distributes to Tax Centers (persists allocations so TCs can see their plan)
    distributeToTaxCenters: (planId, regionId, tcAllocations, actorId) => {
      const plan = getPlan(planId);
      if (!plan) return;
      const updated = {
        ...plan,
        tcDistributions: {
          ...(plan.tcDistributions || {}),
          [regionId]: {
            allocations: tcAllocations,
            distributedAt: new Date().toISOString(),
            distributedBy: actorId,
          },
        },
      };
      dispatch({ type: 'UPDATE_PLAN', payload: timeline(updated, plan.status, actorId, `${regionId} distributed allocations to tax centers`) });
    },

    // Step 2: Regional Director submits consolidated feedback
    // 🎯 DEMO MODE: Auto-fills missing tax centers with defaults
    submitRegionalFeedback: (planId, regionId, feedbackText, taxCenterAllocations, actorId) => {
      const plan = getPlan(planId);
      if (!plan) return;

      // 🚀 DEMO MODE: Auto-fill missing tax centers with default allocations
      // If TC-1 submits feedback but TC-2 and TC-3 don't, we use their original allocation
      const taxCenters = getTaxCentersForRegion(regionId);
      const originalDistribution = plan.distribution?.[regionId] || {};
      
      // Build complete tax center allocations (user-submitted + auto-filled defaults)
      const completeTCAllocations = {};
      
      // Use user-provided allocations first, fall back to equal distribution
      taxCenters.forEach((tc, index) => {
        if (taxCenterAllocations && taxCenterAllocations[tc.id]) {
          // User provided allocation for this TC
          completeTCAllocations[tc.id] = taxCenterAllocations[tc.id];
        } else {
          // Auto-fill with default proportional allocation
          // Default: distribute remaining cases evenly among tax centers
          const defaultShare = {};
          Object.keys(originalDistribution).forEach(auditType => {
            const totalForType = originalDistribution[auditType] || 0;
            const perTC = Math.floor(totalForType / taxCenters.length);
            const remainder = totalForType % taxCenters.length;
            // Give remainder to first TCs
            defaultShare[auditType] = perTC + (index < remainder ? 1 : 0);
          });
          completeTCAllocations[tc.id] = defaultShare;
        }
      });

      const newFeedback = {
        ...plan.regionalFeedback,
        [regionId]: {
          feedback: feedbackText,
          taxCenterAllocations: completeTCAllocations,
          submittedAt: new Date().toISOString(),
          submittedBy: actorId,
          autoFilled: !taxCenterAllocations || Object.keys(taxCenterAllocations).length < taxCenters.length,
        },
      };
      
      // 🚀 DEMO MODE: One regional feedback auto-routes back to Director
      // Director will review and send to Planning Team for amendments
      // Also auto-fills other regions with default allocations
      const hasAtLeastOneFeedback = Object.keys(newFeedback).length > 0;
      
      if (hasAtLeastOneFeedback) {
        // Auto-fill missing regions with their default allocations
        const allRegions = REGIONS;
        allRegions.forEach(region => {
          if (!newFeedback[region.id] && plan.distribution?.[region.id]) {
            // This region hasn't submitted - auto-fill with defaults
            const regionTCs = getTaxCentersForRegion(region.id);
            const regionDist = plan.distribution[region.id];
            const autoTCAlloc = {};
            
            regionTCs.forEach((tc, idx) => {
              const tcShare = {};
              Object.keys(regionDist).forEach(auditType => {
                const total = regionDist[auditType] || 0;
                const perTC = Math.floor(total / regionTCs.length);
                const remainder = total % regionTCs.length;
                tcShare[auditType] = perTC + (idx < remainder ? 1 : 0);
              });
              autoTCAlloc[tc.id] = tcShare;
            });
            
            newFeedback[region.id] = {
              feedback: `Auto-generated: ${region.name} allocation maintained as planned.`,
              taxCenterAllocations: autoTCAlloc,
              submittedAt: new Date().toISOString(),
              submittedBy: 'system',
              autoFilled: true,
            };
          }
        });
      }
      
      // Route to FEEDBACK_COLLECTED (Director reviews) instead of directly to Planning Team
      const newStatus = hasAtLeastOneFeedback ? 'FEEDBACK_COLLECTED' : 'AWAITING_REGIONAL_FEEDBACK';
      const msg = hasAtLeastOneFeedback 
        ? `Regional feedback from ${regionId} received - All regions auto-filled, ready for Director review` 
        : `${regionId} submitted feedback`;
      
      // Update plan with feedback
      const updated = {
        ...plan,
        regionalFeedback: newFeedback,
        feedbackNote: `Regional feedback received from ${regionId}. Other regions auto-filled with default allocations.`,
        revisions: [
          ...(plan.revisions || []),
          {
            comment: `Regional feedback from ${regionId}, other regions auto-filled`,
            timestamp: new Date().toISOString(),
            by: actorId,
            type: 'feedback',
          }
        ],
      };
      
      dispatch({ type: 'UPDATE_PLAN', payload: timeline(updated, newStatus, actorId, msg) });
    },

    // NEW: Override regional feedback aggregation (Director can modify collected feedback before sending to amendment)
    overrideRegionalFeedback: (planId, regionId, overriddenAllocations, overrideComment, actorId) => {
      const plan = getPlan(planId);
      if (!plan) return;

      const updatedFeedback = {
        ...plan.regionalFeedback,
        [regionId]: {
          ...plan.regionalFeedback?.[regionId],
          taxCenterAllocations: overriddenAllocations,
          overriddenAt: new Date().toISOString(),
          overriddenBy: actorId,
          overrideComment: overrideComment,
          isOverridden: true,
        }
      };

      const updated = {
        ...plan,
        regionalFeedback: updatedFeedback,
        revisions: [
          ...(plan.revisions || []),
          {
            comment: `Director overrode ${regionId} feedback allocation: ${overrideComment}`,
            timestamp: new Date().toISOString(),
            by: actorId,
            type: 'regional_override',
          }
        ],
      };

      dispatch({ type: 'UPDATE_PLAN', payload: updated });
    },

    submitTaxCenterFeedback: async (planId, regionId, taxCenterId, feedbackText, adjustedAllocation, actorId) => {
      try {
        const plan = getPlan(planId);
        if (!plan) return;

        // Sum the adjusted allocations across all audit types
        const totalAdjusted = Object.values(adjustedAllocation).reduce((sum, val) => sum + (parseInt(val) || 0), 0);

        // Find the specific allocation ID for this tax center
        const allocation = (plan.allocations || []).find(a => a.taxCenterCode === taxCenterId);
        if (!allocation) {
           console.error("Allocation not found for tax center", taxCenterId);
           return;
        }

        const { default: planService } = await import('../features/ap/services/planService.js');
        const updatedPlan = await planService.submitTaxCenterFeedback(planId, allocation.id, {
          tcAdjustedCount: totalAdjusted,
          tcJustification: feedbackText
        }, actorId);

        // We can just replace the plan in our local state with the backend's updated version.
        // We will merge it with our local timeline/frontend specific fields so the UI doesn't break
        const mergedPlan = {
          ...plan,
          ...updatedPlan,
          // Retain legacy frontend structure for now to not break other views
          taxCenterFeedback: {
            ...(plan.taxCenterFeedback || {}),
            [regionId]: {
              ...(plan.taxCenterFeedback?.[regionId] || {}),
              [taxCenterId]: {
                feedback: feedbackText,
                adjustedAllocation,
                submittedAt: new Date().toISOString(),
                submittedBy: actorId,
              }
            }
          }
        };

        dispatch({ 
          type: 'UPDATE_PLAN', 
          payload: timeline(mergedPlan, plan.status, actorId, `${taxCenterId} submitted feedback`)
        });
      } catch (error) {
        console.error("Failed to submit feedback:", error);
      }
    },
    // ── Senior Management ──────────────────────────────────────────────────
    approveBySenior: (planId, actorId, comment) => {
      const plan = getPlan(planId);
      if (plan) dispatch({
        type: 'UPDATE_PLAN',
        payload: timeline({ ...plan, seniorComment: comment }, 'SENIOR_MGMT_APPROVED', actorId, comment || 'Approved'),
      });
    },

    rejectBySenior: (planId, actorId, comment) => {
      const plan = getPlan(planId);
      if (!plan) return;
      const updated = {
        ...plan,
        seniorComment: comment,
        revisions: [...(plan.revisions || []), { comment, timestamp: new Date().toISOString(), by: actorId, type: 'senior_rejection' }],
      };
      // Use distinct status so Director can distinguish Senior rejection from Director revision
      dispatch({ type: 'UPDATE_PLAN', payload: timeline(updated, 'SENIOR_MGMT_REJECTED', actorId, comment) });
    },

    // Legacy: finalize directly (kept for backward compat)
    finalizePlan: (planId, actorId) => {
      const plan = getPlan(planId);
      if (!plan) return;
      dispatch({ type: 'UPDATE_PLAN', payload: timeline(plan, 'FINALIZED', actorId, 'Plan finalized and cases deployed') });
      dispatch({ type: 'ADD_CASES', payload: generateCases(planId, plan.distribution, plan.regionalFeedback || {}) });
    },

    // ── Case assignment ────────────────────────────────────────────────────
    assignCaseToTeamLeader: (caseId, teamLeaderId) => {
      const c = getCase(caseId);
      if (c) dispatch({
        type: 'UPDATE_CASE',
        payload: { ...c, assignedTeamLeader: teamLeaderId, status: 'ASSIGNED', assignedAt: new Date().toISOString() },
      });
    },

    assignCasesToTeamLeader: (caseIds, teamLeaderId) => {
      caseIds.forEach(caseId => {
        const c = getCase(caseId);
        if (c) dispatch({
          type: 'UPDATE_CASE',
          payload: { ...c, assignedTeamLeader: teamLeaderId, status: 'ASSIGNED', assignedAt: new Date().toISOString() },
        });
      });
    },

    assignCaseToAuditor: (caseId, auditorId) => {
      const c = getCase(caseId);
      if (c) dispatch({
        type: 'UPDATE_CASE',
        payload: { ...c, assignedAuditor: auditorId, status: 'IN_PROGRESS', startDate: new Date().toISOString() },
      });
    },

    updateCaseStatus: (caseId, status, notes = '') => {
      const c = getCase(caseId);
      if (c) dispatch({ type: 'UPDATE_CASE', payload: {
        ...c, status, notes: notes || c.notes,
        ...(status === 'COMPLETED' ? { completedDate: new Date().toISOString() } : {}),
      }});
    },

    updateCasePriority: (caseId, priority) => {
      const c = getCase(caseId);
      if (c) dispatch({ type: 'UPDATE_CASE', payload: { ...c, priority } });
    },

    // NEW: Add manual cases (not linked to a plan)
    addManualCases: (cases) => {
      dispatch({ type: 'ADD_CASES', payload: cases });
    },

    // NEW: Mark plan as assigned (prevent duplicate TL assignment)
    markPlanAsAssigned: (planId, taxCenter) => {
      const plan = getPlan(planId);
      if (!plan) return;
      
      const assignments = plan.teamLeaderAssignments || {};
      assignments[taxCenter] = {
        assignedAt: new Date().toISOString(),
        status: 'ASSIGNED'
      };
      
      dispatch({
        type: 'UPDATE_PLAN',
        payload: {
          ...plan,
          teamLeaderAssignments: assignments
        }
      });
    },
  };

  const selectors = {
    getPlanById: (id) => state.plans.find(p => p.id === id),
    getCasesForPlan: (planId) => state.cases.filter(c => c.planId === planId),
    getCasesForRegion: (region) => state.cases.filter(c => c.region === region),
    getCasesForTaxCenter: (tc) => state.cases.filter(c => c.taxCenter === tc),
    getCasesForTeamLeader: (id) => state.cases.filter(c => c.assignedTeamLeader === id),
    getCasesForAuditor: (id) => state.cases.filter(c => c.assignedAuditor === id),
    getUserById: (id) => state.users.find(u => u.id === id),
    getUsersByRole: (role) => state.users.filter(u => u.role === role),
    getUsersByTaxCenterAndRole: (tc, role) => state.users.filter(u => u.taxCenter === tc && u.role === role),
    getPlanStats: () => ({
      total: state.plans.length,
      draft: state.plans.filter(p => p.status === 'DRAFT').length,
      pendingDirector: state.plans.filter(p => ['SUBMITTED_TO_DIRECTOR','SENIOR_MGMT_REJECTED'].includes(p.status)).length,
      active: state.plans.filter(p => ['DIRECTOR_APPROVED','AWAITING_REGIONAL_FEEDBACK','FEEDBACK_COLLECTED','AMENDMENT_REQUIRED'].includes(p.status)).length,
      pendingSenior: state.plans.filter(p => p.status === 'SUBMITTED_TO_SENIOR_MGMT').length,
      finalized: state.plans.filter(p => p.status === 'FINALIZED').length,
      amendmentRequired: state.plans.filter(p => p.status === 'AMENDMENT_REQUIRED').length,
      seniorRejected: state.plans.filter(p => p.status === 'SENIOR_MGMT_REJECTED').length,
    }),
  };

  return (
    <AppContext.Provider value={{ state, actions, selectors, ready }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
