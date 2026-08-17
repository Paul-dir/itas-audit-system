# Business Processes

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document outlines the high-level end-to-end business processes that span across multiple clusters and use cases.

---

## 1. End-to-End Audit Lifecycle

The core lifecycle of an audit from inception to closure.

### Phase 1: Planning (AP Cluster)
1. **Plan Generation:** Risk-Proposal Engine generates a draft plan (TA-001).
2. **Review & Distribution:** Plan is distributed (National → Region → Tax Center) and finalized upon deployment confirmation.
3. **Cascade:** Plan is cascaded into individual `AuditCase` records with `status = CREATED` (TA-002).

### Phase 2: Selection & Assignment (AP Cluster)
1. **Prioritization:** Process Owner selects cases, assesses referrals, and attaches Treatment Plans (TA-003). `status = SELECTED_FOR_AUDIT`.
2. **Assignment:** Cases are routed based on delegation rules (TA-004):
   - **Standard:** Process Owner → Team Leader → Auditor.
   - **Committee:** Process Owner → TP/JA Committee → Team Leader → Auditor.
3. Case reaches `status = ASSIGNED`.

### Phase 3: Fieldwork & Execution (EX, TP, JA, IA Clusters)
1. **Planning:** Auditor/Team drafts case-specific plan (TA-005, TA-007, TA-013).
2. **Conference:** Entry conference held with Taxpayer (TA-019).
3. **Audit Execution:** Fieldwork, CAAT, evidence gathering, multi-zone consolidation (TA-009, TA-010, TA-014, TA-021). `status = IN_PROGRESS`.
4. **Analysis:** Findings documented, TP methods applied (TA-015).

### Phase 4: Reporting & Finalization (RF, CM Clusters)
1. **Drafting:** Audit report is drafted and undergoes Team Leader / Director approval.
2. **Exit Conference:** Findings discussed with Taxpayer.
3. **Assessment:** Final assessment notice generated (TA-018).
4. **Closure:** Case reaches `status = COMPLETED`, then `CLOSED`.

### Phase 5: Post-Audit (QA Cluster)
1. **Sampling:** `QaSamplingService` selects closed cases via cryptographic random sampling (TA-023).
2. **Review:** QA team reviews working papers and issues follow-up recommendations.

---

## 2. Specialized Workflows

### 2.1 Alternative Notice Delivery (CM Cluster)
When a primary delivery method fails, the Workflow Engine enforces the Alternative Delivery SLA:
1. **Email:** Primary delivery method. If bounce/unread after X days...
2. **SMS:** Secondary electronic alert. If unacknowledged...
3. **Physical Mail:** Trigger print job for postal delivery. If returned undelivered...
4. **Affixing:** Physical visit to taxpayer premises to affix notice. If unreachable...
5. **Newspaper:** Final legal fallback. Publish in national newspaper.

### 2.2 Desk to Comprehensive Escalation (EX Cluster)
1. Auditor discovers significant issues during a Desk Audit (TA-009).
2. Team Leader recommends escalation.
3. Director approves.
4. New Comprehensive Audit (TA-010) is instantiated. **Inherits all evidence and draft reports** from the Desk Audit.

### 2.3 Fraud Escalation
1. Fraud indicators detected during any audit phase.
2. Auditor flags the case. Team Leader / Process Owner confirm.
3. System triggers handoff event to external Audit Service (Fraud Module) (TA-024).
4. Current audit may be suspended or concluded based on legal guidance.
