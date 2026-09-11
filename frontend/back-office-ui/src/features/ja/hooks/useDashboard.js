/**
 * useDashboard Hook
 * Manages dashboard metrics state
 */

import { useState, useEffect, useCallback } from 'react';
import { committeeAPI } from '../services/api';

export function useDashboard(taxCenter) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await committeeAPI.getDashboard(taxCenter);
      setMetrics(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
      console.error('[Committee Dashboard]', err);
    } finally {
      setLoading(false);
    }
  }, [taxCenter]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    loading,
    error,
    refresh: fetchMetrics,
  };
}
