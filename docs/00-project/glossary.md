# Glossary of Terms

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This is the **single source of truth** for all terminology used across the 9 clusters. It ensures all developers (Pawlos, Yoseph, Oliad, Borifa) and AI agents speak the same language.

---

## 1. Organizational Hierarchy

| Term | Definition | Used By |
| :--- | :--- | :--- |
| **National (Level 1)** | The top-tier authority. Defines strategy and approves the final Annual Audit Plan. | AP Cluster |
| **Region (Level 2)** | Intermediate oversight. Distributes national allocations to Tax Centers. | AP Cluster |
| **Tax Center (Level 3)** | The physical/local office where auditors are located. The default execution unit for Desk, Comprehensive, and Issue audits. | AP, EX, IA, QA |
| **Federal Level** | Special designation for Transfer Pricing and Joint Audits. Not tied to a specific Tax Center. Cases have `taxCenterCode = NULL`. | TP, JA Clusters |

---

## 2. Audit Types (The 5 Types)

| Term | Definition | Routing | Primary Cluster |
| :--- | :--- | :--- | :--- |
| **Desk Audit** | Remote, evidence-based audit using internal data, third-party sources, and taxpayer uploads. | `LOCAL` | EX |
| **Comprehensive Audit** | In-depth audit with CAAT, financial verification, and multi-zone consolidation. | `LOCAL` | EX |
| **Transfer Pricing (TP) Audit** | Audit of cross-border transactions between related parties. Requires specialized federal auditors. | `FEDERAL_COMMITTEE` | TP |
| **Joint Audit (JA)** | Audit involving multiple tax authorities (domestic or international). Requires a federated workspace. | `FEDERAL_COMMITTEE` | JA |
| **Issue Audit** | Targeted investigation on a specific issue or tax type within an existing case. | `LOCAL` | IA |

---

## 3. Assignment Routing
| Term | Definition | Applies To |
| :--- | :--- | :--- |
| **Standard Delegation** | Process Owner or Tax Center Manager assigns to Team Leader. Team Leader assigns to Auditor. | Desk, Comprehensive, Issue |
| **Committee Delegation** | Process Owner assigns to Joint Committee / TP Committee. Committee appoints Team Leader & assigns case. | TP, Joint Audit |

---

## 4. Planning & Allocation (AP Cluster)

| Term | Definition |
| :--- | :--- |
| **Annual Audit Plan** | Aggregate root for the yearly strategy. Contains a tree of `PlanAllocation` items. Statuses: DRAFT, PROPOSAL_GENERATED, REGIONAL_FEEDBACK, TAX_CENTER_FEEDBACK, SENIOR_MGMT_REVIEW, FINALIZED. |
| **Plan Allocation** | Hierarchical entity at National, Region, or Tax Center level. Fields: `proposed_count`, `local_adjusted_count`, `regional_override_count`, `national_override_count`. |
| **Plan Proposal** | System-generated initial distribution from the `RiskPoolQueryService` (Risk Heatmap + Auditor Capacity). |
| **Risk-Proposal Engine** | Internal domain service that replaces manual number entry. Generates a proposal based on Risk Engine heatmap and internal capacity. |
| **Override (Rule 15)** | When a higher authority forces a change. The original value is **never overwritten**. Stores: `originalValue`, `overriddenBy`, `overriddenAt`, `overrideReason`. |
| **Fan-in Gate (Rule 16)** | The Annual Audit Plan only reaches `FINALIZED` when every Tax Center confirms deployment. |

---

## 5. Case Management (Across All Clusters)

| Term | Definition |
| :--- | :--- |
| **Audit Case** | Central aggregate root for a taxpayer audit. Fields: `tin`, `auditType`, `source`, `status`. |
| **Source (Rule 11)** | Explicit enum on `AuditCase` indicating how it was created: `RISK_ENGINE`, `RANDOM_SAMPLE`, `INTERNAL_REFERRAL`, `EXTERNAL_REFERRAL`, `MANUAL_SELECTION`. Never inferred. |
| **Treatment Plan (VO)** | Attached during TA-003. Determines the audit type. Travels unchanged to QA (TA-023). |
| **Case Status** | Lifecycle: CREATED → SELECTED_FOR_AUDIT → ASSIGNED → IN_PROGRESS → COMPLETED → CLOSED. |

---

## 6. Execution Concepts (EX, TP, JA, IA Clusters)

| Term | Definition | Owned By |
| :--- | :--- | :--- |
| **Desk Audit Detail (VO)** | Evidence lists, BI analytics, draft report ID. | EX |
| **Comprehensive Audit Detail (VO)** | CAAT eligibility, third-party matches, multi-zone consolidation. | EX |
| **Multi-Zone Consolidation** | When a taxpayer operates across multiple zones, findings are consolidated into a single report (FR-04.4-31 to 33). | EX |
| **TP Risk Assessment (Aggregate)** | Detailed risk assessment for transfer pricing cases. | TP |
| **TP Analysis Result** | Reproducible TP analysis with versioning (stores parameters + data snapshots). | TP |
| **Joint Audit Workspace (Aggregate)** | Federated workspace for multiple tax authorities. Data is isolated per authority. | JA |
| **Issue Audit (Aggregate)** | Targeted investigation with SLA timer and revision cap (`maxRevisionCount` default = 3). | IA |
| **Issue Audit Scope (VO)** | Selected transactions/areas for investigation. Auditee uploads must reference a `scopeItemId`. | IA |

