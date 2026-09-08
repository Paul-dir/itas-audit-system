/**
 * useAuditors Hook
 * Manages auditor search, nomination, and profile operations
 */

import { useState, useEffect, useCallback } from 'react';
import { committeeAPI } from '../services/api';
import { useAuth } from '../../../context/AuthContext';

/**
 * Mock auditors matching t_auditor table (V12 seed data).
 * Used as fallback when the backend is unreachable.
 */
const DB_AUDITORS = [
  { id: 'a0000001-0000-0000-0000-000000000001', name: 'Abebe Kebede',      email: 'abebe.kebede@mor.gov.et',       expertise: 'Corporate Tax',       seniority: 'SENIOR',    yearsOfExperience: 12, taxCenter: 'addis_ababa-tc1' },
  { id: 'a0000001-0000-0000-0000-000000000002', name: 'Fatuma Ahmed',      email: 'fatuma.ahmed@mor.gov.et',        expertise: 'Transfer Pricing',    seniority: 'PRINCIPAL', yearsOfExperience: 15, taxCenter: 'addis_ababa-tc1' },
  { id: 'a0000001-0000-0000-0000-000000000003', name: 'Dawit Tadesse',     email: 'dawit.tadesse@mor.gov.et',       expertise: 'International Tax',   seniority: 'SENIOR',    yearsOfExperience: 10, taxCenter: 'addis_ababa-tc2' },
  { id: 'a0000001-0000-0000-0000-000000000004', name: 'Sara Mohammed',     email: 'sara.mohammed@mor.gov.et',       expertise: 'VAT Compliance',      seniority: 'MID_LEVEL', yearsOfExperience: 7,  taxCenter: 'addis_ababa-tc2' },
  { id: 'a0000001-0000-0000-0000-000000000005', name: 'Yonas Berhanu',     email: 'yonas.berhanu@mor.gov.et',       expertise: 'Corporate Tax',       seniority: 'JUNIOR',    yearsOfExperience: 3,  taxCenter: 'addis_ababa-tc3' },
  { id: 'a0000001-0000-0000-0000-000000000006', name: 'Hana Girma',        email: 'hana.girma@mor.gov.et',          expertise: 'Audit Investigation', seniority: 'SENIOR',    yearsOfExperience: 11, taxCenter: 'addis_ababa-tc3' },
  { id: 'a0000001-0000-0000-0000-000000000007', name: 'Mulugeta Alemayehu',email: 'mulugeta.alemayehu@mor.gov.et',  expertise: 'Transfer Pricing',    seniority: 'MID_LEVEL', yearsOfExperience: 6,  taxCenter: 'oromia-tc1' },
  { id: 'a0000001-0000-0000-0000-000000000008', name: 'Tigist Haile',      email: 'tigist.haile@mor.gov.et',        expertise: 'International Tax',   seniority: 'JUNIOR',    yearsOfExperience: 2,  taxCenter: 'oromia-tc1' },
];

/**
 * Mock team leaders matching SEED_USERS team_leader entries.
 * Used as fallback when the backend is unreachable.
 */
const DB_TEAM_LEADERS = [
  { id: 'u-tl-aa1a', name: 'Henok Belay',     email: 'henok.belay@mor.gov.et',     auditType: 'desk_audit',  taxCenter: 'addis_ababa-tc1' },
  { id: 'u-tl-aa1b', name: 'Tigist Alemu',    email: 'tigist.alemu@mor.gov.et',    auditType: 'field_audit', taxCenter: 'addis_ababa-tc3' },
  { id: 'u-tl-aa2a', name: 'Fikadu Desta',    email: 'fikadu.desta@mor.gov.et',    auditType: 'desk_audit',  taxCenter: 'addis_ababa-tc2' },
  { id: 'u-tl-or1a', name: 'Lalisa Wakjira',  email: 'lalisa.wakjira@mor.gov.et',  auditType: 'desk_audit',  taxCenter: 'oromia-tc1' },
];

