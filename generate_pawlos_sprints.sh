#!/bin/bash
DIR="docs/12-sprints/01-pawlos-ap"
rm -f $DIR/*.md

cat << 'INNER' > $DIR/sprint-01-database-bootstrap.md
# Sprint 01: AP Database Bootstrap
**Goal:** Create `V1__ap_tables.sql` defining `ap_annual_audit_plans`, `ap_plan_allocations`, `ap_audit_cases`.
INNER

cat << 'INNER' > $DIR/sprint-02-domain-aggregates.md
# Sprint 02: AP Domain Aggregates
**Goal:** Create `AnnualAuditPlan`, `PlanAllocation`, `AuditCase` entities with JPA annotations.
INNER

cat << 'INNER' > $DIR/sprint-03-risk-engine-mock.md
# Sprint 03: Risk Engine Mock Integration
**Goal:** Create `RiskEnginePort` interface and `@Profile("mock")` adapter.
INNER

cat << 'INNER' > $DIR/sprint-04-plan-creation-api.md
# Sprint 04: Plan Creation Backend Service
**Goal:** Create `AuditPlanService.createDraftPlan()` and REST Controller.
INNER

cat << 'INNER' > $DIR/sprint-05-plan-creation-ui.md
# Sprint 05: Plan Creation Frontend UI
**Goal:** Create RTK Query endpoints and `<PlanCreationForm />` in `src/features/ap`.
INNER

cat << 'INNER' > $DIR/sprint-06-feedback-domain.md
# Sprint 06: Tax Center Feedback Domain Logic
**Goal:** Implement Rule 15 (Overrides) inside the `AnnualAuditPlan` aggregate.
INNER

cat << 'INNER' > $DIR/sprint-07-fanin-gate.md
# Sprint 07: Fan-in Gate Validation Service
**Goal:** Implement Rule 16 (Fan-in Gate) preventing transition until all tax centers confirm.
INNER

cat << 'INNER' > $DIR/sprint-08-feedback-ui.md
# Sprint 08: Director Review Frontend UI
**Goal:** Create `<DirectorReviewDashboard />` and Tax Center feedback tables.
INNER

cat << 'INNER' > $DIR/sprint-09-selection-algorithm.md
# Sprint 09: Case Selection Algorithm
**Goal:** Build the backend logic to parse allocations and trigger the `RiskEnginePort` for TINs.
INNER

cat << 'INNER' > $DIR/sprint-10-case-generation.md
# Sprint 10: Case Generation Backend
**Goal:** Persist generated TINs as `AuditCase` aggregates, enforcing Rule 11 (Source Tracking).
INNER

cat << 'INNER' > $DIR/sprint-11-referral-ui.md
# Sprint 11: Case Referral Inbox UI
**Goal:** Build React UI for Process Owner to view generated cases and triage manual referrals.
INNER

cat << 'INNER' > $DIR/sprint-12-delegation-service.md
# Sprint 12: Delegation Service Engine
**Goal:** Build `StandardDelegationService` and `CommitteeDelegationService` routing logic.
INNER

cat << 'INNER' > $DIR/sprint-13-assignment-board.md
# Sprint 13: Assignment Board UI
**Goal:** Build the React drag-and-drop or table assignment UI enforcing auditor capacity limits.
INNER

echo "Generated 13 micro-sprints for Pawlos."
