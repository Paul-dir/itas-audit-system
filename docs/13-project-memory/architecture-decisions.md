# Architectural Decision Records (ADRs)

**Version:** 1.0
**Last Updated:** 2026-08-17

This document logs the immutable architectural decisions made during the system design phase.

## ADR-001: Monolithic Architecture
- **Decision:** The system will be built as a Modular Monolith (`bs-taxaudit-core-server`) rather than Microservices.
- **Reasoning:** Reduces deployment complexity, avoids distributed transaction failures, and simplifies local development for the 4-track team.

## ADR-002: Single Schema with Prefixing
- **Decision:** All 4 development tracks will share a single PostgreSQL schema, but every table MUST be prefixed with a 2-letter cluster ID (`ap_`, `ex_`, `tp_`, `ja_`, `cm_`, `rf_`, `ia_`, `qa_`).
- **Reasoning:** Prevents Git/Flyway merge conflicts while allowing cross-cluster Foreign Key references.

## ADR-003: Hexagonal Ports for External Systems
- **Decision:** Any integration with an external ITAS system (Risk Engine, DMS, Ledger, Notification) must be defined as a Java Interface (Port) in `com.act.audit.shared.domain.ports`.
- **Reasoning:** Allows development to continue uninterrupted using `@Profile("mock")` adapters while the external systems are being built.

## ADR-004: Immutable Audit Trail
- **Decision:** All state changes must be logged in `shared_audit_trail_entries`. A PostgreSQL Trigger explicitly blocks `UPDATE` and `DELETE` commands on this table.
- **Reasoning:** Mandatory legal compliance. The RF cluster will use this table exclusively for CQRS Event Sourced reporting.

## ADR-005: React Vertical Slices
- **Decision:** The frontend is a Single Page Application (SPA). However, developers must place their components inside `src/features/{cluster_prefix}/`.
- **Reasoning:** Prevents React developers from overwriting each other's UI components.
