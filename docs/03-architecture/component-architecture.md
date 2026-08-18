# Component Architecture

**Version:** 1.1
**Status:** In Development (Phase 1)
**Last Updated:** 2026-08-18

This document defines the internal structure of the `bs-taxaudit-core-server` codebase: the package structure, the layer responsibilities, and the critical contracts that enable parallel cluster development.

---

## 1. Fundamental Principle: Shared vs Cluster-Specific

The architecture carefully separates **shared infrastructure** from **cluster-specific business logic**. This enables autonomous cluster development while maintaining consistency.

**Golden Rule:** If a class/interface could belong to multiple clusters, it goes in **shared**. If it belongs to one cluster only, it goes in that cluster's package.

---

## 2. Current Package Structure (Phase 1)

The codebase follows **Hexagonal Architecture** organized by **layer** with cross-cutting concerns in `config`, `observability`, and shared packages. **Clusters are autonomous** and do NOT share aggregates, use cases, or controllers.

```text
mor.itas/
│
├── domain/                                 # Domain Layer (Shared Utilities Only - NO CLUSTER AGGREGATES)
│   ├── event/                              # Domain Events (DomainEvent base classes)
│   ├── exception/                          # Domain Exceptions (DomainException base class)
│   ├── valueobject/                        # Shared Value Objects (AuditType, CaseStatus, AssignmentRouting, TIN, etc.)
│   ├── service/                            # Shared Domain Services (cross-cluster utilities)
│   └── model/                              # Shared Domain Models
│
├── application/                            # Application Layer (Shared Utilities Only - NO CLUSTER USE CASES)
│   ├── port/
│   │   ├── outboundport/                   # Outbound Ports (Define interfaces for infrastructure adapters)
│   │   │   ├── riskengine/                 # RiskEnginePort (Mock adapter in engineadapter/)
│   │   │   ├── taxpayerregistration/       # TaxpayerRegistrationPort (Mock adapter in engineadapter/)
│   │   │   ├── usermanagement/             # UserManagementPort (Mock adapter in engineadapter/)
│   │   │   ├── internationaldatabase/      # InternationalDatabasePort (Mock adapter in engineadapter/)
│   │   │   ├── notification/               # NotificationEnginePort (Mock adapter in infrastructure/)
│   │   │   ├── workflow/                   # WorkflowEnginePort (Mock adapter in infrastructure/)
│   │   │   └── dms/                        # DmsPort (Mock adapter in infrastructure/)
│   │   └── inboundport/                    # Inbound Ports (Defined by API layer)
│   ├                         
│   └── event/                              # Application Events (listeners, publishers)
│
├── api/                                    # API Layer (Shared Utilities Only - NO CLUSTER CONTROLLERS)
│   ├── advice/                             # Global Exception Handlers (GlobalExceptionHandler)
│   └── dto/                                # Shared Response DTOs
│
├── infrastructure/                         # Infrastructure Layer (Shared Internal Engines - Mocks in Phase 1)
│   ├── dms/                                # DMS Adapters (Mock Document Service)
│   ├── notification/                       # Notification Engine (Mock Email/SMS)
│   └── workflow/                           # Workflow Engine (Mock State Machine)
│
├── engineadapter/                          # External Engine Adapters (Phase 1: Mocks)
│   ├── riskengine/                         # MockRiskEngineAdapter
│   ├── taxpayerregistration/               # MockTaxpayerRegistrationAdapter
│   ├── usermanagement/                     # MockUserManagementAdapter
│   └── internationaldatabase/              # MockInternationalDatabaseAdapter
│
├── persistence/                            # Persistence Layer (Shared Utilities Only - NO CLUSTER ENTITIES)
│   ├── jpa/
│   │   ├── entity/
│   │   │   └── shared/                     # Shared Entities ONLY (AuditTrailEntity, OutboxEntity)
│   │   └── repository/
│   │       └── shared/                     # Shared JPA Repositories ONLY
│   └── mapper/                             # Shared Mappers ONLY
│
├── observability/                          # Cross-Cutting: Observability (Shared)
│   ├── audit/                              # Audit Trail (ActorContextHolder, AuditTrailListener)
│   └── filter/                             # Security Filter (ActorFilter - extracts X-Actor-Id)
│
├── config/                                 # Cross-Cutting: Configuration (Shared)
│   └── [Spring Configuration classes]      # Security, Kafka, Jackson config
│
├── ap/                                     # Audit Planning Cluster (AUTONOMOUS)
│   ├── domain/                             # AP-specific aggregates, VOs, services, events, exceptions
│   ├── application/                        # AP-specific use cases, services, DTOs, event listeners
│   ├── api/                                # AP-specific controllers, request/response DTOs
│   └── infrastructure/                     # AP-specific persistence adapters, JPA entities, mappers
│
├── ex/                                     # Execution Cluster (AUTONOMOUS) - To be added
│   ├── domain/
│   ├── application/
│   ├── api/
│   └── infrastructure/
│
├── tp/                                     # Transfer Pricing Cluster (AUTONOMOUS) - To be added
│   ├── domain/
│   ├── application/
│   ├── api/
│   └── infrastructure/
│
├── ja/                                     # Joint Audit Cluster (AUTONOMOUS) - To be added
│   ├── domain/
│   ├── application/
│   ├── api/
│   └── infrastructure/
│
├── cm/                                     # Communication Cluster (AUTONOMOUS) - To be added
│   ├── domain/
│   ├── application/
│   ├── api/
│   └── infrastructure/
│
├── rf/                                     # Reporting & Finalization Cluster (AUTONOMOUS) - To be added
│   ├── domain/
│   ├── application/
│   ├── api/
│   └── infrastructure/
│
├── qa/                                     # Quality Assurance Cluster (AUTONOMOUS) - To be added
│   ├── domain/
│   ├── application/
│   ├── api/
│   └── infrastructure/
│
├── ia/                                     # Issue Audit Cluster (AUTONOMOUS) - To be added
│   ├── domain/
│   ├── application/
│   ├── api/
│   └── infrastructure/
│
└── TaxAuditApplication.java                # Spring Boot entry point
```

