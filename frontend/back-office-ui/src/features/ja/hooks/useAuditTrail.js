/**
 * useAuditTrail Hook
 * Manages audit trail retrieval for cases and global view
 */

import { useState, useEffect, useCallback } from 'react';
import { committeeAPI } from '../services/api';

export function useAuditTrail(caseId = null, taxCenter = null) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchCaseTrail = useCallback(async (pageNum = page) => {
    if (!caseId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await committeeAPI.getCaseAuditTrail(caseId, pageNum);
      setEntries(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Failed to load audit trail');
      console.error('[useAuditTrail] fetchCaseTrail', err);
    } finally {
      setLoading(false);
    }
  }, [caseId, page]);

  const fetchGlobalTrail = useCallback(async (filters = {}, pageNum = page) => {
    try {
      setLoading(true);
      setError(null);
      const data = await committeeAPI.getGlobalAuditTrail({ ...filters, taxCenter }, pageNum);
      setEntries(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Failed to load global audit trail');
      console.error('[useAuditTrail] fetchGlobalTrail', err);
    } finally {
      setLoading(false);
    }
  }, [page, taxCenter]);

  useEffect(() => {
    if (caseId) {
      fetchCaseTrail();
    } else {
      fetchGlobalTrail();
    }
  }, [caseId, fetchCaseTrail, fetchGlobalTrail, taxCenter]);

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
    setPage,
    refresh: caseId ? fetchCaseTrail : fetchGlobalTrail,
    exportTrail,
  };
}
