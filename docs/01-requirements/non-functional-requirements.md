# Non-Functional Requirements

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

**Context:** These NFRs apply to the entire system and are enforced at the infrastructure/architecture level. They are derived from the SoR, the Architecture document, and enterprise best practices for tax audit systems.

---

## 1. Performance & Scalability

| ID | Requirement | Target | Rationale |
| :--- | :--- | :--- | :--- |
| **NFR-001** | API response times for standard CRUD operations (GET/POST/PUT) | < 500ms (p95) | Auditors and taxpayers expect immediate feedback. |
| **NFR-002** | Risk Engine Heatmap query (TA-001) | < 3 seconds | Plan proposal generation requires real-time risk aggregation. |
| **NFR-003** | Risk Engine TIN List query (TA-002) | < 2 seconds | Cascade operation must be fast for large plans. |
| **NFR-004** | Risk Engine Single Score query (TA-005, TA-009, TA-015, TA-025) | < 500ms | Real-time risk context during execution. |
| **NFR-005** | Cascade batch processing (1,000 cases) | < 60 seconds | Annual plan may generate thousands of cases. |
| **NFR-006** | PDF generation (reports, notices) | < 10 seconds per document | Taxpayers should not wait long for official documents. |
| **NFR-007** | Aggregated management reports | < 5 seconds | Dashboards and KPIs must load quickly. |
| **NFR-008** | Concurrent users supported | ≥ 500 concurrent users | Peak filing/planning seasons. |
| **NFR-009** | Database connection pool size | Minimum 50 connections | Prevent connection starvation under load. |
| **NFR-010** | File upload size limit | 50 MB per file (configurable) | Taxpayer evidence can include large attachments. |

---

## 2. Availability & Reliability

| ID | Requirement | Target | Rationale |
| :--- | :--- | :--- | :--- |
| **NFR-011** | System uptime during business hours (8am-6pm, Mon-Fri) | 99.5% | Critical audit operations must be available. |
| **NFR-012** | System uptime outside business hours | 95.0% | Taxpayer portal may be used after hours. |
| **NFR-013** | External service failure (Risk Engine, Registration) | Must not crash the system. Use cached snapshots (Rule 7) and graceful fallbacks. | Prevent cascading failures. |
| **NFR-014** | Database backup frequency | Daily (full backup) with point-in-time recovery (WAL archiving) | Data loss is unacceptable for legal/audit reasons. |
| **NFR-015** | Failure retry policy for external calls | 3 retries with exponential backoff, then log + alert admin | Transient network failures are common. |
| **NFR-016** | Outbox event delivery | At-least-once delivery to Kafka | Events must be delivered reliably for reporting and downstream consumers. |

---

## 3. Data & Audit

| ID | Requirement | Target | Rationale |
| :--- | :--- | :--- | :--- |
| **NFR-017** | Audit trail retention period | 7 years (immutable, append-only) | Legal requirement for tax audit records. |
| **NFR-018** | All mutations recorded in `shared_audit_trail_entries` | 100% of state-changing actions | Full traceability for legal and QA purposes. |
| **NFR-019** | All domain events persisted in `shared_outbox_entries` | 100% of events before publishing | Ensure reliable event delivery. |
| **NFR-020** | Data encryption at rest | Database encryption (TDE) + S3 encryption | Protect sensitive taxpayer data. |
| **NFR-021** | Data encryption in transit | TLS 1.2+ for all external/internal APIs | Prevent eavesdropping. |

---

## 4. Security & Authorization

| ID | Requirement | Target | Rationale |
| :--- | :--- | :--- | :--- |
| **NFR-022** | Authentication | Keycloak (OIDC) | Single source of truth for identities. |
| **NFR-023** | Authorization | Enforced server-side (not just UI hiding) | Prevent bypass of UI restrictions. |
| **NFR-024** | Role-Based Access Control | Roles: AUDITOR, TEAM_LEADER, PROCESS_OWNER, DIRECTOR, SENIOR_MANAGEMENT, REGIONAL_DIRECTOR, TAX_CENTER_MANAGER, QA_TEAM, JOINT_COMMITTEE, TP_COMMITTEE, TAXPAYER | Least privilege access. |
| **NFR-025** | `X-Actor-Id` header | Enforced on all mutating endpoints (extracted from JWT) | Prevent spoofing. |
| **NFR-026** | Password policy | Minimum 8 characters, uppercase, lowercase, number, special | Security best practice. |
| **NFR-027** | Session timeout | 30 minutes of inactivity | Prevent unauthorized access on idle sessions. |
| **NFR-028** | API rate limiting | 100 requests per minute per IP (adjustable) | Prevent abuse and DDoS. |
| **NFR-029** | CORS policy | Restrict to known frontend domains | Prevent unauthorized API access. |

---

## 5. Maintainability & Code Quality

