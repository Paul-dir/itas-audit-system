/**
 * useVoting.js
 * 
 * Custom hook for managing advisory voting
 * Validates: Vote casting, tally retrieval, voting state
 */

import { useState, useCallback, useEffect } from 'react';
import * as committeeClient from '../services/committeeClient';
import { useAuth } from '../../../context/AuthContext';

export function useVoting(caseId) {
  const { user } = useAuth();
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [tally, setTally] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch vote tally
   */
  const fetchTally = useCallback(async () => {
    if (!user?.id || !caseId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await committeeClient.getVoteTally(caseId, user.id);
      setTally(data);

      // Check if user has already voted
      if (data.votes && Array.isArray(data.votes)) {
        const myVote = data.votes.find(v => v.memberId === user.id);
        if (myVote) {
          setHasVoted(true);
          setUserVote(myVote);
        } else {
          setHasVoted(false);
          setUserVote(null);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch vote tally');
      console.error('[useVoting] Error fetching tally:', err);
    } finally {
      setLoading(false);
    }
  }, [caseId, user?.id]);

  /**
   * Fetch vote history
   */
  const fetchHistory = useCallback(async () => {
    if (!user?.id || !caseId) return;

    try {
      const data = await committeeClient.getVoteHistory(caseId, user.id);
      setHistory(data || []);
    } catch (err) {
      console.error('[useVoting] Error fetching history:', err);
    }
  }, [caseId, user?.id]);

  /**
   * Cast vote
   */
  const castVote = useCallback(async (voteOption, reasoning = '') => {
    if (!user?.id || !caseId) {
      setError('Missing user or case information');
      return;
    }

    if (hasVoted) {
      setError('You have already voted on this case');
      return;
    }

    setVoting(true);
    setError(null);
    try {
      const response = await committeeClient.castAdvisoryVote(
        caseId,
        { voteOption, reasoning },
        user.id
      );

      setHasVoted(true);
      setUserVote({
        memberId: user.id,
        voteOption,
        reasoning,
        votedAt: new Date().toISOString(),
      });

      // Refresh tally and history
      await fetchTally();
      await fetchHistory();

      return response;
    } catch (err) {
      setError(err.message || 'Failed to cast vote');
      console.error('[useVoting] Error casting vote:', err);
      throw err;
    } finally {
      setVoting(false);
    }
  }, [caseId, user?.id, hasVoted, fetchTally, fetchHistory]);

  /**
   * Auto-fetch on mount and caseId change
   */
  useEffect(() => {
    fetchTally();
    fetchHistory();
  }, [caseId, fetchTally, fetchHistory]);

  /**
   * Refresh voting data
   */
  const refresh = useCallback(async () => {
    await fetchTally();
    await fetchHistory();
  }, [fetchTally, fetchHistory]);

  return {
    hasVoted,
    userVote,
    tally,
    history,
    loading,
    voting,
    error,
    castVote,
    refresh,
  };
}
