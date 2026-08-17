# Transfer Pricing Audit - Requirements Document

## Introduction

Transfer Pricing Audit is **one audit TYPE** within the central **Tax Audit module** of the Tax Audit Core Server. The Tax Audit module contains multiple audit types (Transfer Pricing, Issue, Desk, Comprehensive, and others), all operating on a **shared central Audit aggregate root** for case management.

This specification defines Transfer Pricing Audit functionality that:
- Operates POST-ASSIGNMENT (case is already assigned to TP Audit Team)
- Extends the central Audit aggregate with TP-specific phases, workflows, data structures, and rules
- Reuses shared audit infrastructure: Case, Taxpayer, User, Organization, Document, Notice, Assessment, Workflow, Audit History
- Does NOT create a separate TP-specific aggregate root; instead adds TP audit type discriminator and TP-specific child entities/value objects to the shared Audit aggregate
- Emphasizes data traceability, reproducibility, and compliance with MoR transfer pricing regulations and OECD Transfer Pricing Guidelines

The Transfer Pricing Audit lifecycle includes: detailed risk assessment, planning and programming, field work execution, analysis using specialized TP methods, report generation, notice creation, assessment handling, taxpayer response management, and audit closure.

## Glossary

- **Tax_Audit_Module**: Central module in Tax Audit Core Server supporting multiple audit types (Transfer Pricing, Issue, Desk, Comprehensive, etc.)
- **Audit**: Central aggregate root shared across all audit types; contains audit case, taxpayer reference, assignment, workflow state, and audit-type-specific data
- **Audit_Type**: Discriminator indicating audit type (TRANSFER_PRICING, ISSUE, DESK, COMPREHENSIVE, etc.); determines which phase workflow and rules apply
- **Transfer_Pricing_Audit_Type**: Specific audit type discriminator value for TP audits; triggers TP-specific phases, workflows, and business rules
- **Audit_Case**: Reference to the shared central Audit aggregate (synonymous with "Case" in multi-type audit context)
- **Taxpayer**: Business entity subject to audit; referenced from central Audit aggregate
- **Related_Party**: Non-resident or domestic entity engaged in controlled transactions with the taxpayer
- **Process_Owner**: Manager responsible for planning, review, and approval decisions in the TP audit
- **TP_Audit_Team**: Auditors who execute detailed assessment, field work, analysis, and report for TP audit type
- **Review_Committee**: Group responsible for reviewing TP cases at planning stage for approval
- **Team_Leader**: Officer with authority to escalate potential fraud findings
- **Authorized_Official**: Final approver before notice issuance
- **Controlled_Transaction**: Transaction between related parties subject to transfer pricing requirements
- **Transfer_Pricing_Method**: Established approach per MoR proclamations and OECD guidelines (e.g., CUP, Resale Price, Cost Plus, Profit Split, Transactional Net Margin)
- **Arm's_Length_Price**: Price that unrelated parties would agree to under comparable circumstances
- **Risk_Assessment**: Systematic evaluation of transfer pricing risk across defined categories (4-5 levels); child entity of TP Audit
- **Working_Hypothesis**: Initial documented theory of identified TP issue including revenue at risk; child entity of TP Audit
- **Materiality**: Threshold and context for determining TP audit scope and testing depth; child entity of TP Audit
- **Information_Request**: Formal request to taxpayer for documents, evidence, or explanations with approval workflow; child entity of TP Audit
- **Customs_Valuation**: Related-party import price data used for preliminary TP comparability analysis; child entity of TP Audit
- **Comparable**: Similar transaction, business, or transfer pricing indicator used in arm's-length analysis
- **TP_Method_Indicator**: Specific metric used in selected TP method (e.g., gross profit margin, net profit margin, mark-up)
- **Discrepancy_Report**: Analysis comparing taxpayer transfer pricing to comparable data with auditor validation; child entity of TP Audit
- **Fact_Statement**: Comprehensive documentation of taxpayer business, related parties, transactions, and audit facts (versioned); child entity of TP Audit
- **Audit_Report**: Final draft report documenting audit procedures, findings, TP issues, analysis, conclusions, and evidence; child entity of TP Audit
- **Assessment_Notice**: Formal notice to taxpayer of assessed transfer pricing adjustment and related taxes/penalties; shared across audit types
- **Objection**: Taxpayer response disputing assessment notice with supporting evidence and reasoning; child entity of TP Audit
- **Audit_History**: Complete audit trail recording all actions, decisions, participants, and outcomes throughout TP audit lifecycle; shared infrastructure

## Architectural Foundation

### Core Principle: Transfer Pricing Audit as Audit Type, Not Module

Transfer Pricing Audit is **one audit TYPE** within the central **Tax Audit module**. The Tax Audit module defines:

1. **Central Audit Aggregate Root**: Single shared aggregate for all audit types
   - `Audit` entity: Core case entity with id, taxpayer reference, assignment, workflow state
   - `auditType` field (discriminator): TRANSFER_PRICING, ISSUE, DESK, COMPREHENSIVE, etc.
   - `auditPhase` field: Current workflow phase (shared phase machine with audit-type-specific transitions)
   - `auditStatus` field: Current operational status (ASSIGNED, IN_PROGRESS, PENDING_REVIEW, APPROVED, COMPLETED, CLOSED)
   - Shared child collections: documents, audit history, notifications, approvals

2. **Audit Type Discriminator Pattern**: 
   - Central Audit entity determines audit type via `auditType` field
   - Different audit types operate on SAME Audit aggregate but with type-specific rules and child entities
   - Audit type determines: valid phase transitions, required approvals, business rules, TP-specific fields

