/**
 * backendClient.js
 * 
 * API client for connecting to the ITAS backend server at localhost:8080
 * Provides methods to fetch:
 * - Pre-filled plan data (risk-based case distribution)
 * - Risk analysis dashboard data
 */

const API_BASE_URL = '/api/v1/backoffice/ap';

/**
 * Get pre-filled plan data with risk-based case distribution
 * Endpoint: GET /plans/workflow/pre-filled-data
 */
export async function getPreFilledPlanData(actorId = 'planning-team-demo') {
  try {
    const response = await fetch(`${API_BASE_URL}/plans/workflow/pre-filled-data`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Actor-Id': actorId,
      },
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[backendClient] Error fetching pre-filled data:', error);
    throw error;
  }
}

/**
 * Get risk analysis dashboard data
 * Endpoint: GET /plans/workflow/risk-analysis/dashboard
 */
export async function getRiskAnalysisDashboard(actorId = 'admin-001') {
  try {
    const response = await fetch(`${API_BASE_URL}/plans/workflow/risk-analysis/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Actor-Id': actorId,
      },
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[backendClient] Error fetching risk analysis dashboard:', error);
    throw error;
  }
}

/**
 * Create a new plan
 * Endpoint: POST /plans
 */
export async function createPlan(planData, actorId = 'planning-team-demo') {
  try {
    // Transform frontend distribution format to backend regional allocations format
    const regionalAllocations = Object.entries(planData.distribution || {}).map(([regionId, auditTypes]) => {
      const total = Object.values(auditTypes).reduce((sum, count) => sum + count, 0);
      return {
        regionCode: regionId.toUpperCase(),
        proposedCount: total,
      };
    });

    const response = await fetch(`${API_BASE_URL}/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Actor-Id': actorId,
      },
      body: JSON.stringify({
        planYear: planData.year || new Date().getFullYear(),
        planName: planData.name,
        regionalAllocations,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Backend returned ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('[backendClient] Error creating plan:', error);
    throw error;
  }
}

/**
 * Submit plan to director
 * Endpoint: POST /plans/{planId}/submit-to-director
 */
export async function submitPlanToDirector(planId, remarks = '', actorId = 'planning-team-demo') {
  try {
    const response = await fetch(`${API_BASE_URL}/plans/${planId}/submit-to-director`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Actor-Id': actorId,
      },
      body: JSON.stringify({
        remarks: remarks || 'Plan submitted for director review',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Backend returned ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('[backendClient] Error submitting plan to director:', error);
    throw error;
  }
}

/**
 * Get plan details
 * Endpoint: GET /plans/{planId}
 */
export async function getPlanDetails(planId, actorId = 'admin-001') {
  try {
    const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Actor-Id': actorId,
      },
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[backendClient] Error fetching plan details:', error);
    throw error;
  }
}

/**
 * Get audit log for a plan
 * Endpoint: GET /plans/{planId}/audit-log
 */
export async function getPlanAuditLog(planId, actorId = 'admin-001') {
  try {
    const response = await fetch(`${API_BASE_URL}/plans/${planId}/audit-log`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Actor-Id': actorId,
      },
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[backendClient] Error fetching audit log:', error);
    throw error;
  }
}

export default {
  getPreFilledPlanData,
  getRiskAnalysisDashboard,
  createPlan,
  submitPlanToDirector,
  getPlanDetails,
  getPlanAuditLog,
};
