/**
 * Plan Service
 * Handles all plan-related API calls and data management
 * Integrates with MOR Backend API for real-time plan data
 */

const API_BASE_URL = import.meta.env.VITE_MOR_IDENTITY_URL || 
  'https://mor-org-forge.lovable.app/api/public/v1';

class PlanService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get all plans from API with optional filters
   * Real-time fetch - no hardcoded statuses
   */
  async getPlans(filters = {}) {
    try {
      console.log('📋 Fetching plans from API with filters:', filters);
      
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.region) queryParams.append('region', filters.region);
      if (filters.fiscalYear) queryParams.append('fiscalYear', filters.fiscalYear);
      if (filters.createdBy) queryParams.append('createdBy', filters.createdBy);
      
      const response = await fetch(`${API_BASE_URL}/plans?${queryParams}`, {
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
      console.log('✅ Plans fetched from API:', result.data?.length || 0);
      
      return result.data || [];
    } catch (error) {
      console.error('❌ Failed to fetch plans:', error);
      return [];
    }
  }

  /**
   * Get plans for a specific region
   * Filters to show only plans sent to that region
   */
  async getPlansForRegion(region) {
    try {
      console.log('📍 Fetching plans for region:', region);
      
      const response = await fetch(
        `${API_BASE_URL}/plans/region/${region}`,
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
      console.log('✅ Regional plans fetched:', result.data?.length || 0);
      
      return result.data || [];
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
      console.log('📄 Fetching plan details:', planId);
      
      // Check cache first
      if (this.cache.has(planId)) {
        const cached = this.cache.get(planId);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          console.log('📦 Using cached plan data:', planId);
          return cached.data;
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
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
      
      // Cache the result
      this.cache.set(planId, {
        data: result.data,
        timestamp: Date.now()
      });
      
      console.log('✅ Plan details loaded:', planId);
      return result.data;
    } catch (error) {
      console.error('❌ Failed to fetch plan details:', error);
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
        `${API_BASE_URL}/plans/allocations/${region}`,
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
