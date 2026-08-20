import React from 'react';
import RoleDashboardShell from '../dashboard/RoleDashboardShell';
import { useRoleDashboardMetrics } from '../../hooks/useRoleDashboardMetrics';

/**
 * Generic role dashboard — config-driven metrics via useRoleDashboardMetrics.
 */
function RoleDashboard({ role }) {
  const metrics = useRoleDashboardMetrics(role);

  return (
    <RoleDashboardShell
      summaryMetrics={metrics.summaryMetrics}
      stages={metrics.stages}
      activeStageTitle={metrics.activeStageTitle}
      bottomMetrics={metrics.bottomMetrics}
      timelineTitle={metrics.timelineTitle}
    />
  );
}

export default RoleDashboard;
