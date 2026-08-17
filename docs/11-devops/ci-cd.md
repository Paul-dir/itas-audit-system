# CI/CD Pipeline & Git Workflow

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

## 1. Git Workflow

We use a feature-branch workflow. Because 4 developers are working in parallel across 9 clusters, strict branching rules apply:

- **Branch Naming:** `feature/{cluster}-{description}` (e.g., `feature/ap-plan-creation`, `feature/ex-desk-audit`).
- **Target Branch:** All feature branches merge into `develop`.
- **Merge Requirements:**
  - Pull Request must be reviewed by at least 1 other developer.
  - CI Pipeline must pass (Build, Tests, SonarQube).
  - No merge conflicts in `db/migration/` (Flyway scripts).

## 2. CI Pipeline Stages

The CI pipeline runs automatically on every push to a feature branch and `develop`.

| Stage | Action | Tool |
| :--- | :--- | :--- |
| **1. Compile** | Ensure the code compiles cleanly. | Maven / Webpack |
| **2. DB Validate**| Validate Flyway scripts against a clean Postgres instance. | Flyway |
| **3. Test** | Run Unit and Integration tests (spins up Testcontainers). | JUnit / Jest |
| **4. Analysis** | Static code analysis and coverage check. | SonarQube |
| **5. Package** | Build the executable `.jar` and Docker Image. | Docker |

## 3. Deployment Strategy (Phase 1)

For Phase 1 internal review, the `develop` branch is continuously deployed to a single Staging Server.

1. The CI pipeline builds the Docker image: `itas-core-server:latest`.
2. The image is pushed to the internal container registry.
3. The staging server pulls the image and restarts the container via a webhook.
4. Flyway automatically runs database migrations on startup.
