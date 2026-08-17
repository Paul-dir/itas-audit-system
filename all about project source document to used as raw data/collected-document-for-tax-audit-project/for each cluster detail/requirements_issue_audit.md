# Issue Audit - Requirements Document

## Introduction

Issue Audit is **one audit TYPE** within the central **Tax Audit module** of the Tax Audit Core Server. The Tax Audit module contains multiple audit types (Transfer Pricing, Issue, Desk, Comprehensive, and others), all operating on a **shared central Audit aggregate root** for case management.

This specification defines Issue Audit functionality strictly per source requirements FR-04.6-01 through FR-04.6-07. It:
- Operates POST-ASSIGNMENT (case is already assigned to the auditor for a specific identified issue)
- Extends the central Audit aggregate with Issue-specific child entities and workflow
- Reuses shared audit infrastructure: Case, Taxpayer, User, Organization, Document, Workflow, Audit History
- Does NOT create a separate Issue-specific aggregate root; instead adds an Issue audit type discriminator and Issue-specific child entities/value objects to the shared Audit aggregate
- Does NOT include requirements outside FR-04.6-01 to FR-04.6-07 (no planning/programming, entry conference, notice generation, assessment, or objection-handling requirements are in scope of this document)

The Issue Audit lifecycle covered here is: notify auditee → select transactions/areas based on identified issue → gather evidence (internal, third-party, and auditee-uploaded) → capture field visit findings (if required) → draft report and route through Team Leader review → Process Owner review → Director review and follow-up decision (finalize report, refer to fraud investigation, or trigger Comprehensive Audit).

## Glossary

- **Tax_Audit_Module**: Central module in Tax Audit Core Server supporting multiple audit types (Transfer Pricing, Issue, Desk, Comprehensive, etc.)
- **Audit**: Central aggregate root shared across all audit types; contains audit case, taxpayer reference, assignment, workflow state, and audit-type-specific data
- **Audit_Type**: Discriminator indicating audit type (TRANSFER_PRICING, ISSUE, DESK, COMPREHENSIVE, etc.); determines which phase workflow and rules apply
- **Issue_Audit_Type**: Specific audit type discriminator value for Issue audits; triggers Issue-specific phases, workflow, and business rules
- **Audit_Case**: Reference to the shared central Audit aggregate (synonymous with "Case" in multi-type audit context)
- **Taxpayer / Auditee**: Business entity subject to audit; "Auditee" is the term used in the source requirements (FR-04.6) and is synonymous with Taxpayer
- **Tax_Auditor**: Officer who conducts the issue audit — notifies the auditee, selects transactions, gathers evidence, captures field visit findings, and drafts the report
- **Team_Leader**: First reviewer/approver of the draft audit report
- **Process_Owner**: Second reviewer/approver of the draft audit report, following Team Leader approval
- **Director**: Final internal reviewer of the audit report who determines follow-up action
- **Identified_Issue**: A specific noncompliance key area or tax type that is the basis for the audit
- **Selected_Transaction_Area**: Transactions or areas selected for testing based on the Identified_Issue; child entity of Issue Audit
- **Evidence_Record**: Internal or third-party evidence, or auditee-uploaded documents, gathered on selected transactions; child entity of Issue Audit
- **Field_Visit_Finding**: Findings captured during a field visit, where a field visit is required; child entity of Issue Audit
- **Issue_Audit_Report**: Draft report routed through Team Leader, Process Owner, and Director review; versioned; child entity of Issue Audit
- **Follow_Up_Decision**: The Director's determination after reviewing the approved report — finalize/generate audit report, refer to fraud investigation, or trigger Comprehensive Audit; child entity of Issue Audit
- **Fraud_Investigation_Referral**: Record of a case referred to the "Intelligence and Tax Fraud Investigation" sub-process
- **Comprehensive_Audit_Referral**: Record of a case escalated to trigger the Comprehensive Audit audit type
- **Audit_History**: Complete audit trail recording all actions, decisions, participants, and outcomes throughout the Issue Audit lifecycle; shared infrastructure

## Architectural Foundation

### Core Principle: Issue Audit as Audit Type, Not Module

Issue Audit is **one audit TYPE** within the central **Tax Audit module**. The Tax Audit module defines:

