-- V17: Assign different tax centers to existing committee cases
-- Distributes 10 cases across 4 tax centers with realistic company names

-- Cases 1-3: addis_ababa-tc1
UPDATE t_committee_case SET 
    tax_center = 'addis_ababa-tc1',
    taxpayer_name = 'Ethiopian Mining Corporation',
    industry = 'Manufacturing',
    segment = 'LARGE',
    city = 'Addis Ababa',
    region = 'Addis Ababa'
WHERE case_id = '11111111-1111-1111-1111-111111111111';

UPDATE t_committee_case SET 
    tax_center = 'addis_ababa-tc1',
    taxpayer_name = 'Blue Nile Construction PLC',
    industry = 'Construction',
    segment = 'MEDIUM',
    city = 'Addis Ababa',
    region = 'Addis Ababa'
WHERE case_id = '22222222-2222-2222-2222-222222222222';

UPDATE t_committee_case SET 
    tax_center = 'addis_ababa-tc1',
    taxpayer_name = 'Habesha Trading Enterprise',
    industry = 'Trading',
    segment = 'MEDIUM',
    city = 'Addis Ababa',
    region = 'Addis Ababa'
WHERE case_id = '33333333-3333-3333-3333-333333333333';

-- Cases 4-6: addis_ababa-tc2
UPDATE t_committee_case SET 
    tax_center = 'addis_ababa-tc2',
    taxpayer_name = 'Dashen Bank S.C.',
    industry = 'Financial Services',
    segment = 'LARGE',
    city = 'Addis Ababa',
    region = 'Addis Ababa'
WHERE case_id = '44444444-4444-4444-4444-444444444444';

UPDATE t_committee_case SET 
    tax_center = 'addis_ababa-tc2',
    taxpayer_name = 'Addis Ababa Pharmaceuticals',
    industry = 'Healthcare',
    segment = 'MEDIUM',
    city = 'Addis Ababa',
    region = 'Addis Ababa'
WHERE case_id = '55555555-5555-5555-5555-555555555555';

UPDATE t_committee_case SET 
    tax_center = 'addis_ababa-tc2',
    taxpayer_name = 'Rift Valley Retail Group',
    industry = 'Retail',
    segment = 'LARGE',
    city = 'Addis Ababa',
    region = 'Addis Ababa'
WHERE case_id = '66666666-6666-6666-6666-666666666666';

-- Cases 7-8: addis_ababa-tc3
UPDATE t_committee_case SET 
    tax_center = 'addis_ababa-tc3',
    taxpayer_name = 'Hawassa Industrial Park PLC',
    industry = 'Manufacturing',
    segment = 'LARGE',
    city = 'Hawassa',
    region = 'Sidama'
WHERE case_id = '77777777-7777-7777-7777-777777777777';

UPDATE t_committee_case SET 
    tax_center = 'addis_ababa-tc3',
    taxpayer_name = 'Sidama Coffee Exporters',
    industry = 'Trading',
    segment = 'MEDIUM',
    city = 'Hawassa',
    region = 'Sidama'
WHERE case_id = '88888888-8888-8888-8888-888888888888';

-- Cases 9-10: oromia-tc1
UPDATE t_committee_case SET 
    tax_center = 'oromia-tc1',
    taxpayer_name = 'Jimma Agricultural Industries',
    industry = 'Manufacturing',
    segment = 'LARGE',
    city = 'Jimma',
    region = 'Oromia'
WHERE case_id = '99999999-9999-9999-9999-999999999010';

UPDATE t_committee_case SET 
    tax_center = 'oromia-tc1',
    taxpayer_name = 'Oromia Mining & Minerals',
    industry = 'Energy',
    segment = 'LARGE',
    city = 'Adama',
    region = 'Oromia'
WHERE case_id = 'aaaaaaa1-1111-1111-1111-111111111111';
