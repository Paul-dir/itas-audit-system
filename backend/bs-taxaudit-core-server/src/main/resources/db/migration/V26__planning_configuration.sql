-- =============================================================================
-- V26__planning_configuration.sql
-- Persistent storage for dynamic Audit Planning Configuration:
-- 1. Dynamic Audit Types (name, effort hours, complexity, revenue, governance, active)
-- 2. Configurable Regions & Nested Tax Centers
-- 3. Capacity parameters (working days, hours, direct productive ratio, regional headcount)
-- 4. Effort Estimation & Multipliers
-- =============================================================================

CREATE TABLE IF NOT EXISTS ap_planning_configuration (
    id VARCHAR(64) PRIMARY KEY,
    config_data JSONB NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    updated_by VARCHAR(128) NOT NULL DEFAULT 'SYSTEM_DEFAULT',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ap_planning_configuration_updated_at 
    ON ap_planning_configuration(updated_at DESC);

-- Seed initial statutory configuration if not exists
INSERT INTO ap_planning_configuration (id, config_data, version, updated_by, updated_at)
VALUES (
    'ACTIVE_CONFIG',
    '{
        "auditTypes": [
            {
                "id": "desk_audit",
                "name": "Desk Audit",
                "shortName": "Desk",
                "effortPerCase": 40,
                "complexity": "Low",
                "revenuePerCase": 150000,
                "governanceRouting": "TEAM_LEADER",
                "color": "blue",
                "description": "Remote audit using taxpayer electronic records & ITAS cross-matching",
                "active": true
            },
            {
                "id": "field_audit",
                "name": "Field Audit",
                "shortName": "Field",
                "effortPerCase": 120,
                "complexity": "Medium",
                "revenuePerCase": 350000,
                "governanceRouting": "TEAM_LEADER",
                "color": "green",
                "description": "Comprehensive on-site audit with physical premises verification",
                "active": true
            },
            {
                "id": "joint_audit",
                "name": "Joint Audit",
                "shortName": "Joint",
                "effortPerCase": 160,
                "complexity": "High",
                "revenuePerCase": 750000,
                "governanceRouting": "COMMITTEE",
                "color": "purple",
                "description": "Cross-directorate coordinated audit with Customs and Regional offices",
                "active": true
            },
            {
                "id": "transfer_pricing",
                "name": "Transfer Pricing",
                "shortName": "TP",
                "effortPerCase": 80,
                "complexity": "High",
                "revenuePerCase": 1500000,
                "governanceRouting": "COMMITTEE",
                "color": "orange",
                "description": "Specialized cross-border intercompany transaction & BEPS examination",
                "active": true
            },
            {
                "id": "comprehensive",
                "name": "Comprehensive",
                "shortName": "Comp",
                "effortPerCase": 200,
                "complexity": "Very High",
                "revenuePerCase": 1000000,
                "governanceRouting": "TEAM_LEADER",
                "color": "red",
                "description": "Full-scope statutory corporate income tax, VAT, and excise audit",
                "active": true
            },
            {
                "id": "issue_audit",
                "name": "Issue Audit",
                "shortName": "Issue",
                "effortPerCase": 50,
                "complexity": "Medium",
                "revenuePerCase": 250000,
                "governanceRouting": "TEAM_LEADER",
                "color": "teal",
                "description": "Targeted single-issue or specific risk transaction examination",
                "active": true
            }
        ],
        "capacity": {
            "workingDaysPerYear": 220,
            "hoursPerDay": 8.0,
            "directProductiveRatio": 0.75,
            "annualTrainingDays": 5,
            "annualLeaveDays": 20,
            "regionalHeadcount": {
                "federal_level": 120,
                "addis_ababa": 600,
                "oromia": 400,
                "amhara": 250,
                "dire_dawa": 50,
                "snnpr": 80,
                "somali": 100,
                "sidama": 100
            }
        },
        "regions": [
            {
                "id": "federal_level",
                "name": "Federal Level (LTO)",
                "code": "FED",
                "headcount": 120,
                "taxpayers": 150000,
                "active": true,
                "taxCenters": [
                    { "id": "federal-lto1", "name": "Federal Large Taxpayers Office 1", "shortName": "FED-LTO1" },
                    { "id": "federal-lto2", "name": "Federal Large Taxpayers Office 2", "shortName": "FED-LTO2" }
                ]
            },
            {
                "id": "addis_ababa",
                "name": "Addis Ababa",
                "code": "AA",
                "headcount": 600,
                "taxpayers": 2500000,
                "active": true,
                "taxCenters": [
                    { "id": "addis_ababa-tc1", "name": "Addis Ababa TC1", "shortName": "AA-TC1" },
                    { "id": "addis_ababa-tc2", "name": "Addis Ababa TC2", "shortName": "AA-TC2" },
                    { "id": "addis_ababa-tc3", "name": "Addis Ababa TC3", "shortName": "AA-TC3" }
                ]
            },
            {
                "id": "oromia",
                "name": "Oromia",
                "code": "BB",
                "headcount": 400,
                "taxpayers": 1300000,
                "active": true,
                "taxCenters": [
                    { "id": "oromia-tc1", "name": "Oromia TC1", "shortName": "BB-TC1" },
                    { "id": "oromia-tc2", "name": "Oromia TC2", "shortName": "BB-TC2" },
                    { "id": "oromia-tc3", "name": "Oromia TC3", "shortName": "BB-TC3" }
                ]
            },
            {
                "id": "amhara",
                "name": "Amhara",
                "code": "BA",
                "headcount": 250,
                "taxpayers": 750000,
                "active": true,
                "taxCenters": [
                    { "id": "amhara-tc1", "name": "Amhara TC1", "shortName": "BA-TC1" },
                    { "id": "amhara-tc2", "name": "Amhara TC2", "shortName": "BA-TC2" },
                    { "id": "amhara-tc3", "name": "Amhara TC3", "shortName": "BA-TC3" }
                ]
            },
            {
                "id": "dire_dawa",
                "name": "Dire Dawa",
                "code": "AB",
                "headcount": 50,
                "taxpayers": 100000,
                "active": true,
                "taxCenters": [
                    { "id": "dire_dawa-tc1", "name": "Dire Dawa TC1", "shortName": "AB-TC1" },
                    { "id": "dire_dawa-tc2", "name": "Dire Dawa TC2", "shortName": "AB-TC2" },
                    { "id": "dire_dawa-tc3", "name": "Dire Dawa TC3", "shortName": "AB-TC3" }
                ]
            },
            {
                "id": "snnpr",
                "name": "SNNPR",
                "code": "CA",
                "headcount": 80,
                "taxpayers": 280000,
                "active": true,
                "taxCenters": [
                    { "id": "snnpr-tc1", "name": "SNNPR TC1", "shortName": "CA-TC1" },
                    { "id": "snnpr-tc2", "name": "SNNPR TC2", "shortName": "CA-TC2" },
                    { "id": "snnpr-tc3", "name": "SNNPR TC3", "shortName": "CA-TC3" }
                ]
            },
            {
                "id": "somali",
                "name": "Somali",
                "code": "SO",
                "headcount": 100,
                "taxpayers": 200000,
                "active": true,
                "taxCenters": [
                    { "id": "somali-tc1", "name": "Somali TC1", "shortName": "SO-TC1" },
                    { "id": "somali-tc2", "name": "Somali TC2", "shortName": "SO-TC2" },
                    { "id": "somali-tc3", "name": "Somali TC3", "shortName": "SO-TC3" }
                ]
            },
            {
                "id": "sidama",
                "name": "Sidama",
                "code": "SI",
                "headcount": 100,
                "taxpayers": 350000,
                "active": true,
                "taxCenters": []
            }
        ],
        "effortEstimation": {
            "complexityMultipliers": {
                "Low": 0.85,
                "Medium": 1.0,
                "High": 1.35,
                "Very High": 1.70
            },
            "contingencyBufferPercentage": 15,
            "travelOverheadHoursPerFieldCase": 16
        }
    }'::jsonb,
    1,
    'SYSTEM_DEFAULT',
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;
