# ITAS Joint Audit System — Complete Role Task/Functionality Breakdown

## Executive Summary

The ITAS Joint Audit System has **three primary roles** across **two distinct worlds**:

| World | Role | Primary Purpose |
| :--- | :--- | :--- |
| **Committee World** | Committee Member | Governance — Review, research, vote on cases |
| **Committee World** | Committee Chairperson | Leadership — Finalize decisions, assign teams, handoff to execution |
| **Execution World** | Team Leader | Supervision — Oversee execution, approve work, consolidate reports |
| **Execution World** | Auditor | Execution — Perform audit fieldwork, validate CAAT, create findings |

---

## 1. COMMITTEE MEMBER

**Workspace:** Committee Workspace  
**Primary Focus:** Case review, collaborative research, and advisory voting.

### 1.1. Dashboard & Case Portfolio

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 1 | View Summary Metrics | See total cases, pending viability, your pending votes, overdue cases | BUC-TA-001 |
| 2 | Browse Case List | View all committee cases with filters (status, risk, segment, overdue) | BUC-TA-002 |
| 3 | Search Cases | Search by taxpayer name, TIN, industry, or case ID | BUC-TA-003 |
| 4 | Take Ownership (Checkout) | Lock the case to prevent simultaneous editing | FR-04.0-04 |
| 5 | Release Ownership (Checkin) | Unlock the case after review | FR-04.0-04 |
| 6 | Open Case Dossier | Navigate to full case detail view | BUC-TA-003 |

### 1.2. Case Intelligence & Analysis

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 7 | View Taxpayer Profile | View TIN, segment, industry, registration details, physical address, contacts | FR-04.2-01 |
| 8 | View Risk Assessment | View risk score (0-100), risk priority (High/Medium/Low) | FR-04.1-01 |
| 9 | Drill-Down Risk Criteria | View specific risk engine rules that flagged the taxpayer | FR-04.1-04 |
| 10 | View Filing History | See taxpayer filing compliance history | FR-04.7-18 |
| 11 | View Payment History | See taxpayer payment history | FR-04.7-18 |
| 12 | View Previous Audits | See historical audit findings and adjustments | FR-04.2-03 |
| 13 | View Committee Mandate | Read the committee's specific focus areas | FR-04.10.1-04 |

### 1.3. Collaborative Research

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 14 | Add Research Note | Create a timestamped research note with optional attachments (PDF, Excel, images) | BUC-TA-005 |
| 15 | Reply to Note | Add a comment to any existing research note thread | BUC-TA-005 |
| 16 | View Attachments | Preview/download files attached to research notes | BUC-TA-005 |
| 17 | View All Notes | See chronological feed of all research notes | BUC-TA-005 |

### 1.4. Advisory Voting

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 18 | Cast Advisory Vote | Choose Approve / Reject / More Info with optional comment | BUC-TA-003 |
| 19 | View Vote Tally | See live vote counts and segmented progress bar | BUC-TA-003 |
| 20 | View Individual Votes | See how other members voted with their reasoning | BUC-TA-003 |

### 1.5. Auditor Nomination

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 21 | Nominate Auditor | Suggest an auditor for the joint audit team from the eligible pool | BUC-TA-006 |
| 22 | View Nominations | See who has been nominated and by whom | BUC-TA-006 |

---

## 2. COMMITTEE CHAIRPERSON

**Workspace:** Committee Workspace  
**Primary Focus:** Leadership, decision-making, team formation, and handoff to execution.

**Inherits all Committee Member permissions** + the following exclusive functions:

### 2.1. Team Formation

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 23 | Appoint Team Leader | Select and appoint a Team Leader from the auditor pool | BUC-TA-006 |
| 24 | Assign Official Team | Select multiple auditors to form the official joint audit team | BUC-TA-006 |
| 25 | Generate Case Code | System generates unique case number upon team assignment | BUC-TA-002 |

### 2.2. Viability Decision

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 26 | Finalize Viability | Approve or reject the case for joint audit | BUC-TA-003 |
| 27 | Apply Digital Signature | System signs the decision with cryptographic hash | BUC-TA-003 |

