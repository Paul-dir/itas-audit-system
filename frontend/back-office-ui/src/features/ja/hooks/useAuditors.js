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
  // Federal LTO-1 (10 auditors)
  { id: 'a0000001-0000-0000-0099-000000000001', name: 'Fikremariam Tilahun', email: 'fed.ja.auditor1@mor.gov.et',  expertise: 'Corporate Tax',       seniority: 'SENIOR',    yearsOfExperience: 8,  taxCenter: 'federal-lto1' },
  { id: 'a0000001-0000-0000-0099-000000000002', name: 'Saron Assefa',        email: 'fed.ja.auditor2@mor.gov.et',  expertise: 'Transfer Pricing',    seniority: 'PRINCIPAL', yearsOfExperience: 12, taxCenter: 'federal-lto1' },
  { id: 'a0000001-0000-0000-0099-000000000003', name: 'Bikila Worku',        email: 'fed.ja.auditor3@mor.gov.et',  expertise: 'VAT Compliance',      seniority: 'SENIOR',    yearsOfExperience: 9,  taxCenter: 'federal-lto1' },
  { id: 'a0000001-0000-0000-0099-000000000004', name: 'Michael Zewde',       email: 'fed.ja.auditor4@mor.gov.et',  expertise: 'International Tax',   seniority: 'MID_LEVEL', yearsOfExperience: 5,  taxCenter: 'federal-lto1' },
  { id: 'a0000001-0000-0000-0099-000000000005', name: 'Saron Negash',        email: 'fed.ja.auditor5@mor.gov.et',  expertise: 'Audit Investigation', seniority: 'SENIOR',    yearsOfExperience: 7,  taxCenter: 'federal-lto1' },
  { id: 'a0000001-0000-0000-0099-000000000006', name: 'Almaw Tesfa',         email: 'fed.ja.auditor6@mor.gov.et',  expertise: 'Corporate Tax',       seniority: 'MID_LEVEL', yearsOfExperience: 6,  taxCenter: 'federal-lto1' },
  { id: 'a0000001-0000-0000-0099-000000000007', name: 'Tigist Alemu',        email: 'fed.ja.auditor7@mor.gov.et',  expertise: 'VAT Compliance',      seniority: 'SENIOR',    yearsOfExperience: 8,  taxCenter: 'federal-lto1' },
  { id: 'a0000001-0000-0000-0099-000000000008', name: 'Ephrem Bekele',       email: 'fed.ja.auditor8@mor.gov.et',  expertise: 'International Tax',   seniority: 'MID_LEVEL', yearsOfExperience: 5,  taxCenter: 'federal-lto1' },
  { id: 'a0000001-0000-0000-0099-000000000009', name: 'Meron Kebede',        email: 'fed.ja.auditor9@mor.gov.et',  expertise: 'Transfer Pricing',    seniority: 'SENIOR',    yearsOfExperience: 10, taxCenter: 'federal-lto1' },
  { id: 'a0000001-0000-0000-0099-000000000010', name: 'Bereket Mekonnen',    email: 'fed.ja.auditor10@mor.gov.et', expertise: 'Audit Investigation', seniority: 'PRINCIPAL', yearsOfExperience: 13, taxCenter: 'federal-lto1' },

  // Federal LTO-2 (10 auditors)
  { id: 'a0000001-0000-0000-0098-000000000001', name: 'Dawit Mengistu',      email: 'fed2.ja.auditor1@mor.gov.et',  expertise: 'Corporate Tax',       seniority: 'SENIOR',    yearsOfExperience: 10, taxCenter: 'federal-lto2' },
  { id: 'a0000001-0000-0000-0098-000000000002', name: 'Eden Tadesse',        email: 'fed2.ja.auditor2@mor.gov.et',  expertise: 'Transfer Pricing',    seniority: 'PRINCIPAL', yearsOfExperience: 14, taxCenter: 'federal-lto2' },
  { id: 'a0000001-0000-0000-0098-000000000003', name: 'Henok Girma',         email: 'fed2.ja.auditor3@mor.gov.et',  expertise: 'VAT Compliance',      seniority: 'MID_LEVEL', yearsOfExperience: 6,  taxCenter: 'federal-lto2' },
  { id: 'a0000001-0000-0000-0098-000000000004', name: 'Meron Kebede',        email: 'fed2.ja.auditor4@mor.gov.et',  expertise: 'International Tax',   seniority: 'SENIOR',    yearsOfExperience: 9,  taxCenter: 'federal-lto2' },
  { id: 'a0000001-0000-0000-0098-000000000005', name: 'Natnael Assefa',      email: 'fed2.ja.auditor5@mor.gov.et',  expertise: 'Audit Investigation', seniority: 'MID_LEVEL', yearsOfExperience: 5,  taxCenter: 'federal-lto2' },
  { id: 'a0000001-0000-0000-0098-000000000006', name: 'Fikadu Wolde',        email: 'fed2.ja.auditor6@mor.gov.et',  expertise: 'Corporate Tax',       seniority: 'SENIOR',    yearsOfExperience: 8,  taxCenter: 'federal-lto2' },
  { id: 'a0000001-0000-0000-0098-000000000007', name: 'Genet Alemu',         email: 'fed2.ja.auditor7@mor.gov.et',  expertise: 'VAT Compliance',      seniority: 'SENIOR',    yearsOfExperience: 9,  taxCenter: 'federal-lto2' },
  { id: 'a0000001-0000-0000-0098-000000000008', name: 'Habtamu Desta',       email: 'fed2.ja.auditor8@mor.gov.et',  expertise: 'International Tax',   seniority: 'MID_LEVEL', yearsOfExperience: 6,  taxCenter: 'federal-lto2' },
  { id: 'a0000001-0000-0000-0098-000000000009', name: 'Selam Haile',         email: 'fed2.ja.auditor9@mor.gov.et',  expertise: 'Transfer Pricing',    seniority: 'SENIOR',    yearsOfExperience: 11, taxCenter: 'federal-lto2' },
  { id: 'a0000001-0000-0000-0098-000000000010', name: 'Getnet Alemayehu',    email: 'fed2.ja.auditor10@mor.gov.et', expertise: 'Audit Investigation', seniority: 'PRINCIPAL', yearsOfExperience: 12, taxCenter: 'federal-lto2' },

  // Addis Ababa TC-1 (10 auditors)
  { id: 'a0000001-0000-0000-0001-000000000001', name: 'Sara Mohammed',       email: 'aa1.auditor1@mor.gov.et',     expertise: 'Corporate Tax',       seniority: 'SENIOR',    yearsOfExperience: 11, taxCenter: 'addis_ababa-tc1' },
  { id: 'a0000001-0000-0000-0001-000000000002', name: 'Yonas Berhanu',       email: 'aa1.auditor2@mor.gov.et',     expertise: 'Transfer Pricing',    seniority: 'PRINCIPAL', yearsOfExperience: 13, taxCenter: 'addis_ababa-tc1' },
  { id: 'a0000001-0000-0000-0001-000000000003', name: 'Hana Girma',          email: 'aa1.auditor3@mor.gov.et',     expertise: 'VAT Compliance',      seniority: 'SENIOR',    yearsOfExperience: 8,  taxCenter: 'addis_ababa-tc1' },
  { id: 'a0000001-0000-0000-0001-000000000004', name: 'Mulugeta Alemayehu',  email: 'aa1.auditor4@mor.gov.et',     expertise: 'International Tax',   seniority: 'MID_LEVEL', yearsOfExperience: 7,  taxCenter: 'addis_ababa-tc1' },
  { id: 'a0000001-0000-0000-0001-000000000005', name: 'Tigist Haile',        email: 'aa1.auditor5@mor.gov.et',     expertise: 'Audit Investigation', seniority: 'SENIOR',    yearsOfExperience: 9,  taxCenter: 'addis_ababa-tc1' },
  { id: 'a0000001-0000-0000-0001-000000000006', name: 'Chaltu Bekele',       email: 'aa1.auditor6@mor.gov.et',     expertise: 'Corporate Tax',       seniority: 'MID_LEVEL', yearsOfExperience: 6,  taxCenter: 'addis_ababa-tc1' },
  { id: 'a0000001-0000-0000-0001-000000000007', name: 'Diriba Lema',         email: 'aa1.auditor7@mor.gov.et',     expertise: 'VAT Compliance',      seniority: 'SENIOR',    yearsOfExperience: 9,  taxCenter: 'addis_ababa-tc1' },
  { id: 'a0000001-0000-0000-0001-000000000008', name: 'Fikadu Desta',        email: 'aa1.auditor8@mor.gov.et',     expertise: 'International Tax',   seniority: 'MID_LEVEL', yearsOfExperience: 5,  taxCenter: 'addis_ababa-tc1' },
  { id: 'a0000001-0000-0000-0001-000000000009', name: 'Gemechu Negash',      email: 'aa1.auditor9@mor.gov.et',     expertise: 'Transfer Pricing',    seniority: 'SENIOR',    yearsOfExperience: 10, taxCenter: 'addis_ababa-tc1' },
  { id: 'a0000001-0000-0000-0001-000000000010', name: 'Haile Mengistu',      email: 'aa1.auditor10@mor.gov.et',    expertise: 'Audit Investigation', seniority: 'PRINCIPAL', yearsOfExperience: 12, taxCenter: 'addis_ababa-tc1' },
];

