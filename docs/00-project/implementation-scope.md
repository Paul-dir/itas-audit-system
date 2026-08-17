# Implementation Scope

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

---

## 1. In-Scope (What This System Builds)

### 1.1 Business Functionality (25 BUCs)

| BUC | Name | Cluster | Owner |
| :--- | :--- | :--- | :--- |
| TA-001 | Create and Approve Annual Audit Plan | AP | Pawlos |
| TA-002 | Cascade Audit Plan to Case Level & Intake Referrals | AP | Pawlos |
| TA-003 | Select and Prioritize Audit Cases | AP | Pawlos |
| TA-004 | Assign Cases to Auditors / Committees | AP | Pawlos |
| TA-005 | Plan Individual Audit Case | EX / IA | Oliad / Borifa |
| TA-006 | Select and Form Joint Audit Team | JA | Yoseph |
| TA-007 | Plan Joint Audit | JA | Yoseph |
| TA-008 | Manage Audit Case Progress | EX / JA | Oliad / Yoseph |
| TA-009 | Conduct Desk Audit | EX | Oliad |
| TA-010 | Conduct Comprehensive Audit | EX | Oliad |
| TA-011 | Manage Audit Reporting and Finalization | RF | Yoseph |
| TA-012 | Initiate Transfer Pricing Audit Case | TP | Borifa |
| TA-013 | Plan Transfer Pricing Audit | TP | Borifa |
| TA-014 | Conduct TP Audit Fieldwork | TP | Borifa |
| TA-015 | Perform Transfer Pricing Analysis | TP | Borifa |
| TA-016 | Prepare and Review TP Audit Report | TP | Borifa |
| TA-017 | Issue Audit Notices and Manage Communication | CM | Yoseph |
| TA-018 | Issue Assessment Notice and Conclude Audit | RF | Yoseph |
| TA-019 | Conduct Entry Conference with Taxpayer | CM | Yoseph |
| TA-020 | Manage Taxpayer Communication Portal | CM | Yoseph |
| TA-021 | Execute Joint Audit | JA | Yoseph |
| TA-022 | Complete and Finalize Audit | RF | Yoseph |
| TA-023 | Conduct Quality Assurance Review | QA | Oliad |
| TA-024 | Trigger Fraud Investigation | QA | Oliad |
| TA-025 | Issue Audit | IA | Borifa |

---

### 1.2 Technical Components

| Component | Technology | Responsibility |
| :--- | :--- | :--- |
| **Backend API** | Java 17, Spring Boot 3.x, Hexagonal DDD | REST APIs, domain logic, persistence, eventing. |
| **Back-Office UI** | Next.js 14, React 18, TypeScript, Tailwind | Internal user interface for auditors, team leaders, directors, etc. |
| **Taxpayer Portal UI** | Next.js 14, React 18, TypeScript, Tailwind | Secure taxpayer interface for notices, document upload, communication. |
| **Database** | PostgreSQL 15+, Flyway | Single central schema. Table prefixes: `ap_`, `ex_`, `tp_`, `ja_`, `cm_`, `rf_`, `qa_`, `ia_`, `shared_`. |
| **Internal Engines** | In-Memory Mocks (Phase 1) → Real Libraries (Phase 2) | Workflow, Rules, Notifications, DMS, Ledger. |

### 1.3 Integrations (Consuming)

| Integration | Direction | Purpose |
| :--- | :--- | :--- |
| **Risk Engine** | Read-Only (REST) | Heatmap, TIN lists, single scores, random samples. |
| **Registration Service** | Read-Only (REST) | Taxpayer TIN, profile, organization hierarchy. |
| **Keycloak** | Authentication (OIDC) | Identity provider for all users. |
| **Kafka** | Outbound (Events) | Event delivery to downstream consumers. |
| **S3/Minio** | Read/Write | File storage for DMS. |
| **SMTP/SMS** | Outbound | Notification delivery. |

### 1.4 Development Phasing (Phase 1 - Mock-First)

- **All internal engines** (Workflow, Rules, Notifications, DMS, Ledger) will be **in-memory mocks**.
- **All external integrations** (Risk Engine, Registration Service) will be **mock REST clients**.
- **Purpose:** Enable all 4 developers to build end-to-end features without waiting for real infrastructure.
- **Real Implementation:** Will replace mocks via Spring Profiles (`dev`, `test`, `prod`) in Phase 2.

---

## 2. Out-of-Scope (Built Elsewhere)

| Component | Owner | Reason |
| :--- | :--- | :--- |
| **Risk Scoring ML Models** | Risk Engine Team | We consume their API; we do not build ML models. |
| **Taxpayer Registration UI** | Registration Service Team | We consume TIN and hierarchy data; we do not manage registration. |
| **Fraud Investigation Workflow** | Audit Service Team | We trigger fraud flags; we do not build the investigation module. |
| **Dispute Resolution / Case Management** | Case Management Team | We hand off objections; we do not build appeals workflows. |
| **Kafka Cluster** | Infrastructure Team | We publish events; we do not manage the cluster. |
| **Kubernetes / Networking** | DevOps Team | We deploy to the platform; we do not manage infrastructure. |
| **Physical Mail Delivery** | External Postal Service | We trigger print jobs; we do not manage physical delivery. |
| **Taxpayer Training / Support** | MoR Training Team | We build the portal; we do not train taxpayers. |

---

## 3. Table Ownership (Single Database Schema)

To prevent merge conflicts, table ownership is enforced by **2-letter prefixes**.

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

**Rule:** No developer may modify tables owned by another cluster without explicit approval and a pull request.

---

## 4. Cross-Cluster Dependencies (The Contracts)

| Contract | Owned By | Implemented By | Purpose |
| :--- | :--- | :--- | :--- |
| `AuditCase` Aggregate | Pawlos (AP) | All Clusters | Central case management. |
| `RiskEnginePort` | Shared | All Clusters | Risk data access. |
| `AuditTrailService` | Shared | All Clusters | Audit logging. |
| `OutboxPublisher` | Shared | All Clusters | Reliable event publishing. |

