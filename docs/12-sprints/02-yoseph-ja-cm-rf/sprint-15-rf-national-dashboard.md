# Sprint 15: National Dashboard & Executive Reporting

**Objective:** Create executive-level dashboard showing national audit performance metrics across all tax centers and jurisdictions for strategic decision-making and oversight.

**Developer:** Yoseph
**Cluster Prefix:** `rf_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 15 (National Visibility).
>
> **Database Schema:**
> - Use metrics tables from Sprint 13-14 with aggregation at national level
> - Create `rf_national_dashboard_cache` (refreshed daily): `date`, `total_cases_referred`, `total_cases_closed`, `total_revenue_etb`, `national_median_cycle_time`, `top_tax_center`, `regional_breakdown` (JSONB)
>
> **Backend Service:**
> - Create `NationalDashboardService` with methods:
>   - Aggregate metrics from all tax centers nationally
>   - Calculate national averages and comparisons to targets
>   - Identify top/bottom performing tax centers
>   - Generate executive summary statistics
>   - Compare actual vs. budgeted performance
>
> **REST Endpoints:**
> - `GET /api/v1/rf/dashboard/national` - National dashboard snapshot
> - `GET /api/v1/rf/dashboard/regional?region_code=X` - Regional breakdown
> - `GET /api/v1/rf/dashboard/tax-center-ranking?period=MONTH|QUARTER` - Tax center rankings
> - `GET /api/v1/rf/dashboard/kpi-summary` - KPI metrics vs. targets
>
> **Frontend Pages:**
> - Page `<NationalExecutiveDashboard />` - Full-screen executive view (restricted to ROLE_SENIOR_MANAGEMENT)
> - Component `<KPISummaryCards />` - Large metrics: Total Cases | Total Revenue | Avg Cycle Time | Completion Rate
> - Component `<NationalTrend />` - Chart: Cases referred and closed over last 12 months
> - Component `<RevenueTrend />` - Chart: ETB collected over time with target line
> - Component `<TaxCenterRankings />` - Table: Rank | Tax Center | Cases Closed | Revenue | Median Cycle Time
> - Component `<RegionalHeatmap />` - Colored map showing performance by region (green=good, red=needs attention)
> - Component `<AuditTypeBreakdown />` - Pie chart: DESK % | COMP % | TP % | ISSUE %
>
> **Key Metrics Displayed:**
> - National totals: Cases referred, cases closed, revenue (ETB)
> - Performance trends: 12-month historical view
> - Tax center comparisons: Which centers are performing best?
> - Regional analysis: Performance by region
> - Cycle time: National median, 95th percentile
> - Revenue: YTD actual vs. budget
> - Completion rate: Cases closed / Cases referred
>
> **Business Context:**
> - National dashboard is strategic tool for senior leadership
> - Shows overall program performance and health
> - Identifies regional disparities and best practices
> - Informs resource allocation and strategic planning
> - Supports annual reporting to Minister/Board

---

## 2. Success Criteria

- ✅ National metrics aggregated from all tax centers
- ✅ Executive KPI cards show key performance indicators
- ✅ 12-month trends visible with historical context
- ✅ Tax center rankings enable peer comparison
- ✅ Regional breakdown shows geographical performance
- ✅ Heatmap enables quick visual identification of problem areas
- ✅ Audit type distribution shows program composition
- ✅ Actual vs. budget comparison visible
- ✅ Dashboard restricted to senior management role
