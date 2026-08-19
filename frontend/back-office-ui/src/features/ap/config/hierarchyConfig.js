/**
 * ============================================================
 * HIERARCHY CONFIGURATION — Single source of truth for the
 * National → Region → Tax Center → Team → Auditor routing.
 * ============================================================
 *
 * Principles:
 *  1. One annual plan created at national level
 *  2. Routed separately to EACH region
 *  3. Each region forwards separately to its tax centers
 *  4. Each tax center divides among team leaders (by audit type)
 *  5. Each team leader assigns to individual auditors
 *  6. Visibility is scoped: a region sees only its own data,
 *     a tax center sees only its own, etc.
 *  7. Entity identification supports dedup (TL-1, TL-2, etc.)
 */

// ============================================================
// 1. HIERARCHY LEVEL DEFINITIONS
// ============================================================
export const HIERARCHY_LEVELS = {
  NATIONAL: {
    key: 'national',
    rank: 0,
    label: 'National Level',
    description: 'Audit planning team, directors, senior management',
    roles: ['audit_team', 'audit_director', 'senior_management'],
    canSeeAllChildData: true,
  },
  REGIONAL: {
    key: 'regional',
    rank: 1,
    label: 'Regional Level',
    description: 'Regional directors overseeing one region',
    roles: ['regional_director'],
    canSeeAllChildData: true, // sees all tax centers in their region
  },
  TAX_CENTER: {
    key: 'tax_center',
    rank: 2,
    label: 'Tax Center Level',
    description: 'Tax center managers',
    roles: ['tax_center_manager'],
    canSeeAllChildData: true, // sees all teams in their tax center
  },
  TEAM_LEADER: {
    key: 'team_leader',
    rank: 3,
    label: 'Team Leader Level',
    description: 'Team leaders overseeing a specific audit type team',
    roles: ['team_leader'],
    canSeeAllChildData: true, // sees all auditors in their team
  },
  AUDITOR: {
    key: 'auditor',
    rank: 4,
    label: 'Auditor Level',
    description: 'Individual auditors working assigned cases',
    roles: ['auditor'],
    canSeeAllChildData: false,
  },

};

// ============================================================
// 2. ROLE-TO-LEVEL MAPPING
// ============================================================
export const ROLE_LEVEL_MAP = {
  audit_team: 'national',
  audit_director: 'national',
  senior_management: 'national',
  regional_director: 'regional',
  tax_center_manager: 'tax_center',
  team_leader: 'team_leader',
  auditor: 'auditor',
  directorate_requester: 'national',
  external_stakeholder: 'national',
};

// ============================================================
// 3. VISIBILITY SCOPES — which features are visible at which level
// ============================================================
export const FEATURE_VISIBILITY = {
  risk_engine: {
    national: 'full',          // all regions, all data
    regional: 'own_region',    // only that region's data
    tax_center: 'own_tax_center', // only that tax center's data
    team_leader: 'none',       // not visible
    auditor: 'none',           // not visible
  },
  configuration: {
    national: 'full',
    regional: 'regional_only',
    tax_center: 'tax_center_only',
    team_leader: 'minimal',    // limited config
    auditor: 'none',
  },
  plans: {
    national: 'all_plans',      // see all plans
    regional: 'own_region_plans', // plans routed to their region
    tax_center: 'own_tc_plans',   // plans routed to their tax center
    team_leader: 'own_team_cases',
    auditor: 'assigned_cases',
  },
  cases: {
    national: 'all_cases',
    regional: 'region_cases',
    tax_center: 'tax_center_cases',
    team_leader: 'team_cases',
    auditor: 'own_cases',
  },
  feedback: {
    national: 'all_feedback',
    regional: 'region_feedback',
    tax_center: 'tax_center_feedback',
    team_leader: 'team_feedback',
    auditor: 'own_feedback',
  },
  reports: {
    national: 'full',
    regional: 'region_only',
    tax_center: 'tax_center_only',
    team_leader: 'team_only',
    auditor: 'own_only',
  },
  dashboard: {
    national: 'national_metrics',
    regional: 'regional_metrics',
    tax_center: 'tax_center_metrics',
    team_leader: 'team_metrics',
    auditor: 'personal_metrics',
  },
};

