import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../services/dataService';

/**
 * RouteContext - Central routing state management
 * 
 * Manages:
 * - Current route (view name)
 * - User context (role, region, permissions)
 * - Available routes for current user
 * - Route parameters (plan, region, tax center)
 * - Route history (for breadcrumbs/back navigation)
 */

const RouteContext = createContext(null);

export function RouteProvider({ children }) {
  const { authContext, isAuthenticated } = useAuth();
  const { data, loading: dataLoading } = useData();

  // Current routing state
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [routeParams, setRouteParams] = useState({});
  const [routeHistory, setRouteHistory] = useState(['dashboard']);
  const [error, setError] = useState(null);

  // User context (cached from auth)
  const [userContext, setUserContext] = useState(null);

  // Available routes for current user (cached)
  const [availableRoutes, setAvailableRoutes] = useState([]);

  // Update user context when auth changes
  useEffect(() => {
    if (isAuthenticated && authContext) {
      setUserContext({
        userId: authContext.userId,
        email: authContext.email,
        role: authContext.role,
        fullName: authContext.fullName,
        region: authContext.org_context?.assignedRegion,
        taxCenter: authContext.org_context?.assignedTaxCenter,
        permissions: authContext.permissions || [],
        level: authContext.org_context?.level,
      });
      console.log('✅ RouteContext: User context updated', authContext.role);
    }
  }, [isAuthenticated, authContext]);

  // Navigate to route with optional parameters
  const navigate = useCallback((routeName, params = {}) => {
    try {
      setError(null);
      
      // Validate route exists
      const route = availableRoutes.find(r => r.name === routeName);
      if (!route && currentRoute !== 'dashboard') {
        // Allow navigation to any route in auth check
        console.log('🔄 Navigating to:', routeName, 'with params:', params);
      }

      // Update route history
      setRouteHistory(prev => [...prev, routeName]);
      
      // Update current route and params
      setCurrentRoute(routeName);
      setRouteParams(params);

      console.log('✅ Route changed:', routeName);
    } catch (err) {
      setError(err.message);
      console.error('❌ Navigation failed:', err);
    }
  }, [availableRoutes, currentRoute]);

  // Go back in history
  const goBack = useCallback(() => {
    if (routeHistory.length > 1) {
      const newHistory = routeHistory.slice(0, -1);
      const previousRoute = newHistory[newHistory.length - 1];
      setRouteHistory(newHistory);
      setCurrentRoute(previousRoute);
      console.log('⬅️ Going back to:', previousRoute);
    }
  }, [routeHistory]);

  // Check if user can access route
  const canAccess = useCallback((routeName) => {
    if (!userContext) return false;
    
    const route = availableRoutes.find(r => r.name === routeName);
    if (!route) return false;
    
    // Check role
    if (route.allowedRoles && !route.allowedRoles.includes(userContext.role)) {
      return false;
    }
    
    // Check permissions
    if (route.requiredPermissions) {
      const hasAllPermissions = route.requiredPermissions.every(perm =>
        userContext.permissions.includes(perm)
      );
      if (!hasAllPermissions) return false;
    }
    
    return true;
  }, [userContext, availableRoutes]);

  // Get current route metadata
  const getCurrentRoute = useCallback(() => {
    return availableRoutes.find(r => r.name === currentRoute) || null;
  }, [currentRoute, availableRoutes]);

  // Get breadcrumb trail
  const getBreadcrumbs = useCallback(() => {
    return routeHistory.map(routeName => {
      const route = availableRoutes.find(r => r.name === routeName);
      return {
        name: routeName,
        label: route?.label || routeName,
        path: routeName,
      };
    });
  }, [routeHistory, availableRoutes]);

  // Update available routes when user context changes
  useEffect(() => {
    if (userContext) {
      const routes = getRoutesForRole(userContext.role, userContext.permissions);
      setAvailableRoutes(routes);
      console.log('📍 Available routes for', userContext.role + ':', routes.length);
    }
  }, [userContext]);

  const value = {
    // State
    currentRoute,
    routeParams,
    routeHistory,
    userContext,
    availableRoutes,
    error,
    loading: dataLoading,
    isAuthenticated,

    // Actions
    navigate,
    goBack,
    canAccess,
    getCurrentRoute,
    getBreadcrumbs,
    setRouteParams,

    // Data
    data,
  };

  return (
    <RouteContext.Provider value={value}>
      {children}
    </RouteContext.Provider>
  );
}

/**
 * Hook to access route context
 */
export function useRoute() {
  const context = React.useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within RouteProvider');
  }
  return context;
}

