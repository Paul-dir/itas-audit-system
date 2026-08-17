# Actors and Roles

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document defines all the human and system actors interacting with the ITAS Audit System, mapping their responsibilities and permissions.

---

## 1. System Users (Internal)

| Actor / Role | Description | Primary Clusters | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **Auditor** | The primary field executioner. | EX, TP, IA | Conducts desk/comprehensive audits. Gathers evidence, executes CAAT, drafts reports. |
| **Team Leader** | Immediate supervisor of a team of auditors. | EX, TP, JA, IA | Approves draft reports, reviews working papers, manages workload, conducts QA. |
| **Tax Center Manager** | Head of a specific local Tax Center. | AP, EX | Reviews local audit plan feedback. Assigns cases to Team Leaders (Standard Delegation). |
| **Process Owner** | Subject matter expert / Audit Directorate head. | AP, EX, TP, JA | Assesses referrals, selects cases, assigns cases to Committees (TP/JA) or Team Leaders (Standard). |
| **Audit Director** | High-level executive at National or Regional level. | AP, IA | Approves annual audit plan, makes final decisions on fraud escalations and issue audit handoffs. |
| **Joint Audit Committee** | Cross-functional or cross-border committee. | JA | Reviews joint audit requests, forms joint audit teams, appoints Team Leaders, approves joint plans. |
| **TP Review Committee** | Specialized committee for Transfer Pricing. | TP | Evaluates TP risks, develops working hypotheses, assigns cases to TP audit teams. |
| **QA Team** | Independent quality assurance unit. | QA | Selects closed cases (random sampling), conducts reviews, issues recommendations. |
| **Fraud Investigator** | External role in the Audit System context. | IA, QA | Receives handoffs when fraud indicators are confirmed. |

---

## 2. External Users

| Actor / Role | Description | Primary Clusters | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **Taxpayer / Auditee** | The entity being audited. | CM, RF, TP, IA | Uploads requested documents, receives notices, attends entry/exit conferences, accepts/objects to assessments. |
| **Third-Party Providers** | Banks, customs, registration authorities. | EX (Data source) | Provides data for cross-matching during comprehensive audits. |

---

## 3. System Actors (Automated)

| System Actor | Description | Key Responsibilities |
| :--- | :--- | :--- |
| **Risk-Proposal Engine** | Internal domain service | Generates the draft Annual Audit Plan by combining Risk Engine heatmaps with internal Auditor Capacity. |
| **Assignment Service** | Internal domain service | Executes standard and committee delegation paths. Enforces workload limits and skill matching. |
| **Workflow Engine** | Internal State Machine | Enforces SLA timers (e.g., 30-day Issue Audit notice expiry), manages approval chains, and triggers Alternative Delivery. |
| **Risk Engine** | External REST Service | Provides risk scores, heatmaps, and random samples based on taxpayer filing/payment history. |
