/**
 * Plan Service
 * Handles all plan-related API calls and data management
 * Integrates with MOR Backend API for real-time plan data
 */

import { convertDistributionFromBackend } from '../data/constants.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1/backoffice';

class PlanService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Create a new annual audit plan via Spring Boot backend API
   * Transforms frontend distribution format to backend regional allocations format
   */
  async createPlan(planData, actorId) {
    try {
      console.log('🚀 Creating plan via Backend API:', planData.name);
      console.log('📦 Full plan data:', JSON.stringify(planData, null, 2));
      console.log('🔍 Distribution in planData:', planData.distribution);
      console.log('🔍 Distribution type:', typeof planData.distribution);
      console.log('🔍 Distribution keys:', Object.keys(planData.distribution || {}));
      
      // Map frontend region IDs to backend region codes
      // Frontend uses: addis_ababa, amhara, oromia, dire_dawa, snnpr, somali
      // Backend expects: AA, BA, BB, AB, CA, SO
      const regionIdToCode = {
        'addis_ababa': 'AA',
        'amhara': 'BA',
        'oromia': 'BB',
        'dire_dawa': 'AB',
        'snnpr': 'CA',
        'somali': 'SO',
      };
      
      // Transform frontend distribution format to backend regional allocations
      const regionalAllocations = [];
      if (planData.distribution) {
        Object.entries(planData.distribution).forEach(([regionId, auditTypes]) => {
          const counts = Object.values(auditTypes || {}).map(v => v || 0);
          const total = counts.reduce((sum, count) => sum + count, 0);
          console.log(`   Region ${regionId}: counts = [${counts.join(', ')}], total = ${total}`);
          if (total > 0) {
            const backendRegionCode = regionIdToCode[regionId];
            if (!backendRegionCode) {
              console.warn(`   ⚠️  Unknown region ID: ${regionId}, skipping`);
              return;
            }
            regionalAllocations.push({
              regionCode: backendRegionCode,
              proposedCount: total,
            });
          } else {
            console.warn(`   ⚠️  Region ${regionId} has total = 0, skipping`);
          }
        });
      } else {
        console.error('❌ NO DISTRIBUTION OBJECT IN PLAN DATA!');
      }
      
      console.log('📊 Regional allocations prepared:', JSON.stringify(regionalAllocations, null, 2));
      if (regionalAllocations.length === 0) {
        console.error('❌ WARNING: No regional allocations created! Plan will fail.');
      }
      
      // Build backend request format - matching CreatePlanRequest structure
      // Frontend sends 'name', backend expects 'planName'
      const backendPayload = {
        planYear: parseInt(planData.year) || new Date().getFullYear(),
        planName: planData.name || 'Unnamed Plan',  // Map 'name' to 'planName'
        regionalAllocations: regionalAllocations,
        distribution: planData.distribution,  // Include distribution breakdown by region and audit type
        estimatedRevenue: parseFloat(planData.estimatedRevenue) || 10000000,
      };
      
      console.log('📤 Final payload to send:', JSON.stringify(backendPayload, null, 2));
      
      if (!backendPayload.planName || backendPayload.planName === 'Unnamed Plan') {
        console.warn('⚠️  WARNING: Plan name is empty or default!');
      }
      
      const response = await fetch(`${API_BASE_URL}/ap/plans/workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': actorId || 'planning-team-001'
        },
        body: JSON.stringify(backendPayload)
      });
      
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Plan created successfully:', result);
      
      // Backend already returns correct format with region IDs, no transformation needed
      const createdPlan = result;
      console.log('📊 Created plan distribution:', createdPlan?.distribution);
      
      return createdPlan;
    } catch (error) {
      console.error('❌ Failed to create plan:', error);
      throw error;
    }
  }

  /**
   * Submit Tax Center feedback for a specific allocation
   * Endpoint: PATCH /api/v1/backoffice/ap/plans/workflow/{planId}/allocations/{taxCenterCode}/feedback
   */
  async submitTaxCenterFeedback(planId, taxCenterCode, adjustedCount, justification, actorId) {
    try {
      console.log('🚀 Submitting TC feedback via Backend API');
      console.log('📊 Plan ID:', planId);
      console.log('🏢 Tax Center Code:', taxCenterCode);
      console.log('📈 Adjusted Count:', adjustedCount);
      console.log('📝 Justification:', justification);

      const response = await fetch(
        `${API_BASE_URL}/ap/plans/workflow/${planId}/allocations/${taxCenterCode}/feedback`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor-Id': actorId || 'tax-center-manager',
            'X-User-Role': 'TAX_CENTER_MANAGER'
          },
          body: JSON.stringify({
            adjustedCount: parseInt(adjustedCount),
            justification: justification
          })
        }
      );
      
      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Feedback submitted successfully:', result);
      
      this.clearCache(planId);
      return result;
    } catch (error) {
      console.error('❌ Failed to submit feedback:', error);
      throw error;
    }
  }

  /**
   * Submit plan to Director for approval via Backend API
   */
  async submitToDirector(planId, actorId) {
    try {
      console.log('🚀 Submitting plan to Director via Backend API:', planId);
      const response = await fetch(`${API_BASE_URL}/ap/plans/workflow/${planId}/submit-to-director`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': actorId || 'planning-team-001'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Plan submitted to Director successfully:', result);
      
      // Backend already returns correct format, no transformation needed
      console.log('📊 Submitted plan distribution:', result?.distribution);
      
      this.clearCache(planId);
      return result;
    } catch (error) {
      console.error('❌ Failed to submit plan to Director:', error);
      throw error;
    }
  }

  /**
   * Get all plans from API
   * Real-time fetch from backend - no local state
   */
  async getPlans(filters = {}) {
    try {
      console.log('📋 Fetching plans from API with filters:', filters);
      
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.region) queryParams.append('region', filters.region);
      if (filters.fiscalYear) queryParams.append('fiscalYear', filters.fiscalYear);
      if (filters.createdBy) queryParams.append('createdBy', filters.createdBy);
      
      // Always request a large page size to get all plans (default backend is 20)
      // This ensures newly created plans are included in the list
      queryParams.append('page', '0');
      queryParams.append('size', '1000');
      
      const response = await fetch(`${API_BASE_URL}/ap/plans?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Plans fetched from API:', result.data?.length || result.length || 0);
      
      // Handle both array response and object with data property
      let plans = Array.isArray(result) ? result : (result.data || []);
      
      // Map backend region codes to frontend region IDs
      const codeToId = { 'AA': 'addis_ababa', 'BA': 'amhara', 'BB': 'oromia', 'AB': 'dire_dawa', 'CA': 'snnpr', 'SO': 'somali' };
      const idToCode = { 'addis_ababa': 'AA', 'amhara': 'BA', 'oromia': 'BB', 'dire_dawa': 'AB', 'snnpr': 'CA', 'somali': 'SO' };
      
      plans = plans.map(plan => {
        const mapped = { ...plan };
        
        // Ensure name and planYear fields exist
        if (!mapped.name && mapped.planName) {
          mapped.name = mapped.planName;
        }
        mapped.planYear = mapped.planYear || mapped.year;
        mapped.year = mapped.year || mapped.planYear;
        
        // Transform distribution from backend codes to frontend IDs
        if (mapped.distribution) {
          const transformed = {};
          Object.entries(mapped.distribution).forEach(([key, auditTypes]) => {
            const frontendId = codeToId[key] || key;
            transformed[frontendId] = auditTypes;
          });
          mapped.distribution = transformed;
        }
        
        // Calculate totalCases and populate distribution from regionalAllocations if missing/empty
        if (mapped.regionalAllocations && Array.isArray(mapped.regionalAllocations)) {
          if (!mapped.distribution || Object.keys(mapped.distribution).length === 0) {
            const derivedDist = {};
            mapped.regionalAllocations.forEach(alloc => {
              const regCode = alloc.regionCode || 'AA';
              const fId = codeToId[regCode] || regCode.toLowerCase();
              const count = alloc.effectiveCount || alloc.proposedCount || 0;
              derivedDist[fId] = {
                desk_audit: Math.round(count * 0.35),
                comprehensive: Math.round(count * 0.25),
                issue_audit: Math.round(count * 0.15),
                joint_audit: Math.round(count * 0.15),
                transfer_pricing: Math.round(count * 0.10)
              };
            });
            mapped.distribution = derivedDist;
          }

          let total = 0;
          mapped.regionalAllocations.forEach(alloc => {
            total += (alloc.effectiveCount || alloc.proposedCount || 0);
          });
          mapped.totalCases = total;
        }

        // Transform regionalFeedback from backend format to frontend format
        // Backend: { "AA": { "status": "submitted", "feedback": {...} } }
        // Frontend: { "addis_ababa": { "desk_audit": {...}, "_status": "submitted" } }
        if (mapped.regionalFeedback) {
          const transformedFeedback = {};
          Object.entries(mapped.regionalFeedback).forEach(([code, fbData]) => {
            const frontendId = codeToId[code] || code;
            const feedbackContent = fbData.feedback || fbData;
            const status = fbData.status || (fbData.isDefault ? 'pending' : 'submitted');
            transformedFeedback[frontendId] = {
              ...feedbackContent,
              _status: status,
              _isDefault: fbData.isDefault || false,
              feedback: feedbackContent,
              submitted: status === 'submitted',
              submittedBy: fbData.submittedBy || '',
              submittedAt: fbData.submittedAt || '',
            };
          });
          mapped.regionalFeedback = transformedFeedback;
        }
        
        return mapped;
      });
      
      console.log('📊 Plans transformed: distribution codes→IDs, names normalized');
      
      return plans;
    } catch (error) {
      console.error('❌ Failed to fetch plans:', error);
      throw error;
    }
  }

  /**
   * Get plans for a specific region
   * Filters backend to show ONLY plans that have allocations for that region
   * Backend handles region filtering - much more efficient than frontend filtering
   */
  async getPlansForRegion(regionCode) {
    try {
      console.log('📍 Fetching plans for region from backend:', regionCode);
      
      // Convert frontend region ID to backend region code if needed
      // Frontend uses IDs like "addis_ababa", backend API expects codes like "AA"
      const regionCodeToBackend = {
        'addis_ababa': 'AA',
        'amhara': 'BA',
        'oromia': 'BB',
        'dire_dawa': 'AB',
        'snnpr': 'CA',
        'somali': 'SO',
      };
      
      const backendRegionCode = regionCodeToBackend[regionCode] || regionCode;
      console.log(`📝 Region mapping: ${regionCode} → ${backendRegionCode}`);
      
      const response = await fetch(
        `${API_BASE_URL}/ap/regional/plans?regionCode=${backendRegionCode}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Regional plans fetched from backend:', result.data?.length || 0);
      
      let plans = result.data || [];
      
      // ✅ TRANSFORM backend response to frontend format
      // Backend returns: planName, planYear, regionAllocatedCases, status, planId, etc.
      // Frontend expects: name, year, distribution, status, id, etc.
      plans = plans.map(plan => {
        console.log('📝 Transforming plan:', { 
          planName: plan.planName, 
          planYear: plan.planYear,
          planId: plan.planId,
          regionAllocatedCases: plan.regionAllocatedCases,
          status: plan.status,
          rawTcDistributions: plan.tcDistributions
        });
        
        const transformedPlan = {
          ...plan,
          // Map backend field names to frontend format
          id: plan.planId || plan.id,  // ✅ CRITICAL: planId → id
          name: plan.planName || plan.name,  // Fallback to 'name' if planName doesn't exist
          year: plan.planYear || plan.year,  // Fallback to 'year' if planYear doesn't exist
          
          // Convert regionAllocatedCases to distribution format expected by frontend
          // IMPORTANT: Use FRONTEND regionCode as key, not backend code
          // This way views can access distribution[region] where region is the frontend ID
          distribution: {
            ...plan.distribution,
            [regionCode]: plan.regionAllocatedCases || {}  // Use frontend region code as key
          },
          
          tcDistributions: plan.tcDistributions ? {
            [regionCode]: plan.tcDistributions[backendRegionCode] || plan.tcDistributions[regionCode]
          } : undefined,

          regionalFeedback: plan.acknowledged ? {
            [regionCode]: {
              submittedAt: plan.acknowledgedAt,
              submittedBy: plan.acknowledgedBy
            }
          } : undefined,

          // Keep original fields for backward compatibility
          planName: plan.planName || plan.name,
          planYear: plan.planYear || plan.year,
          planId: plan.planId || plan.id,
          regionAllocatedCases: plan.regionAllocatedCases || {},
          regionalFeedbackSubmitted: plan.regionalFeedbackSubmitted || false,
        };

        // Transform taxCenterFeedback nested keys from backend codes to frontend IDs
        if (plan.taxCenterFeedback) {
          const backendTcFeedback = plan.taxCenterFeedback[backendRegionCode] || plan.taxCenterFeedback[regionCode] || {};
          const frontendTcFeedback = {};
          
          const backendToFrontendTcCode = {
            'AA-TC1': 'addis_ababa-tc1', 'AA-TC2': 'addis_ababa-tc2', 'AA-TC3': 'addis_ababa-tc3',
            'BA-TC1': 'amhara-tc1', 'BA-TC2': 'amhara-tc2', 'BA-TC3': 'amhara-tc3',
            'BB-TC1': 'oromia-tc1', 'BB-TC2': 'oromia-tc2', 'BB-TC3': 'oromia-tc3',
            'AB-TC1': 'dire_dawa-tc1', 'AB-TC2': 'dire_dawa-tc2', 'AB-TC3': 'dire_dawa-tc3',
            'CA-TC1': 'snnpr-tc1', 'CA-TC2': 'snnpr-tc2', 'CA-TC3': 'snnpr-tc3',
            'SO-TC1': 'somali-tc1', 'SO-TC2': 'somali-tc2', 'SO-TC3': 'somali-tc3',
          };

          Object.entries(backendTcFeedback).forEach(([backendCode, data]) => {
            const frontendId = backendToFrontendTcCode[backendCode] || backendCode;
            frontendTcFeedback[frontendId] = data;
          });

          transformedPlan.taxCenterFeedback = {
            [regionCode]: frontendTcFeedback
          };
        }

        return transformedPlan;
      });
      
      console.log('✅ Transformed plans:', plans.length, 'plans ready for regional dashboard');
      return plans;
    } catch (error) {
      console.error('❌ Failed to fetch regional plans:', error);
      return [];
    }
  }

  /**
   * Get plan by ID with full details
   */
  async getPlanById(planId) {
    try {
      console.log('📄 [planService] Fetching plan details:', planId);
      
      // Check cache first
      if (this.cache.has(planId)) {
        const cached = this.cache.get(planId);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          console.log('📦 [planService] Using cached plan data:', planId);
          console.log('📊 [planService] Cached distribution:', cached.data?.distribution);
          return cached.data;
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/ap/plans/${planId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('📦 [planService] Raw API response:', result);
      
      // Just use the data as-is (backend already returns correct format with region IDs)
      let planData = result.data;
      
      if (!planData) {
        console.warn('⚠️ [planService] No plan data in response');
        return null;
      }
      
      console.log('✅ [planService] Using plan data directly:', planData.planName);
      console.log('📊 [planService] Distribution:', planData.distribution);
      
      // Cache the result
      this.cache.set(planId, {
        data: planData,
        timestamp: Date.now()
      });
      
      console.log('✅ [planService] Plan details loaded:', planId);
      return planData;
    } catch (error) {
      console.error('❌ [planService] Failed to fetch plan details:', error);
      return null;
    }
  }

  /**
   * Get plans with regional allocations
   * Only returns plans that have allocations for the specified region
   */
  async getPlansWithRegionalAllocations(region) {
    try {
      console.log('🗺️ Fetching plans with regional allocations for:', region);
      
      const response = await fetch(
        `${API_BASE_URL}/ap/plans/allocations/${region}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Plans with allocations fetched:', result.data?.length || 0);
      
      return result.data || [];
    } catch (error) {
      console.error('❌ Failed to fetch plans with allocations:', error);
      return [];
    }
  }

  /**
   * Check if plan status allows the requested action
   * Dynamic status checking - works with any status
   */
  canPerformAction(plan, action) {
    if (!plan || !plan.status) return false;

    // Status hierarchy - what actions are allowed at each stage
    const allowedActions = {
      // Statuses that allow regional feedback
      'FINALIZED': ['regional_feedback', 'send_to_regions'],
      'APPROVED': ['regional_feedback', 'send_to_regions'],
      'DIRECTOR_APPROVED': ['regional_feedback', 'send_to_regions'],
      'AWAITING_REGIONAL_FEEDBACK': ['regional_feedback', 'collect_feedback'],
      'FEEDBACK_COLLECTED': ['allocate_to_tax_centers', 'send_to_tax_centers'],
      'SENT_TO_TAX_CENTERS': ['allocate_to_tax_centers', 'tax_center_feedback'],
      'IN_EXECUTION': ['execute_audit_cases', 'view_progress'],
      'COMPLETED': ['view_results', 'generate_reports'],
      
      // Blocked statuses
      'DRAFT': [],
      'PENDING': [],
      'SUBMITTED_FOR_APPROVAL': [],
      'REJECTED': [],
      'CANCELED': [],
      'ON_HOLD': []
    };

    const actions = allowedActions[plan.status] || [];
    return actions.includes(action);
  }

  /**
   * Get all possible next statuses for a plan
   * Shows what transitions are available from current status
   */
  getAvailableTransitions(plan) {
    if (!plan || !plan.status) return [];

    const transitions = {
      'DRAFT': ['SUBMITTED_FOR_APPROVAL'],
      'SUBMITTED_FOR_APPROVAL': ['REJECTED', 'APPROVED'],
      'REJECTED': ['SUBMITTED_FOR_APPROVAL'], // Can resubmit
      'APPROVED': ['DIRECTOR_APPROVED', 'FINALIZED'],
      'DIRECTOR_APPROVED': ['AWAITING_REGIONAL_FEEDBACK'],
      'FINALIZED': ['AWAITING_REGIONAL_FEEDBACK', 'SENT_TO_TAX_CENTERS'],
      'AWAITING_REGIONAL_FEEDBACK': ['FEEDBACK_COLLECTED'],
      'FEEDBACK_COLLECTED': ['SENT_TO_TAX_CENTERS'],
      'SENT_TO_TAX_CENTERS': ['IN_EXECUTION'],
      'IN_EXECUTION': ['COMPLETED'],
      'COMPLETED': [],
      'CANCELED': [],
      'ON_HOLD': ['AWAITING_REGIONAL_FEEDBACK', 'DRAFT']
    };

    return transitions[plan.status] || [];
  }

  /**
   * Get display name for status
   * Converts internal status to user-friendly format
   */
  getStatusDisplayName(status) {
    const displayNames = {
      'DRAFT': 'Draft',
      'PENDING': 'Pending Review',
      'SUBMITTED_FOR_APPROVAL': 'Submitted for Approval',
      'REJECTED': 'Rejected',
      'APPROVED': 'Approved',
      'DIRECTOR_APPROVED': 'Director Approved',
      'FINALIZED': 'Finalized',
      'AWAITING_REGIONAL_FEEDBACK': 'Awaiting Regional Feedback',
      'FEEDBACK_COLLECTED': 'Feedback Collected',
      'SENT_TO_TAX_CENTERS': 'Sent to Tax Centers',
      'IN_EXECUTION': 'In Execution',
      'COMPLETED': 'Completed',
      'CANCELED': 'Canceled',
      'ON_HOLD': 'On Hold'
    };

    return displayNames[status] || status;
  }

  /**
   * Get CSS class for status badge
   * Shows status visually with appropriate colors
   */
  getStatusClass(status) {
    const classes = {
      'DRAFT': 'status-draft',
      'PENDING': 'status-pending',
      'SUBMITTED_FOR_APPROVAL': 'status-submitted',
      'REJECTED': 'status-rejected',
      'APPROVED': 'status-approved',
      'DIRECTOR_APPROVED': 'status-director-approved',
      'FINALIZED': 'status-finalized',
      'AWAITING_REGIONAL_FEEDBACK': 'status-awaiting-feedback',
      'FEEDBACK_COLLECTED': 'status-feedback-collected',
      'SENT_TO_TAX_CENTERS': 'status-sent-tax-centers',
      'IN_EXECUTION': 'status-in-execution',
      'COMPLETED': 'status-completed',
      'CANCELED': 'status-canceled',
      'ON_HOLD': 'status-on-hold'
    };

    return classes[status] || 'status-unknown';
  }

  /**
   * Test if plan is ready for regional feedback
   * Dynamic check - NOT hardcoded statuses
   */
  isReadyForRegionalFeedback(plan) {
    if (!plan || !plan.status) return false;

    // Plans that are NOT ready
    const blockedStatuses = [
      'DRAFT',
      'PENDING',
      'SUBMITTED_FOR_APPROVAL',
      'REJECTED',
      'CANCELED'
    ];

    return !blockedStatuses.includes(plan.status);
  }

  /**
   * Test if plan is ready for tax center allocation
   * Dynamic check - NOT hardcoded statuses
   */
  isReadyForTaxCenterAllocation(plan) {
    if (!plan || !plan.status) return false;

    // Must have feedback collected or be finalized with tax center sending ready
    const readyStatuses = [
      'FEEDBACK_COLLECTED',
      'SENT_TO_TAX_CENTERS',
      'IN_EXECUTION'
    ];

    return readyStatuses.includes(plan.status) || 
           this.canPerformAction(plan, 'allocate_to_tax_centers');
  }

  /**
   * Clear cache for all plans or specific plan
   */
  clearCache(planId = null) {
    if (planId) {
      this.cache.delete(planId);
      console.log('🗑️ Cleared cache for plan:', planId);
    } else {
      this.cache.clear();
      console.log('🗑️ Cleared all plan cache');
    }
  }

  /**
   * Validate plan has required fields for an action
   */
  validatePlanForAction(plan, action) {
    if (!plan) return { valid: false, error: 'No plan provided' };

    const validations = {
      'regional_feedback': {
        required: ['id', 'regionalAllocation', 'sentToRegions'],
        statusCheck: true
      },
      'allocate_to_tax_centers': {
        required: ['id', 'regionalAllocation', 'taxCenterAllocations'],
        statusCheck: true
      },
      'send_to_regions': {
        required: ['id', 'regionalAllocation'],
        statusCheck: true
      },
      'execute_audit_cases': {
        required: ['id', 'cases'],
        statusCheck: true
      }
    };

    const validation = validations[action];
    if (!validation) {
      return { valid: false, error: `Unknown action: ${action}` };
    }

    // Check required fields
    for (const field of validation.required) {
      if (!plan[field]) {
        return { valid: false, error: `Missing required field: ${field}` };
      }
    }

    // Check status if needed
    if (validation.statusCheck && !this.canPerformAction(plan, action)) {
      return { 
        valid: false, 
        error: `Plan status '${plan.status}' does not allow action '${action}'` 
      };
    }

    return { valid: true };
  }

  /**
   * Get all plans pending director review
   * Endpoint: GET /api/v1/backoffice/ap/plans/pending-director-review
   */
  async getPendingDirectorReviewPlans(actorId) {
    try {
      console.log('📋 Fetching plans pending director review from backend');
      
      const response = await fetch(
        `${API_BASE_URL}/ap/plans/pending-director-review`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor-Id': actorId || 'director'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Pending director review plans fetched:', result.data?.length || 0);
      
      // Handle both array response and object with data property
      let plans = Array.isArray(result) ? result : (result.data || []);
      
      return plans;
    } catch (error) {
      console.error('❌ Failed to fetch pending director review plans:', error);
      throw error;
    }
  }

  /**
   * Get allocations for a specific tax center
   * Endpoint: GET /api/v1/backoffice/ap/tax-center/allocations?taxCenterId={taxCenterId}
   */
  async getTaxCenterAllocations(taxCenterId) {
    try {
      console.log('📋 Fetching tax center allocations from backend for:', taxCenterId);
      
      const response = await fetch(
        `${API_BASE_URL}/ap/tax-center/allocations?taxCenterId=${taxCenterId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Tax center allocations fetched:', result.data?.length || 0);
      
      return result.data || [];
    } catch (error) {
      console.error('❌ Failed to fetch tax center allocations:', error);
      throw error;
    }
  }

  /**
   * Send distribution allocations to tax centers
   * Creates PlanAllocation records for each tax center with their allocated cases
   * Endpoint: POST /api/v1/backoffice/ap/plans/workflow/{planId}/divide-allocations
   */
  async sendDistributionToTaxCenters(planId, region, tcAllocations, actorId) {
    try {
      console.log('🚀 Sending distribution to tax centers for region:', region);
      console.log('📦 TC Allocations from frontend:', JSON.stringify(tcAllocations, null, 2));

      // Map frontend region IDs to backend region codes
      // Frontend uses: addis_ababa, amhara, oromia, dire_dawa, snnpr, somali
      // Backend expects: AA, BA, BB, AB, CA, SO
      const regionIdToCode = {
        'addis_ababa': 'AA',
        'amhara': 'BA',
        'oromia': 'BB',
        'dire_dawa': 'AB',
        'snnpr': 'CA',
        'somali': 'SO',
      };

      const backendRegionCode = regionIdToCode[region];
      if (!backendRegionCode) {
        throw new Error(`Unknown region ID: ${region}`);
      }
      console.log(`🔄 Converted region ${region} to backend code ${backendRegionCode}`);

      // Transform frontend allocation format to backend format
      // Frontend: { tcId: { auditTypeId: count, ... }, ... }
      // Backend needs: taxCenterAllocations: [{ taxCenterCode, auditCount }, ...]
      
      // ✅ Map frontend tax center IDs to backend codes
      // Frontend uses: addis_ababa-tc1, Backend expects: AA-TC1
      const tcIdToBackendCode = {
        'addis_ababa-tc1': 'AA-TC1', 'addis_ababa-tc2': 'AA-TC2', 'addis_ababa-tc3': 'AA-TC3',
        'amhara-tc1': 'BA-TC1', 'amhara-tc2': 'BA-TC2', 'amhara-tc3': 'BA-TC3',
        'oromia-tc1': 'BB-TC1', 'oromia-tc2': 'BB-TC2', 'oromia-tc3': 'BB-TC3',
        'dire_dawa-tc1': 'AB-TC1', 'dire_dawa-tc2': 'AB-TC2', 'dire_dawa-tc3': 'AB-TC3',
        'snnpr-tc1': 'CA-TC1', 'snnpr-tc2': 'CA-TC2', 'snnpr-tc3': 'CA-TC3',
        'somali-tc1': 'SO-TC1', 'somali-tc2': 'SO-TC2', 'somali-tc3': 'SO-TC3',
      };

      // Transform to backend format: { taxCenterCode: { auditType: count, ... }, ... }
      const taxCenterAllocations = {};
      Object.entries(tcAllocations).forEach(([tcId, auditTypes]) => {
        const backendTcCode = tcIdToBackendCode[tcId] || tcId;
        const breakdown = {};
        Object.entries(auditTypes || {}).forEach(([auditType, count]) => {
          breakdown[auditType] = count || 0;
        });
        taxCenterAllocations[backendTcCode] = breakdown;
      });

      console.log('📦 Transformed for backend:', JSON.stringify(taxCenterAllocations, null, 2));

      const response = await fetch(
        `${API_BASE_URL}/ap/regional/plans/${planId}/distribute-to-tax-centers?regionCode=${backendRegionCode}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor-Id': actorId || 'regional-director-001'
          },
          body: JSON.stringify({ taxCenterAllocations })
        }
      );

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Distribution sent to tax centers successfully');
      console.log('📊 Updated plan:', result);

      this.clearCache(planId);
      return result;
    } catch (error) {
      console.error('❌ Failed to send distribution to tax centers:', error);
      throw error;
    }
  }

  /**
   * Submit regional aggregated feedback to director
   * Endpoint: POST /api/v1/backoffice/ap/regions/{regionCode}/submit-feedback
   */
  async submitRegionalFeedback(planId, regionCode, feedbackText, tcAllocations, capacityOverrides, actorId) {
    try {
      console.log('📤 Submitting regional feedback for plan:', planId);
      console.log('🔧 Capacity overrides:', capacityOverrides);

      // Map frontend region ID to backend code
      const regionIdToCode = {
        'addis_ababa': 'AA', 'amhara': 'BA', 'oromia': 'BB',
        'dire_dawa': 'AB', 'snnpr': 'CA', 'somali': 'SO',
      };
      const backendRegionCode = regionIdToCode[regionCode] || regionCode;

      // Build aggregated feedback from plan allocations
      // Fetch current plan to get distribution data
      const planData = await this.getPlanById(planId);
      const regionDist = planData?.distribution?.[regionCode] || planData?.distribution?.[backendRegionCode] || {};

      const aggregatedFeedback = {};
      Object.entries(regionDist).forEach(([auditType, count]) => {
        let totalCapacity = 0;
        
        // Use override if provided, otherwise calculate from tcAllocations
        if (capacityOverrides && capacityOverrides[auditType] !== undefined) {
          totalCapacity = capacityOverrides[auditType];
          console.log(`✅ Using override for ${auditType}: ${totalCapacity}`);
        } else if (tcAllocations && Object.keys(tcAllocations).length > 0) {
          Object.values(tcAllocations).forEach(tcAlloc => {
            totalCapacity += (tcAlloc[auditType] || 0);
          });
        } else {
          totalCapacity = count; // fallback if no tcAllocations provided
        }

        aggregatedFeedback[auditType] = {
          totalRequested: count,
          totalCapacity: totalCapacity,
          totalGap: totalCapacity - count,
          gapPercentage: count > 0 ? ((totalCapacity - count) / count) * 100 : 0,
          taxCenterFeedbacks: [],
          isRegionallyAdjusted: capacityOverrides && capacityOverrides[auditType] !== undefined
        };
      });

      const response = await fetch(
        `${API_BASE_URL}/ap/regions/${backendRegionCode}/submit-feedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor-Id': actorId || 'regional-director'
          },
          body: JSON.stringify({
            planId: planId,
            aggregatedFeedback: aggregatedFeedback,
            capacityOverrides: capacityOverrides || {}, // Send overrides to backend
            regionalAnalysis: feedbackText
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      if (result.status === 'ERROR') {
         throw new Error(result.error?.message || result.message || 'Backend returned an error');
      }
      console.log('✅ Regional feedback submitted:', result);
      this.clearCache(planId);
      return result;
    } catch (error) {
      console.error('❌ Failed to submit regional feedback:', error);
      throw error;
    }
  }

  /**
   * Submit plan to senior management
   * Endpoint: POST /api/v1/backoffice/ap/plans/{planId}/submit-to-management
   */
  async submitToSeniorManagement(planId, directorComment, actorId) {
    try {
      console.log('📤 Submitting plan to senior management:', planId);
      const response = await fetch(
        `${API_BASE_URL}/ap/plans/${planId}/submit-to-management`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor-Id': actorId || 'audit-director'
          },
          body: JSON.stringify({ directorComment: directorComment || '' })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Plan submitted to senior management:', result);
      this.clearCache(planId);
      return result;
    } catch (error) {
      console.error('❌ Failed to submit to senior management:', error);
      throw error;
    }
  }

  /**
   * Senior management decision (approve/reject)
   * Endpoint: POST /api/v1/backoffice/ap/plans/{planId}/management-decision
   */
  async managementDecision(planId, decision, reason, actorId) {
    try {
      console.log('📋 Processing management decision:', decision, 'for plan:', planId);
      const response = await fetch(
        `${API_BASE_URL}/ap/plans/${planId}/management-decision`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor-Id': actorId || 'senior-management'
          },
          body: JSON.stringify({ decision: decision, reason: reason || '' })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Management decision processed:', result);
      this.clearCache(planId);
      return result;
    } catch (error) {
      console.error('❌ Failed to process management decision:', error);
      throw error;
    }
  }

  /**
   * Get allocations for the logged-in tax center
   * Endpoint: GET /api/v1/backoffice/ap/tax-centers/{taxCenterCode}/allocations
   */
  async getTaxCenterAllocationsFetch(taxCenterCode, actorId) {
    try {
      console.log('📋 Fetching allocations for tax center:', taxCenterCode);

      const response = await fetch(
        `${API_BASE_URL}/tax-centers/${taxCenterCode}/allocations`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor-Id': actorId || taxCenterCode
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Tax center allocations fetched:', result.allocations?.length || 0);

      // Handle both array response and object with allocations property
      let allocations = Array.isArray(result) ? result : (result.allocations || []);

      return allocations;
    } catch (error) {
      console.error('❌ Failed to fetch tax center allocations:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new PlanService();

// Export class for testing
export { PlanService };
