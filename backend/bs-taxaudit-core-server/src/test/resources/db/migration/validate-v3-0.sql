-- ====================================================================
-- Validation script for V3_0__jac_committee_cases.sql
-- Use this script to validate migration syntax and structure
-- ====================================================================

-- Step 1: Validate t_committee_case table exists and has correct structure
SELECT 
    'VALIDATION: t_committee_case table structure' as check_type,
    COUNT(*) as column_count
FROM information_schema.columns
WHERE table_name = 't_committee_case'
GROUP BY table_name;

-- Step 2: List all columns in t_committee_case
SELECT 
    't_committee_case columns' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 't_committee_case'
ORDER BY ordinal_position;

-- Step 3: Validate t_case_status_history table exists
SELECT 
    'VALIDATION: t_case_status_history table structure' as check_type,
    COUNT(*) as column_count
FROM information_schema.columns
WHERE table_name = 't_case_status_history'
GROUP BY table_name;

-- Step 4: List all columns in t_case_status_history
SELECT 
    't_case_status_history columns' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 't_case_status_history'
ORDER BY ordinal_position;

-- Step 5: Validate primary keys
SELECT
    'PRIMARY KEYS' as constraint_type,
    table_name,
    constraint_name
FROM information_schema.table_constraints
WHERE constraint_type = 'PRIMARY KEY'
AND table_name IN ('t_committee_case', 't_case_status_history');

-- Step 6: Validate unique constraints
SELECT
    'UNIQUE CONSTRAINTS' as constraint_type,
    table_name,
    constraint_name
FROM information_schema.table_constraints
WHERE constraint_type = 'UNIQUE'
AND table_name IN ('t_committee_case', 't_case_status_history');

-- Step 7: Validate foreign keys
SELECT
    'FOREIGN KEYS' as constraint_type,
    table_name,
    constraint_name
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
AND table_name IN ('t_committee_case', 't_case_status_history');

-- Step 8: Show foreign key details
SELECT
    'FK Details' as type,
    kcu1.table_name,
    kcu1.column_name,
    kcu2.table_name as foreign_table_name,
    kcu2.column_name as foreign_column_name
FROM information_schema.referential_constraints rc
JOIN information_schema.key_column_usage kcu1 ON rc.constraint_name = kcu1.constraint_name
JOIN information_schema.key_column_usage kcu2 ON rc.unique_constraint_name = kcu2.constraint_name
WHERE kcu1.table_name IN ('t_committee_case', 't_case_status_history');

-- Step 9: Validate indexes
SELECT
    'INDEXES' as object_type,
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('t_committee_case', 't_case_status_history')
ORDER BY tablename, indexname;

-- Step 10: Validate CHECK constraints
SELECT
    'CHECK CONSTRAINTS' as constraint_type,
    c.oid::regclass::text as table_name,
    con.conname as constraint_name,
    pg_get_constraintdef(con.oid) as constraint_definition
FROM pg_constraint con
JOIN pg_class c ON c.oid = con.conrelid
WHERE c.relname IN ('t_committee_case', 't_case_status_history')
AND con.contype = 'c';

-- Step 11: Validate table comments
SELECT
    'TABLE COMMENTS' as object_type,
    objname,
    description
FROM pg_catalog.pg_description
JOIN pg_catalog.pg_class ON pg_class.oid = objoid
WHERE pg_class.relname IN ('t_committee_case', 't_case_status_history');

-- Step 12: Validate column comments
SELECT
    'COLUMN COMMENTS' as object_type,
    col_description(objoid, objsubid) as description,
    attname as column_name
FROM pg_catalog.pg_description
JOIN pg_catalog.pg_attribute ON pg_attribute.attrelid = objoid
WHERE objoid IN (SELECT oid FROM pg_class WHERE relname IN ('t_committee_case', 't_case_status_history'));

-- Step 13: Test data insertion (valid case)
-- Note: This creates test data. Clean up afterward if needed.
INSERT INTO t_committee_case (
    case_id,
    original_case_id,
    taxpayer_id,
    taxpayer_name,
    tax_id_number,
    status,
    committee_deadline,
    created_by,
    risk_score
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    'Test Corporation',
    'TAX-12345',
    'PENDING_VOTES',
    NOW() + interval '30 days',
    '550e8400-e29b-41d4-a716-446655440003',
    75
);

-- Step 14: Verify test data insertion
SELECT 
    'VALIDATION: Data insertion' as check_type,
    COUNT(*) as inserted_records
FROM t_committee_case
WHERE case_id = '550e8400-e29b-41d4-a716-446655440000';

-- Step 15: Test status history insertion
INSERT INTO t_case_status_history (
    history_id,
    case_id,
    old_status,
    new_status,
    transitioned_by
) VALUES (
    '650e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440000',
    NULL,
    'PENDING_VOTES',
    '550e8400-e29b-41d4-a716-446655440003'
);

-- Step 16: Verify status history insertion
SELECT
    'VALIDATION: Status history insertion' as check_type,
    COUNT(*) as inserted_records
FROM t_case_status_history
WHERE case_id = '550e8400-e29b-41d4-a716-446655440000';

-- Step 17: Clean up test data
DELETE FROM t_case_status_history WHERE history_id = '650e8400-e29b-41d4-a716-446655440000';
DELETE FROM t_committee_case WHERE case_id = '550e8400-e29b-41d4-a716-446655440000';

-- ====================================================================
-- Rollback Validation
-- ====================================================================
-- Run this section to validate rollback works:
-- Uncomment the rollback commands below to test

-- DROP INDEX IF EXISTS idx_case_status_history_time;
-- DROP INDEX IF EXISTS idx_case_status_history_case;
-- DROP TABLE IF EXISTS t_case_status_history;
-- DROP INDEX IF EXISTS idx_committee_case_created;
-- DROP INDEX IF EXISTS idx_committee_case_chairperson;
-- DROP INDEX IF EXISTS idx_committee_case_owner;
-- DROP INDEX IF EXISTS idx_committee_case_deadline;
-- DROP INDEX IF EXISTS idx_committee_case_taxpayer;
-- DROP INDEX IF EXISTS idx_committee_case_status;
-- DROP TABLE IF EXISTS t_committee_case;
