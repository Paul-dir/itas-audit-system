/**
 * Central navigation configuration — single source of truth for sidebar menus.
 * Menu item `id` values must match the `currentView` case keys in each roleView container.
 */

export const ROLE_NAVIGATION = {
  audit_team: {
    categories: [
      {
        label: 'Overview',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
        ],
      },
      {
        label: 'Planning',
        items: [
          { id: 'create-plan', label: 'Create annual plan', icon: 'fas fa-bullseye' },
          { id: 'my-plans', label: 'My plans', icon: 'fas fa-folder-open' },
          { id: 'plan-configuration', label: 'Plan Configuration', icon: 'fas fa-sliders-h' },
          { id: 'amend-plans', label: 'Amend plans', icon: 'fas fa-edit' },
          { id: 'cascade-plan-cases', label: 'Cascade to cases', icon: 'fas fa-sitemap' },
        ],
      },
      {
        label: 'Analysis',
        items: [
          { id: 'risk-engine', label: 'Risk engine analysis', icon: 'fas fa-bolt' },
          { id: 'feedback-review', label: 'Regional feedback', icon: 'fas fa-comments' },
          { id: 'plan-journey', label: 'Plan Journey', icon: 'fas fa-diagram-project' },
          { id: 'reports', label: 'Reports & analytics', icon: 'fas fa-chart-bar' },
        ],
      },
    ],
    footer: { id: 'configuration', label: 'Settings', icon: 'fas fa-cog' },
  },

  audit_team_leader: {
    categories: [
      {
        label: 'Overview',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
        ],
      },
      {
        label: 'Planning',
        items: [
          { id: 'create-plan', label: 'Create annual plan', icon: 'fas fa-bullseye' },
          { id: 'my-plans', label: 'My plans', icon: 'fas fa-folder-open' },
          { id: 'plan-configuration', label: 'Plan Configuration', icon: 'fas fa-sliders-h' },
          { id: 'amend-plans', label: 'Amend plans', icon: 'fas fa-edit' },
          { id: 'cascade-plan-cases', label: 'Cascade to cases', icon: 'fas fa-sitemap' },
        ],
      },
      {
        label: 'Analysis',
        items: [
          { id: 'risk-engine', label: 'Risk engine analysis', icon: 'fas fa-bolt' },
          { id: 'feedback-review', label: 'Regional feedback', icon: 'fas fa-comments' },
          { id: 'plan-journey', label: 'Plan Journey', icon: 'fas fa-diagram-project' },
          { id: 'reports', label: 'Reports & analytics', icon: 'fas fa-chart-bar' },
        ],
      },
    ],
    footer: { id: 'configuration', label: 'Settings', icon: 'fas fa-cog' },
  },

  audit_director: {
    categories: [
      {
        label: 'Overview',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
        ],
      },
      {
        label: 'Approvals',
        items: [
          { id: 'initial-approval', label: 'Initial Approval', icon: 'fas fa-check-circle' },
          { id: 'review-queue', label: 'Plan Review', icon: 'fas fa-inbox' },
        ],
      },
      {
        label: 'Review',
        items: [
          { id: 'plan-journey', label: 'Plan Journey', icon: 'fas fa-diagram-project' },
        ],
      },
      {
        label: 'Actions',
        items: [
          { id: 'submit-plan-to-regions', label: 'Submit Plan to Regions', icon: 'fas fa-share-square' },
          { id: 'deployment', label: 'Deployment', icon: 'fas fa-rocket' },
        ],
      },
    ],
    footer: { id: 'configuration', label: 'Settings', icon: 'fas fa-cog' },
  },

  regional_director: {
    categories: [
      {
        label: 'Overview',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
        ],
      },
      {
        label: 'Planning',
        items: [
          { id: 'receive-plans', label: 'Receive Plans', icon: 'fas fa-inbox' },
          { id: 'allocate-to-tax-centers', label: 'Allocate to Tax Centers', icon: 'fas fa-tasks' },
          { id: 'collect-feedback', label: 'Collect Feedback', icon: 'fas fa-comments' },
        ],
      },
    ],
    footer: { id: 'configuration', label: 'Settings', icon: 'fas fa-cog' },
  },

  tax_center_manager: {
    categories: [
      {
        label: 'Overview',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
        ],
      },
      {
        label: 'Operations',
        items: [
          { id: 'receive-allocations', label: 'Receive Allocations', icon: 'fas fa-inbox' },
          { id: 'accept-approved-plan', label: 'Acceptance plan', icon: 'fas fa-hand-paper' },
          { id: 'tax-center-feedback', label: 'Feedback', icon: 'fas fa-comments' },
          { id: 'cascade-plan-cases', label: 'Cascade to cases', icon: 'fas fa-sitemap' },
          { id: 'case-types', label: 'Case types', icon: 'fas fa-tags' },
        ],
      },
      {
        label: 'Cases',
        items: [
          { id: 'audit-cases', label: 'Audit cases', icon: 'fas fa-folder' },
          { id: 'requests', label: 'Requests', icon: 'fas fa-inbox' },
          { id: 'stored-cases', label: 'Stored cases', icon: 'fas fa-archive' },
          { id: 'case-prioritization', label: 'Prioritization', icon: 'fas fa-sort-amount-up' },
          { id: 'case-assignment', label: 'Assignment', icon: 'fas fa-user-check' },
        ],
      },
    ],
    footer: { id: 'configuration', label: 'Settings', icon: 'fas fa-cog' },
  },



  team_leader: {
    categories: [
      {
        label: 'Overview',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
        ],
      },
      {
        label: 'Team',
        items: [
          { id: 'case-management', label: 'My Cases', icon: 'fas fa-briefcase' },
          { id: 'team-cases', label: 'Team cases', icon: 'fas fa-users' },
          { id: 'team-progress', label: 'Team progress', icon: 'fas fa-chart-line' },
          { id: 'case-assignment', label: 'Assignments', icon: 'fas fa-user-check' },
        ],
      },
    ],
    footer: { id: 'configuration', label: 'Settings', icon: 'fas fa-cog' },
  },

  auditor: {
    categories: [
      {
        label: 'Overview',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
        ],
      },
      {
        label: 'Work',
        items: [
          { id: 'my-cases', label: 'My cases', icon: 'fas fa-briefcase' },
          { id: 'case-execution', label: 'Case execution', icon: 'fas fa-tasks' },
        ],
      },
    ],
    footer: { id: 'configuration', label: 'Settings', icon: 'fas fa-cog' },
  },

  senior_management: {
    categories: [
      {
        label: 'Overview',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
        ],
      },
      {
        label: 'Approvals',
        items: [
          { id: 'pending-approval', label: 'Final Approval', icon: 'fas fa-gavel' },
          { id: 'plan-journey', label: 'Plan Journey', icon: 'fas fa-diagram-project' },
        ],
      },
    ],
    footer: { id: 'configuration', label: 'Settings', icon: 'fas fa-cog' },
  },



  directorate_requester: {
    categories: [
      {
        label: 'Overview',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
        ],
      },
      {
        label: 'Requests',
        items: [
          { id: 'submit-request', label: 'Submit request', icon: 'fas fa-plus-circle' },
          { id: 'my-requests', label: 'My requests', icon: 'fas fa-list' },
        ],
      },
    ],
    footer: null,
  },

  external_stakeholder: {
    categories: [
      {
        label: 'Overview',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-th-large' },
        ],
      },
      {
        label: 'Requests',
        items: [
          { id: 'submit-request', label: 'Submit request', icon: 'fas fa-plus-circle' },
          { id: 'my-requests', label: 'My requests', icon: 'fas fa-list' },
        ],
      },
    ],
    footer: null,
  },
};

export function getNavigationForRole(role) {
  return ROLE_NAVIGATION[role] || { categories: [], footer: null };
}

export function getRoleLabel(role) {
  return role?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'User';
}
