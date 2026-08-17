# Business Use Cases (BUCs)

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document provides a detailed catalog of all 25 Business Use Cases (BUC-TA-001 to BUC-TA-025), organized by cluster. Each BUC includes its description, primary actors, triggers, pre-conditions, and post-conditions.

---

## 1. Cluster AP — Audit Planning & Setup

### TA-001: Create and Approve Annual Audit Plan

| Attribute | Detail |
| :--- | :--- |
| **Description** | Audit Team creates the annual plan. System generates a Risk-Proposal (Heatmap + Capacity). Plan is distributed to Regions → Tax Centers for feedback. Director reviews, Senior Management approves. Fan-in gate ensures all Tax Centers confirm deployment before finalization. |
| **Primary Actors** | Audit Team, Audit Director, Regional Directors, Tax Center Managers, Senior Management |
| **Triggers** | New fiscal year begins; planning cycle starts. |
| **Pre-Conditions** | Risk Engine is available; Auditor profiles are seeded. |
| **Post-Conditions** | Final approved plan exists. Ready for cascade. |

---

### TA-002: Cascade Audit Plan to Case Level & Intake Referrals

| Attribute | Detail |
| :--- | :--- |
| **Description** | Approved plan is cascaded to individual cases. System queries Risk Engine per Tax Center allocation and materializes Audit Cases. Internal/External referrals are also converted to cases. |
| **Primary Actors** | Process Owner, Audit Team |
| **Triggers** | Plan reaches `FINALIZED` status. |
| **Pre-Conditions** | Approved plan exists. Risk Engine is available. |
| **Post-Conditions** | Cases exist with unique reference numbers, linked to plan. |

---

### TA-003: Select and Prioritize Audit Cases

| Attribute | Detail |
| :--- | :--- |
| **Description** | Process Owner views blended case pool (Risk + Referrals + Manual). Selects cases, attaches Treatment Plans. Supports random sampling for risk model validation. |
| **Primary Actors** | Process Owner |
| **Triggers** | Cases are created (TA-002). |
| **Pre-Conditions** | Cases exist. Risk Engine is available. |
| **Post-Conditions** | Cases marked `SELECTED_FOR_AUDIT` with Treatment Plans. |

---

### TA-004: Assign Cases to Auditors

| Attribute | Detail |
| :--- | :--- |
| **Description** | Standard Delegation: Process Owner / Tax Center Manager assigns to Team Leader. Team Leader assigns to Auditor. Committee Delegation: Process Owner assigns to Joint Committee / TP Committee. |
| **Primary Actors** | Process Owner, Tax Center Manager, Team Leader, Committees |
| **Triggers** | Cases are selected (TA-003). |
| **Pre-Conditions** | Auditor/Committee profiles exist. |
| **Post-Conditions** | Cases assigned. SLA timer started. |

---

## 2. Cluster EX — Execution

### TA-005: Plan Individual Audit Case

| Attribute | Detail |
| :--- | :--- |
| **Description** | Auditor drafts case-specific plan (materiality, scope, sampling). |
| **Primary Actors** | Auditor, Team Leader |
| **Triggers** | Case is assigned (TA-004). |
| **Pre-Conditions** | Case is assigned. |
| **Post-Conditions** | Audit plan approved. Ready for execution. |

---

### TA-008: Manage Audit Case Progress

| Attribute | Detail |
| :--- | :--- |
| **Description** | Auditors log daily work. Team Leaders monitor progress against plan. SLA timers track inactivity. Auto-forward to investigation if criteria met. |
| **Primary Actors** | Auditor, Team Leader |
| **Triggers** | Case is assigned and in progress. |
| **Pre-Conditions** | Case is assigned. |
| **Post-Conditions** | Work logged. Progress updated. |

---

### TA-009: Conduct Desk Audit

| Attribute | Detail |
| :--- | :--- |
| **Description** | Auditor conducts remote audit using internal data, third-party sources, and taxpayer uploads. Drafts report. Team Leader reviews. Escalates to Comprehensive if big issues found. |
| **Primary Actors** | Auditor, Team Leader, Director |
| **Triggers** | Case is assigned with `auditType = DESK`. |
| **Pre-Conditions** | Plan approved. |
| **Post-Conditions** | Draft report approved OR case escalated. |

---

### TA-010: Conduct Comprehensive Audit

| Attribute | Detail |
| :--- | :--- |
| **Description** | Auditor conducts in-depth audit with CAAT, financial verification, third-party matching, industry benchmarking, and multi-zone consolidation. Multi-level approval. |
| **Primary Actors** | Auditor, Team Leader, Process Owner, Director |
| **Triggers** | Case is assigned with `auditType = COMPREHENSIVE` OR escalated from Desk Audit. |
| **Pre-Conditions** | Plan approved. |
| **Post-Conditions** | Audit Report approved. Ready for finalization. |

---

## 3. Cluster TP — Transfer Pricing

### TA-012: Initiate Transfer Pricing Audit Case

