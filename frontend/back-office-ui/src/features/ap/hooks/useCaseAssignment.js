import { useState } from 'react';
import userManagementClient from '../api/userManagementClient';

/**
 * Hook to manage audit case assignments
 * Usage:
 *   const { assign, unassign, getAssignments, loading, error } = useCaseAssignment();
 *   await assign(auditorId, caseId);
 */
export function useCaseAssignment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const assign = async (auditorId, caseId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await userManagementClient.assignAuditCase(auditorId, caseId, true);
      console.log('✓ Case assigned:', { auditorId, caseId });
      return result;
    } catch (err) {
      setError(err.message);
      console.error('✗ Assignment failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unassign = async (auditorId, caseId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await userManagementClient.assignAuditCase(auditorId, caseId, false);
      console.log('✓ Case unassigned:', { auditorId, caseId });
      return result;
    } catch (err) {
      setError(err.message);
      console.error('✗ Unassignment failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAssignments = async (auditorId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await userManagementClient.getAuditAssignments(auditorId);
      console.log('✓ Assignments fetched:', { auditorId, count: result.count });
      return result;
    } catch (err) {
      setError(err.message);
      console.error('✗ Fetch failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    assign,
    unassign,
    getAssignments,
    loading,
    error,
  };
}
