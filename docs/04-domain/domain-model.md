# Domain Model

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document provides a high-level overview of the domain model for the ITAS Tax Audit & Investigation Management System. It defines the key aggregates, entities, value objects, and their relationships.

---

## 1. Domain Model Overview

The domain model consists of the following key aggregates:

1. **AnnualAuditPlan** - The yearly audit strategy with hierarchical PlanAllocation items.
2. **AuditCase** - The central case file for a taxpayer audit. Created by AP, consumed by all clusters.
3. **AuditReferral** - Requests for audit from internal/external stakeholders.
4. **ExAuditPlan** - The audit plan aggregate for Desk and Comprehensive execution (TA-005).
5. **IssueAudit** - Targeted investigation within an existing case (SLA timer, revision cap).
6. **JointAudit** - Cross-authority audit collaboration (federated workspace).
7. **TpRiskAssessment** - Detailed risk assessment for transfer pricing cases.
8. **TpAnalysisResult** - Reproducible TP analysis with versioning.
9. **TpAuditReport** - Versioned TP audit report.
10. **AuditReport** - Final audit report for any audit type.
11. **QualityAssuranceReview** - Post-completion review of closed cases.

---

## 2. Key Relationships

| Relationship | Type | Description |
| :--- | :--- | :--- |
| AnnualAuditPlan → AuditCase | One-to-Many | A plan generates many cases. |
| AuditCase → ExAuditPlan | One-to-One | A Desk/Comp case has one plan. |
| AuditCase → DeskAuditDetail | One-to-One | A Desk audit has one detail record. |
| AuditCase → ComprehensiveAuditDetail | One-to-One | A Comprehensive audit has one detail record. |
| AuditCase → IssueAudit | One-to-One | A case can have one Issue Audit. |
| AuditCase → JointAudit | One-to-One | A case can have one Joint Audit. |
| AuditCase → TpRiskAssessment | One-to-One | A TP case has one risk assessment. |
| AuditCase → TpAnalysisResult | One-to-One | A TP case has one analysis result. |
| IssueAudit → IssueAuditScope | One-to-Many | An Issue Audit has multiple scope items. |
| AnnualAuditPlan → PlanAllocation | One-to-Many | A plan has multiple allocations. |

---

## 3. Aggregate Roots

| Aggregate | Cluster | Description | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **AnnualAuditPlan** | AP | The yearly strategy for audit selection. Contains PlanAllocation tree. | Generate proposal, route approvals, enforce Fan-in Gate (Rule 16). |
| **AuditCase** | AP | The central case file for a taxpayer audit. Created by cascade, consumed by all clusters. | Track assignment, status, source, routing (Rule 11). |
| **AuditReferral** | AP | Requests for audit from internal/external stakeholders. | Triage, accept/decline, resolve to case. |
| **ExAuditPlan** | EX | The execution plan for Desk and Comprehensive audits. | Document materiality, scope, and sampling. |
| **TpRiskAssessment** | TP | Detailed risk assessment for transfer pricing cases. | Evaluate TP risk indicators, generate risk level. |
| **TpAnalysisResult** | TP | Reproducible TP analysis with versioning. | Document method selection, comparables, arm's length range. |
| **TpAuditReport** | TP | Versioned TP audit report. | Track approvals, revisions, finalization. |
| **IssueAudit** | IA | Targeted investigation within an existing case. | Manage SLA timer, revision cap, director decision. |
| **JointAudit** | JA | Cross-authority audit collaboration. | Federated workspace, team formation, consolidated reporting. |
| **AuditReport** | RF | Final audit report for any audit type. | Multi-level approval, assessment notice generation. |
| **QualityAssuranceReview** | QA | Post-completion review of closed cases. | Sampling, recommendation tracking, follow-up verification. |

---

## 4. Value Objects

| Value Object | Used In | Description |
| :--- | :--- | :--- |
| **TreatmentPlan** | AuditCase | The audit type and recommended actions for a case. |
| **AuditSamplingConfiguration** | AuditPlan, TpAuditPlan | Configurable sampling method and parameters. |
| **PlanAllocation** | AnnualAuditPlan | Hierarchical distribution of audit targets (National/Region/Tax Center). |
| **DeskAuditDetail** | AuditCase | Desk audit-specific data: evidence, analytics, draft report. |
| **ComprehensiveAuditDetail** | AuditCase | Comprehensive audit-specific data: CAAT, assertions, benchmarks. |
| **IssueAuditScope** | IssueAudit | Selected transactions/areas for investigation (scopeItemId). |
| **FieldVisitFinding** | IssueAudit | Findings captured during field visit. |
| **TpWorkingHypothesis** | TpRiskAssessment | Initial documented theory of TP issue with revenue at risk. |
| **TpFactStatement** | TpFieldWorkData | Versioned fact statement for TP audit. |
| **TpArmLengthAnalysis** | TpAnalysisResult | Arm's length price/profit range determination. |

---

## 5. Shared Kernel (Cross-Cutting)

| Component | Description | Purpose |
| :--- | :--- | :--- |
| **AuditTrailEntry** | Immutable record of every state-changing action. | Auditability, legal compliance, 7-year retention. |
| **DomainEvent** | Business event emitted by aggregates. | Event-driven communication to downstream consumers. |
| **SourceType** | Enum: RISK_ENGINE, RANDOM_SAMPLE, INTERNAL_REFERRAL, EXTERNAL_REFERRAL, MANUAL_SELECTION | Explicit source tracking (Rule 11). |
| **AssignmentRouting** | Enum: STANDARD_DELEGATION, COMMITTEE_DELEGATION | Determines assignment path. |
| **AuditType** | Enum: DESK, COMPREHENSIVE, TP, JOINT, ISSUE | Discriminator for audit type. |
| **CaseStatus** | Enum: CREATED, SELECTED_FOR_AUDIT, ASSIGNED, IN_PROGRESS, COMPLETED, CLOSED | Case lifecycle. |

---

## 6. Domain Event Summary

| Event | Emitted By | Key Payload |
| :--- | :--- | :--- |
| `AnnualAuditPlanFinalized` | AnnualAuditPlan | planId, year, caseCount |
| `AuditCaseCreated` | AuditCase | caseId, tin, auditType, source |
| `AuditCaseAssigned` | AuditCase | caseId, auditorId, teamLeaderId |
| `DeskAuditEscalated` | DeskAuditDetail | caseId, reason, evidenceList |
| `ComprehensiveAuditStarted` | ComprehensiveAuditDetail | caseId, caatEligible |
| `TPAnalysisCompleted` | TpAnalysisResult | caseId, method, armsLengthPrice |
| `JointAuditTeamFormed` | JointAudit | caseId, teamMembers |
| `IssueAuditNoticeIssued` | IssueAudit | caseId, noticeId, deadline |
| `IssueAuditAutoEscalated` | IssueAudit | caseId, level, revisionCount |
| `FraudEscalatedFromIssueAudit` | IssueAudit | caseId, indicators, directorId |
| `AssessmentNoticeIssued` | AuditReport | caseId, noticeId, amount |
| `AuditCaseClosed` | AuditCase | caseId, closureType |

