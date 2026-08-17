# Sprint Roadmap & AI Execution Strategy

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document defines how we execute sprints in the ITAS Tax Audit System project. Because we are using AI to implement the code, the sprint definitions must be highly structured, context-rich, and rigidly constrained.

---

## 1. The Core Philosophy

1. **Vertical Slices:** A sprint is never "just backend" or "just frontend." A sprint delivers a complete slice of functionality (Database → Entity → API → React Component).
2. **High Granularity:** This is a massive system. We do not do "Build the AP Cluster" in one sprint. We do "Build the Annual Plan Creation view with Risk Engine mocking" as a single sprint.
3. **AI Context Retention:** AI models lose context if given too much at once. Each sprint document acts as a **Strict AI Prompt** containing exactly what the AI needs to know, and what it must NOT do.

---

## 2. Sprint Execution Flow (The "AI Prompting" Method)

When a developer starts a sprint, they will provide the AI with the sprint document. The AI must follow this flow:

### Step 1: Database & Domain
The AI implements the JPA Entities, Flyway Migration scripts, and Domain Aggregates based on the `04-domain` and `05-database` constraints.

### Step 2: Backend Services & API
The AI builds the Spring Boot Service layer, mapping DTOs, enforcing rules from `02-business`, and exposing the REST Controller per `06-api`.

### Step 3: Frontend Feature Slice
The AI switches to the React codebase, creates the necessary Redux queries, and builds the UI components strictly inside the `src/features/{cluster}/` folder.

---

## 3. Developer Tracks

| Developer | Track | Folders |
| :--- | :--- | :--- |
| **Shared** | Core Infrastructure | `00-shared` |
| **Pawlos** | Audit Planning (AP) | `01-pawlos-ap` |
| **Oliad** | Execution (EX), QA | `03-oliad-ex-qa` |
| **Borifa** | TP, Issue Audit (IA) | `04-borifa-tp-ia` |
| **Yoseph** | Joint Audit (JA), CM, RF | `02-yoseph-ja-cm-rf` |

*(See the respective developer folders for the granular sprint breakdown).*
