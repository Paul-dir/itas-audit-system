import { useState, useCallback, useEffect } from 'react';
import apiClient from '../services/apiClient';

/**
 * Custom hook for fetching and managing cases
 * 
 * Usage:
 * const { cases, loading, error, refetch } = useCases({
 *   taxCenter: 'addis_ababa-tc1',
 *   auditType: 'DESK_AUDIT'
 * });
 */
export const useCases = (filters = {}) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const fetchCases = useCallback(async () => {
    if (!filters.taxCenter && !filters.teamLeader && !filters.committeeId && !filters.auditor) {
      setError('At least one filter is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.getCases(filters);
      setCases(result.data || []);
      setMetadata({
        count: result.count,
        total: result.total,
        status: result.status,
      });
    } catch (err) {
      setError(err.message);
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Auto-fetch on mount and when filters change
  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  return {
    cases,
    loading,
    error,
    metadata,
    refetch: fetchCases,
  };
};

/**
 * Custom hook for committee cases (convenience wrapper)
 * 
 * Usage:
 * const { cases, loading } = useCommitteeCases('tp-committee', 'TRANSFER_PRICING');
 */
export const useCommitteeCases = (committeeId, auditType) => {
  const { cases, loading, error, metadata, refetch } = useCases({
    committeeId,
    auditType,
  });

  return { cases, loading, error, metadata, refetch };
};

/**
 * Custom hook for team leader cases (convenience wrapper)
 * 
 * Usage:
 * const { cases, loading } = useTeamLeaderCases('desk-tl-1', 'DESK_AUDIT');
 */
export const useTeamLeaderCases = (teamLeaderId, auditType) => {
  const { cases, loading, error, metadata, refetch } = useCases({
    teamLeader: teamLeaderId,
    auditType,
  });

  return { cases, loading, error, metadata, refetch };
};

/**
 * Custom hook for tax center cases (convenience wrapper)
 * 
 * Usage:
 * const { cases, loading } = useTaxCenterCases('addis_ababa-tc1', 'DESK_AUDIT');
 */
export const useTaxCenterCases = (taxCenter, auditType) => {
  const { cases, loading, error, metadata, refetch } = useCases({
    taxCenter,
    auditType,
  });

  return { cases, loading, error, metadata, refetch };
};

/**
 * Custom hook for auditor cases (convenience wrapper)
 * 
 * Usage:
 * const { cases, loading } = useAuditorCases('auditor-id');
 */
export const useAuditorCases = (auditorId) => {
  const { cases, loading, error, metadata, refetch } = useCases({
    auditor: auditorId,
  });

  return { cases, loading, error, metadata, refetch };
};

export default useCases;
