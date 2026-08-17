# Entities and Value Objects

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document provides a detailed description of all entities and value objects in the ITAS Tax Audit & Investigation Management System.

---

## 1. Value Objects

### 1.1 TreatmentPlan

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `planType` | TreatmentPlanType | DESK, COMPREHENSIVE, TP, JOINT, ISSUE |
| `recommendedActions` | String | Recommended audit actions |
| `targetCompletionDate` | LocalDate | Target date for completion |
| `complexityRating` | ComplexityRating | LOW, MEDIUM, HIGH |

**Used By:** AuditCase (TA-003)

---

### 1.2 AuditSamplingConfiguration

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `method` | SamplingMethodType | RANDOM, SYSTEMATIC, STRATIFIED, RISK_BASED, CUSTOM |
| `parameters` | Map\<String,String\> | Method-specific settings |
| `sampleSize` | Integer | Number of items to sample |
| `confidenceLevel` | BigDecimal | Statistical confidence level |

**Used By:** AuditPlan, TpAuditPlan

---

### 1.3 PlanAllocation

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier |
| `level` | String | NATIONAL, REGIONAL, TAX_CENTER |
| `regionCode` | String | Region code (for REGIONAL and TAX_CENTER) |
| `taxCenterCode` | String | Tax center code (for TAX_CENTER) |
| `auditType` | AuditType | DESK, COMPREHENSIVE, TP, JOINT, ISSUE |
| `proposedCount` | Integer | System-generated proposal from Risk Engine |
| `localAdjustedCount` | Integer | Tax Center Manager adjustment |
| `regionalOverrideCount` | Integer | Regional Director override |
| `nationalOverrideCount` | Integer | National Director override |
| `deploymentConfirmed` | Boolean | Fan-in Gate confirmation |
| `localJustification` | String | Reason for local adjustment |
| `overrideReason` | String | Reason for override (Rule 15) |
| `overriddenBy` | String | Actor who performed the override |
| `overriddenAt` | Instant | Timestamp of override |

**Used By:** AnnualAuditPlan

---

### 1.4 DeskAuditDetail

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `evidence` | List\<Evidence\> | Internal and third-party evidence |
| `taxpayerUploads` | List\<Document\> | Taxpayer-uploaded documents |
| `analyticsRuns` | List\<AnalyticsRun\> | BI analytics run references |
| `draftReportId` | String | Draft report reference |
| `outcome` | DeskAuditOutcome | NO_ISSUE, MINOR_ISSUE, BIG_ISSUE |
| `escalationRecommendation` | String | Team Leader's escalation recommendation |
| `comprehensiveAuditRequired` | Boolean | Director's escalation decision |

**Used By:** AuditCase (when auditType = DESK)

---

### 1.5 ComprehensiveAuditDetail

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `caatEligible` | Boolean | CAAT eligibility flag |
| `caatRun` | CaatRun | CAAT execution reference |
| `assertions` | List\<AssertionVerification\> | Financial assertions verified |
| `querySheets` | List\<QuerySheet\> | Query sheets sent to taxpayer |
| `benchmarkComparisons` | List\<BenchmarkComparison\> | Industry benchmark comparisons |
| `thirdPartyMatches` | List\<ThirdPartyMatch\> | Third-party data matches |
| `testingResults` | List\<TestingResult\> | Balance sheet/revenue testing results |
| `executionReportId` | String | Execution report reference |
| `draftReportId` | String | Draft report reference |
| `multiZoneConsolidation` | Boolean | Multi-zone consolidation flag |
| `zoneSubReportIds` | List\<UUID\> | Segregated zone reports |

**Used By:** AuditCase (when auditType = COMPREHENSIVE)

---

### 1.6 IssueAuditScope

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier |
| `scopeItemId` | String | Reference ID for auditee uploads |
| `noncomplianceArea` | NoncompliantArea | The noncompliance area |
| `taxType` | String | Tax type (VAT, CIT, etc.) |
| `periodFrom` | LocalDate | Start of the period |
| `periodTo` | LocalDate | End of the period |
| `description` | String | Description of the scope |

**Used By:** IssueAudit

---

### 1.7 FieldVisitFinding

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `visitDate` | LocalDate | Date of the field visit |
| `location` | String | Location of the visit |
| `observations` | String | Auditor observations |
| `findings` | String | Findings from the field visit |
| `evidenceReferences` | List\<String\> | Associated evidence |

**Used By:** IssueAudit (when auditMode = FIELD or HYBRID)

---

