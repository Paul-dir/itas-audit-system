# Security Architecture

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document defines the authentication, authorization, audit trail, and data security mechanisms for the ITAS Tax Audit System.

---

## 1. Authentication (Who You Are)

### 1.1 Identity Provider
- **Keycloak** (OIDC) is the single source of truth for user identities.
- All users (internal and taxpayers) are authenticated via Keycloak.
- **Phase 1:** Mock authentication (fixed test users with roles) for development.

### 1.2 Authentication Flow
1. User provides credentials (username/password or NID/OTP).
2. Keycloak validates credentials and issues a JWT (Access Token).
3. The JWT is included in the `Authorization: Bearer <token>` header for all API requests.
4. The system validates the JWT signature and extracts claims.
5. The `X-Actor-Id` header is **extracted from the JWT** (not trusted from the client) and injected into the request context.

### 1.3 `X-Actor-Id` Header
- **Source:** Extracted from JWT by Security Filter.
- **Purpose:** Uniquely identifies the authenticated user across all business operations.
- **Enforcement:** Required on all mutating endpoints (POST, PUT, DELETE).
- **Phase 1:** Fixed header value for development (e.g., `X-Actor-Id: auditor1`).

---

## 2. Authorization (What You Can Do)

### 2.1 Role-Based Access Control (RBAC)
Authorization is enforced **server-side** at the method level.

| Role | Description | Key Permissions |
| :--- | :--- | :--- |
| `AUDITOR` | Conducts audits, drafts reports, logs work. | Read assigned cases, execute audit tasks, draft reports. |
| `TEAM_LEADER` | Supervises auditors, approves work, reassigns cases. | Approve/reject drafts, monitor progress, override assignments. |
| `PROCESS_OWNER` | Selects cases, approves high-level plans. | Select cases, attach treatment plans, approve TP/Comp plans. |
| `DIRECTOR` | Approves plans, overrides feedback, decides Issue Audit outcomes. | Final approval, override authority, escalation decisions. |
| `SENIOR_MANAGEMENT` | Approves annual plan. | Final approval of Annual Plan. |
| `REGIONAL_DIRECTOR` | Distributes plan, consolidates feedback. | Submit Regional Response, override Tax Centers. |
| `TAX_CENTER_MANAGER` | Manages local allocation, confirms deployment. | Submit Tax Center Response, confirm deployment. |
| `TAXPAYER` | Views notices, uploads documents, responds to assessments. | Read own case data, upload documents, send messages. |
| `QA_TEAM` | Reviews closed cases, generates QA reports. | Read closed cases, write QA reports, recommend actions. |
| `JOINT_COMMITTEE` | Manages Joint Audits. | Select Joint cases, form teams, approve Joint reports. |
| `TP_COMMITTEE` | Manages Transfer Pricing Audits. | Approve TP cases, plans, and reports. |

### 2.2 Authorization Enforcement Points

| Operation | Required Role(s) | Notes |
| :--- | :--- | :--- |
| Create Annual Plan | `AUDIT_TEAM` | Only Audit Team can create plans. |
| Approve Annual Plan | `DIRECTOR`, `SENIOR_MANAGEMENT` | Director approves for feedback; Senior Management finalizes. |
| Select Cases | `PROCESS_OWNER` | Only Process Owner can select cases. |
| Assign Cases (TA-004) | `PROCESS_OWNER`, `TEAM_LEADER` (override) | Auto-assignment runs; Team Leader can override. |
| Execute Desk Audit | `AUDITOR` | Only assigned Auditor can execute. |
| Approve Audit Report | `TEAM_LEADER`, `PROCESS_OWNER`, `DIRECTOR` | Multi-level approval chain. |
| Override Regional Feedback | `DIRECTOR` | Only Director can override. |
| Confirm Tax Center Deployment | `TAX_CENTER_MANAGER` | Only local manager can confirm. |
| Upload Documents (Taxpayer) | `TAXPAYER` | Only on own cases. |
| Review QA Cases | `QA_TEAM` | Only QA team. |

### 2.3 Organization-Level Authorization
Users are scoped to specific Tax Centers or Regions. A user cannot access data outside their scope.

