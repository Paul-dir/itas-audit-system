# Error Model

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

ITAS uses the **RFC 7807 Problem Details for HTTP APIs** standard for all error responses. This ensures frontend clients can consistently parse errors across all 9 clusters.

---

## 1. Standard Error Envelope

When an API request fails, the server must return the appropriate HTTP status code (e.g., `400`, `403`, `404`, `409`, `422`, `500`) with a JSON payload matching the following structure:

```json
{
  "type": "https://itas.gov/errors/validation-failed",
  "title": "Validation Failed",
  "status": 400,
  "detail": "The assignment failed because the auditor's max capacity is exceeded.",
  "instance": "/api/v1/ap/cases/1234/assign",
  "errors": [
    {
      "field": "auditorId",
      "message": "Capacity limit reached. Current: 10, Max: 10."
    }
  ]
}
```

### Fields:
- `type`: A URI reference that identifies the problem type.
- `title`: A short, human-readable summary of the problem type.
- `status`: The HTTP status code.
- `detail`: A human-readable explanation specific to this occurrence.
- `instance`: A URI reference that identifies the specific occurrence.
- `errors`: (Optional) An array of field-level validation errors.

---

## 2. Common Error Types

| HTTP Status | Title | Usage |
| :--- | :--- | :--- |
| `400 Bad Request` | Bad Request | Malformed JSON or generic request error. |
| `400 Bad Request` | Validation Failed | Field-level validation failed (Spring `@Valid`). Includes `errors` array. |
| `401 Unauthorized` | Unauthorized | Missing or invalid JWT. |
| `403 Forbidden` | Forbidden | User is authenticated but lacks RBAC permissions. |
| `404 Not Found` | Resource Not Found | Aggregate or entity does not exist. |
| `409 Conflict` | Optimistic Locking Failure | The `version` provided does not match the DB (concurrent modification). |
| `422 Unprocessable` | Business Rule Violation | Request is structurally correct but violates a domain invariant. |
| `500 Internal Error` | Internal Server Error | Unhandled exception. (Do NOT expose stack traces to the client). |
