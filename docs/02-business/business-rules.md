# Business Rules

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document catalogs all authoritative business rules (BRs) derived from the SoR, BRS, and our architectural gap-fills. These rules are enforced at the domain level (Aggregates/Domain Services), not at the UI level.

**Legend:**
- `[BRS]` = From original Business Use Case PDF
- `[SoR]` = From SoR - Module D
- `[GAP]` = Gap-fill rule introduced by our architecture
- `[ARC]` = Architectural constraint (enforced by system design)
- `[CROSS]` = Cross-cutting rule (applies to all clusters)

---

## 1. Cross-Cutting Business Rules (All Clusters)

| ID | Rule | Source | Enforced By |
| :--- | :--- | :--- | :--- |
| **BR-C-001** | Every mutation must write an immutable `AuditTrailEntry` (who, what, when, why, diff). 7-year retention. | [ARC] | Shared Infrastructure (Audit Trail) |
| **BR-C-002** | Every domain event must be persisted in the Outbox atomically with the aggregate save. | [ARC] | Shared Infrastructure (Outbox) |
| **BR-C-003** | `X-Actor-Id` header is required on all mutating endpoints. | [ARC] | Security/API Layer |
| **BR-C-004** | All external data calls (Risk Engine, Registration Service) are read-only. | [ARC] | Integration Ports |
| **BR-C-005** | External data fallback: If third-party data is unavailable, use cached snapshot + warning flag. Human decides. | [ARC] | Integration Adapters |
| **BR-C-006** | All risk-engine calls go through `RiskProfilingService` (no ad-hoc REST calls in controllers). | [ARC] | Application Layer |
| **BR-C-007** | Management reporting is event-sourced (read from Outbox events), not live-queried. (Rule 17) | [ARC] | Reporting Service |
| **BR-C-008** | Sampling configuration is data (`AuditSamplingConfiguration`), validated by `SamplingService`. No hardcoded switch statements. (Rule 12) | [ARC] | Domain Service |
| **BR-C-009** | `TreatmentPlan` attached at TA-003 travels unchanged to QA (TA-023). No silent overwrite. (Rule 13) | [ARC] | Domain Invariant |

---

## 2. Planning & Allocation Rules (AP Cluster)

| ID | Rule | Source | Enforced By |
| :--- | :--- | :--- | :--- |
| **BR-AP-001** | Plan must be based on tactics, volumes, effort, and skills (Risk-Proposal Engine replaces manual entry). | [BRS] BR-001, [GAP] | `RiskPoolQueryService` |
| **BR-AP-002** | Director approval required before business-unit notification. | [BRS] BR-002 | Workflow Engine |
| **BR-AP-003** | Senior Management approval required for finalization. | [BRS] BR-003 | Workflow Engine |
| **BR-AP-004** | All versions and feedback retained for audit trail. | [BRS] BR-004 | `AnnualAuditPlan` Aggregate |
| **BR-AP-005** | Plan cannot transition to `FINALIZED` until every Tax Center confirms deployment (Fan-in Gate - Rule 16). | [GAP] | `AnnualAuditPlan` Aggregate |
| **BR-AP-006** | Overrides must preserve the original submitted value (Rule 15). | [GAP] | `PlanAllocation` Entity |
| **BR-AP-007** | Overrides must store `overriddenBy`, `overriddenAt`, `overrideReason`. | [GAP] | `PlanAllocation` Entity |
| **BR-AP-008** | Fewer cases than planned requires written reason (shortfall handling). | [BRS] BR-004 | `CascadePlanToCasesUseCase` |
| **BR-AP-009** | Duplicate case creation requires written reason. | [BRS] BR-005 | `CascadePlanToCasesUseCase` |
| **BR-AP-010** | Date changes on cases must record reason, user, and timestamp. | [BRS] BR-006 | `AuditCase` Aggregate |

---

## 3. Selection & Assignment Rules (AP Cluster)