/**
 * Mock team leaders matching SEED_USERS team_leader entries.
 * Exactly 2 Joint Team Leaders per tax center.
 */
const DB_TEAM_LEADERS = [
  // Federal LTO-1
  { id: '10000000-0000-0000-0099-000000000001', username: 'fed.ja.tl',  name: 'Addis Zewde',    email: 'fed.ja.tl@mor.gov.et',  auditType: 'joint_audit', taxCenter: 'federal-lto1' },
  { id: '10000000-0000-0000-0099-000000000002', username: 'fed.ja.tl2', name: 'Nardos Negash',  email: 'fed.ja.tl2@mor.gov.et', auditType: 'joint_audit', taxCenter: 'federal-lto1' },
  // Federal LTO-2
  { id: '10000000-0000-0000-0098-000000000001', username: 'fed2.ja.tl',  name: 'Berhanu Bekele', email: 'fed2.ja.tl@mor.gov.et',  auditType: 'joint_audit', taxCenter: 'federal-lto2' },
  { id: '10000000-0000-0000-0098-000000000002', username: 'fed2.ja.tl2', name: 'Eleni Banti',    email: 'fed2.ja.tl2@mor.gov.et', auditType: 'joint_audit', taxCenter: 'federal-lto2' },
  // Addis Ababa TC-1
  { id: '10000000-0000-0000-0001-000000000001', username: 'aa1.tl',      name: 'Dawit Tadesse',  email: 'aa1.tl@mor.gov.et',      auditType: 'joint_audit', taxCenter: 'addis_ababa-tc1' },
  { id: '10000000-0000-0000-0001-000000000002', username: 'aa1.tl2',     name: 'Robel Girma',    email: 'aa1.tl2@mor.gov.et',     auditType: 'joint_audit', taxCenter: 'addis_ababa-tc1' },
];

