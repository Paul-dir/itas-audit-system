# Integration Architecture

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document defines the contracts for all external integrations, the mock strategy, and the fallback mechanisms.

---

## 1. Integration Overview

The system integrates with the following external systems:

| System | Type | Direction | Purpose | Phase 1 |
| :--- | :--- | :--- | :--- | :--- |
| **Risk Engine** | REST API | Read-Only | Risk scoring, heatmaps, TIN lists | Mock Client |
| **Registration Service** | REST API | Read-Only | Taxpayer profiles, organization hierarchy | Mock Client |
| **Kafka** | Event Broker | Outbound | Event delivery to downstream consumers | In-Memory Mock |
| **S3/Minio** | Object Storage | Read/Write | File storage for DMS | Local Filesystem Mock |
| **SMTP/SMS Gateway** | Message Delivery | Outbound | Email and SMS notifications | Console Log Mock |

---

## 2. Risk Engine Integration

### 2.1 Contract Definition
**Port:** `com.act.audit.shared.application.ports.RiskEnginePort`

### 2.2 Query Types

#### 2.2.1 Aggregated Risk Heatmap (TA-001)
| Field | Type | Description |
| :--- | :--- | :--- |
| **Request** | | |
| `year` | Integer | Fiscal year |
| `regionCode` | String | Optional, filter by region |
| `taxCenterCode` | String | Optional, filter by tax center |
| `auditType` | String | Optional, filter by audit type |
| **Response** | | |
| `riskDistribution` | List | Array of risk counts per region/tax center |
| `cacheTimestamp` | DateTime | When the data was generated |

#### 2.2.2 Scoped TIN List (TA-002)
| Field | Type | Description |
| :--- | :--- | :--- |
| **Request** | | |
| `regionCode` | String | Region to filter |
| `taxCenterCode` | String | Tax center to filter |
| `auditType` | String | DESK, COMPREHENSIVE, TP, JOINT, ISSUE |
| `limit` | Integer | Maximum number of TINs to return |
| **Response** | | |
| `tins` | List | Array of TIN strings |
| `totalAvailable` | Integer | Total matching TINs in the system |
| `riskScores` | Map | TIN to risk score mapping |

#### 2.2.3 Single TIN Score (TA-005, TA-009, TA-015, TA-025)
| Field | Type | Description |
| :--- | :--- | :--- |
| **Request** | | |
| `tin` | String | Taxpayer TIN |
| **Response** | | |
| `tin` | String | Taxpayer TIN |
| `riskScore` | Integer | 0-100 risk score |
| `riskLevel` | String | CRITICAL, HIGH, MEDIUM, LOW |
| `riskIndicators` | List | Array of risk indicator descriptions |
| `lastUpdated` | DateTime | Last update timestamp |

#### 2.2.4 Random Sample (TA-003 AF5)
| Field | Type | Description |
| :--- | :--- | :--- |
| **Request** | | |
| `regionCode` | String | Region to filter |
| `taxCenterCode` | String | Tax center to filter |
| `sampleSize` | Integer | Number of random TINs to return |
| `excludeRisk` | Boolean | If true, return non-risky taxpayers |
| **Response** | | |
| `tins` | List | Array of randomly selected TINs |
| `samplingSeed` | String | Cryptographic seed used for randomness |

### 2.3 Mock Strategy
| Scenario | Behavior |
| :--- | :--- |
| **Mock Adapter** | Returns pre-seeded data from `src/test/resources/mock-data/risk-engine/`. |
| **Fallback** | If the real Risk Engine is unavailable, the system uses the **last cached snapshot** (cached for 24 hours) and sets a `warningFlag = true` in the response. The auditor is notified. |

---

## 3. Registration Service Integration

### 3.1 Contract Definition
**Port:** `com.act.audit.shared.application.ports.RegistrationServicePort`

### 3.2 API Methods

#### 3.2.1 Get Taxpayer Profile
| Field | Type | Description |
| :--- | :--- | :--- |
| **Request** | | |
| `tin` | String | Taxpayer TIN |
| **Response** | | |
| `tin` | String | Taxpayer TIN |
| `fullName` | String | Legal business name |
| `regionCode` | String | Region code |
| `taxCenterCode` | String | Tax center code |
| `sector` | String | Business sector |
| `email` | String | Contact email |
| `phone` | String | Contact phone |
| `address` | String | Physical address |

#### 3.2.2 Get Organization Hierarchy
| Field | Type | Description |
| :--- | :--- | :--- |
| **Request** | | |
| `regionCode` | String | Region code |
| `taxCenterCode` | String | Tax center code |
| **Response** | | |
| `region` | Object | Region name, code, parent |
| `taxCenter` | Object | Tax center name, code, region |