| ID | Rule | Source | Enforced By |
| :--- | :--- | :--- | :--- |
| **BR-AS-001** | Cases chosen by risk priority unless random selection is used. | [BRS] BR-001 | `SelectAndPrioritizeCasesUseCase` |
| **BR-AS-002** | Internal/external requests considered but not necessarily accepted. | [BRS] BR-002 | `SelectAndPrioritizeCasesUseCase` |
| **BR-AS-003** | Total effort cannot exceed capacity without Director approval (override). | [BRS] BR-003 | `SelectAndPrioritizeCasesUseCase` |
| **BR-AS-004** | Every selected case must have an initial treatment plan. | [BRS] BR-004 | `TreatmentPlan` Value Object |
| **BR-AS-005** | Auditor skills must match case needs. | [BRS] BR-001 | `AuditorAssignmentService` |
| **BR-AS-006** | Workload limits respected unless overridden with reason. | [BRS] BR-002 | `AuditorAssignmentService` |
| **BR-AS-007** | Case complexity matched to auditor experience. | [BRS] BR-003 | `AuditorAssignmentService` |
| **BR-AS-008** | Moving a case requires a recorded reason. | [BRS] BR-004 | `ReassignCaseUseCase` |
| **BR-AS-009** | Case can only move to `CLOSED` from `COMPLETED` — never directly from `ASSIGNED`/`IN_PROGRESS`. | [GAP] | `AuditCase` Aggregate |
| **BR-AS-010** | `AuditCase.source` must be explicitly set (`RISK_ENGINE`, `RANDOM_SAMPLE`, `INTERNAL_REFERRAL`, `EXTERNAL_REFERRAL`, `MANUAL_SELECTION`). Never inferred. (Rule 11) | [GAP] | `AuditCase` Aggregate |

---

## 4. Routing Rules (AP → Execution Handoff)

| ID | Rule | Source | Enforced By |
| :--- | :--- | :--- | :--- |
| **BR-RT-001** | Cases for Desk, Comp, and Issue follow standard delegation (Process Owner → Team Leader → Auditor). | [GAP] | `StandardDelegationService` |
| **BR-RT-002** | Cases for TP and JA follow committee delegation (Process Owner → Committee → Team Leader). | [GAP] | `CommitteeDelegationService` |
| **BR-RT-003** | TP cases are assigned to TP Committee (TA-012). | [GAP] | Workflow Engine |
| **BR-RT-004** | JA cases are assigned to Joint Audit Committee (TA-006). | [GAP] | Workflow Engine |
| **BR-RT-005** | For TP and JA cases, `taxCenterCode` is `NULL` (Federal). | [GAP] | `AuditCase` Aggregate |

---

## 5. Execution Rules (EX Cluster)

| ID | Rule | Source | Enforced By |
| :--- | :--- | :--- | :--- |
| **BR-EX-001** | Desk audits must follow standard audit procedures per tax law. | [BRS] BR-001 | `ConductDeskAuditUseCase` |
| **BR-EX-002** | Evidence must be collected from internal and external sources where available. | [BRS] BR-002 | `EvidenceAggregationService` |
| **BR-EX-003** | Draft audit reports must be reviewed by team leader before finalization. | [BRS] BR-003 | Workflow Engine |
| **BR-EX-004** | Risk profile updates must be recorded when significant issues are identified. | [BRS] BR-004 | `RiskEnginePort` |
| **BR-EX-005** | Communication with taxpayer must be through official channels (portal/email). | [BRS] BR-005 | Notification Engine |
| **BR-EX-006** | All work must be documented sufficiently to support conclusions. | [BRS] BR-006 | `AuditWorkLog` |
| **BR-EX-007** | CAAT should be applied where possible to improve efficiency. | [BRS] BR-001 | `CaatEnginePort` |
| **BR-EX-008** | Financial statement verification must follow recognized accounting standards. | [BRS] BR-002 | `AccountingComplianceAssessment` |
| **BR-EX-009** | Industry comparisons must use reliable benchmark data. | [BRS] BR-003 | `BenchmarkAnalyticsPort` |
| **BR-EX-010** | Third-party data verification must be documented. | [BRS] BR-004 | `ThirdPartyDataPort` |
| **BR-EX-011** | Scope expansion requires documented approval from Audit Manager. | [BRS] BR-007 | Workflow Engine |
| **BR-EX-012** | Comprehensive Audit inherits all evidence from Desk Audit on escalation. | [GAP] | `DecideComprehensiveEscalationUseCase` |

---

## 6. Transfer Pricing Rules (TP Cluster)

