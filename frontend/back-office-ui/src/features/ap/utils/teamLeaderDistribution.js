/**
 * Team Leader to Auditor Distribution System
 * 
 * Maintains the same hierarchical logic but simplified:
 * - Tax Center → Team Leader (groups by audit type first)
 * - Team Leader → Auditor (NO audit type filtering, all auditors are same type)
 * 
 * Simple round-robin by workload:
 * 1. Get auditors under this Team Leader
 * 2. Sort by current workload (ascending)
 * 3. Assign next case to least-loaded auditor
 * 4. Update workload tracking
 */

import { loadDataDirect as loadData, saveDataDirect as saveData } from '../services/dataService';
import { getAllUsers } from '../data/orgStructure';

/**
 * Main function: Assign cases to auditors for a Team Leader
 * 
 * @param {array} cases - Cases to assign to auditors
 * @param {string} teamLeaderId - Team Leader ID
 * @returns {object} Distribution summary with stats
 */
export function cascadeCasesToAuditorsByTeamLeader(cases, teamLeaderId) {
  try {
    console.log('📋 [TL_CASCADE] Starting Team Leader to Auditor distribution');
    console.log(`   Team Leader: ${teamLeaderId}`);
    
    if (!cases || cases.length === 0) {
      console.warn('⚠️  No cases to distribute');
      return { success: false, message: 'No unassigned cases found' };
    }
    
    console.log(`✅ Step 1: Loaded ${cases.length} cases`);
    
    // STEP 2: Get all auditors under this Team Leader
    const auditors = getAuditorsForTeamLeader(teamLeaderId);
    
    console.log(`✅ Step 2: Found ${auditors.length} auditors under this Team Leader`);
    
    if (auditors.length === 0) {
      console.warn('   ⚠️  NO Auditors available!');
      return { 
        success: false, 
        message: 'No auditors available in your team' 
      };
    }
    
    // STEP 3: Distribute cases to auditors by workload
    const distribution = distributeToAuditorsIntelligently(
      cases,
      auditors,
      teamLeaderId
    );
    
    console.log(`✅ [TL_CASCADE] Distribution complete: ${distribution.length}/${cases.length} assigned`);
    
    return {
      success: true,
      totalCases: cases.length,
      totalAssigned: distribution.length,
      distribution
    };
    
  } catch (error) {
    console.error('❌ [TL_CASCADE] Error:', error);
    throw error;
  }
}

/**
 * Get all auditors under a specific Team Leader
 * 
 * Simple: All auditors with same teamId = Team Leader's teamId
 * No audit type filtering needed (all auditors already match TL's type)
 * 
 * @param {string} teamLeaderId - Team Leader ID
 * @returns {array} Auditors under this Team Leader
 */
export function getAuditorsForTeamLeader(teamLeaderId) {
  try {
    const allUsers = getAllUsers();
    
    // Get the Team Leader first
    const teamLeader = allUsers.find(u => u.id === teamLeaderId && u.role === 'team_leader');
    if (!teamLeader) {
      console.warn(`Team Leader not found: ${teamLeaderId}`);
      return [];
    }
    
    const teamId = teamLeader.org_context?.teamId;
    const tlAuditType = teamLeader.org_context?.auditType;
    
    console.log(`  ℹ️  Team Leader ${teamLeader.full_name}:`);
    console.log(`      Team ID: ${teamId}`);
    console.log(`      Audit Type: ${tlAuditType}`);
    
    // Get ALL auditors under this team
    // No need to filter by audit type - they're already under this TL
    // But we verify they have same audit type (should be guaranteed by data model)
    const auditors = allUsers.filter(u =>
      u.role === 'auditor' &&
      u.org_context?.teamId === teamId
    );
    
    console.log(`  ℹ️  Found ${auditors.length} auditors under this Team Leader`);
    
    // Verify all auditors have same audit type as TL
    const auditTypeMatch = auditors.filter(a => a.org_context?.auditType === tlAuditType);
    if (auditTypeMatch.length !== auditors.length) {
      console.warn(`  ⚠️  ${auditors.length - auditTypeMatch.length} auditors have mismatched audit types!`);
    }
    
    return auditors;
    
  } catch (error) {
    console.error('Error getting auditors for Team Leader:', error);
    return [];
  }
}

