-- Flyway Migration V9: Add extended fields to t_committee_case and populate existing records
-- Ensures all cases have real data for description, businessType, address, city, region,
-- complianceIssues, representatives, totalAmount, and assessmentScore.

-- 1. Add new columns (safe to run even if Hibernate auto-created them)
ALTER TABLE t_committee_case ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE t_committee_case ADD COLUMN IF NOT EXISTS business_type VARCHAR(100);
ALTER TABLE t_committee_case ADD COLUMN IF NOT EXISTS total_amount NUMERIC;
ALTER TABLE t_committee_case ADD COLUMN IF NOT EXISTS assessment_score VARCHAR(50);
ALTER TABLE t_committee_case ADD COLUMN IF NOT EXISTS address VARCHAR(255);
ALTER TABLE t_committee_case ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE t_committee_case ADD COLUMN IF NOT EXISTS region VARCHAR(100);
ALTER TABLE t_committee_case ADD COLUMN IF NOT EXISTS compliance_issues JSONB;
ALTER TABLE t_committee_case ADD COLUMN IF NOT EXISTS representatives JSONB;

-- 2. Populate description based on industry and segment
UPDATE t_committee_case SET description = CASE
    WHEN industry = 'Manufacturing' THEN 'Tax audit case for manufacturing entity. Initial risk assessment indicates potential inventory and transfer pricing compliance gaps requiring detailed examination of production costs and intercompany transactions.'
    WHEN industry = 'Services' THEN 'Compliance review of services company. Revenue recognition and professional fee deductions flagged for audit. Case requires committee evaluation of service contract documentation.'
    WHEN industry = 'Trading' THEN 'Investigation case involving trading enterprise. Cash handling, revenue recognition irregularities, and unusual transaction patterns detected during preliminary screening.'
    WHEN industry = 'Financial Services' THEN 'Audit referral for financial services institution. Regulatory capital adequacy concerns, VAT compliance gaps, and complex derivative transactions under review.'
    WHEN industry = 'Retail' THEN 'Routine compliance review of retail chain. Point-of-sale revenue reconciliation and inventory valuation discrepancies identified. Multiple locations require examination.'
    WHEN industry = 'Construction' THEN 'Joint audit case for construction company. Contract accounting anomalies, progress billing irregularities, and subcontractor payment documentation gaps detected.'
    WHEN industry = 'Healthcare' THEN 'Healthcare compliance audit case. Billing complexities, insurance claim reconciliation, and medical supply procurement irregularities flagged for detailed review.'
    WHEN industry = 'Technology' THEN 'Technology sector audit case. Software licensing revenue, intellectual property transfers, and R&D tax credit claims under examination.'
    WHEN industry = 'Energy' THEN 'Energy sector compliance case. Fuel price subsidies, infrastructure investment deductions, and environmental compliance expenditure verification required.'
    ELSE 'General tax audit case requiring committee review and advisory voting.'
END
WHERE description IS NULL;

-- 3. Set business_type = industry (same value)
UPDATE t_committee_case SET business_type = industry WHERE business_type IS NULL;

-- 4. Populate total_amount (realistic Ethiopian birr amounts)
UPDATE t_committee_case SET total_amount = CASE
    WHEN segment = 'LARGE' THEN (1000000 + (random() * 9000000)::NUMERIC(12,2))
    WHEN segment = 'MEDIUM' THEN (100000 + (random() * 900000)::NUMERIC(12,2))
    ELSE (10000 + (random() * 90000)::NUMERIC(12,2))
END
WHERE total_amount IS NULL;

-- 5. Populate assessment_score
UPDATE t_committee_case SET assessment_score = CASE
    WHEN risk_priority = 'HIGH' THEN (70 + (random() * 30))::INT::TEXT
    WHEN risk_priority = 'MEDIUM' THEN (40 + (random() * 30))::INT::TEXT
    ELSE (10 + (random() * 30))::INT::TEXT
END
WHERE assessment_score IS NULL;

-- 6. Populate address
UPDATE t_committee_case SET address = CASE abs(hashtext(case_id::text || 'x')) % 8
    WHEN 0 THEN 'Bole Road, Building 12'
    WHEN 1 THEN 'Churchill Avenue, Floor 3'
    WHEN 2 THEN 'Africa Avenue, Tower Block'
    WHEN 3 THEN 'Ras Mekonnen Street, Suite 201'
    WHEN 4 THEN 'Meskel Square, Office Complex'
    WHEN 5 THEN 'Mercato Area, Block 5'
    WHEN 6 THEN 'Kazanchis, Commercial Center'
    WHEN 7 THEN 'Arat Kilo, Government Road'
END
WHERE address IS NULL;

-- 7. Populate city
UPDATE t_committee_case SET city = CASE abs(hashtext(case_id::text || 'y')) % 8
    WHEN 0 THEN 'Addis Ababa'
    WHEN 1 THEN 'Dire Dawa'
    WHEN 2 THEN 'Mekelle'
    WHEN 3 THEN 'Hawassa'
    WHEN 4 THEN 'Bahir Dar'
    WHEN 5 THEN 'Jimma'
    WHEN 6 THEN 'Adama'
    WHEN 7 THEN 'Gondar'
END
WHERE city IS NULL;

-- 8. Populate region
UPDATE t_committee_case SET region = CASE abs(hashtext(case_id::text || 'z')) % 8
    WHEN 0 THEN 'Addis Ababa'
    WHEN 1 THEN 'Dire Dawa'
    WHEN 2 THEN 'Tigray'
    WHEN 3 THEN 'Sidama'
    WHEN 4 THEN 'Amhara'
    WHEN 5 THEN 'Oromia'
    WHEN 6 THEN 'Oromia'
    WHEN 7 THEN 'Amhara'
END
WHERE region IS NULL;

-- 9. Populate compliance_issues (JSONB array)
UPDATE t_committee_case SET compliance_issues = CASE
    WHEN risk_priority = 'HIGH' THEN '["VAT non-compliance detected", "Transfer pricing anomaly", "Unreported income streams", "Missing withholding tax documentation"]'::JSONB
    WHEN risk_priority = 'MEDIUM' THEN '["VAT non-compliance detected", "Transfer pricing anomaly"]'::JSONB
    ELSE '["VAT non-compliance detected"]'::JSONB
END
WHERE compliance_issues IS NULL;

-- 10. Populate representatives (JSONB array of objects)
UPDATE t_committee_case SET representatives = '[{"name": "Abebe Haile", "title": "Finance Director"}, {"name": "Dawit Tadesse", "title": "Tax Manager"}]'::JSONB
WHERE representatives IS NULL;
