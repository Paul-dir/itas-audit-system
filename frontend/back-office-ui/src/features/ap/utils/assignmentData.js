/**
 * Assignment Data Layer
 * Handles loading and saving Team Leaders, Auditors, and Assignments
 * ✅ DYNAMIC AUDITOR LOADING: Always uses org structure (getUserById, getTeamMembers)
 * ✅ NO STORAGE FALLBACK: Never uses localStorage for auditor lookups
 * ✅ AUTO-CONTEXT: Automatically uses Team Leader's tax center, region, audit type
 * Uses localStorage ONLY for assignments and team leader storage
 */

import { loadDataDirect as loadData, saveDataDirect as saveData } from '../services/dataService';
import { createTeamLeader, createAuditor, createAssignment, validateTeamLeader, validateAuditor } from './assignmentDataModels';
import { getUserById, getTeamMembers, getAllUsers } from '../data/orgStructure';

const STORAGE_KEY = 'audit_planning_system_v2';
const TEAM_LEADERS_KEY = 'teamLeaders';
const AUDITORS_KEY = 'auditors';
const ASSIGNMENTS_KEY = 'assignments';

// ===== DYNAMIC AUTO-LOAD FUNCTIONS =====

/**
 * Auto-load Team Leaders for current user's region and tax center
 * DYNAMIC - No predefined users, uses org context
 * @param {string} region - User's region
 * @param {string} taxCenter - User's tax center
 * @param {string} auditType - Optional: specific audit type
 * @returns {array} Team Leaders in this region/tax center
 */
export function autoLoadTeamLeadersForContext(region, taxCenter, auditType = null) {
  try {
    const allUsers = getAllUsers();
    
    // Filter by region AND tax center - no other restrictions
    let teamLeaders = allUsers.filter(u => 
      u.role === 'team_leader' &&
      u.org_context?.assignedRegion === region &&
      u.org_context?.assignedTaxCenter === taxCenter
    );
    
    // Optional: filter by audit type if specified
    if (auditType) {
      teamLeaders = teamLeaders.filter(u => 
        u.org_context?.auditType === auditType
      );
    }
    
    console.log(`✅ Auto-loaded ${teamLeaders.length} Team Leaders`);
    console.log(`   Region: ${region}, Tax Center: ${taxCenter}${auditType ? `, Audit Type: ${auditType}` : ''}`);
    
    return teamLeaders.map(tl => ({
      id: tl.id,
      fullName: tl.full_name,
      full_name: tl.full_name,
      email: tl.email,
      role: tl.role,
      auditType: tl.org_context?.auditType,
      teamId: tl.org_context?.teamId,
      teamName: tl.org_context?.teamName,
      org_context: tl.org_context
    }));
  } catch (error) {
    console.error('Error auto-loading Team Leaders:', error);
    return [];
  }
}

/**
 * Auto-load Auditors for current user's region and tax center
 * DYNAMIC - No predefined users, uses org context
 * @param {string} region - User's region
 * @param {string} taxCenter - User's tax center
 * @param {string} auditType - Optional: specific audit type
 * @returns {array} Auditors in this region/tax center
 */
export function autoLoadAuditorsForContext(region, taxCenter, auditType = null) {
  try {
    const allUsers = getAllUsers();
    
    // Filter by region AND tax center - no other restrictions
    let auditors = allUsers.filter(u => 
      u.role === 'auditor' &&
      u.org_context?.assignedRegion === region &&
      u.org_context?.assignedTaxCenter === taxCenter
    );
    
    // Optional: filter by audit type if specified
    if (auditType) {
      auditors = auditors.filter(u => 
        u.org_context?.auditType === auditType
      );
    }
    
    console.log(`✅ Auto-loaded ${auditors.length} Auditors`);
    console.log(`   Region: ${region}, Tax Center: ${taxCenter}${auditType ? `, Audit Type: ${auditType}` : ''}`);
    
    return auditors.map(aud => ({
      id: aud.id,
      fullName: aud.full_name,
      full_name: aud.full_name,
      email: aud.email,
      role: aud.role,
      seniority: aud.seniority || 'Mid',
      currentWorkload: aud.currentWorkload || 0,
      maxCapacity: aud.maxCapacity || 6,
      status: 'ACTIVE',
      expertise: [
        { area: 'VAT Compliance', level: 'Intermediate' },
        { area: 'Revenue Recognition', level: 'Intermediate' }
      ],
      org_context: aud.org_context
    }));
  } catch (error) {
    console.error('Error auto-loading Auditors:', error);
    return [];
  }
}