---

## 7. Communication & Reporting (CM, RF Clusters)

| Term | Definition | Owned By |
| :--- | :--- | :--- |
| **Audit Notice** | Formal communication to taxpayer. Generated by DMS. | CM |
| **Alternative Delivery Workflow** | Email → SMS → Physical Mail → Affix to Premises → Newspaper Publication. | CM |
| **Entry Conference** | Initial meeting with taxpayer. | CM |
| **Exit Conference** | Final meeting with taxpayer before report finalization. | RF |
| **Assessment Notice** | Final legal notice of tax adjustment (principal, penalties, interest). | RF |
| **Management Reports** | Event-sourced projections (Audit Yield, Productivity, KPIs). Not live-queried (Rule 17). | RF |

---

## 8. Quality Assurance (QA Cluster)

| Term | Definition |
| :--- | :--- |
| **QA Review** | Second-pass review of closed audit cases. |
| **QA Sampling Service** | Uses auditable cryptographic random sampling (seed and algorithm stored). |
| **QA Recommendations** | Follow-up actions tracked to completion. |

---

## 9. Shared Infrastructure (Internal Engines)

| Term | Definition | Technology | Phase 1 |
| :--- | :--- | :--- | :--- |
| **Workflow Engine** | Approval chains, SLA timers, state transitions. | Spring State Machine | In-Memory Mock |
| **Rule Engine** | Configurable business rules (CAAT, TP methods, revision caps). | EasyRules / Drools | In-Memory Mock |
| **Notification Engine** | Email, SMS, Portal notifications. | Spring Mail + Async | In-Memory Mock |
| **DMS** | File storage, PDF generation, notice rendering. | Spring Content + iText | In-Memory Mock |
| **Ledger Engine** | Append-only accounting journal. | Plain JPA | In-Memory Mock |
| **Audit Trail** | Immutable log of all actions. 7-year retention. | JPA + Flyway | Shared Table |
| **Outbox** | Transactional outbox for reliable event publishing. | JPA + Kafka | Shared Table |

---

## 10. External Integrations

| Term | Definition | Purpose | Phase 1 |
| :--- | :--- | :--- | :--- |
| **Risk Engine** | External REST API. | Heatmap, TIN lists, single scores, random samples. | Mock Client |
| **Registration Service** | External REST API. | Taxpayer TIN, profile, organization hierarchy. | Mock Client |

---

## 11. Database Table Prefixes

| Prefix | Cluster | Owner |
| :--- | :--- | :--- |
| `ap_` | Audit Planning & Setup | Pawlos |
| `ex_` | Execution (Desk & Comprehensive) | Oliad |
| `tp_` | Transfer Pricing | Borifa |
| `ja_` | Joint Audit | Yoseph |
| `cm_` | Communication | Yoseph |
| `rf_` | Reporting & Finalization | Yoseph |
| `qa_` | Quality Assurance | Oliad |
| `ia_` | Issue Audit | Borifa |
| `shared_` | Shared Infrastructure | Shared (Pawlos leads) |

---

## 12. Domain Events (All Clusters)

| Event | Emitted By | Consumers |
| :--- | :--- | :--- |
| `AnnualAuditPlanCreated` | AP | Reporting Service |
| `AnnualAuditPlanApproved` | AP | Notification Engine |
| `AnnualAuditPlanFinalized` | AP | Reporting, Risk Engine (feedback) |
| `AuditCaseCreated` | AP | Risk Engine, Notification, CM |
| `AuditCaseAssigned` | AP | Notification, EX, TP, JA |
| `AuditCaseClosed` | RF | Reporting Service |
| `DeskAuditEscalated` | EX | Workflow Engine |
| `ComprehensiveAuditStarted` | EX | Observability |
| `TPAuditInitiated` | TP | Notification Engine |
| `TPAnalysisCompleted` | TP | Workflow Engine |
| `JointAuditTeamFormed` | JA | Notification Engine |
| `JointAuditCompleted` | JA | Reporting Service |
| `IssueAuditNoticeIssued` | IA | Workflow Engine (SLA) |
| `IssueAuditAutoEscalated` | IA | Workflow Engine, Notification |
| `FraudEscalatedFromIssueAudit` | IA | Audit Service |
| `QAReviewCompleted` | QA | Reporting Service |
| `AssessmentNoticeIssued` | RF | Ledger Engine, Notification |
| `ObjectionRaised` | RF | Case Management Service |