1. **Central Audit Aggregate Root**: Single shared aggregate for all audit types
   - `Audit` entity: Core case entity with id, taxpayer reference, assignment, workflow state
   - `auditType` field (discriminator): TRANSFER_PRICING, ISSUE, DESK, COMPREHENSIVE, etc.
   - `auditPhase` field: Current workflow phase (shared phase machine with audit-type-specific transitions)
   - `auditStatus` field: Current operational status (ASSIGNED, IN_PROGRESS, PENDING_REVIEW, APPROVED, COMPLETED, CLOSED)
   - Shared child collections: documents, audit history, notifications, approvals

2. **Audit Type Discriminator Pattern**:
   - Central Audit entity determines audit type via `auditType` field
   - Different audit types operate on SAME Audit aggregate but with type-specific rules and child entities
   - Audit type determines: valid phase transitions, required approvals, business rules, Issue-specific fields

3. **Issue Audit Specifics** (when `auditType = ISSUE`, scoped to FR-04.6-01 through FR-04.6-07):
   - Extends shared Audit aggregate with Issue-specific child entities:
     - `IssueSelectionData` (notification record, identified issue, selected transactions/areas)
     - `IssueFieldWorkData` (evidence records, field visit findings)
     - `IssueAuditReport` (with versioning and review-chain status)
     - `IssueFollowUpDecision` (Director's determination and referral outcome)
   - Issue-specific phase workflow: `NOTIFICATION → TRANSACTION_SELECTION → EVIDENCE_GATHERING → FIELD_VISIT (conditional) → REPORT_DRAFT → TEAM_LEADER_REVIEW → PROCESS_OWNER_REVIEW → DIRECTOR_REVIEW → FOLLOW_UP [FRAUD_REFERRAL | COMPREHENSIVE_AUDIT_REFERRAL | REPORT_FINALIZED]`
   - Issue-specific authorization rules (Tax Auditor, Team Leader, Process Owner, Director)

4. **Shared Infrastructure Reuse**:
   - `Audit` aggregate root (shared across audit types)
   - `Taxpayer`, `Case`, `User`, `Organization` entities (shared)
   - `Document` archive (shared, with Issue-specific document type tracking)
   - `Workflow` and `Approval` state machines (shared, with Issue-specific transitions)
   - `AuditHistory` trail (shared, with Issue-specific action types)
   - `Notification` infrastructure (shared, with Issue-specific event types)

5. **No Duplication**:
   - DO NOT create a separate `IssueAudit` aggregate root
   - DO NOT duplicate case, taxpayer, document, or workflow infrastructure
   - Issue Audit functionality is ENTIRELY an extension/specialization of shared Audit infrastructure via:
     - Type discriminator (`auditType = ISSUE`)
     - Child entities/value objects specific to Issue selection, evidence, field work, and report review (stored within Audit aggregate or referenced)
     - Issue-specific rules and business logic applied when `auditType = ISSUE`

This architectural approach enables:
- Multiple audit types (TP, Issue, Desk, Comprehensive) on same Audit entity
- Consistent case management across all audit types
- Shared approval, notification, document, and history infrastructure
- Issue-specific selection, evidence, and review-chain logic without duplicating core audit mechanisms

## Requirements

### Phase 1: Issue Notification and Transaction Selection

### Requirement 1: Notify Auditee (FR-04.6-01)

**User Story:** As a tax auditor, I want to notify the auditee that an issue audit is being conducted, so that the taxpayer is formally informed where notification is required.

#### Acceptance Criteria

1. WHEN an Audit case is assigned to the auditor with `auditType = ISSUE`, THE System SHALL enable the tax auditor to send a notification to the auditee
2. THE System SHALL treat notification as conditional: IF notification is required for the case, THE System SHALL enable the auditor to send it; IF notification is not required, THE System SHALL allow the auditor to proceed without sending one
3. THE System SHALL record the notification (or the decision that none was required) in Audit_History, including date, channel, and recipient where applicable

### Requirement 2: Select Transactions/Areas Based on Identified Issue (FR-04.6-02)

**User Story:** As a tax auditor, I want to select the transactions or areas to test based on the identified noncompliance issue, so that testing is focused on the specific tax type or key area under review.

#### Acceptance Criteria

1. THE System SHALL enable the auditor to select transactions/areas for testing based on an Identified_Issue — a noncompliance key area or tax type
2. EACH Selected_Transaction_Area SHALL record: identified issue/tax type, transaction or area description, selection rationale, and selecting auditor
3. THE System SHALL link each Selected_Transaction_Area to the Audit aggregate as part of `IssueSelectionData`

---

### Phase 2: Evidence Gathering and Field Work

### Requirement 3: Gather Evidence from Internal and Third-Party Sources; Enable Auditee Upload (FR-04.6-03)

**User Story:** As a tax auditor, I want to gather evidence on selected transactions from internal and third-party sources, and allow the auditee to upload additional documents, so that findings are properly supported.

#### Acceptance Criteria

1. THE System SHALL enable the auditor to gather evidence from internal and third-party sources on the Selected_Transaction_Area(s)
2. THE System SHALL enable the auditee to upload additional documents as required
3. EACH Evidence_Record SHALL capture: source (internal / third-party / auditee-uploaded), related Selected_Transaction_Area, document reference, date obtained, and auditor comments

### Requirement 4: Capture Findings of Field Visit (FR-04.6-04)

**User Story:** As a tax auditor, I want to capture findings from a field visit, so that on-site observations are documented as part of the audit record when a field visit is required.

#### Acceptance Criteria

1. THE System SHALL enable the auditor to capture findings of a field visit, where a field visit is required
2. IF a field visit is not required for the case, THE System SHALL allow the auditor to proceed without recording a Field_Visit_Finding
3. EACH Field_Visit_Finding SHALL record: observations, date, location, related Selected_Transaction_Area(s), and supporting evidence references

---

### Phase 3: Report Drafting and Multi-Level Review

### Requirement 5: Draft Audit Report and Submit to Team Leader (FR-04.6-05)

**User Story:** As a tax auditor, I want to draft the audit report and submit it to my team leader, so that findings are reviewed and approved before proceeding further.

#### Acceptance Criteria

1. THE System SHALL enable the auditor to draft the Issue_Audit_Report and submit it to the team leader for review and approval
2. IF the report is not approved by the team leader, THE System SHALL enable the auditor to revise the report as per the team leader's comments
3. THE System SHALL maintain version history of the report across revisions

### Requirement 6: Team Leader Approval Forwards Report to Process Owner (FR-04.6-06)

**User Story:** As a Team Leader, I want my approval of the draft report to forward it to the Process Owner, so that the report proceeds through the required review chain.

#### Acceptance Criteria

1. IF the report is approved by the team leader, THE System SHALL forward the report to the process owner for further review and approval
2. IF the report is rejected by the process owner, THE System SHALL enable the auditor to revise the report as per the rejection comments
3. THE System SHALL record each review decision (team leader, process owner) with reviewer identity, decision, comments, and timestamp in Audit_History

### Requirement 7: Process Owner Approval Forwards Report to Director for Follow-Up Decision (FR-04.6-07)

**User Story:** As a Process Owner, I want my approval to forward the report to the Director, so that the Director can recommend the appropriate follow-up action; and as a Director, I want to determine whether the audit report is finalized, referred to fraud investigation, or escalated to Comprehensive Audit.

#### Acceptance Criteria

1. IF the report is approved by the process owner, THE System SHALL forward the report to the director to review and recommend follow-up action
2. IF no follow-up action is required, THE System SHALL generate the audit report
3. IF there is a sign of potential fraud, THE System SHALL create a Fraud_Investigation_Referral and trigger the "Intelligence and Fraud Investigation" process
4. IF comprehensive audit is required, THE System SHALL create a Comprehensive_Audit_Referral and trigger the Comprehensive Audit process
5. THE Follow_Up_Decision SHALL record: reviewing director, decision (REPORT_GENERATED / FRAUD_REFERRAL / COMPREHENSIVE_AUDIT_REFERRAL), rationale, and decision date

---

## Implementation Notes

### Architecture Principles Applied

1. **Reuse existing infrastructure**: Issue Audit functionality builds on the shared Audit aggregate, taxpayer, user, workflow, document, and audit history infrastructure
2. **No duplication**: Single shared Audit aggregate root with type discriminator (`auditType = ISSUE`) for ALL audit types
3. **Type-specific extensions**: Issue Audit functionality (FR-04.6-01 to FR-04.6-07) is implemented as:
   - Child entities within the Audit aggregate: `IssueSelectionData`, `IssueFieldWorkData`, `IssueAuditReport`, `IssueFollowUpDecision`
   - A narrow, Issue-specific phase sequence (notify → select → gather evidence → field visit → draft → team leader review → process owner review → director review/follow-up) applied when `auditType = ISSUE`
   - Issue-specific authorization rules (Tax Auditor, Team Leader, Process Owner, Director) applied when `auditType = ISSUE`
4. **Data traceability**: Selected transactions, evidence records, field visit findings, and the follow-up decision each store their source data and rationale
5. **Append-only audit history**: Immutable record of all Issue Audit actions using shared AuditHistory infrastructure enables accountability and quality review
6. **Versioning without overwrite**: The Issue Audit report maintains version history through the Team Leader → Process Owner → Director review chain to support revisions without data loss

### Shared Audit Aggregate Structure (Conceptual)

```
Audit (root aggregate)
├── auditId (UUID)
├── auditType (discriminator: TRANSFER_PRICING, ISSUE, DESK, COMPREHENSIVE, ...)
├── auditPhase (current phase: ASSIGNED, NOTIFICATION, TRANSACTION_SELECTION, EVIDENCE_GATHERING, FIELD_VISIT, REPORT_DRAFT, TEAM_LEADER_REVIEW, PROCESS_OWNER_REVIEW, DIRECTOR_REVIEW, FOLLOW_UP)
├── auditStatus (ASSIGNED, IN_PROGRESS, PENDING_REVIEW, APPROVED, COMPLETED, CLOSED)
├── caseId (reference to Case)
├── taxpayerId (reference to Taxpayer)
├── assignedUserId (reference to User)
├── createdAt, updatedAt, createdBy, updatedBy
│
├── [IF auditType = ISSUE]
│   ├── IssueSelectionData (child entity: notification record, identified issue, selected transactions/areas)
│   ├── IssueFieldWorkData (child entity with: EvidenceRecord[], FieldVisitFinding[])
│   ├── IssueAuditReport (child entity with versioning and review-chain status)
│   └── IssueFollowUpDecision (child entity: director decision, referral outcome)
│
├── Documents (shared: references to shared Document entities)
├── AuditHistory (shared: entries from shared AuditHistory table)
├── Approvals (shared: entries from shared Approval workflow)
└── Notifications (shared: entries from shared Notification log)
```

### Issue Audit Phases (when auditType = ISSUE, scoped to FR-04.6-01 to FR-04.6-07)

```
ASSIGNED
  → NOTIFICATION (Notify Auditee, if required)                              [FR-04.6-01]
  → TRANSACTION_SELECTION (Select Transactions/Areas by Identified Issue)    [FR-04.6-02]
  → EVIDENCE_GATHERING (Internal/3rd-Party Evidence + Auditee Upload)        [FR-04.6-03]
  → FIELD_VISIT (Capture Findings, if required)                             [FR-04.6-04]
  → REPORT_DRAFT (Draft Report → Team Leader Review/Revise)                 [FR-04.6-05]
  → PROCESS_OWNER_REVIEW (On Team Leader Approval → Review/Revise)          [FR-04.6-06]
  → DIRECTOR_REVIEW (On Process Owner Approval → Follow-Up Decision)        [FR-04.6-07]
      → REPORT_GENERATED (no follow-up action required)
      → FRAUD_REFERRAL (Intelligence and Fraud Investigation triggered)
      → COMPREHENSIVE_AUDIT_REFERRAL (Comprehensive Audit triggered)
```

### Data Traceability Examples

- **Issue Selection**: Traceable to identified issue/tax type, selection rationale, selecting auditor, and selection timestamp
- **Evidence Record**: Traceable to source (internal/third-party/auditee), related selected transaction/area, document reference, and date obtained
- **Field Visit Finding**: Traceable to visit date, location, observations, and related selected transaction/area
- **Follow-Up Decision**: Traceable to reviewing director, decision rationale, supporting report version, and decision timestamp

### Error Handling

THE System SHALL handle and provide appropriate error messages/logging for:
- Audit case not found (HTTP 404)
- Audit case not assigned to Issue audit (HTTP 409 Conflict - invalid auditType or auditPhase)
- Unauthorized access (HTTP 401 Unauthorized)
- Forbidden action (HTTP 403 Forbidden - user role not authorized for Issue audit actions)
- Invalid phase transition (HTTP 422 Unprocessable Entity - invalid auditPhase transition for auditType = ISSUE)
- Attempt to submit report without at least one Selected_Transaction_Area or Evidence_Record (HTTP 422)
- Stale report version on save (optimistic locking conflict)
- Invalid approval transition (authorization/state error, e.g. director review attempted before process owner approval)
