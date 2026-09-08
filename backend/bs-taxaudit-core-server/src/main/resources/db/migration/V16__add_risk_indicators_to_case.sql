-- Flyway Migration V16: Add structured risk_indicators to t_committee_case
-- Converts the old compliance_issues strings into structured risk indicator objects
-- matching the auditConfig.js riskIndicators library.

-- 1. Add the new column
ALTER TABLE t_committee_case ADD COLUMN IF NOT EXISTS risk_indicators JSONB;

-- 2. Populate risk_indicators based on industry and risk_priority
UPDATE t_committee_case SET risk_indicators = (
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', ri.id,
            'name', ri.name,
            'weight', ri.weight,
            'description', ri.description,
            'source', ri.source,
            'severity', CASE
                WHEN t_committee_case.risk_priority = 'HIGH' THEN 'HIGH'
                WHEN t_committee_case.risk_priority = 'MEDIUM' THEN 'MEDIUM'
                ELSE 'LOW'
            END
        )
    )
    FROM (
        SELECT * FROM jsonb_to_recordset(
            '[
                {"id":"late_filing","name":"Late Filing","weight":2.0,"description":"Repeated late tax return filing","source":"Admin Data"},
                {"id":"late_payment","name":"Late Payment","weight":2.0,"description":"Pattern of late tax payments","source":"Payment Records"},
                {"id":"vat_mismatch","name":"VAT Mismatch","weight":3.0,"description":"Input VAT exceeds Output VAT consistently","source":"VAT Returns"},
                {"id":"import_sales_variance","name":"Import vs Sales Variance","weight":2.5,"description":"Imports significantly exceed sales","source":"Customs, Returns"},
                {"id":"continuous_loss","name":"Continuous Losses","weight":2.0,"description":"Business reports losses for multiple years","source":"Financial Statements"},
                {"id":"income_variance","name":"Income Variance","weight":2.0,"description":"Significant income fluctuations","source":"Returns Analysis"},
                {"id":"undisclosed_assets","name":"Undisclosed Assets","weight":3.0,"description":"Assets not declared or inconsistent","source":"Third Party Info"},
                {"id":"industry_anomaly","name":"Industry Anomaly","weight":2.0,"description":"Performance differs significantly from industry","source":"Benchmarking"},
                {"id":"cash_intensive","name":"Cash Intensive Business","weight":1.5,"description":"Business operates primarily on cash","source":"Industry Classification"},
                {"id":"new_business","name":"New Business Establishment","weight":1.0,"description":"Business in first 2 years","source":"Registration Date"}
            ]'::jsonb
        ) AS ri(id text, name text, weight numeric, description text, source text)
    ) ri
    WHERE (
        -- Manufacturing indicators
        (t_committee_case.industry = 'Manufacturing' AND ri.id IN ('vat_mismatch', 'import_sales_variance', 'continuous_loss'))
        -- Trading indicators
        OR (t_committee_case.industry = 'Trading' AND ri.id IN ('cash_intensive', 'income_variance', 'late_filing'))
        -- Financial Services indicators
        OR (t_committee_case.industry = 'Financial Services' AND ri.id IN ('undisclosed_assets', 'vat_mismatch', 'industry_anomaly'))
        -- Construction indicators
        OR (t_committee_case.industry = 'Construction' AND ri.id IN ('late_payment', 'income_variance', 'continuous_loss'))
        -- Services indicators
        OR (t_committee_case.industry = 'Services' AND ri.id IN ('income_variance', 'cash_intensive'))
        -- Healthcare indicators
        OR (t_committee_case.industry = 'Healthcare' AND ri.id IN ('vat_mismatch', 'industry_anomaly'))
        -- Technology indicators
        OR (t_committee_case.industry = 'Technology' AND ri.id IN ('new_business', 'industry_anomaly'))
        -- Energy indicators
        OR (t_committee_case.industry = 'Energy' AND ri.id IN ('undisclosed_assets', 'import_sales_variance'))
        -- Retail indicators
        OR (t_committee_case.industry = 'Retail' AND ri.id IN ('cash_intensive', 'late_filing', 'income_variance'))
        -- Segment-based
        OR (t_committee_case.segment = 'LARGE' AND ri.id = 'import_sales_variance')
        -- High risk always gets continuous_loss
        OR (t_committee_case.risk_priority = 'HIGH' AND ri.id = 'continuous_loss')
    )
) WHERE risk_indicators IS NULL;
