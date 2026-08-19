# Sprint 14: Financial Yield Metrics & Revenue Analytics

**Objective:** Track audit financial outcomes (principal adjustments, penalties) and calculate yield metrics (ETB collected per audit hour) for budget impact and ROI analysis.

**Developer:** Yoseph
**Cluster Prefix:** `rf_`

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 14 (Financial Analytics).
>
> **Database Schema:**
> - Create `rf_financial_metrics` table: `case_id`, `total_principal_etb`, `total_penalty_etb`, `total_adjustment_etb`, `case_type`, `audit_type`, `taxpayer_segment`
> - Create `rf_yield_summary` (daily aggregates): `date`, `total_revenue_etb`, `case_count`, `average_yield_per_case`, `top_case_etb`, `segment_breakdown` (JSONB)
>
> **Backend Service:**
> - Create `FinancialYieldService` with methods:
>   - Calculate total adjustments from closed cases
>   - Aggregate by: Audit type (DESK, COMPREHENSIVE, TP, ISSUE), Case type (Risk Engine, Referral, Manual)
>   - Segment breakdown: By tax type (VAT, CIT, Withholding, TP), by industry segment, by taxpayer size
>   - Calculate: Total ETB, average per case, top performers, outliers
>   - Trend analysis: Month-over-month revenue comparison
>
> **REST Endpoints:**
> - `GET /api/v1/rf/metrics/financial-yield?date_from=X&date_to=Y&group_by=AUDIT_TYPE|SEGMENT|INDUSTRY` - Get yield trends
> - `GET /api/v1/rf/metrics/yield-top-cases?limit=10&date_from=X` - Top 10 cases by adjustment amount
> - `GET /api/v1/rf/metrics/revenue-summary?period=MONTH|QUARTER|YEAR` - Revenue summary for period
>
> **Frontend Components:**
> - Component `<RevenueChart />` - Line chart showing cumulative revenue over time
> - Component `<YieldByAuditType />` - Bar chart: DESK | COMP | TP | ISSUE with average yield per type
> - Component `<TopCasesLeaderboard />` - Table: Rank | TIN | Taxpayer Name | Total ETB | Audit Type
> - Component `<SegmentAnalysis />` - Breakdown by segment: Large Corp | SME | Micro with yield metrics
> - Component `<RevenueMetricsCard />` - KPI cards: Total ETB, Case Count, Average Yield, Trend %
>
> **Key Metrics:**
> - Total audit revenue: Sum of all principal + penalties (all closed cases)
> - Average yield per case: Total revenue / Case count
> - Yield by audit type: Which audit types generate most revenue? (TP usually > COMP > DESK)
> - Segment analysis: Which taxpayer segments are highest yield?
> - Trend: Revenue this month vs. last month, seasonality patterns
>
> **Business Context:**
> - Financial yield justifies audit resource allocation
> - Identifies high-value targets and low-yield audits
> - Supports budget planning and ROI analysis
> - Data for annual reporting to senior management

---

## 2. Success Criteria

- ✅ Financial metrics aggregated from closed cases
- ✅ Revenue trending over time (daily, monthly, quarterly)
- ✅ Breakdown by audit type, segment, industry
- ✅ Top cases identified and ranked
- ✅ Average yield calculated per case and per audit type
- ✅ Segment analysis shows which taxpayers generate most revenue
- ✅ Dashboard enables financial performance monitoring
