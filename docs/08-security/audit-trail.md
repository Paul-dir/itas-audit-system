# Audit Trail Security

**Version:** 1.0
**Status:** Approved
**Last Updated:** 2026-08-16

## 1. The Immutable Log

Every state-changing operation (CREATE, UPDATE, DELETE) across all 9 clusters MUST be recorded in the `shared_audit_trail_entries` table.

This is a legal requirement for the Tax Authority (7-year retention).

## 2. Implementation: Domain Events & Interceptors

The audit trail is populated automatically using Spring AOP (Aspect-Oriented Programming) and Hibernate Interceptors. 

1. When a transaction commits, the interceptor captures the pre-update state and post-update state of the Aggregate Root.
2. It extracts the `X-Actor-Id` from the current thread context.
3. It writes an immutable JSON diff to `shared_audit_trail_entries`.

## 3. The Contract

No developer is allowed to write `UPDATE` or `DELETE` statements directly to the database via native queries that bypass the JPA/Hibernate interceptor, unless explicitly approved by the Architecture team.

Database triggers act as a secondary defense:

```sql
-- V10__audit_trail_trigger.sql
CREATE OR REPLACE FUNCTION prevent_audit_trail_update()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Updates and Deletes are forbidden on the audit trail table.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_audit_trail_update
BEFORE UPDATE OR DELETE ON shared_audit_trail_entries
FOR EACH ROW EXECUTE FUNCTION prevent_audit_trail_update();
```
