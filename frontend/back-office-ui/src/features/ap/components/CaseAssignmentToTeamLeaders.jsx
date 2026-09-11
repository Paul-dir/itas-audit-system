import { useState, useEffect, useMemo, useCallback } from 'react';
import { AlertCircle, CheckCircle, Users, Send, Filter, Download, Loader, ShieldCheck, MapPin, Briefcase, Calendar } from 'lucide-react';
import { Card, Button, Modal, Badge, Alert, Input, Select } from '../../../components/ui/index.jsx';
import CaseDetailModal from '../pages/shared/CaseDetailModal.jsx';

/**
 * Normalizes Tax Center code to canonical identifier (e.g. TC-AA-01 <-> addis_ababa-tc1)
 */
function normalizeTaxCenter(tc) {
  if (!tc) return '';
  const s = tc.trim().toLowerCase();
  if (s.startsWith('tc-aa-') || s.startsWith('aa-tc')) {
    const num = s.replace(/[^0-9]/g, '');
    return `addis_ababa-tc${num}`;
  }
  if (s.startsWith('tc-ba-') || s.startsWith('ba-tc') || s.startsWith('amhara-tc')) {
    const num = s.replace(/[^0-9]/g, '');
    return `amhara-tc${num}`;
  }
  if (s.startsWith('tc-bb-') || s.startsWith('bb-tc') || s.startsWith('oromia-tc')) {
    const num = s.replace(/[^0-9]/g, '');
    return `oromia-tc${num}`;
  }
  if (s.startsWith('tc-ab-') || s.startsWith('ab-tc') || s.startsWith('tc-dd-') || s.startsWith('dire_dawa-tc')) {
    const num = s.replace(/[^0-9]/g, '');
    return `dire_dawa-tc${num}`;
  }
  if (s.startsWith('tc-ca-') || s.startsWith('ca-tc') || s.startsWith('snnpr-tc')) {
    const num = s.replace(/[^0-9]/g, '');
    return `snnpr-tc${num}`;
  }
  if (s.startsWith('tc-so-') || s.startsWith('so-tc') || s.startsWith('tc-sm-') || s.startsWith('somali-tc')) {
    const num = s.replace(/[^0-9]/g, '');
    return `somali-tc${num}`;
  }
  if (s.startsWith('fed-lto') || s.startsWith('federal-lto')) {
    const num = s.replace(/[^0-9]/g, '');
    return `federal-lto${num}`;
  }
  return s;
}

/**
 * Checks if two tax center codes refer to the exact same tax center
 */
function areTaxCentersMatching(tc1, tc2) {
  if (!tc1 || !tc2) return false;
  if (tc1.toLowerCase() === tc2.toLowerCase()) return true;
  return normalizeTaxCenter(tc1) === normalizeTaxCenter(tc2);
}

/**
 * Normalizes audit type strings (e.g. "transfer-pricing" -> "TRANSFER_PRICING")
 */
function normalizeAuditType(at) {
  if (!at) return '';
  const s = at.trim().toUpperCase().replace(/[\s-]+/g, '_');
  if (s.includes('TRANSFER') || s.includes('TP')) return 'TRANSFER_PRICING';
  if (s.includes('JOINT')) return 'JOINT_AUDIT';
  if (s.includes('DESK')) return 'DESK_AUDIT';
  if (s.includes('COMPREHENSIVE')) return 'COMPREHENSIVE_AUDIT';
  if (s.includes('ISSUE')) return 'ISSUE_AUDIT';
  return s;
}

/**
 * Checks if two audit types match
 */
function areAuditTypesMatching(at1, at2) {
  if (!at1 || !at2) return false;
  return normalizeAuditType(at1) === normalizeAuditType(at2);
}

/**
 * Formats a user-friendly tax center name
 */
function getTaxCenterDisplayName(tc) {
  if (!tc) return 'Unknown Jurisdiction';
  const norm = normalizeTaxCenter(tc);
  const map = {
    'addis_ababa-tc1': 'Addis Ababa TC 1 (TC-AA-01)',
    'addis_ababa-tc2': 'Addis Ababa TC 2 (TC-AA-02)',
    'addis_ababa-tc3': 'Addis Ababa TC 3 (TC-AA-03)',
    'federal-lto1': 'Federal Large Taxpayers Office 1 (LTO-1)',
    'federal-lto2': 'Federal Large Taxpayers Office 2 (LTO-2)',
    'amhara-tc1': 'Amhara Bahir Dar TC 1 (TC-BA-01)',
    'amhara-tc2': 'Amhara Gondar TC 2 (TC-BA-02)',
    'amhara-tc3': 'Amhara Dessie TC 3 (TC-BA-03)',
    'oromia-tc1': 'Oromia Adama TC 1 (TC-BB-01)',
    'oromia-tc2': 'Oromia Hawassa/Bishoftu TC 2 (TC-BB-02)',
    'oromia-tc3': 'Oromia Jimma TC 3 (TC-BB-03)',
    'dire_dawa-tc1': 'Dire Dawa TC 1 (TC-AB-01)',
    'dire_dawa-tc2': 'Dire Dawa TC 2 (TC-AB-02)',
    'dire_dawa-tc3': 'Dire Dawa TC 3 (TC-AB-03)',
    'snnpr-tc1': 'SNNPR Hawassa TC 1 (TC-CA-01)',
    'snnpr-tc2': 'SNNPR Dilla TC 2 (TC-CA-02)',
    'snnpr-tc3': 'SNNPR Wolaita Sodo TC 3 (TC-CA-03)',
    'somali-tc1': 'Somali Jigjiga TC 1 (TC-SO-01)',
    'somali-tc2': 'Somali Gode TC 2 (TC-SO-02)',
    'somali-tc3': 'Somali Degehabur TC 3 (TC-SO-03)',
  };
  return map[norm] || tc;
}

