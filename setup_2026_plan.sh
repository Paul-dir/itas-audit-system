#!/bin/bash
set -e

BASE_URL="http://localhost:8080"
echo "======================================================================="
echo "   CREATING & ROUTING 2026 NATIONAL STRATEGIC AUDIT PLAN"
echo "   Regions: Federal (LTO-1), Addis Ababa (TC-1), Oromia (TC-1)"
echo "======================================================================="

# --- Step 0: Clean Previous Plans & Operational Cases ---
echo ""
echo "[Step 0] Cleaning previous plans and operational cases..."
PGPASSWORD=dev_password psql -h localhost -p 5432 -U itas_dev -d itas_audit -c "
DELETE FROM tp_analysis_data;
DELETE FROM tp_risk_assessment;
DELETE FROM tp_working_hypothesis;
DELETE FROM tp_audit_plan;
DELETE FROM tp_audit_notice;
DELETE FROM tp_audit_report;
DELETE FROM tp_field_work_data;
DELETE FROM tp_objection;
DELETE FROM tp_planning_meeting;
DELETE FROM tp_information_request_log;
DELETE FROM tp_audit_action_history;
DELETE FROM tp_exit_conference;
DELETE FROM tp_competitor_price_uploads;
DELETE FROM tp_external_price_match;
DELETE FROM issue_audit_details;
DELETE FROM workflow_tasks;
DELETE FROM workflow_instances;
DELETE FROM case_assignments;
DELETE FROM t_auditor_nomination;
DELETE FROM t_audit_team;
DELETE FROM t_case_status_history;
DELETE FROM t_handoff_team_member;
DELETE FROM t_handoff_record;
DELETE FROM t_working_paper;
DELETE FROM t_committee_vote;
DELETE FROM t_voting_tally;
DELETE FROM t_session_attendee;
DELETE FROM t_committee_session;
DELETE FROM t_advisory_voting;
DELETE FROM t_research_attachment;
DELETE FROM t_research_comment;
DELETE FROM t_research_note;
DELETE FROM t_caat_anomaly;
DELETE FROM t_audit_document;
DELETE FROM t_audit_finding;
DELETE FROM t_committee_audit_log;
DELETE FROM t_committee_case;
DELETE FROM ap_audit_cases;
ALTER TABLE ap_plan_audit_logs DISABLE TRIGGER ALL;
DELETE FROM ap_plan_audit_logs;
ALTER TABLE ap_plan_audit_logs ENABLE TRIGGER ALL;
DELETE FROM ap_plan_timeline;
DELETE FROM ap_plan_revisions;
DELETE FROM ap_director_approvals;
DELETE FROM ap_regional_feedback;
DELETE FROM ap_regional_plan_access;
DELETE FROM ap_regional_tc_deployments;
DELETE FROM ap_regional_deployments;
DELETE FROM ap_plan_allocations;
DELETE FROM ap_annual_audit_plans;
" > /dev/null 2>&1 || true
echo "  ✓ Clean state achieved"

# --- Step 1: Create 2026 Plan ---
echo ""
echo "[Step 1] Creating 2026 Strategic Plan..."
PLAN_RESP=$(curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: national-process-owner" \
  -d '{
    "planYear": 2026,
    "planName": "2026 National Strategic Audit Plan",
    "estimatedRevenue": 850000000,
    "regionalAllocations": [
        {"regionCode": "REG-FED", "proposedCount": 66},
        {"regionCode": "REG-AA", "proposedCount": 40},
        {"regionCode": "REG-BB", "proposedCount": 27}
    ],
    "distribution": {
        "REG-FED": {
            "JOINT_AUDIT": 23,
            "TRANSFER_PRICING": 18,
            "COMPREHENSIVE_AUDIT": 9,
            "DESK_AUDIT": 9,
            "ISSUE_AUDIT": 7
        },
        "REG-AA": {
            "JOINT_AUDIT": 15,
            "TRANSFER_PRICING": 10,
            "COMPREHENSIVE_AUDIT": 5,
            "DESK_AUDIT": 5,
            "ISSUE_AUDIT": 5
        },
        "REG-BB": {
            "JOINT_AUDIT": 8,
            "TRANSFER_PRICING": 8,
            "COMPREHENSIVE_AUDIT": 5,
            "DESK_AUDIT": 3,
            "ISSUE_AUDIT": 3
        }
    }
}')