---

## 3. What Goes Where: Shared vs Cluster-Specific

### 3.1 SHARED - Domain Layer
- Base exception classes (e.g., `DomainException`)
- Base event classes (e.g., `DomainEvent`)
- Shared value objects used by **multiple clusters** (e.g., `AuditType`, `CaseStatus`, `TIN`, `AssignmentRouting`, `AuditPeriod`)
- Shared domain services/utilities (e.g., `DateUtility`, `TINValidator`)

### 3.2 SHARED - Application Layer
- Outbound port interfaces (e.g., `RiskEnginePort`, `TaxpayerRegistrationPort`, `WorkflowEnginePort`, `NotificationEnginePort`, `DmsPort`)
- Shared DTOs (e.g., `ApiResponse`, `PaginationRequest`, `ErrorResponse`)
- Event publishers and listeners infrastructure

### 3.3 SHARED - API Layer
- Global exception handlers (e.g., `GlobalExceptionHandler`)
- Shared response DTOs and wrappers

### 3.4 SHARED - Infrastructure Layer
- Mock implementations of outbound ports (Phase 1):
  - `MockRiskEngineAdapter` (implements `RiskEnginePort`)
  - `MockTaxpayerRegistrationAdapter` (implements `TaxpayerRegistrationPort`)
  - `MockUserManagementAdapter` (implements `UserManagementPort`)
  - `MockInternationalDatabaseAdapter` (implements `InternationalDatabasePort`)
  - `MockNotificationEngineAdapter` (implements `NotificationEnginePort`)
  - `MockWorkflowEngineAdapter` (implements `WorkflowEnginePort`)
  - `MockDmsAdapter` (implements `DmsPort`)
- Shared entities (e.g., `AuditTrailEntity`, `OutboxEntity`)
- Shared JPA repositories (e.g., `AuditTrailRepository`, `OutboxRepository`)
- Shared mappers

### 3.5 SHARED - Observability & Config
- Security filters (e.g., `ActorFilter`)
- Audit trail listeners (e.g., `AuditTrailListener`)
- Spring configuration (Security, Kafka, Jackson)

