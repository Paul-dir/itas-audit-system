# Domain Rules

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document catalogs all domain rules enforced by the aggregates and domain services. These rules are business invariants that must be enforced at the domain layer, not at the UI or application layer.

---

## 1. Cross-Cutting Domain Rules

### Rule 1: AuditCase Field Integrity
- **Description:** `AuditCase` fields must match the aggregate spec exactly. No local schema drift.
- **Enforcement:** Code review + aggregate unit tests.
- **Applies To:** All clusters that consume `AuditCase`.

### Rule 2: Risk Engine Integration
- **Description:** Every risk-engine call goes through `RiskProfilingService`. No ad-hoc REST calls in controllers.
- **Enforcement:** Architectural constraint + code review.
- **Applies To:** All clusters (AP, EX, TP, JA, IA).

### Rule 3: Immutable Audit Trail
- **Description:** Every mutation writes an `AuditTrailEntry` (who/what/when/why/diff) to `audit_case_audit_log`, 7-year retention.
- **Enforcement:** Aspect-oriented logging + database constraints.
- **Applies To:** All clusters.

### Rule 7: External Data Fallback
- **Description:** When external data (customs, banks) is unavailable, use last cached snapshot with warning flag. Human decides.
- **Enforcement:** Integration adapter behavior.
- **Applies To:** EX, TP clusters.

### Rule 8: Workflow Engine for Approvals
- **Description:** Any approval chain with more than one step or an SLA timer goes through `workflow-engine`.
- **Enforcement:** Architectural constraint.
- **Applies To:** AP, EX, IA, RF, QA clusters.

### Rule 11: Source Tracking
- **Description:** `AuditCase.source` always explicitly set: `RISK_ENGINE`, `INTERNAL_REFERRAL`, `EXTERNAL_REFERRAL`, `MANUAL_SELECTION`, `RANDOM_SAMPLE`. Never inferred.
- **Enforcement:** Domain invariant in `AuditCase` aggregate.
- **Applies To:** AP cluster (TA-002, TA-003).

### Rule 12: Sampling Configuration
- **Description:** Sampling configuration is data (`AuditSamplingConfiguration`), validated by `SamplingService`. No hardcoded switch statements.
- **Enforcement:** Domain service + unit tests.
- **Applies To:** EX, TP, JA clusters.

### Rule 13: Treatment Plan Integrity
- **Description:** `TreatmentPlan` embedded at TA-003 travels unchanged to QA (TA-023). No silent overwrite.
- **Enforcement:** Domain invariant + code review.
- **Applies To:** AP, QA clusters.

### Rule 14: Workforce Capacity (Read-Only)
- **Description:** `workforce-engine` consulted for capacity/eligibility only (read-only). No target numbers written back.
- **Enforcement:** Read-only port + architectural constraint.
- **Applies To:** AP cluster (TA-004).

### Rule 15: Override Semantics
- **Description:** Any override of an aggregated/rolled-up value is stored as a first-class fact: `isOverridden`, `overriddenBy`, `overriddenAt`, `overrideReason`. Original value never replaced.
- **Enforcement:** Domain invariant in `PlanAllocation` entity.
- **Applies To:** AP cluster (TA-001, TA-002, TA-003).

### Rule 16: Fan-in Gate
- **Description:** Any plan/case status transition that depends on every member of a set responding is a fan-in gate. The aggregate only advances when every member has an explicit response or a recorded non-response.
- **Enforcement:** Domain invariant in `AnnualAuditPlan` aggregate.
- **Applies To:** AP cluster (TA-001).

### Rule 17: Event-Sourced Reporting
- **Description:** Management reporting is built from outbox events, not live-queried from transactional tables.
- **Enforcement:** Architectural constraint + read-model projections.
- **Applies To:** RF cluster.

---

## 2. AP Cluster Domain Rules

### TA-001: Annual Audit Plan Rules

| Rule ID | Description | Enforcement |
| :--- | :--- | :--- |
| BR-AP-001 | Plan must be based on tactics, volumes, effort, and skills (Risk-Proposal Engine replaces manual entry). | `RiskPoolQueryService` |
| BR-AP-002 | Director approval required before business-unit notification. | Workflow Engine |
| BR-AP-003 | Senior Management approval required for finalization. | Workflow Engine |
| BR-AP-004 | All versions and feedback retained for audit trail. | `AnnualAuditPlan` Aggregate |
| BR-AP-005 | Plan cannot transition to FINALIZED until every Tax Center confirms deployment (Fan-in Gate - Rule 16). | `AnnualAuditPlan` Aggregate |
| BR-AP-006 | Overrides must preserve the original submitted value (Rule 15). | `PlanAllocation` Entity |
| BR-AP-007 | Overrides must store `overriddenBy`, `overriddenAt`, `overrideReason`. | `PlanAllocation` Entity |

### TA-002, TA-003: Cascade, Selection & Assignment Rules

