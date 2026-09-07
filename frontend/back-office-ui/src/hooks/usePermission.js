import { useAuth } from '../context/AuthContext.jsx';

/**
 * Custom hook to enforce granular permission checks in React components.
 * 
 * Example usage:
 *   const { hasPermission, hasAnyPermission, hasRole } = usePermission();
 *   if (hasPermission('REPORT_APPROVE')) { ... }
 */
export function usePermission() {
  const { user, hasPermission: contextHasPermission } = useAuth();

  const permissions = user?.permissions || [];
  const roles = user?.roles || (user?.role ? [user.role] : []);

  const hasPermission = (permCode) => {
    if (!user) return false;
    if (roles.includes('SYSTEM_ADMIN') || roles.includes('admin')) return true;
    if (permissions.includes(permCode)) return true;
    return contextHasPermission(permCode);
  };

  const hasAnyPermission = (permCodes = []) => {
    return permCodes.some(code => hasPermission(code));
  };

  const hasAllPermissions = (permCodes = []) => {
    return permCodes.every(code => hasPermission(code));
  };

  const hasRole = (roleCode) => {
    if (!user) return false;
    return roles.includes(roleCode) || roles.includes(roleCode.toLowerCase());
  };

  return {
    permissions,
    roles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
  };
}