// ============================================================
// 4. PLAN ROUTING STATES
// ============================================================
export const PLAN_ROUTING_STATES = {
  // National → Region routing
  REGION_PENDING: 'REGION_PENDING',
  REGION_RECEIVED: 'REGION_RECEIVED',
  REGION_ACCEPTED: 'REGION_ACCEPTED',
  REGION_REJECTED: 'REGION_REJECTED',
  
  // Region → Tax Center routing
  TC_PENDING: 'TC_PENDING',
  TC_RECEIVED: 'TC_RECEIVED',
  TC_ACCEPTED: 'TC_ACCEPTED',
  TC_REJECTED: 'TC_REJECTED',
  
  // Tax Center → Team Leader routing
  TL_PENDING: 'TL_PENDING',
  TL_RECEIVED: 'TL_RECEIVED',
  TL_ACCEPTED: 'TL_ACCEPTED',
  
  // Team Leader → Auditor routing
  AUDITOR_ASSIGNED: 'AUDITOR_ASSIGNED',
  AUDITOR_ACCEPTED: 'AUDITOR_ACCEPTED',
  AUDITOR_IN_EXECUTION: 'AUDITOR_IN_EXECUTION',
  AUDITOR_COMPLETED: 'AUDITOR_COMPLETED',
};

// ============================================================
// 5. ROUTING PATH (the flow chain)
// ============================================================
export const ROUTING_CHAIN = [
  { from: 'national', to: 'regional', label: 'National → Region' },
  { from: 'regional', to: 'tax_center', label: 'Region → Tax Center' },
  { from: 'tax_center', to: 'team_leader', label: 'Tax Center → Team Leader' },
  { from: 'team_leader', to: 'auditor', label: 'Team Leader → Auditor' },
];

// ============================================================
// 6. ENTITY NAMING CONFIGURATION
// ============================================================
export const ENTITY_NAMING = {
  team_leader: {
    prefix: 'TL',
    separator: '-',
    suffixStrategy: 'sequential', // TL-1, TL-2, etc.
  },
  auditor: {
    prefix: 'AUD',
    separator: '-',
    suffixStrategy: 'sequential',
  },

};

// ============================================================
// 7. HELPER EXPORTS
// ============================================================

/**
 * Get the hierarchy level for a given role
 */
export function getLevelForRole(role) {
  const levelKey = ROLE_LEVEL_MAP[role];
  return HIERARCHY_LEVELS[Object.keys(HIERARCHY_LEVELS).find(k => HIERARCHY_LEVELS[k].key === levelKey)];
}

/**
 * Get all roles at or below a given level
 */
export function getRolesAtOrBelow(levelKey) {
  const level = Object.values(HIERARCHY_LEVELS).find(l => l.key === levelKey);
  if (!level) return [];
  
  return Object.values(HIERARCHY_LEVELS)
    .filter(l => l.rank >= level.rank)
    .flatMap(l => l.roles);
}

/**
 * Get all roles at or above a given level
 */
export function getRolesAtOrAbove(levelKey) {
  const level = Object.values(HIERARCHY_LEVELS).find(l => l.key === levelKey);
  if (!level) return [];
  
  return Object.values(HIERARCHY_LEVELS)
    .filter(l => l.rank <= level.rank)
    .flatMap(l => l.roles);
}

/**
 * Check if a level can access data from another level
 */
export function canAccessLevelData(accessorLevel, targetLevel) {
  if (accessorLevel === 'national') return true;
  if (accessorLevel === targetLevel) return true;
  
  const accessor = Object.values(HIERARCHY_LEVELS).find(l => l.key === accessorLevel);
  const target = Object.values(HIERARCHY_LEVELS).find(l => l.key === targetLevel);
  
  if (!accessor || !target) return false;
  
  // Higher rank = more specific. National (0) can access all.
  // Regional (1) can access tax_center (2) and below in its region
  return accessor.rank <= target.rank;
}

/**
 * Get visibility for a feature at a given level
 */
export function getFeatureVisibility(feature, levelKey) {
  const visibility = FEATURE_VISIBILITY[feature];
  if (!visibility) return 'none';
  return visibility[levelKey] || 'none';
}
