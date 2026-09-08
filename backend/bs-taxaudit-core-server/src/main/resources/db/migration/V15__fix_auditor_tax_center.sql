-- V15: Fix auditor tax_center mapping using explicit UUID → tax_center values
-- The V14 join (auditor_id = user_id) fails because auditor UUIDs != user UUIDs.
-- This uses explicit CASE mapping to set the correct tax center for each auditor.

UPDATE t_auditor SET tax_center = CASE auditor_id
    WHEN 'a0000001-0000-0000-0000-000000000001' THEN 'addis_ababa-tc1'
    WHEN 'a0000001-0000-0000-0000-000000000002' THEN 'addis_ababa-tc1'
    WHEN 'a0000001-0000-0000-0000-000000000003' THEN 'addis_ababa-tc2'
    WHEN 'a0000001-0000-0000-0000-000000000004' THEN 'addis_ababa-tc2'
    WHEN 'a0000001-0000-0000-0000-000000000005' THEN 'addis_ababa-tc3'
    WHEN 'a0000001-0000-0000-0000-000000000006' THEN 'addis_ababa-tc3'
    WHEN 'a0000001-0000-0000-0000-000000000007' THEN 'oromia-tc1'
    WHEN 'a0000001-0000-0000-0000-000000000008' THEN 'oromia-tc1'
    ELSE tax_center
END;