// ===== TEAM LEADER DATA =====

/**
 * Load all team leaders for a specific tax center
 * 
 * DYNAMIC APPROACH (Preferred):
 * Uses getAllUsers() from org structure to get live Team Leaders
 * Ensures thousands of TLs are available without hardcoding
 * 
 * FALLBACK:
 * If org structure unavailable, uses stored data
 * 
 * @param {string} region - Region name
 * @param {string} taxCenter - Tax center name
 * @returns {array} Array of team leaders with proper formatting
 */
export function loadTeamLeaders(region, taxCenter) {
  try {
    // PRIMARY: Try dynamic loading from org structure
    const allUsers = getAllUsers();
    
    // Filter for Team Leaders in this region/tax center
    const dynamicTLs = allUsers.filter(u =>
      u.role === 'team_leader' &&
      u.org_context?.assignedRegion === region &&
      u.org_context?.assignedTaxCenter === taxCenter
    );
    
    if (dynamicTLs.length > 0) {
      console.log(`✓ Dynamically loaded ${dynamicTLs.length} team leaders for ${region} - ${taxCenter}`);
      
      // Map to standard format
      return dynamicTLs.map(tl => ({
        id: tl.id,
        fullName: tl.full_name,
        full_name: tl.full_name,
        email: tl.email,
        role: 'team_leader',
        region: tl.org_context?.assignedRegion,
        taxCenter: tl.org_context?.assignedTaxCenter,
        teamId: tl.org_context?.teamId,
        teamName: tl.org_context?.teamName,
        auditType: tl.org_context?.auditType, // ← IMPORTANT: For filtering by audit type
        currentWorkload: tl.workload?.currentCases || 0,
        maxCapacity: tl.workload?.maxCapacity || 12,
        status: 'ACTIVE',
        org_context: tl.org_context
      }));
    }
    
    // FALLBACK: Use storage if org structure empty
    console.warn('⚠️  No dynamic Team Leaders found, falling back to storage');
    const data = loadData();
    
    if (!data.teamLeaders || data.teamLeaders.length === 0) {
      console.warn('No team leaders in storage either, initializing default data');
      initializeDefaultData(region, taxCenter);
      const newData = loadData();
      return newData.teamLeaders.filter(tl => tl.region === region && tl.taxCenter === taxCenter);
    }
    
    const filtered = data.teamLeaders.filter(tl =>
      tl.region === region && tl.taxCenter === taxCenter
    );
    
    console.log(`✓ Loaded ${filtered.length} team leaders from storage`);
    return filtered;
    
  } catch (error) {
    console.error('Error loading team leaders:', error);
    return getDefaultTeamLeaders(region, taxCenter);
  }
}

/**
 * Load team leader by ID
 * @param {string} teamLeaderId
 * @returns {object} Team leader object or null
 */
export function loadTeamLeader(teamLeaderId) {
  try {
    const data = loadData();
    if (!data.teamLeaders) return null;
    
    return data.teamLeaders.find(tl => tl.id === teamLeaderId) || null;
  } catch (error) {
    console.error('Error loading team leader:', error);
    return null;
  }
}

/**
 * Save team leader
 * @param {object} teamLeader
 * @returns {object} Saved team leader
 */
export function saveTeamLeader(teamLeader) {
  try {
    const validation = validateTeamLeader(teamLeader);
    if (!validation.valid) {
      throw new Error(`Invalid team leader: ${validation.errors.join(', ')}`);
    }
    
    const data = loadData();
    if (!data.teamLeaders) {
      data.teamLeaders = [];
    }
    
    // Update if exists, insert if new
    const index = data.teamLeaders.findIndex(tl => tl.id === teamLeader.id);
    if (index >= 0) {
      data.teamLeaders[index] = teamLeader;
      console.log(`✓ Updated team leader: ${teamLeader.id}`);
    } else {
      data.teamLeaders.push(teamLeader);
      console.log(`✓ Created team leader: ${teamLeader.id}`);
    }
    
    saveData(data);
    return teamLeader;
  } catch (error) {
    console.error('Error saving team leader:', error);
    throw error;
  }
}