/**
 * Intelligently distribute cases to auditors
 * 
 * Algorithm (same as Tax Center → Team Leader, but simpler):
 * 1. Sort auditors by current workload (ascending)
 * 2. For each case, assign to auditor with lowest workload
 * 3. Track workload during distribution for load balancing
 * 4. Never exceed capacity
 * 
 * @param {array} cases - Cases to distribute
 * @param {array} auditors - Auditors to distribute to
 * @param {string} teamLeaderId - Team Leader for logging
 * @returns {array} Distribution records
 */
export function distributeToAuditorsIntelligently(cases, auditors, teamLeaderId) {
  try {
    console.log(`  📊 Distributing ${cases.length} cases to ${auditors.length} auditors`);
    
    // Create copy to track current workload during distribution
    const auditorWorkload = {};
    auditors.forEach(aud => {
      auditorWorkload[aud.id] = {
        name: aud.full_name,
        current: aud.workload?.currentCases || 0,
        max: aud.workload?.maxCapacity || 6
      };
    });
    
    // Sort auditors by current workload (least loaded first)
    const sortedAuditors = [...auditors].sort((a, b) => 
      (a.workload?.currentCases || 0) - (b.workload?.currentCases || 0)
    );
    
    const distribution = [];
    let auditorIndex = 0;
    let skippedCases = 0;
    
    for (const auditCase of cases) {
      let selectedAuditor = null;
      let attempts = 0;
      
      // Try to find an auditor with capacity
      while (!selectedAuditor && attempts < sortedAuditors.length) {
        const auditor = sortedAuditors[auditorIndex % sortedAuditors.length];
        const currentWorkload = auditorWorkload[auditor.id].current;
        const maxCapacity = auditorWorkload[auditor.id].max;
        
        if (currentWorkload < maxCapacity) {
          // This auditor has capacity
          selectedAuditor = auditor;
          auditorWorkload[auditor.id].current++;
          
          console.log(
            `    📍 Case ${auditCase.id.substring(0, 12)} → ` +
            `${auditor.full_name} (${currentWorkload}/${maxCapacity})`
          );
        } else {
          // This auditor is at capacity, try next
          auditorIndex++;
          attempts++;
        }
      }
      
      if (!selectedAuditor) {
        console.warn(`    ⚠️  Case ${auditCase.id} - NO Auditor capacity available`);
        skippedCases++;
        continue;
      }
      
      // Save assignment to storage
      const updatedCase = {
        ...auditCase,
        status: 'ASSIGNED_TO_AUDITOR',
        assignedAuditorId: selectedAuditor.id,
        assignedAuditor: selectedAuditor.full_name
      };
      
      const data = loadData();
      const caseIdx = data.auditCases.findIndex(c => c.id === auditCase.id);
      if (caseIdx !== -1) {
        data.auditCases[caseIdx] = updatedCase;
        (data.audit_operations || []).push({
          action: 'ASSIGN_TO_AUDITOR',
          caseId: auditCase.id,
          auditorId: selectedAuditor.id,
          timestamp: new Date().toISOString()
        });
      }
      
      // Record assignment
      distribution.push({
        caseId: auditCase.id,
        taxpayerName: auditCase.taxpayerName,
        auditorId: selectedAuditor.id,
        auditorName: selectedAuditor.full_name
      });
      
      // Move to next auditor for round-robin
      auditorIndex++;
    }
    
    if (distribution.length > 0) {
      const data = loadData();
      saveData(data);
    }
    
    console.log(
      `  ✅ Distributed ${distribution.length}/${cases.length} cases` +
      (skippedCases > 0 ? ` (${skippedCases} skipped - no capacity)` : '')
    );
    
    return distribution;
    
  } catch (error) {
    console.error('  ❌ Error distributing to auditors:', error);
    return [];
  }
}