| ID | Requirement | Target | Rationale |
| :--- | :--- | :--- | :--- |
| **NFR-030** | Architectural pattern | Hexagonal Architecture (Ports & Adapters) | Domain independence and testability. |
| **NFR-031** | Domain independence | Domain layer has zero dependencies on frameworks (Spring, JPA, etc.) | Pure business logic, easy to test. |
| **NFR-032** | Unit test coverage | ≥ 80% for Domain and Application layers | Catch bugs early, enable refactoring. |
| **NFR-033** | Integration test coverage | All critical API endpoints and external port integrations | Ensure system works end-to-end. |
| **NFR-034** | API contract tests | All public REST APIs | Prevent breaking changes. |
| **NFR-035** | Code style | Google Java Style Guide (backend), ESLint (frontend) | Consistent codebase. |
| **NFR-036** | Linting | Pre-commit hooks + CI pipeline | Enforce quality automatically. |

---

## 6. Usability (Frontend)

| ID | Requirement | Target | Rationale |
| :--- | :--- | :--- | :--- |
| **NFR-037** | Responsive design | Supports desktop, tablet, and mobile | Taxpayers may use mobile devices. |
| **NFR-038** | Form validation | Client-side (instant feedback) + Server-side (security) | Improve user experience and security. |
| **NFR-039** | Multi-language support | English + Local Language (Phase 2) | Taxpayers may prefer local language. |
| **NFR-040** | UI loading time | < 2 seconds for initial page load | Users expect fast interfaces. |
| **NFR-041** | Accessibility | WCAG 2.1 AA compliance | Inclusive design. |
| **NFR-042** | Back-Office UI navigation | Consistent navigation across all 9 clusters | Reduce learning curve for auditors. |

---

## 7. Logging & Monitoring

| ID | Requirement | Target | Rationale |
| :--- | :--- | :--- | :--- |
| **NFR-043** | Structured logging | JSON format (ELK/OpenSearch compatible) | Easier log aggregation and searching. |
| **NFR-044** | Log levels | ERROR, WARN, INFO, DEBUG (configurable per environment) | Flexible debugging in different environments. |
| **NFR-045** | Health checks | `/api/v1/internal/health` and `/api/v1/internal/metrics` (Prometheus) | Kubernetes readiness/liveness probes. |
| **NFR-046** | Distributed tracing | OTLP / Jaeger integration | Debug complex request flows across clusters. |
| **NFR-047** | Business metrics | Audit yield, case count, SLA compliance, productivity | Monitor business performance. |
| **NFR-048** | Alerting | Critical errors and SLA breaches trigger alerts to DevOps/SRE | Proactive issue resolution. |

---

## 8. Compliance & Legal

| ID | Requirement | Target | Rationale |
| :--- | :--- | :--- | :--- |
| **NFR-049** | Audit trail immutability | No updates or deletes allowed on audit trail | Tamper-evident legal record. |
| **NFR-050** | Data localization | Taxpayer data must reside in-country (per MoR policy) | Legal requirement for tax data. |
| **NFR-051** | GDPR/Privacy compliance | Explicit consent, data access rights, data deletion (where legally allowed) | Privacy regulation. |
| **NFR-052** | e-Signature validity | Electronic signatures legally equivalent to handwritten (per FR-04.7-37) | Legal enforceability. |

---

## 9. Integration Constraints

| ID | Requirement | Target | Rationale |
| :--- | :--- | :--- | :--- |
| **NFR-053** | Risk Engine integration | Read-only REST, 4 query types supported | Critical for planning and execution. |
| **NFR-054** | Registration Service integration | Read-only REST, provides hierarchy and TIN data | Critical for case creation. |
| **NFR-055** | Mock-first development | All integrations mocks in Phase 1, real in Phase 2 | Enable parallel development. |
| **NFR-056** | Event serialization | JSON with schema registry (backward compatible) | Prevent breaking downstream consumers. |

---

## 10. Disaster Recovery

| ID | Requirement | Target | Rationale |
| :--- | :--- | :--- | :--- |
| **NFR-057** | RPO (Recovery Point Objective) | < 1 hour | Minimal data loss acceptable. |
| **NFR-058** | RTO (Recovery Time Objective) | < 4 hours | System must be restored quickly. |
| **NFR-059** | Backup verification | Monthly restore tests | Ensure backups are valid. |
| **NFR-060** | Disaster recovery plan | Documented and rehearsed annually | Business continuity. |

---

## Summary: Critical NFRs by Cluster

| Cluster | Critical NFRs |
| :--- | :--- |
| **AP** | NFR-002 (Heatmap), NFR-003 (TIN List), NFR-005 (Cascade batch) |
| **EX** | NFR-004 (Single Score), NFR-006 (PDF generation) |
| **TP** | NFR-004 (Single Score), NFR-006 (PDF generation) |
| **RF** | NFR-007 (Management reports), NFR-001 (CRUD) |
| **CM** | NFR-010 (File upload), NFR-006 (PDF generation) |
| **All** | NFR-017 (Audit trail), NFR-018 (Outbox), NFR-022 to NFR-029 (Security) |

