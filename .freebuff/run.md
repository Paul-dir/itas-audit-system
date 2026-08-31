# ITAS Audit System — Run Doc

## Prerequisites

- Java 21 (`/usr/lib/jvm/jdk-21.0.10-oracle-x64`)
- Maven (`/usr/bin/mvn`)
- Node.js (for Vite frontend)
- PostgreSQL running on localhost:5432

## How to Reproduce Uncommitted Artifacts

No `.env.local` or similar files needed — the app uses defaults in `application.yml`:
- DB: `localhost:5432/itas_audit` (user: `itas_dev`, password: `dev_password`)
- Backend: port 8080, profile `mock` (disables OAuth2/Keycloak)
- Frontend: port 3000, Vite proxy forwards `/api` to `localhost:8080`

The database is pre-seeded (Flyway migrations + mock data).

## How to Run

### Backend

```bash
cd backend/bs-taxaudit-core-server
setsid mvn spring-boot:run -Dspring-boot.run.profiles=mock > /tmp/itas-backend.log 2>&1 &
# Wait ~15-20s for startup
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/v1/backoffice/ap/plans
# Should return 200
```

### Frontend

```bash
cd frontend/back-office-ui
setsid npx vite --port 3000 --host > /tmp/itas-frontend.log 2>&1 &
# Wait ~5s for Vite
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
# Should return 200
```

### Verify

```bash
# Backend
curl http://localhost:8080/api/v1/backoffice/ap/plans | head -c 200

# Frontend (proxied through Vite)
curl http://localhost:3000/api/v1/backoffice/ap/plans | head -c 200
```

## Stopping

```bash
pkill -f "vite"
pkill -f "TaxAuditApplication"
```

## Notes

- `backendClient.js` uses relative URLs (`/api/v1/backoffice/ap/...`) which go through the Vite proxy
- CORS allows localhost ports 3000, 3001, 3002 (configured in `MockSecurityConfig.java`)
- Frontend PID: check with `ps aux | grep vite`
- Backend PID: check with `ps aux | grep TaxAuditApplication`
