# Cluster AP — Requirements & Acceptance Checklist
### Audit Planning & Setup (TA-001 – TA-007) | `bs-taxaudit-core-server`

**Purpose:** a single working checklist to tick off — SoR Module D functional requirements (FR), Business Use Case normal flows, alternative flows (AF), and business rules (BR) — so nothing "small" gets dropped before you call a BUC done.

**Sources:** `SoR – Module D` (FR-04.0, FR-04.1, FR-04.2, FR-04.10.1, FR-04.10.2) · `Business Use Case Of Tax Audit` (BUC-TA-001 → TA-007) · `Cluster-AP-Implementation-Design.md` · **`MOR Audit Planning System — End-to-End Documentation` (v1.0, Aug 14 2026)** — reference frontend/reference-implementation trace used below to confirm nothing in the hierarchical distribution → feedback → amendment → deployment → case-generation → assignment chain got lost between BRS, SoR, and the design doc.

**How to use this:** work top to bottom per BUC. A BUC is not "done" until every box under it is checked — Normal Flow, every AF (not just the happy path), every BR enforced as a domain invariant (not a UI-only check), and the cross-cutting rules below. Items added or sharpened from the MOR reference trace are marked **🆕**.

---

## 0. Cross-Cutting Rules (apply to every BUC below)

- [ ] **Rule 1** — `AuditCase` fields match the architecture's aggregate spec exactly; no local schema drift.
- [ ] **Rule 2** — every risk-engine call (TA-003 ranking, TA-004 workload balancing, TA-006 complexity scoring) goes through `RiskProfilingService`, never an ad-hoc REST call in a controller.
- [ ] **Rule 3** — every mutation writes an `AuditTrailEntry` (who/what/when/why/diff) to `audit_case_audit_log`, 7-year retention — including overrides, skips, and manual interventions, not just happy-path transitions.
- [ ] **Rule 7** — external data fallback (cached snapshot + warning flag, human decides) implemented for every `IntegrationEnginePort` / `TaxTypeEnginePort` call in TA-005/TA-007, with a test simulating the engine being down.
- [ ] **Rule 8** — any approval chain with more than one step or an SLA timer goes through `workflow-engine`, never a hand-rolled state machine.
- [ ] **Rule 11** — `AuditCase.source` always explicitly set (`RISK_ENGINE`, `INTERNAL_REFERRAL`, `EXTERNAL_REFERRAL`, `MANUAL_SELECTION`, `RANDOM_SAMPLE`) — never inferred after the fact.
- [ ] **Rule 12** — sampling configuration is data (`AuditSamplingConfiguration`), validated by `SamplingService` — never a hardcoded switch statement.
- [ ] **Rule 13** — `TreatmentPlan` embedded at TA-003 travels unchanged to QA (TA-023) later; no silent overwrite by a downstream cluster.
- [ ] **Rule 14** — `workforce-engine` consulted for capacity/eligibility only (read-only); no target numbers written back into AP's own tables.
- [ ] 🆕 **Rule 15** — any override of an aggregated/rolled-up value (regional feedback override, capacity override, sampling-method override, etc.) is stored as a first-class fact — `isOverridden`, `overriddenBy`, `overriddenAt`, `overrideReason` — alongside the original value, never replacing it in place. Downstream consumers (Director, Senior Management) must be able to see both.
- [ ] 🆕 **Rule 16** — any plan/case status transition that depends on **every member of a set** responding (all business units feeding back, all regions deploying, all committee members signing) is a fan-in gate: the aggregate only advances when every member has an explicit response *or* a recorded non-response (per the relevant AF), never on "majority" or "first N" — implemented in `workflow-engine`, not counted ad hoc in application code.
- [ ] `X-Actor-Id` header enforced on all mutating endpoints.
- [ ] `AuditPlanApproved` and `JointAuditPlanApproved` payload shapes agreed and frozen with Devs 2/3 before their clusters build against them.

---

## 1. BUC-TA-001 — Create and Approve Annual Audit Plan
**FRs:** FR-04.0-01 → FR-04.0-06 &nbsp;|&nbsp; **Aggregate:** `AnnualAuditPlan`

### Functional Requirements (SoR)
- [ ] FR-04.0-01 — create/review/update/submit plan; iterative process factoring in annual tactics, case volume by type, effort estimates, and skill capacity per skill/location
- [ ] FR-04.0-02 — Director review/approval; on approval, notify business units/branches/regions and request feedback
- [ ] FR-04.0-03 — business units/branches/regions review, feedback, submit to Director
- [ ] FR-04.0-04 — Director reviews feedback, amends, finalizes; multiple versions tracked
- [ ] FR-04.0-05 — approved plan routed to Senior Management/Risk Committee; on approval, notify Director + business units
- [ ] FR-04.0-06 — auditors/teams can cascade plan to case level (→ shared with TA-002)