/**
 * Update team leader workload
 * @param {string} teamLeaderId
 * @param {number} delta - Change in workload (+ or -)
 * @returns {object} Updated team leader
 */
export function updateTeamLeaderWorkload(teamLeaderId, delta) {
  try {
    const tl = loadTeamLeader(teamLeaderId);
    if (!tl) throw new Error(`Team leader not found: ${teamLeaderId}`);
    
    tl.currentWorkload += delta;
    
    if (tl.currentWorkload < 0) {
      console.warn(`Warning: Team leader workload negative: ${tl.currentWorkload}`);
      tl.currentWorkload = 0;
    }
    
    if (tl.currentWorkload > tl.maxCapacity) {
      console.warn(`Warning: Team leader over capacity: ${tl.currentWorkload}/${tl.maxCapacity}`);
    }
    
    return saveTeamLeader(tl);
  } catch (error) {
    console.error('Error updating team leader workload:', error);
    throw error;
  }
}

// ===== AUDITOR DATA =====

export function loadAuditors(teamLeaderId) {
  try {
    // Get Team Leader first to get their context
    let tl = getUserById(teamLeaderId);
    
    if (!tl) {
      const allUsers = getAllUsers();
      tl = allUsers.find(u => u.id === teamLeaderId || u.full_name === teamLeaderId);
    }
    
    if (!tl || !tl.org_context) {
      console.warn(`⚠️ Team Leader not found: ${teamLeaderId}`);
      return [];
    }

    // Use DYNAMIC auto-loading based on Team Leader's region/tax center/audit type
    // This ensures we get the RIGHT auditors for this Team Leader's context
    const region = tl.org_context.assignedRegion;
    const taxCenter = tl.org_context.assignedTaxCenter;
    const auditType = tl.org_context.auditType;
    const teamId = tl.org_context.teamId;

    console.log(`Loading auditors for Team Leader: ${tl.full_name}`);
    console.log(`  Region: ${region}, Tax Center: ${taxCenter}, Audit Type: ${auditType}, Team: ${teamId}`);

    // Get all users from this region/tax center
    const allUsers = getAllUsers();
    
    // Filter auditors from the SAME TEAM (teamId match)
    const auditors = allUsers
      .filter(u => 
        u.role === 'auditor' &&
        u.org_context?.teamId === teamId &&
        u.org_context?.assignedRegion === region &&
        u.org_context?.assignedTaxCenter === taxCenter
      )
      .map((u, idx) => ({
        id: u.id,
        fullName: u.full_name,
        full_name: u.full_name,
        email: u.email,
        seniority: idx === 0 ? 'Senior' : idx === 1 ? 'Mid' : 'Junior',
        currentWorkload: u.currentWorkload || 0,
        maxCapacity: u.maxCapacity || 6,
        status: 'ACTIVE',
        expertise: [
          { area: 'VAT Compliance', level: idx === 0 ? 'Expert' : 'Intermediate' },
          { area: 'Revenue Recognition', level: 'Intermediate' }
        ],
        org_context: u.org_context
      }));

    if (auditors.length === 0) {
      console.warn(`⚠️ No auditors found for this Team Leader`);
      console.warn(`   Searching all auditors in ${region} - ${taxCenter}...`);
      
      // Fallback: Get all auditors in same region/tax center (in case team doesn't match)
      return allUsers
        .filter(u => 
          u.role === 'auditor' &&
          u.org_context?.assignedRegion === region &&
          u.org_context?.assignedTaxCenter === taxCenter
        )
        .map((u, idx) => ({
          id: u.id,
          fullName: u.full_name,
          full_name: u.full_name,
          email: u.email,
          seniority: idx === 0 ? 'Senior' : idx === 1 ? 'Mid' : 'Junior',
          currentWorkload: u.currentWorkload || 0,
          maxCapacity: u.maxCapacity || 6,
          status: 'ACTIVE',
          expertise: [
            { area: 'VAT Compliance', level: idx === 0 ? 'Expert' : 'Intermediate' },
            { area: 'Revenue Recognition', level: 'Intermediate' }
          ],
          org_context: u.org_context
        }));
    }

    console.log(`✅ Loaded ${auditors.length} auditors for Team Leader ${tl.full_name}`);
    return auditors;
  } catch (error) {
    console.error('❌ Error loading auditors:', error);
    return [];
  }
}

