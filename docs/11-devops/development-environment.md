# Development Environment

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document describes how to spin up the local development environment for the ITAS Tax Audit System.

---

## 1. Local Infrastructure (Docker Compose)

The project includes a `docker-compose.yml` file at the root to spin up all necessary infrastructure dependencies.

```yaml
# Simplified example of docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: itas_audit
      POSTGRES_USER: itas_dev
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"

  keycloak:
    image: quay.io/keycloak/keycloak:21.1
    command: start-dev
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    ports:
      - "8081:8080"
```

**To start:** `docker-compose up -d`

---

## 2. Running the Backend

Because we are building a modular monolith (`bs-taxaudit-core-server`), you do not need to start 9 different microservices.

1. Ensure Docker Compose is running.
2. Run the Spring Boot application using the `mock` profile:
   `./mvnw spring-boot:run -Dspring-boot.run.profiles=local,mock,mock-auth`

**Profiles Explained:**
- `local`: Connects to localhost:5432 PostgreSQL.
- `mock`: Injects the mock adapters for Risk Engine, DMS, etc.
- `mock-auth`: Bypasses JWT validation and reads `X-Actor-Id` directly.

---

## 3. Running the Frontend

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`

The frontend is configured to proxy `/api` requests to `localhost:8080`.