### 3.3 Mock Strategy
| Scenario | Behavior |
| :--- | :--- |
| **Mock Adapter** | Returns pre-seeded data from `src/test/resources/mock-data/registration/`. |
| **Fallback** | If the Registration Service is unavailable, the system uses the **last cached snapshot** and warns the user. |

---

## 4. Internal Engine Ports (Used Internally)

### 4.1 WorkflowEnginePort
| Method | Purpose |
| :--- | :--- |
| `startWorkflow(definition, variables)` | Start a new workflow instance (e.g., Annual Plan approval). |
| `transition(instanceId, transition, variables)` | Transition a workflow to the next state. |
| `scheduleTimer(instanceId, timerId, duration)` | Schedule an SLA timer (e.g., Issue Audit response deadline). |
| `getStatus(instanceId)` | Get current workflow state. |

### 4.2 RuleEnginePort
| Method | Purpose |
| :--- | :--- |
| `evaluate(rulePackage, facts)` | Evaluate a rule package against facts (return boolean). |
| `execute(rulePackage, facts)` | Execute a rule package and return modified facts (e.g., TP method selection). |

### 4.3 NotificationEnginePort
| Method | Purpose |
| :--- | :--- |
| `sendEmail(to, subject, body)` | Send an email notification. |
| `sendSms(to, message)` | Send an SMS notification. |
| `sendPortalNotification(tin, message)` | Send a portal notification to a taxpayer. |

### 4.4 DmsPort
| Method | Purpose |
| :--- | :--- |
| `storeFile(content, fileName, mimeType)` | Store a file and return a reference. |
| `retrieveFile(reference)` | Retrieve a file by reference. |
| `renderPdf(templateId, variables)` | Render a PDF from a template (e.g., audit notice). |

### 4.5 LedgerEnginePort
| Method | Purpose |
| :--- | :--- |
| `postAssessment(tin, accountType, amount, reference)` | Post an assessment to the ledger (Principal, Penalty, Interest). |
| `getLedgerHistory(tin)` | Get ledger history for a taxpayer. |

---

## 5. Event Integration (Outbound Kafka)

### 5.1 Event Topics
| Topic | Description | Key Fields |
| :--- | :--- | :--- |
| `tax-audit-events` | All core audit lifecycle events. | `eventId`, `eventType`, `aggregateId`, `aggregateType`, `occurredAt`, `actorId`, `payload` |
| `fraud-events` | Fraud escalation events. | `caseId`, `fraudIndicators`, `directorId` |
| `case-management-events` | Objection/dispute events. | `caseId`, `objectionId`, `taxpayerId` |

### 5.2 Event Serialization
- Events are serialized to JSON using Jackson.
- Schema registry ensures backward compatibility.

---

## 6. Fallback & Resilience

| Component | Failure Scenario | Fallback Strategy |
| :--- | :--- | :--- |
| **Risk Engine** | Timeout / Unavailable | Use cached snapshot (24-hour TTL). Log warning and alert admin. |
| **Registration Service** | Timeout / Unavailable | Use cached snapshot. Log warning and alert admin. |
| **S3 / Minio** | Unavailable | Fail fast. Error response to user. Retry with exponential backoff. |
| **Kafka** | Unavailable | Events remain in Outbox table. Retry on next poller cycle. |
| **SMTP / SMS** | Unavailable | Log failure. Retry with exponential backoff. Alternative delivery workflow handles escalation. |

---

## 7. Integration Testing Strategy

| Test Type | Description | Tools |
| :--- | :--- | :--- |
| **Contract Tests** | Verify Risk Engine and Registration Service contracts. | Pact / Spring Cloud Contract |
| **Integration Tests** | Test adapters with WireMock stubs. | WireMock, Testcontainers |
| **End-to-End Tests** | Full flow with mock external systems. | Testcontainers (PostgreSQL, Kafka) |
| **Fallback Tests** | Simulate external service failures and verify fallback behavior. | Chaos Engineering / Mockito |

---

## 8. Summary: Phase 1 vs Phase 2

| Integration | Phase 1 | Phase 2 |
| :--- | :--- | :--- |
| **Risk Engine** | Mock Client (in-memory data) | Real REST Client (Feign) |
| **Registration Service** | Mock Client (pre-seeded data) | Real REST Client (Feign) |
| **Kafka** | In-Memory Mock (console logging) | Real Kafka Broker |
| **S3** | Local Filesystem Mock | Real S3/Minio |
| **SMTP/SMS** | Console Log Mock | Real SMTP/SMS Gateway |
| **Workflow Engine** | In-Memory Mock | Spring State Machine |
| **Rule Engine** | In-Memory Mock | EasyRules |
| **DMS** | In-Memory Mock | Spring Content + iText |
| **Ledger Engine** | In-Memory Mock | Plain JPA |

