import { auditConfig } from './auditConfig';

const regionCount = auditConfig.regions.length;

/**
 * Annual planning process stages — shared across audit team dashboards.
 * Descriptions use {regionCount} placeholder replaced at runtime.
 */
export const ANNUAL_PLANNING_STAGES = [
  {
    id: 'create-plan',
    title: 'Create plan',
    description: 'Design annual audit plan with audit types and national strategy',
    icon: 'fas fa-pencil-alt',
    completeIcon: 'fas fa-check',
  },
  {
    id: 'regional-allocation',
    title: 'Regional allocation',
    description: 'Allocate audit cases by region based on risk assessment',
    icon: 'fas fa-cube',
    completeIcon: 'fas fa-check',
  },
  {
    id: 'distribute',
    title: 'Distribute',
    description: `Send allocations to ${regionCount} regional directors for implementation`,
    icon: 'fas fa-th',
    completeIcon: 'fas fa-check',
  },
  {
    id: 'collect-feedback',
    title: 'Collect feedback',
    description: 'Receive and aggregate feedback from tax centers',
    icon: 'fas fa-search',
    completeIcon: 'fas fa-check',
  },
  {
    id: 'finalize',
    title: 'Finalize',
    description: 'Make final adjustments based on feedback and approve',
    icon: 'fas fa-check-double',
    completeIcon: 'fas fa-check',
  },
  {
    id: 'monitor',
    title: 'Monitor',
    description: 'Track execution progress and case completion',
    icon: 'fas fa-chart-bar',
    completeIcon: 'fas fa-check',
  },
];

export const STAGE_STATUS = {
  COMPLETE: 'complete',
  IN_PROGRESS: 'in_progress',
  PENDING: 'pending',
};