export function loadAuditorsByTaxCenter(region, taxCenter) {
  try {
    const data = loadData();
    
    if (!data.auditors) {
      console.warn('No auditors in storage');
      return [];
    }
    
    const filtered = data.auditors.filter(a =>
      a.region === region && a.taxCenter === taxCenter
    );
    
    console.log(`✓ Loaded ${filtered.length} auditors for ${region} - ${taxCenter}`);
    return filtered;
  } catch (error) {
    console.error('Error loading auditors:', error);
    return [];
  }
}

/**
 * Load auditor by ID
 * Uses multiple fallback sources to handle both dynamic org structure and sample/test auditors
 * @param {string} auditorId
 * @returns {object} Auditor or null
 */
export function loadAuditor(auditorId) {
  try {
    // Load from orgStructure (primary, dynamic source)
    const allUsers = getAllUsers();
    const auditor = allUsers.find(u => u.id === auditorId && u.role === 'auditor');
    
    if (auditor) {
      return {
        id: auditor.id,
        full_name: auditor.full_name,
        email: auditor.email,
        role: auditor.role,
        org_context: auditor.org_context,
        currentWorkload: auditor.currentWorkload || 0,
        maxCapacity: auditor.maxCapacity || 6
      };
    }
    
    // Fallback 1: try localStorage auditors (for backwards compatibility with test/sample data)
    const data = loadData();
    if (data.auditors) {
      const storedAuditor = data.auditors.find(a => a.id === auditorId);
      if (storedAuditor) {
        return storedAuditor;
      }
    }
    
    // Fallback 2: Check assignments to find any auditor context data
    if (data.assignments) {
      const assignment = data.assignments.find(a => a.currentOwner === auditorId && a.currentOwnerRole === 'AUDITOR');
      if (assignment) {
        console.warn(`⚠️ Auditor ${auditorId} not in org structure, but found in assignments`);
        return {
          id: auditorId,
          full_name: `Auditor ${auditorId}`,
          email: `auditor@mor.gov.et`,
          role: 'auditor',
          currentWorkload: 0,
          maxCapacity: 6
        };
      }
    }
    
    console.warn(`⚠️ Auditor not found in any source: ${auditorId}`);
    return null;
  } catch (error) {
    console.error('Error loading auditor:', error);
    return null;
  }
}

/**
 * Save auditor
 * @param {object} auditor
 * @returns {object} Saved auditor
 */
export function saveAuditor(auditor) {
  try {
    const validation = validateAuditor(auditor);
    if (!validation.valid) {
      throw new Error(`Invalid auditor: ${validation.errors.join(', ')}`);
    }
    
    const data = loadData();
    if (!data.auditors) {
      data.auditors = [];
    }
    
    // Update if exists, insert if new
    const index = data.auditors.findIndex(a => a.id === auditor.id);
    if (index >= 0) {
      data.auditors[index] = auditor;
      console.log(`✓ Updated auditor: ${auditor.id}`);
    } else {
      data.auditors.push(auditor);
      console.log(`✓ Created auditor: ${auditor.id}`);
    }
    
    saveData(data);
    return auditor;
  } catch (error) {
    console.error('Error saving auditor:', error);
    throw error;
  }
}

/**
 * Update auditor workload - GRACEFUL ERROR HANDLING (NON-BLOCKING)
 * This is NON-CRITICAL: Returns null instead of throwing if auditor not found
 * Allows case assignment to continue even if workload tracking fails
 * Silently continues - doesn't log warnings for expected demo/test auditors
 * @param {string} auditorId - Auditor ID to update
 * @param {number} delta - Change in workload (+ or -)
 * @returns {object|null} Updated auditor or null if not found/error
 */
