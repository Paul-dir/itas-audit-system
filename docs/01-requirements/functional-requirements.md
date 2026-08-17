# Functional Requirements (Consolidated by Cluster)

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document groups the SoR requirements by our 9 clusters, making it easy for each developer to see exactly what they need to implement without reading the entire 150-page PDF.

> **Legend:**
> - `[M]` = Mandatory (from SoR)
> - `[G]` = Gap-fill requirement (introduced by our architecture)
> - `[C]` = Cross-cutting / Shared (applies to multiple clusters)

---

## 1. Cluster AP — Audit Planning & Setup (Pawlos)

### 1.1 Annual Plan Creation & Approval (TA-001)

| ID | Requirement | Source | Implementation |
| :--- | :--- | :--- | :--- |
| FR-04.0-01 | System shall enable audit team to create, review, update audit plan and submit to audit director. | SoR | `AnnualAuditPlan` Aggregate |
| **FR-04.0-01 [G]** | System shall **not** allow manual entry of raw numbers. Must generate a **Plan Proposal** using Risk Engine (Heatmap) + internal capacity service. | Gap Fill | `RiskPoolQueryService` |
| FR-04.0-02 | System shall enable director to review/approve; on approval, notify business units for feedback. | SoR | Internal Workflow Engine |
| FR-04.0-03 | System shall enable business units to review and provide feedback. | SoR | `PlanAllocation.local_adjusted_count` |
| FR-04.0-04 | System shall enable director to review feedback, amend, finalize; track versions. | SoR | Version history + Override semantics (Rule 15) |
| FR-04.0-05 | System shall send plan to Senior Management; on approval, notify all stakeholders. | SoR | Workflow Engine + Notification Engine |
| **FR-04.0-05 [G]** | Plan shall only reach `FINALIZED` after **every Tax Center** confirms deployment (Rule 16). | Gap Fill | Fan-in Gate enforcement |

### 1.2 Cascade & Case Selection (TA-002, TA-003)

| ID | Requirement | Source | Implementation |
| :--- | :--- | :--- | :--- |
| FR-04.0-06 | System shall allow cascading plans to case levels. | SoR | `CascadePlanToCasesUseCase` |
| **FR-04.0-06 [G]** | Cascade shall query Risk Engine per **Tax Center** allocation. Federal TP/JA allocations skip Tax Center cascade. | Gap Fill | Risk Engine scoped query |
| FR-04.1-01 | System shall show cases by risk ranking, branch, segment, audit type; support random selection. | SoR | `RiskEnginePort.getTopTinsByTaxCenter` |
| FR-04.1-02 | Other directorates can flag auditable cases. | SoR | `AuditReferral` with `source = INTERNAL_REFERRAL` |
| FR-04.1-03 | External stakeholders can request audits. | SoR | `AuditReferral` with `source = EXTERNAL_REFERRAL` |
| FR-04.1-04 | Process owner assesses referrals; risk profiling includes third-party matching, under-reporting, forensic modeling. | SoR | `RiskProfilingService` |
| FR-04.1-05 | Load cases and attach treatment plans. | SoR | `TreatmentPlan` Value Object |

### 1.3 Assignment (TA-004)

| ID | Requirement | Source | Implementation |
| :--- | :--- | :--- | :--- |
| FR-04.1-06 | Process Owner or Tax Center Manager assigns to Team Leader. Team Leader assigns to Auditor. | SoR | `StandardDelegationService` |
| **FR-04.1-06 [G]** | For TP and Joint Audits, Process Owner assigns directly to the respective Committee. | Gap Fill | `CommitteeDelegationService` |
| FR-04.1-07 | Enable re-allocation with approval. | SoR | `ReassignCaseUseCase` |
| FR-04.1-08 | Case number generation; workflow steps; electronic dossier. | SoR | `AuditCase` Aggregate |
| FR-04.1-09 | Daily work logging; progress reporting; auto-forward to investigation. | SoR | `AuditWorkLog` Entity |
| FR-04.1-10 | Configurable allocation rules; supports dynamic/large teams. | SoR | `AssignmentService` + Rule Engine |

---

## 2. Cluster EX — Execution: Desk & Comprehensive (Oliad)

### 2.0 Case Planning (TA-005)