### Normal Flow
- [ ] Audit Team creates plan, enters case counts per audit type
- [ ] System shows total effort vs. available staff capacity
- [ ] Team adjusts and saves draft
- [ ] Draft sent to Audit Director
- [ ] Director reviews and approves
- [ ] System auto-shares approved plan with business units, requests feedback by deadline
- [ ] 🆕 Where the org has an intermediate tier (region → tax center, or branch → sub-branch), the top-tier unit may further distribute its own allocation down to its sub-units before responding — each sub-distribution recorded with actor + timestamp (`AnnualAuditPlan.subUnitDistribution[unitId]`)
- [ ] Business units submit comments (and, where applicable, their own proposed allocation adjustments, not just free-text comments)
- [ ] Director reviews feedback, creates new version, marks ready for Senior Management
- [ ] Plan sent to Senior Management/Risk Committee; on approval, Director + business units notified plan is final
- [ ] 🆕 Each business unit/region confirms rollout/deployment of the final plan to its own sub-units; plan only reaches a terminal "Finalized" state once **every** unit has confirmed (fan-in gate, Rule 16) — this is the trigger that unblocks case generation (TA-002), not Senior Management approval alone

### Alternative Flows
- [ ] **AF1** — Plan rejected by Director → returned with comments → revised → resubmitted → new version → repeat until approved
- [ ] **AF2** — No feedback from business units → reminders sent → if still none, Director may proceed and notes lack of response
- [ ] **AF3** — Major amendments after feedback trigger another feedback round
  - [ ] 🆕 **AF3a** — amendment cycle is its own state (distinct from a Director→Team AF1 revision): plan moves to an explicit "Amendment Required" state with the Director's consolidated comment (including any regional feedback/overrides that motivated it); the planning team **edits the plan in place** (name, description, distributions) rather than starting a new plan; every edit is captured as a revision record (`type: amendment`) with before/after values, actor, and timestamp; the cycle can repeat more than once before resubmission to Senior Management
- [ ] **AF4** — Senior Management rejects with comments → plan returns to Director for revision → resubmitted
  - [ ] 🆕 confirm whether a Senior Management rejection restarts the **entire** cycle (back to Director drafting) or only the amendment sub-cycle (back to Planning Team) — the MOR reference trace assumes a full restart; verify against the BRS before implementing
- [ ] **AF5** — Capacity exceeded, team can't reduce further → request to proceed with explanation → Director approves (override noted) or rejects (plan returns for revision)
- [ ] 🆕 **AF6** — A business unit's aggregated/rolled-up feedback is overridden by the unit above it (e.g., a regional director overrides the aggregated tax-center input before submitting to the Director) → override flag, overriding actor, timestamp, and reason recorded per Rule 15 → the Director's view must show both the original aggregate and the override, not just the final number
- [ ] 🆕 **AF7** — A business unit/region has not confirmed deployment after Senior Management approval → reminders sent per SLA → plan remains in "Approved – Pending Deployment", **not** Finalized, until every unit confirms or the Director records an explicit override to force-finalize with a written reason (same override discipline as AF6)

### Business Rules
- [ ] BR-001 — plan must be based on tactics, volumes, effort, and skills
- [ ] BR-002 — Director approval required before business-unit notification
- [ ] BR-003 — Senior Management approval required for finalisation
- [ ] BR-004 — all versions and feedback retained for audit trail
- [ ] 🆕 BR-005 — a plan cannot transition to `FINALIZED` until every business unit/region has either confirmed deployment or has a recorded, reasoned override forcing finalization (Rule 16) — Senior Management approval alone is necessary but not sufficient
- [ ] 🆕 BR-006 — an overridden feedback value must retain the original value alongside the override (Rule 15); overrides are never destructive edits

### Postconditions / Done
- [ ] Final approved plan exists with full version history
- [ ] All stakeholders notified plan is final
- [ ] Plan ready to cascade into individual audit cases (handoff to TA-002)
- [ ] Every action, version, and piece of feedback recorded
- [ ] 🆕 Deployment status per business unit/region recorded (who confirmed, when) and visible on the plan record
- [ ] 🆕 Any regional/business-unit override (feedback or forced deployment) is queryable independently of the final rolled-up numbers
- [ ] Exception path tested: DB error → rollback + error message
- [ ] Outputs available: exportable final plan, feedback summary, version history log, 🆕 deployment-status report

---

## 2. BUC-TA-002 — Cascade Audit Plan to Case Level & Intake Referrals
**FRs:** FR-04.0-06, FR-04.1-01, FR-04.1-02, FR-04.1-03 &nbsp;|&nbsp; **Aggregates:** `AuditCase`, `AuditReferral`

### Functional Requirements (SoR)
- [ ] FR-04.0-06 — cascade plan to case-level, auditors develop plans per case
- [ ] FR-04.1-01 — view cases by risk ranking/branch/segment/audit type/other configurable params; random-selection feature for risk-model feedback; process owner can view risk-engine-identified cases; configurable audit case types (scope, coverage, estimated duration)
- [ ] FR-04.1-02 — other directorates can flag auditable cases (tax clearance, business closure, etc.) and request audit
- [ ] FR-04.1-03 — external stakeholders can identify auditable cases and request audit

