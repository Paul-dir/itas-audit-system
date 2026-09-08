/**
 * useDashboard Hook
 * Manages team leader dashboard metrics state
 * Shows both committee-originated cases and AP-assigned cases
 */

import { useState, useEffect, useCallback } from 'react';
import { teamLeaderAPI } from '../services/api';

export function useDashboard(teamLeaderId) {
  const [metrics, setMetrics] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    if (!teamLeaderId) return;
    try {
      setLoading(true);
      setError(null);

      // Fetch team members from backend
      let team = [];
      try {
        const teamData = await teamLeaderAPI.getMyTeam(teamLeaderId);
        team = teamData?.auditors || [];
        setTeamMembers(team);
      } catch (apiErr) {
        console.warn('[Team Leader Dashboard] Could not fetch team:', apiErr.message);
        setTeamMembers([]);
      }

      // Fetch cases assigned to this team leader from AP system
      let assignedCases = [];
      let backendDashboard = {};
      try {
        const dashboardData = await teamLeaderAPI.getDashboard(teamLeaderId);
        backendDashboard = dashboardData?.data || dashboardData || {};
      } catch (apiErr) {
        console.warn('[Team Leader Dashboard] Backend summary unavailable:', apiErr.message);
      }
      try {
        const assignedData = await teamLeaderAPI.getAssignedCases(teamLeaderId);
        assignedCases = assignedData?.data || assignedData?.content || (Array.isArray(assignedData) ? assignedData : []);
      } catch (apiErr) {
        console.warn('[Team Leader Dashboard] Backend unavailable, using empty assigned cases:', apiErr.message);
      }

      // Separate assigned vs incoming from the combined list
      // getCasesForTeamLeader returns: assigned cases + PENDING_ASSIGNMENT (unassigned) cases
      const viableIncoming = Array.isArray(assignedCases)
        ? assignedCases.filter(c => c.status === 'PENDING_ASSIGNMENT' && !c.assignedTeamLeaderId)
        : [];
      const onlyAssigned = Array.isArray(assignedCases)
        ? assignedCases.filter(c => c.status !== 'PENDING_ASSIGNMENT' || c.assignedTeamLeaderId)
        : [];

      // Calculate metrics
      const totalAssigned = onlyAssigned.length + viableIncoming.length;
      const pendingAssignment = viableIncoming.length;
      const inProgress = Array.isArray(assignedCases)
        ? assignedCases.filter(c => c.status === 'IN_PROGRESS').length
        : 0;
      const completed = Array.isArray(assignedCases)
        ? assignedCases.filter(c => c.status === 'COMPLETED' || c.status === 'CLOSED').length
        : 0;

      // Risk breakdown from all cases
      const riskBreakdown = { critical: 0, high: 0, medium: 0, low: 0 };
      if (Array.isArray(assignedCases)) {
        assignedCases.forEach(c => {
          const level = (c.riskPriority || c.riskLevel || '').toLowerCase();
          if (level === 'critical') riskBreakdown.critical++;
          else if (level === 'high') riskBreakdown.high++;
          else if (level === 'medium') riskBreakdown.medium++;
          else riskBreakdown.low++;
        });
      }

      setMetrics({
        totalCases: totalAssigned,
        pendingAssignment,
        inProgress,
        completed,
        totalAssigned,
        riskBreakdown,
        incomingCases: viableIncoming,
        plansAwaitingReview: backendDashboard.plansAwaitingReview || 0,
        plansApproved: backendDashboard.plansApproved || 0,
        plansRejected: backendDashboard.plansRejected || 0,
      });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
      console.error('[Team Leader Dashboard]', err);
    } finally {
      setLoading(false);
    }
  }, [teamLeaderId]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    teamMembers,
    loading,
    error,
    refresh: fetchMetrics,
  };
}