| ID | Rule | Source | Enforced By |
| :--- | :--- | :--- | :--- |
| **BR-TP-001** | Every TP audit case must have a unique case identifier. | [BRS] BR-001 | `AuditCase` |
| **BR-TP-002** | A TP case must be supported by at least one risk indicator or stakeholder referral. | [BRS] BR-002 | `TpRiskAssessment` |
| **BR-TP-003** | TP audit cases must be reviewed by the process owner before proceeding to planning. | [BRS] BR-003 | Workflow Engine |
| **BR-TP-004** | TP audits must examine transactions between related entities. | [BRS] BR-001 | `TpAnalysisResult` |
| **BR-TP-005** | Audit sampling methods must follow established audit standards. | [BRS] BR-002 | `AuditSamplingConfiguration` |
| **BR-TP-006** | Industry benchmarks must be used when evaluating pricing practices. | [BRS] BR-003 | `BenchmarkAnalyticsPort` |
| **BR-TP-007** | Cross-border related-party transactions must receive special scrutiny. | [BRS] BR-004 | `TpRiskAssessment` |
| **BR-TP-008** | Every TP audit must result in a documented audit report. | [BRS] BR-001 | `TpAuditReport` |
| **BR-TP-009** | Audit findings must be supported by evidence and analysis. | [BRS] BR-002 | `TpAuditReport` |
| **BR-TP-010** | The taxpayer must be given the opportunity to review findings. | [BRS] BR-003 | `TpFactStatement` |
| **BR-TP-011** | Analysis must be reproducible (store parameters, data snapshots, methodology). | [GAP] | `TpAnalysisResult` |

---

## 7. Joint Audit Rules (JA Cluster)

| ID | Rule | Source | Enforced By |
| :--- | :--- | :--- | :--- |
| **BR-JA-001** | Case must meet conditions (large taxpayer, complex business, cross-border) for Joint Audit. | [BRS] BR-001 | `JointAuditCommittee` |
| **BR-JA-002** | Joint Audit Committee must agree before any joint audit. | [BRS] BR-002 | Workflow Engine |
| **BR-JA-003** | Committee must consider skills, workload, and location when forming team. | [BRS] BR-003 | `JointAuditTeam` |
| **BR-JA-004** | No joint audit fieldwork until plan approved by Joint Audit Committee. | [BRS] BR-001 | Workflow Engine |
| **BR-JA-005** | Team must document materiality. | [BRS] BR-002 | `JointAuditPlan` |
| **BR-JA-006** | Sampling method must be suitable and documented. | [BRS] BR-003 | `AuditSamplingConfiguration` |
| **BR-JA-007** | All joint audit team members have equal access to the shared case file (federated workspace). | [BRS] BR-012 | `FederatedWorkspace` |
| **BR-JA-008** | Multi-level approval thresholds are configurable (e.g., >$50k requires director approval). | [BRS] BR-014 | Workflow Engine |

---

## 8. Issue Audit Rules (IA Cluster)

| ID | Rule | Source | Enforced By |
| :--- | :--- | :--- | :--- |
| **BR-IA-001** | SLA Timer starts on `NOTICE_ISSUED` state. If no response in 30 days (configurable), auto-advance to `SCOPE_SELECTED` with warning. | [GAP] | Workflow Engine |
| **BR-IA-002** | `maxRevisionCount` enforced per approval level (Team Leader and Process Owner). Default = 3. | [GAP] | `IssueAudit` Aggregate |
| **BR-IA-003** | When `maxRevisionCount` exceeded, case auto-escalates to Director. | [GAP] | `IssueAuditEscalationService` |
| **BR-IA-004** | Auditee document uploads must reference a valid `scopeItemId` (scoped uploads). | [GAP] | `DmsPort` / `IssueAuditScope` |
| **BR-IA-005** | `auditMode` (DESK, FIELD, HYBRID) is immutable after scope selection. | [GAP] | `IssueAudit` Aggregate |
| **BR-IA-006** | Field visit steps are only permitted when `auditMode` = FIELD or HYBRID. | [GAP] | `IssueAudit` Aggregate |
| **BR-IA-007** | Director decision (REPORT_GENERATED / FRAUD_ESCALATED / COMPREHENSIVE_TRIGGERED) is final. | [GAP] | `IssueAudit` Aggregate |