### Normal Flow
- [ ] Open approved (🆕 and **Finalized** — see TA-001 fan-in gate, Rule 16) plan, review planned numbers by audit type/region/taxpayer group
- [ ] "Generate Cases": set filters (region, taxpayer type, risk score)
- [ ] Ranked candidate taxpayer list returned
- [ ] Review list; add/remove taxpayers manually
- [ ] Confirm list → individual `AuditCase` auto-created per taxpayer
- [ ] Unique case reference number generated, linked to annual plan
- [ ] Electronic case file created (taxpayer basic info, selection reason, audit purpose)
- [ ] Tentative start/end dates set from plan timeline
- [ ] Preliminary notes/special instructions optional
- [ ] Annual plan updated with running "cases created" count
- [ ] 🆕 Where a sub-unit distribution exists (TA-001), case generation respects the sub-unit's own allocation, not just the top-level regional total — generated cases are pre-tagged to the correct sub-unit (tax center/branch) for TA-004 assignment
- [ ] Audit team notified new cases are ready to assign

### Alternative Flows
- [ ] **AF1** — No approved plan available → explanatory message → redirect to plan creation
  - [ ] 🆕 clarify: "approved" here should mean `FINALIZED` per Rule 16, not merely `DIRECTOR_APPROVED`/`SENIOR_MGMT_APPROVED` — confirm the exact gate with the business owner so TA-002 doesn't start generating cases before every region has deployed
- [ ] **AF2** — No taxpayers match filters → message + suggestion to broaden filters, or add manually (→AF4)
- [ ] **AF3** — Fewer taxpayers found than planned → warning shown → broaden filters or proceed with written reason
- [ ] **AF4** — Manual case creation: search taxpayer by name/ID, add to case list
- [ ] **AF5** — Duplicate case detected → highlighted + warning → remove or override with written explanation
- [ ] **AF6** — Timeline adjustment on a case → reason required → recorded with who/when
- [ ] 🆕 **AF7** — Sub-unit allocation total conflicts with the plan's top-level total for that region (e.g., re-distribution wasn't reconciled) → flagged before case generation proceeds → resolved by re-running distribution or proceeding with a recorded discrepancy reason

### Business Rules
- [ ] BR-001 — every audit case linked to one annual audit plan
- [ ] BR-002 — cases only created from a fully approved plan (🆕 i.e., `FINALIZED`, per BR-005 in TA-001)
- [ ] BR-003 — unique reference number auto-generated
- [ ] BR-004 — fewer cases than planned requires written reason
- [ ] BR-005 — duplicate case creation requires written reason
- [ ] BR-006 — date changes record reason, user, timestamp

### Postconditions / Done
- [ ] Cases exist with unique reference numbers, linked to the plan
- [ ] Each case pre-filled with taxpayer info, selection reason, purpose
- [ ] Ready for assignment (TA-004)
- [ ] Plan shows updated case-creation count
- [ ] Every override/date-change logged
- [ ] Exception path tested: DB error → rollback + notify admin
- [ ] Outputs available: created-cases list, plan-fill progress report, override log, date-change log
- [ ] `AuditCaseCreated` event fires with correct payload → consumed by risk-engine, notification-engine, **CM cluster**
- [ ] `AuditReferralReceived` event fires and is consumed by risk-engine, notification-engine
- [ ] Webhook variant `/api/v1/webhooks/audit-referrals` tested for external referral intake

---

## 3. BUC-TA-003 — Select and Prioritize Audit Cases
**FRs:** FR-04.1-01, FR-04.1-04, FR-04.1-05 &nbsp;|&nbsp; **Aggregates:** `AuditCase`, `TreatmentPlan` (VO)

### Functional Requirements (SoR)
- [ ] FR-04.1-01 — (shared with TA-002, see above) risk ranking, filters, random selection, configurable case types
- [ ] FR-04.1-04 — process owner assesses referral strength, determines audit volume vs. staff capacity; generates auditable-case list from risk parameters; prioritizes by risk ranking; risk profiling includes: third-party data matching, under-reporting pattern search, revenue-risk pattern search, filing/payment pattern ID, forensic modelling (non-submission, continuous losses, import/return comparisons); configurable number of cases to audit
- [ ] FR-04.1-05 — load cases into system, attach treatment plan

### Normal Flow
- [ ] Combined list shown: risk-ranked + other-directorate requests + external requests
- [ ] Filter by location/taxpayer type/audit type/risk score/source
- [ ] View case details incl. specific risk indicators
- [ ] Staff capacity shown alongside estimated effort per audit type
- [ ] Select cases individually or via "Select Top X by Risk"
- [ ] Running total: effort selected vs. available capacity
- [ ] Selected cases ordered by priority (default: risk score)
- [ ] Review and confirm final list
- [ ] Final list marked "Selected for Audit"
- [ ] Initial treatment plan chosen per case (e.g., desk / comprehensive)
- [ ] Formal case records created, selection screen updated

