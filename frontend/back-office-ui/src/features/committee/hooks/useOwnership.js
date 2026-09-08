/**
 * useOwnership Hook
 * Manages case ownership operations (take/release)
 */

import { useState } from 'react';
import { committeeAPI } from '../services/api';

export function useOwnership(caseId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentOwner, setCurrentOwner] = useState(null);

  const takeOwnership = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await committeeAPI.takeOwnership(caseId);
      setCurrentOwner(result.currentOwnerId);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to take ownership';
      setError(errorMsg);
      console.error('[Take Ownership]', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const releaseOwnership = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await committeeAPI.releaseOwnership(caseId);
      setCurrentOwner(null);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to release ownership';
      setError(errorMsg);
      console.error('[Release Ownership]', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    currentOwner,
    takeOwnership,
    releaseOwnership,
  };
}
