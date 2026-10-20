-- V32__update_user_emails_and_names.sql
-- Harmonize names and official emails across system accounts

UPDATE users SET full_name = 'Eden Haile', email = 'eden.haile@mor.gov.et' WHERE username = 'u-pt-01';
UPDATE users SET full_name = 'Samuel Worku', email = 'samuel.worku@mor.gov.et' WHERE username = 'u-pt-02';
UPDATE users SET full_name = 'Yodit Kassa', email = 'yodit.kassa@mor.gov.et' WHERE username = 'u-pt-03';
UPDATE users SET full_name = 'Getnet Bekele', email = 'getnet.bekele@mor.gov.et' WHERE username = 'u-ad-01';
UPDATE users SET full_name = 'Gemechu Kebede', email = 'gemechu.kebede@mor.gov.et' WHERE username = 'u-ad-02';
UPDATE users SET full_name = 'Almaz Berhane', email = 'almaz.berhane@mor.gov.et' WHERE username = 'u-sm-01';
UPDATE users SET full_name = 'Workneh Wolde', email = 'workneh.wolde@mor.gov.et' WHERE username = 'u-sm-02';
UPDATE users SET full_name = 'Berihun Lemma', email = 'berihun.lemma@mor.gov.et' WHERE username = 'u-rd-fed';
UPDATE users SET full_name = 'Tsega Mulugeta', email = 'tsega.mulugeta@mor.gov.et' WHERE username = 'u-tcm-federal-lto1';
UPDATE users SET full_name = 'Berihun Tesfaye', email = 'berihun.tesfaye@mor.gov.et' WHERE username = 'u-tcm-federal-lto2';
UPDATE users SET full_name = 'Fikadu Belay', email = 'fikadu.belay@mor.gov.et' WHERE username = 'u-com-fed-tpchair';