### Alternative Flows
- [ ] **AF1** — Not enough staff capacity → warning + suggested removals → remove lower-priority cases, or request Director override with justification → pending → Director approves/rejects → selection blocked until decided
- [ ] **AF2** — Missing risk info on a case → marked "Incomplete Risk Data" → auto-request to Risk Directorate → set aside → notified when updated
- [ ] **AF3** — Urgent request arrives mid-selection → special notification → handle now → added to list → capacity recalculated, lower-priority deferrals suggested → urgent handling + reason recorded
- [ ] **AF4** — No cases selected this cycle → "Skip Selection Cycle" + reason → Director notified → cases remain in pool
- [ ] **AF5** — Random selection for risk-model feedback → count + filters → random draw → clearly marked as random, not risk-based
- [ ] **AF6** — Change a treatment plan → pick new type + reason → recorded
- [ ] **AF7** — Mark case as Joint Audit → status "Pending Joint Audit Formation" → follows joint-audit path instead

### Business Rules
- [ ] BR-001 — cases chosen by risk priority unless random selection used
- [ ] BR-002 — internal/external requests considered but not necessarily accepted
- [ ] BR-003 — total effort cannot exceed capacity without Director approval
- [ ] BR-004 — every selected case must have an initial treatment plan

### Postconditions / Done
- [ ] Selected cases loaded with treatment plans, marked "Selected for Audit"
- [ ] Non-selected cases remain in pool, marked "Deferred"
- [ ] Capacity usage recorded
- [ ] Every decision/override/justification logged
- [ ] Exception path tested: DB timeout / risk-engine unavailable → last snapshot used + admin alert (Rule 7)
- [ ] Outputs available: selected-case list w/ treatment plans, capacity-usage report, override log, deferred-case list
- [ ] `AuditCaseSelected`, `RandomAuditCaseSelected`, `TreatmentPlanAttached` events verified with correct consumers

---

## 4. BUC-TA-004 — Assign Cases to Auditors
**FRs:** FR-04.1-06, FR-04.1-07, FR-04.1-08, FR-04.1-09, FR-04.1-10 &nbsp;|&nbsp; **Aggregate:** `AuditCase`

### Functional Requirements (SoR)
- [ ] FR-04.1-06 — auto-allocate by expertise/sector/skills/seniority/complexity/workload; notify auditor + team lead; alert if case unattended after N days
- [ ] FR-04.1-07 — re-allocation between officers at approved authority levels
- [ ] FR-04.1-08 — case number generation; case treated as workflow with steps/delegations/approvals/notifications; standard per-type templates; electronic dossier; capture step details/status; link to plan start/end dates; changes to dates logged with audit trail
- [ ] FR-04.1-09 — Case Management Module (CMM): auto case number/start/expected-end; daily work log basis for progress/productivity reports; team-lead monitoring; auto-forward to Intelligence & Investigation when criteria met
- [ ] FR-04.1-10 — configurable allocation rules; classification-based assignment (LTO/MTO/STO/geographic/industry risk); automatic + interactive rule execution; skill/expertise + workload/availability based; supports dynamic/large teams

### Normal Flow
- [ ] Gather all unassigned cases marked "Selected for Audit"
- [ ] Consider audit type, complexity, needed skills, location per case
- [ ] Check available auditors against needs (skills/workload/experience/location)
- [ ] Rank best-matched auditors, aiming for balanced workload
- [ ] 🆕 Where assignment happens in two hops (e.g., a tax-center manager assigns a batch to team leaders by audit type, then each team leader assigns individually to auditors), both hops go through the same underlying allocation service — no separate hand-rolled logic for the "manager → team leader" hop
- [ ] Assign to highest-ranked auditor — 🆕 "highest-ranked" is computed against **current** open workload (count of non-`COMPLETED`/non-`CLOSED` cases), recalculated per assignment batch, not a stale snapshot from the start of the batch
- [ ] Record assignment (date, time, rules used)
- [ ] Notify auditor + team leader
- [ ] Start SLA timer for "must start work" window (per case type)
- [ ] If still "Assigned" (not "In Progress") after window → alert team leader
- [ ] Team leader reviews alert, may contact auditor or move case

### Alternative Flows
- [ ] **AF1** — No suitable auditor found → "Unassigned – No Match" + skill gap shown → team leader assigns manually / requests training-or-temp-approval / escalates to Process Owner → reason recorded
- [ ] **AF2** — Team leader manually assigns → picks auditor, writes reason → assigned, notified as normal
- [ ] **AF3** — Move case to different auditor → reason (leave/workload/conflict) → recorded w/ date/time/from-whom → both auditors notified → history shows transfer
- [ ] **AF4** — Alert raised, case not started → team leader contacts auditor / grants more time with reason / reassigns (AF3) → decision recorded
- [ ] **AF5** — Bulk assignment → pick multiple cases → "Assign in Bulk" → single auditor or "Spread Evenly" → confirmed, each auditor notified
- [ ] **AF6** — Top-match auditor would exceed workload → skipped, next best tried; note recorded; if all at limit → falls to AF1
- [ ] **AF7** — Auditor on leave during case window → assignment stopped, alternatives suggested → override allowed with reason if leave data exists; if no leave data available, manual tracking noted

