-- V26: Seed JA execution identities into users
--
-- case_auditor_assignment.auditor_id / assigned_by_id carry FK constraints to
-- users(id), but the Joint Audit workflow's team leaders (t_audit_team) and
-- auditors (t_auditor) live in their own registries with IDs absent from
-- users. Mirror those identities into users so the C2/C3-validated
-- auditor assignment workflow (AuditorAssignmentService) can persist
-- case_auditor_assignment rows without FK violations.
--
-- Idempotent: skips any row whose id, username, or email already exists.

-- 1) Auditors from the t_auditor registry
INSERT INTO users (id, username, email, full_name, is_active, failed_login_count, created_at)
SELECT a.auditor_id,
       split_part(lower(a.email), '@', 1),
       lower(a.email),
       trim(a.first_name || ' ' || a.last_name),
       a.active,
       0,
       now()
FROM t_auditor a
WHERE a.email IS NOT NULL AND a.email <> ''
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = a.auditor_id)
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.username = split_part(lower(a.email), '@', 1))
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.email = lower(a.email));

-- 2) Team leaders from the t_audit_team registry
INSERT INTO users (id, username, email, full_name, is_active, failed_login_count, created_at)
SELECT DISTINCT t.team_leader_id,
       'ja.tl.' || split_part(t.team_leader_id::text, '-', 5),
       'ja.tl.' || split_part(t.team_leader_id::text, '-', 5) || '@mor.gov.et',
       t.team_leader_name,
       true,
       0,
       now()
FROM t_audit_team t
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = t.team_leader_id)
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.username = 'ja.tl.' || split_part(t.team_leader_id::text, '-', 5))
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.email = 'ja.tl.' || split_part(t.team_leader_id::text, '-', 5) || '@mor.gov.et');