### 1.8 TpWorkingHypothesis

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `hypothesisDescription` | String | Description of the hypothesis |
| `identifiedIssue` | String | The TP issue identified |
| `revenueAtRisk` | BigDecimal | Estimated revenue at risk |
| `currency` | String | Currency code |
| `calculationMethodology` | String | How revenue at risk was calculated |
| `supportingEvidence` | List\<String\> | Evidence references |

**Used By:** TpRiskAssessment

---

### 1.9 TpFactStatement

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier |
| `version` | Integer | Version number |
| `taxpayerBusinessProfile` | String | Business profile summary |
| `organizationalStructure` | String | Organizational structure |
| `relatedPartyRelationships` | String | Related party details |
| `controlledTransactions` | String | Controlled transaction summary |
| `status` | FactStatus | DRAFT, SUBMITTED_TO_TAXPAYER, TAXPAYER_REVIEW, AMENDED, FINAL |
| `taxpayerComments` | String | Taxpayer comments on the statement |

**Used By:** TpFieldWorkData

---

### 1.10 TpArmLengthAnalysis

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `method` | TpMethod | CUP, TNMM, Cost-Plus, Resale Price, Profit Split |
| `armsLengthPrice` | BigDecimal | Determined arm's length price |
| `armsLengthRangeLow` | BigDecimal | Low end of range |
| `armsLengthRangeHigh` | BigDecimal | High end of range |
| `taxpayerPrice` | BigDecimal | Taxpayer's actual price |
| `variance` | BigDecimal | Variance amount |
| `variancePercentage` | BigDecimal | Variance percentage |
| `comparableDataSources` | List\<String\> | Sources of comparable data |
| `supportingEvidence` | List\<String\> | Evidence references |

**Used By:** TpAnalysisResult

---

## 2. Entities

### 2.1 PlanAllocation (Entity within AnnualAuditPlan)

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier |
| `annualPlanId` | UUID | Parent plan ID |
| `parentAllocationId` | UUID | Parent allocation ID (for hierarchy) |
| `level` | String | NATIONAL, REGIONAL, TAX_CENTER |
| `regionCode` | String | Region code |
| `taxCenterCode` | String | Tax center code |
| `auditType` | AuditType | DESK, COMPREHENSIVE, TP, JOINT, ISSUE |
| `proposedCount` | Integer | System-generated proposal |
| `localAdjustedCount` | Integer | Tax Center feedback |
| `regionalOverrideCount` | Integer | Regional Director override |
| `nationalOverrideCount` | Integer | National Director override |
| `localJustification` | String | Justification |
| `overrideReason` | String | Override reason |
| `deploymentConfirmed` | Boolean | Fan-in Gate flag |

**Methods:**
- `calculateFinalCount()` - Computes final count based on highest-priority override
- `applyLocalAdjustment(count, justification)`
- `applyRegionalOverride(count, reason)`
- `applyNationalOverride(count, reason)`
- `confirmDeployment()`

---

### 2.2 IssueAuditScope (Entity within IssueAudit)

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier |
| `issueAuditId` | UUID | Parent IssueAudit ID |
| `scopeItemId` | String | Reference ID for auditee uploads |
| `noncomplianceArea` | NoncompliantArea | The noncompliance area |
| `taxType` | String | Tax type |
| `periodFrom` | LocalDate | Start of the period |
| `periodTo` | LocalDate | End of the period |
| `description` | String | Description |

---

### 2.3 PlanVersion (Entity within AnnualAuditPlan)

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `versionNumber` | Integer | Sequential version number |
| `status` | PlanStatus | Status at the time of this version |
| `allocationsSnapshot` | JSON | Snapshot of all allocations |
| `createdBy` | String | Actor who created this version |
| `createdAt` | Instant | Creation timestamp |
| `reason` | String | Reason for the change |

---

### 2.4 Approval (Entity within AuditReport, TpAuditReport, QualityAssuranceReview)

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `level` | String | TEAM_LEADER, PROCESS_OWNER, DIRECTOR, SENIOR_MANAGEMENT |
| `approverId` | String | Actor ID of the approver |
| `decision` | String | APPROVED, REJECTED |
| `comments` | String | Comments for rejection |
| `timestamp` | Instant | Time of approval |

---

### 2.5 Recommendation (Entity within QualityAssuranceReview)

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Unique identifier |
| `description` | String | Recommendation description |
| `actionType` | String | PROCEDURAL_ADJUSTMENT, STAKEHOLDER_NOTIFICATION, DISCIPLINARY_ACTION |
| `addressed` | Boolean | Whether the recommendation was implemented |
| `addressedAt` | Instant | When it was addressed |
| `addressedBy` | String | Who addressed it |
| `notes` | String | Additional notes |

---

## 3. Enum Definitions

### 3.1 AuditType