### Business Rules
- [ ] BR-001 — auditor skills must match case needs
- [ ] BR-002 — workload limits respected unless overridden with reason
- [ ] BR-003 — case complexity matched to auditor experience
- [ ] BR-004 — moving a case requires a recorded reason
- [ ] 🆕 BR-005 — a case can only move to `CLOSED` from `COMPLETED` — never directly from `ASSIGNED`/`IN_PROGRESS` (confirms the terminal two-step: audit work finished → then formally filed/archived)

### Postconditions / Done
- [ ] Every selected case assigned (auto or manual)
- [ ] Auditors + team leader informed
- [ ] SLA countdown timers running per case
- [ ] Unassignable cases flagged for team leader
- [ ] All assignments/moves/overrides logged with reasons
- [ ] Auditor workload views updated
- [ ] 🆕 Case status lifecycle (`ASSIGNED → IN_PROGRESS → COMPLETED → CLOSED`) implemented end-to-end and reflected in workload counts — a `COMPLETED` case still counts toward historical productivity reporting but not toward open workload; `CLOSED` cases are excluded from all active dashboards
- [ ] Exception path tested: allocation service down → retry x3 → log error + notify admin
- [ ] Outputs available: assignment report, unassigned-case list, workload report, case-move log, alert history, 🆕 year-scoped case list (cases filterable by their parent plan's year, scoped to the requesting user's own assignments)
- [ ] Unattended-case SLA timer wired to `workflow-engine`, not polled locally (Rule 8)
- [ ] `AuditCaseAssigned` / `AuditCaseReassigned` events verified — consumed by notification-engine, **EX/TP clusters**
- [ ] 🆕 `AuditCaseClosed` event fires on the `COMPLETED → CLOSED` transition — consumed by reporting-service

---

## 5. BUC-TA-005 — Plan Individual Audit Case
**FRs:** FR-04.2-01 → FR-04.2-12 (+ FR-04.2.1 if entry conference triggered) &nbsp;|&nbsp; **Aggregates:** `AuditPlan`, `AuditSamplingConfiguration` (VO)

### Functional Requirements (SoR)
- [ ] FR-04.2-01 — evaluate assigned case using data-warehouse info
- [ ] FR-04.2-02 — analyze taxpayer file/dossier; request additional docs; taxpayer can upload
- [ ] FR-04.2-03 — present taxpayer info + risk-engine criteria w/ drill-down; review/document prior-audit findings and risk areas
- [ ] FR-04.2-04 — determine materiality (objective, scope, context, resources)
- [ ] FR-04.2-05 — industry research incl. ratio computation and cross-sector comparison
- [ ] FR-04.2-06 — determine sampling method (stratified/random/systematic/etc., per Ministry requirements)
- [ ] FR-04.2-07 — prepopulate taxpayer info; prepare audit plan per segment/tax type/period; submit for approval; set auditor-wise targets by complexity; support desk/field/issue/comprehensive/investigation modes; configurable plan types/audit types/steps/decision categories
- [ ] FR-04.2-08 — notify auditor on plan approval
- [ ] FR-04.2-09 — trigger Entry Conference sub-process if initial meeting required
- [ ] FR-04.2-10 — upload analysis/evidence/findings from personal computer with adequate data security; store working papers; prepare & configure audit preparation report template
- [ ] FR-04.2-11 — team leader/authorized persons review, e-sign, route through hierarchy to final approval
- [ ] FR-04.2-12 — trigger Tax Intelligence & Fraud Investigation sub-process on fraud indication

### Normal Flow
- [ ] Review taxpayer profile, selection reason, risk info
- [ ] View filing history, payment records, prior audits, external data
- [ ] Analyze and identify potential risk areas
- [ ] Request documents from taxpayer when needed; taxpayer uploads
- [ ] Review uploaded documents, add to analysis
- [ ] Decide audit scope (focus areas, periods, effort)
- [ ] Research taxpayer's industry (ratios, benchmarks)
- [ ] Choose sampling method
- [ ] Prepare detailed plan (business areas, per-tax-type steps, timeline, responsibilities)
- [ ] Set personal targets based on complexity (intent only — Rule 14, not workforce-engine data)
- [ ] Save & submit plan to Team Leader — each save creates a new `PlanVersion`
- [ ] Team leader notified; case → "Plan Submitted"

