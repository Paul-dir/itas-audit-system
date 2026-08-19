# Sprint 12: Referral Flow Event Sourcing & Audit Trail

**Objective:** Implement comprehensive event logging for the entire referral flow (from intake through completion), enabling forensic audit trails and compliance reporting.

**Developer:** Yoseph
**Cluster Prefix:** `rf_` (Referral Flow)

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 12 (Event Sourcing for Referral Flow).
>
> **Database Schema:**
> - Create `rf_case_events` table (event sourcing log): `id`, `case_id`, `event_type`, `event_description`, `actor_id`, `event_time`, `event_metadata` (JSONB)
> - Event types: REFERRAL_SUBMITTED, REFERRAL_APPROVED, CASE_CREATED, AUDIT_STARTED, ENTRY_CONFERENCE_CONDUCTED, FINDINGS_SUBMITTED, CASE_CLOSED, LEDGER_POSTED
> - Create `rf_event_stream` for real-time event publishing
> - Metadata includes: jurisdiction info, amounts, status changes, user actions
>
> **Backend Service:**
> - Create `CaseEventService` that logs all case state changes
> - Integrate with domain models to emit events at key transitions
> - Method: `logCaseEvent(caseId, eventType, eventDescription, actor, metadata)`
> - Provide query interface to retrieve event history for case
>
> **REST Endpoints:**
> - `GET /api/v1/rf/cases/{caseId}/event-history` - Get chronological event log
> - `GET /api/v1/rf/event-stream?event_type=X&date_from=Y&date_to=Z` - Query events by type and date
> - `GET /api/v1/rf/audit-report?case_id=X` - Generate audit report from events
>
> **Frontend Components:**
> - Component `<CaseEventTimeline />` - Chronological display of all events with timestamps and actor names
> - Component `<EventDetail />` - Expandable event showing full metadata
> - Component `<EventAuditTrail />` - Formatted audit trail for compliance review
>
> **Event Categories:**
> - Referral events: REFERRAL_SUBMITTED, REFERRAL_APPROVED
> - Audit events: AUDIT_STARTED, ENTRY_CONFERENCE_CONDUCTED
> - Finding events: FINDINGS_SUBMITTED, FINDINGS_APPROVED, FINDINGS_REJECTED
> - Closure events: CASE_CLOSED, LEDGER_POSTED, CLEARANCE_ISSUED
> - Dispute events: DISPUTE_RAISED, DISPUTE_RESOLVED
>
> **Key Insight:**
> - Event sourcing creates immutable history of all case actions
> - Enables forensic reconstruction of what happened and when
> - Supports compliance audits and investigations
> - Foundation for metrics and analytics (Sprint 13-16)

---

## 2. Success Criteria

- ✅ All case state transitions logged as events with timestamps
- ✅ Event log includes actor_id for accountability
> ✅ Event metadata captures relevant context (amounts, jurisdictions, decisions)
- ✅ Event history queryable and displayable chronologically
- ✅ Event stream supports filtering by type and date range
- ✅ Audit trail can be exported for compliance review
- ✅ Events are immutable (append-only log)
