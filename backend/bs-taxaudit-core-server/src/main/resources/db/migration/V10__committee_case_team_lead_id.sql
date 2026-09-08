-- V10: Add team_lead_id column to t_committee_case
-- Separates team leader identity from chairperson_id for proper role tracking
-- Business rule: Team leader must be assigned before viability determination

ALTER TABLE t_committee_case
    ADD COLUMN IF NOT EXISTS team_lead_id UUID;

-- Migrate existing data: cases in TEAM_ASSIGNED or PENDING_VIABILITY state
-- that have a chairpersonId set are likely cases where team lead was appointed
-- (AppointTeamLeadUseCase previously overwrote chairpersonId with the team lead)
UPDATE t_committee_case
SET team_lead_id = chairperson_id
WHERE status IN ('TEAM_ASSIGNED', 'PENDING_VIABILITY', 'APPROVED', 'REJECTED')
  AND chairperson_id IS NOT NULL;
