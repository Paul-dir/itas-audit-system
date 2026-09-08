/**
 * useSession.js
 * 
 * Custom hook for committee session management
 * Validates: Session creation and management
 */

import { useState, useCallback, useEffect } from 'react';
import * as committeeClient from '../services/committeeClient';
import { useAuth } from '../../../context/AuthContext';

export function useSession() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  /**
   * Fetch sessions
   */
  const fetchSessions = useCallback(async (page = 0) => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);
    try {
      const data = await committeeClient.getSessions(page, 25, user.id);
      setSessions(data.content || data.data || []);
      setTotalSessions(data.totalElements || data.total || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message || 'Failed to fetch sessions');
      console.error('[useSession] Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  /**
   * Create session
   */
  const createNewSession = useCallback(async (sessionData) => {
    if (!user?.id) {
      setError('User information missing');
      return;
    }

    setCreating(true);
    setError(null);
    try {
      const response = await committeeClient.createSession(
        {
          ...sessionData,
          chairpersonId: user.id,
        },
        user.id
      );

      // Refresh sessions
      await fetchSessions(0);

      return response;
    } catch (err) {
      setError(err.message || 'Failed to create session');
      console.error('[useSession] Error creating session:', err);
      throw err;
    } finally {
      setCreating(false);
    }
  }, [user?.id, fetchSessions]);

  /**
   * Auto-fetch on mount
   */
  useEffect(() => {
    fetchSessions(0);
  }, [fetchSessions]);

  /**
   * Refresh sessions
   */
  const refresh = useCallback(async () => {
    await fetchSessions(0);
  }, [fetchSessions]);

  /**
   * Navigate to page
   */
  const goToPage = useCallback((page) => {
    fetchSessions(page);
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    creating,
    error,
    currentPage,
    totalSessions,
    createNewSession,
    refresh,
    goToPage,
  };
}
