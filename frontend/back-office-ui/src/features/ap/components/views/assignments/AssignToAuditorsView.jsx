import React, { useState, useEffect } from 'react';
import Card from '../../Card';
import Badge from '../../Badge';
import { useData } from '../../../services/dataService';
import { useAuth } from '../../../context/AuthContext';
import {
  loadAssignmentsByUser,
  loadAuditors,
  loadAuditor,
  loadAssignment,
  saveAssignment,
  updateAuditorWorkload,
  updateTeamLeaderWorkload,
  loadTeamLeader
} from '../../../utils/assignmentData';
import { createAssignment, ASSIGNMENT_STATES } from '../../../utils/assignmentDataModels';
import { executeTransition } from '../../../utils/assignmentStateMachine';
import { rankAuditors } from '../../../utils/assignmentScoring';
import { getBestAvailableAuditor } from '../../../utils/intelligentCaseDistribution';
import { acceptAndDistributeCaseToAuditor } from '../../../utils/teamLeaderDistribution';

/**
 * AssignToAuditorsView - Team Leader
 * Displays cases assigned to team leader and recommends auditors
 * Team leader selects auditor to assign case to
 */

function AssignToAuditorsView() {
  const { getUserInfo } = useAuth();
  const { data, updateData } = useData();
  const userInfo = getUserInfo();

  const [myAuditors, setMyAuditors] = useState([]);
  const [casesByTeamLeader, setCasesByTeamLeader] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [selectedAuditor, setSelectedAuditor] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [expandedCase, setExpandedCase] = useState(null);
  const [selectedCases, setSelectedCases] = useState(new Set());
  const [assignmentSummary, setAssignmentSummary] = useState(null);
  const [processingCase, setProcessingCase] = useState(null);
  const [processConfirmation, setProcessConfirmation] = useState(null);
  const [caseAcceptanceModal, setCaseAcceptanceModal] = useState(null);
  const [availablePlanYears, setAvailablePlanYears] = useState([]);
  const [selectedPlanYear, setSelectedPlanYear] = useState(null);

  useEffect(() => {
    loadCasesAndAuditors();
    
    // ✅ FIX: Auto-refresh every 10 seconds to catch new assignments
    const refreshInterval = setInterval(() => {
      console.log('🔄 [AUTO-REFRESH] Checking for new case assignments...');
      loadCasesAndAuditors();
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(refreshInterval);
  }, []);

  const loadCasesAndAuditors = () => {
    try {
      setLoading(true);
      const userRegion = userInfo?.orgContext?.assignedRegion;
      const userTaxCenter = userInfo?.orgContext?.assignedTaxCenter;
      const tlId = userInfo?.userId || userInfo?.id;

      // ✅ LOAD DATA FIRST - needed for all filters
      // Using data from hook


      console.log(`🔄 [LoadCases] Starting load for Team Leader:`);
      console.log(`   tlId: ${tlId}`);
      console.log(`   fullName: ${userInfo?.fullName || userInfo?.full_name}`);
      console.log(`   region: ${userRegion}`);
      console.log(`   taxCenter: ${userTaxCenter}`);

      // Get available plan years from stored cases
      // Get available plan years from stored cases
      // ✅ Include cases even if planYear not explicitly set (default to 2027)
      const planYearsArray = [...new Set((data.auditCases || [])
        .filter(c => {
          // Match by Team Leader ID with flexible format
          const isForThisTL = 
            c.status === 'ASSIGNED_TO_TEAM_LEADER' && (
              c.assignedTeamLeaderId === tlId ||
              c.assignedTeamLeaderId === userInfo?.userId ||
              c.assignedTeamLeaderId === userInfo?.id
            );
          return isForThisTL;
        })
        .map(c => c.planYear || 2027)  // ✅ Default to 2027 if not set
      )].sort((a, b) => b - a);
      
      // Use first available plan year or default
      const planYear = selectedPlanYear || (planYearsArray.length > 0 ? planYearsArray[0] : 2027);
      setSelectedPlanYear(planYear);
      
      console.log(`   availablePlanYears: ${planYearsArray.join(', ')}`);
            setAvailablePlanYears(planYearsArray);
      
console.log(`   using planYear: ${planYear}`);

      if (!userRegion || !userTaxCenter || !tlId) {
        setMessage({ type: 'error', text: 'Missing assignment context' });
        return;
      }

      // Load my auditors
      const auditors = loadAuditors(tlId);
      setMyAuditors(auditors);

      // Load assigned cases for Team Leader (combining assignments and auditCases)
      let myAssignments = loadAssignmentsByUser(tlId, 'TEAM_LEADER');

      console.log(`   myAssignments from storage: ${myAssignments.length}`);

      // Find cases matching this Team Leader in auditCases directly
      const directCases = (data.auditCases || []).filter(c => {
        // ✅ DEBUG: Log EVERY case with ASSIGNED_TO_TEAM_LEADER status
        if (c.status === 'ASSIGNED_TO_TEAM_LEADER') {
          console.log(`🔍 [DEBUG] Case ${c.id}:`);
          console.log(`     status: ${c.status}`);
          console.log(`     assignedTeamLeaderId: ${c.assignedTeamLeaderId}`);
          console.log(`     assignedTeamLeaderUserId: ${c.assignedTeamLeaderUserId}`);
          console.log(`     assignedTeamLeader: ${c.assignedTeamLeader}`);
          console.log(`     assignedTeamLeaderEmail: ${c.assignedTeamLeaderEmail}`);
          console.log(`     planYear: ${c.planYear}`);
          console.log(`   Checking against:`);
          console.log(`     tlId: ${tlId}`);
          console.log(`     userInfo.userId: ${userInfo?.userId}`);
          console.log(`     userInfo.id: ${userInfo?.id}`);
          console.log(`     userInfo.fullName: ${userInfo?.fullName}`);
          console.log(`     userInfo.full_name: ${userInfo?.full_name}`);
          console.log(`     userInfo.email: ${userInfo?.email}`);
        }
        
        // Check status first
        if (c.status !== 'ASSIGNED_TO_TEAM_LEADER') {
          return false;
        }
        
        // ✅ ENHANCED ID MATCHING - handle MULTIPLE ID formats for robust matching
        const idMatch = 
          c.assignedTeamLeaderId === tlId ||
          c.assignedTeamLeaderId === userInfo?.userId ||
          c.assignedTeamLeaderId === userInfo?.id ||
          c.assignedTeamLeaderUserId === tlId ||
          c.assignedTeamLeaderUserId === userInfo?.userId ||
          c.assignedTeamLeaderUserId === userInfo?.id ||
          c.assignedTeamLeader === userInfo?.fullName ||
          c.assignedTeamLeader === userInfo?.full_name ||
          c.assignedTeamLeaderEmail === userInfo?.email;
        
        if (!idMatch) {
          console.log(`     ❌ NO MATCH for case ${c.id}`);
          return false;
        }
        
        // ✅ Filter by planYear as well (but allow missing planYear with default)
        const caseYear = c.planYear || 2027; // Default to 2027 if not set
        const yearMatch = !planYear || caseYear === planYear;
        
        if (idMatch && yearMatch) {
          console.log(`     ✅ MATCHED case ${c.id} for TL: ${tlId} (year: ${caseYear})`);
        } else if (idMatch && !yearMatch) {
          console.log(`     ⚠️ ID matched but wrong year: case year=${caseYear}, filter year=${planYear}`);
        }
        
        return idMatch && yearMatch;
      });

      // ✅ DETAILED LOGGING for debugging
      console.log(`   Total cases in system: ${data.auditCases.length}`);
      console.log(`   Checking for cases with status ASSIGNED_TO_TEAM_LEADER...`);
      
      const allTLAssigned = (data.auditCases || []).filter(c => 
        c.status === 'ASSIGNED_TO_TEAM_LEADER'
      ).length;
      console.log(`   Cases with ASSIGNED_TO_TEAM_LEADER status: ${allTLAssigned}`);
      
      directCases.forEach(c => {
        console.log(`     ✅ MATCHED: ${c.id} | TL: ${c.assignedTeamLeaderId || c.assignedTeamLeader} | PlanYear: ${c.planYear}`);
      });
      
      console.log(`   directCases matched: ${directCases.length}`);

      // Combine cases into Map to deduplicate by ID
      const caseMap = new Map();
      myAssignments.forEach(a => {
        const auditCase = (data.auditCases || []).find(c => c.id === a.caseId);
        if (auditCase) caseMap.set(auditCase.id, { ...auditCase, assignment: a });
      });

      directCases.forEach(c => {
        if (!caseMap.has(c.id)) {
          const assignment = (data.assignments || []).find(a => a.caseId === c.id) || {
            caseId: c.id,
            region: c.region,
            taxCenter: c.taxCenter,
            auditType: c.auditType,
            currentState: 'ASSIGNED_TO_TEAM_LEADER',
            currentOwner: tlId,
            currentOwnerRole: 'TEAM_LEADER'
          };
          caseMap.set(c.id, { ...c, assignment });
        }
      });

      const cases = Array.from(caseMap.values());
      console.log(`   ✅ Total cases to show: ${cases.length}`);
      setCasesByTeamLeader(cases);

      // Generate recommendations for each case
      const recs = {};
      cases.forEach(c => {
        if (auditors.length > 0) {
          const ranked = rankAuditors(c, auditors, tlId);
          recs[c.id] = ranked.slice(0, 3); // Top 3
        }
      });
      setRecommendations(recs);

      console.log('✓ Loaded:', {
        auditors: auditors.length,
        cases: cases.length,
        recommendations: Object.keys(recs).length
      });
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Error loading data' });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToAuditor = (caseId, auditorId) => {
    try {
      const auditCase = casesByTeamLeader.find(c => c.id === caseId);
      const auditor = myAuditors.find(a => a.id === auditorId);

      if (!auditCase || !auditor) {
        throw new Error('Invalid case or auditor');
      }

      // Check capacity
      if (auditor.currentWorkload >= auditor.maxCapacity) {
        setMessage({
          type: 'error',
          text: `${auditor.fullName || auditor.full_name} is at capacity (${auditor.currentWorkload}/${auditor.maxCapacity})`
        });
        return;
      }

      // Get or create assignment
      let assignment = auditCase.assignment;
      if (!assignment) {
        assignment = createAssignment({
          caseId,
          region: auditCase.region,
          taxCenter: auditCase.taxCenter,
          auditType: auditCase.auditType
        });
      }

      // Execute transition
      assignment = executeTransition(
        assignment,
        ASSIGNMENT_STATES.ASSIGNED_TO_AUDITOR,
        {
          toUser: auditorId,
          fromUser: userInfo.userId || userInfo.id,
          reason: `Assigned by Team Leader ${userInfo.fullName || userInfo.full_name} based on recommendations`
        }
      );

      // Save assignment
      saveAssignment(assignment);

      // Also update data.auditCases directly
      const caseIdx = (data.auditCases || []).findIndex(c => c.id === caseId);
      if (caseIdx !== -1) {
        data.auditCases[caseIdx].status = 'ASSIGNED_TO_AUDITOR';
        data.auditCases[caseIdx].assignedAuditor = auditor.fullName || auditor.full_name;
        data.auditCases[caseIdx].assignedAuditorId = auditor.id;
        updateData(data);
      }

      // Update auditor workload - NON-CRITICAL (silently continues on failure)
      updateAuditorWorkload(auditorId, 1); // Don't check result - always continue

      // Update case in local state
      setCasesByTeamLeader(
        casesByTeamLeader.map(c =>
          c.id === caseId ? { ...c, status: 'ASSIGNED_TO_AUDITOR', assignedAuditor: auditor.fullName || auditor.full_name, assignment } : c
        )
      );

      // Update auditor workload in local state so subsequent assignments load balance correctly
      setMyAuditors(prev => prev.map(a => 
        a.id === auditorId ? { ...a, currentWorkload: a.currentWorkload + 1 } : a
      ));

      setMessage({
        type: 'success',
        text: `Case assigned to ${auditor.fullName || auditor.full_name}`
      });
    } catch (error) {
      console.error('Error assigning case:', error);
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleProcessAssignment = (caseId) => {
    const auditCase = casesByTeamLeader.find(c => c.id === caseId);
    if (!auditCase) return;

    // Show case acceptance modal
    setCaseAcceptanceModal({
      caseId,
      caseName: auditCase.taxpayerName,
      auditType: auditCase.auditType,
      riskLevel: auditCase.riskLevel,
      estimatedHours: auditCase.estimatedHours
    });
  };

  /**
   * ✅ NEW: Accept case and smart-assign to best auditor
   * Uses same logic as Tax Center → Team Leader assignment
   * Automatically assigns to least-loaded auditor
   */
  const handleAcceptAndAssignCase = () => {
    if (!caseAcceptanceModal) return;

    try {
      const { caseId } = caseAcceptanceModal;
      const tlId = userInfo?.userId || userInfo?.id;

      // ✅ LOAD DATA FIRST - needed for all filters
      // Using data from hook


      console.log(`🔄 [AcceptCase] Accepting and assigning case ${caseId}`);

      // Use smart distribution to assign to best auditor
      const result = acceptAndDistributeCaseToAuditor(caseId, tlId);

      if (!result.success) {
        setMessage({ type: 'error', text: `❌ Error: ${result.message}` });
        setCaseAcceptanceModal(null);
        return;
      }

      // Reload data
      loadCasesAndAuditors();
      setCaseAcceptanceModal(null);

      setMessage({
        type: 'success',
        text: `✅ Case accepted and assigned to ${result.distribution.auditorName}`
      });

      console.log(`✅ [AcceptCase] Success - Assigned to ${result.distribution.auditorName}`);

    } catch (error) {
      console.error('❌ [AcceptCase] Error:', error);
      setMessage({ type: 'error', text: 'Error processing assignment' });
      setCaseAcceptanceModal(null);
    }
  };

  const handleProcessAssignment_old = (caseId) => {
    const auditCase = casesByTeamLeader.find(c => c.id === caseId);
    if (!auditCase) return;

    setProcessingCase(caseId);
    setProcessConfirmation({
      caseId,
      caseName: auditCase.taxpayerName,
      auditType: auditCase.auditType,
      riskLevel: auditCase.riskLevel,
      estimatedHours: auditCase.estimatedHours
    });
  };

  const confirmProcessAssignment = () => {
    if (!processConfirmation) return;

    try {
      const { caseId } = processConfirmation;
      const auditCase = casesByTeamLeader.find(c => c.id === caseId);

      if (!auditCase || !myAuditors.length) {
        throw new Error('Case or auditors not found');
      }

      // Auto-assign to least busy auditor
      const availableAuditors = [...myAuditors].sort((a, b) => a.currentWorkload - b.currentWorkload);
      const selectedAuditor = availableAuditors[0];

      // Process the assignment
      handleAssignToAuditor(caseId, selectedAuditor.id);

      setMessage({
        type: 'success',
        text: `✓ Assignment processed and allocated to ${selectedAuditor.fullName}`
      });

      setProcessConfirmation(null);
      setProcessingCase(null);
    } catch (error) {
      console.error('Error processing assignment:', error);
      setMessage({ type: 'error', text: 'Error processing assignment' });
    }
  };

  const toggleCaseSelection = (caseId, e) => {
    e.stopPropagation();
    const newSelected = new Set(selectedCases);
    if (newSelected.has(caseId)) {
      newSelected.delete(caseId);
    } else {
      newSelected.add(caseId);
    }
    setSelectedCases(newSelected);
  };

  const handleBulkAssign = () => {
    try {
      const casesToAssign = casesByTeamLeader.filter(c => 
        selectedCases.has(c.id) && c.assignment?.currentState === ASSIGNMENT_STATES.ASSIGNED_TO_TEAM_LEADER
      );
      
      if (casesToAssign.length === 0) {
        setMessage({ type: 'warning', text: 'Please select unassigned cases first.' });
        return;
      }

      if (myAuditors.length === 0) {
        setMessage({ type: 'error', text: 'No auditors available in your team.' });
        return;
      }

      const summaryList = [];
      const updatedCases = [...casesByTeamLeader];

      casesToAssign.forEach((c) => {
        try {
          // Get the best available auditor using intelligent distribution
          const bestAuditor = getBestAvailableAuditor(userInfo.userId || userInfo.id, data);

          if (!bestAuditor) {
            console.warn(`No available auditor for case ${c.id}`);
            setMessage({ 
              type: 'warning', 
              text: `Skipped case ${c.id}: No available auditors with capacity` 
            });
            return;
          }

          // Get or create assignment
          let assignment = c.assignment;
          if (!assignment) {
            assignment = createAssignment({
              caseId: c.id,
              region: c.region,
              taxCenter: c.taxCenter,
              auditType: c.auditType
            });
          }

          // Execute transition
          assignment = executeTransition(
            assignment,
            ASSIGNMENT_STATES.ASSIGNED_TO_AUDITOR,
            {
              toUser: bestAuditor.id,
              fromUser: userInfo.userId || userInfo.id,
              reason: `Auto-assigned by Team Leader ${userInfo.fullName} via bulk assignment`
            }
          );

          saveAssignment(assignment);
          
          // Update auditor workload - NON-CRITICAL (silently continues on failure)
          updateAuditorWorkload(bestAuditor.id, 1); // Don't check result - always continue

          // Also update data.auditCases directly
          const caseIdxInStore = (data.auditCases || []).findIndex(uc => uc.id === c.id);
          if (caseIdxInStore !== -1) {
            data.auditCases[caseIdxInStore].status = 'ASSIGNED_TO_AUDITOR';
            data.auditCases[caseIdxInStore].assignedAuditor = bestAuditor.full_name || bestAuditor.fullName;
            data.auditCases[caseIdxInStore].assignedAuditorId = bestAuditor.id;
            updateData(data); // Save the core case update
          }

          const caseIdx = updatedCases.findIndex(uc => uc.id === c.id);
          if (caseIdx !== -1) {
            updatedCases[caseIdx] = { 
              ...updatedCases[caseIdx], 
              status: 'ASSIGNED_TO_AUDITOR',
              assignedAuditor: bestAuditor.full_name || bestAuditor.fullName,
              assignment 
            };
          }

          summaryList.push({
            caseId: c.id,
            auditorName: bestAuditor.full_name || bestAuditor.fullName,
            auditorId: bestAuditor.id,
            auditType: c.auditType
          });

          console.log(`✓ Auto-assigned case ${c.id} to ${bestAuditor.full_name || bestAuditor.fullName}`);
        } catch (err) {
          console.error(`Error assigning case ${c.id}:`, err);
        }
      });

      setCasesByTeamLeader(updatedCases);
      setSelectedCases(new Set());
      setAssignmentSummary(summaryList);
      setMyAuditors(loadAuditors(userInfo.userId || userInfo.id)); // refresh workloads

      if (summaryList.length > 0) {
        setMessage({
          type: 'success',
          text: `✅ Auto-assigned ${summaryList.length} case${summaryList.length !== 1 ? 's' : ''} to available auditors`
        });
      }
    } catch (error) {
      console.error('Error bulk assigning:', error);
      setMessage({ type: 'error', text: 'Error bulk-assigning cases' });
    }
  };

  const getAuditorColor = (auditor) => {
    const percent = (auditor.currentWorkload / auditor.maxCapacity) * 100;
    if (percent >= 100) return '#ff5252';
    if (percent >= 80) return '#ff9800';
    if (percent >= 60) return '#ffc107';
    return '#4caf50';
  };

  const getMatchBreakdown = (auditor, caseData) => {
    const recs = recommendations[caseData.id] || [];
    const rec = recs.find(r => r.id === auditor.id);
    if (!rec) return null;

    return {
      skillsMatch: rec.skillsScore || 0,
      workloadScore: rec.workloadScore || 0,
      sectorScore: rec.sectorScore || 0,
      complexityScore: rec.complexityScore || 0,
      totalScore: rec.totalScore || 0
    };
  };

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <div className="detail-header">
        <h2><i className="fas fa-random"></i> Assign Cases to Auditors</h2>
        <Badge status={`${casesByTeamLeader.length} Cases`} className="director-approved" />
      </div>

      {message && (
        <div style={{
          background: message.type === 'success' ? '#c8e6c9' : message.type === 'error' ? '#ffcdd2' : '#fff9c4',
          color: message.type === 'success' ? '#2e7d32' : message.type === 'error' ? '#c62828' : '#f57f17',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '16px',
          fontSize: '12px'
        }}>
          {message.text}
        </div>
      )}

      {/* ✅ DEBUG PANEL: Show what we're looking for */}
      <div style={{
        background: '#1a1f36',
        border: '2px solid #ffc107',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        fontSize: '11px',
        fontFamily: 'monospace'
      }}>
        <div style={{ color: '#ffc107', fontWeight: 'bold', marginBottom: '8px' }}>
          🔍 DEBUG: Team Leader Identity Check
        </div>
        <div style={{ color: '#f0f6fc', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div><strong>userId:</strong> {userInfo?.userId || 'null'}</div>
          <div><strong>id:</strong> {userInfo?.id || 'null'}</div>
          <div><strong>fullName:</strong> {userInfo?.fullName || 'null'}</div>
          <div><strong>full_name:</strong> {userInfo?.full_name || 'null'}</div>
          <div><strong>email:</strong> {userInfo?.email || 'null'}</div>
          <div><strong>role:</strong> {userInfo?.role || 'null'}</div>
        </div>
        <div style={{ color: '#8b949e', marginTop: '8px', fontSize: '10px' }}>
          💡 The system is looking for cases where <code>assignedTeamLeaderId</code> or <code>assignedTeamLeader</code> matches ANY of the above values.
          Open browser console (F12) to see detailed matching logs for each case.
        </div>
      </div>

      <div style={{
        background: '#0f1419',
        border: '1px solid #30363d',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <small style={{ color: '#8b949e', fontWeight: '600' }}>📅 SELECT PLAN YEAR:</small>
        </div>
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '12px'
        }}>
          {availablePlanYears.length > 0 ? (
            availablePlanYears.map((year) => (
              <button
                key={year}
                onClick={() => {
                  setSelectedPlanYear(year);
                  loadCasesAndAuditors();
                }}
                style={{
                  padding: '10px 16px',
                  background: selectedPlanYear === year ? '#2196f3' : '#1c2128',
                  color: selectedPlanYear === year ? '#fff' : '#8b949e',
                  border: selectedPlanYear === year ? '2px solid #2196f3' : '1px solid #30363d',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                Fiscal Year {year}
              </button>
            ))
          ) : (
            <span style={{ color: '#8b949e', fontSize: '12px' }}>No plan years available</span>
          )}
        </div>
      </div>

      <div style={{
        background: '#1a3a1a',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '24px',
        display: 'flex',
        gap: '12px'
      }}>
        <button
          onClick={handleBulkAssign}
          disabled={selectedCases.size === 0}
          style={{
            padding: '8px 14px',
            background: selectedCases.size > 0 ? '#4caf50' : '#2e7d32',
            color: selectedCases.size > 0 ? '#fff' : '#aaa',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: selectedCases.size > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          <i className="fas fa-magic"></i> Auto-Assign Selected ({selectedCases.size})
        </button>
        <button
          onClick={() => {
            const allUnassigned = casesByTeamLeader.filter(c => c.assignment?.currentState === ASSIGNMENT_STATES.ASSIGNED_TO_TEAM_LEADER).map(c => c.id);
            if (selectedCases.size === allUnassigned.length) {
              setSelectedCases(new Set());
            } else {
              setSelectedCases(new Set(allUnassigned));
            }
          }}
          style={{
            padding: '8px 14px',
            background: '#1c2128',
            color: '#58a6ff',
            border: '1px solid #58a6ff',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Select All Unassigned
        </button>
      </div>

      {casesByTeamLeader.length === 0 ? (
        <div style={{
          background: '#e3f2fd',
          color: '#0c4a6e',
          padding: '24px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #1976d2'
        }}>
          <i className="fas fa-inbox" style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}></i>
          <strong>No cases to assign</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
            Cases will appear here after Tax Center Manager assigns them to your team
          </p>
        </div>
      ) : (
        <>
          {/* My Auditors Summary */}
          <div style={{
            background: '#0f1419',
            border: '1px solid #30363d',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '24px'
          }}>
            <small style={{ color: '#8b949e', display: 'block', marginBottom: '8px' }}>MY AUDIT TEAM ({myAuditors.length}):</small>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {myAuditors.map(auditor => (
                <div key={auditor.id} style={{
                  background: '#1c2128',
                  border: `1px solid ${getAuditorColor(auditor)}`,
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  flex: '1 1 200px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ color: '#f0f6fc' }}>{auditor.fullName}</strong>
                  </div>
                  <div style={{ fontSize: '10px', color: '#8b949e', marginBottom: '4px' }}>
                    <strong>Seniority:</strong> {auditor.seniority}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: '#8b949e',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>Workload: {auditor.currentWorkload}/{auditor.maxCapacity}</span>
                    <span style={{ color: getAuditorColor(auditor) }}>
                      {Math.round((auditor.currentWorkload / auditor.maxCapacity) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cases to Assign */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {casesByTeamLeader.map(c => {
              const topRecs = recommendations[c.id] || [];
              const isAssigned = c.assignment?.currentState === ASSIGNMENT_STATES.ASSIGNED_TO_AUDITOR;

              return (
                <div key={c.id} style={{
                  background: '#1c2128',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  {/* Case Header */}
                  <div
                    onClick={() => setExpandedCase(expandedCase === c.id ? null : c.id)}
                    style={{
                      padding: '12px',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      cursor: 'pointer',
                      background: expandedCase === c.id ? '#2d333b' : 'transparent',
                      gap: '12px'
                    }}
                  >
                    {!isAssigned && (
                      <input 
                        type="checkbox" 
                        checked={selectedCases.has(c.id)}
                        onChange={(e) => toggleCaseSelection(c.id, e)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ color: '#f0f6fc', minWidth: '100px' }}>{c.id.substring(0, 20)}...</strong>
                        <span style={{
                          background: c.riskLevel === 'Critical' ? '#ff5252' :
                            c.riskLevel === 'High' ? '#ff9800' :
                            c.riskLevel === 'Medium' ? '#ffc107' : '#4caf50',
                          color: '#fff',
                          padding: '3px 8px',
                          borderRadius: '3px',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}>
                          {c.riskLevel}
                        </span>
                        <span style={{ fontSize: '10px', color: '#8b949e' }}>
                          {c.auditType.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>
                      <small style={{ color: '#8b949e' }}>
                        {c.taxpayerName} (TIN: {c.tin}) | Est: {c.estimatedHours}hrs
                      </small>
                    </div>
                    <div style={{ color: '#8b949e' }}>
                      {isAssigned ? (
                        <span style={{ color: '#4caf50' }}>✓ Assigned</span>
                      ) : (
                        <i className="fas fa-chevron-down"></i>
                      )}
                    </div>
                  </div>

                    {/* Action Area (Always visible if not assigned) */}
                    {!isAssigned && (
                      <div style={{
                        background: '#0f1419',
                        borderTop: '1px solid #30363d',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <p style={{ fontSize: '12px', color: '#8b949e', margin: 0, flex: 1 }}>
                          Review the case details and click to accept it into your team's workload. 
                          The system will automatically allocate this case to the best available auditor on your team.
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProcessAssignment(c.id);
                          }}
                          style={{
                            padding: '10px 20px',
                            background: '#4caf50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <i className="fas fa-check-circle"></i> Accept & Process
                        </button>
                      </div>
                    )}

                  {/* Assigned Status */}
                  {isAssigned && (
                    <div style={{
                      background: '#0f1419',
                      borderTop: '1px solid #30363d',
                      padding: '12px',
                    }}>
                      <span style={{ color: '#4caf50', fontSize: '11px', fontWeight: 'bold' }}>
                        ✓ Assigned to {
                          myAuditors.find(a => a.id === c.assignment?.currentOwner)?.fullName || 'Auditor'
                        }
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={{
            background: '#e3f2fd',
            color: '#0c4a6e',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #1976d2',
            marginTop: '24px'
          }}>
            <strong><i className="fas fa-chart-bar"></i> Assignment Summary</strong>
            <p style={{ color: '#0c4a6e', margin: '8px 0 0 0', fontSize: '12px' }}>
              Total Cases: <strong>{casesByTeamLeader.length}</strong> |
              Assigned: <strong>{casesByTeamLeader.filter(c => c.assignment?.currentState === ASSIGNMENT_STATES.ASSIGNED_TO_AUDITOR).length}</strong> |
              Pending: <strong>{casesByTeamLeader.filter(c => c.assignment?.currentState !== ASSIGNMENT_STATES.ASSIGNED_TO_AUDITOR).length}</strong>
            </p>
          </div>

          {/* Case Acceptance Modal - NEW */}
          {caseAcceptanceModal && (
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1001
            }}>
              <div style={{
                background: '#1c2128',
                borderRadius: '12px',
                width: '500px',
                maxWidth: '90%',
                border: '1px solid #30363d',
                boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
              }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #30363d' }}>
                  <h3 style={{ margin: 0, color: '#f0f6fc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-check-double" style={{ color: '#4caf50' }}></i> Accept & Assign Case
                  </h3>
                </div>
                
                <div style={{ padding: '24px' }}>
                  <p style={{ color: '#8b949e', marginBottom: '20px' }}>
                    Click confirm to accept this case into your workload. The system will automatically assign it to your best available auditor:
                  </p>
                  
                  <div style={{ background: '#0f1419', borderRadius: '8px', padding: '16px', marginBottom: '20px', border: '1px solid #30363d' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ color: '#8b949e', fontSize: '12px' }}>Case ID:</span>
                      <p style={{ margin: '4px 0 0 0', color: '#f0f6fc', fontWeight: 'bold' }}>{caseAcceptanceModal.caseId}</p>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ color: '#8b949e', fontSize: '12px' }}>Taxpayer:</span>
                      <p style={{ margin: '4px 0 0 0', color: '#f0f6fc' }}>{caseAcceptanceModal.caseName}</p>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ color: '#8b949e', fontSize: '12px' }}>Audit Type:</span>
                      <p style={{ margin: '4px 0 0 0', color: '#f0f6fc' }}>{caseAcceptanceModal.auditType.replace(/_/g, ' ')}</p>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ color: '#8b949e', fontSize: '12px' }}>Risk Level:</span>
                      <p style={{ 
                        margin: '4px 0 0 0', 
                        display: 'inline-block',
                        background: caseAcceptanceModal.riskLevel === 'Critical' ? '#ff5252' : caseAcceptanceModal.riskLevel === 'High' ? '#ff9800' : '#ffc107',
                        color: '#fff',
                        padding: '3px 8px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {caseAcceptanceModal.riskLevel}
                      </p>
                    </div>
                    <div>
                      <span style={{ color: '#8b949e', fontSize: '12px' }}>Estimated Hours:</span>
                      <p style={{ margin: '4px 0 0 0', color: '#f0f6fc' }}>{caseAcceptanceModal.estimatedHours} hours</p>
                    </div>
                  </div>

                  <p style={{ color: '#8b949e', fontSize: '12px', margin: '0 0 20px 0' }}>
                    <i className="fas fa-info-circle"></i> The system will find your team member with the lowest current workload and assign this case to them automatically.
                  </p>
                </div>

                <div style={{ padding: '16px 24px', borderTop: '1px solid #30363d', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button 
                    onClick={() => setCaseAcceptanceModal(null)}
                    style={{ 
                      padding: '8px 16px', 
                      background: '#2d333b', 
                      color: '#f0f6fc', 
                      border: '1px solid #30363d', 
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAcceptAndAssignCase}
                    style={{ 
                      padding: '8px 16px', 
                      background: '#4caf50', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fas fa-check-circle"></i> Accept & Assign
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Process Confirmation Modal - OLD (kept for reference) */}
          {processConfirmation && (
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: '#1c2128',
                borderRadius: '12px',
                width: '500px',
                maxWidth: '90%',
                border: '1px solid #30363d',
                boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
              }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #30363d' }}>
                  <h3 style={{ margin: 0, color: '#f0f6fc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-check-square" style={{ color: '#4caf50' }}></i> Process Assignment
                  </h3>
                </div>
                
                <div style={{ padding: '24px' }}>
                  <p style={{ color: '#8b949e', marginBottom: '20px' }}>
                    Confirm to process this assignment and allocate to the best available auditor:
                  </p>
                  
                  <div style={{ background: '#0f1419', borderRadius: '8px', padding: '16px', marginBottom: '20px', border: '1px solid #30363d' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ color: '#8b949e', fontSize: '12px' }}>Case ID:</span>
                      <p style={{ margin: '4px 0 0 0', color: '#f0f6fc', fontWeight: 'bold' }}>{processConfirmation.caseId}</p>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ color: '#8b949e', fontSize: '12px' }}>Taxpayer:</span>
                      <p style={{ margin: '4px 0 0 0', color: '#f0f6fc' }}>{processConfirmation.caseName}</p>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ color: '#8b949e', fontSize: '12px' }}>Audit Type:</span>
                      <p style={{ margin: '4px 0 0 0', color: '#f0f6fc' }}>{processConfirmation.auditType}</p>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ color: '#8b949e', fontSize: '12px' }}>Risk Level:</span>
                      <p style={{ 
                        margin: '4px 0 0 0', 
                        display: 'inline-block',
                        background: processConfirmation.riskLevel === 'Critical' ? '#ff5252' : processConfirmation.riskLevel === 'High' ? '#ff9800' : '#ffc107',
                        color: '#fff',
                        padding: '3px 8px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {processConfirmation.riskLevel}
                      </p>
                    </div>
                    <div>
                      <span style={{ color: '#8b949e', fontSize: '12px' }}>Estimated Hours:</span>
                      <p style={{ margin: '4px 0 0 0', color: '#f0f6fc' }}>{processConfirmation.estimatedHours} hours</p>
                    </div>
                  </div>

                  <p style={{ color: '#8b949e', fontSize: '12px', margin: '0 0 20px 0' }}>
                    <i className="fas fa-info-circle"></i> The system will automatically assign this case to your team member with the lowest current workload.
                  </p>
                </div>

                <div style={{ padding: '16px 24px', borderTop: '1px solid #30363d', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button 
                    onClick={() => {
                      setProcessConfirmation(null);
                      setProcessingCase(null);
                    }}
                    style={{ 
                      padding: '8px 16px', 
                      background: '#2d333b', 
                      color: '#f0f6fc', 
                      border: '1px solid #30363d', 
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmProcessAssignment}
                    style={{ 
                      padding: '8px 16px', 
                      background: '#4caf50', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fas fa-check"></i> Confirm & Process
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Assignment Summary Modal */}
          {assignmentSummary && (
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: '#1c2128',
                borderRadius: '12px',
                width: '800px',
                maxWidth: '90%',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #30363d',
                boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
              }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: '#f0f6fc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-check-circle" style={{ color: '#4caf50' }}></i> Auditor Assignment Complete
                  </h3>
                  <button onClick={() => setAssignmentSummary(null)} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: '16px' }}>✖</button>
                </div>
                
                <div style={{ padding: '24px', overflowY: 'auto' }}>
                  <p style={{ color: '#8b949e', marginTop: 0, marginBottom: '20px' }}>
                    Successfully allocated <strong>{assignmentSummary.length}</strong> cases evenly across your team (max 2 consecutive assignments per auditor).
                  </p>
                  
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#0f1419', color: '#8b949e', textAlign: 'left' }}>
                        <th style={{ padding: '12px', borderBottom: '1px solid #30363d' }}>Case ID</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid #30363d' }}>Audit Type</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid #30363d' }}>Assigned Auditor</th>
                        <th style={{ padding: '12px', borderBottom: '1px solid #30363d' }}>Auditor ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignmentSummary.map((s, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #30363d' }}>
                          <td style={{ padding: '12px', color: '#f0f6fc' }}>{s.caseId.substring(0, 15)}...</td>
                          <td style={{ padding: '12px', color: '#8b949e' }}>{s.auditType}</td>
                          <td style={{ padding: '12px', color: '#4caf50', fontWeight: 'bold' }}>{s.auditorName}</td>
                          <td style={{ padding: '12px', color: '#58a6ff' }}>{s.auditorId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ padding: '16px 24px', borderTop: '1px solid #30363d', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setAssignmentSummary(null)} style={{ padding: '8px 16px', background: '#2196f3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Close Summary
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AssignToAuditorsView;