### Alternative Flows
- [ ] **AF1** — Not enough info to plan → document gaps → request from taxpayer → if no response: proceed with note, or ask team leader (who may approve proceeding or hold)
- [ ] **AF2** — Taxpayer doesn't send requested documents → reminder sent → if still none: extend time (w/ reason) / proceed with what's available / suggest enforcement escalation — reason recorded
- [ ] **AF3** — Deeper industry research needed → advanced tools (trend analysis, peer comparison, economic data) → findings attached → return to normal flow
- [ ] **AF4** — Chosen sampling method not configured → message + available alternatives → pick available method or request configuration (pause/resume)
- [ ] **AF5** — Team leader sends plan back → comments → auditor revises and resubmits → repeats until approved
- [ ] **AF6** — Entry Conference needed → save as draft → trigger Entry Conference sub-process → resume plan after
- [ ] **AF7** — Possible fraud found → mark for fraud review → auto-trigger fraud investigation → planning paused → findings + team-leader notification recorded
- [ ] **AF8** — External data (customs/bank) unavailable/delayed → warning shown → proceed with note / hold + reminder / manual pull request → recorded; notified if data becomes available later (Rule 7 cached-snapshot fallback)

### Business Rules
- [ ] BR-001 — no fieldwork until plan is approved
- [ ] BR-002 — auditor must document materiality
- [ ] BR-003 — sampling method must be suitable and documented
- [ ] BR-004 — comprehensive audits require industry research

### Postconditions / Done
- [ ] Plan created and routed for approval (or auto-approved per config)
- [ ] Case status → "Plan Submitted"
- [ ] All analysis, document requests, decisions saved to case file
- [ ] Sampling method documented
- [ ] Fraud findings (if any) routed to fraud team
- [ ] Full audit trail of who did what, when
- [ ] Exception path tested: data-warehouse timeout → retry → cached data + warning if fails
- [ ] Outputs available: completed plan document, sampling rationale notes, industry research, document-request record
- [ ] `AuditPlanSubmitted` → workflow-engine; `AuditPlanApproved` → notification-engine + **EX and TP clusters (handoff point — payload shape frozen and agreed)**
- [ ] Rule 7 fallback tested against `IntegrationEnginePort`/`TaxTypeEnginePort` with engine simulated down

---

## 6. BUC-TA-006 — Select and Form Joint Audit Team
**FRs:** FR-04.10.1-01 → FR-04.10.1-07 &nbsp;|&nbsp; **Aggregate:** `JointAudit`

### Functional Requirements (SoR)
- [ ] FR-04.10.1-01 — auto-select joint audit cases from risk-directorate ranking to Audit Directorate/branches; configurable case types/scope/duration; financial-analysis-driven case selection
- [ ] FR-04.10.1-02 — stakeholders can identify/submit joint-audit case requests
- [ ] FR-04.10.1-03 — committee receives selected cases, determines efficacy/viability of joint audit
- [ ] FR-04.10.1-04 — committee researches and records related issues
- [ ] FR-04.10.1-05 — case number generated; assign team members (manual + automatic)
- [ ] FR-04.10.1-06 — team conducts detailed risk assessment
- [ ] FR-04.10.1-07 — committee assigns joint-audit team leader (manual + automatic)

### Normal Flow
- [ ] List of candidate joint-audit cases shown (risk team + external requests)
- [ ] Filter by location/industry/risk level/source
- [ ] Review case details + risk info
- [ ] Decide suitability (taxpayer size, complexity, cross-border issues)
- [ ] Deeper risk check for suitable cases
- [ ] Pick cases to proceed as joint audits
- [ ] Unique reference number assigned, linked to annual plan
- [ ] Identify needed skills/availability; tool can suggest auditors
- [ ] Choose team members (manual or accept suggestion)
- [ ] Choose team leader
- [ ] Notify all team members + leader
- [ ] Case marked "Joint Audit Team Assigned", ready for planning

### Alternative Flows
- [ ] **AF1** — Case not suitable for joint audit → reason recorded → optionally routed back to individual-audit path → requester informed
- [ ] **AF2** — Not enough auditors available → skill gap shown → set aside / request availability / proceed with smaller team + written rationale → recorded
- [ ] **AF3** — Urgent joint-audit request mid-process → handle now → added to list, expedited → urgent handling noted
- [ ] **AF4** — Auto-suggest whole team → tool proposes team + leader by skill/workload fairness → accept or manually adjust with reason → team formed & notified

### Business Rules
- [ ] BR-001 — case must meet conditions (large taxpayer, complex business, cross-border)
- [ ] BR-002 — Joint Audit Committee must agree before any joint audit
- [ ] BR-003 — committee must consider skills, workload, location when forming team

### Postconditions / Done
- [ ] Joint-audit cases chosen with reference numbers, linked to plan
- [ ] Team + leader assigned per case
- [ ] All team members + leader notified
- [ ] Every decision (incl. declined cases, team formation) recorded
- [ ] Exception path tested: staff data unavailable → log error + notify admin
- [ ] Outputs available: selected joint-audit case list, team details per case
- [ ] `JointAuditTeamFormed` event verified — consumed by notification-engine

---

## 7. BUC-TA-007 — Plan Joint Audit
**FRs:** FR-04.10.2-01 → FR-04.10.2-12 &nbsp;|&nbsp; **Aggregate:** `JointAudit`

