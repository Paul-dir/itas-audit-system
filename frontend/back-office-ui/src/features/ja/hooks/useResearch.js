/**
 * useResearch Hook
 * Manages research notes, comments, and attachments for a case
 */

import { useState, useEffect, useCallback } from 'react';
import { committeeAPI } from '../services/api';

export function useResearch(caseId) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [addingNote, setAddingNote] = useState(false);

  const fetchNotes = useCallback(async (pageNum = page) => {
    if (!caseId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await committeeAPI.getResearchNotes(caseId, pageNum);
      setNotes(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Failed to load research notes');
      console.error('[useResearch] fetchNotes', err);
    } finally {
      setLoading(false);
    }
  }, [caseId, page]);

  useEffect(() => {
    fetchNotes();
  }, [caseId, fetchNotes]);

  const addNote = async (content, category = 'Observation') => {
    try {
      setAddingNote(true);
      setError(null);
      const note = await committeeAPI.addResearchNote(caseId, { content, category });
      setNotes(prev => [note, ...prev]);
      return note;
    } catch (err) {
      setError(err.message || 'Failed to add note');
      console.error('[useResearch] addNote', err);
      throw err;
    } finally {
      setAddingNote(false);
    }
  };

  const addCommentToNote = async (noteId, content) => {
    try {
      setError(null);
      const comment = await committeeAPI.addComment(noteId, { content });
      // Update the note in state to include the new comment
      setNotes(prev =>
        prev.map(n =>
          n.id === noteId
            ? { ...n, comments: [...(n.comments || []), comment] }
            : n
        )
      );
      return comment;
    } catch (err) {
      setError(err.message || 'Failed to add comment');
      console.error('[useResearch] addComment', err);
      throw err;
    }
  };

  const uploadAttachment = async (noteId, file, description = '') => {
    try {
      setError(null);
      await committeeAPI.uploadAttachment(noteId, file, description);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to upload attachment');
      console.error('[useResearch] uploadAttachment', err);
      throw err;
    }
  };

  return {
    notes,
    loading,
    error,
    addingNote,
    totalElements,
    page,
    setPage,
    refresh: fetchNotes,
    addNote,
    addCommentToNote,
    uploadAttachment,
  };
}
