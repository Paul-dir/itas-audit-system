/**
 * REAL-TIME ASSIGNMENTS HOOK
 * 
 * Automatically tracks ALL case assignments in real-time:
 * - Loads initial data
 * - Auto-refreshes when data changes
 * - Shows new assignments immediately
 * - Shows historical assignments
 * - Live updates for Team Leader workload
 * - Live updates for Auditor assignments
 */

import { useState, useEffect, useCallback } from 'react';
import { useData } from '../services/dataService';
import { getAllUsers } from '../data/orgStructure';

/**
 * Hook to get real-time case assignments for Process Owner
 * Returns: { cases, teamLeaders, casesByAuditType, stats, loading, error }
 */
export function useProcessOwnerAssignments(taxCenter, region) {
  const { data } = useData();
  const [cases, setCases] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [casesByAuditType, setCasesByAuditType] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const loadAssignments = useCallback(() => {
    try {
      setLoading(true);
      if (!data) return;
      
      const allOrgUsers = getAllUsers();

      // Get ALL cases (including newly assigned and historical)
      const allCases = (data.auditCases || [])
        .filter(c => {
          // Include: PENDING, ASSIGNED_TO_TEAM_LEADER, ASSIGNED_TO_AUDITOR
          // Exclude: COMPLETED, STORED (unless you want to show history)
          const activeStatuses = [
            'PENDING_PROCESS_OWNER',
            'ASSIGNED_TO_TEAM_LEADER',
            'ASSIGNED_TO_AUDITOR',
            'IN_EXECUTION'
          ];
          
          // Filter by region/tax center if provided
          if (region && taxCenter) {
            return c.region === region && 
                   c.taxCenter === taxCenter &&
                   activeStatuses.includes(c.status);
          }
          return activeStatuses.includes(c.status);
        })
        .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));

      // Get Team Leaders for this tax center
      const allTLs = allOrgUsers.filter(u => 
        u.role === 'team_leader' &&
        u.org_context.assignedTaxCenter === taxCenter
      );

      // Group cases by audit type
      const grouped = {};
      allCases.forEach(auditCase => {
        const type = auditCase.auditType || 'Unclassified';
        if (!grouped[type]) {
          grouped[type] = [];
        }
        grouped[type].push(auditCase);
      });

      // Sort cases within each type
      Object.keys(grouped).forEach(type => {
        grouped[type].sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));
      });

      // Calculate stats
      const calculatedStats = {};
      Object.entries(grouped).forEach(([type, typeCases]) => {
        calculatedStats[type] = {
          total: typeCases.length,
          assigned: typeCases.filter(c => c.status === 'ASSIGNED_TO_TEAM_LEADER').length,
          pending: typeCases.filter(c => c.status === 'PENDING_PROCESS_OWNER').length,
          routed: typeCases.filter(c => c.status === 'ASSIGNED_TO_AUDITOR').length
        };
      });

      setCases(allCases);
      setTeamLeaders(allTLs);
      setCasesByAuditType(grouped);
      setStats(calculatedStats);
      setError(null);

      console.log('🔄 Real-time assignments loaded:', {
        totalCases: allCases.length,
        auditTypes: Object.keys(grouped).length,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (err) {
      console.error('Error loading assignments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [data, taxCenter, region]);

  // Load on mount
  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  // Set up auto-refresh every 5 seconds to catch real-time changes
  useEffect(() => {
    const interval = setInterval(() => {
      loadAssignments();
      setRefreshCount(prev => prev + 1);
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [loadAssignments]);

  // Manual refresh function
  const refresh = useCallback(() => {
    loadAssignments();
  }, [loadAssignments]);

  return {
    cases,
    teamLeaders,
    casesByAuditType,
    stats,
    loading,
    error,
    refresh,
    lastRefresh: new Date()
  };
}

/**
 * Hook to get real-time case assignments for Team Leader
 * Returns: { assignedCases, auditors, auditorsStats, loading, error }
 */
export function useTeamLeaderAssignments(teamLeaderId) {
  const { data } = useData();
  const [assignedCases, setAssignedCases] = useState([]);
  const [auditors, setAuditors] = useState([]);
  const [auditorStats, setAuditorStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const loadAssignments = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      
      // 🔍 TRACE 1: Check if teamLeaderId is provided
      console.log(`🔍 [useTeamLeaderAssignments] Called with teamLeaderId:`, teamLeaderId);
      
      if (!teamLeaderId) {
        console.warn(`⚠️ [useTeamLeaderAssignments] No teamLeaderId provided - skipping load`);
        setError('Team Leader ID not provided');
        setLoading(false);
        return;
      }

      // Using data from useData hook
      const allOrgUsers = getAllUsers();
      
      console.log(`📊 [useTeamLeaderAssignments] Loaded ${allOrgUsers.length} org users`);

      // Get current Team Leader
      let currentTL = allOrgUsers.find(u => u.id === teamLeaderId && u.role === 'team_leader');
      
      console.log(`🔍 [useTeamLeaderAssignments] Direct org lookup result:`, currentTL ? `Found ${currentTL.full_name}` : 'Not found');
      
      // If not found in org structure, it might be a demo/cached user
      // Try to get from auth context stored in localStorage
      if (!currentTL) {
        const authContext = localStorage.getItem('auth_context');
        console.log(`🔍 [useTeamLeaderAssignments] Checking auth cache...`);
        
        if (authContext) {
          try {
            const auth = JSON.parse(authContext);
            console.log(`📝 [useTeamLeaderAssignments] Auth cache content:`, {
              userId: auth.userId,
              role: auth.role,
              fullName: auth.fullName
            });
            
            if (auth.userId === teamLeaderId && auth.role === 'team_leader') {
              // Use the auth context as fallback
              currentTL = {
                id: auth.userId,
                full_name: auth.fullName,
                role: auth.role,
                org_context: auth.org_context || {}
              };
              console.log(`✅ [useTeamLeaderAssignments] Using cached Team Leader: ${auth.fullName}`);
            }
          } catch (parseErr) {
            console.error(`❌ [useTeamLeaderAssignments] Error parsing auth cache:`, parseErr);
          }
        }
      }
      
      if (!currentTL) {
        console.warn(`⚠️ [useTeamLeaderAssignments] Team Leader not found: ${teamLeaderId}`);
        console.warn(`   Searched in org structure (${allOrgUsers.length} users) and auth cache`);
        setError('Team Leader not found');
        setLoading(false);
        return;
      }
      
      console.log(`✅ [useTeamLeaderAssignments] Team Leader resolved:`, {
        id: currentTL.id,
        fullName: currentTL.full_name,
        teamId: currentTL.org_context?.teamId
      });

      // Get ALL cases assigned to this TL (both new and historical)
      const tlCases = (data.auditCases || [])
        .filter(c => {
          // Include: ASSIGNED_TO_TEAM_LEADER, ASSIGNED_TO_AUDITOR, IN_EXECUTION
          // Show everything except COMPLETED or STORED
          const activeStatuses = [
            'ASSIGNED_TO_TEAM_LEADER',
            'ASSIGNED_TO_AUDITOR',
            'IN_EXECUTION'
          ];
          return c.assignedTeamLeaderId === currentTL.id && 
                 activeStatuses.includes(c.status);
        })
        .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));

      console.log(`📋 [useTeamLeaderAssignments] Loaded ${tlCases.length} cases for TL ${currentTL.full_name}`);

      // Get all auditors under this Team Leader (same team)
      const tlAuditors = allOrgUsers.filter(u =>
        u.role === 'auditor' &&
        u.org_context.teamId === currentTL.org_context.teamId
      );
      
      console.log(`👥 [useTeamLeaderAssignments] Team has ${tlAuditors.length} auditors`);

      // Calculate stats for each auditor
      const audStats = {};
      tlAuditors.forEach(auditor => {
        const auditorCases = tlCases.filter(c => c.assignedAuditorId === auditor.id);
        audStats[auditor.id] = {
          total: auditorCases.length,
          active: auditorCases.filter(c => c.status === 'ASSIGNED_TO_AUDITOR').length,
          pending: auditorCases.filter(c => c.status === 'ASSIGNED_TO_TEAM_LEADER').length,
          inExecution: auditorCases.filter(c => c.status === 'IN_EXECUTION').length
        };
        console.log(`  📊 Auditor ${auditor.full_name}: ${audStats[auditor.id].total} cases`);
      });

      setAssignedCases(tlCases);
      setAuditors(tlAuditors);
      setAuditorStats(audStats);
      setError(null);

      console.log('✅ [useTeamLeaderAssignments] Data loaded successfully:', {
        totalCases: tlCases.length,
        totalAuditors: tlAuditors.length,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (err) {
      console.error('❌ [useTeamLeaderAssignments] Error loading TL assignments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [teamLeaderId]);

  // Load on mount
  useEffect(() => {
    console.log(`🔷 [useTeamLeaderAssignments] Mount effect - teamLeaderId:`, teamLeaderId);
    loadAssignments();
  }, [loadAssignments]);

  // Set up auto-refresh every 5 seconds
  useEffect(() => {
    if (!teamLeaderId) {
      console.log(`⏸️  [useTeamLeaderAssignments] Skipping interval - no teamLeaderId`);
      return;
    }
    
    console.log(`🔄 [useTeamLeaderAssignments] Setting up 5-second auto-refresh`);
    const interval = setInterval(() => {
      console.log(`🔄 [useTeamLeaderAssignments] Auto-refresh triggered`);
      loadAssignments();
      setRefreshCount(prev => prev + 1);
    }, 5000); // Refresh every 5 seconds

    return () => {
      console.log(`🔴 [useTeamLeaderAssignments] Clearing interval`);
      clearInterval(interval);
    };
  }, [loadAssignments, teamLeaderId]);

  // Manual refresh function
  const refresh = useCallback(() => {
    loadAssignments();
  }, [loadAssignments]);

  return {
    assignedCases,
    auditors,
    auditorStats,
    loading,
    error,
    refresh,
    lastRefresh: new Date()
  };
}

/**
 * Get all Team Leader assignments in real-time
 * Shows: Which Team Leaders have how many cases
 */
export function useTeamLeaderWorkload(taxCenter) {
  const { data } = useData();
  const [tlWorkload, setTLWorkload] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkload = () => {
      // Using data from useData hook
      const allOrgUsers = getAllUsers();

      const tls = allOrgUsers.filter(u => 
        u.role === 'team_leader' &&
        u.org_context.assignedTaxCenter === taxCenter
      );

      const workload = {};
      tls.forEach(tl => {
        const tlCases = (data.auditCases || []).filter(c => 
          c.assignedTeamLeaderId === tl.id
        );
        workload[tl.id] = {
          teamLeader: tl.full_name,
          auditType: tl.org_context.auditType,
          total: tlCases.length,
          routed: tlCases.filter(c => c.status === 'ASSIGNED_TO_AUDITOR').length,
          pending: tlCases.filter(c => c.status === 'ASSIGNED_TO_TEAM_LEADER').length
        };
      });

      setTLWorkload(workload);
      setLoading(false);
    };

    loadWorkload();

    // Auto-refresh every 5 seconds
    const interval = setInterval(loadWorkload, 5000);
    return () => clearInterval(interval);
  }, [taxCenter]);

  return { tlWorkload, loading };
}

/**
 * Get auditor workload in real-time
 * Shows: Which auditors have how many cases
 */
export function useAuditorWorkload(teamLeaderId) {
  const { data } = useData();
  const [auditorWorkload, setAuditorWorkload] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkload = () => {
      // Using data from useData hook
      const allOrgUsers = getAllUsers();

      const tl = allOrgUsers.find(u => u.id === teamLeaderId && u.role === 'team_leader');
      if (!tl) return;

      const auditors = allOrgUsers.filter(u =>
        u.role === 'auditor' &&
        u.org_context.teamId === tl.org_context.teamId
      );

      const workload = {};
      auditors.forEach(auditor => {
        const auditorCases = (data.auditCases || []).filter(c => 
          c.assignedAuditorId === auditor.id
        );
        workload[auditor.id] = {
          auditor: auditor.full_name,
          total: auditorCases.length,
          active: auditorCases.filter(c => c.status === 'ASSIGNED_TO_AUDITOR').length,
          pending: auditorCases.filter(c => c.status === 'ASSIGNED_TO_TEAM_LEADER').length
        };
      });

      setAuditorWorkload(workload);
      setLoading(false);
    };

    loadWorkload();

    // Auto-refresh every 5 seconds
    const interval = setInterval(loadWorkload, 5000);
    return () => clearInterval(interval);
  }, [teamLeaderId]);

  return { auditorWorkload, loading };
}
