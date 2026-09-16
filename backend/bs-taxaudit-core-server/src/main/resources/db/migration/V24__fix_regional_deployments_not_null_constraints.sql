-- V24: Relax legacy NOT NULL constraints on ap_regional_deployments
-- Allows director to deploy approved plans to regions without constraint violations on legacy V6 columns

ALTER TABLE ap_regional_deployments ALTER COLUMN deployed_at DROP NOT NULL;
ALTER TABLE ap_regional_deployments ALTER COLUMN deployed_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE ap_regional_deployments ALTER COLUMN deployed_by DROP NOT NULL;
ALTER TABLE ap_regional_deployments ALTER COLUMN region_id DROP NOT NULL;