| Rule ID | Description | Enforcement |
| :--- | :--- | :--- |
| BR-AS-001 | Cases chosen by risk priority unless random selection is used. | `SelectAndPrioritizeCasesUseCase` |
| BR-AS-002 | Internal/external requests considered but not necessarily accepted. | `SelectAndPrioritizeCasesUseCase` |
| BR-AS-003 | Total effort cannot exceed capacity without Director approval (override). | `SelectAndPrioritizeCasesUseCase` |
| BR-AS-004 | Every selected case must have an initial treatment plan. | `TreatmentPlan` Value Object |
| BR-AS-008 | Moving a case requires a recorded reason. | `ReassignCaseUseCase` |
| BR-AS-009 | Case can only move to CLOSED from COMPLETED. | `AuditCase` Aggregate |
| BR-AS-010 | `AuditCase.source` must be explicitly set (Rule 11). | `AuditCase` Aggregate |

### TA-004: Assignment Rules

| Rule ID | Description | Enforcement |
| :--- | :--- | :--- |
| BR-AS-005 | Auditor skills must match case needs. | `AssignmentService` |
| BR-AS-006 | Workload limits respected unless overridden with reason. | `AssignmentService` |
| BR-AS-007 | Case complexity matched to auditor experience. | `AssignmentService` |

### Routing Rules (AP → Execution Handoff)

| Rule ID | Description | Enforcement |
| :--- | :--- | :--- |
| BR-RT-001 | Cases for Desk, Comp, and Issue follow standard delegation (Team Leader → Auditor). | `StandardDelegationService` |
| BR-RT-002 | Cases for TP and JA follow committee delegation (Process Owner → Committee). | `CommitteeDelegationService` |
| BR-RT-003 | TP cases are assigned to TP Committee (TA-012). | Workflow Engine |
| BR-RT-004 | JA cases are assigned to Joint Audit Committee (TA-006). | Workflow Engine |
| BR-RT-005 | For TP and JA cases, `taxCenterCode` is NULL (Federal). | `AuditCase` Aggregate |

---

## 3. EX Cluster Domain Rules

### Desk Audit (TA-009)

| Rule ID | Description | Enforcement |
| :--- | :--- | :--- |
| BR-EX-001 | Desk audits must follow standard audit procedures per tax law. | `ConductDeskAuditUseCase` |
| BR-EX-002 | Evidence must be collected from internal and external sources where available. | `EvidenceAggregationService` |
| BR-EX-003 | Draft audit reports must be reviewed by team leader before finalization. | Workflow Engine |
| BR-EX-004 | Risk profile updates must be recorded when significant issues are identified. | `RiskEnginePort` |
| BR-EX-005 | Communication with taxpayer must be through official channels (portal/email). | Notification Engine |
| BR-EX-006 | All work must be documented sufficiently to support conclusions. | `AuditWorkLog` |

### Comprehensive Audit (TA-010)

| Rule ID | Description | Enforcement |
| :--- | :--- | :--- |
| BR-EX-007 | CAAT should be applied where possible to improve efficiency. | `CaatEnginePort` |
| BR-EX-008 | Financial statement verification must follow recognized accounting standards. | `AccountingComplianceAssessment` |
| BR-EX-009 | Industry comparisons must use reliable benchmark data. | `BenchmarkAnalyticsPort` |
| BR-EX-010 | Third-party data verification must be documented. | `ThirdPartyDataPort` |
| BR-EX-011 | Scope expansion requires documented approval from Audit Manager. | Workflow Engine |
| BR-EX-012 | Comprehensive Audit inherits all evidence from Desk Audit on escalation. | `DecideComprehensiveEscalationUseCase` |

---

## 4. TP Cluster Domain Rules

| Rule ID | Description | Enforcement |
| :--- | :--- | :--- |
| BR-TP-001 | Every TP audit case must have a unique case identifier. | `AuditCase` |
| BR-TP-002 | A TP case must be supported by at least one risk indicator or stakeholder referral. | `TpRiskAssessment` |
| BR-TP-003 | TP audit cases must be reviewed by process owner before proceeding to planning. | Workflow Engine |
| BR-TP-004 | TP audits must examine transactions between related entities. | `TpAnalysisResult` |
| BR-TP-005 | Audit sampling methods must follow established audit standards. | `AuditSamplingConfiguration` |
| BR-TP-006 | Industry benchmarks must be used when evaluating pricing practices. | `BenchmarkAnalyticsPort` |
| BR-TP-007 | Cross-border related-party transactions must receive special scrutiny. | `TpRiskAssessment` |
| BR-TP-008 | Every TP audit must result in a documented audit report. | `TpAuditReport` |
| BR-TP-009 | Audit findings must be supported by evidence and analysis. | `TpAuditReport` |
| BR-TP-010 | The taxpayer must be given the opportunity to review findings. | `TpFactStatement` |
| BR-TP-011 | Analysis must be reproducible (store parameters, data snapshots, methodology). | `TpAnalysisResult` |

---

## 5. JA Cluster Domain Rules

