# Requirements Baseline

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document provides a condensed, structured mapping of all SoR (Module D) functional requirements (FR-04.0 to FR-04.10) to our 9 implementation clusters. It bridges the gap between the original 150+ pages of PDFs and our development backlog.

**Legend:**
- `[M]` = Mandatory (from SoR)
- `[G]` = Gap-fill requirement (introduced by our architecture)
- `[C]` = Cross-cutting / Shared (applies to multiple clusters)

---

## 1. Cluster AP — Audit Planning & Setup (Pawlos)

| BUC | FR Reference(s) | Requirement Summary | Implementation Artifact | Gap Fill |
| :--- | :--- | :--- | :--- | :--- |
| **TA-001** | FR-04.0-01 to FR-04.0-06 | Create, review, update, and approve annual audit plan. Includes iterative process with tactics, volumes, effort, and skills. Director review, business unit feedback, Senior Management approval. | `AnnualAuditPlan` Aggregate, `PlanAllocation` Entity, `RiskPoolQueryService` | [G] Replaced manual entry with Risk-Proposal Engine. Added 3-tier distribution (National → Region → Tax Center) and Fan-in Gate (Rule 16). |
| **TA-002** | FR-04.0-06, FR-04.1-01, FR-04.1-02, FR-04.1-03 | Cascade plan to case level. View risk-ranked cases. Intake referrals from internal/external stakeholders. | `CascadePlanToCasesUseCase`, `AuditReferral` Aggregate | [G] Cascade operates at Tax Center level. Queries Risk Engine per Tax Center allocation. |
| **TA-003** | FR-04.1-01, FR-04.1-04, FR-04.1-05 | Select and prioritize audit cases. Process owner assesses referrals, risk profiles, and attaches treatment plans. | `SelectAndPrioritizeCasesUseCase`, `TreatmentPlan` VO | [G] Added explicit `source` tracking (Rule 11) and random sampling feedback loop. |
| **TA-004** | FR-04.1-06 to FR-04.1-10 | Assign cases to auditors or committees. Standard delegation (Team Leader -> Auditor) vs Committee delegation. | `AssignmentService` (Internal), `AuditWorkLog` Entity | [G] Two distinct delegation paths (Standard vs Committee). |
| **TA-006** | FR-04.10.1-01 to FR-04.10.1-07 | Select and form Joint Audit Team. Committee reviews cases, assesses viability, forms team. | `JointAuditTeam`, `JointAuditCommittee` | [G] Picks up `FEDERAL_COMMITTEE` cases skipped by TA-004. |
| **TA-007** | FR-04.10.2-01 to FR-04.10.2-12 | Plan Joint Audit. Team reviews data, materiality, sampling, prepares plan for committee approval. | `JointAuditPlan` Aggregate | [G] Implements `AuditTypeSpecificPlanningPort` for JOINT type. |

---

## 2. Cluster EX — Execution: Desk & Comprehensive (Oliad)

| BUC | FR Reference(s) | Requirement Summary | Implementation Artifact | Gap Fill |
| :--- | :--- | :--- | :--- | :--- |
| **TA-005** | FR-04.2-01 to FR-04.2-12 | Plan individual audit case. Evaluate case, materiality, industry research, sampling, prepare plan for approval. | `ExAuditPlan` Aggregate | [G] Cluster-specific planning flow (not shared with TP/JA). |
| **TA-009** | FR-04.3-01 to FR-04.3-08 | Conduct Desk Audit. Gather evidence (internal/3rd-party), taxpayer uploads, BI analytics, draft report, team leader review, escalate to comprehensive if needed. | `DeskAuditDetail` VO, `ConductDeskAuditUseCase`, `EvidenceAggregationService` | [G] Desk audit evidence is **inherited** by Comprehensive Audit on escalation. |
| **TA-010** | FR-04.4-01 to FR-04.4-34 | Conduct Comprehensive Audit. CAAT eligibility, financial verification, query sheets, industry benchmarking, 3rd-party matching, sample testing, multi-level approval, multi-zone consolidation, management reports. | `ComprehensiveAuditDetail` VO, `CaatEnginePort` (Internal), `BenchmarkAnalyticsPort`, `ConsolidateMultiZoneAuditUseCase` | [G] Multi-zone consolidation for taxpayers operating across regions. CAAT is internal. |

---

## 3. Cluster TP — Transfer Pricing (Borifa)

| BUC | FR Reference(s) | Requirement Summary | Implementation Artifact | Gap Fill |
| :--- | :--- | :--- | :--- | :--- |
| **TA-012** | FR-04.5-01 to FR-04.5-08 | Initiate TP Audit. Risk-based selection, referral intake, detailed risk assessment, working hypothesis, planning meeting. | `TpRiskAssessment` Aggregate, `TpWorkingHypothesis` VO | [G] Federal routing only. `taxCenterCode = NULL`. Picked up by TP Review Committee. |
| **TA-013** | FR-04.5.1-01 to FR-04.5.1-07 | Plan TP Audit. Materiality, industry research, sampling, plan approval. | `TpAuditPlan` Aggregate, `TpMateriality` VO | [G] Implements `AuditTypeSpecificPlanningPort` for TP. |
| **TA-014** | FR-04.5.2-01 to FR-04.5.2-06 | Conduct TP Fieldwork. Information requests, taxpayer evidence, fact statement. | `TpFieldWorkData`, `TpFactStatement` (Versioned) | [G] Fact statement is versioned for auditability. |
| **TA-015** | FR-04.5.2-07 to FR-04.5.2-11 | Perform TP Analysis. Select TP method, research arm's length price/range, draft report. | `TpAnalysisResult` (Versioned), `TpArmLengthAnalysis` | [G] Analysis is **reproducible** (stores parameters + snapshots). Uses Internal Rule Engine. |
| **TA-016** | FR-04.5-20 to FR-04.5-38 | Prepare and Review TP Report. Exit conference, report approval, notice generation, undelivered handling, management reports. | `TpAuditReport`, `TpExitConference`, `AlternativeDeliveryWorkflow` | [G] Uses shared CM/RF infrastructure for notices and completion. |

