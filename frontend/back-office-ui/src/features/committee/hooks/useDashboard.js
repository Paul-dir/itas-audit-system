/**
 * useDashboard Hook
 * Manages dashboard metrics state
 */

import { useState, useEffect } from 'react';
import { committeeAPI } from '../services/api';

export function useDashboard(taxCenter) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, [taxCenter]);

  const fetchMetrics = async () => {
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
  };

  return {
    metrics,
    loading,
    error,
    refresh: fetchMetrics,
  };
}
