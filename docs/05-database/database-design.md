# Database Design

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document defines the overall database design for the ITAS Tax Audit & Investigation Management System. It covers the schema strategy, table naming conventions, relationships, and key design principles.

---

## 1. Database Strategy Overview

| Attribute | Decision |
| :--- | :--- |
| **Database** | PostgreSQL 15+ |
| **Schema** | Single Central Schema |
| **Migration** | Flyway (versioned SQL scripts) |
| **Naming Convention** | Snake_case for tables and columns |
| **Primary Keys** | UUID (v4) for all tables |
| **Timestamps** | TIMESTAMPTZ with timezone |
| **Optimistic Locking** | `version` column (BIGINT) on all aggregates |
| **Audit Trail** | Separate append-only table `shared_audit_trail_entries` |
| **Outbox** | Separate table `shared_outbox_entries` |

---

## 2. Table Ownership (2-Letter Prefix Rule)

To enable parallel development and prevent merge conflicts, every table must start with a 2-letter prefix indicating the owning cluster.

| Prefix | Cluster | Owner |
| :--- | :--- | :--- |
| `ap_` | Audit Planning & Setup | **Pawlos** |
| `ex_` | Execution (Desk & Comprehensive) | **Oliad** |
| `tp_` | Transfer Pricing | **Borifa** |
| `ja_` | Joint Audit | **Yoseph** |
| `cm_` | Communication | **Yoseph** |
| `rf_` | Reporting & Finalization | **Yoseph** |
| `qa_` | Quality Assurance | **Oliad** |
| `ia_` | Issue Audit | **Borifa** |
| `shared_` | Shared Infrastructure | **Shared (Pawlos leads)** |

**Constraint:** No developer may modify tables belonging to another cluster without explicit approval and a pull request reviewed by the owner.

---

## 3. Key Design Principles

### 3.1 Single Source of Truth
- Each aggregate root owns its own tables.
- No duplication of data across clusters.
- Denormalization is allowed only for reporting purposes (read-models).

### 3.2 Referential Integrity
- Foreign keys are enforced where relationships exist.
- Foreign key constraints are defined in Flyway migrations.
- Soft deletes are NOT used. Hard deletes are forbidden.

### 3.3 Eventual Consistency
- Reporting read-models are built from the outbox event stream.
- No live-querying of transactional tables for reporting.
- Read-models can be denormalized for performance.

### 3.4 Append-Only Audit
- `shared_audit_trail_entries` is append-only.
- No updates or deletes allowed.
- 7-year retention.

---

## 4. Table List by Cluster

### 4.1 AP Cluster (Pawlos)
| Table | Description |
| :--- | :--- |
| `ap_annual_audit_plans` | Root aggregate for yearly audit strategy |
| `ap_plan_allocations` | Hierarchical allocation tree (National/Region/Tax Center) |
| `ap_plan_versions` | Version history of plan changes |
| `ap_audit_cases` | Central case file for taxpayer audits |
| `ap_audit_referrals` | Internal/external audit requests |
| `ap_auditor_profiles` | Internal auditor profiles (skills, capacity, tax center) |
| `ap_auditor_workload` | Current workload per auditor |
| `ap_audit_work_logs` | Daily work logs per case |

### 4.2 EX Cluster (Oliad)
| Table | Description |
| :--- | :--- |
| `ex_audit_plans` | Case-specific audit plans for Desk & Comprehensive |
| `ex_desk_audit_details` | Desk audit-specific data |
| `ex_desk_audit_evidence` | Evidence collected during desk audit |
| `ex_comprehensive_audit_details` | Comprehensive audit-specific data |
| `ex_caat_runs` | CAAT execution records |
| `ex_benchmark_comparisons` | Industry benchmark comparisons |
| `ex_third_party_matches` | Third-party data matches |
| `ex_query_sheets` | Query sheets sent to taxpayers |
| `ex_sample_selections` | Audit sample selections |
| `ex_zone_reports` | Multi-zone consolidated reports |

### 4.3 TP Cluster (Borifa)
| Table | Description |
| :--- | :--- |
| `tp_risk_assessments` | Transfer pricing risk assessments |
| `tp_working_hypotheses` | Working hypotheses with revenue at risk |
| `tp_audit_plans` | TP audit plans |
| `tp_field_work_data` | TP field work data |
| `tp_fact_statements` | Versioned fact statements |
| `tp_analysis_results` | Reproducible TP analysis results |
| `tp_arm_length_analyses` | Arm's length price/profit range |
| `tp_audit_reports` | Versioned TP audit reports |

### 4.4 JA Cluster (Yoseph)
| Table | Description |
| :--- | :--- |
| `ja_joint_audits` | Joint audit aggregate root |
| `ja_committees` | Joint Audit Committees |
| `ja_teams` | Joint audit teams |
| `ja_plans` | Joint audit plans |
| `ja_workspaces` | Federated workspace configurations |
| `ja_execution_reports` | Joint audit execution reports |

### 4.5 CM Cluster (Yoseph)
| Table | Description |
| :--- | :--- |
| `cm_audit_notices` | Audit notices generated |
| `cm_alternative_delivery` | Alternative delivery tracking |
| `cm_entry_conferences` | Entry conference records |