/**
 * Accept a case as Team Leader and auto-assign to best available auditor
 * 
 * Flow:
 * 1. Verify case exists and belongs to this Team Leader
 * 2. Mark case as accepted by Team Leader
 * 3. Get best available auditor
 * 4. Distribute case to that auditor
 * 5. Update status
 * 
 * @param {string} caseId - Case ID to accept
 * @param {string} teamLeaderId - Team Leader ID accepting the case
 * @returns {object} { success, message, distribution }
 */
export function acceptAndDistributeCaseToAuditor(caseId, teamLeaderId) {
  try {
    const data = loadData();
    
    // Find the case
    const auditCase = (data.auditCases || []).find(c => c.id === caseId);
    if (!auditCase) {
      return {
        success: false,
        message: 'Case not found'
      };
    }
    
    // Verify it's assigned to this Team Leader
    if (auditCase.assignedTeamLeaderId !== teamLeaderId && 
        auditCase.assignedTeamLeader !== teamLeaderId) {
      return {
        success: false,
        message: 'This case is not assigned to you'
      };
    }
    
    console.log(`✅ [AcceptCase] Team Leader accepted case ${caseId}`);
    
    // Get available auditors
    const auditors = getAuditorsForTeamLeader(teamLeaderId);
    if (auditors.length === 0) {
      return {
        success: false,
        message: 'No auditors available in your team'
      };
    }
    
    // Find best (least loaded) auditor
    const bestAuditor = [...auditors].sort((a, b) => 
      (a.workload?.currentCases || 0) - (b.workload?.currentCases || 0)
    )[0];
    
    // Assign case to this auditor
    const caseIdx = data.auditCases.findIndex(c => c.id === caseId);
    if (caseIdx !== -1) {
      data.auditCases[caseIdx].status = 'ASSIGNED_TO_AUDITOR';
      data.auditCases[caseIdx].assignedAuditorId = bestAuditor.id;
      data.auditCases[caseIdx].assignedAuditor = bestAuditor.full_name;
      
      (data.audit_operations || []).push({
        action: 'ACCEPT_CASE_AND_ASSIGN_TO_AUDITOR',
        caseId,
        teamLeaderId,
        auditorId: bestAuditor.id,
        timestamp: new Date().toISOString()
      });
      
      saveData(data);
    }
    
    console.log(`✅ [AcceptCase] Distributed to ${bestAuditor.full_name}`);
    
    return {
      success: true,
      message: `Case accepted and assigned to ${bestAuditor.full_name}`,
      distribution: {
        caseId,
        auditorId: bestAuditor.id,
        auditorName: bestAuditor.full_name
      }
    };
    
  } catch (error) {
    console.error('❌ [AcceptCase] Error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Get distribution statistics for a Team Leader
 * 
 * @param {string} teamLeaderId - Team Leader ID
 * @returns {object} Distribution stats
 */
export function getTeamLeaderDistributionStats(teamLeaderId) {
  try {
    const data = loadData();
    const auditors = getAuditorsForTeamLeader(teamLeaderId);
    
    const stats = {
      teamLeaderId,
      auditorCount: auditors.length,
      byAuditor: {}
    };
    
    auditors.forEach(auditor => {
      stats.byAuditor[auditor.full_name] = {
        auditorId: auditor.id,
        currentWorkload: auditor.workload?.currentCases || 0,
        maxCapacity: auditor.workload?.maxCapacity || 6,
        utilizationPercent: Math.round(
          ((auditor.workload?.currentCases || 0) / (auditor.workload?.maxCapacity || 6)) * 100
        )
      };
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting distribution stats:', error);
    return null;
  }
}

console.log('✅ Team Leader Distribution module loaded');
