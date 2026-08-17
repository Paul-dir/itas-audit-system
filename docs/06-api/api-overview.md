# API Overview

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

This document defines the RESTful API standards and global conventions for the ITAS Tax Audit System. All clusters must follow these guidelines.

---

## 1. Global Conventions

| Aspect | Convention |
| :--- | :--- |
| **Base URL** | `/api/v1` |
| **Cluster Prefixes** | `/api/v1/ap`, `/api/v1/ex`, `/api/v1/tp`, etc. |
| **Content Type** | `application/json` |
| **Casing** | `camelCase` for JSON keys |
| **Authentication** | Bearer Token (JWT from Keycloak) |

---

## 2. Security & The `X-Actor-Id` Header

Per the Security Architecture, the application does **not** rely on the HTTP client sending their username directly in the request body for security reasons.

- **Rule:** Every modifying API request (`POST`, `PUT`, `PATCH`, `DELETE`) requires an actor identifier to generate the Immutable Audit Trail.
- **Implementation:** The `X-Actor-Id` is populated by the **API Gateway / Security Filter** which extracts it from the validated JWT token. 
- **Development (Phase 1):** In Phase 1, the frontend or Postman will manually inject `X-Actor-Id` (e.g., `X-Actor-Id: auditor_001`) into the headers to mock this behavior.

---

## 3. Standard HTTP Methods

| Method | Usage | Idempotent |
| :--- | :--- | :--- |
| **GET** | Retrieve a resource or collection | Yes |
| **POST** | Create a new resource or execute a workflow action | No |
| **PUT** | Completely replace a resource | Yes |
| **PATCH** | Partially update a resource | No |
| **DELETE** | Not used. We use logical status updates (e.g., `CANCELLED`) | N/A |

---

## 4. Response Envelopes

We **do not** use generic wrapper envelopes (e.g., `{ "data": ..., "status": "success" }`) for successful responses. Return the JSON object directly.

For lists, return a JSON array or a Spring Data `Page` object if paginated.

For errors, we strictly use the **RFC 7807 Problem Details for HTTP APIs** format (see `error-model.md`).
