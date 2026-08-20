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
      };
      
      console.log('📤 Final payload to send:', JSON.stringify(backendPayload, null, 2));
      
      if (!backendPayload.planName || backendPayload.planName === 'Unnamed Plan') {
        console.warn('⚠️  WARNING: Plan name is empty or default!');
      }
      
      const response = await fetch(`${API_BASE_URL}/ap/plans`, {
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
   * Submit Tax Center feedback for a specific allocation via Backend API
   */
  async submitTaxCenterFeedback(planId, allocationId, feedbackData, actorId) {
    try {
      console.log('🚀 Submitting TC feedback via Backend API:', planId, allocationId);
      const response = await fetch(`${API_BASE_URL}/ap/plans/${planId}/allocations/${allocationId}/feedback`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': actorId || 'system'
        },
        body: JSON.stringify(feedbackData)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Feedback submitted successfully:', result);
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
      const response = await fetch(`${API_BASE_URL}/ap/plans/${planId}/submit-to-director`, {
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
      
      // Backend already returns correct format with region IDs, no transformation needed
      console.log('📊 Plans distribution data preserved from backend');
      
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
        `${API_BASE_URL}/ap/plans/region/${backendRegionCode}`,
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
      
      // Transform distribution from backend format (region codes) to frontend format (region IDs)
      // Backend returns: {AA: {...}, BA: {...}, ...}
      // Frontend needs: {addis_ababa: {...}, amhara: {...}, ...}
      plans = plans.map(plan => {
        if (plan.distribution) {
          plan.distribution = convertDistributionFromBackend(plan.distribution);
          console.log('📊 Transformed distribution for plan:', plan.id);
        }
        return plan;
      });
      
      console.log('✅ Plans ready for regional dashboard');
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
}

// Export singleton instance
export default new PlanService();

// Export class for testing
export { PlanService };
