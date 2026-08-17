# Architecture Overview

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document provides a high-level overview of the system architecture, explaining the core architectural patterns, the reasoning behind key decisions, and the overall structure of the codebase.

---

## 1. Architectural Pattern: Hexagonal Architecture (Ports & Adapters)

The system follows **Hexagonal Architecture** (also known as Ports & Adapters) combined with **Domain-Driven Design (DDD)**. This ensures that the core business logic (Domain) is completely isolated from external concerns (UI, databases, integrations).

### 1.1 The Four Layers

| Layer | Responsibility | Dependencies |
| :--- | :--- | :--- |
| **API Layer (Inbound Adapters)** | Handles HTTP requests, validates inputs, calls application use cases, returns HTTP responses. | Depends on Application Layer. |
| **Application Layer (Orchestration)** | Orchestrates use cases, manages transactions, coordinates domain logic, uses outbound ports. | Depends on Domain Layer and Outbound Ports. |
| **Domain Layer (Core Business)** | Pure business logic. Enforces invariants, aggregates, domain events. Has zero dependencies on frameworks. | Depends on nothing. |
| **Infrastructure Layer (Outbound Adapters)** | Implements persistence (JPA), external clients (REST), messaging (Kafka), and internal engines. | Depends on Application Ports. |

### 1.2 Dependency Direction
- **Inward:** Dependencies point inward toward the Domain.
- **Domain Layer** has zero dependencies on Spring, JPA, or any framework.
- **Application Layer** depends on Domain and Outbound Ports.
- **Infrastructure Layer** implements Outbound Ports.

---

## 2. Key Architectural Decisions

| Decision | Rationale | Impact |
| :--- | :--- | :--- |
| **Single Deployable Unit** | Avoids distributed transaction complexity, reduces latency, simplifies AI-assisted development. | One JAR, one codebase, one set of CI/CD pipelines. |
| **Single Central Database** | Enables ACID transactions, simplifies reporting, reduces operational overhead. | One PostgreSQL schema. Table ownership enforced by 2-letter prefixes. |
| **Internal Engines (Mock-First)** | Workflow, Rules, Notification, DMS, and Ledger are internal libraries (not external microservices). Phase 1 uses in-memory mocks. Phase 2 replaces with real implementations via Spring Profiles. | Enables ACID transactions, reduces network calls, simplifies debugging, enables parallel development. |
| **Risk-Proposal Engine** | Replaces manual number entry in TA-001. Plans are generated from Risk Heatmap + Capacity. | Plans are data-driven, not guesswork. |
| **3-Tier Hierarchy (AP Only)** | National → Region → Tax Center. Plans are distributed and feedback is aggregated. Tax Center is the fundamental execution unit. | Matches the actual organizational structure. |
| **Federal Routing (TP/JA)** | TP and Joint cases are `FEDERAL_COMMITTEE`, skipped by TA-004, handled by specialized committees. | Specialized audits require specialized assignment. |
| **Event-Sourced Reporting** | Management reports are built from Outbox events (event stream), not live queries. | Prevents performance bottlenecks, enables auditability. |
| **Transactional Outbox** | Domain events are stored atomically with aggregate saves. | Guarantees reliable event delivery without distributed transactions. |
| **Immutable Audit Trail** | All mutations are recorded in an append-only log. 7-year retention. | Legal compliance and full traceability. |
| **Read-Only External Calls** | All calls to Risk Engine and Registration Service are GET-only. | Prevents accidental writes to external systems. |

---

## 3. Internal Engine Architecture (The "Inside" Services)

These are **not** external microservices. They are Spring Beans residing in the `shared/infrastructure/engine/` package.

| Engine | Implementation | Purpose | Phase 1 | Phase 2 |
| :--- | :--- | :--- | :--- | :--- |
| **Workflow Engine** | Spring State Machine | Orchestrates approval chains, SLA timers, and state transitions for Audit Plans, Reports, and Issue Audits. | In-Memory Mock | Real State Machine |
| **Rule Engine** | EasyRules | Evaluates configurable business rules: CAAT eligibility, TP method selection, QA sampling criteria, revision cap logic. | In-Memory Mock | Real EasyRules |
| **Notification Engine** | Spring Mail + Async | Sends emails, SMS, and Portal notifications. Logs delivery attempts. | In-Memory Mock | Real SMTP/SMS |
| **DMS (Document Service)** | Spring Content (S3/Minio) | Stores evidence, renders audit reports (PDF), and manages notice generation. | In-Memory Mock | Real S3/Minio |
| **Ledger Engine** | Plain JPA | Append-only accounting journal. Posts Principal, Penalty, and Interest to the ledger during Assessment (TA-018). | In-Memory Mock | Real PostgreSQL |

---

## 4. External Integration Architecture (The "Outside" Services)

Only **two** external services exist (read-only). All others are internal.

