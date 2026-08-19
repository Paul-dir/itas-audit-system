/**
 * Workspace titles and subtitles shown in the TopBar per role.
 */

export const WORKSPACE_CONFIG = {
  audit_team: {
    title: 'Audit planning workspace',
    subtitle: 'Annual audit cycle — regional allocation and feedback tracking',
  },
  audit_director: {
    title: 'Director review workspace',
    subtitle: 'National audit plan review, approval, and deployment',
  },
  regional_director: {
    title: 'Regional feedback workspace',
    subtitle: 'Regional allocation coordination and tax center feedback',
  },
  tax_center_manager: {
    title: 'Tax center management',
    subtitle: 'Capacity planning, case cascade, and execution oversight',
  },

  team_leader: {
    title: 'Team leader workspace',
    subtitle: 'Team case assignments and execution progress',
  },
  auditor: {
    title: 'Auditor workspace',
    subtitle: 'Assigned cases and field execution tracking',
  },
  senior_management: {
    title: 'Senior management review',
    subtitle: 'Executive approval and strategic oversight',
  },

  directorate_requester: {
    title: 'Requester dashboard',
    subtitle: 'Submit and track audit requests',
  },
  external_stakeholder: {
    title: 'Stakeholder dashboard',
    subtitle: 'Submit and track audit requests',
  },
};

export function getWorkspaceConfig(role) {
  return WORKSPACE_CONFIG[role] || WORKSPACE_CONFIG.audit_team;
}