---

## 9. Quality Assurance Rules (QA Cluster)

| ID | Rule | Source | Enforced By |
| :--- | :--- | :--- | :--- |
| **BR-QA-001** | QA sampling methods are configurable (random, stratified, risk-based). | [BRS] BR-024 | `QaSamplingService` |
| **BR-QA-002** | QA cases must be assigned based on expertise and workload balancing. | [BRS] BR-025 | `AssignQaReviewUseCase` |
| **BR-QA-003** | QA reports must be approved before finalization. | [BRS] BR-026 | Workflow Engine |
| **BR-QA-004** | Follow-up actions must be tracked to completion. | [BRS] BR-027 | `QualityAssuranceReview` Aggregate |
| **BR-QA-005** | QA review frequency is configurable (monthly, quarterly, etc.). | [BRS] BR-028 | `SampleAuditCasesForQaUseCase` |
| **BR-QA-006** | Sampling must be auditable: cryptographic seed and algorithm stored. | [GAP] | `QaSamplingService` |

---

## 10. Communication & Notice Rules (CM Cluster)

| ID | Rule | Source | Enforced By |
| :--- | :--- | :--- | :--- |
| **BR-CM-001** | All audit notices must follow approved MoR formats. | [BRS] BR-001 | DMS |
| **BR-CM-002** | Audit notices must be issued within a configurable period. | [BRS] BR-002 | Workflow Engine |
| **BR-CM-003** | Entry conferences must be held in designated interview rooms. | [BRS] BR-001 | `EntryConference` |
| **BR-CM-004** | Meeting invitations must be sent at least X days before proposed date (configurable). | [BRS] BR-002 | Notification Engine |
| **BR-CM-005** | Taxpayer confirmation must be recorded before meeting is considered confirmed. | [BRS] BR-003 | `EntryConference` |
| **BR-CM-006** | All interview records must be approved by a team leader before sending to taxpayer. | [BRS] BR-004 | Workflow Engine |

---

## 11. Reporting & Finalization Rules (RF Cluster)

| ID | Rule | Source | Enforced By |
| :--- | :--- | :--- | :--- |
| **BR-RF-001** | Audit reports must pass through required approval levels. | [BRS] BR-001 | Workflow Engine |
| **BR-RF-002** | Taxpayers must be given a defined period to respond. | [BRS] BR-002 | Workflow Engine |
| **BR-RF-003** | Assessment notices must only be issued after approval of audit report. | [BRS] BR-001 | Workflow Engine |
| **BR-RF-004** | Taxpayers must be allowed to accept or object to audit findings. | [BRS] BR-002 | `TaxpayerResponse` |
| **BR-RF-005** | Objections must be submitted within the legally defined period. | [BRS] BR-003 | Workflow Engine |
| **BR-RF-006** | Assessment notice must calculate principal, penalties, and interest correctly. | [BRS] BR-001 | Ledger Engine |
| **BR-RF-007** | Taxpayer account must be adjusted upon assessment acceptance. | [BRS] BR-015 | Ledger Engine |
| **BR-RF-008** | Management reports are generated from event-stream (not live queries). (Rule 17) | [GAP] | Reporting Service |

---

## Summary: Rules by Cluster

| Cluster | Rule Count | Key Rules |
| :--- | :--- | :--- |
| **Cross-Cutting** | 9 | Audit Trail, Outbox, External Data Fallback, Source Tracking |
| **AP (Planning)** | 10 | Risk-Proposal Engine, Fan-in Gate, Override Semantics |
| **AP (Selection/Assignment)** | 10 | Routing (LOCAL vs FEDERAL), Source Tracking, Workload Limits |
| **EX** | 12 | Evidence Collection, Evidence Inheritance, CAAT |
| **TP** | 11 | Federal Routing, Reproducible Analysis, Arm's Length |
| **JA** | 8 | Federated Workspace, Multi-level Approval |
| **IA** | 7 | SLA Timer, Revision Cap, Scope Validation |
| **QA** | 6 | Auditable Sampling, Recommendation Tracking |
| **CM** | 6 | Alternative Delivery, Entry Conference |
| **RF** | 8 | Event-Sourced Reporting, Assessment Calculation |

