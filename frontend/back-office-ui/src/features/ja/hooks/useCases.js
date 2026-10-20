/**
 * useCases Hook
 * Manages cases list with pagination and filtering
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { committeeAPI } from '../services/api';

export function useCases() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchCases();
  }, [currentPage, filters, user?.taxCenter]);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const taxCenterFilter = user?.taxCenter ? { taxCenter: user.taxCenter } : {};
      const data = await committeeAPI.getCases(currentPage, 25, { ...filters, ...taxCenterFilter });
      setCases(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Failed to load cases');
      console.error('[Committee Cases]', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, user?.taxCenter]);

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