| Rule | Description |
| :--- | :--- |
| **Tax Center Isolation** | `TAX_CENTER_MANAGER` can only see cases in their own Tax Center. |
| **Region Isolation** | `REGIONAL_DIRECTOR` can see all Tax Centers under their Region. |
| **National Access** | `DIRECTOR` can see all Regions and Tax Centers. |
| **Taxpayer Isolation** | `TAXPAYER` can only see their own cases. |

---

## 3. Audit Trail (Security Logging)

### 3.1 What is Logged
Every mutating action is recorded in the `shared_audit_trail_entries` table:

| Field | Description |
| :--- | :--- |
| `entity_type` | Type of aggregate (e.g., `ANNUAL_PLAN`, `AUDIT_CASE`, `JOINT_AUDIT`). |
| `entity_id` | UUID of the aggregate. |
| `actor_id` | The user who performed the action (from JWT). |
| `action` | Action type: `CREATE`, `UPDATE`, `APPROVE`, `REJECT`, `OVERRIDE`, `ESCALATE`, `CLOSE`. |
| `reason` | Text rationale (mandatory for overrides and rejections). |
| `state_before` | JSON snapshot before the mutation. |
| `state_after` | JSON snapshot after the mutation. |
| `occurred_at` | Timestamp with timezone. |

### 3.2 Audit Trail Enforcement
- **Append-Only:** No updates or deletes allowed on `shared_audit_trail_entries`.
- **Retention:** 7 years (legal requirement).
- **Access Control:** Only `DIRECTOR`, `QA_TEAM`, and authorized auditors can view audit trails.

### 3.3 Actions That Trigger Audit Trail

| Action | Description | Mandatory Reason? |
| :--- | :--- | :--- |
| `CREATE` | New aggregate created | No |
| `UPDATE` | Aggregate modified (state change) | No |
| `APPROVE` | Approval of a plan, report, or decision | No |
| `REJECT` | Rejection with comments | Yes |
| `OVERRIDE` | Override of lower-level decision | Yes |
| `ESCALATE` | Escalation to higher authority | Yes |
| `CLOSE` | Case/Plan closure | No |

---

## 4. Data Security

| Layer | Mechanism | Phase 1 |
| :--- | :--- | :--- |
| **Transport** | TLS 1.2+ for all external and internal APIs. | TLS disabled in dev (local only). |
| **At Rest** | Database encryption (TDE) and S3 server-side encryption. | Encryption disabled in dev. |
| **Secrets** | Stored in Vault / Kubernetes Secrets, never in code. | Environment variables in dev. |
| **API Keys** | Used for webhook authentication (mTLS or Internal SA). | Simple API key in dev. |
| **Sensitive Data** | Taxpayer TIN, personal data encrypted in transit and at rest. | No encryption in dev. |

---

## 5. Security Testing

| Test Type | Description | Phase 1 |
| :--- | :--- | :--- |
| **Unit Tests** | Test authorization logic (role checks). | Required |
| **Integration Tests** | Test authentication flows and role-based access. | Required |
| **Security Tests** | OWASP Top 10 checks (SQL injection, XSS, CSRF protection). | Phase 2 |
| **Penetration Testing** | External security audit. | Phase 2 |

---

## 6. Role to Keycloak Client Role Mapping

| Role | Keycloak Client Role | Description |
| :--- | :--- | :--- |
| Auditor | `AUDITOR` | Can execute assigned audits. |
| Team Leader | `TEAM_LEADER` | Can supervise and approve work. |
| Process Owner | `PROCESS_OWNER` | Can select cases and approve plans. |
| Director | `DIRECTOR` | Can approve plans and override feedback. |
| Senior Management | `SENIOR_MANAGEMENT` | Can approve the Annual Plan. |
| Regional Director | `REGIONAL_DIRECTOR` | Can distribute plans and consolidate feedback. |
| Tax Center Manager | `TAX_CENTER_MANAGER` | Can adjust local allocations and confirm deployment. |
| Taxpayer | `TAXPAYER` | Can view own case data and upload documents. |
| QA Team | `QA_TEAM` | Can review closed cases. |
| Joint Audit Committee | `JOINT_COMMITTEE` | Can manage Joint Audits. |
| TP Review Committee | `TP_COMMITTEE` | Can manage TP Audits. |