### 3.6 CLUSTER-SPECIFIC - Domain Layer (e.g., AP)
- Cluster aggregates (e.g., `AnnualAuditPlan`, `PlanAllocation`)
- Cluster-specific value objects (e.g., `QuotaAllocation`)
- Cluster-specific domain services (e.g., `PlanCalculationService`)
- Cluster-specific domain events (e.g., `PlanFinalizedEvent`)
- Cluster-specific exceptions (e.g., `PlanAlreadyApprovedException`)

### 3.7 CLUSTER-SPECIFIC - Application Layer (e.g., AP)
- Cluster repository ports (e.g., `AnnualAuditPlanRepository`)
- Cluster use cases (e.g., `CreateAnnualPlanUseCase`, `ApprovePlanUseCase`)
- Cluster application services (e.g., `PlanOrchestrationService`)
- Cluster event listeners (that respond to cluster-specific events)
- Cluster-specific DTOs (if not shared)

### 3.8 CLUSTER-SPECIFIC - API Layer (e.g., AP)
- Cluster controllers (e.g., `AnnualAuditPlanController`)
- Cluster request/response DTOs (e.g., `CreatePlanRequest`, `PlanResponse`)
- Cluster-specific exception handlers (if needed)

### 3.9 CLUSTER-SPECIFIC - Infrastructure Layer (e.g., AP)
- Cluster persistence adapters (e.g., `AnnualAuditPlanPersistenceAdapter`)
- Cluster JPA entities (e.g., `AnnualAuditPlanEntity`, `PlanAllocationEntity`)
- Cluster JPA repositories (e.g., `AnnualAuditPlanJpaRepository`)
- Cluster mappers (e.g., `AnnualAuditPlanEntityMapper`)

---

## 4. Layer Responsibilities

### 4.1 Domain Layer (`domain/`)
**Shared:**
- Pure business logic, never imports Spring or framework code
- Base exception and event classes
- Shared value objects and validators
- Cross-cluster domain services

**Cluster (e.g., AP):**
- Cluster aggregates and root entities
- Cluster-specific value objects
- Cluster domain services
- Cluster domain events
- Cluster-specific exceptions

### 4.2 Application Layer (`application/`)
**Shared:**
- Outbound port definitions
- Shared DTOs and event infrastructure
- Base event publishers/listeners

**Cluster (e.g., AP):**
- Repository ports for that cluster
- Use cases (business transaction boundaries)
- Application services (orchestrators)
- Cluster event listeners
- Cluster-specific DTOs

### 4.3 API Layer (`api/`)
**Shared:**
- Global exception handlers
- Shared response formats

**Cluster (e.g., AP):**
- REST controllers for that cluster
- Request/response DTOs for HTTP
- Cluster-specific exception handlers (optional)

### 4.4 Infrastructure Layer (`infrastructure/`, `engineadapter/`, `persistence/`)
**Shared:**
- Mock implementations of all outbound ports
- Shared persistence entities and repositories
- Shared mappers

**Cluster (e.g., AP):**
- Persistence adapters (implement repository ports)
- JPA entities and repositories
- Entity mappers
- External adapters (if needed)

---

## 5. Current Implementation Status (Phase 1)

### 5.1 Completed / In Development

**Shared Packages:**
- ✅ Domain: `AuditType`, `CaseStatus`, `AssignmentRouting` value objects
- ✅ Domain: `DomainException`, `DomainEvent` base classes
- ✅ Application: Port interfaces defined for all external/internal engines
- ✅ Application: Mock adapters created in `engineadapter/` and `infrastructure/`
- ✅ API: Global exception handler
- ✅ Observability: Audit trail infrastructure
- ✅ Config: Spring configuration

**AP Cluster:**
- ✅ Domain: `AnnualAuditPlan`, `PlanAllocation` aggregates
- ✅ Application: (in progress)
- ✅ API: Basic controller structure
- ✅ Infrastructure: Persistence adapter and JPA entities

### 5.2 To Be Implemented