### 2.3. Legal & Administrative Actions

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 28 | Send Final Report | Dispatch the approved audit plan to taxpayer | BUC-TA-023 |
| 29 | Escalate to Fraud | Trigger fraud investigation workflow | BUC-TA-024 |
| 30 | Publish Assessment | Publish legally binding assessment notice | BUC-TA-019 |
| 31 | Override SLA Deadline | Extend the case deadline with mandatory reason | BUC-TA-003 |

### 2.4. Session Management

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 32 | Create Committee Session | Create a new committee session for case review | BUC-TA-006 |
| 33 | Assign Members to Session | Add/remove committee members from a session | BUC-TA-006 |
| 34 | Schedule Meeting | Schedule committee meetings | BUC-TA-006 |

---

## 3. TEAM LEADER

**Workspace:** Execution Workspace  
**Primary Focus:** Supervision, quality assurance, approval, and final reporting.

### 3.1. Dashboard & Overview

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 35 | View Team Summary | See active cases, pending plans, pending reports, overdue segments | BUC-TA-004 |
| 36 | View Team Workload | See each auditor's active cases, progress, and capacity utilization | BUC-TA-004 |
| 37 | View Urgent Alerts | See no-activity alerts, deadline warnings, review requests | BUC-TA-008 |
| 38 | View Pending Approvals | See plans and findings awaiting review | BUC-TA-008 |
| 39 | Browse Team Cases | View all cases assigned to the team with filters | BUC-TA-004 |

### 3.2. Case Workspace — Overview & Plan Approval

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 40 | View Case Intelligence | Read-only view of risk details, committee notes, taxpayer profile | BUC-TA-007 |
| 41 | View Audit Plan | Read-only view of submitted audit plan (materiality, scope, sampling) | FR-04.10.2-07 |
| 42 | View Auditor Activity | See latest work log entries from the assigned auditor | BUC-TA-008 |
| 43 | View Documents | Quick access to evidence and working papers | BUC-TA-011 |
| 44 | Approve Audit Plan | Accept the auditor's audit plan | FR-04.10.2-08 |
| 45 | Request Plan Revisions | Send plan back with specific comments | BUC-TA-005 |

### 3.3. CAAT Monitoring

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 46 | View CAAT Status | See eligibility, execution status, progress | FR-04.4-01 |
| 47 | View Anomaly Summary | See counts by severity (Critical/High/Medium/Low) | FR-04.4-14 |
| 48 | View Anomaly List | Read-only list of anomalies with disposition status | BUC-TA-010 |
| 49 | Monitor Auditor Validation | See which anomalies are pending/processed | BUC-TA-010 |

### 3.4. Findings Review

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 50 | View Findings List | See all submitted findings with status (Pending/Approved/Returned) | BUC-TA-011 |
| 51 | View Finding Detail | See description, evidence, side-by-side CAAT comparison | FR-04.4-14 |
| 52 | Approve Finding | Accept the auditor's finding | BUC-TA-023 |
| 53 | Reject Finding | Reject the finding with mandatory reason | BUC-TA-023 |
| 54 | Return for Revision | Send finding back to auditor with comments | BUC-TA-023 |
| 55 | Request More Evidence | Ask auditor for additional supporting documents | BUC-TA-011 |

### 3.5. Consolidated Report & Final Submission

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 56 | View Report Status | See if report is Draft/Generated/Submitted | BUC-TA-023 |
| 57 | Generate Report | Auto-generate consolidated report from approved findings | BUC-TA-023 |
| 58 | Edit Executive Summary | Modify the auto-generated summary | BUC-TA-023 |
| 59 | View Adjustments Table | See all approved adjustments with totals | FR-04.4-34 |
| 60 | Apply Digital Signature | Sign the report with confirmation checkbox | FR-04.10.2-11 |
| 61 | Submit to Committee | Send final report to Joint Audit Committee | BUC-TA-023 |

### 3.6. Administrative Overrides

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 62 | Reassign Case | Reassign case to another auditor (with mandatory reason) | FR-04.1-07 |
| 63 | Extend Deadline | Extend case deadline (with mandatory reason) | FR-04.1-08 |
| 64 | Escalate to Fraud | Escalate case to fraud investigation (with evidence) | FR-04.4-28 |