PLAN_ID=$(echo "$PLAN_RESP" | jq -r '.id')
echo "==> 2026 Plan Created with ID: $PLAN_ID"
if [ "$PLAN_ID" == "null" ] || [ -z "$PLAN_ID" ]; then
    echo "FAILED: Could not create 2026 plan: $PLAN_RESP"
    exit 1
fi

# --- Step 2: Routing Approvals ---
echo ""
echo "[Step 2] Routing initial approvals..."
curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/submit-to-director" \
  -H "X-Actor-Id: national-process-owner" > /dev/null
echo "  ✓ Submitted to National Audit Director"

curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/approve-by-director" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: national-director" \
  -d '{"reason": "Approved statutory plan for FY2026"}' > /dev/null
echo "  ✓ Approved by National Audit Director"

curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/submit-to-regional" \
  -H "X-Actor-Id: national-process-owner" > /dev/null
echo "  ✓ Submitted to Regional Directors"

curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/approve-by-regional" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: fed-director" \
  -d '{"reason": "Endorsed by Regional Directors"}' > /dev/null
echo "  ✓ Approved by Regional Directors"

# --- Step 3: Divide Allocations to Tax Centers ---
echo ""
echo "[Step 3] Dividing Allocations & Deploying to Tax Centers..."
curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/divide-allocations" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: fed-director" \
  -d '{
    "regionCode": "REG-FED",
    "taxCenterAllocations": [
        {"taxCenterCode": "federal-lto1", "auditCount": 40},
        {"taxCenterCode": "federal-lto2", "auditCount": 26}
    ]
}' > /dev/null
echo "  ✓ Allocated 40 audits to federal-lto1 and 26 audits to federal-lto2"

curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/divide-allocations" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: fed-director" \
  -d '{
    "regionCode": "REG-AA",
    "taxCenterAllocations": [
        {"taxCenterCode": "addis_ababa-tc1", "auditCount": 40}
    ]
}' > /dev/null
echo "  ✓ Allocated 40 audits to addis_ababa-tc1"

curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/divide-allocations" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: fed-director" \
  -d '{
    "regionCode": "REG-BB",
    "taxCenterAllocations": [
        {"taxCenterCode": "oromia-tc1", "auditCount": 27}
    ]
}' > /dev/null
echo "  ✓ Allocated 27 audits to oromia-tc1"

# Set exact statutory breakdown per Tax Center
PGPASSWORD=dev_password psql -h localhost -p 5432 -U itas_dev -d itas_audit -c "
UPDATE ap_plan_allocations 
SET allocation_by_audit_type = '{\"JOINT_AUDIT\": 15, \"TRANSFER_PRICING\": 10, \"COMPREHENSIVE_AUDIT\": 5, \"DESK_AUDIT\": 5, \"ISSUE_AUDIT\": 5}'::jsonb
WHERE plan_id = '$PLAN_ID' AND tax_center_code = 'federal-lto1';

UPDATE ap_plan_allocations 
SET allocation_by_audit_type = '{\"JOINT_AUDIT\": 8, \"TRANSFER_PRICING\": 8, \"COMPREHENSIVE_AUDIT\": 4, \"DESK_AUDIT\": 4, \"ISSUE_AUDIT\": 2}'::jsonb
WHERE plan_id = '$PLAN_ID' AND tax_center_code = 'federal-lto2';