### Functional Requirements (SoR)
- [ ] FR-04.10.2-01 — evaluate assigned case using data-warehouse info
- [ ] FR-04.10.2-02 — analyze taxpayer file/dossier; request/upload additional docs
- [ ] FR-04.10.2-03 — present taxpayer info + risk-engine criteria w/ drill-down; review/document prior findings
- [ ] FR-04.10.2-04 — determine materiality
- [ ] FR-04.10.2-05 — industry research (ratios, cross-sector comparison)
- [ ] FR-04.10.2-06 — choose sampling method (any designated person)
- [ ] FR-04.10.2-07 — prepopulate taxpayer info; prepare plan per segment/tax type/period; submit for approval; set auditor-wise targets; support all audit modes
- [ ] FR-04.10.2-08 — notify auditor on plan approval
- [ ] FR-04.10.2-09 — trigger Entry Conference if initial meeting required
- [ ] FR-04.10.2-10 — upload analysis/evidence from personal computer w/ security; store working papers; prepare preparation report
- [ ] FR-04.10.2-11 — team leader/authorized persons review, e-sign, route to final approval
- [ ] FR-04.10.2-12 — trigger fraud-investigation sub-process on indication

### Normal Flow
- [ ] Team jointly reviews taxpayer profile, selection reason, risk info
- [ ] View filing history, payments, prior audits, external data
- [ ] Discuss and identify risk areas; share notes
- [ ] Team leader requests documents when needed; taxpayer uploads
- [ ] Review uploaded documents, add to analysis
- [ ] Agree audit scope (focus, periods, who covers what)
- [ ] Research industry (ratios/benchmarks); split across members
- [ ] Choose sampling method
- [ ] Prepare detailed plan (areas, per-tax-type steps, timeline, responsibilities)
- [ ] Set collective/individual targets
- [ ] Team leader saves & submits plan to committee — each save creates a new `PlanVersion`
- [ ] Committee notified; case → "Joint Audit Plan Submitted"

### Alternative Flows
- [ ] **AF1** — Not enough info → document gaps, request from taxpayer → if no response: proceed with note or committee decides to hold
- [ ] **AF2** — Taxpayer doesn't send documents → reminder → if still none: extend / proceed / recommend escalation — recorded
- [ ] **AF3** — Deeper industry research needed → advanced tools → findings attached → resume normal flow
- [ ] **AF4** — Chosen sampling method not available → alternatives suggested → pick available or request configuration (pause/resume)
- [ ] **AF5** — Committee sends plan back → comments → team revises, resubmits → repeats until approved
- [ ] **AF7** — Possible fraud found → mark for review → auto-trigger investigation → planning paused → findings + committee notification recorded
- [ ] **AF8** — External data unavailable/delayed → warning → proceed with note / delay / manual pull request → recorded, notified if data arrives later (Rule 7)

> Note: source document has no AF6 for this BUC (numbering jumps AF5 → AF7) — confirm with the business owner whether this is an intentional gap before treating it as a missing spec.

### Business Rules
- [ ] BR-001 — no joint-audit fieldwork until plan approved by Joint Audit Committee
- [ ] BR-002 — team must document materiality
- [ ] BR-003 — sampling method must be suitable and documented

### Postconditions / Done
- [ ] Joint plan created and sent to committee for approval
- [ ] Case status → "Joint Audit Plan Submitted"
- [ ] All analysis, requests, decisions saved to case file
- [ ] Sampling method documented
- [ ] Fraud findings (if any) routed to fraud team
- [ ] Full audit trail incl. plan version history
- [ ] Exception path tested: collaborative workspace unavailable → log error + alert admin
- [ ] Outputs available: completed joint plan, sampling rationale, industry research, document-request record, committee approval record, version history
- [ ] `JointAuditPlanApproved` event verified — consumed by notification-engine, workflow-engine, **JA execution cluster (handoff point — payload shape frozen and agreed)**
- [ ] Rule 7 fallback tested for external data calls with engine simulated down

---

## 8. Domain Events — Verification Checklist

| Event | Trigger | Consumers to verify | Checked |
|---|---|---|---|
| `AnnualAuditPlanCreated` | TA-001 draft created | reporting-service | [ ] |
| `AnnualAuditPlanApproved` | TA-001 final approval | notification-engine | [ ] |
| 🆕 `RegionalFeedbackOverridden` | TA-001 AF6 | notification-engine, reporting-service | [ ] |
| 🆕 `RegionalDeploymentConfirmed` | TA-001 new deployment step | workflow-engine | [ ] |
| 🆕 `AnnualAuditPlanFinalized` | TA-001 — fires only once every region/business unit has confirmed deployment (Rule 16) | reporting-service, risk-engine, **CM cluster (unblocks TA-002 case generation)** | [ ] |
| `AuditCaseCreated` | TA-002 cascade/referral resolution | risk-engine, notification-engine, CM cluster | [ ] |
| `AuditReferralReceived` | TA-002 referral intake | risk-engine, notification-engine | [ ] |
| `AuditCaseSelected` | TA-003 selection confirmed | notification-engine, reporting-service | [ ] |
| `RandomAuditCaseSelected` | TA-003 AF5 | reporting-service, risk-engine (feedback loop) | [ ] |
| `TreatmentPlanAttached` | TA-003 | notification-engine | [ ] |
| `AuditCaseAssigned` | TA-004 | notification-engine, EX/TP clusters | [ ] |
| `AuditCaseReassigned` | TA-004 | notification-engine | [ ] |
| 🆕 `AuditCaseClosed` | TA-004 — `COMPLETED → CLOSED` transition | reporting-service | [ ] |
| `AuditPlanSubmitted` | TA-005 submit | workflow-engine | [ ] |
| `AuditPlanApproved` | TA-005 approve → PLAN_APPROVED | notification-engine, **EX and TP clusters (critical handoff)** | [ ] |
| `JointAuditTeamFormed` | TA-006 | notification-engine | [ ] |
| `JointAuditPlanApproved` | TA-007 | notification-engine, workflow-engine, **JA execution cluster (critical handoff)** | [ ] |

