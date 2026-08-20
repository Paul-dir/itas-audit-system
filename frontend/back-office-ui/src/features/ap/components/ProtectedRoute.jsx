import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Validates user's role and org context before rendering a page
 * Enforces strict isolation: no cross-access between regions/tax centers
 */
function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  requiredRegion = null,
  requiredTaxCenter = null,
  fallback = null 
}) {
  const { isAuthenticated, getUserInfo } = useAuth();
  const userInfo = getUserInfo();

  // Check if user is authenticated
  if (!isAuthenticated || !userInfo) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#ff7b7b' }}>
        <i className="fas fa-lock" style={{ fontSize: '32px', marginBottom: '16px', display: 'block' }}></i>
        <h2>Authentication Required</h2>
        <p>Please log in to access this page</p>
      </div>
    );
  }

  // Check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(userInfo.role)) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <i className="fas fa-ban" style={{ fontSize: '32px', marginBottom: '16px', display: 'block', color: '#ff7b7b' }}></i>
        <h2 style={{ color: '#ff7b7b' }}>Access Denied</h2>
        <p>Your role ({userInfo.role.replace(/_/g, ' ')}) doesn't have access to this page.</p>
        <p style={{ fontSize: '12px', color: '#8b949e', marginTop: '16px' }}>
          Required roles: {requiredRoles.map(r => r.replace(/_/g, ' ')).join(', ')}
        </p>
        {fallback && <div style={{ marginTop: '20px' }}>{fallback}</div>}
      </div>
    );
  }

  // Strict region isolation: check if user is trying to access a different region
  if (requiredRegion && userInfo.orgContext?.assignedRegion !== requiredRegion) {
    // Allow if user has national access (no region assigned)
    if (userInfo.accessLevel !== 'national_only') {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <i className="fas fa-map" style={{ fontSize: '32px', marginBottom: '16px', display: 'block', color: '#ff7b7b' }}></i>
          <h2 style={{ color: '#ff7b7b' }}>⛔ Region Access Denied</h2>
          <p>You can only access data from your assigned region:</p>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#f0f6fc', marginTop: '8px' }}>
            {userInfo.orgContext?.assignedRegionName || 'N/A'}
          </p>
          <p style={{ fontSize: '12px', color: '#8b949e', marginTop: '12px' }}>
            You tried to access: {requiredRegion}
          </p>
          {fallback && <div style={{ marginTop: '20px' }}>{fallback}</div>}
        </div>
      );
    }
  }

  // Strict tax center isolation: check if user is trying to access a different tax center
  if (requiredTaxCenter && userInfo.orgContext?.assignedTaxCenter !== requiredTaxCenter) {
    // Allow if user has national or region-level access
    if (userInfo.accessLevel === 'assigned_cases_only' || userInfo.accessLevel === 'tax_center_only') {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <i className="fas fa-building" style={{ fontSize: '32px', marginBottom: '16px', display: 'block', color: '#ff7b7b' }}></i>
          <h2 style={{ color: '#ff7b7b' }}>⛔ Tax Center Access Denied</h2>
          <p>You can only access data from your assigned tax center:</p>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#f0f6fc', marginTop: '8px' }}>
            {userInfo.orgContext?.assignedTaxCenterName || 'N/A'}
          </p>
          <p style={{ fontSize: '12px', color: '#8b949e', marginTop: '12px' }}>
            You tried to access: {requiredTaxCenter}
          </p>
          {fallback && <div style={{ marginTop: '20px' }}>{fallback}</div>}
        </div>
      );
    }
  }

  // All checks passed, render children
  return children;
}

export default ProtectedRoute;