| ID | Requirement | Source | Implementation |
| :--- | :--- | :--- | :--- |
| FR-04.2-01 to FR-04.2-12 | Evaluate case, materiality, industry research, sampling, plan submission. | SoR | `ExAuditPlan` Aggregate |

### 2.1 Desk Audit (TA-009)

| ID | Requirement | Source | Implementation |
| :--- | :--- | :--- | :--- |
| FR-04.3-01 | Gather evidence from internal and third-party sources. | SoR | `EvidenceAggregationService` |
| FR-04.3-02 | Taxpayer uploads supporting documents. | SoR | `DmsPort` |
| FR-04.3-03 | Perform data analytics using BI tools. | SoR | `DataAnalyticsPort` |
| FR-04.3-04 | Conduct desk audit using internal data, taxpayer history, third-party data, uploaded docs. | SoR | `ConductDeskAuditUseCase` |
| FR-04.3-05 | Prepare draft report; submit to team leader. | SoR | `DeskAuditReport` VO |
| FR-04.3-06 | Team leader reviews; escalates big issues to comprehensive. | SoR | `EscalateToComprehensiveUseCase` |
| FR-04.3-07 | Update taxpayer risk profile on big issues. | SoR | `RiskEnginePort.updateProfile` |
| FR-04.3-08 | Director decides on comprehensive escalation. | SoR | `DecideComprehensiveEscalationUseCase` |
| **FR-04.3-08 [G]** | Comprehensive Audit **inherits** all evidence and findings from the Desk Audit. No re-collection. | Gap Fill | Evidence inheritance logic |

### 2.2 Comprehensive Audit (TA-010)

| ID | Requirement | Source | Implementation |
| :--- | :--- | :--- | :--- |
| FR-04.4-01 | Assess CAAT eligibility. | SoR | Internal Rule Engine |
| FR-04.4-02 | Perform computer-assisted audit. | SoR | `CaatEnginePort` (Internal) |
| FR-04.4-03 | Audit assertion/verification (BS, IS, Cash Flow, Equity). | SoR | `ComprehensiveAuditDetail` VO |
| FR-04.4-04 to FR-04.4-05 | Request additional documents; send query sheets. | SoR | `QuerySheet` Entity + Notification |
| FR-04.4-06 to FR-04.4-07 | Industry benchmarking; third-party data matching. | SoR | `BenchmarkAnalyticsPort` |
| FR-04.4-08 to FR-04.4-09 | Balance sheet/revenue testing; dispose queries. | SoR | `TestingResult` VO |
| FR-04.4-10 | Submit execution report; draft report after approval. | SoR | `SubmitExecutionReportUseCase` |
| FR-04.4-11 to FR-04.4-16 | IFRS compliance, audit trail, sampling. | SoR | `AccountingComplianceAssessment`, `SampleSelection` |
| FR-04.4-17 | Remote access to taxpayer ledgers. | SoR | `RemoteWorkbenchPort` |
| FR-04.4-18 to FR-04.4-30 | Multi-level approval, send to taxpayer, alerts, printing, undelivered, e-signature, assessment notice. | SoR | Workflow + DMS + Notification |
| FR-04.4-31 to FR-04.4-33 | Multi-zone consolidation. | SoR | `ConsolidateMultiZoneAuditUseCase` |
| FR-04.4-34 | Management reports. | SoR | Event-sourced projections (RF Cluster) |

---

## 3. Cluster TP — Transfer Pricing (Borifa)

| BUC | ID | Requirement | Implementation |
| :--- | :--- | :--- | :--- |
| TA-012 | FR-04.5-01 to FR-04.5-08 | Risk-based selection, referral intake, risk assessment, planning meeting. | `TpRiskAssessment`, `TpWorkingHypothesis` |
| **TA-012 [G]** | Federal routing. `taxCenterCode = NULL`. Picked up by TP Review Committee. | Routing filter |
| TA-013 | FR-04.5.1-01 to FR-04.5.1-07 | Materiality, industry research, sampling, plan approval. | `TpAuditPlan`, `TpMateriality` |
| TA-014 | FR-04.5.2-01 to FR-04.5.2-06 | Fieldwork, fact statement. | `TpFieldWorkData`, `TpFactStatement` (Versioned) |
| TA-015 | FR-04.5.2-07 to FR-04.5.2-11 | TP methods, arm's length analysis, draft report. | `TpAnalysisResult` (Reproducible) |
| TA-016 | FR-04.5-20 to FR-04.5-38 | Report drafting, exit conference, notice generation, undelivered handling. | `TpAuditReport`, `AlternativeDeliveryWorkflow` |

