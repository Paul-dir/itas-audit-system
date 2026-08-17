# Component Architecture

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document defines the internal structure of the `bs-taxaudit-core-server` codebase: the package structure, the layer responsibilities, and the critical contracts that enable parallel development.

---

## 1. Package Structure (The Source Tree)

The codebase is organized by **feature cluster** with a **shared kernel** for cross-cutting concerns.

```text
com.act.audit/
│
├── shared/                                 # Shared Kernel (Everyone depends on this)
│   ├── domain/
│   │   ├── model/                          # Shared VOs (TaxCenterCode, TIN, AuditType, Source, AssignmentRouting)
│   │   ├── events/                         # Base DomainEvent class
│   │   └── exceptions/                     # DomainException base class
│   ├── application/
│   │   ├── ports/                          # Shared Outbound Ports (RiskEngine, RegistrationService, etc.)
│   │   └── dto/                            # Shared DTOs (ApiResponse, PaginationRequest)
│   ├── infrastructure/
│   │   ├── adapters/
│   │   │   ├── outbox/                     # Transactional Outbox
│   │   │   ├── audit/                      # Immutable Audit Trail
│   │   │   ├── engine/                     # Internal Engines (Mocks in Phase 1)
│   │   │   └── external/                   # External REST Clients (Mocks in Phase 1)
│   │   └── config/                         # Spring Config (Security, Kafka, Jackson)
│   └── api/
│       └── common/                         # Shared API Utils
│
├── ap/                                     # Audit Planning & Setup (Pawlos)
│   ├── domain/                             # Aggregates: AnnualAuditPlan, PlanAllocation, AuditCase, AuditReferral
│   ├── application/
│   │   ├── service/                        # RiskPoolQueryService, AuditorCapacityService, AuditCaseCascadeService
│   │   ├── usecase/                        # GeneratePlanProposalUseCase, CascadePlanToCasesUseCase, etc.
│   │   └── ports/                          # AuditTypeSpecificPlanningPort (CRITICAL HANDFOFF)
│   ├── infrastructure/                     # JPA for ap_* tables
│   └── api/                                # REST Controllers for AP
│
├── ex/                                     # Execution (Desk & Comprehensive) (Oliad)
│   ├── domain/                             # VOs: DeskAuditDetail, ComprehensiveAuditDetail, MultiZoneConsolidation
│   ├── application/
│   │   ├── service/                        # DeskAuditPlanningService (implements AuditTypeSpecificPlanningPort)
│   │   └── usecase/                        # ConductDeskAuditUseCase, EscalateToComprehensiveUseCase, etc.
│   ├── infrastructure/                     # JPA for ex_* tables
│   └── api/                                # REST Controllers for EX
│
├── tp/                                     # Transfer Pricing (Borifa)
│   ├── domain/                             # Aggregates: TpRiskAssessment, TpAuditPlan, TpAnalysisResult, TpAuditReport
│   ├── application/
│   │   ├── service/                        # TpPlanningService (implements AuditTypeSpecificPlanningPort)
│   │   └── usecase/                        # InitiateTpAuditUseCase, PerformTpAnalysisUseCase, etc.
│   ├── infrastructure/                     # JPA for tp_* tables
│   └── api/                                # REST Controllers for TP
│
├── ja/                                     # Joint Audit (Yoseph)
│   ├── domain/                             # Aggregates: JointAudit, JointAuditPlan, JointExecutionReport, FederatedWorkspace
│   ├── application/
│   │   ├── service/                        # JointPlanningService (implements AuditTypeSpecificPlanningPort)
│   │   └── usecase/                        # FormJointAuditTeamUseCase, ExecuteJointAuditUseCase
│   ├── infrastructure/                     # JPA for ja_* tables
│   └── api/                                # REST Controllers for JA
│
├── cm/                                     # Communication (Yoseph)
│   ├── domain/                             # Aggregates: AuditNotice, EntryConference, AlternativeDelivery
│   ├── application/
│   │   └── usecase/                        # IssueNoticeUseCase, ScheduleEntryConferenceUseCase
│   ├── infrastructure/                     # JPA for cm_* tables
│   └── api/                                # REST Controllers for CM
│
├── rf/                                     # Reporting & Finalization (Yoseph)
│   ├── domain/                             # Aggregates: AuditReport, ExitConference, AssessmentNotice, TaxpayerResponse
│   ├── application/
│   │   └── usecase/                        # GenerateAuditReportUseCase, IssueAssessmentNoticeUseCase
│   ├── infrastructure/                     # JPA for rf_* tables
│   └── api/                                # REST Controllers for RF
│
├── qa/                                     # Quality Assurance (Oliad)
│   ├── domain/                             # Aggregates: QualityAssuranceReview, QaRecommendation
│   ├── application/
│   │   ├── service/                        # QaSamplingService (Auditable Random Sampling)
│   │   └── usecase/                        # SampleAuditCasesForQaUseCase, ConductQaReviewUseCase
│   ├── infrastructure/                     # JPA for qa_* tables
│   └── api/                                # REST Controllers for QA
│
└── ia/                                     # Issue Audit (Borifa)
    ├── domain/                             # Aggregates: IssueAudit, IssueAuditScope, IssueAuditReport, FieldVisitFinding
    ├── application/
    │   ├── service/                        # IssueAuditEscalationService (Revision cap enforcement)
    │   └── usecase/                        # InitiateIssueAuditUseCase, SelectIssueAuditScopeUseCase, DirectorReviewIssueAuditUseCase
    ├── infrastructure/                     # JPA for ia_* tables
    └── api/                                # REST Controllers for IA

