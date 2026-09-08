/**
 * useResearch.js
 * 
 * Custom hook for research notes and comments CRUD
 * Validates: Notes creation, commenting, threaded discussions
 */

import { useState, useCallback, useEffect } from 'react';
import * as committeeClient from '../services/committeeClient';
import { useAuth } from '../../../context/AuthContext';

export function useResearch(caseId) {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedLoading, setFeedLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalFeedItems, setTotalFeedItems] = useState(0);

  /**
   * Fetch research notes
   */
  const fetchNotes = useCallback(async () => {
    if (!user?.id || !caseId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await committeeClient.getResearchNotes(caseId, user.id);
      setNotes(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch research notes');
      console.error('[useResearch] Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  }, [caseId, user?.id]);

  /**
   * Fetch research feed (chronological activities)
   */
  const fetchFeed = useCallback(async (page = 0) => {
    if (!user?.id || !caseId) return;

    setFeedLoading(true);
    try {
      const data = await committeeClient.getResearchFeed(caseId, page, 25, user.id);
      setFeed(data.content || data.data || []);
      setTotalFeedItems(data.totalElements || data.total || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error('[useResearch] Error fetching feed:', err);
    } finally {
      setFeedLoading(false);
    }
  }, [caseId, user?.id]);

  /**
   * Add research note
   */
  const addNote = useCallback(async (category, content) => {
    if (!user?.id || !caseId) {
      setError('Missing user or case information');
      return;
    }

    if (!category || !content) {
      setError('Category and content are required');
      return;
    }

    if (content.length > 10000) {
      setError('Note content exceeds 10,000 character limit');
      return;
    }

    setAdding(true);
    setError(null);
    try {
      const response = await committeeClient.addResearchNote(
        caseId,
        {
          category,
          content,
          authorId: user.id,
        },
        user.id
      );

      // Refresh notes and feed
      await fetchNotes();
      await fetchFeed(0);

      return response;
    } catch (err) {
      setError(err.message || 'Failed to add research note');
      console.error('[useResearch] Error adding note:', err);
      throw err;
    } finally {
      setAdding(false);
    }
  }, [caseId, user?.id, fetchNotes, fetchFeed]);

  /**
   * Add comment to research note
   */
  const addCommentToNote = useCallback(async (noteId, content, repliedToCommentId = null) => {
    if (!user?.id) {
      setError('User information missing');
      return;
    }

    if (!content) {
      setError('Comment content is required');
      return;
    }

    setCommenting(true);
    setError(null);
    try {
      const response = await committeeClient.addComment(
        noteId,
        {
          content,
          repliedToCommentId,
          authorId: user.id,
        },
        user.id
      );

      // Refresh notes and feed
      await fetchNotes();
      await fetchFeed(0);

      return response;
    } catch (err) {
      setError(err.message || 'Failed to add comment');
      console.error('[useResearch] Error adding comment:', err);
      throw err;
    } finally {
      setCommenting(false);
    }
  }, [user?.id, fetchNotes, fetchFeed]);

  /**
   * Auto-fetch on mount and caseId change
   */
  useEffect(() => {
    fetchNotes();
    fetchFeed(0);
  }, [caseId, fetchNotes, fetchFeed]);

  /**
   * Refresh all research data
   */
  const refresh = useCallback(async () => {
    await fetchNotes();
    await fetchFeed(0);
  }, [fetchNotes, fetchFeed]);

  /**
   * Navigate to different page in feed
   */
  const goToPage = useCallback((page) => {
    fetchFeed(page);
  }, [fetchFeed]);

  return {
    notes,
    feed,
    loading,
    feedLoading,
    adding,
    commenting,
    error,
    currentPage,
    totalFeedItems,
    addNote,
    addCommentToNote,
    refresh,
    goToPage,
  };
}
