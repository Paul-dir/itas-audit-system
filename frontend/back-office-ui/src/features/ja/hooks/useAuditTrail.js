/**
 * useAuditTrail Hook
 * Manages audit trail retrieval for cases and global view across all actions
 */

import { useState, useEffect, useCallback } from 'react';
import { committeeAPI } from '../services/api';

export function useAuditTrail(caseId = null, taxCenter = null) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [activeFilters, setActiveFilters] = useState({});

  const fetchCaseTrail = useCallback(async (pageNum = 0) => {
    if (!caseId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await committeeAPI.getCaseAuditTrail(caseId, pageNum);
      setEntries(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Failed to load case audit trail');
      console.error('[useAuditTrail] fetchCaseTrail', err);
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  const fetchGlobalTrail = useCallback(async (filters = {}, pageNum = 0) => {
    try {
      setLoading(true);
      setError(null);
      const cleanFilters = {};
      Object.entries({ ...filters }).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '' && v !== 'All') {
          cleanFilters[k] = v;
        }
      });
      const data = await committeeAPI.getGlobalAuditTrail(cleanFilters, pageNum);
      setEntries(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Failed to load global audit trail');
      console.error('[useAuditTrail] fetchGlobalTrail', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const changePage = useCallback((newPage) => {
    setPage(newPage);
    if (caseId) {
      fetchCaseTrail(newPage);
    } else {
      fetchGlobalTrail(activeFilters, newPage);
    }
  }, [caseId, fetchCaseTrail, fetchGlobalTrail, activeFilters]);

  const applyFilters = useCallback((newFilters) => {
    const filtersToUse = newFilters !== undefined ? newFilters : activeFilters;
    setActiveFilters(filtersToUse || {});
    setPage(0);
    if (caseId) {
      fetchCaseTrail(0);
    } else {
      fetchGlobalTrail(filtersToUse || {}, 0);
    }
  }, [caseId, fetchCaseTrail, fetchGlobalTrail, activeFilters]);

  useEffect(() => {
    if (caseId) {
      fetchCaseTrail(0);
    } else {
      fetchGlobalTrail(activeFilters, 0);
    }
  }, [caseId]);

  const exportTrail = async (format = 'csv') => {
    try {
      setError(null);
      await committeeAPI.exportAuditTrail(caseId, format);
    } catch (err) {
      setError(err.message || 'Failed to export audit trail');
      console.error('[useAuditTrail] exportTrail', err);
      throw err;
    }
  };

  return {
    entries,
    loading,
    error,
    totalElements,
    page,
    setPage: changePage,
    refresh: applyFilters,
    exportTrail,
  };
}