---

## 9. 🆕 MOR Reference-Flow Traceability

Cross-check between the MOR Audit Planning System's 12-phase end-to-end flow and this checklist — confirms every phase in the reference trace has a home in a BUC above, and flags where the BUC needs to be stricter than a typical CRUD/localStorage prototype.

| MOR Reference Phase | Cluster AP Home | Status |
|---|---|---|
| Phase 1 — Plan creation (DRAFT) | TA-001 Normal Flow | ✅ covered |
| Phase 2 — Submit to Director | TA-001 Normal Flow | ✅ covered |
| Phase 3 — Director approve / request revision | TA-001 Normal Flow, AF1 | ✅ covered |
| Phase 4 — Regional feedback incl. tax-center distribution + **override** | TA-001 Normal Flow (🆕 sub-unit distribution), AF6 (🆕 override) | 🆕 added — was missing override semantics (Rule 15) |
| Phase 5 — Director collects feedback, decides accept vs. amendment | TA-001 AF3/AF3a | 🆕 sharpened — amendment now its own tracked state, not folded into AF1 |
| Phase 6 — Amendment cycle, plan edited in place | TA-001 AF3a | 🆕 added |
| Phase 7 — Senior Management approve/reject | TA-001 Normal Flow, AF4 | ✅ covered (open question flagged on restart scope) |
| Phase 8 — Regional deployment, fan-in to Finalized | TA-001 Normal Flow (🆕 deployment step), AF7, BR-005 | 🆕 added — this fan-in gate did not previously exist in the checklist; case generation (TA-002) was implicitly gated on Senior Management approval only |
| Phase 9 — Automatic case generation | TA-002 Normal Flow | ✅ covered — 🆕 gate corrected to `FINALIZED` not `APPROVED_TO_REGIONS` |
| Phase 10 — Tax Center Manager assigns to Team Leaders | TA-004 Normal Flow (🆕 two-hop assignment note) | 🆕 clarified |
| Phase 11 — Team Leader load-balanced assignment to Auditors | TA-004 Normal Flow, AF6 | ✅ covered — 🆕 "least-loaded, recalculated per batch" made explicit |
| Phase 12 — Auditor status updates incl. CLOSED | TA-004/TA-005 Postconditions, BR-005 | 🆕 added — `CLOSED` as a distinct terminal state from `COMPLETED` was not previously in the checklist |

**Not carried over on purpose** (frontend/prototype concerns, not backend BUC requirements): localStorage persistence, React Context state shape, dark mode, Tailwind styling, Vercel/Netlify deployment. These stay in the reference doc and don't belong in this checklist.

---

## 10. Final Sign-off Gate (before calling Cluster AP "done")

- [ ] Every FR line above (all `M` mandatory) mapped to a passing test
- [ ] Every AF for every BUC has an automated or documented manual test — not just the happy path
- [ ] Every BR enforced as a domain invariant inside the aggregate/service, not only as a UI validation
- [ ] Audit trail entries verified for every state transition, including overrides/skips/manual interventions
- [ ] `AuditPlanApproved` and `JointAuditPlanApproved` payload contracts reviewed and signed off by Devs 2 & 3
- [ ] `AuditCase` package-location decision (neutral `casemanagement.domain.model` vs. nested under `planning/`) confirmed with all 4 developers
- [ ] All 8 outbound engine ports have stub/mock adapters so downstream devs can build/test without waiting on real engines
- [ ] Rule 7 fallback path tested end-to-end for every `IntegrationEnginePort`/`TaxTypeEnginePort` call site
- [ ] 🆕 Rule 16 fan-in gate tested: `AnnualAuditPlan` does **not** transition to `FINALIZED` (and TA-002 case generation stays blocked) until every business unit/region has confirmed deployment or has a recorded override
- [ ] 🆕 Rule 15 override audit trail verified for every override point in the cluster (regional feedback override, capacity override, forced-finalization override) — original value always retrievable alongside the override
- [ ] 🆕 Case status lifecycle test: a case cannot reach `CLOSED` without first passing through `COMPLETED`, and `CLOSED` cases are excluded from all open-workload calculations
