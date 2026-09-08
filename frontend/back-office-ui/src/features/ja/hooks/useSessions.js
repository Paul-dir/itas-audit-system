/**
 * useSessions Hook
 * Manages committee session creation, listing, and attendee management
 */

import { useState, useEffect, useCallback } from 'react';
import { committeeAPI } from '../services/api';

export function useSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [creating, setCreating] = useState(false);

  const fetchSessions = useCallback(async (pageNum = page) => {
    try {
      setLoading(true);
      setError(null);
      const data = await committeeAPI.listSessions(pageNum);
      setSessions(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Failed to load sessions');
      console.error('[useSessions] fetchSessions', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const createSession = async ({ sessionName, agenda, scheduledDate, caseId }) => {
    try {
      setCreating(true);
      setError(null);
      const session = await committeeAPI.createSession({ sessionName, agenda, scheduledDate, caseId });
      setSessions(prev => [session, ...prev]);
      return session;
    } catch (err) {
      setError(err.message || 'Failed to create session');
      console.error('[useSessions] createSession', err);
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const addAttendees = async (sessionId, memberIds) => {
    try {
      setError(null);
      const updated = await committeeAPI.addAttendees(sessionId, { memberIds });
      setSessions(prev =>
        prev.map(s => (s.id === sessionId ? updated : s))
      );
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to add attendees');
      console.error('[useSessions] addAttendees', err);
      throw err;
    }
  };

  const getAttendees = async (sessionId) => {
    try {
      const data = await committeeAPI.getAttendees(sessionId);
      return data.content || [];
    } catch (err) {
      console.error('[useSessions] getAttendees', err);
      return [];
    }
  };

  return {
    sessions,
    loading,
    error,
    creating,
    totalElements,
    page,
    setPage,
    refresh: fetchSessions,
    createSession,
    addAttendees,
    getAttendees,
  };
}