---

## 4. Cluster JA — Joint Audit (Yoseph)

| BUC | FR Reference(s) | Requirement Summary | Implementation Artifact | Gap Fill |
| :--- | :--- | :--- | :--- | :--- |
| **TA-008** | FR-04.1-09 | Manage Audit Case Progress. Daily work logging, progress monitoring, auto-forward to investigation. | `AuditWorkLog` Entity, `AuditCaseProgress` | [C] Shared with AP and other clusters. |
| **TA-021** | FR-04.4 (Shared) | Execute Joint Audit. CAAT, assertions, query sheets, third-party matching, execution report. | `JointExecutionReport`, `JointAssertion` | [G] Federated workspace. Data isolated per authority. |
| **TA-022** | FR-04.7 (Shared) | Complete and Finalize Audit. Working papers, exit conference, assessment, closure. | Shared RF Completion Flow | [C] Reuses RF cluster for finalization. |

---

## 5. Cluster CM — Communication (Yoseph)

| BUC | FR Reference(s) | Requirement Summary | Implementation Artifact | Gap Fill |
| :--- | :--- | :--- | :--- | :--- |
| **TA-017** | FR-04.5-23 to FR-04.5-32 | Issue Audit Notices. Generate notices, dynamic variables, unique reference, delivery, undelivered tracking. | `AuditNotice`, `AlternativeDeliveryWorkflow` | [G] Alternative Delivery Workflow: Email → SMS → Mail → Affix → Newspaper. |
| **TA-019** | FR-04.2.1-01 to FR-04.2.1-05 | Conduct Entry Conference. Schedule, notify, capture results, upload audio, team leader approval. | `EntryConference` Aggregate | [C] Reuses DMS and Notification Engine. |
| **TA-020** | FR-04.1-09 | Manage Taxpayer Portal. Secure portal for notifications, document upload, communication. | Portal Frontend + `PortalCommunicationPort` | [C] Orchestration only. Portal team owns the actual UI. |

---

## 6. Cluster RF — Reporting & Finalization (Yoseph)

| BUC | FR Reference(s) | Requirement Summary | Implementation Artifact | Gap Fill |
| :--- | :--- | :--- | :--- | :--- |
| **TA-011** | FR-04.7-01 to FR-04.7-42 | Manage Reporting and Finalization. Working papers, exit conference, draft report, multi-level approval, assessment notice, taxpayer response, undelivered handling, history. | `AuditReport` Aggregate, `ExitConference`, `AssessmentNotice` | [G] Management reports are event-sourced (Rule 17). Not live-queried. |
| **TA-018** | FR-04.4-29 to FR-04.4-33 | Issue Assessment Notice. Final notice, taxpayer acceptance/objection, fraud referral. | `AssessmentNotice`, `AuditCase` closure | [G] Handles objection handoff to `case-management-service`. |

---

## 7. Cluster QA — Quality Assurance (Oliad)

| BUC | FR Reference(s) | Requirement Summary | Implementation Artifact | Gap Fill |
| :--- | :--- | :--- | :--- | :--- |
| **TA-023** | FR-04.9.2-01 to FR-04.9.2-13 | Conduct QA Review. Sample closed cases, assign, action plan, review, exit conference, follow-up, recommendation tracking. | `QualityAssuranceReview` Aggregate, `QaSamplingService` | [G] Auditable random sampling (cryptographic seed stored). |
| **TA-024** | FR-04.4-28 | Trigger Fraud Investigation. Escalate cases with fraud indicators to investigation team. | `FraudFlag`, `CaseManagementPort` | [G] Handoff to external `audit-service` fraud module. |

---

## 8. Cluster IA — Issue Audit (Borifa)

| BUC | FR Reference(s) | Requirement Summary | Implementation Artifact | Gap Fill |
| :--- | :--- | :--- | :--- | :--- |
| **TA-025** | FR-04.6-01 to FR-04.6-07 | Issue Audit Notice to Auditee. Select transactions/areas, gather evidence (internal/3rd-party/auditee), capture field visit findings, draft report, Team Leader review, Process Owner review, Director decision (Report/Fraud/Comprehensive). | `IssueAudit` Aggregate, `IssueAuditScope` VO, `IssueAuditReport` (Versioned) | [G] SLA Timer on `NOTICE_ISSUED` (Workflow Engine). Revision Cap (`maxRevisionCount`, default 3) with auto-escalation. |

---

## Summary: Gap-Fill Requirements by Cluster

| Cluster | Gap-Fill Requirements |
| :--- | :--- |
| **AP** | Risk-Proposal Engine, 3-Tier Hierarchy, Fan-in Gate (Rule 16), Override Semantics (Rule 15), Source Tracking (Rule 11) |
| **EX** | Evidence Inheritance (Desk → Comp), Multi-Zone Consolidation |
| **TP** | Federal Routing, Reproducible Analysis, Versioned Fact Statement |
| **JA** | Federal Routing, Federated Workspace |
| **CM** | Alternative Delivery Workflow |
| **RF** | Event-Sourced Reporting (Rule 17) |
| **QA** | Auditable Random Sampling |
| **IA** | SLA Timer, Revision Cap |