| Attribute | Detail |
| :--- | :--- |
| **Description** | TP Review Committee evaluates risk-based TP cases. Conducts detailed risk assessment. Develops working hypothesis. Approves for full TP audit. |
| **Primary Actors** | TP Review Committee, TP Process Owner |
| **Triggers** | Case flagged for TP (`assignmentRouting = FEDERAL_COMMITTEE`) |
| **Pre-Conditions** | Cases exist. Risk indicators available. |
| **Post-Conditions** | TP Audit initiated. Ready for planning (TA-013). |

---

### TA-013: Plan Transfer Pricing Audit

| Attribute | Detail |
| :--- | :--- |
| **Description** | TP Auditor researches materiality, industry, and sampling. Prepares TP audit plan. Process Owner approves. |
| **Primary Actors** | TP Auditor, TP Process Owner |
| **Triggers** | TP Audit initiated (TA-012). |
| **Pre-Conditions** | Case assigned to TP team. |
| **Post-Conditions** | TP Plan approved. Ready for fieldwork (TA-014). |

---

### TA-014: Conduct TP Audit Fieldwork

| Attribute | Detail |
| :--- | :--- |
| **Description** | TP Auditor issues information requests. Taxpayer submits evidence. Auditor prepares fact statement. Taxpayer reviews and comments. |
| **Primary Actors** | TP Auditor, Taxpayer |
| **Triggers** | Plan approved (TA-013). |
| **Pre-Conditions** | Plan approved. |
| **Post-Conditions** | Fieldwork complete. Fact statement finalized. Ready for analysis (TA-015). |

---

### TA-015: Perform Transfer Pricing Analysis

| Attribute | Detail |
| :--- | :--- |
| **Description** | TP Auditor selects TP method (CUP, TNMM, etc.). Researches comparables. Determines arm's length range. Documents analysis (reproducible, versioned). |
| **Primary Actors** | TP Auditor, Process Owner |
| **Triggers** | Fieldwork complete (TA-014). |
| **Pre-Conditions** | Fieldwork data available. |
| **Post-Conditions** | Analysis complete. Ready for reporting (TA-016). |

---

### TA-016: Prepare and Review TP Audit Report

| Attribute | Detail |
| :--- | :--- |
| **Description** | TP Auditor drafts report. Conducts exit conference. Process Owner approves. Notice generated and sent. Taxpayer accepts or objects. |
| **Primary Actors** | TP Auditor, TP Process Owner, Taxpayer |
| **Triggers** | Analysis complete (TA-015). |
| **Pre-Conditions** | Analysis complete. |
| **Post-Conditions** | Report approved. Case proceeds to finalization. |

---

## 4. Cluster JA — Joint Audit

### TA-006: Select and Form Joint Audit Team

| Attribute | Detail |
| :--- | :--- |
| **Description** | Joint Audit Committee reviews cases. Assesses viability. Forms team and appoints Team Leader. |
| **Primary Actors** | Joint Audit Committee |
| **Triggers** | Cases flagged for Joint Audit. |
| **Pre-Conditions** | Cases exist. Committee members available. |
| **Post-Conditions** | Joint Audit Team formed. Ready for planning (TA-007). |

---

### TA-007: Plan Joint Audit

| Attribute | Detail |
| :--- | :--- |
| **Description** | Joint Audit Team collaboratively plans the audit (materiality, scope, sampling, timelines). Plan submitted to Committee for approval. |
| **Primary Actors** | Joint Audit Team, Joint Audit Committee |
| **Triggers** | Team formed (TA-006). |
| **Pre-Conditions** | Team assigned. |
| **Post-Conditions** | Joint Audit Plan approved. Ready for execution (TA-021). |

---

### TA-021: Execute Joint Audit

| Attribute | Detail |
| :--- | :--- |
| **Description** | Joint Audit Team executes audit in shared workspace (CAAT, assertions, query sheets, third-party matching). Team Leader monitors progress. Consolidated report prepared. |
| **Primary Actors** | Joint Audit Team, Team Leader, Joint Audit Committee |
| **Triggers** | Plan approved (TA-007). |
| **Pre-Conditions** | Plan approved. Shared workspace available. |
| **Post-Conditions** | Execution complete. Ready for finalization (TA-022). |

---

### TA-022: Complete and Finalize Audit

| Attribute | Detail |
| :--- | :--- |
| **Description** | Joint Audit Team finalizes working papers, draft report, exit conference, and assessment notice. Case closed. |
| **Primary Actors** | Joint Audit Team, Team Leader, Committee |
| **Triggers** | Execution complete (TA-021). |
| **Pre-Conditions** | Execution complete. |
| **Post-Conditions** | Case closed. |

---

## 5. Cluster CM — Communication

### TA-017: Issue Audit Notices and Manage Communication