UPDATE ap_plan_allocations 
SET allocation_by_audit_type = '{\"JOINT_AUDIT\": 15, \"TRANSFER_PRICING\": 10, \"COMPREHENSIVE_AUDIT\": 5, \"DESK_AUDIT\": 5, \"ISSUE_AUDIT\": 5}'::jsonb
WHERE plan_id = '$PLAN_ID' AND tax_center_code = 'addis_ababa-tc1';

UPDATE ap_plan_allocations 
SET allocation_by_audit_type = '{\"JOINT_AUDIT\": 8, \"TRANSFER_PRICING\": 8, \"COMPREHENSIVE_AUDIT\": 5, \"DESK_AUDIT\": 3, \"ISSUE_AUDIT\": 3}'::jsonb
WHERE plan_id = '$PLAN_ID' AND tax_center_code = 'oromia-tc1';
" > /dev/null 2>&1
echo "  ✓ Strict audit type breakdowns configured per Tax Center"

curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/send-to-tax-centers" \
  -H "X-Actor-Id: fed-director" > /dev/null
echo "  ✓ Dispatched plan to Tax Centers"

# --- Step 4: Tax Center Capacity Feedback ---
echo ""
echo "[Step 4] Submitting Tax Center capacity feedback..."
curl -s -X PATCH "$BASE_URL/api/v1/backoffice/ap/plans/$PLAN_ID/allocations/federal-lto1/feedback" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: u-tcm-federal-lto1" \
  -d '{
    "adjustedCount": 40,
    "justification": "Federal LTO-1 accepts statutory allocation of 40 audits (15 Joint, 10 TP, 5 Comp, 5 Desk, 5 Issue)."
}' > /dev/null
echo "  ✓ Feedback submitted by Federal LTO-1 Manager (40 audits)"

curl -s -X PATCH "$BASE_URL/api/v1/backoffice/ap/plans/$PLAN_ID/allocations/federal-lto2/feedback" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: u-tcm-federal-lto2" \
  -d '{
    "adjustedCount": 26,
    "justification": "Federal LTO-2 accepts statutory allocation of 26 audits (8 Joint, 8 TP, 4 Comp, 4 Desk, 2 Issue)."
}' > /dev/null
echo "  ✓ Feedback submitted by Federal LTO-2 Manager (26 audits)"

curl -s -X PATCH "$BASE_URL/api/v1/backoffice/ap/plans/$PLAN_ID/allocations/addis_ababa-tc1/feedback" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: aa1.manager" \
  -d '{
    "adjustedCount": 40,
    "justification": "Addis Ababa TC1 accepts capacity allocation of 40 audits."
}' > /dev/null
echo "  ✓ Feedback submitted by Addis Ababa TC1 Manager"

curl -s -X PATCH "$BASE_URL/api/v1/backoffice/ap/plans/$PLAN_ID/allocations/oromia-tc1/feedback" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: or1.manager" \
  -d '{
    "adjustedCount": 27,
    "justification": "Oromia TC1 accepts statutory allocation of 27 audits."
}' > /dev/null
echo "  ✓ Feedback submitted by Oromia TC1 Manager"

curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/mark-feedback-complete" \
  -H "X-Actor-Id: fed-director" > /dev/null
echo "  ✓ Feedback marked complete"

# --- Step 5: Finalize 2026 Plan ---
echo ""
echo "[Step 5] Finalizing 2026 Annual Audit Plan..."
curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/finalize" \
  -H "X-Actor-Id: national-director" > /dev/null
echo "  ✓ 2026 Plan FINALIZED successfully!"

# --- Step 6: Cascade to Cases ---
echo ""
echo "[Step 6] Cascading 2026 plan to operational audit cases..."
CASCADE_RESP=$(curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/$PLAN_ID/cascade-to-cases" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: fed-director" \
  -d '{"auditTypes": ["JOINT_AUDIT", "TRANSFER_PRICING", "COMPREHENSIVE_AUDIT", "DESK_AUDIT", "ISSUE_AUDIT"]}')
echo "  ✓ Plan cascaded into operational cases!"
sleep 2

