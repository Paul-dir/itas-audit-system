import React from 'react';
import DashboardMetricCard from './DashboardMetricCard';
import ProcessTimeline from './ProcessTimeline';
import BottomStatsBar from './BottomStatsBar';

/**
 * Shared dashboard page shell — metric cards, optional timeline, bottom stats.
 */
function RoleDashboardShell({
  summaryMetrics = [],
  stages = null,
  activeStageTitle = '',
  bottomMetrics = [],
  timelineTitle = 'Annual planning process',
  children = null,
}) {
  return (
    <div className="space-y-6">
      {summaryMetrics.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {summaryMetrics.map((metric) => (
            <DashboardMetricCard key={metric.id} {...metric} />
          ))}
        </div>
      )}

      {stages && stages.length > 0 && (
        <ProcessTimeline
          title={timelineTitle}
          stages={stages}
          activeStageTitle={activeStageTitle}
        />
      )}

      {children}

      {bottomMetrics.length > 0 && <BottomStatsBar items={bottomMetrics} />}
    </div>
  );
}

export default RoleDashboardShell;
