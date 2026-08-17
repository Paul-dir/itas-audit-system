# Sprint 00: Shared Infrastructure & Kernel

**Objective:** Bootstrap the absolute minimum core infrastructure required for all 4 developers to start working in parallel without blocking each other.

**Developer:** Shared (Led by Pawlos)
**Cluster Prefix:** `shared_`

---

## 1. AI Context Prompt (DO NOT DEVIATE)

> **To the AI Assistant:** You are implementing Sprint 00. You are establishing the "Shared Kernel" for a Hexagonal Architecture Spring Boot monolith (`bs-taxaudit-core-server`).
> 
> **Constraints:**
> - You are only working in the `com.act.audit.shared` package. Do not write business logic for AP, EX, TP, etc.
> - Implement the exact base tables defined in `docs/05-database/schema.md` for the `shared_` prefix.
> - Ensure Spring Security is configured to extract `X-Actor-Id` from the request header (or JWT) to mock authentication.
> - Create the global exception handler based on RFC 7807 (see `docs/06-api/error-model.md`).

---

## 2. Backend Implementation Steps

### Step 2.1: Database (Flyway)
- Create `src/main/resources/db/migration/V0__shared_infrastructure.sql`.
- Define `shared_audit_trail_entries` and `shared_outbox_entries`.
- Implement the PostgreSQL Trigger to prevent updates/deletes on the audit trail table.

### Step 2.2: Shared Domain
- Create `AggregateRoot` base class with optimistic locking `@Version` and Domain Event publishing capabilities.
- Create cross-cutting Value Objects: `AuditType`, `CaseStatus`, `AssignmentRouting`.

### Step 2.3: Security & Interceptors
- Implement the Hibernate Interceptor that captures state changes, reads `X-Actor-Id`, and writes to `shared_audit_trail_entries`.
- Implement the `@RestControllerAdvice` to map exceptions to RFC 7807 Problem Details JSON format.

### Step 2.4: Mock Internal Engines
- Create the Java Port interfaces: `WorkflowEnginePort`, `DmsPort`, `NotificationEnginePort`.
- Create the `@Profile("mock")` adapters for these engines (e.g., `MockDmsAdapter` that returns a fake UUID).

---

## 3. Frontend Implementation Steps

### Step 3.1: Global Layout
- Scaffold the React SPA inside `src/app/`.
- Create the `GlobalLayout` component (Top Navbar + Left Sidebar + Main Workspace).
- Setup React Router v6.

### Step 3.2: RBAC Sidebar
- Implement the `Sidebar` component that reads the user's role and dynamically hides/shows menu items (Dashboard vs My Cases).

---

## 4. Acceptance Criteria
- [ ] Backend starts up locally connected to PostgreSQL via Docker Compose.
- [ ] Flyway runs successfully and audit trail trigger prevents manual SQL updates.
- [ ] Frontend shell renders correctly and sidebar items filter based on a mocked user role.
