-- Migration V31: Add team_id to t_committee_case
ALTER TABLE t_committee_case ADD COLUMN IF NOT EXISTS team_id UUID;