| Attribute | Detail |
| :--- | :--- |
| **Description** | System generates notices (PDF). Sends via Email/SMS. Tracks delivery. Triggers Alternative Delivery Workflow (Mail → Affix → Newspaper) if undelivered. |
| **Primary Actors** | Auditor, Taxpayer |
| **Triggers** | Notice generation required (e.g., after report approval). |
| **Pre-Conditions** | Report approved. |
| **Post-Conditions** | Notice delivered OR alternative delivery triggered. |

---

### TA-019: Conduct Entry Conference with Taxpayer

| Attribute | Detail |
| :--- | :--- |
| **Description** | Auditor schedules, notifies, and conducts initial meeting with taxpayer. Captures meeting notes and audio. Team Leader approves records. Taxpayer confirms receipt. |
| **Primary Actors** | Auditor, Taxpayer, Team Leader |
| **Triggers** | Planning phase requires entry conference. |
| **Pre-Conditions** | Case is assigned. |
| **Post-Conditions** | Conference records approved. |

---

### TA-020: Manage Taxpayer Communication Portal

| Attribute | Detail |
| :--- | :--- |
| **Description** | Secure portal for taxpayers to view notices, upload documents, and communicate with auditors. Orchestrated by Tax Audit Service; UI owned by Portal Team. |
| **Primary Actors** | Taxpayer, Auditor |
| **Triggers** | Taxpayer logs in. |
| **Pre-Conditions** | Taxpayer is registered. |
| **Post-Conditions** | Documents uploaded, messages sent. |

---

## 6. Cluster RF — Reporting & Finalization

### TA-011: Manage Audit Reporting and Finalization

| Attribute | Detail |
| :--- | :--- |
| **Description** | Auditor prepares working papers, draft report, schedules exit conference, and routes report through multi-level approval. Assessment notice generated. Taxpayer responds. |
| **Primary Actors** | Auditor, Team Leader, Process Owner, Director, Taxpayer |
| **Triggers** | Audit execution complete. |
| **Pre-Conditions** | Execution complete. |
| **Post-Conditions** | Case closed OR objection handed off. |

---

### TA-018: Issue Assessment Notice and Conclude Audit

| Attribute | Detail |
| :--- | :--- |
| **Description** | System generates assessment notice (principal, penalties, interest). Taxpayer accepts or objects. Fraud indicators trigger handoff to investigation. Case closed. |
| **Primary Actors** | Auditor, Authorized Official, Taxpayer |
| **Triggers** | Report approved. |
| **Pre-Conditions** | Report approved. |
| **Post-Conditions** | Case closed OR objection handed off OR fraud handoff. |

---

## 7. Cluster QA — Quality Assurance

### TA-023: Conduct Quality Assurance Review

| Attribute | Detail |
| :--- | :--- |
| **Description** | System periodically samples closed cases (auditable random sampling). QA Team reviews, prepares report, recommends follow-up actions, and tracks implementation. |
| **Primary Actors** | QA Team, Team Leader, Process Owner |
| **Triggers** | Scheduled periodic review. |
| **Pre-Conditions** | Cases are closed. |
| **Post-Conditions** | QA Review completed. Recommendations tracked. |

---

### TA-024: Trigger Fraud Investigation

| Attribute | Detail |
| :--- | :--- |
| **Description** | System automatically or manually escalates cases to Fraud Investigation when indicators are detected. Handoff to external Audit Service (Fraud Module). |
| **Primary Actors** | Auditor, Team Leader, System (auto-trigger) |
| **Triggers** | Fraud indicators detected during any audit. |
| **Pre-Conditions** | Case exists. |
| **Post-Conditions** | Fraud handoff triggered. |

---

## 8. Cluster IA — Issue Audit

### TA-025: Issue Audit

| Attribute | Detail |
| :--- | :--- |
| **Description** | Targeted investigation on a specific issue. Notice issued (SLA timer). Scope selected. Evidence gathered (internal/3rd-party/auditee). Field visit findings captured. Report drafted. Team Leader → Process Owner → Director review. Director decides: Report Generated, Fraud Escalated, or Comprehensive Triggered. |
| **Primary Actors** | Auditor, Team Leader, Process Owner, Director, Taxpayer |
| **Triggers** | Issue identified within an open case. |
| **Pre-Conditions** | Parent case exists. |
| **Post-Conditions** | Report generated, fraud handoff, or comprehensive escalation. |

---

## Summary: BUC Count by Cluster

| Cluster | BUCs | Count |
| :--- | :--- | :--- |
| **AP** | TA-001, TA-002, TA-003, TA-004 | 4 |
| **EX** | TA-005, TA-008, TA-009, TA-010 | 4 |
| **TP** | TA-012, TA-013, TA-014, TA-015, TA-016 | 5 |
| **JA** | TA-006, TA-007, TA-021, TA-022 | 4 |
| **CM** | TA-017, TA-019, TA-020 | 3 |
| **RF** | TA-011, TA-018 | 2 |
| **QA** | TA-023, TA-024 | 2 |
| **IA** | TA-025 | 1 |
| **TOTAL** | | **25** |

