# Project Overview: ITAS Tax Audit & Investigation Management System

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

---

## 1. Core Purpose

To modernize the national tax audit lifecycle by shifting from manual guesswork to a **Risk-Driven Resource Allocation Engine**.

The system ensures that limited audit resources (officers, time, and budget) are deployed against the highest-risk taxpayers, while maintaining strict governance, audit trails, and hierarchical oversight.

The system covers the complete end-to-end audit lifecycle:

| Phase | Description |
| :--- | :--- |
| **1. Annual Planning** | National strategy, regional distribution, local feedback, and final approval. |
| **2. Case Selection** | Risk-based case sourcing, random sampling, and manual nominations. |
| **3. Assignment** | Automated or expert assignment to auditors or committees. |
| **4. Audit Execution** | Desk, Comprehensive, Transfer Pricing, Joint, and Issue audits. |
| **5. Communication** | Notices, document exchange, entry/exit conferences, secure portal. |
| **6. Reporting & Finalization** | Working papers, audit reports, assessment notices, taxpayer response. |
| **7. Quality Assurance** | Post-completion review, sampling, recommendations, follow-up tracking. |
| **8. Fraud Escalation** | Automatic or manual flagging and handoff to investigation teams. |

---

## 2. The Two Operational Levels

The system operates at two distinct administrative levels:

| Level | Description | Applicable Audit Types |
| :--- | :--- | :--- |
| **Local (Tax Center)** | Audits conducted at the physical Tax Center office. Cases are assigned to local auditors and team leaders. | Desk, Comprehensive, Issue |
| **Federal (National)** | Audits involving cross-border transactions or multiple tax authorities. Requires specialized committees and teams. | Transfer Pricing (TP), Joint Audit (JA) |

---

## 3. The 9 Clusters

The system is logically divided into 9 clusters (modules) to enable parallel development:

| Cluster | Theme | BUCs | Primary Level | Owner |
| :--- | :--- | :--- | :--- | :--- |
| **AP** | Audit Planning & Assignment | TA-001 to TA-004 | National / Region / Tax Center | **Pawlos** |
| **EX** | Desk & Comprehensive Execution | TA-009, TA-010 | Tax Center | **Oliad** |
| **TP** | Transfer Pricing Audit | TA-012 to TA-016 | **Federal** | **Borifa** |
| **JA** | Joint Audit | TA-008, TA-021, TA-022 | **Federal / Cross-Authority** | **Yoseph** |
| **CM** | Taxpayer Communication | TA-017, TA-019, TA-020 | Tax Center | **Yoseph** |
| **RF** | Reporting & Finalization | TA-011, TA-018 | All Levels | **Yoseph** |
| **QA** | Quality Assurance | TA-023, TA-024 | Tax Center | **Oliad** |
| **IA** | Issue Audit | TA-025 | Tax Center | **Borifa** |

---

## 4. Architectural Principles

| Principle | Description |
| :--- | :--- |
| **Hexagonal DDD** | Core business logic (Domain) is completely isolated from UI, databases, and external systems. |
| **Single Deployable Unit** | `bs-taxaudit-core-server` (JAR). No microservices complexity. |
| **Internal Engines** | Workflow, Rules, Notifications, DMS, and Ledger are **internal libraries** (not external microservices). |
| **Single Central Database** | One PostgreSQL schema. Table ownership enforced by **2-letter prefixes** (`ap_`, `ex_`, `tp_`, `ja_`, `cm_`, `rf_`, `qa_`, `ia_`, `shared_`). |
| **External Integrations** | Only **Risk Engine** (scoring) and **Registration Service** (taxpayer data) are external. |
| **Mock-First Development** | All internal and external engines are **in-memory mocks** in Phase 1. Real integrations replace mocks via Spring Profiles in Phase 2. |
| **Event-Driven Reporting** | Management reports are built from Outbox events, never from live transactional queries. |

---

## 5. The Core Problem We Solve

| Before | After |
| :--- | :--- |
| Auditors manually guessed how many cases to audit based on historical averages. | The system queries the Risk Engine for a heatmap, calculates available auditor capacity, and generates a **Plan Proposal**. |
| Regional feedback was collected via email and spreadsheets. | The system enforces a **3-tier feedback loop** (Tax Center → Region → National) with full audit trails. |
| Overrides were untraceable. | **Rule 15** ensures all overrides preserve the original value and store the actor, timestamp, and reason. |
| Plans were approved by Senior Management but deployment was unconfirmed. | **Rule 16 (Fan-in Gate)** ensures the plan only finalizes when every Tax Center confirms deployment. |

---

## 6. Success Criteria

| Metric | Target |
| :--- | :--- |
| All 25 BUCs implemented and tested | 100% |
| Unit test coverage | ≥ 80% |
| API response times (standard CRUD) | < 500ms |
| Cascade batch processing (1,000 cases) | < 60 seconds |
| Audit trail retention | 7 years |
| Parallel development | 4 developers working simultaneously without blocking each other |

