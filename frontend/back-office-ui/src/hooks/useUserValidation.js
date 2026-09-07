import { useState, useCallback } from 'react';
import validUsersData from '../data/validUsers.json';
import { normalizeRole, resolveAuditType, resolveRegion } from '../features/ap/data/userResolver';
import { SEED_USERS } from '../features/ap/data/seed';
import { storage, STORE_KEYS } from '../features/ap/services/storage';

/**
 * Custom hook for user validation and test user discovery.
 * Synchronized with Database, Seed Users, and ITAS Canonical Directory.
 */
export const useUserValidation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validatedUser, setValidatedUser] = useState(null);

  // Recommended test users representing all core roles in the system,
  // with complete federal leadership, committee members, and specialized team leaders.
  const recommendedUsers = [
    // ── 1. Planning Team (Federal) ──────────────────────────────────────────
    { username: 'u-pt-01', fullName: 'Eden Haile', email: 'planning.auditor1@mor.gov.et', role: 'PLANNING_TEAM', category: 'Planning Team', auditType: 'NATIONAL_PLANNING', assignedLocation: 'FEDERAL', description: 'National Planning Team Lead (Eden Haile - Creates & Amends Plans)' },
    { username: 'u-pt-02', fullName: 'Samuel Worku', email: 'abebe.tadesse@mor.gov.et', role: 'PLANNING_TEAM', category: 'Planning Team', auditType: 'NATIONAL_PLANNING', assignedLocation: 'FEDERAL', description: 'National Planning Team Member (Samuel Worku - Risk Modeling & Quotas)' },
    { username: 'u-pt-03', fullName: 'Yodit Kassa', email: 'hanna.girma@mor.gov.et', role: 'PLANNING_TEAM', category: 'Planning Team', auditType: 'NATIONAL_PLANNING', assignedLocation: 'FEDERAL', description: 'National Planning Team Specialist (Yodit Kassa - Sector Analytics)' },

    // ── 2. Audit Directorate (Federal) ──────────────────────────────────────
    { username: 'u-ad-01', fullName: 'Getnet Bekele', email: 'tesfaye.bekele@mor.gov.et', role: 'AUDIT_DIRECTOR', category: 'Audit Directorate', auditType: 'DIRECTORATE', assignedLocation: 'FEDERAL', description: 'National Audit Director (Getnet Bekele - Approves & Deploys Plans)' },
    { username: 'u-ad-02', fullName: 'Gemechu Kebede', email: 'deputy.director@mor.gov.et', role: 'AUDIT_DIRECTOR', category: 'Audit Directorate', auditType: 'DIRECTORATE', assignedLocation: 'FEDERAL', description: 'Deputy Audit Director (Gemechu Kebede - Operational Oversight)' },

    // ── 3. Senior Management (Federal) ──────────────────────────────────────
    { username: 'u-sm-01', fullName: 'Almaz Berhane', email: 'rahel.hailu@mor.gov.et', role: 'SENIOR_MANAGEMENT', category: 'Senior Management', auditType: 'EXECUTIVE', assignedLocation: 'FEDERAL', description: 'Senior Management Chair (Almaz Berhane - Minister Designate Final Sign-off)' },
    { username: 'u-sm-02', fullName: 'Workneh Wolde', email: 'biruk.assefa@mor.gov.et', role: 'SENIOR_MANAGEMENT', category: 'Senior Management', auditType: 'EXECUTIVE', assignedLocation: 'FEDERAL', description: 'Senior Management Executive (Workneh Wolde - Policy & Governance)' },

    // ── 4. Regional Federal Directorate ─────────────────────────────────────
    { username: 'u-rd-fed', fullName: 'Berihun Lemma', email: 'solomon.worku@mor.gov.et', role: 'REGIONAL_DIRECTOR', category: 'Federal Regional Directorate', auditType: 'REGIONAL_DIRECTORATE', assignedLocation: 'FED', description: 'Federal Regional Director (Berihun Lemma - Federal Level Distribution)' },

    // ── 5. Federal Tax Centers (LTO-1 & LTO-2) ──────────────────────────────
    { username: 'u-tcm-federal-lto1', fullName: 'Tsega Mulugeta', email: 'tsega.mulugeta@mor.gov.et', role: 'TAX_CENTER_MANAGER', category: 'Federal Tax Centers', auditType: 'TAX_CENTER_MANAGEMENT', assignedLocation: 'federal-lto1', description: 'Tax Center Manager (Tsega Mulugeta - Federal Large Taxpayers Office 1)' },
    { username: 'u-tcm-federal-lto2', fullName: 'Berihun Tesfaye', email: 'berihun.tesfaye@mor.gov.et', role: 'TAX_CENTER_MANAGER', category: 'Federal Tax Centers', auditType: 'TAX_CENTER_MANAGEMENT', assignedLocation: 'federal-lto2', description: 'Tax Center Manager (Berihun Tesfaye - Federal Large Taxpayers Office 2)' },

    // ── 6. Federal Committees (Transfer Pricing & Joint Audit) ──────────────
    { username: 'u-com-fed-tpchair', fullName: 'Fikadu Belay', email: 'fed.tpcommittee1@mor.gov.et', role: 'COMMITTEE_MEMBER', category: 'Committees (Joint & TP)', auditType: 'TRANSFER_PRICING', assignedLocation: 'FEDERAL', description: 'Federal Transfer Pricing Committee Chair (Fikadu Belay)' },
    { username: 'u-com-federal-lto1-tp', fullName: 'Natnael Bekele', email: 'natnael.bekele@mor.gov.et', role: 'COMMITTEE_MEMBER', category: 'Committees (Joint & TP)', auditType: 'TRANSFER_PRICING', assignedLocation: 'federal-lto1', description: 'Federal LTO 1 TP Committee Lead (Natnael Bekele)' },
    { username: 'u-com-federal-lto2-tp', fullName: 'Kassa Tadesse', email: 'kassa.tadesse@mor.gov.et', role: 'COMMITTEE_MEMBER', category: 'Committees (Joint & TP)', auditType: 'TRANSFER_PRICING', assignedLocation: 'federal-lto2', description: 'Federal LTO 2 TP Committee Lead (Kassa Tadesse)' },
    { username: 'u-com-fed-tpmem1', fullName: 'Dereje Kebede', email: 'fed.tpcommittee2@mor.gov.et', role: 'COMMITTEE_MEMBER', category: 'Committees (Joint & TP)', auditType: 'TRANSFER_PRICING', assignedLocation: 'FEDERAL', description: 'Federal TP Committee Member (Dereje Kebede)' },
    { username: 'u-com-fed-chair', fullName: 'Nardos Belay', email: 'fed.committee1@mor.gov.et', role: 'COMMITTEE_MEMBER', category: 'Committees (Joint & TP)', auditType: 'JOINT_AUDIT', assignedLocation: 'FEDERAL', description: 'Federal Joint Audit Committee Chair (Nardos Belay)' },
    { username: 'u-com-federal-lto1-ja', fullName: 'Eleni Tesfaye', email: 'eleni.tesfaye@mor.gov.et', role: 'COMMITTEE_MEMBER', category: 'Committees (Joint & TP)', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO 1 Joint Audit Committee Lead (Eleni Tesfaye)' },
    { username: 'u-com-federal-lto2-ja', fullName: 'Tigist Desta', email: 'tigist.desta@mor.gov.et', role: 'COMMITTEE_MEMBER', category: 'Committees (Joint & TP)', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO 2 Joint Audit Committee Lead (Tigist Desta)' },
    { username: 'u-com-fed-mem1', fullName: 'Fatuma Abera', email: 'fed.committee2@mor.gov.et', role: 'COMMITTEE_MEMBER', category: 'Committees (Joint & TP)', auditType: 'JOINT_AUDIT', assignedLocation: 'FEDERAL', description: 'Federal Joint Audit Committee Member (Fatuma Abera)' },

    // ── 7. Federal Team Leaders — Transfer Pricing ──────────────────────────
    { username: 'u-tl-federal-lto1-tp-1', fullName: 'Michael Abera', email: 'michael.abera@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'TRANSFER_PRICING', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Transfer Pricing Team Leader 1 (Michael Abera)' },
    { username: 'u-tl-federal-lto1-tp-2', fullName: 'Eyerusalem Wolde', email: 'eyerusalem.wolde@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'TRANSFER_PRICING', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Transfer Pricing Team Leader 2 (Eyerusalem Wolde)' },
    { username: 'u-tl-federal-lto2-tp-1', fullName: 'Ibrahim Bikila', email: 'ibrahim.bikila@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'TRANSFER_PRICING', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Transfer Pricing Team Leader 1 (Ibrahim Bikila)' },
    { username: 'u-tl-federal-lto2-tp-2', fullName: 'Yonas Tesfaye', email: 'yonas.tesfaye@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'TRANSFER_PRICING', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Transfer Pricing Team Leader 2 (Yonas Tesfaye)' },

    // ── 7. Federal Team Leaders — Joint Audit ───────────────────────────────
    { username: 'u-tl-federal-lto1-joint-1', fullName: 'Addis Zewde', email: 'addis.zewde@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Joint Audit Team Leader 1 (Addis Zewde)' },
    { username: 'u-tl-federal-lto1-joint-2', fullName: 'Nardos Negash', email: 'nardos.negash@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Joint Audit Team Leader 2 (Nardos Negash)' },
    { username: 'u-tl-federal-lto2-joint-1', fullName: 'Nardos Wakjira', email: 'nardos.wakjira@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Joint Audit Team Leader 1 (Nardos Wakjira)' },
    { username: 'u-tl-federal-lto2-joint-2', fullName: 'Eleni Banti', email: 'eleni.banti@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Joint Audit Team Leader 2 (Eleni Banti)' },

    // ── 7. Federal Team Leaders — Desk Audit ────────────────────────────────
    { username: 'u-tl-federal-lto1-desk-1', fullName: 'Getnet Tesfa', email: 'getnet.tesfa@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'DESK_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Desk Audit Team Leader 1 (Getnet Tesfa)' },
    { username: 'u-tl-federal-lto1-desk-2', fullName: 'Gemechu Alemu', email: 'gemechu.alemu@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'DESK_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Desk Audit Team Leader 2 (Gemechu Alemu)' },
    { username: 'u-tl-federal-lto2-desk-1', fullName: 'Dawit Getachew', email: 'dawit.getachew@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'DESK_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Desk Audit Team Leader 1 (Dawit Getachew)' },
    { username: 'u-tl-federal-lto2-desk-2', fullName: 'Haile Mideksa', email: 'haile.mideksa@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'DESK_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Desk Audit Team Leader 2 (Haile Mideksa)' },

    // ── 7. Federal Team Leaders — Comprehensive Audit ───────────────────────
    { username: 'u-tl-federal-lto1-comp-1', fullName: 'Mamo Bekele', email: 'mamo.bekele@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'COMPREHENSIVE_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Comprehensive Audit Team Leader 1 (Mamo Bekele)' },
    { username: 'u-tl-federal-lto1-comp-2', fullName: 'Kassa Kebede', email: 'kassa.kebede@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'COMPREHENSIVE_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Comprehensive Audit Team Leader 2 (Kassa Kebede)' },
    { username: 'u-tl-federal-lto2-comp-1', fullName: 'Fatuma Yohannes', email: 'fatuma.yohannes@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'COMPREHENSIVE_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Comprehensive Audit Team Leader 1 (Fatuma Yohannes)' },
    { username: 'u-tl-federal-lto2-comp-2', fullName: 'Chaltu Hassan', email: 'chaltu.hassan@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'COMPREHENSIVE_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Comprehensive Audit Team Leader 2 (Chaltu Hassan)' },

    // ── 7. Federal Team Leaders — Issue Audit ───────────────────────────────
    { username: 'u-tl-federal-lto1-issue-1', fullName: 'Kassahun Assefa', email: 'kassahun.assefa@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'ISSUE_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Issue Audit Team Leader 1 (Kassahun Assefa)' },
    { username: 'u-tl-federal-lto1-issue-2', fullName: 'Fatuma Tilahun', email: 'fatuma.tilahun@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'ISSUE_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Issue Audit Team Leader 2 (Fatuma Tilahun)' },
    { username: 'u-tl-federal-lto2-issue-1', fullName: 'Addis Yohannes', email: 'addis.yohannes@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'ISSUE_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Issue Audit Team Leader 1 (Addis Yohannes)' },
    { username: 'u-tl-federal-lto2-issue-2', fullName: 'Kidist Mideksa', email: 'kidist.mideksa@mor.gov.et', role: 'TEAM_LEADER', category: 'Team Leaders', auditType: 'ISSUE_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Issue Audit Team Leader 2 (Kidist Mideksa)' },

    // ── 8. Federal Auditors — Transfer Pricing ───────────────────────────────
    { username: 'u-aud-federal-lto1-tp-1-1', fullName: 'Sara Tesfaye', email: 'sara.tesfaye@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'TRANSFER_PRICING', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 TP Auditor (Sara Tesfaye - under TL-1)' },
    { username: 'u-aud-federal-lto1-tp-1-2', fullName: 'Fikadu Mulugeta', email: 'fikadu.mulugeta@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'TRANSFER_PRICING', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 TP Auditor (Fikadu Mulugeta - under TL-1)' },
    { username: 'u-aud-federal-lto1-tp-2-1', fullName: 'Fikadu Alemayehu', email: 'fikadu.alemayehu@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'TRANSFER_PRICING', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 TP Auditor (Fikadu Alemayehu - under TL-2)' },
    { username: 'u-aud-federal-lto1-tp-2-2', fullName: 'Bethlehem Banti', email: 'bethlehem.banti@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'TRANSFER_PRICING', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 TP Auditor (Bethlehem Banti - under TL-2)' },
    { username: 'u-aud-federal-lto2-tp-1-1', fullName: 'Tsega Bikila', email: 'tsega.bikila@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'TRANSFER_PRICING', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 TP Auditor (Tsega Bikila - under TL-1)' },
    { username: 'u-aud-federal-lto2-tp-1-2', fullName: 'Berihun Zewde', email: 'berihun.zewde@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'TRANSFER_PRICING', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 TP Auditor (Berihun Zewde - under TL-1)' },
    { username: 'u-aud-federal-lto2-tp-2-1', fullName: 'Berihun Girma', email: 'berihun.girma@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'TRANSFER_PRICING', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 TP Auditor (Berihun Girma - under TL-2)' },
    { username: 'u-aud-federal-lto2-tp-2-2', fullName: 'Rahel Assefa', email: 'rahel.assefa@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'TRANSFER_PRICING', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 TP Auditor (Rahel Assefa - under TL-2)' },

    // ── 8. Federal Auditors — Joint Audit ────────────────────────────────────
    { username: 'u-aud-federal-lto1-joint-1-1', fullName: 'Fikremariam Tilahun', email: 'fikremariam.tilahun@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Joint Auditor (Fikremariam Tilahun - under TL-1)' },
    { username: 'u-aud-federal-lto1-joint-1-2', fullName: 'Saron Assefa', email: 'saron.assefa@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Joint Auditor (Saron Assefa - under TL-1)' },
    { username: 'u-aud-federal-lto1-joint-2-1', fullName: 'Saron Negash', email: 'saron.negash@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Joint Auditor (Saron Negash - under TL-2)' },
    { username: 'u-aud-federal-lto1-joint-2-2', fullName: 'Michael Zewde', email: 'michael.zewde@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Joint Auditor (Michael Zewde - under TL-2)' },
    { username: 'u-aud-federal-lto2-joint-1-1', fullName: 'Bikila Worku', email: 'bikila.worku@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Joint Auditor (Bikila Worku - under TL-1)' },
    { username: 'u-aud-federal-lto2-joint-1-2', fullName: 'Kassa Kassa', email: 'kassa.kassa@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Joint Auditor (Kassa Kassa - under TL-1)' },
    { username: 'u-aud-federal-lto2-joint-2-1', fullName: 'Kassa Kebede', email: 'kassa.kebede@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Joint Auditor (Kassa Kebede - under TL-2)' },
    { username: 'u-aud-federal-lto2-joint-2-2', fullName: 'Mamo Bekele', email: 'mamo.bekele@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'JOINT_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Joint Auditor (Mamo Bekele - under TL-2)' },

    // ── 8. Federal Auditors — Desk Audit ─────────────────────────────────────
    { username: 'u-aud-federal-lto1-desk-1-1', fullName: 'Tsega Mamo', email: 'tsega.mamo@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'DESK_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Desk Auditor (Tsega Mamo - under TL-1)' },
    { username: 'u-aud-federal-lto1-desk-1-2', fullName: 'Abebe Kassa', email: 'abebe.kassa@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'DESK_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Desk Auditor (Abebe Kassa - under TL-1)' },
    { username: 'u-aud-federal-lto1-desk-2-1', fullName: 'Abebe Lemma', email: 'abebe.lemma@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'DESK_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Desk Auditor (Abebe Lemma - under TL-2)' },
    { username: 'u-aud-federal-lto1-desk-2-2', fullName: 'Almaw Gebre', email: 'almaw.gebre@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'DESK_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Desk Auditor (Almaw Gebre - under TL-2)' },
    { username: 'u-aud-federal-lto2-desk-1-1', fullName: 'Birtukan Kassa', email: 'birtukan.kassa@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'DESK_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Desk Auditor (Birtukan Kassa - under TL-1)' },
    { username: 'u-aud-federal-lto2-desk-1-2', fullName: 'Genet Worku', email: 'genet.worku@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'DESK_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Desk Auditor (Genet Worku - under TL-1)' },
    { username: 'u-aud-federal-lto2-desk-2-1', fullName: 'Genet Gebre', email: 'genet.gebre@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'DESK_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Desk Auditor (Genet Gebre - under TL-2)' },
    { username: 'u-aud-federal-lto2-desk-2-2', fullName: 'Henok Abera', email: 'henok.abera@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'DESK_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Desk Auditor (Henok Abera - under TL-2)' },

    // ── 8. Federal Auditors — Comprehensive Audit ────────────────────────────
    { username: 'u-aud-federal-lto1-comp-1-1', fullName: 'Saron Mideksa', email: 'saron.mideksa@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'COMPREHENSIVE_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Comprehensive Auditor (Saron Mideksa - under TL-1)' },
    { username: 'u-aud-federal-lto1-comp-1-2', fullName: 'Michael Getachew', email: 'michael.getachew@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'COMPREHENSIVE_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Comprehensive Auditor (Michael Getachew - under TL-1)' },
    { username: 'u-aud-federal-lto1-comp-2-1', fullName: 'Michael Girma', email: 'michael.girma@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'COMPREHENSIVE_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Comprehensive Auditor (Michael Girma - under TL-2)' },
    { username: 'u-aud-federal-lto1-comp-2-2', fullName: 'Eyerusalem Belay', email: 'eyerusalem.belay@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'COMPREHENSIVE_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Comprehensive Auditor (Eyerusalem Belay - under TL-2)' },
    { username: 'u-aud-federal-lto2-comp-1-1', fullName: 'Gemechu Getachew', email: 'gemechu.getachew@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'COMPREHENSIVE_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Comprehensive Auditor (Gemechu Getachew - under TL-1)' },
    { username: 'u-aud-federal-lto2-comp-1-2', fullName: 'Ibrahim Tesfa', email: 'ibrahim.tesfa@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'COMPREHENSIVE_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Comprehensive Auditor (Ibrahim Tesfa - under TL-1)' },
    { username: 'u-aud-federal-lto2-comp-2-1', fullName: 'Ibrahim Belay', email: 'ibrahim.belay@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'COMPREHENSIVE_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Comprehensive Auditor (Ibrahim Belay - under TL-2)' },
    { username: 'u-aud-federal-lto2-comp-2-2', fullName: 'Yonas Tadesse', email: 'yonas.tadesse@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'COMPREHENSIVE_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Comprehensive Auditor (Yonas Tadesse - under TL-2)' },

    // ── 8. Federal Auditors — Issue Audit ────────────────────────────────────
    { username: 'u-aud-federal-lto1-issue-1-1', fullName: 'Workneh Bekele', email: 'workneh.bekele@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'ISSUE_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Issue Auditor (Workneh Bekele - under TL-1)' },
    { username: 'u-aud-federal-lto1-issue-1-2', fullName: 'Almaz Kebede', email: 'almaz.kebede@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'ISSUE_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Issue Auditor (Almaz Kebede - under TL-1)' },
    { username: 'u-aud-federal-lto1-issue-2-1', fullName: 'Almaz Kassa', email: 'almaz.kassa@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'ISSUE_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Issue Auditor (Almaz Kassa - under TL-2)' },
    { username: 'u-aud-federal-lto1-issue-2-2', fullName: 'Tigist Worku', email: 'tigist.worku@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'ISSUE_AUDIT', assignedLocation: 'federal-lto1', description: 'Federal LTO-1 Issue Auditor (Tigist Worku - under TL-2)' },
    { username: 'u-aud-federal-lto2-issue-1-1', fullName: 'Mulugeta Zewde', email: 'mulugeta.zewde@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'ISSUE_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Issue Auditor (Mulugeta Zewde - under TL-1)' },
    { username: 'u-aud-federal-lto2-issue-1-2', fullName: 'Diriba Negash', email: 'diriba.negash@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'ISSUE_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Issue Auditor (Diriba Negash - under TL-1)' },
    { username: 'u-aud-federal-lto2-issue-2-1', fullName: 'Diriba Assefa', email: 'diriba.assefa@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'ISSUE_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Issue Auditor (Diriba Assefa - under TL-2)' },
    { username: 'u-aud-federal-lto2-issue-2-2', fullName: 'Tolera Tilahun', email: 'tolera.tilahun@mor.gov.et', role: 'AUDITOR', category: 'Auditors', auditType: 'ISSUE_AUDIT', assignedLocation: 'federal-lto2', description: 'Federal LTO-2 Issue Auditor (Tolera Tilahun - under TL-2)' },

    // ── 9. Key Reference & External Portals ─────────────────────────────────
    { username: 'u-req-01', fullName: 'Mulugeta Teshome', email: 'clearance.officer@mor.gov.et', role: 'AUDIT_REQUESTER', category: 'Statutory Referral', auditType: 'TAX_CLEARANCE', assignedLocation: 'FEDERAL', description: 'Federal Audit Referral Officer (Tax Clearance & Flags)' },
    { username: 'admin', fullName: 'System Administrator', email: 'admin@mor.gov.et', role: 'PLANNING_TEAM', category: 'System Admin', auditType: 'ADMINISTRATION', assignedLocation: 'FEDERAL', description: 'System Administrator (Full Configuration Access)' },
    { username: 'taxpayer1', fullName: 'Crest Textiles CFO', email: 'cfo@cresttextiles.et', role: 'TAXPAYER', category: 'Taxpayer Portal', auditType: 'EXTERNAL_PORTAL', assignedLocation: 'FEDERAL', description: 'Taxpayer Compliance Portal (Crest Textiles CFO)' },
    { username: 'u-rd-aa', fullName: 'Getnet Alemu', email: 'getnet.alemu@mor.gov.et', role: 'REGIONAL_DIRECTOR', category: 'Regional Reference', auditType: 'REGIONAL_DIRECTORATE', assignedLocation: 'AA', description: 'Regional Director Reference (Addis Ababa)' },
    { username: 'u-tcm-addis_ababa-tc1', fullName: 'Mahlet Tesfa', email: 'mahlet.tesfa@mor.gov.et', role: 'TAX_CENTER_MANAGER', category: 'Regional Reference', auditType: 'TAX_CENTER_MANAGEMENT', assignedLocation: 'addis_ababa-tc1', description: 'Tax Center Manager Reference (Addis Ababa TC 1)' }
  ];

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
