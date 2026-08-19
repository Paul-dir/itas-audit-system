# Sprint 13: Cycle Time Metrics & Performance Analytics

**Objective:** Calculate and visualize case cycle time metrics (days from referral to closure) and track performance trends for operational efficiency monitoring.

**Developer:** Yoseph
**Cluster Prefix:** `rf_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 13 (Cycle Time Analytics).
>
> **Database Schema:**
> - Create `rf_cycle_time_metrics` table (pre-calculated): `case_id`, `referral_submitted_date`, `audit_started_date`, `entry_conference_date`, `findings_submitted_date`, `case_closed_date`, `total_cycle_days`, `planning_days`, `fieldwork_days`, `review_days`
> - Create `rf_performance_summary` (daily aggregates): `date`, `cases_referred`, `cases_closed`, `average_cycle_time`, `median_cycle_time`, `95th_percentile_cycle_time`
>
> **Backend Service:**
> - Create `CycleTimeService` with methods:
>   - Calculate cycle time metrics from event log (using event timestamps)
>   - Aggregate metrics by day/week/month
>   - Calculate percentiles: 25th, 50th (median), 75th, 95th percentile cycle times
>   - Compare current performance vs. historical trends
>
> **REST Endpoints:**
> - `GET /api/v1/rf/metrics/cycle-time?date_from=X&date_to=Y&group_by=DAY|WEEK|MONTH` - Get cycle time trends
> - `GET /api/v1/rf/metrics/case/{caseId}/cycle-breakdown` - Get detailed breakdown for specific case
> - `GET /api/v1/rf/metrics/performance-summary` - Current month performance snapshot
>
> **Frontend Components:**
> - Component `<CycleTimeChart />` - Line chart showing average cycle time trend over time
> - Component `<CycleTimeDistribution />` - Histogram showing distribution (e.g., "40% complete in 30-45 days")
> - Component `<PercentileMetrics />` - Display: 50th percentile (median), 95th percentile, trend arrow
> - Component `<CaseBreakdown />` - Bar chart: Planning % | Fieldwork % | Review % of total time
>
> **Key Metrics:**
> - Total cycle time: Referral submitted → Case closed (in calendar days)
> - Planning phase: Referral → Audit started
> - Fieldwork phase: Audit started → Entry conference → Findings submitted
> - Review phase: Findings submitted → Case closed
> - Percentile tracking: 50% complete in X days, 95% complete in Y days
>
> **Business Context:**
> - Cycle time is key efficiency indicator
> - Identify bottlenecks: Where do cases spend most time?
> - Benchmark performance: "Our median is 60 days; industry is 90 days"
> - Use for capacity planning and resource allocation

---

## 2. Success Criteria

- ✅ Cycle time calculated from event log timestamps
- ✅ Trends visible over time (daily, weekly, monthly)
- ✅ Percentile metrics (25th, 50th, 75th, 95th) calculated
- ✅ Phase breakdown shows where time is spent
- ✅ Comparisons enable trend analysis and anomaly detection
- ✅ Dashboard enables operational monitoring and reporting
