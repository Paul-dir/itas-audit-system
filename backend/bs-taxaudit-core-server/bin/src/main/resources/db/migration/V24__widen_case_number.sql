-- V24: Widen ap_audit_cases.case_number
--
-- The cascade case-number format is YEAR-PLANSHORT-REGION-TAXCENTER-NNNN
-- (e.g. 2026-debd61f2-federal-lto2-federal-lto2-0001 ≈ 36-38 chars), which
-- exceeds the original VARCHAR(32) and made cascade-to-cases inserts fail
-- with "value too long for type character varying(32)".
-- 64 chars comfortably fits the longest region/tax-center code combinations.
ALTER TABLE ap_audit_cases ALTER COLUMN case_number TYPE VARCHAR(64);

-- Keep the JPA entity mapping in sync (length = 64).
