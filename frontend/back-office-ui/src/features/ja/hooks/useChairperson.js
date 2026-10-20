/**
 * useChairperson Hook
 * Manages chairperson-exclusive actions:
 *   appoint team lead, finalize viability, assign team, transfer to execution, override SLA
 */

import { useState } from 'react';
import { committeeAPI } from '../services/api';

export function useChairperson() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const appointTeamLead = async (caseId, auditorId, reason = '') => {
    try {
      setLoading(true);
      setError(null);
      const result = await committeeAPI.appointTeamLead(caseId, auditorId, reason);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to appoint team lead');
      console.error('[useChairperson] appointTeamLead', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const finalizeViability = async (caseId, decision, reason = '', signature = '') => {
    try {
      setLoading(true);
      setError(null);
      const result = await committeeAPI.finalizeViability(caseId, decision, reason, signature);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to finalize viability');
      console.error('[useChairperson] finalizeViability', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignTeam = async (caseId, auditorIds) => {
    try {
      setLoading(true);
      setError(null);
      const result = await committeeAPI.assignTeam(caseId, auditorIds);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to assign team');
      console.error('[useChairperson] assignTeam', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const transferToExecution = async (caseId, { teamLeaderId, teamMemberIds, committeeSummary }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await committeeAPI.transferToExecution(caseId, {
        teamLeaderId,
        teamMemberIds,
        committeeSummary,
      });
      return result;
    } catch (err) {
      setError(err.message || 'Failed to transfer to execution');
      console.error('[useChairperson] transferToExecution', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const overrideSLA = async (caseId, extensionDays, reason) => {
    try {
      setLoading(true);
      setError(null);
      const result = await committeeAPI.overrideSLA(caseId, {
        extensionBusinessDays: extensionDays,
        reason,
      });
      return result;
    } catch (err) {
      setError(err.message || 'Failed to override SLA');
      console.error('[useChairperson] overrideSLA', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    appointTeamLead,
    finalizeViability,
    assignTeam,
    transferToExecution,
    overrideSLA,
  };
}