---

## 4. AUDITOR

**Workspace:** Execution Workspace  
**Primary Focus:** Full case execution — planning, fieldwork, CAAT validation, evidence, findings, and reporting.

### 4.1. Dashboard & Assignment

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 65 | View My Cases | See assigned cases with status and due dates | BUC-TA-004 |
| 66 | View Pending Actions | See tasks: Plan, CAAT, Evidence, Findings | BUC-TA-008 |
| 67 | Accept Assignment | Confirm acceptance of newly assigned case | BUC-TA-006 |
| 68 | Decline Assignment | Decline with mandatory reason | BUC-TA-006 |

### 4.2. Audit Planning

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 69 | View Case Intelligence | Full taxpayer profile, risk details, committee notes | FR-04.10.2-01 |
| 70 | Define Materiality | Set planning and performance materiality | FR-04.10.2-04 |
| 71 | Define Scope | Describe audit scope, objectives, resources | FR-04.10.2-04 |
| 72 | Select Sampling Method | Choose Stratified/Random/Monetary Unit Sampling | FR-04.10.2-06 |
| 73 | Define Work Plan | Create work items by tax type with priorities | FR-04.10.2-07 |
| 74 | Save Draft | Save plan progress | BUC-TA-005 |
| 75 | Submit Plan | Submit plan to Team Leader for approval | FR-04.10.2-07 |

### 4.3. Entry Conference

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 76 | Schedule Meeting | Set date, time, venue | BUC-TA-019 |
| 77 | Send Invitation | Notify taxpayer and participants | BUC-TA-019 |
| 78 | Record Minutes | Document meeting discussions, internal controls review, premises inspection | BUC-TA-019 |
| 79 | Upload Evidence | Attach audio recordings, photos, signed attendance | BUC-TA-019 |
| 80 | Submit for Approval | Send conference records to Team Leader | BUC-TA-019 |

### 4.4. Document Verification

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 81 | Create Document Request | Request documents from taxpayer with priority and due date | BUC-TA-020 |
| 82 | Track Request Status | See Draft/Sent/Viewed/Uploaded/Verified/Rejected | BUC-TA-020 |
| 83 | Preview Uploads | View taxpayer-uploaded documents | BUC-TA-020 |
| 84 | Verify Document | Approve document as verified | FR-04.4-04 |
| 85 | Reject Document | Reject with mandatory comment | BUC-TA-020 |
| 86 | Request Additional Docs | Request more documents with comment | BUC-TA-020 |

### 4.5. CAAT Analysis

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 87 | Check Eligibility | View CAAT eligibility status from Risk Engine | FR-04.4-01 |
| 88 | Select Analyses | Choose: Ratio, Third-Party, Transaction, Revenue, Expense, Fraud | FR-04.4-14 |
| 89 | Run CAAT | Execute selected analyses | FR-04.4-01 |
| 90 | View Anomalies | Review CAAT-generated anomalies | FR-04.4-14 |
| 91 | Accept Anomaly | Agree with CAAT recommendation | FR-04.4-14 |
| 92 | Amend Anomaly | Modify value with mandatory reason | FR-04.4-14 |
| 93 | Reject Anomaly | Reject finding with mandatory reason | FR-04.4-14 |
| 94 | Generate CAAT Report | Create report from validated anomalies | FR-04.4-14 |

### 4.6. Evidence & Working Papers

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 95 | Upload Evidence | Upload supporting documents with category | BUC-TA-011 |
| 96 | View Evidence | Browse and preview uploaded files | BUC-TA-011 |
| 97 | Link Evidence to Finding | Associate evidence with specific findings | BUC-TA-011 |
| 98 | Upload Working Paper | Upload calculation sheets, analysis documents | BUC-TA-022 |
| 99 | Version Control | Track working paper versions | BUC-TA-022 |

