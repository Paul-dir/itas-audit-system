/**
 * API Client Service
 * 
 * Handles all communication with the backend ITAS API
 * Base URL: http://localhost:8080/api/v1/backoffice/ap
 * 
 * KEY REQUIREMENTS:
 * - All requests must include X-Actor-Id header (automatically injected)
 * - X-Actor-Id must be a VALID user from the database
 * - Case queries must include at least ONE filter: taxCenter, teamLeader, committeeId, or auditor
 * - Invalid user IDs will result in 401 Unauthorized responses
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1/backoffice/ap';

/**
 * Get the current actor ID from session/auth context
 * Falls back to 'system' if not set
 */
const getActorId = () => {
  // Try to get from sessionStorage (set by auth service)
  const userId = sessionStorage.getItem('userId');
  return userId || 'system';
};

/**
 * Validate that the current user is properly authenticated
 */
const validateUserSession = () => {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    throw new Error('User not authenticated. Please login first.');
  }
  return userId;
};

/**
 * Fetch wrapper with error handling
 * Handles user validation, error messages, and logging
 */
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const actorId = getActorId();

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Actor-Id': actorId,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle specific error cases
      if (response.status === 401) {
        const error = new Error(`Invalid user: "${actorId}" not found in system. Please login with a valid user.`);
        error.statusCode = 401;
        throw error;
      }
      
      if (response.status === 400) {
        const error = new Error(errorData.error?.message || 'Bad request. Check query parameters.');
        error.statusCode = 400;
        throw error;
      }

      const error = new Error(errorData.error?.message || `API Error: ${response.status}`);
      error.statusCode = response.status;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * API Client Service
 */
export const apiClient = {
  /**
   * Get cases with filters
   * 
   * IMPORTANT: At least ONE filter is REQUIRED
   * - taxCenter: string - Filter by tax center code (e.g., "addis_ababa-tc1")
   * - teamLeader: string - Filter by assigned team leader ID
   * - committeeId: string - Filter by committee ID (e.g., "tp-committee", "joint-committee")
   * - auditor: string - Filter by auditor ID
   * - auditType: string - Filter by audit type (DESK_AUDIT, COMPREHENSIVE_AUDIT, ISSUE_AUDIT, TRANSFER_PRICING, JOINT_AUDIT)
   * - status: string - Filter by case status
   * - limit: number - Pagination limit (default: 50)
   * - offset: number - Pagination offset (default: 0)
   * 
   * @param {Object} filters - Query filters (at least one required)
   * @returns {Promise<Object>} Cases data with metadata
   * @throws {Error} If no filters provided or API call fails
   */
  getCases: async (filters = {}) => {
    // Validate user is authenticated
    try {
      validateUserSession();
    } catch (err) {
      throw new Error('User authentication required to fetch cases');
    }

    // At least one filter is required
    if (!filters.taxCenter && !filters.teamLeader && !filters.committeeId && !filters.auditor) {
      throw new Error(
        'At least one filter is required: taxCenter, teamLeader, committeeId, or auditor. ' +
        'Example: { taxCenter: "addis_ababa-tc1", auditType: "DESK_AUDIT" }'
      );
    }

    const queryParams = new URLSearchParams();
    
    if (filters.taxCenter) queryParams.append('taxCenter', filters.taxCenter);
    if (filters.teamLeader) queryParams.append('teamLeader', filters.teamLeader);
    if (filters.committeeId) queryParams.append('committeeId', filters.committeeId);
    if (filters.auditor) queryParams.append('auditor', filters.auditor);
    if (filters.auditType) queryParams.append('auditType', filters.auditType);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);

    const url = `${API_BASE_URL}/cases?${queryParams.toString()}`;
    return fetchWithErrorHandling(url);
  },

  /**
   * Get a specific case by ID
   * 
   * @param {string} caseId - The case ID
   * @returns {Promise<Object>} Case details
   */
  getCaseById: async (caseId) => {
    const url = `${API_BASE_URL}/cases/${caseId}`;
    return fetchWithErrorHandling(url);
  },

  /**
   * Update a case
   * 
   * @param {string} caseId - The case ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated case data
   */
  updateCase: async (caseId, updates) => {
    const url = `${API_BASE_URL}/cases/${caseId}`;
    return fetchWithErrorHandling(url, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Batch assign cases to a team leader
   * 
   * @param {Array<string>} caseIds - Array of case IDs to assign
   * @param {string} assignToTeamLeaderId - Team leader ID to assign to
   * @returns {Promise<Object>} Assignment result
   */
  batchAssignCases: async (caseIds, assignToTeamLeaderId) => {
    const url = `${API_BASE_URL}/cases/batch-assign`;
    return fetchWithErrorHandling(url, {
      method: 'POST',
      body: JSON.stringify({
        caseIds,
        assignToTeamLeaderId,
      }),
    });
  },

  /**
   * Get all users
   * 
   * @returns {Promise<Object>} Users list
   */
  getUsers: async () => {
    const url = `${API_BASE_URL}/users`;
    return fetchWithErrorHandling(url);
  },

  /**
   * Get a specific user by ID
   * 
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} User details
   */
  getUserById: async (userId) => {
    const url = `${API_BASE_URL}/users/${userId}`;
    return fetchWithErrorHandling(url);
  },
};

export default apiClient;
