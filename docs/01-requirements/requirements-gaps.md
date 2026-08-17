# Requirements Gaps & Design Decisions

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document catalogs every instance where the implemented system diverges from the original Source of Requirements (SoR) or Business Requirements Specification (BRS).

**Purpose:** To provide a clear, auditable trail of design decisions so that developers, business stakeholders, and future maintainers understand *why* the system behaves the way it does.

---

## Gap 1: Manual Plan Entry vs. Risk-Proposal Engine

| Attribute | Detail |
| :--- | :--- |
| **Source** | FR-04.0-01 (SoR) & BUC-TA-001 Normal Flow |
| **Original Requirement** | "Audit Team creates a plan, enters case counts per audit type... System shows total effort vs. available staff capacity." |
| **Identified Gap** | The requirement assumes the Audit Team invents the numbers. In reality, the Audit Team does not know the full national risk landscape. The Risk Engine does. |
| **Implemented Decision** | The system implements a **Risk-Proposal Engine** (internal domain service). The Audit Team clicks **"Generate Proposal"**. The system queries the Risk Engine for aggregated risk heatmaps (per Region, per Tax Center, per Audit Type) and the internal Auditor Capacity Service. The Audit Team **reviews and adjusts** the proposal (they do not start from zero). |
| **Impact** | TA-001 Normal Flow is replaced. Adds pre-requisite services: `RiskPoolQueryService` + `AuditorCapacityService`. |

---

## Gap 2: Missing 3-Tier Hierarchy (National → Region → Tax Center)

| Attribute | Detail |
| :--- | :--- |
| **Source** | FR-04.0-02, FR-04.0-03, FR-04.0-04 (SoR) |
| **Original Requirement** | "System shall enable the audit director to review... System shall notify the business units/branches/regions... System shall enable the business units/branches/regions to review..." |
| **Identified Gap** | The SoR mentions "regions" but does not define a specific hierarchy. It does not mention Tax Centers at all. In reality, the Tax Center is the fundamental execution unit. |
| **Implemented Decision** | We implement a strict **3-tier hierarchy**: National → Region → Tax Center. AP Cluster contains a tree of `PlanAllocation` entities at all three levels. Tax Centers submit local responses → Regions consolidate → National overrides. **Fan-in Gate (Rule 16):** Plan only reaches `FINALIZED` when every Tax Center confirms deployment. |
| **Impact** | Adds `PlanAllocation` entity. Impacts TA-001, TA-002, TA-007. Execution clusters read `taxCenterCode` but do not perform distribution. |

---

## Gap 3: Federal-Level Audit Types (TP & JA) - No Tax Center

| Attribute | Detail |
| :--- | :--- |
| **Source** | FR-04.5, FR-04.10 (SoR) & BUC-TA-012, TA-006 |
| **Original Requirement** | "Transfer Pricing Audit... Joint Audit..." |
| **Identified Gap** | The SoR treats TP and Joint Audits as "audit types" but does not specify their physical/administrative location. In reality, TP and Joint Audits are **Federal-level** functions. |
| **Implemented Decision** | For TP and JA, `AuditCase.taxCenterCode` is set to `NULL`. `assignmentRouting = 'FEDERAL_COMMITTEE'`. TA-004 **explicitly skips** these cases. They are picked up by the TP Review Committee (TA-012) or Joint Audit Committee (TA-006). |
| **Impact** | Impacts TA-002 (Cascade skips Tax Center granularity for TP/JA), TA-004 (Assignment logic filters by routing). Documented in Glossary. |

---

## Gap 4: Risk Engine Granularity (Not Just Aggregates)

| Attribute | Detail |
| :--- | :--- |
| **Source** | FR-04.1-01, FR-04.1-04 (SoR) |
| **Original Requirement** | "System shall enable the audit team to view audit cases selected on risk bases... by order of risk ranking..." |
| **Identified Gap** | The SoR implies the Risk Engine returns a static list of cases. In reality, the Risk Engine must support multiple query types at different stages. |
| **Implemented Decision** | We define the Risk Engine as a **granular** service with four explicit query contracts: (1) Aggregated Heatmap (TA-001), (2) Scoped TIN List (TA-002), (3) Single TIN Score (TA-005, TA-009, TA-015, TA-025), (4) Random Sample (TA-003 AF5). |
| **Impact** | Adds formal `RiskEnginePort` with four distinct methods. Impacts AP, EX, TP, JA, IA clusters. |

---

## Gap 5: External Engines vs. Internal Engines (Mock-First Strategy)

| Attribute | Detail |
| :--- | :--- |
| **Source** | Non-Functional / Architecture (Assessment Document) |
| **Original Requirement** | Original assessment assumed Risk Engine, Rule Engine, Workflow Engine, etc., were all separate microservices. |
| **Identified Gap** | Distributed microservices would introduce network latency, transaction complexity (Saga patterns), and significant development overhead for a greenfield project. |
| **Implemented Decision** | Rule Engine, Workflow Engine, Notification Engine, DMS, and Ledger are moved **inside** `bs-taxaudit-core-server` as internal libraries/modules. **Phase 1:** All internal engines and external clients (Risk, Registration) are **in-memory mocks**. **Phase 2:** Real implementations replace mocks via Spring Profiles. |
| **Impact** | Simplifies architecture drastically. Enables ACID transactions. Reduces AI/developer cognitive load (one codebase). Enables parallel development. |

---

## Gap 6: Undelivered Notice Handling (Alternative Delivery)