### 4.7. Findings Creation & Submission

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 100 | Create Manual Finding | Add finding not from CAAT (field work observation) | BUC-TA-011 |
| 101 | Link CAAT Results | Associate CAAT anomalies with findings | BUC-TA-011 |
| 102 | Link Evidence | Attach supporting documents to findings | BUC-TA-011 |
| 103 | Set Severity | Assign Critical/High/Medium/Low | BUC-TA-011 |
| 104 | Set Financial Impact | Enter adjustment amount (ETB) | BUC-TA-011 |
| 105 | Save Draft | Save finding draft | BUC-TA-011 |
| 106 | Submit Findings | Submit all findings to Team Leader | BUC-TA-023 |

### 4.8. Report Drafting

| # | Task | Functionality | Source |
| :--- | :--- | :--- | :--- |
| 107 | View Report Draft | Auto-compiled from approved findings | BUC-TA-011 |
| 108 | Add Narrative | Add executive summary and commentary | BUC-TA-011 |
| 109 | View CAAT Comparison | See original CAAT vs amended values | FR-04.4-14 |
| 110 | Export Report | Download as PDF | BUC-TA-011 |
| 111 | Submit to Team Leader | Send final draft for approval | BUC-TA-023 |

---

## 5. ROLE PERMISSIONS MATRIX

| Feature | Committee Member | Committee Chairperson | Team Leader | Auditor |
| :--- | :--- | :--- | :--- | :--- |
| **COMMITTEE WORLD** | | | | |
| View Cases | ✅ | ✅ | ❌ | ❌ |
| Add Research Notes | ✅ | ✅ | ❌ | ❌ |
| Cast Advisory Vote | ✅ | ✅ | ❌ | ❌ |
| Appoint Team Leader | ❌ | ✅ | ❌ | ❌ |
| Finalize Viability | ❌ | ✅ | ❌ | ❌ |
| Assign Official Team | ❌ | ✅ | ❌ | ❌ |
| Transfer to Execution | ❌ | ✅ | ❌ | ❌ |
| **EXECUTION WORLD** | | | | |
| View Team Cases | ❌ | ❌ | ✅ | ❌ |
| View Assigned Cases | ❌ | ❌ | ❌ | ✅ |
| Approve Audit Plan | ❌ | ❌ | ✅ | ❌ |
| Run CAAT | ❌ | ❌ | ❌ | ✅ |
| Validate Anomalies | ❌ | ❌ | ❌ | ✅ |
| Create Findings | ❌ | ❌ | ❌ | ✅ |
| Approve Findings | ❌ | ❌ | ✅ | ❌ |
| Generate Report | ❌ | ❌ | ✅ | ❌ |
| Submit to Committee | ❌ | ❌ | ✅ | ❌ |

---

## 6. CASE HANDOFF FLOW

```
COMMITTEE CHAIRPERSON
    │
    ├── Appoints Team Leader (Task 23)
    ├── Assigns Official Team (Task 24)
    └── Creates HandoffRecord (Task 25)
         │
         ▼
    (HandoffRecord stored in database)
         │
         ▼
TEAM LEADER
    │
    ├── Polls pending handoffs (Task 39)
    ├── Imports handoff
    └── ExecutionCase created
         │
         ▼
AUDITOR
    │
    ├── Accepts assignment (Task 67)
    ├── Plans audit (Tasks 69-75)
    ├── Runs CAAT (Tasks 87-94)
    ├── Creates findings (Tasks 100-106)
    └── Submits to Team Leader (Task 106)
         │
         ▼
TEAM LEADER
    │
    ├── Reviews findings (Tasks 50-55)
    ├── Approves/Rejects/Returns
    └── Generates consolidated report (Tasks 56-61)
         │
         ▼
COMMITTEE (Final Approval)
```

---

## 7. SUMMARY

| Role | Primary Responsibility | Key Outputs | Number of Tasks |
| :--- | :--- | :--- | :--- |
| **Committee Member** | Review, Research, Vote | Research notes, votes, nominations | 22 |
| **Committee Chairperson** | Lead, Decide, Transfer | Approved cases, team assignments, handoff records | 12 (additional) |
| **Team Leader** | Supervise, Approve, Report | Approved plans, approved findings, consolidated reports | 30 |
| **Auditor** | Execute, Validate, Document | Audit plans, validated anomalies, findings, draft reports | 47 |