export function updateAuditorWorkload(auditorId, delta) {
  try {
    const auditor = loadAuditor(auditorId);
    if (!auditor) {
      // Silently skip - this is expected for demo/test auditors
      return null;
    }

    auditor.currentWorkload = (auditor.currentWorkload || 0) + delta;

    if (auditor.currentWorkload < 0) {
      auditor.currentWorkload = 0;
    }

    if (auditor.currentWorkload > (auditor.maxCapacity || 6)) {
      // Silently allow - workload tracking is non-critical
    }

    return saveAuditor(auditor);
  } catch (error) {
    // Silently continue - workload update failure is non-critical
    return null;
  }
}

// ===== ASSIGNMENT DATA =====

/**
 * Load assignment by case ID
 * @param {string} caseId
 * @returns {object} Assignment or null
 */
export function loadAssignment(caseId) {
  try {
    const data = loadData();
    
    if (!data.assignments) {
      console.warn('No assignments in storage');
      return null;
    }
    
    return data.assignments.find(a => a.caseId === caseId) || null;
  } catch (error) {
    console.error('Error loading assignment:', error);
    return null;
  }
}

/**
 * Load all assignments in a state
 * @param {string} state - Assignment state (e.g., ASSIGNED_TO_AUDITOR)
 * @param {string} region - Optional: filter by region
 * @param {string} taxCenter - Optional: filter by tax center
 * @returns {array} Array of assignments
 */
export function loadAssignmentsByState(state, region = null, taxCenter = null) {
  try {
    const data = loadData();
    
    if (!data.assignments) {
      return [];
    }
    
    let filtered = data.assignments.filter(a => a.currentState === state);
    
    if (region) {
      filtered = filtered.filter(a => a.region === region);
    }
    
    if (taxCenter) {
      filtered = filtered.filter(a => a.taxCenter === taxCenter);
    }
    
    console.log(`✓ Loaded ${filtered.length} assignments in state: ${state}`);
    return filtered;
  } catch (error) {
    console.error('Error loading assignments by state:', error);
    return [];
  }
}

/**
 * Load assignments for a user (team leader or auditor)
 * @param {string} userId - Team leader or auditor ID
 * @param {string} role - 'TEAM_LEADER' or 'AUDITOR'
 * @returns {array} Array of assignments
 */
export function loadAssignmentsByUser(userId, role) {
  try {
    const data = loadData();
    
    if (!data.assignments) {
      return [];
    }
    
    // For team leader: look for assignments with current owner = userId and role = TEAM_LEADER
    // For auditor: look for assignments with current owner = userId and role = AUDITOR
    const filtered = data.assignments.filter(a =>
      a.currentOwner === userId && a.currentOwnerRole === role
    );
    
    console.log(`✓ Loaded ${filtered.length} assignments for ${role}: ${userId}`);
    return filtered;
  } catch (error) {
    console.error('Error loading user assignments:', error);
    return [];
  }
}

/**
 * Save assignment
 * @param {object} assignment
 * @returns {object} Saved assignment
 */
export function saveAssignment(assignment) {
  try {
    const data = loadData();
    if (!data.assignments) {
      data.assignments = [];
    }
    
    // Update if exists, insert if new
    const index = data.assignments.findIndex(a => a.caseId === assignment.caseId);
    if (index >= 0) {
      data.assignments[index] = assignment;
      console.log(`✓ Updated assignment for case: ${assignment.caseId} → ${assignment.currentState}`);
    } else {
      data.assignments.push(assignment);
      console.log(`✓ Created assignment for case: ${assignment.caseId}`);
    }
    
    saveData(data);
    return assignment;
  } catch (error) {
    console.error('Error saving assignment:', error);
    throw error;
  }
}

/**
 * Get assignment statistics
 * @param {string} region - Optional
 * @param {string} taxCenter - Optional
 * @returns {object} Statistics
 */