/**
 * Get routes available for a specific role
 * Returns array of route metadata
 */
function getRoutesForRole(role, permissions = []) {
  const allRoutes = {
    // Common routes
    dashboard: { name: 'dashboard', label: 'Dashboard', allowedRoles: ['*'] },
    logout: { name: 'logout', label: 'Logout', allowedRoles: ['*'] },

    // Audit Team Routes
    'audit-team-dashboard': { name: 'audit-team-dashboard', label: 'Dashboard', allowedRoles: ['audit_team', 'audit_team_leader'] },
    'create-plan': { name: 'create-plan', label: 'Create Plan', allowedRoles: ['audit_team', 'audit_team_leader'], requiredPermissions: ['create_plans'] },
    'view-metrics': { name: 'view-metrics', label: 'View Metrics', allowedRoles: ['audit_team', 'audit_team_leader'], requiredPermissions: ['view_audit_metrics'] },
    'cascade-plan-to-cases': { name: 'cascade-plan-to-cases', label: 'Cascade Plan', allowedRoles: ['audit_team_leader', 'tax_center_manager'], requiredPermissions: ['cascade_plan_to_cases'] },
    'risk-engine': { name: 'risk-engine', label: 'Risk Engine', allowedRoles: ['planning_team', 'audit_director', 'senior_management'] },

    // Audit Director Routes
    'director-dashboard': { name: 'director-dashboard', label: 'Dashboard', allowedRoles: ['audit_director'] },
    'approve-plans': { name: 'approve-plans', label: 'Approve Plans', allowedRoles: ['audit_director'], requiredPermissions: ['approve_plans'] },
    'view-all-regions': { name: 'view-all-regions', label: 'View All Regions', allowedRoles: ['audit_director', 'senior_management'], requiredPermissions: ['view_all_regions'] },

    // Regional Director Routes
    'regional-dashboard': { name: 'regional-dashboard', label: 'Dashboard', allowedRoles: ['regional_director'] },
    'allocate-to-tax-centers': { name: 'allocate-to-tax-centers', label: 'Allocate', allowedRoles: ['regional_director'], requiredPermissions: ['allocate_to_tax_centers'] },
    'regional-feedback': { name: 'regional-feedback', label: 'Feedback', allowedRoles: ['regional_director'] },

    // Tax Center Manager Routes
    'tax-center-dashboard': { name: 'tax-center-dashboard', label: 'Dashboard', allowedRoles: ['tax_center_manager'] },
    'manage-cases': { name: 'manage-cases', label: 'Manage Cases', allowedRoles: ['tax_center_manager'], requiredPermissions: ['cascade_plan_to_cases'] },
    'view-audit-cases': { name: 'view-audit-cases', label: 'View Cases', allowedRoles: ['tax_center_manager'], requiredPermissions: ['view_audit_cases'] },
    'case-prioritization': { name: 'case-prioritization', label: 'Prioritize Cases', allowedRoles: ['tax_center_manager'], requiredPermissions: ['manage_case_prioritization'] },
    'risk-engine': { name: 'risk-engine', label: 'Risk Engine', allowedRoles: ['tax_center_manager'] },

    // Team Leader Routes
    'team-leader-dashboard': { name: 'team-leader-dashboard', label: 'Dashboard', allowedRoles: ['team_leader'] },
    'assign-to-auditors': { name: 'assign-to-auditors', label: 'Assign Cases', allowedRoles: ['team_leader'], requiredPermissions: ['assign_cases_to_auditors'] },
    'view-team': { name: 'view-team', label: 'View Team', allowedRoles: ['team_leader'], requiredPermissions: ['view_team_members'] },

    // Auditor Routes
    'auditor-dashboard': { name: 'auditor-dashboard', label: 'Dashboard', allowedRoles: ['auditor'] },
    'my-cases': { name: 'my-cases', label: 'My Cases', allowedRoles: ['auditor'], requiredPermissions: ['view_audit_cases'] },

    // Senior Management Routes
    'senior-management-dashboard': { name: 'senior-management-dashboard', label: 'Dashboard', allowedRoles: ['senior_management'] },
  };

  // Filter routes for this role
  const routes = Object.values(allRoutes).filter(route => {
    // Check role
    if (route.allowedRoles.includes('*')) return true;
    if (!route.allowedRoles.includes(role)) return false;

    // Check permissions
    if (route.requiredPermissions) {
      const hasAllPermissions = route.requiredPermissions.every(perm =>
        permissions.includes(perm)
      );
      if (!hasAllPermissions) return false;
    }

    return true;
  });

  return routes;
}
export default RouteContext;
