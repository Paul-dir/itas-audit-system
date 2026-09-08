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

      // Fetch AP cases assigned to this team leader
      let apCases = [];
      try {
        const apData = await teamLeaderAPI.getAssignedCases(teamLeaderId, filters);
        apCases = apData?.data || apData?.content || (Array.isArray(apData) ? apData : []);
      } catch (apiErr) {
        console.warn('[Team Leader Cases] Backend unavailable, using empty AP cases:', apiErr.message);
      }

      // Fetch AP audit cases with PENDING_ASSIGNMENT status (after viability approved)
      let committeeCases = [];
      try {
        const committeeData = await teamLeaderAPI.getPendingAssignmentCases();
        committeeCases = committeeData?.data || committeeData?.content || (Array.isArray(committeeData) ? committeeData : []);
      } catch (apiErr) {
        console.warn('[Team Leader Cases] Backend unavailable, using empty committee cases:', apiErr.message);
      }

      // Fetch auditor nominations for committee cases to enrich with team info
      const enrichedCommitteeCases = [];
      for (const c of committeeCases) {
        const caseId = c.committeeCaseId || c.id;
        let auditorNominations = [];
        try {
          const nomData = await teamLeaderAPI.getAuditorNominations(caseId);
          auditorNominations = Array.isArray(nomData) ? nomData : [];
        } catch (nomErr) {
          // Nominations not available — proceed without
        }
        enrichedCommitteeCases.push({
          ...c,
          source: 'committee',
          caseId,
          auditorNominations,
        });
      }

      // Merge: AP assigned cases + committee incoming cases
      // Mark each with its source for the UI
      const apWithSource = (Array.isArray(apCases) ? apCases : []).map(c => ({
        ...c,
        source: 'ap',
        caseId: c.id,
      }));

      const committeeWithSource = enrichedCommitteeCases;

      // A case can have different IDs in the committee and AP responses.
      // Use the displayed case number as the shared identity and prefer the
      // AP record because it carries the latest Team Leader assignment state.
      const caseKey = (c) => c.caseCode || c.caseNumber || c.caseId || c.id;
      const mergedByKey = new Map();

      committeeWithSource.forEach(c => {
        mergedByKey.set(caseKey(c), c);
      });

      apWithSource.forEach(c => {
        const key = caseKey(c);
        mergedByKey.set(key, { ...mergedByKey.get(key), ...c });
      });

      const mergedCases = Array.from(mergedByKey.values());

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