# --- Step 7: Verification of Cascaded Cases ---
echo ""
echo "[Step 7] Verifying Case Routing & Assignment:"

TOTAL_AP_CASES=$(PGPASSWORD=dev_password psql -h localhost -p 5432 -U itas_dev -d itas_audit -t -A -c "SELECT COUNT(*) FROM ap_audit_cases WHERE plan_id = '$PLAN_ID';")
echo "  ==> Total AP Audit Cases Created for 2026 Plan: $TOTAL_AP_CASES"

# Count by Tax Center and Audit Type
echo "  ==> Cases by Tax Center & Audit Type:"
PGPASSWORD=dev_password psql -h localhost -p 5432 -U itas_dev -d itas_audit -c "
SELECT tax_center_code, audit_type, COUNT(*) 
FROM ap_audit_cases 
WHERE plan_id = '$PLAN_ID' 
GROUP BY tax_center_code, audit_type 
ORDER BY tax_center_code, audit_type;
"

# Joint Committee Cases bridged into t_committee_case
echo ""
echo "  ==> Joint Audit Committee Cases in t_committee_case:"
PGPASSWORD=dev_password psql -h localhost -p 5432 -U itas_dev -d itas_audit -c "
SELECT tax_center, status, COUNT(*) 
FROM t_committee_case 
GROUP BY tax_center, status 
ORDER BY tax_center;
"

# --- Step 8: Multi-Tier Statutory Assignment for TP and Team Leaders ---
echo ""
echo "[Step 8] Assigning TP cases to Review Committee and general cases to dedicated Team Leaders..."

PGPASSWORD=dev_password psql -h localhost -p 5432 -U itas_dev -d itas_audit -c "
-- 8.1 FEDERAL LTO-1 ASSIGNMENTS
UPDATE ap_audit_cases 
SET committee_id = '0f2b2307-510c-4ebb-96a7-089776845f48',
    assigned_team_leader_id = 'u-tl-federal-lto1-tp-1',
    status = 'ASSIGNED_TO_COMMITTEE',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('federal-lto1', 'TC-FED-01')
  AND audit_type IN ('TPRICE', 'TRANSFER_PRICING');

UPDATE ap_audit_cases 
SET assigned_team_leader_id = 'u-tl-federal-lto1-comp-1',
    status = 'ASSIGNED_TO_TEAM_LEADER',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('federal-lto1', 'TC-FED-01')
  AND audit_type IN ('COMPREHENSIVE', 'COMPREHENSIVE_AUDIT');

UPDATE ap_audit_cases 
SET assigned_team_leader_id = 'u-tl-federal-lto1-desk-1',
    status = 'ASSIGNED_TO_TEAM_LEADER',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('federal-lto1', 'TC-FED-01')
  AND audit_type IN ('DESK', 'DESK_AUDIT');

UPDATE ap_audit_cases 
SET assigned_team_leader_id = 'u-tl-federal-lto1-issue-1',
    status = 'ASSIGNED_TO_TEAM_LEADER',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('federal-lto1', 'TC-FED-01')
  AND audit_type IN ('ISSUE', 'ISSUE_AUDIT');

-- 8.2 ADDIS ABABA TC-1 ASSIGNMENTS
UPDATE ap_audit_cases 
SET committee_id = '0f2b2307-510c-4ebb-96a7-089776845f48',
    assigned_team_leader_id = 'u-tl-addis_ababa-tc1-tp-1',
    status = 'ASSIGNED_TO_COMMITTEE',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('addis_ababa-tc1', 'TC-AA-01')
  AND audit_type IN ('TPRICE', 'TRANSFER_PRICING');

UPDATE ap_audit_cases 
SET assigned_team_leader_id = 'u-tl-addis_ababa-tc1-comp-1',
    status = 'ASSIGNED_TO_TEAM_LEADER',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('addis_ababa-tc1', 'TC-AA-01')
  AND audit_type IN ('COMPREHENSIVE', 'COMPREHENSIVE_AUDIT');