**AP Cluster:**
- ⏳ Use Cases: `CreateAnnualPlanUseCase`, `ApprovePlanUseCase`, `CascadePlanUseCase`, etc.
- ⏳ Full REST endpoints
- ⏳ Event listeners

**All Other Clusters (EX, TP, JA, CM, RF, QA, IA):**
- ⏳ Domain Layer: Aggregates, value objects, domain services, events, exceptions
- ⏳ Application Layer: Repository ports, use cases, services, event listeners
- ⏳ API Layer: Controllers, request/response DTOs
- ⏳ Infrastructure Layer: Persistence adapters, JPA entities, mappers

---

## 6. How Clusters Interact

### 6.1 Cluster-to-Cluster Communication

Clusters communicate through:
1. **Domain Events (Kafka):** Async communication via outbox pattern
2. **Shared Value Objects:** Read-only access to shared domain concepts
3. **Explicit Dependencies:** Via shared ports only

### 6.2 Example: AP → EX Flow

```
AP Cluster                          Shared                         EX Cluster
─────────────────                ──────────                     ──────────────

AnnualAuditPlan                                                 
  (created & finalized)
     │
     ├─→ Publish Event ────────→ Kafka ────────────────────→ Listen to Event
     │   "PlanFinalizedEvent"                               "PlanFinalizedEvent"
     │                                                           │
     │   (read-only access)                                      ├─→ DeskAudit
     ├─→ Query Shared VOs ◄─────→ AuditType, CaseStatus         │   (created)
     │                            (shared value objects)          │
     │                                                            ├─→ Publish Event
     │                                                            │   "DeskAuditCreatedEvent"
     │                                                            │
     │                                                            └─→ (EX cluster is fully autonomous)
     │
     └─ AP does NOT directly know about EX aggregates
        EX does NOT directly know about AP aggregates
        Communication is only through events and shared concepts
```

### 6.3 Why This Separation Matters

1. **Autonomy:** Each cluster team works independently
2. **Scalability:** New clusters added without modifying existing clusters
3. **Testability:** Each cluster can be tested in isolation
4. **Reusability:** Shared classes are used by many clusters
5. **Clear Boundaries:** Dependencies are explicit and manageable
6. **Low Coupling:** Clusters are loosely coupled via events, not direct dependencies

---

## 7. Critical Design Patterns

### 7.1 Outbound Port Pattern (Shared Ports)
All external integrations are behind port interfaces defined in `application/port/outboundport/`.

**Example:**
```
Port (Interface):    application/port/outboundport/riskengine/RiskEnginePort
Mock Adapter:        engineadapter/riskengine/MockRiskEngineAdapter
Real Adapter (Phase 2): engineadapter/riskengine/RealRiskEngineAdapter
```

**Usage:** All layers depend on the port, infrastructure implements it.

### 7.2 Repository Port Pattern (Cluster-Specific Ports)
Each cluster defines repository ports in its own application layer.

**Example (AP Cluster):**
```
Port (Interface):    ap/application/port/AnnualAuditPlanRepository
JPA Adapter:         ap/infrastructure/adapter/AnnualAuditPlanPersistenceAdapter
JPA Repository:      ap/persistence/jpa/AnnualAuditPlanJpaRepository
```

### 7.3 Audit Trail Pattern (Shared)
Every mutation is logged to `shared_audit_trail_entries` table via the `AuditTrailListener`.

### 7.4 Transactional Outbox (Shared)
- Application saves aggregate + outbox entry in same transaction
- Outbox poller publishes events to Kafka
- Guarantees at-least-once delivery

### 7.5 Actor Extraction (Shared)
The `ActorFilter` extracts user ID from JWT and stores in `ActorContextHolder` for use throughout the request.

---

## 8. Cluster Implementation Template

When implementing a new cluster (EX, TP, JA, CM, RF, QA, IA), follow this structure:

