# Roles & Permissions

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

## 1. Business Roles

ITAS uses Role-Based Access Control (RBAC). The following core business roles are mapped into Keycloak realm roles.

| Role | Keycloak Role Name | Responsibilities |
| :--- | :--- | :--- |
| **Tax Auditor** | `ROLE_AUDITOR` | Executes Desk, Comprehensive, and Issue audits. Uploads evidence. |
| **Team Leader** | `ROLE_TEAM_LEADER` | Assigns auditors, reviews draft reports, recommends escalation. |
| **Process Owner** | `ROLE_PROCESS_OWNER` | Initiates cases, selects TP cases, approves escalations. |
| **Tax Center Manager** | `ROLE_TC_MANAGER` | Submits plan feedback, oversees local allocation. |
| **Regional Director** | `ROLE_REGIONAL_DIRECTOR` | Reviews and distributes plans to tax centers. |
| **National Director** | `ROLE_NATIONAL_DIRECTOR` | Approves final plans, overrides regional targets. |
| **Joint Audit Committee** | `ROLE_JA_COMMITTEE` | Reviews and approves Joint Audit formations. |
| **Quality Assurance** | `ROLE_QA_REVIEWER` | Selects closed cases, conducts QA reviews. |

## 2. Controller Enforcement

Permissions are enforced at the REST Controller level using Spring Security `@PreAuthorize` annotations.

```java
@PreAuthorize("hasRole('ROLE_NATIONAL_DIRECTOR') or hasRole('ROLE_REGIONAL_DIRECTOR')")
@PostMapping("/plans/{id}/approve")
public void approvePlan(...) { ... }
```

## 3. Data-Level Access (Row-Level Security)

Merely having `ROLE_AUDITOR` does not mean the user can view *all* cases. The Domain logic must enforce Row-Level Security:

1. **Auditors** can only view/edit cases where `assigned_auditor_id == X-Actor-Id`.
2. **Team Leaders** can only view/edit cases where `assigned_team_leader_id == X-Actor-Id`.
3. **Tax Center Managers** can only view cases where `tax_center_code == user.taxCenterCode`.
