-- V7__add_unique_plan_year.sql
-- Add unique constraint on plan_year to enforce one plan per year
-- Each fiscal year can have only one audit plan

ALTER TABLE ap_annual_audit_plans ADD CONSTRAINT uk_annual_plans_year UNIQUE (plan_year);
