-- Sprint 00: Shared Infrastructure Baseline

CREATE TABLE IF NOT EXISTS shared_audit_trail_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(64) NOT NULL,
    entity_id UUID NOT NULL,
    actor_id VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    reason TEXT,
    state_before JSONB,
    state_after JSONB,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_trail_entity ON shared_audit_trail_entries (entity_type, entity_id);
CREATE INDEX idx_audit_trail_actor ON shared_audit_trail_entries (actor_id);
CREATE INDEX idx_audit_trail_occurred_at ON shared_audit_trail_entries (occurred_at);

CREATE TABLE IF NOT EXISTS shared_outbox_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(128) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_outbox_entries_processed ON shared_outbox_entries (processed_at) WHERE processed_at IS NULL;

-- Trigger to prevent manual updates/deletes on audit trail to meet compliance
CREATE OR REPLACE FUNCTION prevent_audit_trail_update()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Updates and Deletes are forbidden on the audit trail table (Compliance Rule).';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_audit_trail_update ON shared_audit_trail_entries;
CREATE TRIGGER trg_prevent_audit_trail_update
BEFORE UPDATE OR DELETE ON shared_audit_trail_entries
FOR EACH ROW EXECUTE FUNCTION prevent_audit_trail_update();
