/**
 * User Management API Client
 * Consumes the MOR Enterprise User Management API
 * Base URL: configured via VITE_MOR_IDENTITY_URL env variable
 */

const API_BASE_URL = import.meta.env.VITE_MOR_IDENTITY_URL || 'https://mor-org-forge.lovable.app/api/public/v1';

class UserManagementClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.authContext = null;
  }

  // Helper: Make API calls with envelope handling
  async request(method, endpoint, body = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add authorization token if available
    if (this.authContext?.token) {
      options.headers['Authorization'] = `Bearer ${this.authContext.token}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      
      // Check if response is ok (status 200-299)
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error?.message) {
            errorMessage = errorJson.error.message;
          }
        } catch (e) {
          // If not JSON, use the text or default message
          if (errorText) errorMessage += ` - ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Handle API envelope: { data, error, meta }
      if (result.error && result.error.message) {
        throw new Error(result.error.message);
      }

      return result.data || result;
    } catch (err) {
      console.error(`API Error [${method} ${endpoint}]:`, err.message);
      throw err;
    }
  }

  // ============ AUTH ============
  async login(email) {
    console.log('🔐 Attempting login for:', email);
    const data = await this.request('POST', '/auth/login', { email });
    this.authContext = data;
    // Store in localStorage for persistence
    localStorage.setItem('auth_context', JSON.stringify(data));
    console.log('✅ Login successful:', data?.user?.email || email);
    return data;
  }

  async getMe(userId) {
    console.log('👤 Fetching user profile for userId:', userId);
    const data = await this.request('GET', `/auth/me?userId=${userId}`);
    this.authContext = data;
    localStorage.setItem('auth_context', JSON.stringify(data));
    console.log('✅ User profile fetched:', data?.user?.email || userId);
    return data;
  }

  getStoredAuthContext() {
    const stored = localStorage.getItem('auth_context');
    if (stored) {
      try {
        this.authContext = JSON.parse(stored);
        console.log('📦 Restored auth context from storage:', this.authContext?.user?.email);
        return this.authContext;
      } catch (err) {
        console.error('❌ Failed to parse stored auth context:', err);
        localStorage.removeItem('auth_context');
        return null;
      }
    }
    return null;
  }

  clearAuthContext() {
    console.log('🗑️ Clearing auth context');
    this.authContext = null;
    localStorage.removeItem('auth_context');
  }

  // ============ USERS ============
  async listUsers(filters = {}) {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.region) params.append('region', filters.region);
    if (filters.taxCenter) params.append('taxCenter', filters.taxCenter);
    if (filters.status) params.append('status', filters.status);

    const queryString = params.toString();
    return this.request('GET', `/users${queryString ? '?' + queryString : ''}`);
  }

  async getUser(userId) {
    return this.request('GET', `/users/${userId}`);
  }

  async createUser(userData) {
    return this.request('POST', '/users', userData);
  }

  async updateUser(userId, updates) {
    return this.request('PUT', `/users/${userId}`, updates);
  }

  async deleteUser(userId) {
    return this.request('DELETE', `/users/${userId}`);
  }

  async getUsersByRole(role, filters = {}) {
    const params = new URLSearchParams();
    if (filters.taxCenter) params.append('taxCenter', filters.taxCenter);
    if (filters.auditType) params.append('auditType', filters.auditType);

    const queryString = params.toString();
    return this.request(
      'GET',
      `/users/by-role/${role}${queryString ? '?' + queryString : ''}`
    );
  }

  async getUserPermissions(userId) {
    return this.request('GET', `/users/${userId}/permissions`);
  }

  async getAuditAssignments(userId) {
    return this.request('GET', `/users/${userId}/audit-assignment`);
  }

  async assignAuditCase(userId, caseId, allocate = true) {
    return this.request('POST', `/users/${userId}/audit-assignment`, {
      caseId,
      allocate,
    });
  }

  // ============ ORGANIZATION ============
  async listRegions() {
    return this.request('GET', '/org/regions');
  }

  async getTaxCentersInRegion(regionCode) {
    return this.request('GET', `/org/regions/${regionCode}/tax-centers`);
  }

  async getUsersAtTaxCenter(taxCenterId, role = null) {
    const query = role ? `?role=${role}` : '';
    return this.request('GET', `/org/tax-centers/${taxCenterId}/users${query}`);
  }

  async getTeamsAtTaxCenter(taxCenterId) {
    return this.request('GET', `/org/tax-centers/${taxCenterId}/teams`);
  }

  async getTeamMembers(teamId) {
    return this.request('GET', `/org/teams/${teamId}/members`);
  }

  // ============ PERMISSIONS ============
  async getRoleCatalog() {
    return this.request('GET', '/roles');
  }

  async validatePermission(userId, permission) {
    const result = await this.request('POST', '/validate-permission', {
      userId,
      permission,
    });
    return result.allowed;
  }
}

// Export singleton instance
export default new UserManagementClient();
