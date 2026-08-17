# Aggregates

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document provides a detailed description of each aggregate root in the ITAS Tax Audit System. Each aggregate includes its fields, state machine, and key methods.

---

## 1. AnnualAuditPlan (AP Cluster)

**Purpose:** The yearly strategy for audit selection. Contains hierarchical PlanAllocation items for National, Region, and Tax Center levels.

### Key Fields
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier |
| `year` | Integer | Fiscal year |
| `name` | String | Plan name |
| `status` | PlanStatus | DRAFT, PROPOSAL_GENERATED, REGIONAL_FEEDBACK, TAX_CENTER_FEEDBACK, SENIOR_MGMT_REVIEW, FINALIZED |
| `allocations` | List\<PlanAllocation\> | Tree of allocations (National → Region → Tax Center) |
| `createdBy` | String | Actor ID who created the plan |
| `createdAt` | Instant | Creation timestamp |

### State Machine
```text
DRAFT → PROPOSAL_GENERATED (Generate Proposal)
PROPOSAL_GENERATED → REGIONAL_FEEDBACK (Director Approves for Feedback)
REGIONAL_FEEDBACK → TAX_CENTER_FEEDBACK (Regional Directors Distribute)
TAX_CENTER_FEEDBACK → REGIONAL_FEEDBACK (Tax Centers Submit Feedback)
REGIONAL_FEEDBACK → SENIOR_MGMT_REVIEW (Director Submits to Senior Mgmt)
SENIOR_MGMT_REVIEW → FINALIZED (Senior Management Approves)
SENIOR_MGMT_REVIEW → REGIONAL_FEEDBACK (Senior Management Rejects)
FINALIZED → (Terminal)
```

---

## 2. AuditCase (AP Cluster)

**Purpose:** The central case file for a taxpayer audit. Generated from the `AnnualAuditPlan` cascade. Tracked globally.

### Key Fields
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier |
| `tin` | String | Taxpayer Identification Number |
| `taxCenterCode` | String | Local execution unit (NULL for TP/JA) |
| `auditType` | AuditType | DESK, COMPREHENSIVE, TP, JOINT, ISSUE |
| `source` | SourceType | RISK_ENGINE, INTERNAL_REFERRAL, etc. |
| `status` | CaseStatus | CREATED, SELECTED_FOR_AUDIT, ASSIGNED, IN_PROGRESS, COMPLETED, CLOSED |
| `assignmentRouting` | AssignmentRouting | STANDARD_DELEGATION, COMMITTEE_DELEGATION |
| `assignedTeamLeaderId` | String | Assigned TL |
| `assignedAuditorId` | String | Assigned Auditor |
| `committeeId` | String | Assigned Committee (for TP/JA) |

### State Machine
```text
CREATED → SELECTED_FOR_AUDIT (Process Owner Selects)
SELECTED_FOR_AUDIT → ASSIGNED (Assignment Service Runs)
ASSIGNED → IN_PROGRESS (Execution Begins)
IN_PROGRESS → COMPLETED (Report Approved)
COMPLETED → CLOSED (Assessment Accepted / Resolved)
```

---

## 3. ExAuditPlan (EX Cluster)

**Purpose:** The specific audit plan for Desk and Comprehensive audits, defining materiality, scope, and sampling.

### Key Fields
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier |
| `caseId` | UUID | Reference to parent `AuditCase` |
| `materialityThreshold` | BigDecimal | Determined materiality limit |
| `samplingConfig` | AuditSamplingConfiguration | Chosen sampling parameters |
| `status` | PlanStatus | DRAFT, SUBMITTED, APPROVED, REJECTED |
| `scopeDescription` | String | Narrative of scope |

---

## 4. IssueAudit (IA Cluster)

**Purpose:** Targeted investigation within an existing case, bounded by a strict revision cap and SLA timer.

### Key Fields
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier |
| `caseId` | UUID | Parent `AuditCase` |
| `status` | IssueAuditStatus | NOTICE_ISSUED, SCOPE_SELECTED, EVIDENCE_GATHERED, DRAFT_REVIEW, DIRECTOR_REVIEW, COMPLETED |
| `revisionCount` | Integer | Tracks number of revisions (Max 3) |
| `directorDecision` | String | REPORT_GENERATED, FRAUD_ESCALATED, COMPREHENSIVE_TRIGGERED |

---

## 5. JointAuditPlan (JA Cluster)

**Purpose:** Plan specific to cross-authority joint audits. Includes federated workspace references.

### Key Fields
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier |
| `caseId` | UUID | Reference to parent `AuditCase` |
| `participatingAuthorities`| List\<String\> | List of involved agencies |
| `federatedWorkspaceId` | String | Reference to shared DMS workspace |
| `status` | PlanStatus | DRAFT, COMMITTEE_REVIEW, APPROVED |

---

## 6. AuditReport (RF Cluster)

**Purpose:** The final report generated upon execution completion. Triggers the Assessment Notice.

### Key Fields
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier |
| `caseId` | UUID | Reference to parent `AuditCase` |
| `principalAmount` | BigDecimal | Original tax due |
| `penaltyAmount` | BigDecimal | Calculated penalty |
| `interestAmount` | BigDecimal | Calculated interest |
| `approvals` | List\<Approval\> | Track multi-level approvals |
| `status` | ReportStatus | DRAFT, TL_REVIEW, PO_REVIEW, DIRECTOR_REVIEW, APPROVED |
