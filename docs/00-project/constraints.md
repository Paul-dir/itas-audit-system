# Constraints

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document defines the **non-negotiable constraints** that govern the entire system. Every developer (Pawlos, Yoseph, Oliad, Borifa) must adhere to these constraints. Violations will be caught during code review and CI.

---

## 1. Architectural Constraints

### 1.1 Single Deployable Unit
- Despite having 9 logical clusters, the system is a **single Spring Boot application** (`bs-taxaudit-core-server`).
- **Constraint:** No developer may create a new standalone microservice. All code must reside in `bs-taxaudit-core-server`.

### 1.2 Single Central Database Schema
- The system uses **one PostgreSQL schema**.
- **Table Ownership (The 2-Letter Prefix Rule):** All tables must start with a 2-letter prefix indicating ownership:

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
| `shared_` | Shared Infrastructure (Audit Trail, Outbox, Engines) | Shared (Pawlos leads) |

- **Constraint:** No developer may create or modify tables belonging to another cluster without explicit approval and a pull request reviewed by the owner.

### 1.3 Internal Engines (Not External Microservices)
- Workflow, Rules, Notifications, DMS, and Ledger must be **internal libraries**.
- **Constraint:** No developer may introduce an external HTTP call to a "Workflow Engine" or "Rule Engine" service. These are internal Java libraries.

### 1.4 Mock-First Development (Phase 1)
- **Phase 1 (Development):** All internal engines and external integrations will be **in-memory mocks**.
  - Mock Workflow Engine: In-memory state machine.
  - Mock Rule Engine: In-memory rule evaluation.
  - Mock Risk Engine: Returns pre-seeded data.
  - Mock Registration Service: Returns pre-seeded taxpayer data.
- **Phase 2 (Production):** Real implementations replace mocks via Spring Profiles (`dev`, `test`, `prod`).
- **Constraint:** All mocks must be realistic enough to enable end-to-end UI testing. They must return structured, sensible data (not empty stubs).

### 1.5 Read-Only External Calls
- Calls to Risk Engine and Registration Service are **read-only** (GET only).
- **Constraint:** No developer may implement a POST/PUT/DELETE call to these external systems.

### 1.6 Append-Only Audit
- The `shared_audit_trail_entries` table is **immutable**.
- **Constraint:** No updates or deletes are allowed on audit trail entries. Use `INSERT` only.

### 1.7 Transactional Outbox
- All domain events must be stored atomically with the aggregate save (same JPA transaction).
- **Constraint:** No developer may publish events directly to Kafka without going through the Outbox.

### 1.8 Hexagonal Architecture
- Dependency direction is **inward**: API Layer → Application Layer → Domain Layer.
- **Constraint:** The Domain Layer must have zero dependencies on Spring, JPA, or any framework.

---

## 2. Business Constraints

### 2.1 3-Tier Hierarchy (AP Cluster Only)
- The AP cluster must respect the **National → Region → Tax Center** hierarchy for Annual Planning (TA-001, TA-002).

### 2.2 Assignment Routing (TA-004)
| Target | Process Owner | Subsequent Action |
| :--- | :--- | :--- |
| **Desk, Comprehensive, Issue** | Process Owner / Tax Center Manager assigns to **Team Leader**. | Team Leader then assigns cases to an **Auditor**. |
| **Joint Audit (JA), Transfer Pricing (TP)** | Process Owner assigns case to the **Joint Committee** or **TP Committee**. | Committee forms the audit team, appoints a Team Leader, and assigns the case. |

- **Constraint:** The `AssignmentService` (TA-004) must support both a direct individual path (Team Leader → Auditor) and a committee path (Committee → Team Formation → Assignment).

### 2.3 Override Semantics (Rule 15)
- All overrides must preserve the original submitted value.
- **Constraint:** The following fields are mandatory for every override:
  - `originalValue` (preserved)
  - `overriddenValue` (the new value)
  - `overriddenBy` (Actor ID)
  - `overriddenAt` (Timestamp)
  - `overrideReason` (Text rationale)

### 2.4 Fan-in Gate (Rule 16)
- The `AnnualAuditPlan` cannot reach `FINALIZED` until every Tax Center confirms deployment.
- **Constraint:** The `AnnualAuditPlan` status must be `FINALIZED` before TA-002 (Cascade) can run.

### 2.5 Source Tracking (Rule 11)
- Every `AuditCase` must have an explicit `source` enum.
- **Constraint:** `source` must be one of: `RISK_ENGINE`, `RANDOM_SAMPLE`, `INTERNAL_REFERRAL`, `EXTERNAL_REFERRAL`, `MANUAL_SELECTION`. Never inferred.

### 2.6 Sampling Configuration (Rule 12)
- Sampling configuration is data, not hardcoded.
- **Constraint:** Use `AuditSamplingConfiguration` VO validated by `SamplingService`. No switch statements for sampling methods.



---

## 3. Technology Constraints

| Category | Constraint |
| :--- | :--- |
| **Database** | PostgreSQL 15+ only. No other RDBMS allowed. |
| **Backend** | Java 17, Spring Boot 3.x. No older versions. |
| **Migration** | Flyway for all schema changes. SQL scripts in `src/main/resources/db/migration/`. |
| **Frontend** | Next.js / React / TypeScript / Tailwind. No other frameworks. |
| **Testing** | Minimum 80% unit test coverage for Domain and Application layers. |
| **Code Style** | Google Java Style Guide (backend), ESLint (frontend). |
| **CI/CD** | GitHub Actions or GitLab CI. All builds must pass before merge. |

---

## 4. Security Constraints

| Category | Constraint |
| :--- | :--- |
| **Authentication** | Keycloak (OIDC) only. No custom authentication. |
| **Authorization** | Enforced server-side (Spring Security `@PreAuthorize`). |
| **Audit** | All mutations recorded in `shared_audit_trail_entries`. |
| **Data Privacy** | Taxpayer data encrypted at rest. Access logged. |
| **API Security** | All endpoints require authentication except health checks. |

---

## 5. Performance Constraints

| Metric | Target |
| :--- | :--- |
| Risk Engine Heatmap query | < 3 seconds |
| Risk Engine TIN List query | < 2 seconds |
| Standard API CRUD | < 500ms |
| Cascade batch processing | < 60 seconds for 1,000 cases |
| PDF generation | < 10 seconds per case |
| Concurrent users | Support ≥ 500 concurrent users |

---

## 6. Organizational Constraints

| Constraint | Description |
| :--- | :--- |
| **4 Developers** | Pawlos (AP), Yoseph (JA/CM/RF), Oliad (EX/QA), Borifa (TP/IA). |
| **Parallel Work** | No developer waits for another. Use mocks and contracts. |
| **Zero-Blocking** | Depend on contracts/ports, not implementations. |
| **AI-Assisted** | All AI-generated code must be reviewed by a human. |
| **Definition of Done** | Applies to every BUC. See `14-ai/sprint-execution-rules.md`. |