---

## 4. Cluster JA — Joint Audit (Yoseph)

| BUC | ID | Requirement | Implementation |
| :--- | :--- | :--- | :--- |
| TA-008 | FR-04.1-09 | Manage Audit Case Progress. | `AuditWorkLog` |
| TA-006 | FR-04.10.1-01 to FR-04.10.1-07 | Committee review, team formation, risk assessment. | `JointAuditTeam`, `JointAuditCommittee` |
| **TA-006 [G]** | Federal routing. Picked up by Joint Audit Committee. | Routing filter |
| TA-007 | FR-04.10.2-01 to FR-04.10.2-12 | Planning, materiality, sampling, fraud escalation. | `JointAuditPlan` |
| TA-021 | FR-04.4 (Shared) | CAAT, assertions, query sheets, execution report. | `JointExecutionReport` |
| TA-022 | FR-04.7 (Shared) | Working papers, exit conference, assessment, closure. | Shared RF Flow |

---

## 5. Cluster CM — Communication (Yoseph)

| BUC | ID | Requirement | Implementation |
| :--- | :--- | :--- | :--- |
| TA-017 | FR-04.5-23 to FR-04.5-32 | Notice generation, delivery, undelivered tracking. | `AuditNotice`, `AlternativeDeliveryWorkflow` |
| **TA-017 [G]** | Alternative Delivery: Email → SMS → Mail → Affix → Newspaper. | Workflow Engine |
| TA-019 | FR-04.2.1-01 to FR-04.2.1-05 | Entry conference scheduling, recording, approval. | `EntryConference` |
| TA-020 | FR-04.1-09 | Taxpayer portal for notifications, document upload. | Portal Frontend + `PortalCommunicationPort` |

---

## 6. Cluster RF — Reporting & Finalization (Yoseph)

| BUC | ID | Requirement | Implementation |
| :--- | :--- | :--- | :--- |
| TA-011 | FR-04.7-01 to FR-04.7-42 | Working papers, exit conference, draft report, assessment notice, taxpayer response, history. | `AuditReport`, `ExitConference`, `AssessmentNotice` |
| **TA-011 [G]** | Management reports are event-sourced (Rule 17). | Event-sourced projections |
| TA-018 | FR-04.4-29 to FR-04.4-33 | Assessment notice, taxpayer acceptance/objection, fraud referral. | `AssessmentNotice`, `AuditCase` closure |

---

## 7. Cluster QA — Quality Assurance (Oliad)

| BUC | ID | Requirement | Implementation |
| :--- | :--- | :--- | :--- |
| TA-023 | FR-04.9.2-01 to FR-04.9.2-13 | Sampling, assignment, action plan, review, exit conference, follow-up. | `QualityAssuranceReview`, `QaSamplingService` |
| **TA-023 [G]** | Auditable random sampling with cryptographic seed. | Seed stored for reproducibility |
| TA-024 | FR-04.4-28 | Fraud flagging and handoff. | `FraudFlag` + `CaseManagementPort` |

---

## 8. Cluster IA — Issue Audit (Borifa)

| BUC | ID | Requirement | Implementation |
| :--- | :--- | :--- | :--- |
| TA-025 | FR-04.6-01 | Notify auditee. | `IssueAuditNotice` + DMS |
| TA-025 | FR-04.6-02 | Select transactions/areas. | `IssueAuditScope` VO |
| TA-025 | FR-04.6-03 | Gather evidence; enable auditee upload. | `EvidenceAggregationService` + DMS |
| TA-025 | FR-04.6-04 | Capture field visit findings. | `FieldVisitFinding` VO |
| TA-025 | FR-04.6-05 | Draft report; team leader review. | `IssueAuditReport` (Versioned) |
| TA-025 | FR-04.6-06 | Process owner review. | Workflow Engine |
| TA-025 | FR-04.6-07 | Director review; Report/Fraud/Comprehensive. | `DirectorReviewDecision` |
| **TA-025 [G]** | SLA Timer on `NOTICE_ISSUED`. Auto-advance on expiry. | Workflow Engine timer |
| **TA-025 [G]** | Revision Cap (`maxRevisionCount`, default 3). Auto-escalate to Director. | `IssueAuditEscalationService` |

