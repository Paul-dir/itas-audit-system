# Mock Integration Strategy

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document defines the strategy for integrating with both Internal Engines and External Systems during Phase 1 (Parallel Development).

---

## 1. The Strategy: Hexagonal Ports and Adapters

To ensure that the 4 developer tracks are never blocked by unfinished systems, **every** integration is defined as a Java Interface (a "Port") in the Shared Kernel. 

During Phase 1, we will implement these interfaces using `@Profile("mock")` Spring Adapters that return hardcoded or in-memory data.

---

## 2. External System Mocks

| System | Port Interface | Mock Adapter Behavior |
| :--- | :--- | :--- |
| **Risk Engine** | `RiskEnginePort` | Returns a fixed heat-map and hardcoded scores for test TINs (e.g., TIN `111` is HIGH risk, `222` is LOW risk). |
| **Registration** | `TaxpayerRegistrationPort` | Returns static profile data (Name, Address) for a predefined set of 10 TINs. |
| **Keycloak** | *Spring Security* | Security configuration is bypassed or configured to accept a mock JWT token via `X-Actor-Id`. |

---

## 3. Internal Engine Mocks

Per the architecture, the Internal Engines (Workflow, Rules, DMS, Ledger, Notification) will eventually be fully-fledged internal Spring Modules. For Phase 1, they are also mocked:

| Engine | Port Interface | Mock Adapter Behavior |
| :--- | :--- | :--- |
| **Workflow** | `WorkflowEnginePort` | Immediately auto-approves requests or blindly advances the state machine in memory. |
| **Rule** | `RuleEnginePort` | Evaluates basic `if/else` logic instead of loading drools/DMN tables. |
| **DMS** | `DmsPort` | Stores files on the local disk (`/tmp/itas-dms`) and returns a static UUID reference. |
| **Ledger** | `LedgerEnginePort` | Logs to the console that an assessment was posted. Returns a fake receipt ID. |
| **Notification** | `NotificationEnginePort` | Logs emails and SMS messages to the server console via `slf4j`. |

---

## 4. Developer Rule

**Do not** write REST calls to the Risk Engine directly in your application services. 
**Always** inject the `RiskEnginePort`. The Spring Application Context will automatically provide the Mock Adapter during local development.
