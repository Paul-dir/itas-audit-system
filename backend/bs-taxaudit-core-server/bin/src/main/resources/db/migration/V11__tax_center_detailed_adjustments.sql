-- V11: Tax Center Detailed Adjustments
-- 
-- PURPOSE:
-- Add support for per-audit-type adjustments from tax centers
-- Allows tax centers to adjust allocations per audit type based on capacity
--
-- CHANGES:
-- - Add tc_adjusted_allocations JSONB column to store per-audit-type adjustments
-- - Add tc_original_count to track original proposed count
-- - Add tc_adjustment_reason for context
-- - Existing tc_adjusted_count remains for backward compatibility

-- =========================================================================
-- 1. Add columns to ap_plan_allocations for detailed adjustments
-- =========================================================================

ALTER TABLE ap_plan_allocations
ADD COLUMN IF NOT EXISTS tc_adjusted_allocations JSONB,
ADD COLUMN IF NOT EXISTS tc_original_count INTEGER,
ADD COLUMN IF NOT EXISTS tc_adjustment_reason VARCHAR(500);

-- JSONB Column Documentation:
-- tc_adjusted_allocations: 
-- {
--   "desk_audit": 40,
--   "comprehensive_audit": 60,
--   "issue_audit": 20,
--   "joint_audit": 25,
--   "transfer_pricing": 15
-- }
-- This stores the per-audit-type adjustments that the tax center submitted

-- tc_original_count:
-- The original proposed_count sent to the tax center
-- Used to compare with tc_adjusted_count (total adjusted)

-- tc_adjustment_reason:
-- Short description of why adjustment was made (max 500 chars)
-- E.g., "Q3 staffing shortage", "Equipment maintenance scheduled"

-- =========================================================================
-- 2. Create index on JSONB column for querying
-- =========================================================================

CREATE INDEX IF NOT EXISTS idx_tc_adjusted_allocations 
ON ap_plan_allocations USING GIN(tc_adjusted_allocations);

-- =========================================================================
-- 3. Update existing records to populate new columns
-- =========================================================================

-- Set tc_original_count = proposed_count for existing records
-- (for records that have already been acknowledged)
UPDATE ap_plan_allocations 
SET tc_original_count = proposed_count,
    tc_adjustment_reason = 'Legacy submission (pre-V11)'
WHERE tc_feedback_submitted = true 
  AND tc_original_count IS NULL
  AND tax_center_code IS NOT NULL;

-- For future records, applications will set these values

-- =========================================================================
-- 4. Add comment to table explaining new columns
-- =========================================================================

COMMENT ON COLUMN ap_plan_allocations.tc_adjusted_allocations IS 
'JSON object storing per-audit-type adjustments: {desk_audit: 40, comprehensive_audit: 60, ...}';

COMMENT ON COLUMN ap_plan_allocations.tc_original_count IS 
'Original proposed count sent to tax center before adjustments';

COMMENT ON COLUMN ap_plan_allocations.tc_adjustment_reason IS 
'Reason for adjustment (e.g., staffing shortage, equipment maintenance)';
