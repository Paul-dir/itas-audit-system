/**
 * MOR Identity API Client
 * Integrates with MOR Enterprise User Management API
 * 
 * API Base: https://localhost:8080/api/public/v1
 * Documentation: See mor-identity-openapi.yaml
 */

const API_BASE_URL = import.meta.env.VITE_MOR_IDENTITY_URL || 
  'https://localhost:8080/api/public/v1';

class MORIdentityAPI {
  constructor() {
    this.tokenRefreshInterval = null;
  }

  // ============================================
  // AUTHENTICATION
  // ============================================
  
  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<AuthContext>} Authentication context with token and user info
   */
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message || 'Login failed');
    }
    
    const authContext = result.data;
    
    // Store token and context
    localStorage.setItem('authToken', authContext.token);
    localStorage.setItem('userContext', JSON.stringify({
      userId: authContext.userId,
      id: authContext.userId, // Compatibility with existing code
      email: authContext.email,
      fullName: authContext.fullName,
      full_name: authContext.fullName, // Compatibility
      title: authContext.title,
      role: authContext.role,
      permissions: authContext.permissions,
      statuses: authContext.statuses,
      orgContext: authContext.org_context,
      org_context: authContext.org_context // Compatibility
    }));
    
    // Start auto-refresh
    this.startTokenRefreshInterval();
    
    console.log('✅ MOR Identity: Login successful', {
      userId: authContext.userId,
      role: authContext.role,
      region: authContext.org_context?.assignedRegion,
      taxCenter: authContext.org_context?.assignedTaxCenter
    });
    
    return authContext;
  }
  
  /**
   * Test mode login with userId (for development)
   * @param {string} userId - User ID for impersonation
   */
  async loginWithUserId(userId) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message || 'Login failed');
    }
    
    const authContext = result.data;
    
    // Store token and context
    localStorage.setItem('authToken', authContext.token);
    localStorage.setItem('userContext', JSON.stringify({
      userId: authContext.userId,
      id: authContext.userId,
      email: authContext.email,
      fullName: authContext.fullName,
      full_name: authContext.fullName,
      title: authContext.title,
      role: authContext.role,
      permissions: authContext.permissions,
      statuses: authContext.statuses,
      orgContext: authContext.org_context,
      org_context: authContext.org_context
    }));
    
    this.startTokenRefreshInterval();
    
    return authContext;
  }
  
  /**
   * Get current user from token
   */
  async getCurrentUser() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const result = await response.json();
    
    if (result.error) {
      if (result.error.code === 401) {
        // Token expired
        console.warn('⚠️ Token expired, redirecting to login...');
        this.logout();
        window.location.href = '/login';
      }
      throw new Error(result.error.message);
    }
    
    return result.data;
  }
  
  /**
   * Refresh JWT token
   */
  async refreshToken() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No token to refresh');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const result = await response.json();
    
    if (!result.error && result.data) {
      localStorage.setItem('authToken', result.data.token);
      console.log('✅ Token refreshed successfully');
      return result.data.token;
    }
    
    throw new Error('Token refresh failed');
  }
  
  /**
   * Change user password
   */
  async changePassword(currentPassword, newPassword) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  }
  
  /**
   * Logout user
   */
  async logout() {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }
    
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userContext');
    
    // Stop token refresh
    this.stopTokenRefreshInterval();
    
    console.log('✅ Logged out successfully');
  }
  
  // ============================================
  // USERS
  // ============================================
  
  /**
   * Get users with optional filters
   * @param {Object} filters - { role, region, taxCenter, status }
   */
  async getUsers(filters = {}) {
    const token = localStorage.getItem('authToken');
    const queryParams = new URLSearchParams(filters).toString();
    
    const response = await fetch(`${API_BASE_URL}/users?${queryParams}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  }
  
  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  }
  
  /**
   * Get users by role with optional filters
   * @param {string} role - User role
   * @param {Object} filters - { taxCenter, auditType }
   */
  async getUsersByRole(role, filters = {}) {
    const token = localStorage.getItem('authToken');
    const queryParams = new URLSearchParams(filters).toString();
    
    const response = await fetch(
      `${API_BASE_URL}/users/by-role/${role}?${queryParams}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  }
  
  /**
   * Create new user
   */
  async createUser(userData) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  }
  
  /**
   * Update user
   */
  async updateUser(userId, updates) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  }
  
  /**
   * Delete user (soft delete - sets status to inactive)
   */
  async deleteUser(userId) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  }
  
  // ============================================
  // CASE ASSIGNMENTS
  // ============================================
  
  /**
   * Get user's case assignments
   */
  async getUserAssignments(userId) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/audit-assignment`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data; // { cases: [...], count: N }
  }
  
  /**
   * Assign or unassign case to user
   * @param {string} userId - User ID
   * @param {string} caseId - Case ID
   * @param {boolean} allocate - true to assign, false to unassign
   */
  async assignCaseToUser(userId, caseId, allocate = true) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/audit-assignment`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ caseId, allocate })
      }
    );
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  }
  
  /**
   * Bulk assign multiple cases to user (sequential calls)
   * @param {string} userId - User ID
   * @param {string[]} caseIds - Array of case IDs
   */
  async bulkAssignCases(userId, caseIds) {
    const results = [];
    
    for (const caseId of caseIds) {
      try {
        const result = await this.assignCaseToUser(userId, caseId, true);
        results.push({ caseId, success: true, result });
      } catch (error) {
        results.push({ caseId, success: false, error: error.message });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    console.log(`✅ Bulk assign: ${successCount}/${caseIds.length} cases assigned`);
    
    return results;
  }
  
  // ============================================
  // ORGANIZATION
  // ============================================
  
  /**
   * Get all regions
   */
  async getRegions() {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/org/regions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  }
  
  /**
   * Get tax centers in a region
   */
  async getTaxCentersByRegion(regionCode) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      `${API_BASE_URL}/org/regions/${regionCode}/tax-centers`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  }
  
  /**
   * Get users in a tax center
   * @param {string} taxCenterId - Tax center ID
   * @param {string} role - Optional role filter
   */
  async getTaxCenterUsers(taxCenterId, role = null) {
    const token = localStorage.getItem('authToken');
    const url = role 
      ? `${API_BASE_URL}/org/tax-centers/${taxCenterId}/users?role=${role}`
      : `${API_BASE_URL}/org/tax-centers/${taxCenterId}/users`;
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  }
  
  /**
   * Get team members
   */
  async getTeamMembers(teamId) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      `${API_BASE_URL}/org/teams/${teamId}/members`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  }
  
  // ============================================
  // PERMISSIONS
  // ============================================
  
  /**
   * Get user permissions
   */
  async getUserPermissions(userId) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/permissions`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data; // { role: "...", permissions: [...] }
  }
  
  /**
   * Validate if user has permission
   */
  async validatePermission(userId, permission) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/validate-permission`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, permission })
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data; // { allowed: true/false }
  }
  
  /**
   * Get role information (fetches all roles and filters)
   */
  async getRoleInfo(role) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      `${API_BASE_URL}/roles`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    // Find the specific role from the array of roles
    const rolesArray = result.data.roles || [];
    const roleInfo = rolesArray.find(r => r.code === role);
    
    if (!roleInfo) {
      throw new Error(`Role ${role} not found`);
    }
    
    return roleInfo;
  }
  
  // ============================================
  // UTILITIES
  // ============================================
  
  /**
   * Start automatic token refresh (every 30 minutes)
   */
  startTokenRefreshInterval() {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
    }
    
    const refreshInterval = parseInt(
      import.meta.env.VITE_TOKEN_REFRESH_INTERVAL || '1800000', 
      10
    ); // Default: 30 minutes
    
    this.tokenRefreshInterval = setInterval(async () => {
      try {
        await this.refreshToken();
        console.log('✅ Token auto-refreshed');
      } catch (error) {
        console.error('❌ Token auto-refresh failed:', error);
        this.logout();
        window.location.href = '/login';
      }
    }, refreshInterval);
    
    console.log(`🔄 Token auto-refresh started (interval: ${refreshInterval}ms)`);
  }
  
  /**
   * Stop automatic token refresh
   */
  stopTokenRefreshInterval() {
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = null;
      console.log('⏹️ Token auto-refresh stopped');
    }
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
  
  /**
   * Get stored user context
   */
  getUserContext() {
    const context = localStorage.getItem('userContext');
    return context ? JSON.parse(context) : null;
  }
}

export default new MORIdentityAPI();