### 4.6 RF Cluster (Yoseph)
| Table | Description |
| :--- | :--- |
| `rf_audit_reports` | Final audit reports |
| `rf_approvals` | Multi-level approval history |
| `rf_exit_conferences` | Exit conference records |
| `rf_assessment_notices` | Assessment notices |
| `rf_taxpayer_responses` | Taxpayer response records |

### 4.7 QA Cluster (Oliad)
| Table | Description |
| :--- | :--- |
| `qa_reviews` | Quality assurance reviews |
| `qa_recommendations` | QA recommendations |
| `qa_sampling_seeds` | Auditable sampling seeds |

### 4.8 IA Cluster (Borifa)
| Table | Description |
| :--- | :--- |
| `ia_issue_audits` | Issue audit aggregate root |
| `ia_issue_audit_scopes` | Scope items for issue audits |
| `ia_issue_audit_reports` | Versioned issue audit reports |
| `ia_field_visit_findings` | Field visit findings |

### 4.9 Shared Infrastructure (All Clusters)
| Table | Description |
| :--- | :--- |
| `shared_audit_trail_entries` | Immutable audit trail (7-year retention) |
| `shared_outbox_entries` | Transactional outbox for event publishing |
| `shared_documents` | Document storage metadata |
| `shared_notifications` | Notification log |

---

## 5. Key Relationships

| Relationship | Type | Tables |
| :--- | :--- | :--- |
| Plan → Cases | One-to-Many | `ap_annual_audit_plans` → `ap_audit_cases` |
| Case → Desk Detail | One-to-One | `ap_audit_cases` → `ex_desk_audit_details` |
| Case → Comp Detail | One-to-One | `ap_audit_cases` → `ex_comprehensive_audit_details` |
| Case → Issue Audit | One-to-One | `ap_audit_cases` → `ia_issue_audits` |
| Case → TP Analysis | One-to-One | `ap_audit_cases` → `tp_analysis_results` |
| Case → Joint Audit | One-to-One | `ap_audit_cases` → `ja_joint_audits` |
| Case → Audit Report | One-to-One | `ap_audit_cases` → `rf_audit_reports` |
| Issue Audit → Scope | One-to-Many | `ia_issue_audits` → `ia_issue_audit_scopes` |
| Plan → Allocations | One-to-Many | `ap_annual_audit_plans` → `ap_plan_allocations` |
| QA Review → Recommendations | One-to-Many | `qa_reviews` → `qa_recommendations` |

---

## 6. Indexing Strategy

### 6.1 Primary Keys
All tables use UUID primary keys with default `gen_random_uuid()`.

### 6.2 Foreign Keys
All foreign key columns are indexed.

### 6.3 Critical Performance Indexes

| Table | Index | Type | Purpose |
| :--- | :--- | :--- | :--- |
| `ap_audit_cases` | `(tin, status)` | B-Tree | Find active cases for a taxpayer |
| `ap_audit_cases` | `(tax_center_code, status)` | B-Tree | Find cases by tax center |
| `ap_annual_audit_plans` | `(year, status)` | B-Tree | Find plans by year and status |
| `ap_plan_allocations` | `(annual_plan_id, tax_center_code)` | B-Tree | Cascade engine queries |
| `ex_comprehensive_audit_details` | `(audit_case_id)` | B-Tree | Case detail lookup |
| `ia_issue_audits` | `(audit_case_id, status)` | B-Tree | Issue audit status queries |
| `shared_audit_trail_entries` | `(entity_type, entity_id)` | B-Tree | Audit trail lookup |
| `shared_audit_trail_entries` | `(actor_id)` | B-Tree | User activity history |
| `shared_outbox_entries` | `(processed_at)` | B-Tree | Outbox poller performance |

---

## 7. Flyway Migration Strategy

| File Naming | Pattern | Example |
| :--- | :--- | :--- |
| **Baseline** | `V1__initial_schema.sql` | Shared tables + AP tables |
| **Feature** | `V2__ex_desk_audit_tables.sql` | EX cluster tables |
| **Feature** | `V3__tp_tables.sql` | TP cluster tables |
| **Feature** | `V4__ja_tables.sql` | JA cluster tables |
| **Feature** | `V5__ia_tables.sql` | IA cluster tables |
| **Feature** | `V6__qa_tables.sql` | QA cluster tables |
| **Feature** | `V7__cm_rf_tables.sql` | CM + RF cluster tables |

**Rule:** Each cluster owner is responsible for their own Flyway migration files. Pawlos owns `V1__initial_schema.sql` (shared tables). Oliad owns `V2__ex_tables.sql` and `V6__qa_tables.sql`. Borifa owns `V3__tp_tables.sql` and `V5__ia_tables.sql`. Yoseph owns `V4__ja_tables.sql` and `V7__cm_rf_tables.sql`.

---

## 8. Data Retention Policy

| Data Type | Retention | Action |
| :--- | :--- | :--- |
| **Audit Trail** | 7 years | Immutable, append-only |
| **Active Cases** | Until closure | Archived after CLOSED |
| **Closed Cases** | 7 years | Archived after closure |
| **Outbox Events** | 30 days | Purged after processed |
| **Notifications** | 90 days | Purged after sent |