| Rule ID | Description | Enforcement |
| :--- | :--- | :--- |
| BR-JA-001 | Case must meet conditions (large taxpayer, complex business, cross-border) for Joint Audit. | `JointAuditCommittee` |
| BR-JA-002 | Joint Audit Committee must agree before any joint audit. | Workflow Engine |
| BR-JA-003 | Committee must consider skills, workload, and location when forming team. | `JointAuditTeam` |
| BR-JA-004 | No joint audit fieldwork until plan approved by Joint Audit Committee. | Workflow Engine |
| BR-JA-005 | Team must document materiality. | `JointAuditPlan` |
| BR-JA-006 | Sampling method must be suitable and documented. | `AuditSamplingConfiguration` |
| BR-JA-007 | All joint audit team members have equal access to the shared case file (federated workspace). | `FederatedWorkspace` |
| BR-JA-008 | Multi-level approval thresholds are configurable. | Workflow Engine |

---

## 6. IA Cluster Domain Rules

| Rule ID | Description | Enforcement |
| :--- | :--- | :--- |
| BR-IA-001 | SLA Timer starts on NOTICE_ISSUED. If no response in 30 days (configurable), auto-advance. | Workflow Engine |
| BR-IA-002 | maxRevisionCount enforced per approval level (Team Leader and Process Owner). Default = 3. | `IssueAudit` Aggregate |
| BR-IA-003 | When maxRevisionCount exceeded, case auto-escalates to Director. | `IssueAuditEscalationService` |
| BR-IA-004 | Auditee document uploads must reference a valid scopeItemId. | `DmsPort` / `IssueAuditScope` |
| BR-IA-005 | auditMode (DESK, FIELD, HYBRID) is immutable after scope selection. | `IssueAudit` Aggregate |
| BR-IA-006 | Field visit steps are only permitted when auditMode = FIELD or HYBRID. | `IssueAudit` Aggregate |
| BR-IA-007 | Director decision is final: REPORT_GENERATED, FRAUD_ESCALATED, COMPREHENSIVE_TRIGGERED. | `IssueAudit` Aggregate |

---

## 7. QA Cluster Domain Rules

| Rule ID | Description | Enforcement |
| :--- | :--- | :--- |
| BR-QA-001 | QA sampling methods are configurable (random, stratified, risk-based). | `QaSamplingService` |
| BR-QA-002 | QA cases must be assigned based on expertise and workload balancing. | `AssignQaReviewUseCase` |
| BR-QA-003 | QA reports must be approved before finalization. | Workflow Engine |
| BR-QA-004 | Follow-up actions must be tracked to completion. | `QualityAssuranceReview` Aggregate |
| BR-QA-005 | QA review frequency is configurable (monthly, quarterly, etc.). | `SampleAuditCasesForQaUseCase` |
| BR-QA-006 | Sampling must be auditable: cryptographic seed and algorithm stored. | `QaSamplingService` |

---

## 8. CM Cluster Domain Rules

| Rule ID | Description | Enforcement |
| :--- | :--- | :--- |
| BR-CM-001 | All audit notices must follow approved MoR formats. | DMS |
| BR-CM-002 | Audit notices must be issued within a configurable period. | Workflow Engine |
| BR-CM-003 | Entry conferences must be held in designated interview rooms. | `EntryConference` |
| BR-CM-004 | Meeting invitations must be sent at least X days before proposed date (configurable). | Notification Engine |
| BR-CM-005 | Taxpayer confirmation must be recorded before meeting is considered confirmed. | `EntryConference` |
| BR-CM-006 | All interview records must be approved by a team leader before sending to taxpayer. | Workflow Engine |

---

## 9. RF Cluster Domain Rules

| Rule ID | Description | Enforcement |
| :--- | :--- | :--- |
| BR-RF-001 | Audit reports must pass through required approval levels. | Workflow Engine |
| BR-RF-002 | Taxpayers must be given a defined period to respond. | Workflow Engine |
| BR-RF-003 | Assessment notices must only be issued after approval of audit report. | Workflow Engine |
| BR-RF-004 | Taxpayers must be allowed to accept or object to audit findings. | `TaxpayerResponse` |
| BR-RF-005 | Objections must be submitted within the legally defined period. | Workflow Engine |
| BR-RF-006 | Assessment notice must calculate principal, penalties, and interest correctly. | Ledger Engine |
| BR-RF-007 | Taxpayer account must be adjusted upon assessment acceptance. | Ledger Engine |
| BR-RF-008 | Management reports are generated from event-stream (not live queries). Rule 17. | Reporting Service |

---

## 10. Rule Summary by Cluster

| Cluster | Rule Count | Key Rules |
| :--- | :--- | :--- |
| **Cross-Cutting** | 8 | Audit Trail, Outbox, Source Tracking, Overrides, Fan-in Gate |
| **AP** | 15 | Plan Proposal, Fan-in Gate, Routing, Assignment |
| **EX** | 12 | Evidence Collection, Evidence Inheritance, CAAT |
| **TP** | 11 | Federal Routing, Reproducible Analysis |
| **JA** | 8 | Federated Workspace, Committee Approval |
| **IA** | 7 | SLA Timer, Revision Cap, Scope Validation |
| **QA** | 6 | Auditable Sampling, Recommendation Tracking |
| **CM** | 6 | Alternative Delivery, Entry Conference |
| **RF** | 8 | Event-Sourced Reporting, Assessment Calculation |

