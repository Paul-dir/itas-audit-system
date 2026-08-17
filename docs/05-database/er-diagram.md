# ER Diagram

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document provides an Entity-Relationship (ER) diagram for the ITAS Tax Audit & Investigation Management System. It visually represents the tables, their relationships, and key constraints.

---

## 1. Core Tables and Their Relationships

### 1.1 Shared Infrastructure Tables
| Table | Description | Primary Key | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `shared_audit_trail_entries` | Immutable audit log | `id` (UUID) | None |
| `shared_outbox_entries` | Transactional outbox | `id` (UUID) | None |
| `shared_documents` | Document storage metadata | `id` (UUID) | `entity_type`, `entity_id` |
| `shared_notifications` | Notification log | `id` (UUID) | None |

---

### 1.2 AP Cluster Tables (Pawlos)
| Table | Description | Primary Key | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `ap_annual_audit_plans` | Yearly audit strategy | `id` (UUID) | None |
| `ap_plan_allocations` | Hierarchical allocations | `id` (UUID) | `annual_plan_id` → `ap_annual_audit_plans`, `parent_allocation_id` → `ap_plan_allocations` |
| `ap_plan_versions` | Version history | `id` (UUID) | `annual_plan_id` → `ap_annual_audit_plans` |
| `ap_audit_cases` | Central case file | `id` (UUID) | `annual_plan_id` → `ap_annual_audit_plans`, `escalated_from_case_id` → `ap_audit_cases` |
| `ap_audit_referrals` | Audit requests | `id` (UUID) | `resolved_case_id` → `ap_audit_cases` |
| `ap_auditor_profiles` | Auditor profiles | `id` (String) | None |
| `ap_auditor_workload` | Auditor workload | `auditor_id` (String) | `auditor_id` → `ap_auditor_profiles` |
| `ap_audit_work_logs` | Daily work logs | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |

---

### 1.3 EX Cluster Tables (Oliad)
| Table | Description | Primary Key | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `ex_desk_audit_details` | Desk audit data | `audit_case_id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `ex_desk_audit_evidence` | Desk audit evidence | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `ex_comprehensive_audit_details` | Comprehensive audit data | `audit_case_id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `ex_caat_runs` | CAAT execution records | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `ex_benchmark_comparisons` | Industry benchmarks | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `ex_third_party_matches` | Third-party data matches | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `ex_query_sheets` | Query sheets | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `ex_sample_selections` | Audit samples | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `ex_zone_reports` | Multi-zone reports | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |

---

### 1.4 TP Cluster Tables (Borifa)
| Table | Description | Primary Key | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `tp_risk_assessments` | TP risk assessments | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `tp_working_hypotheses` | Working hypotheses | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `tp_audit_plans` | TP audit plans | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `tp_field_work_data` | TP field work | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `tp_fact_statements` | Versioned fact statements | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `tp_analysis_results` | TP analysis results | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `tp_arm_length_analyses` | Arm's length analyses | `id` (UUID) | `analysis_result_id` → `tp_analysis_results` |
| `tp_audit_reports` | TP audit reports | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |

---

### 1.5 JA Cluster Tables (Yoseph)
| Table | Description | Primary Key | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `ja_joint_audits` | Joint audit root | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `ja_committees` | Joint Audit Committees | `id` (UUID) | None |
| `ja_teams` | Joint audit teams | `id` (UUID) | `joint_audit_id` → `ja_joint_audits` |
| `ja_plans` | Joint audit plans | `id` (UUID) | `joint_audit_id` → `ja_joint_audits` |
| `ja_workspaces` | Federated workspaces | `id` (UUID) | None |
| `ja_execution_reports` | Joint audit reports | `id` (UUID) | `joint_audit_id` → `ja_joint_audits` |

---

### 1.6 CM Cluster Tables (Yoseph)
| Table | Description | Primary Key | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `cm_audit_notices` | Audit notices | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `cm_alternative_delivery` | Alternative delivery | `id` (UUID) | `notice_id` → `cm_audit_notices` |
| `cm_entry_conferences` | Entry conferences | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |

---

### 1.7 RF Cluster Tables (Yoseph)
| Table | Description | Primary Key | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `rf_audit_reports` | Final audit reports | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `rf_approvals` | Approval history | `id` (UUID) | `report_id` → `rf_audit_reports` |
| `rf_exit_conferences` | Exit conferences | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `rf_assessment_notices` | Assessment notices | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `rf_taxpayer_responses` | Taxpayer responses | `id` (UUID) | `assessment_notice_id` → `rf_assessment_notices` |

---

### 1.8 QA Cluster Tables (Oliad)
| Table | Description | Primary Key | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `qa_reviews` | QA reviews | `id` (UUID) | `source_audit_case_id` → `ap_audit_cases` |
| `qa_recommendations` | QA recommendations | `id` (UUID) | `qa_review_id` → `qa_reviews` |
| `qa_sampling_seeds` | Auditable sampling seeds | `id` (UUID) | None |

---

### 1.9 IA Cluster Tables (Borifa)
| Table | Description | Primary Key | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `ia_issue_audits` | Issue audit root | `id` (UUID) | `audit_case_id` → `ap_audit_cases` |
| `ia_issue_audit_scopes` | Scope items | `id` (UUID) | `issue_audit_id` → `ia_issue_audits` |
| `ia_issue_audit_reports` | Issue audit reports | `id` (UUID) | `issue_audit_id` → `ia_issue_audits` |
| `ia_field_visit_findings` | Field visit findings | `id` (UUID) | `issue_audit_id` → `ia_issue_audits` |

---

## 2. Key Relationships

| Relationship | Type | From | To |
| :--- | :--- | :--- | :--- |
| Plan → Cases | One-to-Many | `ap_annual_audit_plans` | `ap_audit_cases` |
| Plan → Allocations | One-to-Many | `ap_annual_audit_plans` | `ap_plan_allocations` |
| Case → Desk Detail | One-to-One | `ap_audit_cases` | `ex_desk_audit_details` |
| Case → Comp Detail | One-to-One | `ap_audit_cases` | `ex_comprehensive_audit_details` |
| Case → Issue Audit | One-to-One | `ap_audit_cases` | `ia_issue_audits` |
| Case → Joint Audit | One-to-One | `ap_audit_cases` | `ja_joint_audits` |
| Case → Audit Report | One-to-One | `ap_audit_cases` | `rf_audit_reports` |
| Issue Audit → Scope | One-to-Many | `ia_issue_audits` | `ia_issue_audit_scopes` |
| QA Review → Recommendations | One-to-Many | `qa_reviews` | `qa_recommendations` |
| Assessment → Responses | One-to-Many | `rf_assessment_notices` | `rf_taxpayer_responses` |
| Report → Approvals | One-to-Many | `rf_audit_reports` | `rf_approvals` |
| All tables → Audit Trail | One-to-Many | All tables | `shared_audit_trail_entries` |

---

## 3. Key Relationships Diagram (Text)
