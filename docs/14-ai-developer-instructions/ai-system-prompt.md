# AI Developer System Prompt

**ATTENTION ALL AI CODING ASSISTANTS:**
You are operating within the ITAS Tax Audit System project. This is a highly complex, 4-track parallel development environment. 

You must strictly adhere to the following operational instructions. Failure to do so will result in Git conflicts and architectural drift.

## 1. System Analysis Permissions (Read-All)
- **You are PERMITTED and ENCOURAGED to read ANY file, in ANY folder, across the entire workspace.**
- **CRITICAL DATA SOURCE:** You must read the raw project documents located in `/home/paul/itas-audit-system/all about project source document` at implementation time to ensure you are using real-world data, accurate domain logic, and authentic business contexts.
- Before you begin a sprint, use your file reading tools to scan `docs/13-project-memory/` and `docs/05-database/` to understand the overarching system architecture.
- You must deeply understand how your assigned cluster interacts with the other clusters by analyzing the `cross-cluster-dependencies.md`.

## 2. Identity & Write Boundaries (Write-Restricted)
When the USER (the Developer) prompts you, they will identify who they are (e.g., "I am Pawlos", "I am Oliad"). **You must immediately restrict your WRITE operations to their specific domain.**

- **If User is Pawlos (AP Cluster):** You may only write to tables prefixed with `ap_`, backend packages under `com.act.audit.ap.*`, and frontend files under `src/features/ap/`.
- **If User is Oliad (EX & QA Clusters):** You may only write to tables prefixed with `ex_` or `qa_`, backend packages under `com.act.audit.ex.*` or `qa.*`, and frontend files under `src/features/ex/` or `qa/`.
- **If User is Borifa (TP & IA Clusters):** You may only write to tables prefixed with `tp_` or `ia_`, and frontend files under `src/features/tp/` or `ia/`.
- **If User is Yoseph (JA, CM, RF Clusters):** You may only write to tables prefixed with `ja_`, `cm_`, or `rf_`, and frontend files under `src/features/ja/`, `cm/`, or `rf/`.

**CRITICAL RULE:** Do NOT modify another developer's Flyway scripts or domain models. If you need data from them, you must reference their ID via Foreign Key, or read from the `shared_` tables.

## 3. Executing a Sprint
When instructed to execute a sprint (e.g., "Start Sprint 01"):
1. Read the corresponding Markdown file in `docs/12-sprints/`.
2. Do **EXACTLY** what the sprint file says. The sprint files are your immutable blueprint.
3. Keep the context of the *current* sprint in mind. Do not attempt to build features from Sprint 05 if you are currently on Sprint 02.
4. Remember that every sprint is a **Vertical Slice**. You are expected to implement the Database (`.sql`), the Backend (`.java`), and the Frontend (`.jsx`) for that specific feature before declaring the sprint complete.

## 4. Technical Constraints
- **Java:** Spring Boot 3.2.x, Java 21, Hexagonal Architecture. Use Ports/Adapters for external systems.
- **Frontend:** React 18, Vite, TailwindCSS, RTK Query. Use the SPA Shell in `src/app/Layout.jsx`.
- **Database:** PostgreSQL. All migrations MUST be done via Flyway in `src/main/resources/db/migration/`. No manual schema manipulation.
- **Security:** All endpoints must extract `X-Actor-Id` for Row-Level Security and auditing.
- **Errors:** Use RFC 7807 Problem Details via the `GlobalExceptionHandler`.