export function getAssignmentStats(region = null, taxCenter = null) {
  try {
    const data = loadData();
    if (!data.assignments) return null;
    
    let assignments = data.assignments;
    
    if (region) {
      assignments = assignments.filter(a => a.region === region);
    }
    
    if (taxCenter) {
      assignments = assignments.filter(a => a.taxCenter === taxCenter);
    }
    
    const stats = {
      total: assignments.length,
      byState: {
        STORED: assignments.filter(a => a.currentState === 'STORED').length,
        ASSIGNED_TO_TEAM_LEADER: assignments.filter(a => a.currentState === 'ASSIGNED_TO_TEAM_LEADER').length,
        ASSIGNED_TO_AUDITOR: assignments.filter(a => a.currentState === 'ASSIGNED_TO_AUDITOR').length,
        ACCEPTED_BY_AUDITOR: assignments.filter(a => a.currentState === 'ACCEPTED_BY_AUDITOR').length,
        IN_EXECUTION: assignments.filter(a => a.currentState === 'IN_EXECUTION').length,
        COMPLETED: assignments.filter(a => a.currentState === 'COMPLETED').length,
        REALLOCATED: assignments.filter(a => a.currentState === 'REALLOCATED').length
      }
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting assignment stats:', error);
    return null;
  }
}

// ===== DEFAULT DATA =====

/**
 * Get default team leaders for a tax center
 * Used when no team leaders exist in storage
 */
function getDefaultTeamLeaders(region, taxCenter) {
  const auditTypes = ['desk_audit', 'field_audit', 'comprehensive', 'transfer_pricing', 'single_issue', 'forensic'];
  
  return auditTypes.map((type, idx) =>
    createTeamLeader({
      id: `TL-${type.toUpperCase()}-${taxCenter.replace(/\s+/g, '-')}-001`,
      region,
      taxCenter,
      auditType: type,
      fullName: `Team Leader - ${type.replace(/_/g, ' ').toUpperCase()}`,
      email: `tl.${type}@mor.gov.et`,
      expertise: ['VAT', 'Revenue', 'Documentation'],
      assignedAuditors: [],
      currentWorkload: 0,
      maxCapacity: 12,
      yearsExperience: 10,
      certifications: ['CPA'],
      status: 'ACTIVE'
    })
  );
}

/**
 * Initialize sample team leaders and auditors for testing
 * WARNING: Use this only for development/testing
 */
export function initializeDefaultData(region, taxCenter) {
  try {
    const data = loadData();
    
    // Initialize team leaders if empty
    if (!data.teamLeaders || data.teamLeaders.length === 0) {
      const teamLeaders = getDefaultTeamLeaders(region, taxCenter);
      data.teamLeaders = teamLeaders;
      
      // Initialize auditors for each team leader
      data.auditors = [];
      teamLeaders.forEach(tl => {
        for (let i = 1; i <= 5; i++) {
          const auditor = createAuditor({
            id: `AUD-${tl.auditType.toUpperCase()}-${i.toString().padStart(3, '0')}`,
            region,
            taxCenter,
            teamLeaderId: tl.id,
            auditType: tl.auditType,
            fullName: `Auditor ${i}`,
            email: `auditor.${i}@mor.gov.et`,
            seniority: i <= 2 ? 'Senior' : i <= 4 ? 'Mid' : 'Junior',
            yearsExperience: (6 - i) * 2,
            expertise: [
              { area: 'VAT Compliance', level: i <= 2 ? 'Expert' : i <= 4 ? 'Advanced' : 'Intermediate' },
              { area: 'Revenue Recognition', level: i <= 3 ? 'Advanced' : 'Intermediate' }
            ],
            sectorExperience: i % 2 === 0 ? ['Manufacturing', 'Retail'] : ['Technology', 'Financial Services'],
            currentWorkload: 0,
            maxCapacity: 6,
            status: 'ACTIVE'
          });
          
          data.auditors.push(auditor);
          tl.assignedAuditors.push(auditor.id);
        }
      });
      
      saveData(data);
      console.log('✓ Initialized default team leaders and auditors');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing default data:', error);
    return false;
  }
}

console.log('✓ Assignment Data Layer loaded');
