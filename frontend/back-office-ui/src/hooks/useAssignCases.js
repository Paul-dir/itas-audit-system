import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';

/**
 * Custom hook for assigning cases to team leaders
 * 
 * Usage:
 * const { assign, loading, error, success } = useAssignCases();
 * 
 * // In your component:
 * const handleAssign = async () => {
 *   await assign(['case-id-1', 'case-id-2'], 'tp-tl-1');
 * };
 */
export const useAssignCases = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [assignedCount, setAssignedCount] = useState(0);

  const assign = useCallback(async (caseIds, teamLeaderId) => {
    if (!caseIds || caseIds.length === 0) {
      setError('No cases selected');
      return false;
    }

    if (!teamLeaderId) {
      setError('No team leader selected');
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await apiClient.batchAssignCases(caseIds, teamLeaderId);
      setAssignedCount(result.data?.assignedCount || caseIds.length);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.message);
      setSuccess(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    assign,
    loading,
    error,
    success,
    assignedCount,
  };
};

export default useAssignCases;