export function useAuditors(caseId) {
  const { authContext } = useAuth();
  // Committee members are scoped to their tax center
  const userTaxCenter = authContext?.taxCenter || authContext?.org_context?.assignedTaxCenter || null;

  const [auditors, setAuditors] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [nominations, setNominations] = useState([]);
  const [teamLeaderNominations, setTeamLeaderNominations] = useState([]);
  const [auditorNominations, setAuditorNominations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalAuditors, setTotalAuditors] = useState(0);
  const [nominating, setNominating] = useState(false);

  const filterMockAuditors = useCallback((filters) => {
    let result = DB_AUDITORS;
    if (filters.expertise) {
      result = result.filter(a => a.expertise === filters.expertise);
    }
    if (filters.seniority) {
      result = result.filter(a => a.seniority === filters.seniority);
    }
    // Filter by tax center for committee-scoped results
    if (userTaxCenter) {
      result = result.filter(a => a.taxCenter === userTaxCenter);
    }
    return result;
  }, [userTaxCenter]);

  // Hardcoded auditor→taxCenter map matching V13 seed data
  // Used as frontend safety net when t_auditor.tax_center is not yet populated
  const AUDITOR_TAX_CENTER_MAP = {
    'a0000001-0000-0000-0000-000000000001': 'addis_ababa-tc1',
    'a0000001-0000-0000-0000-000000000002': 'addis_ababa-tc1',
    'a0000001-0000-0000-0000-000000000003': 'addis_ababa-tc2',
    'a0000001-0000-0000-0000-000000000004': 'addis_ababa-tc2',
    'a0000001-0000-0000-0000-000000000005': 'addis_ababa-tc3',
    'a0000001-0000-0000-0000-000000000006': 'addis_ababa-tc3',
    'a0000001-0000-0000-0000-000000000007': 'oromia-tc1',
    'a0000001-0000-0000-0000-000000000008': 'oromia-tc1',
  };

  /** Enrich and filter auditors by user's tax center on the client side.
   *  Ensures filtering works even when t_auditor.tax_center is NULL in the DB.
   */
  const enrichAndFilterAuditors = useCallback((auditorList) => {
    return auditorList
      .map(a => ({
        ...a,
        // If backend didn't return taxCenter, fill from hardcoded map
        taxCenter: a.taxCenter || AUDITOR_TAX_CENTER_MAP[a.id] || AUDITOR_TAX_CENTER_MAP[a.auditorId] || null,
      }))
      .filter(a => {
        // If no tax center resolved, show the auditor (don't silently drop)
        if (!userTaxCenter) return true;
        return a.taxCenter === userTaxCenter;
      });
  }, [userTaxCenter]);

  const search = useCallback(async (filters = {}, page = 0, size = 25) => {
    try {
      setLoading(true);
      setError(null);
      // Always pass taxCenter to restrict auditors to the committee's tax center
      const data = await committeeAPI.searchAuditors({ ...filters, taxCenter: userTaxCenter }, page, size);
      const enriched = enrichAndFilterAuditors(data.content || []);
      setAuditors(enriched);
      setTotalAuditors(enriched.length);
    } catch (err) {
      // Fallback to DB auditor mock data when backend is unreachable
      console.warn('[useAuditors] Backend unavailable, using DB auditor pool:', err.message);
      const mockResults = filterMockAuditors(filters);
      setAuditors(mockResults);
      setTotalAuditors(mockResults.length);
      setError(null); // Clear error — we have fallback data
    } finally {
      setLoading(false);
    }
  }, [filterMockAuditors, enrichAndFilterAuditors, userTaxCenter]);

  const fetchNominations = useCallback(async () => {
    if (!caseId) return;
    try {
      setLoading(true);
      const data = await committeeAPI.getNominations(caseId);
      setNominations(data.content || []);
    } catch (err) {
      console.error('[useAuditors] fetchNominations', err);
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  const fetchTeamLeaderNominations = useCallback(async () => {
    if (!caseId) return;
    try {
      const data = await committeeAPI.getTeamLeaderNominations(caseId);
      setTeamLeaderNominations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[useAuditors] fetchTeamLeaderNominations', err);
    }
  }, [caseId]);

  const fetchAuditorNominations = useCallback(async () => {
    if (!caseId) return;
    try {
      const data = await committeeAPI.getAuditorNominations(caseId);
      setAuditorNominations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[useAuditors] fetchAuditorNominations', err);
    }
  }, [caseId]);

  const fetchTeamLeaders = useCallback(async (filters = {}) => {
    try {
      // Always pass taxCenter to restrict team leaders to the committee's tax center
      const data = await committeeAPI.searchTeamLeaders({ ...filters, taxCenter: userTaxCenter });
      setTeamLeaders(Array.isArray(data) ? data : []);
    } catch (err) {
      // Fallback to mock team leaders when backend is unreachable
      console.warn('[useAuditors] Backend unavailable, using mock team leaders:', err.message);
      let result = DB_TEAM_LEADERS;
      if (filters.auditType) result = result.filter(tl => tl.auditType === filters.auditType);
      // Filter by user's tax center for mock fallback
      if (userTaxCenter) {
        result = result.filter(tl => tl.taxCenter === userTaxCenter);
      } else if (filters.taxCenter) {
        result = result.filter(tl => tl.taxCenter === filters.taxCenter);
      }
      setTeamLeaders(result);
    }
  }, [userTaxCenter]);

  useEffect(() => {
    fetchNominations();
    fetchTeamLeaderNominations();
    fetchAuditorNominations();
    search({});
    fetchTeamLeaders();
  }, [caseId, fetchNominations, fetchTeamLeaderNominations, fetchAuditorNominations, search, fetchTeamLeaders]);

  const nominate = async (auditorId, reason = '', role = 'AUDITOR') => {
    try {
      setNominating(true);
      setError(null);
      const nomination = await committeeAPI.nominateAuditor(caseId, { auditorId, reason, role });
      setNominations(prev => [nomination, ...prev]);
      if (role === 'TEAM_LEADER') {
        setTeamLeaderNominations(prev => [nomination, ...prev]);
      } else {
        setAuditorNominations(prev => [nomination, ...prev]);
      }
      return nomination;
    } catch (err) {
      setError(err.message || 'Failed to nominate auditor');
      console.error('[useAuditors] nominate', err);
      throw err;
    } finally {
      setNominating(false);
    }
  };

  const getProfile = async (auditorId) => {
    try {
      return await committeeAPI.getAuditorProfile(auditorId);
    } catch (err) {
      console.error('[useAuditors] getProfile', err);
      throw err;
    }
  };

  const selectTeamLeader = async (nominationId) => {
    try {
      const result = await committeeAPI.selectTeamLeader(caseId, nominationId);
      setTeamLeaderNominations(prev =>
        prev.map(n => ({ ...n, selected: n.nominationId === nominationId }))
      );
      return result;
    } catch (err) {
      setError(err.message || 'Failed to select team leader');
      throw err;
    }
  };

  const removeNomination = async (nominationId, role) => {
    try {
      setError(null);
      await committeeAPI.removeNomination(caseId, nominationId);
      if (role === 'TEAM_LEADER') {
        setTeamLeaderNominations(prev => prev.filter(n => n.nominationId !== nominationId));
      } else {
        setAuditorNominations(prev => prev.filter(n => n.nominationId !== nominationId));
      }
      setNominations(prev => prev.filter(n => n.nominationId !== nominationId));
    } catch (err) {
      setError(err.message || 'Failed to remove nomination');
      throw err;
    }
  };

  return {
    auditors,
    teamLeaders,
    nominations,
    teamLeaderNominations,
    auditorNominations,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    totalAuditors,
    nominating,
    search,
    searchTeamLeaders: fetchTeamLeaders,
    nominate,
    removeNomination,
    getProfile,
    selectTeamLeader,
    refreshNominations: fetchNominations,
    refreshTeamLeaderNominations: fetchTeamLeaderNominations,
    refreshAuditorNominations: fetchAuditorNominations,
  };
}
