# Assumptions

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

---

## 1. External System Assumptions

### 1.1 Risk Engine (External REST API)
- Is **available** and supports the four required query types:
  1. **Aggregated Heatmap:** Returns risk counts per Region/Tax Center/Audit Type.
  2. **Scoped TIN List:** Returns specific TINs for a given Tax Center + Audit Type + Limit.
  3. **Single TIN Score:** Returns real-time risk profile for a specific taxpayer.
  4. **Random Sample:** Returns random TINs from a given population.
- **Response Times:** Heatmap < 3s, TIN List < 2s, Single Score < 500ms, Random Sample < 2s.
- **Phase 1:** A **mock implementation** will be used. It returns pre-seeded realistic data.

### 1.2 Registration Service (External REST API)
- Provides TIN-based taxpayer profiles.
- Provides the full organizational hierarchy (Tax Center → Region mapping).
- Provides taxpayer contact information (email, phone, address) for notifications.
- **Response Time:** < 500ms for profile lookups.
- **Phase 1:** A **mock implementation** will be used with pre-seeded taxpayer data.

### 1.3 Keycloak (Authentication)
- Provides OIDC authentication.
- The `X-Actor-Id` header is reliably populated for all authenticated requests.
- Roles are defined and assigned to users: `AUDITOR`, `TEAM_LEADER`, `PROCESS_OWNER`, `DIRECTOR`, `SENIOR_MANAGEMENT`, `REGIONAL_DIRECTOR`, `TAX_CENTER_MANAGER`, `QA_TEAM`, `JOINT_COMMITTEE`, `TP_COMMITTEE`, `TAXPAYER`.
- **Phase 1:** A **mock authentication** mechanism will be used (e.g., fixed header for development).

### 1.4 Infrastructure
- Kafka is available and configured for event publishing.
- PostgreSQL is available with adequate performance (SSD, 8+ cores).
- S3/Minio is available for file storage.
- SMTP and SMS gateways are configured and operational.
- **Phase 1:** All these are **mocked** or replaced with in-memory/in-process alternatives.

---

## 2. Data & Organizational Assumptions

### 2.1 Auditor Profiles (Internal Data)
- HR data is seeded into the internal `ap_auditor_profiles` table before the system goes live.
- Data includes: skills, seniority, tax center assignment, max capacity, leave schedules.
- Auditor profiles are updated periodically (at least quarterly).

### 2.2 Tax Center Hierarchy
- Registration Service provides accurate `region_code` and `tax_center_code` for every TIN.
- The 3-tier hierarchy (National → Region → Tax Center) is stable and does not change dynamically during a planning cycle.

### 2.3 Risk Data
- Risk Engine pre-computes risk scores based on available taxpayer filing and payment data.
- Risk Engine is updated nightly (or near real-time).

### 2.4 Stakeholder Acceptance
- Business stakeholders accept the Fan-in Gate (Rule 16): the plan must wait for every Tax Center to confirm deployment.
- Business stakeholders accept the Override semantics (Rule 15): overrides preserve original values.

---

## 3. Technical Assumptions

### 3.1 Greenfield
- The system is a **greenfield** project. No legacy data migration is required.
- No existing audit cases need to be imported (or if so, handled separately).

### 3.2 Technology Stack
| Component | Technology | Version |
| :--- | :--- | :--- |
| **Backend** | Java + Spring Boot | Java 17, Spring Boot 3.x |
| **Database** | PostgreSQL | 15+ |
| **Migration** | Flyway | Latest |
| **Frontend** | Next.js / React / TypeScript / Tailwind | Next.js 14, React 18 |
| **Testing** | JUnit 5, Mockito, Testcontainers, Jest | Latest |
| **Build** | Maven (backend), npm (frontend) | Latest |

### 3.3 Mock-First Development (Phase 1)
- **All internal engines** (Workflow, Rules, Notifications, DMS, Ledger) are **in-memory mocks**.
- **All external integrations** (Risk Engine, Registration Service) are **mock REST clients**.
- **All infrastructure** (Kafka, S3, SMTP) are **mocked or stubbed**.
- **Purpose:** Enable all 4 developers to build end-to-end features without waiting for real infrastructure.
- **Transition:** Real implementations will replace mocks via Spring Profiles (`dev`, `test`, `prod`) in Phase 2.

### 3.4 Transaction Management
- The system is a single deployable unit, so JPA transactions across aggregates are possible for atomic operations.
- No distributed transactions are required.

---

## 4. Legal & Regulatory Assumptions

### 4.1 e-Signature
- Electronic signatures are legally equivalent to handwritten signatures (per FR-04.7-37).

### 4.2 Audit Trail Retention
- 7 years is the required retention period for audit trails.

### 4.3 Data Privacy
- Taxpayer data must be encrypted at rest.
- Access to taxpayer data must be logged and audited.

### 4.4 Alternative Delivery
- Physical mail, affixing to premises, and newspaper publication are legally valid delivery methods for notices (per FR-04.7-29).

---

## 5. Development Process Assumptions

### 5.1 Parallel Development
- 4 developers work simultaneously on separate clusters:
  - **Pawlos:** AP (TA-001 to TA-004)
  - **Yoseph:** JA, CM, RF (TA-006, TA-007, TA-017, TA-019, TA-020, TA-021, TA-022, TA-011, TA-018)
  - **Oliad:** EX, QA (TA-005, TA-008, TA-009, TA-010, TA-023, TA-024)
  - **Borifa:** TP, IA (TA-005, TA-012 to TA-016, TA-025)
- **Zero-Blocking Rule:** Developers depend on **published contracts/ports**, never on another developer's unfinished implementation.

### 5.2 AI-Assisted Development
- All coding is assisted by AI, guided by a strict "Definition of Done" and project-wide context rules.
- All AI-generated code is reviewed by a human.

