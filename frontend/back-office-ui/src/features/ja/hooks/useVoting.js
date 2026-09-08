/**
 * useVoting Hook
 * Manages voting operations
 */

import { useState } from 'react';
import { committeeAPI } from '../services/api';

export function useVoting(caseId) {
  const [voteTally, setVoteTally] = useState(null);
  const [voteHistory, setVoteHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState(null);
  const [userVote, setUserVote] = useState(null);

  const fetchVoteTally = async () => {
    try {
      setLoading(true);
      const tally = await committeeAPI.getVoteTally(caseId);
      setVoteTally(tally);
      return tally;
    } catch (err) {
      setError(err.message || 'Failed to fetch vote tally');
      console.error('[Fetch Vote Tally]', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVoteHistory = async (page = 0) => {
    try {
      setLoading(true);
      const history = await committeeAPI.getVoteHistory(caseId, page);
      setVoteHistory(history.content || []);
      return history;
    } catch (err) {
      setError(err.message || 'Failed to fetch vote history');
      console.error('[Fetch Vote History]', err);
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (voteOption) => {
    try {
      setVoting(true);
      setError(null);
      const result = await committeeAPI.castVote(caseId, voteOption);
      setVoteTally(result);
      setUserVote(voteOption);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to cast vote';
      setError(errorMsg);
      console.error('[Cast Vote]', err);
      throw err;
    } finally {
      setVoting(false);
    }
  };

  return {
    voteTally,
    setVoteTally,
    voteHistory,
    loading,
    voting,
    error,
    userVote,
    fetchVoteTally,
    fetchVoteHistory,
    castVote,
  };
}
