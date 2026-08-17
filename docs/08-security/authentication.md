# Authentication

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

## 1. OpenID Connect (OIDC)

The ITAS Tax Audit System relies exclusively on Keycloak as the Identity Provider (IdP). The system does not maintain its own user passwords.

1. The frontend (React) authenticates with Keycloak via the Authorization Code Flow with PKCE.
2. The frontend receives an Access Token (JWT).
3. The frontend passes the JWT in the `Authorization: Bearer <token>` header to the Core API.

## 2. API Gateway & `X-Actor-Id`

The Spring Boot resource server validates the JWT signature and expiration. 
To ensure all internal systems and audit trails have a consistent way of identifying the actor, the security filter extracts the user identifier from the JWT and injects it as an HTTP header called `X-Actor-Id`.

**All downstream Controllers must read the actor from this header, NOT from the raw JWT.**

```java
@PostMapping("/{caseId}/assign")
public ResponseEntity<Void> assignCase(
    @PathVariable UUID caseId,
    @RequestBody AssignCaseRequest request,
    @RequestHeader("X-Actor-Id") String actorId // <--- Mandatory
) {
    assignmentService.assign(caseId, request, actorId);
    return ResponseEntity.ok().build();
}
```

## 3. Phase 1 Mock Authentication

During Phase 1 local development, the Spring Security OIDC validation is disabled via `@Profile("mock-auth")`. 

Developers must pass the `X-Actor-Id` manually in their Postman/cURL requests.

Example:
```bash
curl -X POST http://localhost:8080/api/v1/ap/cases/123/assign \
     -H "Content-Type: application/json" \
     -H "X-Actor-Id: paul_director" \
     -d '{"auditorId":"oliad_aud"}'
```
