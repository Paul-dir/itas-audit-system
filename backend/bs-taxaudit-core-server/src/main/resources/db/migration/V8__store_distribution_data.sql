-- V8__store_distribution_data.sql
-- This migration is now a no-op as V2.0 already includes the distribution_json storage
-- and regional deployment tables are created in V9 instead

-- Distribution storage was moved to V2.0 to align with the main schema
-- Regional deployment infrastructure is in V9

-- This migration can be safely skipped as all required columns and tables are created earlier
SELECT 1;
