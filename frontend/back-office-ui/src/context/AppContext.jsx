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

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { plans: [], cases: [], users: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const SEED_VERSION = 'v5-auditors-added';
        const seeded = storage.get(STORE_KEYS.SEEDED);
        if (seeded !== SEED_VERSION) {
          storage.set(STORE_KEYS.USERS, SEED_USERS);
          storage.set(STORE_KEYS.PLANS, SEED_PLANS);
          storage.set(STORE_KEYS.CASES, []);
          storage.set(STORE_KEYS.SEEDED, SEED_VERSION);
        }

        const { default: planService } = await import('../features/ap/services/planService.js');
        let plansFromBackend = [];
        try {
          plansFromBackend = await planService.getPlans();
          console.log('✅ Loaded plans from backend:', plansFromBackend.length);
        } catch (error) {
          console.error('⚠️ Failed to fetch plans from backend, using local data:', error);
          plansFromBackend = storage.get(STORE_KEYS.PLANS, SEED_PLANS);
        }

        dispatch({
          type: 'LOAD',
          payload: {
            users: storage.get(STORE_KEYS.USERS, SEED_USERS),
            plans: plansFromBackend,
            cases: storage.get(STORE_KEYS.CASES, []),
          },
        });
      } catch (error) {
        console.error('Error initializing data:', error);
        dispatch({
          type: 'LOAD',
          payload: { users: SEED_USERS, plans: SEED_PLANS, cases: [] },
        });
      }
      setReady(true);
    };

    initializeData();
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

  /** Helper: reload all plans from backend and update local state */
  const reloadPlans = async () => {
    const { default: planService } = await import('../features/ap/services/planService.js');
    try {
      const allPlans = await planService.getPlans();
      dispatch({ type: 'LOAD', payload: { ...state, plans: allPlans } });
      return allPlans;
    } catch (error) {
      console.warn('⚠️ Failed to reload plans:', error);
      return null;
    }
  };

  const actions = {
    // ── Plan creation ──────────────────────────────────────────────────────
    createPlan: async (data) => {
      try {
        const { default: planService } = await import('../features/ap/services/planService.js');
        const createdPlan = await planService.createPlan(data, data.createdBy);
        createdPlan.distribution = data.distribution;

        try {
          const allPlans = await planService.getPlans();
          allPlans.forEach(plan => {
            if (plan.id === createdPlan.id) {
              plan.distribution = data.distribution;
            }
          });
          dispatch({ type: 'LOAD', payload: { ...state, plans: allPlans } });
        } catch (error) {
          const plan = {
            id: createdPlan.id,
            ...data,
            status: createdPlan.status || 'DRAFT',
            createdAt: createdPlan.createdAt || new Date().toISOString(),
            distribution: data.distribution,
          };
          dispatch({ type: 'CREATE_PLAN', payload: plan });
        }

        return createdPlan;
      } catch (error) {
        console.error("Error creating plan:", error);
        throw error;
      }
    },

    updatePlanDraft: (planId, updates) => {
      const plan = getPlan(planId);
      if (plan) dispatch({ type: 'UPDATE_PLAN', payload: { ...plan, ...updates } });
    },

    // Planning Team amends plan allocations and resubmits to Director
    amendPlan: async (planId, actorId, updates) => {
      try {
        // Convert frontend distribution format to backend plannedChanges format
        const plannedChanges = {};
        if (updates.distribution) {
          Object.entries(updates.distribution).forEach(([regionId, auditTypes]) => {
            const regionCodeMap = { 'addis_ababa': 'AA', 'amhara': 'BA', 'oromia': 'BB', 'dire_dawa': 'AB', 'snnpr': 'CA', 'somali': 'SO' };
            const code = regionCodeMap[regionId] || regionId;
            plannedChanges[code] = {};
            if (auditTypes && typeof auditTypes === 'object') {
              Object.entries(auditTypes).forEach(([auditType, count]) => {
                plannedChanges[code][auditType] = parseInt(count) || 0;
              });
            }
          });
        }

        // The /amend endpoint saves changes AND transitions to SUBMITTED_TO_DIRECTOR
        const amendResponse = await fetch(`/api/v1/backoffice/ap/plans/${planId}/amend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Actor-Id': actorId || 'planning-team' },
          body: JSON.stringify({
            amendmentRound: 1,
            plannedChanges,
            planningTeamComments: updates.amendmentComment || 'Plan amended by Planning Team'
          })
        });

        if (!amendResponse.ok) {
          const errorText = await amendResponse.text();
          throw new Error(`Amend API error: ${amendResponse.status} - ${errorText}`);
        }

        console.log('✅ Plan amended and resubmitted to Director:', planId);
        await reloadPlans();
        return await amendResponse.json();
      } catch (error) {
        console.error('❌ Failed to amend plan:', error);
        throw error;
      }
    },

    // ── Planning Team → Director ───────────────────────────────────────────
    submitToDirector: async (planId, actorId) => {
      try {
        const { default: planService } = await import('../features/ap/services/planService.js');
        const updatedPlan = await planService.submitToDirector(planId, actorId);

        try {
          const allPlans = await planService.getPlans();
          dispatch({ type: 'LOAD', payload: { ...state, plans: allPlans } });
        } catch (error) {
          const plan = getPlan(planId);
          if (plan) {
            dispatch({ type: 'UPDATE_PLAN', payload: { ...plan, status: updatedPlan.status || 'SUBMITTED_TO_DIRECTOR' } });
          }
        }

        return updatedPlan;
      } catch (error) {
        console.error("Error submitting plan to Director:", error);
        throw error;
      }
    },

    // ── Director actions ───────────────────────────────────────────────────
    approvePlan: async (planId, directorId, comment) => {
      try {
        const response = await fetch(`/api/v1/backoffice/ap/plans/${planId}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Actor-Id': directorId || 'director' },
          body: JSON.stringify({ reason: comment || '' })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Plan approved:', planId);
        await reloadPlans();
        return result;
      } catch (error) {
        console.error('❌ Failed to approve plan:', error);
        throw error;
      }
    },

    sendToRegions: async (planId, directorId, deploymentNote) => {
      try {
        const response = await fetch(`/api/v1/backoffice/ap/plans/${planId}/send-to-regions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Actor-Id': directorId || 'director' },
          body: JSON.stringify({ deploymentNote: deploymentNote || '' })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Plan sent to regions:', planId);
        await reloadPlans();
        return result;
      } catch (error) {
        console.error('❌ Failed to send plan to regions:', error);
        throw error;
      }
    },

    // ✅ FIXED: Director sends back for amendment — calls backend API
    sendAmendmentToPlanningTeam: async (planId, actorId, comment) => {
      try {
        const response = await fetch(`/api/v1/backoffice/ap/plans/${planId}/request-amendment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Actor-Id': actorId || 'director' },
          body: JSON.stringify({ feedback: comment || 'Amendment requested' })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Amendment requested:', planId);
        await reloadPlans();
        return result;
      } catch (error) {
        console.error('❌ Failed to request amendment:', error);
        throw error;
      }
    },

    requestRevision: async (planId, actorId, comment) => {
      try {
        const response = await fetch(`/api/v1/backoffice/ap/plans/${planId}/request-amendment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Actor-Id': actorId || 'director' },
          body: JSON.stringify({ feedback: comment || 'Revision requested' })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Revision requested:', planId);
        await reloadPlans();
        return result;
      } catch (error) {
        console.error('❌ Failed to request revision:', error);
        throw error;
      }
    },

    // ✅ FIXED: Director submits to Senior Management — calls backend API
    submitToSeniorMgmt: async (planId, actorId) => {
      try {
        const response = await fetch(`/api/v1/backoffice/ap/plans/${planId}/submit-to-management`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Actor-Id': actorId || 'director' },
          body: JSON.stringify({ directorComment: 'Submitted for final approval' })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Submitted to Senior Management:', planId);
        await reloadPlans();
        return result;
      } catch (error) {
        console.error('❌ Failed to submit to Senior Management:', error);
        throw error;
      }
    },

    // ✅ FIXED: Director distributes approved plan to regions — calls backend API
    sendApprovedToRegions: async (planId, actorId) => {
      try {
        const response = await fetch(`/api/v1/backoffice/ap/plans/${planId}/distribute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Actor-Id': actorId || 'director' }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Approved plan distributed to regions:', planId);
        await reloadPlans();
        return result;
      } catch (error) {
        console.error('❌ Failed to distribute approved plan:', error);
        throw error;
      }
    },

    // ── Regional actions ───────────────────────────────────────────────────
    distributeToTaxCenters: async (planId, regionId, tcAllocations, actorId) => {
      try {
        console.log('📤 Distributing plan to tax centers...');

        // ✅ Map frontend IDs to backend codes
        const regionIdToCode = { 'addis_ababa': 'AA', 'amhara': 'BA', 'oromia': 'BB', 'dire_dawa': 'AB', 'snnpr': 'CA', 'somali': 'SO' };
        const tcIdToBackendCode = {
          'addis_ababa-tc1': 'AA-TC1', 'addis_ababa-tc2': 'AA-TC2', 'addis_ababa-tc3': 'AA-TC3',
          'amhara-tc1': 'BA-TC1', 'amhara-tc2': 'BA-TC2', 'amhara-tc3': 'BA-TC3',
          'oromia-tc1': 'BB-TC1', 'oromia-tc2': 'BB-TC2', 'oromia-tc3': 'BB-TC3',
          'dire_dawa-tc1': 'AB-TC1', 'dire_dawa-tc2': 'AB-TC2', 'dire_dawa-tc3': 'AB-TC3',
          'snnpr-tc1': 'CA-TC1', 'snnpr-tc2': 'CA-TC2', 'snnpr-tc3': 'CA-TC3',
          'somali-tc1': 'SO-TC1', 'somali-tc2': 'SO-TC2', 'somali-tc3': 'SO-TC3',
        };
        const backendRegionCode = regionIdToCode[regionId] || regionId;

        // Transform tcAllocations to use backend TC codes
        const backendTcAllocations = {};
        Object.entries(tcAllocations).forEach(([tcId, auditTypes]) => {
          const backendTcCode = tcIdToBackendCode[tcId] || tcId;
          backendTcAllocations[backendTcCode] = auditTypes;
        });

        const response = await fetch(
          `/api/v1/backoffice/ap/regional/plans/${planId}/distribute-to-tax-centers?regionCode=${backendRegionCode}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Actor-Id': actorId || 'regional-director' },
            body: JSON.stringify({ regionCode: backendRegionCode, taxCenterAllocations: backendTcAllocations })
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Plan distributed to tax centers:', result);

        const plan = getPlan(planId);
        if (plan) {
          const updated = {
            ...plan,
            regionalDeployments: {
              ...(plan.regionalDeployments || {}),
              [regionId]: { deployedAt: new Date().toISOString(), deployedBy: actorId, taxCenterCount: Object.keys(tcAllocations).length }
            },
            tcDistributions: {
              ...(plan.tcDistributions || {}),
              [regionId]: { allocations: tcAllocations, distributedAt: new Date().toISOString(), distributedBy: actorId, sentToBackend: true },
            },
          };
          dispatch({ type: 'UPDATE_PLAN', payload: timeline(updated, plan.status, actorId, `Distributed allocations to tax centers`) });
        }

        return result;
      } catch (error) {
        console.error('❌ Failed to distribute to tax centers:', error);
        throw error;
      }
    },

    // ✅ FIXED: Regional feedback submission — calls backend API
    submitRegionalFeedback: async (planId, regionId, feedbackText, taxCenterAllocations, actorId) => {
      try {
        console.log('📤 Submitting regional feedback to backend...');

        const plan = getPlan(planId);
        if (!plan) throw new Error('Plan not found');

        const regionDist = plan.distribution?.[regionId] || plan.regionAllocatedCases || {};

        const aggregatedFeedback = {};
        Object.keys(regionDist).forEach(auditType => {
          let totalRequested = 0;
          let totalCapacity = 0;
          const tcFeedbacks = [];

          if (taxCenterAllocations) {
            Object.entries(taxCenterAllocations).forEach(([tcId, allocation]) => {
              const requested = allocation[auditType] || 0;
              totalRequested += requested;
              totalCapacity += requested;
              tcFeedbacks.push({ taxCenterId: tcId, requested, accepted: requested });
            });
          }

          aggregatedFeedback[auditType] = {
            totalRequested, totalCapacity,
            totalGap: totalCapacity - totalRequested,
            gapPercentage: totalRequested > 0 ? ((totalCapacity - totalRequested) / totalRequested * 100) : 0,
            taxCenterFeedbacks: tcFeedbacks
          };
        });

        // ✅ Map frontend region ID to backend code
        const regionIdToCode = { 'addis_ababa': 'AA', 'amhara': 'BA', 'oromia': 'BB', 'dire_dawa': 'AB', 'snnpr': 'CA', 'somali': 'SO' };
        const backendRegionCode = regionIdToCode[regionId] || regionId;

        const response = await fetch(`/api/v1/backoffice/ap/regions/${backendRegionCode}/submit-feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Actor-Id': actorId || 'regional-director' },
          body: JSON.stringify({ planId, aggregatedFeedback, regionalAnalysis: feedbackText })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Regional feedback submitted:', result);

        const planUpdated = getPlan(planId);
        if (planUpdated) {
          const updated = {
            ...planUpdated,
            regionalFeedback: {
              ...(planUpdated.regionalFeedback || {}),
              [regionId]: { feedback: feedbackText, aggregatedFeedback, submittedAt: new Date().toISOString(), submittedBy: actorId, submitted: true }
            },
          };
          dispatch({ type: 'UPDATE_PLAN', payload: timeline(updated, planUpdated.status, actorId, `Submitted regional feedback`) });
        }

        return result;
      } catch (error) {
        console.error('❌ Failed to submit regional feedback:', error);
        throw error;
      }
    },

    overrideRegionalFeedback: (planId, regionId, overriddenAllocations, overrideComment, actorId) => {
      const plan = getPlan(planId);
      if (!plan) return;

      const updatedFeedback = {
        ...plan.regionalFeedback,
        [regionId]: { ...plan.regionalFeedback?.[regionId], taxCenterAllocations: overriddenAllocations, overriddenAt: new Date().toISOString(), overriddenBy: actorId, overrideComment, isOverridden: true }
      };

      dispatch({ type: 'UPDATE_PLAN', payload: { ...plan, regionalFeedback: updatedFeedback } });
    },

    // ✅ FIXED: Tax center feedback — calls backend API with correct parameters
    submitTaxCenterFeedback: async (planId, regionId, taxCenterId, feedbackText, adjustedAllocation, actorId) => {
      try {
        console.log('📤 Submitting tax center feedback...');
        console.log('   Plan:', planId, 'TC:', taxCenterId, 'Region:', regionId);

        const totalAdjusted = Object.values(adjustedAllocation).reduce((sum, val) => sum + (parseInt(val) || 0), 0);

        // Get the allocation ID for this tax center
        const plan = getPlan(planId);
        if (!plan) throw new Error('Plan not found');

        // Try to find allocation from local state or fetch from backend
        let allocationId = null;
        if (plan.allocations) {
          const allocation = plan.allocations.find(a => a.taxCenterCode === taxCenterId || a.taxCenterId === taxCenterId);
          if (allocation) allocationId = allocation.id;
        }

        if (allocationId) {
          // Use the workflow endpoint for per-audit-type feedback
          const response = await fetch(
            `/api/v1/backoffice/ap/plans/workflow/${planId}/allocations/${taxCenterId}/feedback`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', 'X-Actor-Id': actorId || taxCenterId },
              body: JSON.stringify({ adjustedCount: totalAdjusted, justification: feedbackText || 'Tax center feedback' })
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Backend error:', errorText);
            throw new Error(`API error: ${response.status} - ${errorText}`);
          }
        } else {
          // Use the tax-center acknowledge endpoint
          const tcAllocations = await this.getTaxCenterAllocationsForPlan(planId, taxCenterId);
          if (tcAllocations && tcAllocations.length > 0) {
            const allocation = tcAllocations[0];
            const response = await fetch(
              `/api/v1/backoffice/ap/tax-center/allocations/${allocation.allocationId || allocation.id}/acknowledge`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Actor-Id': actorId || taxCenterId },
                body: JSON.stringify({
                  taxCenterId,
                  feedback: feedbackText || '',
                  adjustedAllocations: adjustedAllocation,
                  totalAdjusted,
                  originalTotal: allocation.proposedCount || 0
                })
              }
            );

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`API error: ${response.status} - ${errorText}`);
            }
          }
        }

        console.log('✅ Tax center feedback submitted');

        // Update local state
        const planUpdated = getPlan(planId);
        if (planUpdated) {
          const mergedPlan = {
            ...planUpdated,
            taxCenterFeedback: {
              ...(planUpdated.taxCenterFeedback || {}),
              [regionId]: {
                ...(planUpdated.taxCenterFeedback?.[regionId] || {}),
                [taxCenterId]: { feedback: feedbackText, adjustedAllocation, submittedAt: new Date().toISOString(), submittedBy: actorId }
              }
            }
          };
          dispatch({ type: 'UPDATE_PLAN', payload: timeline(mergedPlan, planUpdated.status, actorId, `${taxCenterId} submitted feedback`) });
        }
      } catch (error) {
        console.error("❌ Failed to submit tax center feedback:", error);
        throw error;
      }
    },

    getTaxCenterAllocationsForPlan: async (planId, taxCenterId) => {
      try {
        const response = await fetch(`/api/v1/backoffice/ap/tax-center/allocations?taxCenterId=${taxCenterId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) return [];
        const result = await response.json();
        return result.data || [];
      } catch (error) {
        return [];
      }
    },

    // ── Senior Management ──────────────────────────────────────────────────
    // ✅ FIXED: Senior Management approves — calls backend API
    approveBySenior: async (planId, actorId, comment) => {
      try {
        const response = await fetch(`/api/v1/backoffice/ap/plans/${planId}/management-decision`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Actor-Id': actorId || 'management' },
          body: JSON.stringify({ decision: 'APPROVE', managementComment: comment || 'Approved by Senior Management' })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Senior Management approved:', planId);
        await reloadPlans();
        return result;
      } catch (error) {
        console.error('❌ Failed to approve by Senior Management:', error);
        throw error;
      }
    },

    // ✅ FIXED: Senior Management rejects — calls backend API
    rejectBySenior: async (planId, actorId, comment) => {
      try {
        const response = await fetch(`/api/v1/backoffice/ap/plans/${planId}/management-decision`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Actor-Id': actorId || 'management' },
          body: JSON.stringify({ decision: 'REJECT', managementComment: comment || 'Rejected by Senior Management' })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Senior Management rejected:', planId);
        await reloadPlans();
        return result;
      } catch (error) {
        console.error('❌ Failed to reject by Senior Management:', error);
        throw error;
      }
    },

    finalizePlan: async (planId, actorId) => {
      try {
        const response = await fetch(`/api/v1/backoffice/ap/plans/workflow/${planId}/finalize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Actor-Id': actorId || 'director' }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Plan finalized:', planId);
        await reloadPlans();
        return result;
      } catch (error) {
        console.error('❌ Failed to finalize plan:', error);
        throw error;
      }
    },

    // ── Case assignment ────────────────────────────────────────────────────
    assignCaseToTeamLeader: (caseId, teamLeaderId) => {
      const c = getCase(caseId);
      if (c) dispatch({ type: 'UPDATE_CASE', payload: { ...c, assignedTeamLeader: teamLeaderId, status: 'ASSIGNED', assignedAt: new Date().toISOString() } });
    },

    assignCasesToTeamLeader: (caseIds, teamLeaderId) => {
      caseIds.forEach(caseId => {
        const c = getCase(caseId);
        if (c) dispatch({ type: 'UPDATE_CASE', payload: { ...c, assignedTeamLeader: teamLeaderId, status: 'ASSIGNED', assignedAt: new Date().toISOString() } });
      });
    },

    assignCaseToAuditor: (caseId, auditorId) => {
      const c = getCase(caseId);
      if (c) dispatch({ type: 'UPDATE_CASE', payload: { ...c, assignedAuditor: auditorId, status: 'IN_PROGRESS', startDate: new Date().toISOString() } });
    },

    updateCaseStatus: (caseId, status, notes = '') => {
      const c = getCase(caseId);
      if (c) dispatch({ type: 'UPDATE_CASE', payload: { ...c, status, notes: notes || c.notes, ...(status === 'COMPLETED' ? { completedDate: new Date().toISOString() } : {}) } });
    },

    updateCasePriority: (caseId, priority) => {
      const c = getCase(caseId);
      if (c) dispatch({ type: 'UPDATE_CASE', payload: { ...c, priority } });
    },

    addManualCases: (cases) => {
      dispatch({ type: 'ADD_CASES', payload: cases });
    },

    markPlanAsAssigned: (planId, taxCenter) => {
      const plan = getPlan(planId);
      if (!plan) return;
      const assignments = plan.teamLeaderAssignments || {};
      assignments[taxCenter] = { assignedAt: new Date().toISOString(), status: 'ASSIGNED' };
      dispatch({ type: 'UPDATE_PLAN', payload: { ...plan, teamLeaderAssignments: assignments } });
    },

    loadPlansForRegion: async (regionCode) => {
      try {
        const response = await fetch(`/api/v1/backoffice/ap/regional/plans?regionCode=${regionCode}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'X-Actor-Id': regionCode || 'regional-director' }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log(`✅ Loaded regional plans for ${regionCode}:`, result.data.length);
        return result.data;
      } catch (error) {
        console.error('❌ Failed to load regional plans:', error);
        throw error;
      }
    },

    loadPendingDirectorPlans: async (directorId) => {
      try {
        const response = await fetch(`/api/v1/backoffice/ap/plans/pending-director-review`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'X-Actor-Id': directorId || 'director' }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn('⚠️ Failed to fetch pending director plans:', errorText);
          return [];
        }

        const result = await response.json();
        console.log('✅ Loaded pending director plans:', result.data?.length || 0);
        return result.data || [];
      } catch (error) {
        console.error('❌ Failed to load pending director plans:', error);
        return [];
      }
    },

    loadActivePlans: async (directorId) => {
      try {
        const response = await fetch(`/api/v1/backoffice/ap/plans/active-plans`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'X-Actor-Id': directorId || 'director' }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn('⚠️ Failed to fetch active plans:', errorText);
          return [];
        }

        const result = await response.json();
        console.log('✅ Loaded active plans from backend:', result.data?.length || 0);
        return result.data || [];
      } catch (error) {
        console.error('❌ Failed to load active plans:', error);
        return [];
      }
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

export { AppProvider };

export const useApp = () => useContext(AppContext);