3. **Transfer Pricing Audit Specifics** (when `auditType = TRANSFER_PRICING`):
   - Extends shared Audit aggregate with TP-specific child entities:
     - `TpRiskAssessment`
     - `TpWorkingHypothesis`
     - `TpPlanningData` (materiality, industry research, sampling)
     - `TpAuditPlan`
     - `TpFieldWorkData` (accounting assessment, transaction trails, fact statement)
     - `TpAnalysisData` (ratios, customs matching, TP methods, arm's-length analysis)
     - `TpAuditReport` (with versioning)
     - `TpAssessmentData` (objection handling)
   - TP-specific phase workflow: DETAILED_RISK_ASSESSMENT → PLANNING → PLANNING_APPROVAL → FIELD_WORK → ANALYSIS → REPORT → REPORT_APPROVAL → NOTICE → ASSESSMENT → TAXPAYER_RESPONSE → [REVIEW/INVESTIGATION] → COMPLETION
   - TP-specific authorization rules (TP Audit Team, Process Owner, Review Committee, etc.)

4. **Shared Infrastructure Reuse**:
   - `Audit` aggregate root (shared across audit types)
   - `Taxpayer`, `Case`, `User`, `Organization` entities (shared)
   - `Document` archive (shared, with TP-specific document type tracking)
   - `Notice` and `Assessment` templates (shared, with TP-specific template selection)
   - `Workflow` and `Approval` state machines (shared, with TP-specific transitions)
   - `AuditHistory` trail (shared, with TP-specific action types)
   - `Notification` infrastructure (shared, with TP-specific event types)

5. **No Duplication**:
   - DO NOT create separate `TransferPricingAudit` aggregate root
   - DO NOT duplicate case, taxpayer, document, workflow, or history infrastructure
   - TP Audit functionality is ENTIRELY an extension/specialization of shared Audit infrastructure via:
     - Type discriminator (`auditType = TRANSFER_PRICING`)
     - Child entities/value objects specific to TP (stored within Audit aggregate or referenced)
     - TP-specific rules and business logic applied when `auditType = TRANSFER_PRICING`

This architectural approach enables:
- Multiple audit types (TP, Issue, Desk, Comprehensive) on same Audit entity
- Consistent case management across all audit types
- Shared approval, notification, document, and history infrastructure
- TP-specific phases and workflows without duplicating core audit mechanisms

## Requirements

### Phase 1: Detailed Risk Assessment

### Requirement 1: Conduct Detailed Transfer Pricing Risk Assessment

**User Story:** As a TP Audit Team member, I want to conduct a systematic risk assessment of transfer pricing exposure, so that I can identify and prioritize transfer pricing issues for detailed investigation.

#### Acceptance Criteria

1. WHEN an Audit case is assigned to the TP Audit Team with `auditType = TRANSFER_PRICING` and `auditPhase = DETAILED_RISK_ASSESSMENT`, THE System SHALL enable creation of a TpRiskAssessment child entity within the Audit aggregate
2. THE TpRiskAssessment SHALL record: risk category, specific risk questions, documented responses, identified risk indicators, supporting evidence, auditor comments, and observations
3. THE System SHALL support multiple TP risk categories (minimum 5: Transfer Pricing Documentation, Functional Analysis, Economic Analysis, Comparable Analysis, Profit Allocation) each containing category-specific questions
4. WHEN all risk questions are answered and evidence is documented, THE System SHALL calculate an overall risk level (LOW, MEDIUM, HIGH, CRITICAL) based on recorded indicators and configured TP-specific rules
5. THE TpRiskAssessment SHALL record: assessment status (DRAFT, IN_PROGRESS, COMPLETED, UNDER_REVIEW, APPROVED), version number, creation timestamp, last modified timestamp, and modification history
6. WHERE a previous TpRiskAssessment version exists, THE System SHALL maintain version history without overwriting prior assessments
7. THE System SHALL link TpRiskAssessment to: the parent Audit aggregate, Audit_History (shared infrastructure), and related documents

### Requirement 2: Enable Taxpayer to Submit Information and Evidence

**User Story:** As a taxpayer, I want to submit transfer pricing documentation and evidence during audit, so that I can provide supporting materials for the auditor's assessment.

#### Acceptance Criteria

1. WHEN the TP audit case reaches the detailed risk assessment phase, THE System SHALL enable the Taxpayer to upload documents and evidence
2. THE System SHALL accept: transfer pricing documentation, organizational charts, related party agreements, pricing methodology, market data, comparable company analysis, and supporting analysis
3. WHEN a document is uploaded, THE System SHALL record: document type, file reference, upload date, taxpayer name, audit case reference, document storage status, and audit retrieval link
4. THE System SHALL link submitted documents to: Risk_Assessment, Information_Request, Fact_Statement, audit procedures, and other audit work product
5. THE System SHALL maintain document archive copies accessible to tax auditors throughout the audit lifecycle

### Requirement 3: Process Owner Develops Initial Working Hypothesis and Revenue at Risk

**User Story:** As a Process Owner, I want to document the initial working hypothesis and estimated revenue at risk, so that I can guide the audit team's investigation direction.

#### Acceptance Criteria

1. WHEN the detailed risk assessment is completed, THE System SHALL enable the Process_Owner to create a Working_Hypothesis record
2. THE Working_Hypothesis SHALL record: hypothesis description, identified transfer pricing issue, economic rationale, specific controlled transaction, related party identification, risk indicators supporting the hypothesis, supporting evidence references, documented assumptions, currency, calculation basis, and revenue at risk estimate
3. WHEN revenue at risk is calculated, THE System SHALL record: calculation methodology, input values, calculated amount, currency, calculation timestamp, and preparer identification
4. THE Working_Hypothesis record SHALL reference: applicable Transfer_Pricing_Method, comparable data used, and initial assessment conclusion
5. THE System SHALL store the Working_Hypothesis with status tracking (DRAFT, SUBMITTED, APPROVED, UNDER_REVIEW)

### Requirement 4: Review Committee Reviews TP Case in Planning Meeting and Approves Progression to Planning Phase

**User Story:** As a Review Committee member, I want to review the TP case in a planning meeting context, so that I can make informed approval decisions for progressing to the planning phase.

#### Acceptance Criteria

1. WHEN the Working_Hypothesis is submitted, THE System SHALL trigger Review_Committee notification of a Planning_Meeting requirement
2. THE System SHALL record Planning_Meeting details: scheduled date, authorized participants, meeting agenda, Risk_Assessment review, Working_Hypothesis discussion, revenue at risk discussion, committee member comments, and meeting decision (APPROVED, RETURN_FOR_REVISION, REJECT)
3. WHEN the Review_Committee approves in the planning meeting, THE System SHALL transition the audit case phase to PLANNING and trigger notification to the TP Audit Team
4. IF the Review_Committee requests revisions, THE System SHALL record revision requests and return the case to risk assessment phase for modification
5. THE System SHALL maintain an audit trail of all planning meeting decisions with timestamps and participant identification

---

### Phase 2: Planning and Programming

### Requirement 5: Research and Record Materiality

**User Story:** As an auditor in the planning phase, I want to document materiality analysis and thresholds, so that I can establish appropriate scope and testing criteria for the audit.

#### Acceptance Criteria

1. WHEN entering the planning phase, THE System SHALL enable creation of a Materiality record linked to the TP audit
2. THE Materiality record SHALL document: materiality objective, materiality scope, context for materiality assessment, resources required for materiality analysis, supporting research and evidence, documented assumptions, and notes
3. THE System SHALL record: materiality threshold amount, materiality currency, materiality percentage (if applicable), materiality basis (revenue, profit, transaction amount), and effective date
4. THE System SHALL link Materiality to: related audit procedures, transaction selection thresholds, and cost/expense selection parameters

### Requirement 6: Research Taxpayer's Industry and Economic Context

**User Story:** As an auditor, I want to document comprehensive industry research, so that I can establish the economic and market context for transfer pricing analysis.

#### Acceptance Criteria

1. WHEN planning the TP audit, THE System SHALL enable creation of Industry_Research documentation
2. THE Industry_Research SHALL record: sector classification, business model analysis, market characteristics, economic risks, industry benchmarks, comparable business profiles, research sources, supporting documentation references, and analysis completion date
3. THE System SHALL link Industry_Research to: comparable company selection, benchmark analysis, transfer pricing method determination, and audit risk assessment

### Requirement 7: Research and Record Audit Sampling Method

**User Story:** As an auditor, I want to document the audit sampling methodology and parameters, so that I can ensure sample selection is documented, justified, and reproducible.

#### Acceptance Criteria

1. WHEN planning detailed testing procedures, THE System SHALL enable recording of Audit_Sampling method and parameters
2. THE Audit_Sampling record SHALL document: sampling method (STRATIFIED, SYSTEMATIC, RANDOM, JUDGMENTAL, CLUSTER), population definition, selection criteria, sample size rationale, statistical parameters (confidence level, precision, if applicable), documented justification, and supporting evidence
3. THE System SHALL link sampling parameters to: transaction selection, sample-specific audit work, and testing results

### Requirement 8: Prepare Audit Plan and Programming

**User Story:** As an auditor, I want to prepare a comprehensive audit plan and programming, so that I can guide systematic execution of the TP audit with clear procedures and resource allocation.

#### Acceptance Criteria

1. WHEN planning phase is initiated, THE System SHALL enable creation of Audit_Plan record
2. THE Audit_Plan SHALL document: audit objective, audit scope, audit period covered, identified transfer pricing issues to investigate, materiality references, industry research summary, sampling method and parameters, planned audit procedures (minimum 10-15 specific procedures), information requirements, resource allocation, assigned auditor names, audit timeline with milestones, and expected audit outputs
3. THE Audit_Plan SHALL reference: Risk_Assessment, Working_Hypothesis, Materiality, Industry_Research, Audit_Sampling, and TP methods to be applied
4. THE Audit_Plan status SHALL track: DRAFT, SUBMITTED_FOR_REVIEW, APPROVED, IN_EXECUTION, COMPLETED
5. THE System SHALL record Audit_Plan submission to Process_Owner with timestamp and submitter identification

### Requirement 9: Process Owner Reviews Audit Plan and Approves or Returns for Revision

**User Story:** As a Process Owner, I want to review and approve the audit plan, so that I can ensure audit scope, procedures, and resource allocation are appropriate before execution begins.

#### Acceptance Criteria

1. WHEN Audit_Plan is submitted, THE System SHALL notify Process_Owner of review requirement
2. THE System SHALL enable Process_Owner to: APPROVE_PLAN, REQUEST_REVISION, or REJECT_PLAN with documented comments
3. IF Plan is approved, THE System SHALL: record approval with timestamp and Process_Owner identification, notify TP Audit Team of approval, trigger transition to PLANNING_APPROVAL phase, and potentially trigger Entry_Conference scheduling requirement
4. IF revisions are requested, THE System SHALL record revision requirements and return Audit_Plan to submitted phase for modification

### Requirement 10: Process Owner Reviews Audit Preparation Results and Records Assessment

**User Story:** As a Process Owner, I want to review and document the overall audit preparation results, so that I can verify readiness for field work execution.

#### Acceptance Criteria

1. AT completion of the planning phase, THE System SHALL enable Process_Owner review of preparation completion including: Risk_Assessment status, Materiality documentation, Industry_Research documentation, Audit_Sampling methodology, Audit_Plan approval, supporting evidence collection, and outstanding preparation items
2. THE System SHALL record preparation review: reviewer identification, review date, reviewer comments, review decision (APPROVED_FOR_FIELDWORK, ADDITIONAL_PREPARATION_REQUIRED), and documented status
3. WHEN preparation is approved for field work, THE System SHALL transition case to FIELD_WORK phase

---

### Phase 3: Field Work and Audit Execution

### Requirement 11: Enable Auditor to Assess Taxpayer's Accounting and Reporting Methods

**User Story:** As an auditor, I want to document taxpayer's accounting and reporting methods, so that I can understand controls and identify potential transfer pricing exposure areas.

#### Acceptance Criteria

1. DURING field work phase, THE System SHALL enable creation of Accounting_Assessment entity
2. THE Accounting_Assessment SHALL record: accounting methods used, financial reporting methods, documented accounting policies, financial record review results, revenue reporting procedures and observations, expense reporting procedures and observations, related-party transaction reporting procedures and observations, and auditor findings
3. THE System SHALL link Accounting_Assessment findings to: identified risk areas, transaction audit trail procedures, and subsequent detailed testing

### Requirement 12: Support Transaction Audit Trail Capability with Multiple Source Integration

**User Story:** As an auditor, I want to trace controlled transactions from multiple sources to their recorded reporting, so that I can verify transaction completeness and accuracy in transfer pricing.

#### Acceptance Criteria

1. WHEN conducting transaction testing, THE System SHALL support Transaction_Audit_Trail creation with source integration
2. THE Transaction_Audit_Trail SHALL support transaction sources: Ministry_e-Invoicing_System, Cash_Register_Machine, Taxpayer_Accounting_Systems, and Manual_Entry (reusable abstraction: EInvoicingProvider, CashRegisterProvider, TaxpayerAccountingProvider interface-based integration)
3. EACH Transaction_Audit_Trail record SHALL contain: transaction source system, transaction details, invoice reference, ledger posting, taxpayer identification, related party identification, transaction date, transaction amount, audit trail result (MATCHED, DISCREPANCY, INCOMPLETE), and integration result (source reference)
4. WHERE a transaction is matched, THE System SHALL record matching verification and auditor sign-off
5. WHERE a discrepancy is identified, THE System SHALL record: discrepancy type, discrepancy description, amount variance, related finding, and investigation status

### Requirement 13: Enable Auditor to Select and Audit Samples with Reproducibility

**User Story:** As an auditor, I want to select and document samples for detailed testing, so that I can ensure sample selection is transparent, justified, and reproducible for quality review.

#### Acceptance Criteria

1. WHEN conducting sample-based testing, THE System SHALL enable Sample_Selection entity creation
2. THE Sample_Selection SHALL document: population being sampled, selection criteria applied, sampling method used (reference to Audit_Sampling), sampling parameters, calculated sample size, list of selected records, selection justification for each sample item, selecting auditor identification, and selection status (DRAFT, APPROVED, EXECUTED)
3. THE Sample_Selection entity SHALL be reproducible: WHEN given same population, criteria, method, and parameters, THE System SHALL regenerate identical sample selection
4. THE System SHALL link selected samples to: detailed audit procedures, testing results, findings, and workpaper documentation

### Requirement 14: Auditor Obtains Approval for Information Request and Uploads Information

**User Story:** As an auditor, I want to request additional information from the taxpayer with documented approval, so that I can gather necessary evidence through a controlled workflow.

#### Acceptance Criteria

1. WHEN additional information is required during field work, THE System SHALL enable Information_Request creation with required workflow
2. THE Information_Request workflow states SHALL be: DRAFT → PENDING_APPROVAL → APPROVED → SENT → RESPONSE_RECEIVED → REVIEWED → CLOSED
3. THE Information_Request record SHALL document: request type, reason for request, detailed description of information needed, due date for response, responsible auditor, approval status, approval decision maker, and auditor comments
4. WHEN request is approved, THE System SHALL transmit request to taxpayer with: request date, due date, contact auditor, and submission instructions
5. WHEN taxpayer response is received, THE System SHALL record: response date, documents received, auditor review status, auditor comments, and response completeness assessment
6. THE System SHALL link Information_Request to: related audit procedures, taxpayer responses, and subsequent analysis steps

### Requirement 15: TP Audit Team Issues Additional Information and Document Requests Including Interview Coordination

**User Story:** As a TP Audit Team member, I want to issue formal information requests and coordinate interviews, so that I can gather comprehensive documentation for transfer pricing analysis.

#### Acceptance Criteria

1. WHEN information is needed beyond standard document requests, THE System SHALL enable creation of formal Request records
2. THE Request SHALL record: request type (DOCUMENT_REQUEST, INTERVIEW, PLANT_TOUR, SITE_VISIT, WRITTEN_EXPLANATION), detailed request description, due date, responsible auditor, current request status, and notes
3. THE System SHALL record interview details: scheduled date, participants, topics, question list, documented responses, agreements reached, disagreements noted, action items, and follow-up requirements
4. THE System SHALL record plant tour/site visit details: visit date, location, participants, observations, photographs/evidence collected, and auditor conclusions
5. THE System SHALL link all request types to: Information_Request workflow, taxpayer response, audit procedures, and findings

### Requirement 16: Taxpayer Submits Additional Information and Evidence Linked to TP Audit and Requests

**User Story:** As a taxpayer, I want to submit requested information and evidence in response to audit requests, so that I can provide supporting documentation for transfer pricing positions.

#### Acceptance Criteria

1. WHEN Information_Request is sent, THE Taxpayer SHALL be able to submit response documents and evidence
2. EACH Taxpayer_Response record SHALL link to: specific Information_Request, TP_Audit case, associated Taxpayer entity
3. THE Taxpayer_Response SHALL record: submitted documents, documentary evidence, interview information (if applicable), plant tour information (if applicable), site visit information (if applicable), textual explanations, submission date, and submission completeness status
4. WHEN taxpayer response is received, THE System SHALL: record receipt date, notify assigned auditor, record response linking, and trigger auditor review workflow

### Requirement 17: Prepare Draft Fact Statement with Version Control

**User Story:** As an auditor, I want to prepare and version-control a comprehensive fact statement, so that I can document taxpayer facts and circumstances for the audit record and taxpayer review.

#### Acceptance Criteria

1. DURING field work and analysis phases, THE System SHALL enable creation of Fact_Statement entity
2. THE Fact_Statement SHALL document: taxpayer business profile, organizational structure, related party relationships and identification, controlled transactions overview, transaction accounting treatment, industry and market context, supporting evidence summary, facts established through audit, documented questions for taxpayer, and supporting audit record references
3. THE Fact_Statement versioning SHALL track: version number, status (DRAFT, SUBMITTED_TO_TAXPAYER, TAXPAYER_REVIEW, AMENDED, FINAL), author/preparer, creation date, modification date, and modification description
4. THE Fact_Statement status progression SHALL be: DRAFT → SUBMITTED_TO_TAXPAYER → TAXPAYER_REVIEW → AMENDED (if needed) → FINAL
5. THE System SHALL NOT allow deletion or overwriting of previous Fact_Statement versions; version history SHALL be preserved
6. THE System SHALL record: which version is current, when each version was created/finalized, and by whom

### Requirement 18: Taxpayer Reviews Fact Statement and Provides Comments

**User Story:** As a taxpayer, I want to review the auditor's fact statement and provide comments, so that I can identify errors or provide clarifications on stated facts.

#### Acceptance Criteria

1. WHEN Fact_Statement is submitted to taxpayer, THE System SHALL enable TAXPAYER_REVIEW status and acceptance of taxpayer comments
2. THE Taxpayer SHALL be able to: accept the Fact_Statement, dispute specific facts, request corrections, or provide clarifications without modifying the original auditor-prepared facts
3. EACH taxpayer comment SHALL be recorded with: fact statement reference, specific fact commented upon, taxpayer comment text, comment date, and taxpayer identification
4. THE System SHALL maintain separate taxpayer comments WITHOUT overwriting or modifying the auditor's original Fact_Statement text
5. WHEN taxpayer provides comments, THE System SHALL: record comment submission date, notify auditor, optionally trigger Fact_Statement amendment, and track amendment rationale

### Requirement 19: Taxpayer Submits Explanation and Evidence of Differences

**User Story:** As a taxpayer, I want to submit explanations and evidence for any identified differences, so that I can respond to auditor findings.

#### Acceptance Criteria

1. WHERE an audit finding or discrepancy is identified, THE System SHALL enable taxpayer submission of explanation and supporting evidence
2. THE System SHALL record: identified finding, taxpayer explanation text, supporting evidence documents, submission date, taxpayer identification, and auditor review status
3. WHEN taxpayer explanation is submitted, THE System SHALL: record submission, notify auditor, and track whether finding is resolved or requires further investigation

### Requirement 20: Support Structured Discussions with Taxpayer

**User Story:** As an auditor, I want to document structured discussions with the taxpayer, so that I can maintain audit record of exchanges and agreements on transfer pricing positions.

#### Acceptance Criteria

1. WHEN communicating with taxpayer on TP matters, THE System SHALL enable creation of Discussion record
2. EACH Discussion record SHALL document: discussion date, participants (auditor name, taxpayer representative name), discussion topics, specific questions raised, documented answers provided, agreements reached, areas of disagreement, action items agreed, follow-up requirements, and supporting documents exchanged
3. THE System SHALL link discussions to: Fact_Statement, identified findings, information requests, and subsequent audit procedures

### Requirement 21: Provide Access to Audit Support Tools and Third-Party Data Integration

**User Story:** As an auditor, I want to access integrated audit support tools and third-party data, so that I can efficiently retrieve taxpayer records and external data for TP analysis.

#### Acceptance Criteria

1. THE System SHALL provide integration access to: Taxpayer_Accounting_Records, e-Invoicing_System data, Third_Party_Market_Data, Purchase_and_Sales_Ledgers, Taxpayer_Systems (via interface abstraction), and Remote_Site_Audit_Access where applicable
2. WHERE integration is not yet implemented, THE System SHALL provide realistic mock implementations that return structured data and support: success scenarios, no data scenarios, invalid request scenarios, timeout scenarios, and external service failure scenarios
3. THE System application logic SHALL NOT distinguish between mock and real providers
4. THE System SHALL record data retrieval source, retrieval timestamp, and data version/currency

---

### Phase 4: Analysis

### Requirement 22: Automatically Analyze Financial Ratios and Compare to Benchmarks

**User Story:** As an auditor, I want the system to automatically calculate and analyze financial ratios, so that I can identify potential transfer pricing anomalies through ratio analysis.

#### Acceptance Criteria

1. WHEN audit case enters analysis phase, THE System SHALL automatically calculate financial ratios from taxpayer financial data
2. THE System SHALL calculate at least: Input_Output_Ratios, Profitability_Ratios, Cost_Ratios, Expense_Ratios, similar_tax_type_ratios, and comparative_ratios
3. EACH Ratio_Analysis record SHALL document: metric/ratio name, calculation formula, input values, calculated result, period covered, applicable benchmark value, variance (difference and percentage), and data source
4. THE System SHALL compare calculated ratios to: industry benchmarks, taxpayer historical ratios, and comparable company ratios
5. WHEN variance exceeds configured thresholds, THE System SHALL flag for auditor review

### Requirement 23: Automatically Select Cost and Expense Types for Detailed Analysis

**User Story:** As an auditor, I want the system to recommend cost and expense categories for detailed analysis, so that I can focus testing on material and higher-risk items.

#### Acceptance Criteria

1. WHEN analyzing taxpayer costs and expenses, THE System SHALL automatically apply selection criteria: materiality thresholds, materiality percentage thresholds, risk-based category flags, transaction count, and configured analysis parameters
2. THE System SHALL identify selected cost/expense types and record: category, selection threshold applied, rationale for selection, selection confidence, and associated auditor override opportunity
3. WHERE auditor overrides automatic selection, THE System SHALL record: override reason and auditor justification

### Requirement 24: Enable Auditor to Compare Transfer Pricing Against Benchmarks and Comparables

**User Story:** As an auditor, I want to compare taxpayer transfer pricing to comparable data and benchmarks, so that I can assess arm's-length compliance.

#### Acceptance Criteria

1. WHEN comparing transfer pricing positions, THE System SHALL enable Comparison record creation
2. EACH Comparison SHALL document: comparable comparable data source, comparable company/transaction, taxpayer transfer pricing value, comparable benchmark value, variance (absolute and percentage), data source reference, audit period, and comparable transaction reference
3. THE System SHALL support comparison types: Similar_Tax_Type_Comparison, Industry_Benchmark_Comparison, Taxpayer_Historical_Comparison, Competitor_Pricing_Comparison
4. THE System SHALL record comparison source: Customs_Database, Industry_Database, International_Market_Database, Taxpayer_Historical_Records, or Internal_Analysis
5. WHERE variance exceeds specified thresholds, THE System SHALL flag potential TP issue for investigation

### Requirement 25: Enable Auditor to Assess Potential Transfer Pricing Issues from Cross-Border Transactions

**User Story:** As an auditor, I want to systematically assess cross-border transactions for transfer pricing issues, so that I can identify transactions requiring TP method application.

#### Acceptance Criteria

1. WHEN analyzing cross-border controlled transactions, THE System SHALL enable Cross_Border_Assessment record creation
2. EACH Cross_Border_Assessment SHALL document: related foreign party identification, transaction counterparty country, transaction description, transaction amount, transaction pricing/terms, supporting analysis evidence, identified risk indicators, transfer pricing analysis conclusions
3. POSSIBLE Assessment_Conclusion values SHALL be: POTENTIAL_TP_ISSUE, NO_IMMEDIATE_TP_ISSUE, REQUIRES_FURTHER_ANALYSIS, INSUFFICIENT_INFORMATION
4. WHERE conclusion is POTENTIAL_TP_ISSUE or REQUIRES_FURTHER_ANALYSIS, THE System SHALL: record transaction for detailed TP method application and flag for detailed analysis procedures

### Requirement 26: Support Complete Customs Valuation Matching Analysis

**User Story:** As an auditor, I want to perform customs valuation matching on related-party imports, so that I can identify potential transfer pricing anomalies in import pricing.

#### Acceptance Criteria

1. WHEN analyzing related-party imports, THE System SHALL enable Customs_Valuation_Matching workflow:

2. **DATA IMPORT & VALIDATION:**
   - WHEN auditor selects related-party import products, THE System SHALL accept selected import transactions
   - THE System SHALL accept Competitor_Price_Data and Producer_Price_Data via: CSV file upload, manual entry, database queries
   - WHEN CSV upload occurs, THE System SHALL: validate format, detect duplicate entries, report invalid rows with correction guidance, preview data before import, allow validation error correction, and persist valid data only
   - THE System SHALL support Search_Functionality on customs/competitor/producer datasets with filtering by: HS_Code, Product_Name, Description, Period, Country, and custom attributes

3. **MATCHING & ANALYSIS:**
   - THE System SHALL match taxpayer related-party import prices against: competing company prices, producer prices, and customs database records
   - Matching criteria SHALL be configurable: HS_Code, Product_Description, Period, Origin_Country, product attributes, and custom rules
   - THE System SHALL generate Preliminary_Analysis: minimum_price, maximum_price, average_price, median_price, comparable_price_range, taxpayer_import_price, price_difference, percentage_difference

4. **DISCREPANCY REPORTING:**
   - THE System SHALL generate Discrepancy_Report documenting: audit case reference, taxpayer identification, product identification, related foreign party, taxpayer import price, comparable price range, comparable source identification, matching methodology used, identified discrepancy amount, discrepancy percentage, auditor validation status, and auditor comments
   - THE System SHALL support auditor validation decisions: ACCEPT_COMPARISON, REJECT_COMPARISON, REQUIRES_FURTHER_ANALYSIS

5. **IMPORTANT: PRELIMINARY NATURE**
   - THE System SHALL clearly mark customs analysis as PRELIMINARY_TP_INFORMATION, NOT as automatically confirmed TP adjustment
   - THE System SHALL enable auditor review and manual override of any system-generated matching

6. **PROVIDER ABSTRACTION & MOCK IMPLEMENTATION:**
   - INTERFACE CustomsValuationProvider with methods: search(criteria), filter(dataset), match(taxpayer_price, comparable_data), getComparable(product)
   - IMPLEMENT MockCustomsValuationProvider supporting: realistic sample data, successful search/filter/match operations, no_result scenarios, invalid_request scenarios, timeout scenarios, external_error scenarios, invalid_response scenarios
   - Application SHALL NOT distinguish between MockCustomsValuationProvider and future RealCustomsValuationProvider
   - DATA_MODEL fields: product_id, product_name, product_description, hs_code, importer_id, producer_id, origin_country, import_date, quantity, unit_price, currency, data_source, transaction_reference

---

### Requirement 27: Perform Automatic Transfer Pricing Analysis Using System Data and Methods

**User Story:** As an auditor, I want the system to perform automatic TP analysis, so that I can efficiently analyze transfer pricing positions against applicable methods.

#### Acceptance Criteria

1. WHEN analysis phase is initiated, THE System SHALL enable Automatic_TP_Analysis workflow
2. THE System SHALL perform TP analysis using: auditor-specified parameters, taxpayer financial data, transaction data, supporting evidence, benchmark data, customs comparison data, third-party source data, and method-specific rules
3. EACH TP_Analysis record SHALL store: analysis parameters used, data sources consumed, calculation methodology/rules applied, calculated result with supporting data, analysis execution timestamp, executing user identification, and methodology version
4. THE System SHALL support reproducible analysis: WHEN rerun with same parameters and data, analysis SHALL produce identical results
5. THE System SHALL record confidence level, supporting evidence strength, and identified gaps in analysis

### Requirement 28: Enable Auditor to Determine and Apply Transfer Pricing Methods

**User Story:** As an auditor, I want to select and apply appropriate transfer pricing methods, so that I can determine arm's-length pricing for identified transactions.

#### Acceptance Criteria

1. THE System SHALL support Transfer_Pricing_Methods aligned with MoR proclamations, directives, OECD Transfer Pricing Guidelines, and configured rules
2. MINIMUM methods to support: Comparable_Uncontrolled_Price (CUP), Resale_Price_Method (RPM), Cost_Plus_Method (CPM), Profit_Split_Method (PSM), Transactional_Net_Margin_Method (TNMM), and Comparable_Uncontrolled_Price_equivalent
3. DO NOT hard-code a single method; method selection SHALL be configurable based on transaction type, industry, and configured rules
4. WHEN auditor selects a TP method, THE System SHALL enable TP_Method record with: selected method, applicable transaction, auditor rationale for method selection, method applicability analysis, supporting data/evidence, legal/regulatory reference basis, and database/rule source documentation
5. WHERE international market data or third-party pricing data is required, THE System SHALL integrate with: International_Market_Database_Provider, BenchmarkProvider, and third-party services (via interface abstraction)

### Requirement 29: Enable Auditor to Select Appropriate Transfer Pricing Method for Transaction

**User Story:** As an auditor, I want to select the best applicable TP method for a specific transaction, so that I can establish arm's-length pricing in the audit report.

#### Acceptance Criteria

1. WHEN determining TP method for a transaction, THE System SHALL enable Selection_of_TP_Method with documentation
2. EACH Method_Selection record SHALL document: selected method, transaction it applies to, auditor rationale for selection, applicability to transaction facts, supporting evidence reviewed, regulatory/reference basis cited
3. THE System SHALL record method selection timestamp, selecting auditor, and supporting workpapers

### Requirement 30: Research and Record Arm's-Length Price/Profit and Range

**User Story:** As an auditor, I want to research and document arm's-length price/profit ranges, so that I can establish the benchmark for compliance assessment.

#### Acceptance Criteria

1. WHEN applying a TP method, THE System SHALL enable documentation of Arm's_Length_Analysis
2. EACH Arm's_Length_Analysis SHALL document: determined arm's-length price or profit, arm's-length price/profit range, comparable data used, applied TP method, specific TP method indicator used (e.g., gross margin, net profit margin, mark-up), taxpayer's actual result, variance from arm's-length (absolute and percentage), comparable data source, applied methodology, and supporting evidence
3. THE System SHALL record confidence level in determined range and identified limitations

---

### Phase 5: Report Generation and Review

### Requirement 31: Auditor Drafts Audit Report with Versioning and Exit Conference Support

**User Story:** As an auditor, I want to draft a comprehensive audit report and manage versions, so that I can document findings, TP analysis, and conclusions for Process Owner review.

#### Acceptance Criteria

1. WHEN analysis is complete, THE System SHALL enable Draft_Audit_Report creation
2. THE Audit_Report SHALL document: executive summary, taxpayer identification and case reference, audit background and context, scope of audit procedures, detailed audit procedures performed, taxpayer facts and circumstances, controlled transaction descriptions, identified TP issues and descriptions, transfer pricing analysis for each issue, comparable data analyzed, applied TP methods, determined arm's-length range, taxpayer's actual transfer pricing, identified variances, audit findings and conclusions, assessment of TP compliance, supporting evidence references, and approvals/review status
3. THE Audit_Report versioning SHALL track: version number, status (DRAFT, SUBMITTED_FOR_INTERNAL_REVIEW, UNDER_REVIEW, APPROVED, DISTRIBUTED), author/preparer, creation date, modification date, modification description
4. THE System SHALL NOT allow deletion or overwriting of previous versions; version history SHALL be preserved
5. WHEN audit report is substantially complete, THE System SHALL enable EXIT_CONFERENCE_SUPPORT with: meeting date, taxpayer representatives, auditor team members, discussion of findings, taxpayer comments on report, auditor responses to taxpayer comments, areas of agreement/disagreement, action items
6. THE System SHALL support post-exit-conference amendments to the report with amendment tracking and rationale documentation
7. THE System SHALL link Audit_Report to: Risk_Assessment, Audit_Plan, Fact_Statement, all analysis workpapers, and supporting evidence

### Requirement 32: Process Owner Reviews Transfer Pricing Audit Report

**User Story:** As a Process Owner, I want to review the TP audit report, so that I can assess accuracy, completeness, and appropriateness of conclusions before approval.

#### Acceptance Criteria

1. WHEN Audit_Report is submitted, THE System SHALL notify Process_Owner of review requirement
2. THE System SHALL enable Process_Owner to: APPROVE_REPORT, REQUEST_REVISIONS, or REJECT_REPORT with documented comments
3. THE System SHALL record Process_Owner review: reviewer identification, review date, decision, and comments
4. IF revisions are requested, THE System SHALL record revision requirements and return Audit_Report to TP Audit Team for modification

### Requirement 33: Route Audit Report Through Review and Approval Workflow Until Final Approval

**User Story:** As a system administrator, I want audit reports to progress through a defined approval workflow, so that all required stakeholders review and approve before notice generation.

#### Acceptance Criteria

1. WHEN Audit_Report is submitted for formal approval, THE System SHALL route it through configured Review_and_Approval_Workflow (reuse existing workflow/approval infrastructure)
2. THE Approval_Workflow SHALL define sequential and/or parallel approval steps with: approver role, approval action deadline, approval required/optional indicator, comments capability
3. EACH approval step SHALL record: approver identification, approval role, approval date and time, approval decision (APPROVED, RETURNED_FOR_REVISION, REJECTED), comments, and report version reviewed
4. THE System SHALL enforce: only authorized approvers per defined workflow, sequential approval progression, deadline tracking, escalation notifications
5. WHEN all required approvals are obtained, THE System SHALL transition report status to APPROVED and unlock notice generation
6. THE System SHALL prevent notice generation until all required approvals are recorded

### Requirement 34: Process Owner Sends Approved Audit Report to Taxpayer with Signature Option

**User Story:** As a Process Owner, I want to send the approved audit report to the taxpayer with signature capability, so that I can formally communicate audit findings and obtain taxpayer acknowledgment.

#### Acceptance Criteria

1. WHEN Audit_Report is fully approved, THE System SHALL enable sending the report to Taxpayer
2. THE System SHALL provide report to Taxpayer with: transmission date, auditor contact, case reference, reporting period, and signature/acknowledgment request
3. THE Taxpayer SHALL be able to: SIGN_REPORT (electronic signature or confirmation), OBJECT_TO_REPORT (with supporting rationale), or DEFER_RESPONSE within configured response deadline (default: 30 days from receipt)
4. IF Taxpayer signs the report, THE System SHALL: record signature/confirmation, timestamp, record TP audit phase completion status, and trigger transition toward Notice phase
5. IF Taxpayer object, THE System SHALL: record objection, objection rationale, supporting evidence, objection date, and maintain audit status for potential further discussion before notice
6. IF no response within deadline, THE System SHALL: send reminder notification, extend deadline once (if configured), and after final deadline, proceed with notice generation

---

### Phase 6: Notice Generation and Delivery

### Requirement 35: Generate Audit Notice Using Standard MoR Format

**User Story:** As a Process Owner, I want to generate the audit notice in standard MoR format, so that I can formally communicate TP assessment to the taxpayer.

#### Acceptance Criteria

1. WHEN TP Audit Report is approved and taxpayer acknowledgment is received, THE System SHALL enable Audit_Notice generation using standard MoR template
2. THE Audit_Notice generation SHALL: populate taxpayer and case data from audit system, reuse existing notice/template infrastructure, apply configured TP-specific notice template, and include standard MoR formatting and letterhead
3. THE Audit_Notice SHALL include: notice type identifier, issue date, notice reference number, taxpayer name, TIN, case reference, audit period, identified TP issues summarized, TP adjustments proposed, assessed principal tax amount, applicable penalties, interest calculation, total assessment amount, payment terms, objection rights, deadline for objection (typically 30 days), and contact information

### Requirement 36: Support Dynamic Variables in Notice Templates

**User Story:** As a document administrator, I want to use dynamic variables in notice templates, so that I can maintain a single template for all notices with system-populated values.

#### Acceptance Criteria

1. THE System SHALL support dynamic variable substitution in notice templates using syntax: {{variableName}}
2. SUPPORTED variables SHALL include: {{taxpayerName}}, {{TIN}}, {{caseReference}}, {{auditPeriod}}, {{assessmentAmount}}, {{issueDate}}, {{responseDeadline}}, {{noticeReference}}, {{assessedTaxes}}, {{penalties}}, {{interest}}, {{totalAmount}}, {{contactAuditor}}, {{contactPhone}}, {{contactEmail}}
3. WHEN notice is generated, THE System SHALL: replace all recognized variables with case-specific values, validate all required variables are populated before notice completion, and report any unpopulated variables to operator

### Requirement 37: Generate Unique Audit Notice Identification and Reference Number

**User Story:** As a document manager, I want the system to generate unique, traceable notice numbers, so that I can track and reference specific audit notices.

#### Acceptance Criteria

1. WHEN Audit_Notice is created, THE System SHALL automatically generate unique Notice_Reference_Number using configured format and sequence
2. THE Notice_Reference_Number generation SHALL: enforce uniqueness at database level (unique constraint), follow configured numbering pattern (e.g., TP-YYYY-NNNNN), include audit year or creation timestamp, and support manual override with operator confirmation
3. THE System SHALL prevent duplicate notice reference numbers

### Requirement 38: Notify Taxpayer When Notice is Generated

**User Story:** As a Process Owner, I want to automatically notify the taxpayer when the audit notice is issued, so that taxpayer receives timely communication of assessment.

#### Acceptance Criteria

1. WHEN Audit_Notice is finalized and issued, THE System SHALL notify Taxpayer through configured notification channels
2. THE System SHALL support notification methods: email, electronic communication portal, SMS (if configured), and physical mail routing
3. EACH notification SHALL include: notice issue date, case reference, assessment amount, objection deadline, auditor contact information, and notice reference number
4. THE System SHALL record: notification date/time, notification method(s) used, delivery status, recipient confirmation (if available), and notification result
5. THE System SHALL use existing notification infrastructure for consistency with other audit communications

### Requirement 39: Support Notice Printing (Individual and Batch)

**User Story:** As an audit team member, I want to print audit notices individually or in batch, so that I can distribute notices through physical and electronic channels.

#### Acceptance Criteria

1. THE System SHALL enable printing of individual Audit_Notices with: formatted notice content, MoR header/letterhead, taxpayer address block for mailing, and signature block for authorized official
2. THE System SHALL support batch printing of multiple notices: Notices_To_Print collection, print job queuing, batch manifest generation, print status tracking, and distribution list preparation
3. THE System SHALL reuse existing document generation and printing infrastructure

### Requirement 40: Record Returned/Undelivered Notices and Route Action Plan

**User Story:** As a mail coordinator, I want to record when notices are returned/undelivered, so that I can route notices through alternative delivery or investigation.

#### Acceptance Criteria

1. WHERE a notice delivery fails (returned by postal service, rejected by recipient, undeliverable), THE System SHALL record: notice reference, return date, reason for return (ADDRESSEE_UNKNOWN, ADDRESS_INCOMPLETE, REFUSED_DELIVERY, RETURNED_TO_SENDER, other), original delivery method, return documentation, and action status
2. WHEN a notice is returned/undelivered, THE System SHALL route an Action_Plan to designated MoR team members with: returned notice details, delivery failure reason, suggested alternative delivery methods, and action required
3. THE System SHALL track action plan status and required resolution

### Requirement 41: Generate List of Taxpayers Being Audited

**User Story:** As an audit manager, I want to view and report on taxpayers currently under TP audit, so that I can monitor audit progress and status.

#### Acceptance Criteria

1. WHEN queried, THE System SHALL generate Audited_Taxpayer_List containing: taxpayer name, TIN, case reference, audit status, assigned auditor name(s), dates of audit phases completed, issued notice count, notice dates, and current audit phase
2. THE System SHALL support filtering and pagination: by tax center, by audit status, by assigned auditor, by case assignment date, and by notice issue date range
3. THE System SHALL support sorting: by taxpayer name, by case reference, by audit status, by assigned auditor, by notice date

### Requirement 42: Store Copies/References of Notices and Letters in Taxpayer Record

**User Story:** As a tax auditor, I want to access audit notices and correspondence in the taxpayer's audit record, so that I can review history and reference documents during subsequent audits.

#### Acceptance Criteria

1. WHEN Audit_Notice or audit-related correspondence is created, THE System SHALL store reference or copy in: Taxpayer_Record document archive, Case_Record document archive, and Audit_History audit trail
2. THE System SHALL maintain document references with: document type, issue date, reference number, archive link, and retrieval capability
3. WHEN tax auditor accesses taxpayer record, THE System SHALL display available audit notices and correspondence with access to document content

### Requirement 43: Support Email Notices for Taxpayers with Email Communication Preference

**User Story:** As a taxpayer with email preference, I want to receive audit notices via email, so that I can receive timely electronic communication.

#### Acceptance Criteria

1. BEFORE sending notice, THE System SHALL verify taxpayer communication preferences: respects_email_notification flag, preferred_email_address, alternative_contact_methods
2. IF taxpayer has email preference active, THE System SHALL: send notice via email with formatted attachment or link, record email delivery timestamp, track email open status (if supported), and enable email delivery confirmation
3. IF taxpayer has NOT specified email preference, THE System SHALL use configured default delivery method (typically physical mail)
4. WHEN email notice is sent, THE System SHALL record: email address, send date/time, delivery status, and recipient response (if available)

---

### Phase 7: Assessment and Taxpayer Response

### Requirement 44: Taxpayer Reviews Assessment Notice and Indicates Accept/Objection Status

**User Story:** As a taxpayer, I want to review the assessment notice and formally respond with acceptance or objection, so that I can communicate my position on the assessed adjustment.

#### Acceptance Criteria

1. WHEN Assessment_Notice (formal notice incorporating TP audit findings) is received by taxpayer, THE System SHALL enable response capability
2. WITHIN configured objection deadline (default: 30 days from notice receipt), THE Taxpayer SHALL be able to: ACCEPT_ASSESSMENT, RAISE_OBJECTION, REQUEST_EXTENSION, or NO_RESPONSE (after deadline)
3. IF ACCEPT_ASSESSMENT, THE System SHALL: record acceptance date, timestamp, taxpayer identification, and update audit status toward completion
4. IF RAISE_OBJECTION, THE Taxpayer SHALL submit: objection text, supporting rationale, evidence references, and objection date
5. THE System SHALL record: taxpayer response date/time, response type (ACCEPT/OBJECT), response status (PENDING_AUDITOR_REVIEW, ACCEPTED, UNDER_REVIEW, RESOLVED), and associated documents

### Requirement 45: If Fraud Indicated During Assessment Review, Team Leader Escalates to Investigation

**User Story:** As a Team Leader, I want to flag and refer potential fraud findings to the investigation team, so that appropriate fraud investigation can be initiated.

#### Acceptance Criteria

1. DURING taxpayer assessment response review, IF Team_Leader identifies indicators of potential fraud or intentional misrepresentation in TP positions, THE System SHALL enable referral/escalation capability
2. WHEN potential fraud is identified, THE System SHALL record: finding description, fraud indicator, supporting evidence, investigation referral, referral date, referred-to team/person identification
3. IMPORTANT: THE System SHALL clearly document that potential fraud is NOT automatically confirmed fraud; further investigation is required
4. THE System SHALL trigger appropriate notification to Intelligence & Tax Fraud Investigation team/module (integration point; do NOT implement full fraud investigation inside TP Audit)
5. THE System SHALL track referral status and investigation outcome linkage

### Requirement 46: After Authorized Official Approval, Send Assessment Notice to Taxpayer

**User Story:** As an Authorized Official, I want to finalize and send the assessment notice to the taxpayer, so that formal assessment is communicated.

#### Acceptance Criteria

1. AFTER all required approvals and TP audit completion, THE System SHALL enable Authorized_Official to review and finalize Assessment_Notice
2. WHEN Authorized_Official approves, THE System SHALL: record approval with official name, date, time, and authorization level
3. THE System SHALL send approved Assessment_Notice to Taxpayer via: configured notification method (email, portal, physical mail), record transmission date/time, and track delivery confirmation
4. THE System SHALL lock Assessment_Notice from modification after authorization approval

### Requirement 47: Receive Confirmation from Taxpayer for Audit Report and Assessment Notice

**User Story:** As a Process Owner, I want to record taxpayer's receipt and understanding of audit report and assessment notice, so that I can document formal delivery.

#### Acceptance Criteria

1. THE System SHALL track: Taxpayer_Report_Confirmation (receipt and understanding of TP Audit Report) and Taxpayer_Assessment_Confirmation (receipt of Assessment Notice)
2. EACH confirmation record SHALL document: document type, transmission date, recipient, confirmation receipt date, signature/electronic confirmation reference, timestamp, and confirmation status (RECEIVED, ACKNOWLEDGED, DISPUTED)
3. THE System SHALL enable both electronic confirmation (portal, email link) and manual confirmation recording

---

### Phase 8: Taxpayer Response and Objection Handling

### Requirement 48: Treat Taxpayer Response to Assessment as Post-Notice Lifecycle Management

**User Story:** As an audit manager, I want to manage taxpayer responses to assessment notices as part of the audit lifecycle, so that I can track resolution of objections.

#### Acceptance Criteria

1. WHEN Taxpayer provides response to Assessment_Notice, THE System SHALL record response status: RESPONSE_RECEIVED, RESPONSE_ACCEPTED, RESPONSE_OBJECTED, RESPONSE_UNDER_REVIEW, RESPONSE_RESOLVED, RESPONSE_UNRESOLVED_AT_AUDIT_LEVEL
2. EACH response record SHALL link to: Assessment_Notice, TP Audit case, Taxpayer, response submission date, response text, supporting evidence, and response status progression
3. THE System SHALL track response workflow: RECEIVED → ASSIGNED_FOR_REVIEW → UNDER_REVIEW → DECISION (ACCEPTED/PARTIALLY_ACCEPTED/REJECTED) → RESOLVED/REFERRED

### Requirement 49: Require Objection to Reference Relevant Notice/Assessment with Supporting Evidence

**User Story:** As a review officer, I want to ensure objections are well-documented with specific references and evidence, so that I can conduct thorough review.

#### Acceptance Criteria

1. WHEN Taxpayer submits Objection to Assessment, THE System SHALL require: specific reference to Assessment_Notice or notice provision being objected to, factual explanation of objection, legal/regulatory arguments, supporting evidence documentation, and relevant sections of TP analysis being disputed
2. THE System SHALL validate objection completeness before recording as formal objection

### Requirement 50: Support Objection Review, Assessment Adjustment, and Fraud Investigation Referral

**User Story:** As a review officer, I want to conduct systematic objection review, so that I can assess validity and recommend resolution.

#### Acceptance Criteria

1. WHEN Objection is formally recorded, THE System SHALL enable Objection_Review_Workflow
2. THE Objection_Review SHALL document: review date, reviewer identification, objection claim summary, supporting evidence evaluation, audit finding evaluation, reviewer assessment (OBJECTION_VALID, OBJECTION_PARTIALLY_VALID, OBJECTION_INVALID), recommended action (ACCEPT_OBJECTION, ACCEPT_PARTIAL_OBJECTION, REJECT_OBJECTION, REFER_FOR_FURTHER_INVESTIGATION)
3. IF reviewer identifies fraud indicators from objection review, THE System SHALL enable REFER_TO_INVESTIGATION escalation per Requirement 45 methodology
4. BASED on reviewer decision, THE System SHALL: adjust assessment if appropriate (creating amended notice), request additional investigation if needed, or maintain original assessment with documented rationale

---

### Phase 9: Review and Investigation (Integration Point - Not Fully Implemented in TP Audit)

### Requirement 51: Do Not Implement Full Investigation Module; Create Appropriate Referral Integration Point

**User Story:** As a TP Audit Team member, I want to refer cases to the investigation team when appropriate, so that investigation can be conducted by specialized investigators.

#### Acceptance Criteria

1. WHEN conditions require referral to Intelligence & Tax Fraud Investigation (potential fraud, material discrepancies, intentional misstatement indicators), THE System SHALL create Referral_Record with: case reference, TP audit findings summary, fraud indicator description, supporting evidence references, referral date, referring auditor, and referred-to team/person
2. THE System SHALL NOT implement the full fraud investigation module; instead, THE System SHALL trigger integration/event/message to external Investigation module/system
3. THE System SHALL record: referral creation, referral status (PENDING, ACCEPTED, INVESTIGATION_IN_PROGRESS, INVESTIGATION_COMPLETED), and investigation outcome linkage
4. THE System SHALL support tracking investigation result and its impact on TP audit assessment (e.g., referral back to TP team for reassessment, fraud penalty addition)

---

### Phase 10: Audit Closure and Completion

### Requirement 52: Mark TP Audit as Completed/Closed When Required Conditions are Satisfied

**User Story:** As a Process Owner, I want to mark the TP audit as completed when all required steps are finished, so that I can formally close the audit.

#### Acceptance Criteria

1. WHEN all required TP audit phases and conditions are satisfied, THE System SHALL enable marking of audit case as COMPLETED_AND_CLOSED or equivalent final status
2. BEFORE closure, THE System SHALL validate: Audit_Report is approved, required notices are issued and delivered, taxpayer response is recorded or deadline has passed, assessment is finalized, required referrals are initiated, audit history is complete, and all required documents are stored
3. WHEN validation passes, THE System SHALL transition audit status to: CLOSED_SUCCESSFULLY
4. IF validation fails, THE System SHALL report: missing requirement(s), and prevent premature closure

---

### Cross-Cutting Requirements

### Requirement 53: Maintain Complete Audit History of All Transfer Pricing Audit Actions

**User Story:** As an audit manager and taxpayer, I want complete history of audit actions, so that I can track audit progress, access audit documentation, and ensure accountability.

#### Acceptance Criteria

1. THE System SHALL maintain complete append-only Audit_History for all TP audit actions: TP case creation, phase transitions, risk assessments, planning activities, field work procedures, analysis steps, report submissions, approvals, notice generation, taxpayer communications, responses, closures
2. EACH Audit_History record SHALL document: date, time, user identification, user role, action performed, action description, action status, action outcome, related entity (document, assessment, request, etc.), related entity identification, and optional comments
3. TRACKED_ACTIONS include: CREATE, UPDATE, SUBMIT, APPROVE, RETURN, REJECT, UPLOAD, DOWNLOAD, GENERATE, SEND, RECEIVE, SIGN, OBJECT, REFER, ESCALATE, COMPLETE, CLOSE
4. THE System SHALL provide queryable audit history accessible to: assigned auditors, Process Owner, management, and potentially taxpayer (for taxpayer's own actions)
5. THE System SHALL record all material TP audit decisions and cannot be modified after recording (append-only)

### Requirement 54: Link Documents to Audit Entities and Maintain Document Archive

**User Story:** As an auditor, I want to link and archive all audit documents, so that I can maintain complete audit documentation and support future reviews.

#### Acceptance Criteria

1. THE System SHALL enable document attachment to TP audit entities: Risk_Assessment, Audit_Plan, Information_Request, Taxpayer_Response, Accounting_Assessment, Transaction_Audit_Trail, Sample_Selection, Fact_Statement, Analysis workpapers, TP_Method records, Audit_Report, Assessment_Notice, and Taxpayer_Objection
2. EACH document link SHALL record: document reference, document type, upload/attachment date, related entity type, related entity identifier, document size, document format, retention requirement, and document storage location
3. THE System SHALL maintain document archive: Flyway migration or document repository with indexing, version tracking, retention management, and access control

### Requirement 55: Use Existing Notification Infrastructure for Audit Communications

**User Story:** As a system administrator, I want TP audit to use existing notification capabilities, so that I can maintain consistent audit communications.

#### Acceptance Criteria

1. THE System SHALL reuse existing NotificationProvider (or equivalent) for all audit notifications:
   - Plan approval completed
   - Information request issued
   - Document requested
   - Report ready for review
   - Report submitted to taxpayer
   - Notice generated
   - Reminder to taxpayer (payment deadline, objection deadline)
   - Taxpayer response received
   - Assessment notice issued
   - Objection received
   - Audit closure notification

2. EACH notification SHALL include: recipient identification, notification type, related case reference, key information, action required (if any), deadline (if applicable), and contact information

### Requirement 56: Implement External Integrations Behind Interface Abstractions

**User Story:** As a developer, I want TP audit integrations to use consistent interface patterns, so that I can easily add or change external providers without rewriting TP logic.

#### Acceptance Criteria

1. ALL external system integrations SHALL be implemented behind interface abstractions: EInvoicingProvider, CashRegisterProvider, TaxpayerAccountingProvider, CustomsValuationProvider, BenchmarkProvider, InternationalMarketDatabaseProvider, NotificationProvider, DocumentProvider
2. EACH interface SHALL define required methods and data contracts
3. WHERE real provider implementation is not yet available, THE System SHALL provide MockProvider implementations that: return realistic data, support success scenarios, support failure scenarios (no data, invalid request, timeout, external error), and enable testing without external dependencies
4. THE System application/domain logic SHALL NOT distinguish between mock and real implementations
5. Configuration SHALL enable switching between mock and real providers WITHOUT code changes (configuration file, environment variable, or Spring profile)
6. Future migration from mock to real provider SHALL only require: implementing real provider class, updating configuration, and NO changes to TP business logic

### Requirement 57: Enforce Authorization and Permission Controls Server-Side

**User Story:** As a security officer, I want authorization to be enforced server-side, so that access control cannot be bypassed by frontend manipulation.

#### Acceptance Criteria

1. THE System SHALL reuse existing authentication infrastructure
2. AUTHORIZATION SHALL be enforced server-side for all actions:
   - **TP_Audit_Team**: risk assessment creation/modification, planning activities, field work procedures, document upload, information request issuance, analysis procedures, report draft preparation, case-specific actions
   - **Process_Owner**: planning review/approval, report review/approval, taxpayer report delivery authorization, assessment notice authorization, case-specific management decisions
   - **Review_Committee**: planning meeting participation and case approval decisions
   - **Team_Leader**: fraud indicator assessment, investigation referral authorization
   - **Authorized_Official**: assessment notice finalization, signature authorization
   - **Taxpayer**: own case information access, information request response, fact statement review, report signoff, assessment response, objection submission

3. EACH API endpoint SHALL validate: user authentication, user authorization for requested action, resource access permission, and role-based permissions
4. AUTHORIZATION FAILURES SHALL be logged and return HTTP 403 Forbidden response
5. THE System SHALL NOT rely on frontend UI permissions; permission enforcement MUST occur in backend

### Requirement 58: Provide Management Reporting and Analytical Queries

**User Story:** As an MoR manager, I want to query and report on TP audit results and performance, so that I can analyze compliance, audit effectiveness, and revenue impact.

#### Acceptance Criteria

1. THE System SHALL provide query and reporting APIs for:
   - Completed TP audit cases (count, summary, case references)
   - Tax center / segment breakdown (audits by organization)
   - Plan vs actual completion comparison (planned audits vs completed audits)
   - Aggregate assessment: principal tax amount, penalties, interest by tax center/segment/economic sector
   - Assessment lifecycle: assessments issued, reduced via review, Tax Appeal Commission decisions, Court decisions, net assessment confirmed
   - Audit status reporting: current status distribution, phase duration analysis, bottleneck identification
   - Officer productivity: audits completed per officer, average case duration per officer, assessment amounts per officer
   - Assessments by category: TP issue type distribution, arm's-length variance distribution, penalty distribution
   - Audit visit history: audits conducted, site visits, taxpayer visit frequency
   - Disputed assessments: objections received, objections sustained, objection resolution rate
   - Investigation referrals: fraud referral count, investigation outcomes
   - Taxpayer performance: compliance vs selection criteria, repeat audit frequency, penalty history
   - Audit risk level changes: cases escalated, cases de-escalated, risk reason analysis
   - Audit yield: amounts confirmed by Appeal Commission, amounts confirmed by Courts, audit yield vs claimed

2. THE System SHALL support filtering, sorting, pagination on all queries
3. THE System SHALL return structured data suitable for: business intelligence tools, dashboards, export to Excel/CSV, and integration with MoR data analytics platform

---

## Implementation Notes

### Architecture Principles Applied

1. **Reuse existing infrastructure**: All TP audit functionality builds on shared Audit aggregate, taxpayer, user, workflow, document, and audit history infrastructure
2. **No duplication**: Single shared Audit aggregate root with type discriminator (`auditType = TRANSFER_PRICING`) for ALL audit types
3. **Type-specific extensions**: TP audit functionality is implemented as:
   - Child entities within Audit aggregate: TpRiskAssessment, TpWorkingHypothesis, TpPlanningData, TpAuditPlan, TpFieldWorkData, TpAnalysisData, TpAuditReport, TpAssessmentData
   - TP-specific phase workflow (10 phases) applied when `auditType = TRANSFER_PRICING`
   - TP-specific authorization rules applied when `auditType = TRANSFER_PRICING`
   - TP-specific child entities stored within Audit aggregate or referenced by aggregate ID
4. **Interface-based external integration**: All external system integrations behind interface abstractions; easy switching between mock and real implementations
5. **Data traceability**: Every calculation, comparison, matching result stores source data and methodology for reproducibility and explainability
6. **Append-only audit history**: Immutable record of all TP audit actions using shared AuditHistory infrastructure enables accountability and quality review
7. **Versioning without overwrite**: TP audit reports, fact statements, and assessments maintain version history to support amendments and prevent data loss

### Shared Audit Aggregate Structure (Conceptual)

```
Audit (root aggregate)
├── auditId (UUID)
├── auditType (discriminator: TRANSFER_PRICING, ISSUE, DESK, COMPREHENSIVE, ...)
├── auditPhase (current phase: ASSIGNED, DETAILED_RISK_ASSESSMENT, PLANNING, PLANNING_APPROVAL, FIELD_WORK, ANALYSIS, REPORT, REPORT_APPROVAL, NOTICE, ASSESSMENT, TAXPAYER_RESPONSE, REVIEW, COMPLETION)
├── auditStatus (ASSIGNED, IN_PROGRESS, PENDING_REVIEW, APPROVED, COMPLETED, CLOSED)
├── caseId (reference to Case)
├── taxpayerId (reference to Taxpayer)
├── assignedUserId (reference to User)
├── createdAt, updatedAt, createdBy, updatedBy
│
├── [IF auditType = TRANSFER_PRICING]
│   ├── TpRiskAssessment (child entity)
│   ├── TpWorkingHypothesis (child entity)
│   ├── TpPlanningData (child entity with: Materiality, IndustryResearch, AuditSampling)
│   ├── TpAuditPlan (child entity)
│   ├── TpFieldWorkData (child entity with: AccountingAssessment, TransactionAuditTrail, FactStatement, ...)
│   ├── TpAnalysisData (child entity with: RatioAnalysis, CostExpenseSelection, CustomsValuation, TpAnalysis, ...)
│   ├── TpAuditReport (child entity with versioning)
│   └── TpAssessmentData (child entity)
│
├── Documents (shared: references to shared Document entities)
├── AuditHistory (shared: entries from shared AuditHistory table)
├── Approvals (shared: entries from shared Approval workflow)
└── Notifications (shared: entries from shared Notification log)
```

### Transfer Pricing Phases (when auditType = TRANSFER_PRICING)

```
ASSIGNED_TO_TP_AUDIT_TEAM 
  → DETAILED_RISK_ASSESSMENT (Risk Assessment → Working Hypothesis → Planning Meeting Review)
  → PLANNING (Materiality → Industry Research → Sampling → Audit Plan → PO Review)
  → PLANNING_APPROVAL (PO Approval)
  → FIELD_WORK (Accounting Assessment → Transaction Trail → Sample Selection → Info Requests → Taxpayer Response → Fact Statement)
  → ANALYSIS (Ratio Analysis → Cost/Expense Selection → Benchmark Comparison → Cross-Border Assessment → Customs Matching → TP Analysis → TP Method Selection)
  → REPORT (Audit Report Draft → Exit Conference → Report Amendment → PO Review)
  → REPORT_APPROVAL (Multi-step Approval Workflow)
  → NOTICE (Generate Notice → Dynamic Variables → Reference Number → Taxpayer Notification → Print/Mail → Undelivered Handling)
  → ASSESSMENT (Taxpayer Review → Accept/Object → Assessment Notice → Confirmation)
  → TAXPAYER_RESPONSE (Objection Handling → Objection Review → Adjustment if needed → Fraud Escalation if needed)
  → [REVIEW if investigation referral]
  → COMPLETION (Validation → Closure)
```

### Data Traceability Examples

- **Customs Discrepancy**: Traceable to product, comparable source, HS code match rule, taxpayer import price, comparable price, calculation methodology, auditor validation
- **TP Analysis Result**: Traceable to analysis parameters, data sources consumed, calculation rule version, execution timestamp
- **Arm's Length Range**: Traceable to comparable data, method applied, TP method indicator, supporting evidence, data source
- **Risk Assessment Score**: Traceable to risk category, responses recorded, evidence documented, configured scoring rule, calculation timestamp

### Audit Type Switching Logic

When an Audit is created or loaded:
```
IF auditType = TRANSFER_PRICING THEN
  - Load TP-specific child entities (TpRiskAssessment, TpWorkingHypothesis, ...)
  - Apply TP-specific phase workflow rules
  - Apply TP-specific authorization rules (TP Audit Team, Process Owner, Review Committee, ...)
  - Apply TP-specific business logic (TP method selection, customs matching, etc.)
ELSE IF auditType = ISSUE THEN
  - Load Issue-specific child entities
  - Apply Issue-specific workflow rules
  - [similar for other audit types]
END IF
```

### Error Handling

THE System SHALL handle and provide appropriate error messages/logging for:
- Audit case not found (HTTP 404)
- Audit case not assigned to TP audit (HTTP 409 Conflict - invalid auditType or auditPhase)
- Unauthorized access (HTTP 401 Unauthorized)
- Forbidden action (HTTP 403 Forbidden - user role not authorized for TP audit actions)
- Invalid phase transition (HTTP 422 Unprocessable Entity - invalid auditPhase transition for auditType = TRANSFER_PRICING)
- Incomplete risk assessment (HTTP 422 - cannot transition to PLANNING without completed risk assessment)
- Duplicate notice reference number (HTTP 409 Conflict)
- Invalid CSV format (detailed error with correction guidance)
- Customs integration failure (informative error, retry capability)
- No comparable data found (informative, investigation guidance)
- Expired response window (informative, escalation guidance)
- Invalid objection format (validation error with correction guidance)
- Stale report version on save (optimistic locking conflict)
- Invalid approval transition (authorization/state error)