export function useAuditors(caseId) {
  const { user, authContext } = useAuth();
  // Committee members are scoped to their tax center
  const userTaxCenter = user?.taxCenter || authContext?.taxCenter || authContext?.org_context?.assignedTaxCenter || null;

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
    // Addis Ababa TC-1 (1..10)
    'a0000001-0000-0000-0001-000000000001': 'addis_ababa-tc1',
    'a0000001-0000-0000-0001-000000000002': 'addis_ababa-tc1',
    'a0000001-0000-0000-0001-000000000003': 'addis_ababa-tc1',
    'a0000001-0000-0000-0001-000000000004': 'addis_ababa-tc1',
    'a0000001-0000-0000-0001-000000000005': 'addis_ababa-tc1',
    'a0000001-0000-0000-0001-000000000006': 'addis_ababa-tc1',
    'a0000001-0000-0000-0001-000000000007': 'addis_ababa-tc1',
    'a0000001-0000-0000-0001-000000000008': 'addis_ababa-tc1',
    'a0000001-0000-0000-0001-000000000009': 'addis_ababa-tc1',
    'a0000001-0000-0000-0001-000000000010': 'addis_ababa-tc1',
    // LTO-1 (1..10)
    'a0000001-0000-0000-0099-000000000001': 'federal-lto1',
    'a0000001-0000-0000-0099-000000000002': 'federal-lto1',
    'a0000001-0000-0000-0099-000000000003': 'federal-lto1',
    'a0000001-0000-0000-0099-000000000004': 'federal-lto1',
    'a0000001-0000-0000-0099-000000000005': 'federal-lto1',
    'a0000001-0000-0000-0099-000000000006': 'federal-lto1',
    'a0000001-0000-0000-0099-000000000007': 'federal-lto1',
    'a0000001-0000-0000-0099-000000000008': 'federal-lto1',
    'a0000001-0000-0000-0099-000000000009': 'federal-lto1',
    'a0000001-0000-0000-0099-000000000010': 'federal-lto1',
    // LTO-2 (1..10)
    'a0000001-0000-0000-0098-000000000001': 'federal-lto2',
    'a0000001-0000-0000-0098-000000000002': 'federal-lto2',
    'a0000001-0000-0000-0098-000000000003': 'federal-lto2',
    'a0000001-0000-0000-0098-000000000004': 'federal-lto2',
    'a0000001-0000-0000-0098-000000000005': 'federal-lto2',
    'a0000001-0000-0000-0098-000000000006': 'federal-lto2',
    'a0000001-0000-0000-0098-000000000007': 'federal-lto2',
    'a0000001-0000-0000-0098-000000000008': 'federal-lto2',
    'a0000001-0000-0000-0098-000000000009': 'federal-lto2',
    'a0000001-0000-0000-0098-000000000010': 'federal-lto2',
  };

  /** Enrich and filter auditors by user's tax center on the client side.
   *  Ensures filtering works even when t_auditor.tax_center is NULL in the DB.
   */
  const enrichAndFilterAuditors = useCallback((auditorList) => {
    return auditorList
      .map(a => ({
        ...a,
        id: a.id || a.auditorId,
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

  const [formedTeams, setFormedTeams] = useState([]);
  const fetchTeams = useCallback(async () => {
    try {
      const data = await committeeAPI.getTeams();
      setFormedTeams(Array.isArray(data) ? data.filter(t => t.active !== false) : []);
    } catch (err) {
      console.warn('[useAuditors] Could not fetch active teams:', err.message);
      setFormedTeams([]);
    }
  }, []);

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
      // Strictly query joint audit team leaders in this committee's tax center
      const data = await committeeAPI.searchTeamLeaders({ auditType: 'JOINT_AUDIT', taxCenter: userTaxCenter, ...filters });
      const list = Array.isArray(data) ? data : [];
      // Filter strictly by auditType and tax center
      const filtered = list.filter(tl => {
        const at = (tl.auditType || '').toLowerCase().replace(/_/g, '');
        const matchType = !tl.auditType || at === 'jointaudit';
        const matchTc = !userTaxCenter || tl.taxCenter === userTaxCenter;
        return matchType && matchTc;
      });
      setTeamLeaders(filtered);
    } catch (err) {
      // Fallback to mock team leaders when backend is unreachable
      console.warn('[useAuditors] Backend unavailable, using mock team leaders:', err.message);
      let result = DB_TEAM_LEADERS;
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
    fetchTeams();
  }, [caseId, userTaxCenter]);

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
    formedTeams,
    fetchTeams,
    fetchTeamLeaders,
    refreshNominations: fetchNominations,
    refreshTeamLeaderNominations: fetchTeamLeaderNominations,
    refreshAuditorNominations: fetchAuditorNominations,
  };
}
