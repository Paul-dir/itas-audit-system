# Traceability Matrix

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This matrix ensures that every Business Use Case (BUC) maps directly to the original Functional Requirements (FR) provided in the Source of Requirements (SoR - Module D). It provides full bidirectional traceability from code to requirement.

---

## Traceability by BUC

| BUC | Name | Cluster | Original FR Reference(s) | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **TA-001** | Create and Approve Annual Audit Plan | AP | FR-04.0-01 to FR-04.0-06 | Implements Risk-Proposal Engine instead of manual entry. |
| **TA-002** | Cascade Audit Plan to Case Level & Intake Referrals | AP | FR-04.0-06, FR-04.1-01 to FR-04.1-03 | Cascades per Tax Center allocation. |
| **TA-003** | Select and Prioritize Audit Cases | AP | FR-04.1-01, FR-04.1-04, FR-04.1-05 | Introduces explicit `source` tracking (Rule 11). |
| **TA-004** | Assign Cases to Auditors | AP | FR-04.1-06 to FR-04.1-10 | Introduces Standard vs Committee delegation routing. |
| **TA-005** | Plan Individual Audit Case | EX | FR-04.2-01 to FR-04.2-12 | Case planning is owned by each specific audit type. |
| **TA-006** | Select and Form Joint Audit Team | JA | FR-04.10.1-01 to FR-04.10.1-07 | Federal committee routing. |
| **TA-007** | Plan Joint Audit | JA | FR-04.10.2-01 to FR-04.10.2-12 | Custom planning logic for Joint audits. |
| **TA-008** | Manage Audit Case Progress | EX / JA | FR-04.1-09 | Shared progress logging. |
| **TA-009** | Conduct Desk Audit | EX | FR-04.3-01 to FR-04.3-08 | Evidence aggregation. Inherited by TA-010 on escalation. |
| **TA-010** | Conduct Comprehensive Audit | EX | FR-04.4-01 to FR-04.4-34 | CAAT, multi-zone consolidation. |
| **TA-011** | Manage Audit Reporting and Finalization | RF | FR-04.7-01 to FR-04.7-42 | Multi-level approval, exit conferences. |
| **TA-012** | Initiate Transfer Pricing Audit Case | TP | FR-04.5-01 to FR-04.5-08 | Federal committee routing. |
| **TA-013** | Plan Transfer Pricing Audit | TP | FR-04.5.1-01 to FR-04.5.1-07 | TP-specific materiality and planning. |
| **TA-014** | Conduct TP Audit Fieldwork | TP | FR-04.5.2-01 to FR-04.5.2-06 | Versioned fact statement. |
| **TA-015** | Perform Transfer Pricing Analysis | TP | FR-04.5.2-07 to FR-04.5.2-11 | Reproducible analysis with versioned parameters. |
| **TA-016** | Prepare and Review TP Audit Report | TP | FR-04.5-20 to FR-04.5-38 | Uses shared CM/RF infrastructure for delivery. |
| **TA-017** | Issue Audit Notices and Manage Communication | CM | FR-04.5-23 to FR-04.5-32 | Alternative delivery workflow. |
| **TA-018** | Issue Assessment Notice and Conclude Audit | RF | FR-04.4-29 to FR-04.4-33 | Assessment tracking and case closure. |
| **TA-019** | Conduct Entry Conference with Taxpayer | CM | FR-04.2.1-01 to FR-04.2.1-05 | Uses shared DMS for audio/minutes upload. |
| **TA-020** | Manage Taxpayer Communication Portal | CM | FR-04.1-09 | Orchestrates portal interactions. |
| **TA-021** | Execute Joint Audit | JA | FR-04.4 (Shared) | Federated workspace data isolation. |
| **TA-022** | Complete and Finalize Audit | RF | FR-04.7 (Shared) | Reuses RF flow. |
| **TA-023** | Conduct Quality Assurance Review | QA | FR-04.9.2-01 to FR-04.9.2-13 | Cryptographic random sampling. |
| **TA-024** | Trigger Fraud Investigation | QA | FR-04.4-28 | Handoff to external Audit Service module. |
| **TA-025** | Issue Audit | IA | FR-04.6-01 to FR-04.6-07 | SLA timer on notices, revision cap (Rule max=3). |
