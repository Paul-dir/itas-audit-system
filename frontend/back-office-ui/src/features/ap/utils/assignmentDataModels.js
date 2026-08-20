/**
 * STUB - Deleted during refactor
 * This file was removed during the React routing refactor
 * Import from assignmentData.js instead if needed
 */

// Minimal exports for backward compatibility
export const ASSIGNMENT_STATES = {
  UNASSIGNED: 'UNASSIGNED',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

export const createAssignment = (data) => {
  console.warn('⚠️ createAssignment stub - please update imports');
  return data;
};

export const createTeamLeader = (data) => {
  console.warn('⚠️ createTeamLeader stub - please update imports');
  return data;
};

export const createAuditor = (data) => {
  console.warn('⚠️ createAuditor stub - please update imports');
  return data;
};

export const validateTeamLeader = (leader) => {
  console.warn('⚠️ validateTeamLeader stub - please update imports');
  return true;
};

export const validateAuditor = (auditor) => {
  console.warn('⚠️ validateAuditor stub - please update imports');
  return true;
};

export default { 
  ASSIGNMENT_STATES, 
  createAssignment,
  createTeamLeader,
  createAuditor,
  validateTeamLeader,
  validateAuditor
};
