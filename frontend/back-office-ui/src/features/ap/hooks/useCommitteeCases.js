/**
 * useCommitteeCases.js
 * 
 * Custom hook for fetching and managing committee cases with filtering and sorting
 * Validates: Committee case portfolio management with real-time filtering
 */

import { useState, useCallback, useEffect } from 'react';
import * as committeeClient from '../services/committeeClient';
import { useAuth } from '../../../context/AuthContext';

export function useCommitteeCases() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: null,
    priority: null,
    search: null,
    sort: 'deadline',
    page: 0,
    size: 25,
  });
  const [totalItems, setTotalItems] = useState(0);

  /**
   * Fetch cases based on current filters
   */
  const fetchCases = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await committeeClient.getCommitteeCases(filters, user.id);
      setCases(response.content || response.data || []);
      setTotalItems(response.totalElements || response.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch cases');
      console.error('[useCommitteeCases] Error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, user?.id]);

  /**
   * Auto-fetch when filters change
   */
  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  /**
   * Update filter and reset pagination
   */
  const updateFilter = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 0, // Reset to first page on filter change
    }));
  }, []);

  /**
   * Change page
   */
  const setPage = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({
      status: null,
      priority: null,
      search: null,
      sort: 'deadline',
      page: 0,
      size: 25,
    });
  }, []);

  /**
   * Refresh cases
   */
  const refresh = useCallback(() => {
    fetchCases();
  }, [fetchCases]);

  return {
    cases,
    loading,
    error,
    filters,
    updateFilter,
    setPage,
    clearFilters,
    refresh,
    totalItems,
    currentPage: filters.page,
  };
}
