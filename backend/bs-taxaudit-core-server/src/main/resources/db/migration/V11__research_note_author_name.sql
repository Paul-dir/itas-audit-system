-- V11: Add author_name columns to research note and comment tables
-- Resolves UUID → display name at write time for fast reads

ALTER TABLE t_research_note
    ADD COLUMN IF NOT EXISTS author_name VARCHAR(200);

ALTER TABLE t_research_comment
    ADD COLUMN IF NOT EXISTS author_name VARCHAR(200);

-- Backfill existing notes with a formatted UUID fallback
UPDATE t_research_note
SET author_name = 'Member ' || UPPER(SUBSTRING(author_id::text, 1, 8))
WHERE author_name IS NULL;

UPDATE t_research_comment
SET author_name = 'Member ' || UPPER(SUBSTRING(author_id::text, 1, 8))
WHERE author_name IS NULL;
