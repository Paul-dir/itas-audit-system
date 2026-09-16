# ITAS Audit System — Run Doc

## Prerequisites

- Java 21 at `/usr/lib/jvm/java-21-openjdk-amd64` (system default java is 17 and will FAIL with `UnsupportedClassVersionError`)
- Maven (`/usr/bin/mvn`)
- Node.js ≥ 20 (nvm: v20.20.0)
- PostgreSQL 16 running in Docker container `taxaudit-postgres` on host port **5433** (NOT 5432 — port 5432 is a different unrelated Postgres)

## How to Reproduce Uncommitted Artifacts

No `.env.local` needed — the app uses defaults in `application.yml`:
- DB: `localhost:5433/itas_audit` (user: `itas_dev`, password: `dev_password`) — port 5433 via `DB_PORT` env var
- Backend: port 8080, profile `mock` (disables OAuth2/Keycloak)
- Frontend: port 3000, Vite proxy forwards `/api` to `localhost:8080`

Database is pre-seeded (Flyway, 23 migrations, schema version 25, 78 tables). If the container isn't running:
```bash
docker start taxaudit-postgres
```

Frontend deps are already installed at `frontend/back-office-ui/node_modules` (reinstall with `npm ci` if missing). Backend deps resolve via Maven on first run.

## How to Run

### Backend (startup takes ~80-90s, be patient)

```bash
cd /home/josi-coder/Videos/itas-audit-system
setsid env JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 DB_PORT=5433 \
  mvn -f backend/bs-taxaudit-core-server/pom.xml spring-boot:run \
  -Dspring-boot.run.profiles=mock > /tmp/itas-backend.log 2>&1 < /dev/null &
```
Wait for "Started TaxAuditApplication" in the log (~90s):
```bash
tail -f /tmp/itas-backend.log
# Then verify:
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/v1/backoffice/ap/plans
# Should return 200
```

### Frontend (~5s)

```bash
cd /home/josi-coder/Videos/itas-audit-system/frontend/back-office-ui
setsid npx vite --port 3000 --host > /tmp/itas-frontend.log 2>&1 < /dev/null &
# Verify:
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
# Should return 200
```

NOTE: plain `nohup ... &` gets reaped by the Codebuff command runner — always use `setsid`.

### Verify

```bash
# Backend direct
curl http://localhost:8080/api/v1/backoffice/ap/plans | head -c 200

# Frontend (proxied through Vite)
curl http://localhost:3000/api/v1/backoffice/ap/plans | head -c 200
```

## Stopping

```bash
pkill -f "spring-boot:run"
pkill -f "TaxAuditApplication"
pkill -f vite
```

## Notes

- `backendClient.js` uses relative URLs (`/api/v1/backoffice/ap/...`) which go through the Vite proxy
- CORS allows localhost ports 3000, 3001, 3002 (configured in `MockSecurityConfig.java`)
- Backend logs: `/tmp/itas-backend.log`; frontend logs: `/tmp/itas-frontend.log`
- Default login lands on Team Leader Dashboard (mock user "Almaw Bikila")
