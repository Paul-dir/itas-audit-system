/**
 * useCases Hook
 * Manages team leader cases list with pagination and filtering
 * Combines both committee-originated cases and AP-assigned cases
 */

import { useState, useEffect, useCallback } from 'react';
import { teamLeaderAPI } from '../services/api';

export function useCases(teamLeaderId) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState({});

  const fetchCases = useCallback(async () => {
    if (!teamLeaderId) return;
    try {
      setLoading(true);
      setError(null);

      // Fetch cases assigned to this team leader
      let apCases = [];
      try {
        const apData = await teamLeaderAPI.getAssignedCases(teamLeaderId, filters);
        apCases = apData?.data || apData?.content || (Array.isArray(apData) ? apData : []);
      } catch (apiErr) {
        console.warn('[Team Leader Cases] Backend unavailable, using empty AP cases:', apiErr.message);
      }

      const assignedList = (Array.isArray(apCases) ? apCases : []).map(c => ({
        ...c,
        source: c.source || (c.auditType === 'JOINT' || c.auditType === 'joint_audit' ? 'committee' : 'ap'),
        caseId: c.caseId || c.committeeCaseId || c.id,
      }));

      const mergedCases = assignedList;

      setCases(mergedCases);
      setTotalElements(mergedCases.length);
    } catch (err) {
      setError(err.message || 'Failed to load cases');
      console.error('[Team Leader Cases]', err);
    } finally {
      setLoading(false);
    }
  }, [teamLeaderId, currentPage, filters]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  return {
    cases,
    loading,
    error,
    currentPage,
    totalElements,
    filters,
    setPage: setCurrentPage,
    setFilters,
    refresh: fetchCases,
  };
}
