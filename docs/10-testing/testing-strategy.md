# Testing Strategy

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document outlines the testing pyramid and tools for the ITAS Tax Audit System.

---

## 1. Testing Pyramid

### 1.1 Unit Tests (70% Coverage Target)
- **Backend:** JUnit 5, Mockito, AssertJ. Focus on testing Domain Aggregates (e.g., `AuditCase.submitFeedback()`) and Domain Services.
- **Frontend:** Jest, React Testing Library. Focus on Redux reducers, utility functions, and complex isolated components.
- **Rule:** Never load the Spring Context for unit tests. They must run in milliseconds.

### 1.2 Integration Tests (20% Coverage Target)
- **Backend:** Spring Boot Test, Testcontainers (PostgreSQL). Focus on Repository Adapters (JPA) and API Controllers.
- **Rule:** Use `@Profile("mock")` to ensure external systems (Risk Engine) do not block local tests.

### 1.3 End-to-End (E2E) Tests (10% Coverage Target)
- **Tool:** Playwright or Cypress.
- **Focus:** Critical business paths (e.g., AP Case Cascade → Desk Audit Execution → Report Generation).

---

## 2. Hexagonal Architecture Testing Rules

Because we use Hexagonal Architecture, testing is highly isolated:

1. **Test the Domain:** You can test business rules (like the Fan-in Gate) purely in memory by instantiating the Aggregate roots. No database required.
2. **Test the Adapters:** You only need Testcontainers when testing the specific classes in `infrastructure/persistence` or `infrastructure/api`.
3. **Mock the Ports:** When testing Application Services (Use Cases), mock the outbound ports (e.g., `RiskEnginePort`, `AuditCaseRepositoryPort`).