| Attribute | Detail |
| :--- | :--- |
| **Source** | FR-04.7-29 (SoR) |
| **Original Requirement** | "System shall facilitate recording the data on audit notices which have been returned as undelivered and trigger alternative outreach measures such as sending by post, affixing the notices in the premises of the taxpayer, publishing in the newspapers." |
| **Identified Gap** | The SoR lists "alternative outreach measures" but does not define them as a formal workflow with SLAs. |
| **Implemented Decision** | We define the **`AlternativeDeliveryWorkflow`**: Email → SMS → Physical Mail → Affix to Premises → Newspaper Publication. Each step has a configurable SLA timer managed by the Workflow Engine. |
| **Impact** | Impacts TA-017 (Notices) and TA-018 (Assessment). Adds `AlternativeDelivery` entity. |

---

## Gap 7: QA Sampling Randomness (Auditable Randomness)

| Attribute | Detail |
| :--- | :--- |
| **Source** | FR-04.9.2-01 (SoR) |
| **Original Requirement** | "System shall periodically select audit cases completed for quality assurance purpose. The appropriate sampling method/s is/are expected to be configured." |
| **Identified Gap** | A naive `ORDER BY RANDOM()` is not auditable—you cannot prove randomness was not tampered with. |
| **Implemented Decision** | We implement a **`QaSamplingService`** that uses a cryptographic random seed (e.g., `SecureRandom` with a seed derived from the current date and a secret key). The seed and algorithm are stored alongside the selected cases for reproduction and audit. |
| **Impact** | Impacts TA-023. Adds `sampling_seed` and `sampling_algorithm` to `QualityAssuranceReview` aggregate. |

---

## Gap 8: Issue Audit Revision Cap and SLA Timer

| Attribute | Detail |
| :--- | :--- |
| **Source** | FR-04.6-05, FR-04.6-06 (SoR) (Implicitly implied by "revise the report") |
| **Original Requirement** | "If report is not approved, system shall enable auditor to revise... If report is rejected, system shall enable the auditor to revise..." |
| **Identified Gap** | The SoR mentions revision but does not specify a cap on revisions, nor does it specify an SLA timer for the audit notice. |
| **Implemented Decision** | **Revision Cap:** The `IssueAudit` aggregate enforces `maxRevisionCount` (default = 3). Once exceeded, auto-escalate to Director. **SLA Timer:** Workflow Engine starts a timer on `NOTICE_ISSUED`. If no response in 30 days, auto-advance case. |
| **Impact** | Impacts TA-025. Adds `revisionCount` and `slaExpiryDate` to `IssueAudit` aggregate. |

---

## Gap 9: Escalation from Desk to Comprehensive (Evidence Inheritance)

| Attribute | Detail |
| :--- | :--- |
| **Source** | FR-04.3-06, FR-04.3-08 (SoR) |
| **Original Requirement** | "If there is/are big issue/s or finding, team leader submits recommendation to follow-up with comprehensive audit... Tax audit director/process owner to review whether it needs to elevate to comprehensive audit." |
| **Identified Gap** | The SoR does not specify whether evidence from the Desk Audit should be carried forward to the Comprehensive Audit. |
| **Implemented Decision** | When a Desk Audit escalates to Comprehensive, the new `AuditCase` (with `auditType = COMPREHENSIVE`) is seeded with all `evidence` from the parent Desk Audit, the `draftReportId`, and a back-reference `escalatedFromCaseId`. |
| **Impact** | Impacts handoff between TA-009 and TA-010. Adds `escalatedFromCaseId` to `AuditCase`. |

---



## Gap 11: Single Database Schema with Table Prefixes (Conflict Prevention)

| Attribute | Detail |
| :--- | :--- |
| **Source** | Architecture / Parallel Development Strategy |
| **Original Requirement** | No explicit database schema strategy defined. Risk of merge conflicts and table ownership disputes. |
| **Identified Gap** | With 4 developers working in parallel, there is a high risk of merge conflicts and accidental modification of other clusters' tables. |
| **Implemented Decision** | We use a **single central PostgreSQL schema** but enforce **2-letter table prefixes** to logically separate ownership. |
| **Prefix Mapping** | `ap_` (Pawlos), `ex_` (Oliad), `tp_` (Borifa), `ja_` (Yoseph), `cm_` (Yoseph), `rf_` (Yoseph), `qa_` (Oliad), `ia_` (Borifa), `shared_` (Shared Infrastructure). |
| **Constraint** | No developer may modify tables belonging to another cluster without explicit approval and a pull request reviewed by the owner. |
| **Impact** | Prevents merge conflicts. Enables parallel Flyway migrations. Keeps reporting simple (joins across prefixes are possible). |

---

## Summary of All Gaps by Cluster

| Gap ID | Description | Primary Impact |
| :--- | :--- | :--- |
| G1 | Manual Plan Entry → Risk-Proposal Engine | AP (TA-001) |
| G2 | Missing 3-Tier Hierarchy | AP (TA-001, TA-002, TA-007) |
| G3 | Federal-Level Routing (TP/JA) | TP, JA, AP (TA-004) |
| G4 | Risk Engine Granularity | All Clusters (AP, EX, TP, JA, IA) |
| G5 | External Engines → Internal Engines + Mocks | All Clusters (Shared Infrastructure) |
| G6 | Undelivered Notice Alternative Delivery | CM (TA-017), RF (TA-018) |
| G7 | QA Auditable Random Sampling | QA (TA-023) |
| G8 | Issue Audit Revision Cap + SLA Timer | IA (TA-025) |
| G9 | Desk → Comp Evidence Inheritance | EX (TA-009, TA-010) |
| G10 | Single Database Schema + Table Prefixes | All Clusters (Infrastructure) |