| External Service | Port Interface | Adapter Implementation | Purpose |
| :--- | :--- | :--- | :--- |
| **Registration Service** | `RegistrationServicePort` | `RegistrationServiceRestClient` | Fetch taxpayer TIN, basic profile, and organizational hierarchy (Region/Tax Center mapping). |
| **Risk Engine** | `RiskEnginePort` | `RiskEngineRestClient` | Supports 4 query types: Aggregated Heatmap, Scoped TIN List, Single TIN Score, Random Sample. |

### 4.1 Risk Engine Query Types

| Query Type | Purpose | Used In |
| :--- | :--- | :--- |
| **Aggregated Heatmap** | Returns total risk counts per Region/Tax Center/Audit Type. | TA-001 (Plan Proposal Generation) |
| **TIN List (Scoped)** | Returns specific TINs for a given Tax Center + Audit Type + Limit. | TA-002 (Cascade) |
| **Single TIN Score** | Returns the real-time risk profile for a specific taxpayer. | TA-005, TA-009, TA-015, TA-025 (Execution) |
| **Random Sample** | Returns random TINs from a given population for model validation. | TA-003 (AF5 - Random Selection) |

---

## 5. Event-Driven Communication

### 5.1 Outbox Pattern Overview

| Component | Responsibility |
| :--- | :--- |
| **Application Layer** | Saves the aggregate and inserts an outbox event in the same JPA transaction. |
| **Outbox Table** | Stores domain events (`shared_outbox_entries`) before publishing. |
| **Outbox Poller** | Periodically polls the outbox table for unprocessed events and publishes them to Kafka. |
| **Kafka** | Delivers events to downstream consumers (Reporting, Fraud, Case Management). |

### 5.2 Event Consumers

| Consumer | Events Consumed | Purpose |
| :--- | :--- | :--- |
| **Reporting Service** | `AnnualAuditPlanFinalized`, `AuditCaseClosed`, `AssessmentNoticeIssued`, etc. | Builds KPI dashboards, audit yield reports, productivity reports. |
| **Audit Service** | `FraudEscalatedFromIssueAudit`, `FraudInvestigationTriggered` | Handles fraud investigation workflows. |
| **Case Management Service** | `ObjectionRaised`, `ObjectionResolved` | Handles taxpayer objections and appeals. |
| **Risk Engine (Feedback)** | `RandomAuditCaseSelected`, `AuditCaseClosed` | Feedback loop for risk model calibration. |

---

## 6. Database Strategy (Single Central Schema)

| Attribute | Decision |
| :--- | :--- |
| **Database** | PostgreSQL 15+ (Single Central Schema) |
| **Migration** | Flyway (versioned SQL scripts) |
| **Table Ownership** | 2-Letter Prefix Rule: `ap_`, `ex_`, `tp_`, `ja_`, `cm_`, `rf_`, `qa_`, `ia_`, `shared_` |
| **Prefix Rule** | No developer may modify tables belonging to another cluster without explicit approval. |

---

## 7. Cross-Cutting Technical Concerns

| Concern | Approach |
| :--- | :--- |
| **Audit Trail** | Immutable append-only log (`shared_audit_trail_entries`). 7-year retention. |
| **Idempotency** | Use idempotency keys for event handling to prevent duplicate processing. |
| **Testing** | Unit tests (≥80% coverage) + Integration tests (Testcontainers) + Contract tests. |
| **Logging** | Structured JSON logging (ELK/OpenSearch compatible). |
| **Monitoring** | Prometheus metrics + Grafana dashboards. |
| **Security** | Keycloak OIDC, server-side authorization (`@PreAuthorize`). |
| **Configuration** | Spring Profiles: `dev` (mocks), `test` (mocks), `uat` (real services), `prod` (real services). |

---

## 8. Development Phasing (Mock-First Strategy)

| Phase | Description | Timeline |
| :--- | :--- | :--- |
| **Phase 1** | All internal engines and external clients are **in-memory mocks**. All developers build full end-to-end features without real infrastructure. | Sprint 1-4 |
| **Phase 2** | Replace mocks with real implementations using Spring Profiles (`uat`, `prod`). | Sprint 5+ |

---

## 9. Summary of Key Architecture Files

| File | Purpose |
| :--- | :--- |
| `system-context.md` | Who interacts with the system and what external systems it depends on. |
| `architecture-overview.md` | This file. High-level architecture, decisions, patterns. |
| `container-architecture.md` | Deployment containers (Backend, Frontend, PostgreSQL, Kafka, etc.). |
| `component-architecture.md` | Internal package structure, the critical handoff contract (`AuditTypeSpecificPlanningPort`), layer responsibilities. |
| `security-architecture.md` | Authentication, authorization, audit trail, data security. |
| `integration-architecture.md` | Contracts for Risk Engine, Registration Service, internal engine ports, fallback mechanisms. |