/**
 * CaseAssignmentToTeamLeaders Component
 * Allows committees (e.g., tp-committee, joint-committee) to assign their cases to team leaders.
 * Strictly enforces jurisdictional scoping: Team Leaders can ONLY be assigned within their
 * assigned Tax Center and for their specialized Audit Type.
 */
export default function CaseAssignmentToTeamLeaders({ committee, auditType, taxCenter, onClose }) {
  const [cases, setCases] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCases, setSelectedCases] = useState(new Set());
  const [selectedTeamLeader, setSelectedTeamLeader] = useState('');
  const [assignModal, setAssignModal] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [viewingCase, setViewingCase] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // Extract home tax center from prop or committee actor ID (e.g. u-com-addis_ababa-tc1-tp -> addis_ababa-tc1)
  const committeeHomeTC = useMemo(() => {
    if (taxCenter && taxCenter !== 'FEDERAL' && taxCenter !== 'ALL') {
      return taxCenter;
    }
    if (committee) {
      const match = committee.match(/u-com-([a-z_0-9-]+?)-(?:tp|ja|joint|desk)/i);
      if (match && match[1] && match[1] !== 'fed') {
        return match[1];
      }
    }
    return null;
  }, [taxCenter, committee]);

  const [filterYear, setFilterYear] = useState('ALL');
  const [filterTL, setFilterTL] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterTC, setFilterTC] = useState(committeeHomeTC || (taxCenter && taxCenter !== 'FEDERAL' ? taxCenter : 'ALL'));
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;
  const [plans, setPlans] = useState([]);

  // Load cases, team leaders, and annual audit plans
  useEffect(() => {
    loadCases();
    loadTeamLeaders();
    loadPlans();
  }, [committee, auditType, committeeHomeTC]);

  const loadPlans = async () => {
    try {
      const resp = await fetch('/api/v1/backoffice/ap/plans');
      if (resp.ok) {
        const data = await resp.json();
        const list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
        setPlans(list);
      }
    } catch (err) {
      console.warn('Failed to load plans:', err);
    }
  };

  const loadCases = async () => {
    setLoading(true);
    try {
      const committeeId = committee;

      // 1. Call backend to fetch cases assigned to this committee for this audit type
      const response = await fetch(
        `/api/v1/backoffice/ap/cases?committeeId=${encodeURIComponent(committeeId)}&auditType=${encodeURIComponent(auditType)}`
      );

      if (response.ok) {
        const data = await response.json();
        const caseList = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
        if (caseList.length > 0) {
          setCases(caseList);
          return;
        }
      }

      // 2. Fallback: fetch by auditType and status
      const response2 = await fetch(`/api/v1/backoffice/ap/cases?auditType=${encodeURIComponent(auditType)}&status=PENDING_ASSIGNMENT`);
      if (response2.ok) {
        const data = await response2.json();
        const caseList = Array.isArray(data.data) ? data.data : [];
        if (caseList.length > 0) {
          setCases(caseList);
          return;
        }
      }

      // 3. Fallback: general query by auditType
      const response3 = await fetch(`/api/v1/backoffice/ap/cases?auditType=${encodeURIComponent(auditType)}`);
      if (response3.ok) {
        const data = await response3.json();
        const caseList = Array.isArray(data.data) ? data.data : [];
        if (caseList.length > 0) {
          setCases(caseList);
          return;
        }
      }

      // Fallback mock cases
      setCases(generateMockCases(50));
    } catch (error) {
      console.error('Failed to load cases:', error);
      setCases(generateMockCases(50));
    } finally {
      setLoading(false);
    }
  };

  const loadTeamLeaders = async () => {
    try {
      const url = `/api/v1/backoffice/ap/users?role=team_leader&auditType=${encodeURIComponent(auditType)}`;
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        const userList = Array.isArray(data) ? data : (data.data || []);
        if (userList.length > 0) {
          const mapped = userList.map(u => ({
            id: u.username || u.userId,
            userId: u.userId,
            username: u.username,
            name: u.fullName || u.username,
            fullName: u.fullName || u.username,
            taxCenter: u.assignedLocation || '',
            auditType: u.auditType || auditType,
            caseCount: 0
          }));
          setTeamLeaders(mapped);
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to load team leaders from API:', err);
    }

    // Comprehensive Fallback defaults with canonical Tax Centers and Audit Types
    let tls = [];
    if (committee === 'tp-committee' || auditType === 'TRANSFER_PRICING') {
      tls = [
        { id: 'u-tl-addis_ababa-tc1-tp-1', username: 'u-tl-addis_ababa-tc1-tp-1', name: 'Robel Girma', taxCenter: 'addis_ababa-tc1', auditType: 'TRANSFER_PRICING', caseCount: 0 },
        { id: 'u-tl-addis_ababa-tc1-tp-2', username: 'u-tl-addis_ababa-tc1-tp-2', name: 'Natnael Belay', taxCenter: 'addis_ababa-tc1', auditType: 'TRANSFER_PRICING', caseCount: 0 },
        { id: 'u-tl-addis_ababa-tc2-tp-1', username: 'u-tl-addis_ababa-tc2-tp-1', name: 'Mamo Bekele', taxCenter: 'addis_ababa-tc2', auditType: 'TRANSFER_PRICING', caseCount: 0 },
        { id: 'u-tl-addis_ababa-tc2-tp-2', username: 'u-tl-addis_ababa-tc2-tp-2', name: 'Kassa Kebede', taxCenter: 'addis_ababa-tc2', auditType: 'TRANSFER_PRICING', caseCount: 0 },
        { id: 'u-tl-federal-lto1-tp-1', username: 'u-tl-federal-lto1-tp-1', name: 'Solomon Worku', taxCenter: 'federal-lto1', auditType: 'TRANSFER_PRICING', caseCount: 0 },
        { id: 'u-tl-federal-lto2-tp-1', username: 'u-tl-federal-lto2-tp-1', name: 'Ibrahim Bikila', taxCenter: 'federal-lto2', auditType: 'TRANSFER_PRICING', caseCount: 0 },
        { id: 'u-tl-federal-lto2-tp-2', username: 'u-tl-federal-lto2-tp-2', name: 'Yonas Tesfaye', taxCenter: 'federal-lto2', auditType: 'TRANSFER_PRICING', caseCount: 0 },
        { id: 'u-tl-amhara-tc1-tp-1', username: 'u-tl-amhara-tc1-tp-1', name: 'Almaw Tadesse', taxCenter: 'amhara-tc1', auditType: 'TRANSFER_PRICING', caseCount: 0 },
      ];
    } else {
      tls = [
        { id: 'u-tl-addis_ababa-tc1-joint-1', username: 'u-tl-addis_ababa-tc1-joint-1', name: 'Bethlehem Berhane', taxCenter: 'addis_ababa-tc1', auditType: 'JOINT_AUDIT', caseCount: 0 },
        { id: 'u-tl-addis_ababa-tc1-joint-2', username: 'u-tl-addis_ababa-tc1-joint-2', name: 'Yosef Desta', taxCenter: 'addis_ababa-tc1', auditType: 'JOINT_AUDIT', caseCount: 0 },
        { id: 'u-tl-addis_ababa-tc2-joint-1', username: 'u-tl-addis_ababa-tc2-joint-1', name: 'Samuel Eden', taxCenter: 'addis_ababa-tc2', auditType: 'JOINT_AUDIT', caseCount: 0 },
        { id: 'u-tl-federal-lto1-joint-1', username: 'u-tl-federal-lto1-joint-1', name: 'Joint Audit TL 1 (Fed LTO)', taxCenter: 'federal-lto1', auditType: 'JOINT_AUDIT', caseCount: 0 },
      ];
    }
    setTeamLeaders(tls);
  };

  const generateMockCases = (count) => {
    const mockCases = [];
    const years = [2026, 2027, 2028, 2029, 2030, 2031, 2032];
    for (let i = 1; i <= count; i++) {
      const year = years[(i - 1) % years.length];
      mockCases.push({
        id: `case-${i}`,
        caseNumber: `${year}-${committee}-${String(i).padStart(4, '0')}`,
        planYear: year,
        taxpayerId: String(1000000000 + i),
        taxpayerName: `Taxpayer ${i}`,
        auditType: auditType,
        status: 'PENDING_ASSIGNMENT',
        assignedTo: committee,
        taxCenterCode: i <= 25 ? 'TC-AA-01' : 'TC-AA-02',
        riskScore: Math.floor(Math.random() * 100),
        estimatedRevenue: Math.floor(Math.random() * 10000000),
      });
    }
    return mockCases;
  };

  // ── Selected Cases & Jurisdiction Analysis ─────────────────────────────────
  const selectedCaseObjects = useMemo(() => {
    return cases.filter(c => selectedCases.has(c.id));
  }, [cases, selectedCases]);

  const selectedTaxCenters = useMemo(() => {
    return Array.from(new Set(selectedCaseObjects.map(c => c.taxCenterCode || c.taxCenter).filter(Boolean)));
  }, [selectedCaseObjects]);

  const selectedAuditTypes = useMemo(() => {
    return Array.from(new Set(selectedCaseObjects.map(c => c.auditType).filter(Boolean)));
  }, [selectedCaseObjects]);

  const isMultipleTCSelected = selectedTaxCenters.length > 1;
  const isSingleTCSelected = selectedTaxCenters.length === 1;

  // Resolved target TC and Audit Type for assignment modal
  const targetTC = isSingleTCSelected
    ? selectedTaxCenters[0]
    : (filterTC !== 'ALL' ? filterTC : (committeeHomeTC || ''));

  const targetAuditType = selectedAuditTypes.length === 1
    ? selectedAuditTypes[0]
    : auditType;

  // The Tax Centers that actually have cases under this committee
  const activeCaseTaxCenters = useMemo(() => {
    return Array.from(new Set(cases.map(c => c.taxCenterCode || c.taxCenter).filter(Boolean)));
  }, [cases]);

  // Workload count per team leader
  const tlWorkloadMap = useMemo(() => {
    const map = {};
    cases.forEach(c => {
      const tl = c.assignedTeamLeaderId || c.assignedTeamLeader;
      if (tl && tl !== committee) {
        map[tl] = (map[tl] || 0) + 1;
      }
    });
    return map;
  }, [cases, committee]);

  // Lookup map for resolving Team Leader full details by ID or username
  const tlMap = useMemo(() => {
    const map = new Map();
    teamLeaders.forEach(tl => {
      if (tl.id) map.set(tl.id, tl);
      if (tl.username) map.set(tl.username, tl);
      if (tl.userId) map.set(String(tl.userId), tl);
    });
    return map;
  }, [teamLeaders]);

  // Truly ELIGIBLE team leaders:
  // 1. Must match audit type
  // 2. If committee user has a specific tax center jurisdiction, MUST match committee home TC
  // 3. If filterTC !== 'ALL', MUST match filterTC
  // 4. Otherwise, MUST match one of the Tax Centers present in the cases list!
  const eligibleTeamLeaders = useMemo(() => {
    return teamLeaders.filter(tl => {
      // 1. Audit Type
      if (!areAuditTypesMatching(tl.auditType, auditType)) return false;

      // 2. If committee user has a specific tax center jurisdiction
      if (committeeHomeTC && !areTaxCentersMatching(tl.taxCenter, committeeHomeTC)) {
        return false;
      }

      // 3. If user selected a specific Tax Center filter
      if (filterTC !== 'ALL') {
        return areTaxCentersMatching(tl.taxCenter, filterTC);
      }

      // 4. When viewing All Tax Centers, only show TLs whose Tax Center actually has cases in this committee!
      if (activeCaseTaxCenters.length > 0) {
        return activeCaseTaxCenters.some(caseTC => areTaxCentersMatching(tl.taxCenter, caseTC));
      }

      return true;
    });
  }, [teamLeaders, auditType, committeeHomeTC, filterTC, activeCaseTaxCenters]);

  // Filter Team Leaders strictly for the selected case's Tax Center AND that audit type
  const availableTLsForAssignment = useMemo(() => {
    return eligibleTeamLeaders.filter(tl => {
      // Must match target audit type
      if (!areAuditTypesMatching(tl.auditType, targetAuditType)) {
        return false;
      }
      // If target Tax Center is identified, MUST match target Tax Center
      if (targetTC) {
        return areTaxCentersMatching(tl.taxCenter, targetTC);
      }
      return true;
    });
  }, [eligibleTeamLeaders, targetTC, targetAuditType]);

  // Handle case selection with cross-tax-center guard
  const handleSelectCase = (caseId, checked) => {
    if (checked) {
      const targetCase = cases.find(c => c.id === caseId);
      const targetCaseTC = targetCase?.taxCenterCode || targetCase?.taxCenter;

      // If there are already selected cases, enforce same Tax Center
      if (selectedCaseObjects.length > 0 && targetCaseTC) {
        const existingTC = selectedCaseObjects[0]?.taxCenterCode || selectedCaseObjects[0]?.taxCenter;
        if (existingTC && !areTaxCentersMatching(existingTC, targetCaseTC)) {
          setErrorMessage(
            `⚠️ Jurisdiction Conflict: You cannot select cases from different Tax Centers simultaneously. ` +
            `Current selection belongs to ${existingTC}. Please assign or clear them before selecting cases from ${targetCaseTC}.`
          );
          return;
        }
      }
      setErrorMessage('');
      setSelectedCases(prev => new Set([...prev, caseId]));
    } else {
      setSelectedCases(prev => {
        const next = new Set(prev);
        next.delete(caseId);
        return next;
      });
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      if (filterTC !== 'ALL') {
        setSelectedCases(new Set(paginatedCases.map(c => c.id)));
      } else {
        // If viewing all, select only cases matching the first displayed case's Tax Center
        const firstTC = paginatedCases[0]?.taxCenterCode || paginatedCases[0]?.taxCenter;
        if (firstTC) {
          const matching = paginatedCases
            .filter(c => areTaxCentersMatching(c.taxCenterCode || c.taxCenter, firstTC))
            .map(c => c.id);
          setSelectedCases(new Set(matching));
          if (matching.length < paginatedCases.length) {
            setErrorMessage(`ℹ️ Selected ${matching.length} cases from ${firstTC}. Cases from other Tax Centers were excluded to preserve jurisdiction boundaries.`);
          }
        } else {
          setSelectedCases(new Set(paginatedCases.map(c => c.id)));
        }
      }
    } else {
      setSelectedCases(new Set());
    }
  };

  // ── Assignment Execution ───────────────────────────────────────────────────
  const handleAssign = async () => {
    if (!selectedTeamLeader) {
      setErrorMessage('Please select a team leader');
      return;
    }

    if (selectedCases.size === 0) {
      setErrorMessage('Please select at least one case');
      return;
    }

    if (isMultipleTCSelected) {
      setErrorMessage(`Cannot assign cases spanning multiple Tax Centers (${selectedTaxCenters.join(', ')}). Please select cases from a single Tax Center.`);
      return;
    }

    setAssignLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const caseIds = Array.from(selectedCases);
      const assignments = caseIds.map(id => ({
        caseId: id,
        teamLeaderId: selectedTeamLeader,
        status: 'ASSIGNED_TO_TEAM_LEADER'
      }));

      const response = await fetch('/api/v1/backoffice/ap/cases/bulk-assign-team-leader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': committee || 'committee-user',
        },
        body: JSON.stringify({ assignments }),
      });

      if (response.ok) {
        const assignedTLObj = teamLeaders.find(t => t.id === selectedTeamLeader);
        const tlName = assignedTLObj?.name || selectedTeamLeader;
        setSuccessMessage(`✅ Successfully assigned ${caseIds.length} ${targetAuditType?.replace(/_/g, ' ')} case(s) to Team Leader ${tlName} at ${targetTC || 'Tax Center'}`);
        setSelectedCases(new Set());
        setSelectedTeamLeader('');
        setAssignModal(false);
        window.dispatchEvent(new Event('notification-updated'));
        setTimeout(() => loadCases(), 800);
      } else {
        const error = await response.json();
        setErrorMessage(error.message || 'Failed to assign cases');
      }
    } catch (error) {
      console.error('Assignment error:', error);
      setErrorMessage('Error assigning cases: ' + error.message);
    } finally {
      setAssignLoading(false);
    }
  };

  // Lookup map for resolving Plan Year and Plan Name by planId
  const planMap = useMemo(() => {
    const map = new Map();
    plans.forEach(p => {
      if (p.id) map.set(p.id, p);
    });
    return map;
  }, [plans]);

  // Extract Plan Year for any case object
  const getCasePlanYear = useCallback((c) => {
    if (!c) return null;
    if (c.planYear) return String(c.planYear);
    if (c.year) return String(c.year);
    if (c.planId && planMap.has(c.planId)) {
      const p = planMap.get(c.planId);
      if (p.planYear) return String(p.planYear);
      if (p.year) return String(p.year);
    }
    if (c.caseNumber && typeof c.caseNumber === 'string') {
      const prefix = c.caseNumber.split('-')[0];
      if (/^\d{4}$/.test(prefix)) {
        return prefix;
      }
    }
    return null;
  }, [planMap]);

  // Available Plan Years derived from cases and loaded plans
  const availablePlanYears = useMemo(() => {
    const yearCounts = {};
    cases.forEach(c => {
      const yr = getCasePlanYear(c);
      if (yr) {
        yearCounts[yr] = (yearCounts[yr] || 0) + 1;
      }
    });
    // Include any years from loaded plans even if count is 0
    plans.forEach(p => {
      const yr = String(p.planYear || p.year || '');
      if (yr && yearCounts[yr] === undefined) {
        yearCounts[yr] = 0;
      }
    });
    return Object.keys(yearCounts)
      .sort((a, b) => Number(b) - Number(a))
      .map(yr => ({
        year: yr,
        count: yearCounts[yr] || 0,
        label: `FY ${yr} (${yearCounts[yr] || 0})`,
      }));
  }, [cases, plans, getCasePlanYear]);

  const handlePlanYearFilterChange = (newYear) => {
    setFilterYear(newYear);
    setPage(1);
    if (newYear !== 'ALL') {
      setSelectedCases(prev => {
        const next = new Set();
        prev.forEach(id => {
          const c = cases.find(item => item.id === id);
          if (c && getCasePlanYear(c) === newYear) {
            next.add(id);
          }
        });
        return next;
      });
    }
  };

  // Available Tax Centers for filtering: scoped to home TC if committee is location-specific
  const availableTaxCenters = useMemo(() => {
    const list = Array.from(new Set(cases.map(c => c.taxCenterCode || c.taxCenter).filter(Boolean))).sort();
    if (committeeHomeTC) {
      const filtered = list.filter(tc => areTaxCentersMatching(tc, committeeHomeTC));
      return filtered.length > 0 ? filtered : [committeeHomeTC];
    }
    return list;
  }, [cases, committeeHomeTC]);

  const handleTaxCenterFilterChange = (newTC) => {
    setFilterTC(newTC);
    setFilterTL('ALL');
    setPage(1);
    if (selectedCaseObjects.some(c => newTC !== 'ALL' && !areTaxCentersMatching(c.taxCenterCode || c.taxCenter, newTC))) {
      setSelectedCases(new Set());
    }
  };

  // Filter cases based on user controls
  const filteredCases = cases.filter(c => {
    // Filter by plan year
    if (filterYear !== 'ALL') {
      const cy = getCasePlanYear(c);
      if (cy !== filterYear) return false;
    }

    // Filter by team leader
    if (filterTL === 'UNASSIGNED') {
      if (c.assignedTeamLeaderId && c.assignedTeamLeaderId !== committee) return false;
    } else if (filterTL !== 'ALL') {
      if (c.assignedTeamLeaderId !== filterTL && c.assignedTeamLeader !== filterTL) return false;
    }

    // Filter by status
    if (filterStatus === 'PENDING') {
      if (c.status !== 'PENDING_ASSIGNMENT' && c.status !== 'ASSIGNED_TO_COMMITTEE' && c.status !== 'PENDING') return false;
    } else if (filterStatus === 'ASSIGNED') {
      if (c.status !== 'ASSIGNED_TO_TEAM_LEADER' && c.status !== 'ASSIGNED' && !c.assignedTeamLeaderId) return false;
    }

    // Filter by tax center
    if (filterTC !== 'ALL') {
      if (!areTaxCentersMatching(c.taxCenterCode || c.taxCenter, filterTC)) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNumber = (c.caseNumber || '').toLowerCase().includes(q);
      const matchTaxpayer = (c.taxpayerName || '').toLowerCase().includes(q);
      const matchTIN = (c.taxpayerId || '').toLowerCase().includes(q);
      if (!matchNumber && !matchTaxpayer && !matchTIN) return false;
    }

    return true;
  });

  const paginatedCases = filteredCases.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const yearScopedCases = useMemo(() => {
    if (filterYear === 'ALL') return cases;
    return cases.filter(c => getCasePlanYear(c) === filterYear);
  }, [cases, filterYear, getCasePlanYear]);

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / itemsPerPage));
  const totalYearCount = yearScopedCases.length;
  const pendingCount = yearScopedCases.filter(c => !c.assignedTeamLeaderId || c.status === 'PENDING_ASSIGNMENT' || c.status === 'ASSIGNED_TO_COMMITTEE' || c.status === 'PENDING').length;
  const assignedCount = yearScopedCases.filter(c => c.assignedTeamLeaderId && c.status !== 'PENDING_ASSIGNMENT' && c.status !== 'ASSIGNED_TO_COMMITTEE' && c.status !== 'PENDING').length;

  return (
    <div className="space-y-4 p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📋 Assign {auditType?.replace(/_/g, ' ')} Cases to Team Leaders</span>
            <Badge color="purple" dot>
              {filterYear !== 'ALL' ? `${totalYearCount} in FY ${filterYear}` : `${cases.length} Total`}
            </Badge>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Acting Authority: <code className="text-blue-600 dark:text-blue-400 font-mono font-bold">{committee}</code> • Delegating strictly to qualified Team Leaders within taxpayer tax center
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            icon={Send}
            onClick={() => {
              if (selectedCases.size === 0) {
                setErrorMessage('Please select at least one case by checking the boxes below.');
                return;
              }
              if (isMultipleTCSelected) {
                setErrorMessage(`Selected cases span multiple Tax Centers (${selectedTaxCenters.join(', ')}). Please select cases from one Tax Center.`);
                return;
              }
              setSelectedTeamLeader('');
              setAssignModal(true);
            }}
            disabled={selectedCases.size === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            Assign Selected ({selectedCases.size})
          </Button>
          <Button variant="secondary" size="sm" onClick={() => { loadCases(); loadPlans(); }} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <Alert type="success" title="Assignment Successful">
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert type="error" title="Jurisdiction Notice">
          {errorMessage}
        </Alert>
      )}

      {/* Live Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {filterYear !== 'ALL' ? `FY ${filterYear} Cases` : 'Total Committee Cases'}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{totalYearCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {filterYear !== 'ALL' ? `Under FY ${filterYear} plan (${cases.length} all years)` : 'Under committee review'}
          </p>
        </div>
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
          <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Pending Assignment</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{pendingCount}</p>
          <p className="text-[10px] text-amber-600/70 mt-0.5">
            {filterYear !== 'ALL' ? `Awaiting TL delegation (FY ${filterYear})` : 'Awaiting TL delegation'}
          </p>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Assigned to TLs</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{assignedCount}</p>
          <p className="text-[10px] text-emerald-600/70 mt-0.5">
            {filterYear !== 'ALL' ? `Under execution (FY ${filterYear})` : 'Under execution'}
          </p>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
          <p className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            {filterTC !== 'ALL'
              ? `Eligible TLs in ${filterTC}`
              : (committeeHomeTC ? `Eligible TLs (${committeeHomeTC})` : 'Eligible Team Leaders')}
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
            {eligibleTeamLeaders.length}
          </p>
          <p className="text-[10px] text-blue-600/70 mt-0.5">{auditType?.replace(/_/g, ' ')} specialized • strictly eligible</p>
        </div>
      </div>

      {/* Active Selection Banner */}
      {selectedCases.size > 0 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge color="blue" size="sm" className="font-bold">
              {selectedCases.size} Case{selectedCases.size > 1 ? 's' : ''} Selected
            </Badge>
            {filterYear !== 'ALL' && (
              <Badge color="purple" size="sm" className="font-semibold">
                FY {filterYear}
              </Badge>
            )}
            <span className="text-xs text-blue-900 dark:text-blue-200 font-medium">
              Tax Center Scope: <strong className="font-mono">{targetTC ? getTaxCenterDisplayName(targetTC) : 'Mixed'}</strong>
            </span>
            <span className="text-xs text-blue-700 dark:text-blue-300">
              • Specialized in: <strong className="font-bold">{targetAuditType.replace(/_/g, ' ')}</strong>
            </span>
            <span className="text-xs text-emerald-700 dark:text-emerald-400">
              • ({availableTLsForAssignment.length} eligible Team Leader{availableTLsForAssignment.length !== 1 ? 's' : ''} available)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant="secondary"
              onClick={() => setSelectedCases(new Set())}
            >
              Clear
            </Button>
            <Button
              size="xs"
              variant="primary"
              icon={Send}
              onClick={() => {
                setSelectedTeamLeader('');
                setAssignModal(true);
              }}
              disabled={isMultipleTCSelected || availableTLsForAssignment.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Assign to {targetTC || 'TL'}
            </Button>
          </div>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 items-center p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-200 dark:border-slate-700">
        <Input
          placeholder="Search taxpayer, TIN, or case #..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          className="w-full text-xs"
        />

        <Select
          value={filterYear}
          onChange={(e) => handlePlanYearFilterChange(e.target.value)}
          options={[
            { value: 'ALL', label: `All Plan Years (${cases.length})` },
            ...availablePlanYears.map(py => ({
              value: py.year,
              label: `Plan Year: ${py.label}`,
            }))
          ]}
          className="text-xs font-medium"
        />

        <Select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          options={[
            { value: 'ALL', label: 'All Statuses' },
            { value: 'PENDING', label: 'Pending Assignment Only' },
            { value: 'ASSIGNED', label: 'Already Assigned' },
          ]}
          className="text-xs"
        />

        {availableTaxCenters.length > 0 && (
          <Select
            value={filterTC}
            onChange={(e) => handleTaxCenterFilterChange(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Tax Centers' },
              ...availableTaxCenters.map(tc => ({ value: tc, label: `Tax Center: ${tc}` })),
            ]}
            className="text-xs"
          />
        )}

        <Select
          value={filterTL}
          onChange={(e) => { setFilterTL(e.target.value); setPage(1); }}
          options={[
            {
              value: 'ALL',
              label: filterTC !== 'ALL'
                ? `All Eligible TLs in ${filterTC} (${eligibleTeamLeaders.length})`
                : (committeeHomeTC
                    ? `Eligible TLs in ${committeeHomeTC} (${eligibleTeamLeaders.length})`
                    : `All Eligible Team Leaders (${eligibleTeamLeaders.length})`
                  )
            },
            { value: 'UNASSIGNED', label: 'Not Yet Assigned to TL' },
            ...eligibleTeamLeaders.map(tl => {
              const count = tlWorkloadMap[tl.id] || 0;
              return {
                value: tl.id,
                label: `${tl.name} (${tl.taxCenter}) • ${count} assigned`
              };
            }),
          ]}
          className="text-xs"
        />
      </div>

      {/* Cases Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader className="animate-spin" size={32} />
            <p className="ml-2 text-gray-600 dark:text-slate-400">Loading cases...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={paginatedCases.length > 0 && paginatedCases.every(c => selectedCases.has(c.id))}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200 uppercase">Case Number</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200 uppercase">Taxpayer & Sector</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200 uppercase">Tax Center</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200 uppercase">Risk</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200 uppercase">Assigned TL</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-slate-200 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-slate-200 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {paginatedCases.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500 text-sm">
                      No cases match the selected filters or search query.
                    </td>
                  </tr>
                ) : (
                  paginatedCases.map(c => {
                    const isRowSelected = selectedCases.has(c.id);
                    const caseTC = c.taxCenterCode || c.taxCenter;
                    return (
                      <tr
                        key={c.id}
                        className={`transition ${
                          isRowSelected
                            ? 'bg-blue-50/70 dark:bg-blue-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isRowSelected}
                            onChange={(e) => handleSelectCase(c.id, e.target.checked)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
                              {c.caseNumber}
                            </span>
                            {(() => {
                              const yr = getCasePlanYear(c);
                              if (!yr) return null;
                              return (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                  FY {yr}
                                </span>
                              );
                            })()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setViewingCase(c)}
                            className="text-left group cursor-pointer focus:outline-none"
                            title="View authentic taxpayer profile and filing history"
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:underline">
                              {c.taxpayerName || c.taxpayerId}
                            </p>
                            <p className="text-xs text-gray-500">
                              {c.sector || 'Commercial'} • TIN: <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{c.taxpayerId}</span>
                            </p>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-gray-600 dark:text-slate-300">
                          <Badge color="slate" size="xs" className="font-mono font-bold">
                            {caseTC || '—'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge color={c.riskScore >= 70 ? 'red' : c.riskScore >= 40 ? 'yellow' : 'blue'} size="sm">
                            {c.riskScore || 0}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 dark:text-slate-300">
                          {(() => {
                            const assignedId = c.assignedTeamLeaderId || c.assignedTeamLeader;
                            if (!assignedId || assignedId === committee) {
                              return <Badge color="gray" dot size="xs">Pending TL</Badge>;
                            }
                            const tlObj = tlMap.get(assignedId);
                            if (tlObj) {
                              return (
                                <div className="flex flex-col items-start gap-0.5">
                                  <Badge color="green" dot size="xs" className="font-semibold">
                                    {tlObj.name}
                                  </Badge>
                                  <span className="text-[10px] text-gray-500 dark:text-slate-400 font-mono">
                                    {tlObj.taxCenter}
                                  </span>
                                </div>
                              );
                            }
                            return <Badge color="green" dot size="xs">{assignedId}</Badge>;
                          })()}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <Badge color={['ASSIGNED_TO_TEAM_LEADER', 'ASSIGNED'].includes(c.status) ? 'green' : 'amber'} size="xs">
                            {c.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => setViewingCase(c)}
                              title="View authentic taxpayer dossier & 16 data tabs"
                            >
                              Details
                            </Button>
                            <Button
                              size="xs"
                              variant="secondary"
                              onClick={() => {
                                setSelectedCases(new Set([c.id]));
                                setSelectedTeamLeader('');
                                setAssignModal(true);
                              }}
                            >
                              Assign
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-slate-600">
                <span className="text-xs text-gray-500">
                  Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredCases.length)} of {filteredCases.length} cases
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    ← Previous
                  </Button>
                  <span className="text-xs font-bold text-gray-700 dark:text-slate-300">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Assignment Modal */}
      {assignModal && (
        <Modal
          open={assignModal}
          onClose={() => {
            setAssignModal(false);
            setSelectedTeamLeader('');
          }}
          title="🎯 Assign Cases to Team Leader"
          size="lg"
          footer={
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setAssignModal(false);
                  setSelectedTeamLeader('');
                }}
              >
                Cancel
              </Button>
              <Button
                icon={Send}
                loading={assignLoading}
                onClick={handleAssign}
                disabled={!selectedTeamLeader || availableTLsForAssignment.length === 0 || isMultipleTCSelected}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Assign {selectedCases.size} Case{selectedCases.size > 1 ? 's' : ''}
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {isMultipleTCSelected ? (
              <Alert type="error" title="Jurisdiction Conflict">
                Selected cases belong to multiple Tax Centers ({selectedTaxCenters.join(', ')}). Team Leaders can only receive cases within their assigned Tax Center. Please cancel and select cases from one Tax Center at a time.
              </Alert>
            ) : (
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                    Tax Center Scope:
                  </span>
                  <Badge color="blue" size="sm" className="font-mono font-bold">
                    {targetTC ? getTaxCenterDisplayName(targetTC) : 'Tax Center Scope'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                    Audit Type Specialization:
                  </span>
                  <Badge color="purple" size="sm" className="font-bold">
                    {targetAuditType.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                    Cases to Assign:
                  </span>
                  <Badge color="slate" size="sm" className="font-bold">
                    {selectedCases.size} Case{selectedCases.size > 1 ? 's' : ''}
                  </Badge>
                </div>
                <p className="text-[11px] text-blue-700 dark:text-blue-300 pt-1 border-t border-blue-200 dark:border-blue-800/60">
                  ⚡ <strong>Statutory Scope Enforced:</strong> The list below displays <strong>ONLY Team Leaders stationed at {targetTC || 'this Tax Center'} specializing in {targetAuditType.replace(/_/g, ' ')}</strong>.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                Select Qualified Team Leader ({targetTC ? getTaxCenterDisplayName(targetTC) : 'Tax Center'} • {targetAuditType.replace(/_/g, ' ')})
              </label>
              <Select
                value={selectedTeamLeader}
                onChange={(e) => setSelectedTeamLeader(e.target.value)}
                options={[
                  {
                    value: '',
                    label: availableTLsForAssignment.length > 0
                      ? `Choose from ${availableTLsForAssignment.length} qualified ${targetAuditType.replace(/_/g, ' ')} Team Leader${availableTLsForAssignment.length > 1 ? 's' : ''}...`
                      : `No ${targetAuditType.replace(/_/g, ' ')} Team Leaders found for ${targetTC}`
                  },
                  ...availableTLsForAssignment.map(tl => {
                    const activeCount = tlWorkloadMap[tl.id] || 0;
                    return {
                      value: tl.id,
                      label: `${tl.name} (${tl.id}) — ${tl.taxCenter} • [${activeCount} active case${activeCount !== 1 ? 's' : ''}]`,
                    };
                  }),
                ]}
                disabled={availableTLsForAssignment.length === 0 || isMultipleTCSelected}
              />
            </div>

            {availableTLsForAssignment.length === 0 && !isMultipleTCSelected && (
              <Alert type="warning" title="No Qualified Team Leader Found">
                No active Team Leader matching Tax Center <strong>{targetTC}</strong> and Audit Type <strong>{targetAuditType}</strong> was found. Please ensure Team Leaders are configured for this tax center.
              </Alert>
            )}

            {availableTLsForAssignment.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Qualified Team Leaders for {targetTC} ({targetAuditType.replace(/_/g, ' ')}):
                </p>
                <div className="mt-2 space-y-1.5">
                  {availableTLsForAssignment.map(tl => {
                    const activeCount = tlWorkloadMap[tl.id] || 0;
                    return (
                      <div
                        key={tl.id}
                        onClick={() => setSelectedTeamLeader(tl.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between ${
                          selectedTeamLeader === tl.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 font-bold ring-1 ring-blue-500/50'
                            : 'border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <div>
                            <span className="font-semibold">{tl.name}</span>
                            <span className="text-[10px] text-gray-500 dark:text-slate-400 font-mono ml-1.5">({tl.id})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge color="slate" size="xs">{tl.taxCenter}</Badge>
                          <Badge color="purple" size="xs">{tl.auditType?.replace(/_/g, ' ')}</Badge>
                          <Badge color={activeCount > 0 ? 'blue' : 'gray'} size="xs">
                            {activeCount} active
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Authentic Taxpayer Dossier Modal */}
      {viewingCase && (
        <CaseDetailModal
          caseData={viewingCase}
          onClose={() => setViewingCase(null)}
        />
      )}
    </div>
  );
}
