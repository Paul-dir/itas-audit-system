import { useState, useCallback } from 'react';
import validUsersData from '../data/validUsers.json';
import { normalizeRole, resolveAuditType, resolveRegion } from '../features/ap/data/userResolver';
import { SEED_USERS } from '../features/ap/data/seed';
import { storage, STORE_KEYS } from '../features/ap/services/storage';

/**
 * Custom hook for user validation and test user discovery.
 * Synchronized with Database, Seed Users, and ITAS Canonical Directory.
 */
// Recommended test users representing all core roles in the system,
// with complete federal leadership, committee members, and specialized team leaders.
const recommendedUsers = [
    { username: 'planning-01', fullName: 'Eden Haile', email: 'planning.eden.haile@mor.gov.et', role: 'PLANNING_TEAM', category: 'Planning Team', auditType: 'NATIONAL_PLANNING', assignedLocation: 'FEDERAL', description: 'Eden Haile (National Planning)' },
    { username: 'planning-02', fullName: 'Samuel Worku', email: 'planning.samuel.worku@mor.gov.et', role: 'PLANNING_TEAM', category: 'Planning Team', auditType: 'NATIONAL_PLANNING', assignedLocation: 'FEDERAL', description: 'Samuel Worku (National Planning)' },
    { username: 'planning-03', fullName: 'Yodit Kassa', email: 'planning.yodit.kassa@mor.gov.et', role: 'PLANNING_TEAM', category: 'Planning Team', auditType: 'NATIONAL_PLANNING', assignedLocation: 'FEDERAL', description: 'Yodit Kassa (National Planning)' },
    { username: 'director-01', fullName: 'Getnet Bekele', email: 'director.getnet.bekele@mor.gov.et', role: 'AUDIT_DIRECTOR', category: 'Audit Directorate', auditType: 'DIRECTORATE', assignedLocation: 'FEDERAL', description: 'Getnet Bekele (National Audit Directorate)' },
    { username: 'director-02', fullName: 'Gemechu Kebede', email: 'director.gemechu.kebede@mor.gov.et', role: 'AUDIT_DIRECTOR', category: 'Audit Directorate', auditType: 'DIRECTORATE', assignedLocation: 'FEDERAL', description: 'Gemechu Kebede (National Audit Directorate)' },
    { username: 'seniormanagement-01', fullName: 'Almaz Berhane', email: 'seniormanagement.almaz.berhane@mor.gov.et', role: 'SENIOR_MANAGEMENT', category: 'Senior Management', auditType: 'EXECUTIVE', assignedLocation: 'FEDERAL', description: 'Almaz Berhane (Executive Leadership)' },
    { username: 'seniormanagement-02', fullName: 'Workneh Wolde', email: 'seniormanagement.workneh.wolde@mor.gov.et', role: 'SENIOR_MANAGEMENT', category: 'Senior Management', auditType: 'EXECUTIVE', assignedLocation: 'FEDERAL', description: 'Workneh Wolde (Executive Leadership)' },
    { username: 'regionaldirector-aa', fullName: 'Getnet Alemu', email: 'regionaldirector.getnet.alemu@mor.gov.et', role: 'REGIONAL_DIRECTOR', category: 'Regional Directors', auditType: 'REGIONAL_DIRECTORATE', assignedLocation: 'AA', description: 'Getnet Alemu (Regional Director)' },
    { username: 'regionaldirector-am', fullName: 'Tadesse Kebede', email: 'regionaldirector.tadesse.kebede@mor.gov.et', role: 'REGIONAL_DIRECTOR', category: 'Regional Directors', auditType: 'REGIONAL_DIRECTORATE', assignedLocation: 'BA', description: 'Tadesse Kebede (Regional Director)' },
    { username: 'regionaldirector-dd', fullName: 'Yonas Mengistu', email: 'regionaldirector.yonas.mengistu@mor.gov.et', role: 'REGIONAL_DIRECTOR', category: 'Regional Directors', auditType: 'REGIONAL_DIRECTORATE', assignedLocation: 'AB', description: 'Yonas Mengistu (Regional Director)' },
    { username: 'regionaldirector-fed', fullName: 'Berihun Lemma', email: 'regionaldirector.berihun.lemma@mor.gov.et', role: 'REGIONAL_DIRECTOR', category: 'Regional Directors', auditType: 'REGIONAL_DIRECTORATE', assignedLocation: 'FED', description: 'Berihun Lemma (Regional Director)' },
    { username: 'regionaldirector-or', fullName: 'Gemechu Negash', email: 'regionaldirector.gemechu.negash@mor.gov.et', role: 'REGIONAL_DIRECTOR', category: 'Regional Directors', auditType: 'REGIONAL_DIRECTORATE', assignedLocation: 'BB', description: 'Gemechu Negash (Regional Director)' },
    { username: 'regionaldirector-sn', fullName: 'Tekle Lemma', email: 'regionaldirector.tekle.lemma@mor.gov.et', role: 'REGIONAL_DIRECTOR', category: 'Regional Directors', auditType: 'REGIONAL_DIRECTORATE', assignedLocation: 'CA', description: 'Tekle Lemma (Regional Director)' },
    { username: 'regionaldirector-so', fullName: 'Ibrahim Hassan', email: 'regionaldirector.ibrahim.hassan@mor.gov.et', role: 'REGIONAL_DIRECTOR', category: 'Regional Directors', auditType: 'REGIONAL_DIRECTORATE', assignedLocation: 'SO', description: 'Ibrahim Hassan (Regional Director)' },
    { username: 'taxcentermanager-addis_ababa-tc1', fullName: 'Mahlet Tesfa', email: 'taxcentermanager.mahlet.tesfa@mor.gov.et', role: 'TAX_CENTER_MANAGER', category: 'Tax Center Managers', auditType: 'TAX_CENTER_MANAGEMENT', assignedLocation: 'addis_ababa-tc1', description: 'Mahlet Tesfa (Tax Center Manager)' },
    { username: 'taxcentermanager-amhara-tc1', fullName: 'Amanuel Haile', email: 'taxcentermanager.amanuel.haile@mor.gov.et', role: 'TAX_CENTER_MANAGER', category: 'Tax Center Managers', auditType: 'TAX_CENTER_MANAGEMENT', assignedLocation: 'amhara-tc1', description: 'Amanuel Haile (Tax Center Manager)' },
    { username: 'taxcentermanager-dire_dawa-tc1', fullName: 'Almaz Kassa', email: 'taxcentermanager.almaz.kassa@mor.gov.et', role: 'TAX_CENTER_MANAGER', category: 'Tax Center Managers', auditType: 'TAX_CENTER_MANAGEMENT', assignedLocation: 'dire_dawa-tc1', description: 'Almaz Kassa (Tax Center Manager)' },
    { username: 'taxcentermanager-federal-lto1', fullName: 'Tsega Mulugeta', email: 'taxcentermanager.tsega.mulugeta@mor.gov.et', role: 'TAX_CENTER_MANAGER', category: 'Tax Center Managers', auditType: 'TAX_CENTER_MANAGEMENT', assignedLocation: 'federal-lto1', description: 'Tsega Mulugeta (Tax Center Manager)' },
    { username: 'taxcentermanager-federal-lto2', fullName: 'Berihun Tesfaye', email: 'taxcentermanager.berihun.tesfaye@mor.gov.et', role: 'TAX_CENTER_MANAGER', category: 'Tax Center Managers', auditType: 'TAX_CENTER_MANAGEMENT', assignedLocation: 'federal-lto2', description: 'Berihun Tesfaye (Tax Center Manager)' },
    { username: 'taxcentermanager-oromia-tc1', fullName: 'Ibrahim Mekonnen', email: 'taxcentermanager.ibrahim.mekonnen@mor.gov.et', role: 'TAX_CENTER_MANAGER', category: 'Tax Center Managers', auditType: 'TAX_CENTER_MANAGEMENT', assignedLocation: 'oromia-tc1', description: 'Ibrahim Mekonnen (Tax Center Manager)' },
    { username: 'taxcentermanager-snnpr-tc1', fullName: 'Rahel Gebre', email: 'taxcentermanager.rahel.gebre@mor.gov.et', role: 'TAX_CENTER_MANAGER', category: 'Tax Center Managers', auditType: 'TAX_CENTER_MANAGEMENT', assignedLocation: 'snnpr-tc1', description: 'Rahel Gebre (Tax Center Manager)' },
    { username: 'taxcentermanager-somali-tc1', fullName: 'Chaltu Assefa', email: 'taxcentermanager.chaltu.assefa2@mor.gov.et', role: 'TAX_CENTER_MANAGER', category: 'Tax Center Managers', auditType: 'TAX_CENTER_MANAGEMENT', assignedLocation: 'somali-tc1', description: 'Chaltu Assefa (Tax Center Manager)' },
    { username: 'committeechair-aa1', fullName: 'Dr. Abebe Kebede', email: 'committeechair.abebe.kebede@mor.gov.et', role: 'COMMITTEE_CHAIR', category: 'Committees (Joint & TP)', auditType: 'JOINT_AUDIT', assignedLocation: 'addis_ababa-tc1', description: 'Dr. Abebe Kebede (Committee Chair)' },
    { username: 'committeechair-dd1', fullName: 'Dr. Yonas Mengistu', email: 'committeechair.yonas.mengistu@mor.gov.et', role: 'COMMITTEE_CHAIR', category: 'Committees (Joint & TP)', auditType: 'JOINT_AUDIT', assignedLocation: 'dire_dawa-tc1', description: 'Dr. Yonas Mengistu (Committee Chair)' },
    { username: 'committeechair-federal-lto1-ja', fullName: 'Dr. Solomon Desta', email: 'committeechair.solomon.desta@mor.gov.et', role: 'COMMITTEE_CHAIR', category: 'Committees (Joint & TP)', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto1', description: 'Dr. Solomon Desta (Committee Chair)' },
    { username: 'committeechair-federal-lto2-ja', fullName: 'Dr. Worku Alemayehu', email: 'committeechair.worku.alemayehu@mor.gov.et', role: 'COMMITTEE_CHAIR', category: 'Committees (Joint & TP)', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto2', description: 'Dr. Worku Alemayehu (Committee Chair)' },
    { username: 'committeechair-or1', fullName: 'Dr. Chaltu Negash', email: 'committeechair.chaltu.negash@mor.gov.et', role: 'COMMITTEE_CHAIR', category: 'Committees (Joint & TP)', auditType: 'JOINT_AUDIT', assignedLocation: 'oromia-tc1', description: 'Dr. Chaltu Negash (Committee Chair)' },
    { username: 'committeechair-sn1', fullName: 'Dr. Tekle Lemma', email: 'committeechair.tekle.lemma@mor.gov.et', role: 'COMMITTEE_CHAIR', category: 'Committees (Joint & TP)', auditType: 'JOINT_AUDIT', assignedLocation: 'snnpr-tc1', description: 'Dr. Tekle Lemma (Committee Chair)' },
    { username: 'committeechair-so1', fullName: 'Dr. Ibrahim Hassan', email: 'committeechair.ibrahim.hassan@mor.gov.et', role: 'COMMITTEE_CHAIR', category: 'Committees (Joint & TP)', auditType: 'JOINT_AUDIT', assignedLocation: 'somali-tc1', description: 'Dr. Ibrahim Hassan (Committee Chair)' },
    { username: 'committeemember-aa1', fullName: 'Fatuma Ahmed', email: 'committeemember.fatuma.ahmed@mor.gov.et', role: 'COMMITTEE_MEMBER', category: 'Committees (Joint & TP)', auditType: 'JOINT_AUDIT', assignedLocation: 'addis_ababa-tc1', description: 'Fatuma Ahmed (Committee Member)' },
    { username: 'committeemember-federal-lto1-ja', fullName: 'Eleni Tesfaye', email: 'committeemember.eleni.tesfaye@mor.gov.et', role: 'COMMITTEE_MEMBER', category: 'Committees (Joint & TP)', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto1', description: 'Eleni Tesfaye (Committee Member)' },
    { username: 'committeemember-federal-lto2-ja', fullName: 'Tigist Hailu', email: 'committeemember.tigist.hailu@mor.gov.et', role: 'COMMITTEE_MEMBER', category: 'Committees (Joint & TP)', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto2', description: 'Tigist Hailu (Committee Member)' },
    { username: 'committeemember-or1', fullName: 'Diriba Lema', email: 'committeemember.diriba.lema@mor.gov.et', role: 'COMMITTEE_MEMBER', category: 'Committees (Joint & TP)', auditType: 'JOINT_AUDIT', assignedLocation: 'oromia-tc1', description: 'Diriba Lema (Committee Member)' },
    { username: 'teamleader-aa1-1', fullName: 'Dawit Tadesse', email: 'teamleader.dawit.tadesse@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'JOINT_AUDIT', assignedLocation: 'addis_ababa-tc1', description: 'Dawit Tadesse (Team Leader)' },
    { username: 'teamleader-aa1-2', fullName: 'Robel Girma', email: 'teamleader.robel.girma@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'JOINT_AUDIT', assignedLocation: 'addis_ababa-tc1', description: 'Robel Girma (Team Leader)' },
    { username: 'teamleader-addis_ababa-tc1-tp-1', fullName: 'Robel Girma', email: 'teamleader.robel.girma2@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'TRANSFER_PRICING', assignedLocation: 'addis_ababa-tc1', description: 'Robel Girma (Team Leader)' },
    { username: 'teamleader-federal-lto1-comp-1', fullName: 'Mamo Bekele', email: 'teamleader.mamo.bekele@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'COMPREHENSIVE_AUDIT', assignedLocation: 'federal-lto1', description: 'Mamo Bekele (Team Leader)' },
    { username: 'teamleader-federal-lto1-desk-1', fullName: 'Getnet Tesfa', email: 'teamleader.getnet.tesfa@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'DESK_AUDIT', assignedLocation: 'federal-lto1', description: 'Getnet Tesfa (Team Leader)' },
    { username: 'teamleader-federal-lto1-issue-1', fullName: 'Kassahun Assefa', email: 'teamleader.kassahun.assefa@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'ISSUE_AUDIT', assignedLocation: 'federal-lto1', description: 'Kassahun Assefa (Team Leader)' },
    { username: 'teamleader-federal-lto1-ja-1', fullName: 'Abebe Haile', email: 'teamleader.abebe.haile@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto1', description: 'Abebe Haile (Team Leader)' },
    { username: 'teamleader-federal-lto2-ja-1', fullName: 'Berhanu Bekele', email: 'teamleader.berhanu.bekele@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto2', description: 'Berhanu Bekele (Team Leader)' },
    { username: 'auditor-aa1-1', fullName: 'Sara Mohammed', email: 'auditor.sara.mohammed@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'addis_ababa-tc1', description: 'Sara Mohammed (Auditor)' },
    { username: 'auditor-aa1-10', fullName: 'Bethlehem Kebede', email: 'auditor.bethlehem.kebede@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'addis_ababa-tc1', description: 'Bethlehem Kebede (Auditor)' },
    { username: 'auditor-aa1-2', fullName: 'Yonas Berhanu', email: 'auditor.yonas.berhanu@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'addis_ababa-tc1', description: 'Yonas Berhanu (Auditor)' },
    { username: 'auditor-aa1-3', fullName: 'Hana Girma', email: 'auditor.hana.girma@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'addis_ababa-tc1', description: 'Hana Girma (Auditor)' },
    { username: 'auditor-aa1-4', fullName: 'Mulugeta Alemayehu', email: 'auditor.mulugeta.alemayehu@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'addis_ababa-tc1', description: 'Mulugeta Alemayehu (Auditor)' },
    { username: 'auditor-aa1-5', fullName: 'Tigist Haile', email: 'auditor.tigist.haile@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'addis_ababa-tc1', description: 'Tigist Haile (Auditor)' },
    { username: 'auditor-addis_ababa-tc1-tp-1-1', fullName: 'Tolera Getachew', email: 'auditor.tolera.getachew@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'TRANSFER_PRICING', assignedLocation: 'addis_ababa-tc1', description: 'Tolera Getachew (Auditor)' },
    { username: 'auditor-federal-lto1-ja-1', fullName: 'Fikremariam Tilahun', email: 'auditor.fikremariam.tilahun@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto1', description: 'Fikremariam Tilahun (Auditor)' },
    { username: 'auditor-federal-lto1-ja-10', fullName: 'Bereket Mekonnen', email: 'auditor.bereket.mekonnen@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto1', description: 'Bereket Mekonnen (Auditor)' },
    { username: 'auditor-federal-lto1-ja-2', fullName: 'Saron Assefa', email: 'auditor.saron.assefa@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto1', description: 'Saron Assefa (Auditor)' },
    { username: 'auditor-federal-lto2-ja-1', fullName: 'Dawit Mengistu', email: 'auditor.dawit.mengistu@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto2', description: 'Dawit Mengistu (Auditor)' },
    { username: 'auditor-federal-lto2-ja-10', fullName: 'Getnet Alemayehu', email: 'auditor.getnet.alemayehu@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto2', description: 'Getnet Alemayehu (Auditor)' },
    { username: 'auditrequester-01', fullName: 'Getachew Zewde', email: 'auditrequester.getachew.zewde@mor.gov.et', role: 'AUDIT_REQUESTER', category: 'Audit Requester', auditType: 'REFERRAL', assignedLocation: 'FEDERAL', description: 'Getachew Zewde (Audit Requester)' },
    { username: 'auditrequester-02', fullName: 'Tigist Worku', email: 'auditrequester.tigist.worku@mor.gov.et', role: 'AUDIT_REQUESTER', category: 'Audit Requester', auditType: 'REFERRAL', assignedLocation: 'FEDERAL', description: 'Tigist Worku (Audit Requester)' },
    { username: 'auditrequester-03', fullName: 'Deriba Alemayehu', email: 'auditrequester.deriba.alemayehu@mor.gov.et', role: 'AUDIT_REQUESTER', category: 'Audit Requester', auditType: 'REFERRAL', assignedLocation: 'FEDERAL', description: 'Deriba Alemayehu (Audit Requester)' },
    { username: 'auditrequester-04', fullName: 'Ibrahim Tesfa', email: 'auditrequester.ibrahim.tesfa@mor.gov.et', role: 'AUDIT_REQUESTER', category: 'Audit Requester', auditType: 'REFERRAL', assignedLocation: 'FEDERAL', description: 'Ibrahim Tesfa (Audit Requester)' },
  ];

export const useUserValidation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validatedUser, setValidatedUser] = useState(null);

  // Check if username or email is valid
  const isUsernameValid = useCallback((identifier) => {
    if (!identifier || !identifier.trim()) return false;
    const clean = identifier.trim().toLowerCase();

    // Check recommended users
    if (recommendedUsers.some(u => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean)) {
      return true;
    }

    // Check seed users
    if (SEED_USERS.some(u => u.id?.toLowerCase() === clean || u.email?.toLowerCase() === clean)) {
      return true;
    }

    // Check standard ITAS prefixes
    if (clean.startsWith('u-') || clean === 'admin' || clean.includes('@mor.gov.et') || clean.includes('taxpayer')) {
      return true;
    }

    return true; // Forgiving in demo mode
  }, [recommendedUsers]);

  // Get user role in canonical lowercase format for App.jsx routing
  const getUserRole = useCallback((username) => {
    if (!username) return 'auditor';
    const clean = username.trim().toLowerCase();

    // Check cached backend directory first
    try {
      const cachedUsers = storage.get(STORE_KEYS.USERS, []);
      if (Array.isArray(cachedUsers) && cachedUsers.length > 0) {
        const found = cachedUsers.find(u =>
          (u.username && u.username.toLowerCase() === clean) ||
          (u.email && u.email.toLowerCase() === clean) ||
          (u.id && u.id.toLowerCase() === clean) ||
          (u.userId && u.userId.toLowerCase() === clean)
        );
        if (found) return normalizeRole(found.role || found.userType);
      }
    } catch {
      // ignore storage error
    }

    const rec = recommendedUsers.find(u => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean);
    if (rec) return normalizeRole(rec.role);

    const seed = SEED_USERS.find(u => u.id?.toLowerCase() === clean || u.email?.toLowerCase() === clean);
    if (seed) return normalizeRole(seed.role);

    return normalizeRole(clean);
  }, [recommendedUsers]);

  // Get audit types
  const getUserAuditTypes = useCallback((username) => {
    if (!username) return [];
    const at = resolveAuditType(username);
    return at ? [at] : [];
  }, []);

  // Validate user (non-blocking)
  const validateUser = useCallback(async (username) => {
    setLoading(true);
    setError(null);
    try {
      const role = getUserRole(username);
      const userObj = {
        userId: username,
        username,
        role,
        auditTypes: getUserAuditTypes(username)
      };
      setValidatedUser(userObj);
      return userObj;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getUserRole, getUserAuditTypes]);

  const getRecommendedTestUsers = useCallback((category = 'all') => {
    if (category === 'all') return recommendedUsers;
    if (category === 'federal') {
      return recommendedUsers.filter(u => u.assignedLocation === 'FEDERAL' || (u.assignedLocation && u.assignedLocation.includes('fed')) || u.username.includes('fed'));
    }
    if (category === 'committee') {
      return recommendedUsers.filter(u => u.role === 'COMMITTEE_MEMBER');
    }
    if (category === 'teamleader') {
      return recommendedUsers.filter(u => u.role === 'TEAM_LEADER');
    }
    if (category === 'auditor' || category === 'Auditors') {
      return recommendedUsers.filter(u => u.role === 'AUDITOR');
    }
    return recommendedUsers.filter(u => u.category === category || u.role === category);
  }, [recommendedUsers]);

  return {
    validateUser,
    isUsernameValid,
    getUserRole,
    getUserAuditTypes,
    getRecommendedTestUsers,
    validatedUser,
    loading,
    error
  };
};

export default useUserValidation;