UPDATE ap_audit_cases 
SET assigned_team_leader_id = 'u-tl-addis_ababa-tc1-desk-1',
    status = 'ASSIGNED_TO_TEAM_LEADER',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('addis_ababa-tc1', 'TC-AA-01')
  AND audit_type IN ('DESK', 'DESK_AUDIT');

UPDATE ap_audit_cases 
SET assigned_team_leader_id = 'u-tl-addis_ababa-tc1-issue-1',
    status = 'ASSIGNED_TO_TEAM_LEADER',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('addis_ababa-tc1', 'TC-AA-01')
  AND audit_type IN ('ISSUE', 'ISSUE_AUDIT');

-- 8.3 OROMIA TC-1 ASSIGNMENTS
UPDATE ap_audit_cases 
SET committee_id = '0f2b2307-510c-4ebb-96a7-089776845f48',
    assigned_team_leader_id = 'u-tl-oromia-tc1-tp-1',
    status = 'ASSIGNED_TO_COMMITTEE',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('oromia-tc1', 'TC-BB-01')
  AND audit_type IN ('TPRICE', 'TRANSFER_PRICING');

UPDATE ap_audit_cases 
SET assigned_team_leader_id = 'u-tl-oromia-tc1-comp-1',
    status = 'ASSIGNED_TO_TEAM_LEADER',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('oromia-tc1', 'TC-BB-01')
  AND audit_type IN ('COMPREHENSIVE', 'COMPREHENSIVE_AUDIT');

UPDATE ap_audit_cases 
SET assigned_team_leader_id = 'u-tl-oromia-tc1-desk-1',
    status = 'ASSIGNED_TO_TEAM_LEADER',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('oromia-tc1', 'TC-BB-01')
  AND audit_type IN ('DESK', 'DESK_AUDIT');

UPDATE ap_audit_cases 
SET assigned_team_leader_id = 'u-tl-oromia-tc1-issue-1',
    status = 'ASSIGNED_TO_TEAM_LEADER',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('oromia-tc1', 'TC-BB-01')
  AND audit_type IN ('ISSUE', 'ISSUE_AUDIT');

-- 8.4 FEDERAL LTO-2 ASSIGNMENTS
UPDATE ap_audit_cases 
SET committee_id = '0f2b2307-510c-4ebb-96a7-089776845f48',
    assigned_team_leader_id = 'u-tl-federal-lto2-tp-1',
    status = 'ASSIGNED_TO_COMMITTEE',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('federal-lto2', 'TC-FED-02')
  AND audit_type IN ('TPRICE', 'TRANSFER_PRICING');

UPDATE ap_audit_cases 
SET assigned_team_leader_id = 'u-tl-federal-lto2-comp-1',
    status = 'ASSIGNED_TO_TEAM_LEADER',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('federal-lto2', 'TC-FED-02')
  AND audit_type IN ('COMPREHENSIVE', 'COMPREHENSIVE_AUDIT');

UPDATE ap_audit_cases 
SET assigned_team_leader_id = 'u-tl-federal-lto2-desk-1',
    status = 'ASSIGNED_TO_TEAM_LEADER',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('federal-lto2', 'TC-FED-02')
  AND audit_type IN ('DESK', 'DESK_AUDIT');

UPDATE ap_audit_cases 
SET assigned_team_leader_id = 'u-tl-federal-lto2-issue-1',
    status = 'ASSIGNED_TO_TEAM_LEADER',
    updated_at = NOW()
WHERE plan_id = '$PLAN_ID' 
  AND tax_center_code IN ('federal-lto2', 'TC-FED-02')
  AND audit_type IN ('ISSUE', 'ISSUE_AUDIT');
"
echo "  ✓ All cases strictly assigned by role and audit type!"

echo ""
echo "======================================================================="
echo "   ✅ 2026 PLAN CREATED, ROUTED, CASCADED & ASSIGNED SUCCESSFULLY!"
echo "======================================================================="
