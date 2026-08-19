# Sprint 16: Local Dashboard & Tax Center Reporting

**Objective:** Create tax center-level dashboard showing local performance metrics (cases, cycle time, revenue) enabling managers to monitor their team's audit operations and identify local bottlenecks.

**Developer:** Yoseph
**Cluster Prefix:** `rf_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 16 (Local Operations Dashboard).
>
> **Database Schema:**
> - Filtered metrics views for each tax center
> - Create `rf_tax_center_dashboard_cache` (refreshed daily): `tax_center_code`, `date`, `cases_referred`, `cases_closed`, `revenue_etb`, `median_cycle_time`, `pending_count`, `top_auditor` (JSONB)
>
> **Backend Service:**
> - Create `TaxCenterDashboardService` with methods:
>   - Get tax center metrics (row-level security on tax_center_code)
>   - Compare to national average ("You're 15% above national average")
>   - Identify pending cases and bottlenecks
>   - Rank auditors by cases closed / revenue
>
> **REST Endpoints:**
> - `GET /api/v1/rf/dashboard/tax-center` - Current user's tax center dashboard
> - `GET /api/v1/rf/dashboard/tax-center/{taxCenterCode}/auditor-rankings` - Auditor performance ranking
> - `GET /api/v1/rf/dashboard/tax-center/pending-cases` - Cases awaiting action
> - `GET /api/v1/rf/dashboard/tax-center/monthly-comparison` - This month vs. last month
>
> **Frontend Pages:**
> - Page `<TaxCenterOperationsDashboard />` - Local manager view (restricted to ROLE_TAX_CENTER_MANAGER for own center, ROLE_DIRECTOR for all)
> - Component `<LocalKPICards />` - This month: Cases closed, Revenue ETB, Avg Cycle Days, Completion %
> - Component `<ComparisonToNational />` - Badge showing "15% above national average" with trend arrow
> - Component `<PendingCasesWidget />` - Critical alert: "5 cases pending action > 30 days"
> - Component `<AuditorPerformance />` - Table: Auditor | Cases Closed | Revenue | Cycle Time
> - Component `<MonthlyComparison />` - Chart comparing this month to last 3 months
> - Component `<AuditTypeBreakdown />` - Local: DESK % | COMP % | TP % | ISSUE %
>
> **Key Metrics:**
> - Local totals: Cases referred and closed (this month, YTD)
> - Revenue: ETB collected (this month, YTD)
> - Cycle time: Median days for this tax center
> - Comparison: To national average and to own historical average
> - Auditor rankings: Who is most productive?
> - Pending cases: Which are overdue?
> - Completion rate: Cases closed / Referred for period
>
> **Business Context:**
> - Local dashboard is operational tool for tax center managers
> - Shows team performance and identifies individual auditor stars
> - Enables peer comparison (friendly competition)
> - Identifies bottlenecks and pending work
> - Foundation for performance appraisals and incentives
> - Supports staffing and resource decisions
>
> **Row-Level Security:**
> - Tax Center Manager: Can only see own center's dashboard
> - Regional Director: Can see all centers in region
> - National Director: Can see all centers nationally

---

## 2. Success Criteria

- ✅ Tax center dashboard shows local performance metrics
- ✅ Comparison to national average provides context
- ✅ Pending cases highlighted with aging (>30 days flagged)
- ✅ Auditor rankings enable performance recognition
- ✅ Month-over-month comparison shows trends
- ✅ Audit type breakdown shows local case mix
- ✅ Row-level security enforced: managers only see own center
- ✅ Real-time updates enable responsive management
- ✅ Mobile-friendly layout for on-the-go monitoring