### 8.1 Package Structure
```text
mor.itas.{cluster}/
├── domain/
│   ├── aggregate/     # Cluster aggregates
│   ├── event/         # Cluster domain events
│   ├── valueobject/   # Cluster-specific VOs
│   ├── exception/     # Cluster exceptions
│   └── service/       # Cluster domain services
├── application/
│   ├── port/          # Cluster repository ports
│   ├── usecase/       # Cluster use cases
│   ├── service/       # Cluster application services
│   ├── dto/           # Cluster DTOs
│   └── event/         # Event listeners
├── api/
│   ├── controller/    # REST controllers
│   ├── dto/           # HTTP DTOs
│   └── advice/        # Exception handlers (optional)
└── infrastructure/
    ├── adapter/       # Persistence adapters
    └── jpa/           # JPA entities, repositories, mappers
```

### 8.2 Implementation Checklist

**Domain Layer:**
- [ ] Define aggregates and root entities
- [ ] Define value objects (cluster-specific)
- [ ] Define domain services
- [ ] Define domain events
- [ ] Define domain exceptions
- [ ] **No Spring imports**

**Application Layer:**
- [ ] Define repository port interface
- [ ] Define use cases (implement business logic)
- [ ] Define application services
- [ ] Create event listeners
- [ ] Define internal DTOs

**API Layer:**
- [ ] Create REST controllers
- [ ] Create request/response DTOs
- [ ] Add input validation
- [ ] Create exception handlers (if needed)

**Infrastructure Layer:**
- [ ] Create persistence adapter (implements repository port)
- [ ] Create JPA entities
- [ ] Create JPA repository
- [ ] Create entity mappers

**Database:**
- [ ] Create Flyway migration
- [ ] Use cluster 2-letter prefix (e.g., `ex_`, `tp_`)

---

## 9. Database Table Ownership

Each cluster owns its tables. Table prefixes enforce isolation:

| Cluster | Prefix | Example Tables |
| :--- | :--- | :--- |
| Audit Planning | `ap_` | `ap_annual_audit_plan`, `ap_plan_allocation` |
| Execution | `ex_` | `ex_desk_audit`, `ex_comprehensive_audit` |
| Transfer Pricing | `tp_` | `tp_audit_plan`, `tp_analysis_result` |
| Joint Audit | `ja_` | `ja_joint_audit`, `ja_execution_report` |
| Communication | `cm_` | `cm_audit_notice`, `cm_entry_conference` |
| Reporting & Finalization | `rf_` | `rf_audit_report`, `rf_assessment_notice` |
| Quality Assurance | `qa_` | `qa_review`, `qa_sample_case` |
| Issue Audit | `ia_` | `ia_issue_audit`, `ia_audit_report` |
| Shared | `shared_` | `shared_audit_trail_entries`, `shared_outbox_entries` |

**Rule:** Developers may only modify tables belonging to their cluster.

---

## 10. Testing Strategy

### 10.1 Unit Tests (Per Cluster)
- Test domain aggregates and value objects
- Test domain services
- Test use cases logic
- Target: ≥80% coverage

### 10.2 Integration Tests (Per Cluster)
- Test use cases with real JPA (Testcontainers)
- Test adapters
- Test event publishing to outbox

### 10.3 End-to-End Tests (Cross-Cluster)
- Test full cluster flows
- Test inter-cluster communication via Kafka
- Test fallback scenarios

---

## 11. Recommended Implementation Timeline

| Phase | Clusters | Timeline |
| :--- | :--- | :--- |
| **Phase 1A** | AP (Audit Planning) | Sprint 1-2 |
| **Phase 1B** | EX (Execution) | Sprint 2-3 |
| **Phase 1C** | TP, JA (Specialized) | Sprint 3-4 |
| **Phase 2A** | CM, RF (Communication) | Sprint 4-5 |
| **Phase 2B** | QA (Quality Assurance) | Sprint 5-6 |
| **Phase 2C** | IA (Issue Audit) | Sprint 6+ |

---

## 12. Key Takeaways

1. **Shared packages contain ONLY cross-cluster utilities, not business logic**
2. **Each cluster owns its domain, application, API, and infrastructure layers**
3. **Clusters communicate via events and shared concepts, not direct dependencies**
4. **Autonomy enables parallel development across 8 independent clusters**
5. **Clear package structure makes it obvious where to add new code**
