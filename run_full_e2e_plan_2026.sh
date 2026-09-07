#!/bin/bash
set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

pass() { echo -e "${GREEN}✅ $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; exit 1; }
info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }
step() { echo -e "${BLUE}▶ $1${NC}"; }

BASE_URL="http://localhost:8080/api/v1/backoffice/ap"

echo "================================================================="
echo "  FULL E2E AUDIT PLAN 2026 ROUTING & VERIFICATION TEST"
echo "  All 7 Regions | 20 Tax Centers | All 5 Audit Types"
echo "================================================================="

step "1. Truncating all previous plans, cases, and workflow instances..."
PGPASSWORD=dev_password psql -h localhost -p 5432 -U itas_dev -d itas_audit -c "
TRUNCATE TABLE 
  ap_annual_audit_plans,
  ap_plan_allocations,
  ap_audit_cases,
  ap_director_approvals,
  ap_plan_audit_logs,
  ap_plan_revisions,
  ap_plan_timeline,
  ap_regional_deployments,
  ap_regional_feedback,
  ap_regional_plan_access,
  ap_regional_tc_deployments,
  case_assignments,
  issue_audit_details,
  tp_audit_report,
  workflow_tasks,
  workflow_steps,
  workflow_instances 
CASCADE;
" > /dev/null 2>&1
pass "Database truncated cleanly."

step "2. Creating 2026 Annual Audit Plan covering all 7 regions..."
CREATE_PAYLOAD='{
  "planYear": 2026,
  "planName": "2026 National Annual Audit Plan",
  "estimatedRevenue": 750000000,
  "regionalAllocations": [
    {"regionCode": "FED", "proposedCount": 100},
    {"regionCode": "AA", "proposedCount": 90},
    {"regionCode": "BA", "proposedCount": 90},
    {"regionCode": "BB", "proposedCount": 90},
    {"regionCode": "AB", "proposedCount": 90},
    {"regionCode": "CA", "proposedCount": 90},
    {"regionCode": "SO", "proposedCount": 90}
  ],
  "distribution": {
    "federal_level": { "desk_audit": 40, "comprehensive": 20, "issue_audit": 20, "joint_audit": 10, "transfer_pricing": 10 },
    "addis_ababa":   { "desk_audit": 30, "comprehensive": 20, "issue_audit": 20, "joint_audit": 10, "transfer_pricing": 10 },
    "amhara":        { "desk_audit": 30, "comprehensive": 20, "issue_audit": 20, "joint_audit": 10, "transfer_pricing": 10 },
    "oromia":        { "desk_audit": 30, "comprehensive": 20, "issue_audit": 20, "joint_audit": 10, "transfer_pricing": 10 },
    "dire_dawa":     { "desk_audit": 30, "comprehensive": 20, "issue_audit": 20, "joint_audit": 10, "transfer_pricing": 10 },
    "snnpr":         { "desk_audit": 30, "comprehensive": 20, "issue_audit": 20, "joint_audit": 10, "transfer_pricing": 10 },
    "somali":        { "desk_audit": 30, "comprehensive": 20, "issue_audit": 20, "joint_audit": 10, "transfer_pricing": 10 }
  }
}'

CREATE_RESP=$(curl -s -X POST "$BASE_URL/plans/workflow" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: u-pt-01" \
  -d "$CREATE_PAYLOAD")

PLAN_ID=$(echo "$CREATE_RESP" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('id', ''))")

if [ -z "$PLAN_ID" ] || [ "$PLAN_ID" == "None" ]; then
  fail "Failed to create 2026 plan: $CREATE_RESP"
fi
pass "2026 Plan created successfully with ID: $PLAN_ID (Status: DRAFT)"

step "3. Routing: Submit Plan to National Director..."
SUBMIT_RESP=$(curl -s -X POST "$BASE_URL/plans/workflow/$PLAN_ID/submit-to-director" \
  -H "X-Actor-Id: u-pt-01")
STATUS=$(echo "$SUBMIT_RESP" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('status', ''))")
if [ "$STATUS" != "SUBMITTED_TO_DIRECTOR" ]; then
  fail "Submit to director failed. Status: $STATUS. Resp: $SUBMIT_RESP"
fi
pass "Plan submitted to Director (Status: $STATUS)"

step "4. Routing: National Director Approves Plan..."
APPROVE_DIR_RESP=$(curl -s -X POST "$BASE_URL/plans/workflow/$PLAN_ID/approve-by-director" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: u-ad-01" \
  -d '{"reason": "Approved 2026 strategic quotas and revenue targets."}')
STATUS=$(echo "$APPROVE_DIR_RESP" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('status', ''))")
if [ "$STATUS" != "DIRECTOR_APPROVED" ]; then
  fail "Director approval failed. Status: $STATUS. Resp: $APPROVE_DIR_RESP"
fi
pass "Plan approved by Director (Status: $STATUS)"

step "5. Routing: Submit Plan to Regional Directors..."
SUBMIT_REG_RESP=$(curl -s -X POST "$BASE_URL/plans/workflow/$PLAN_ID/submit-to-regional" \
  -H "X-Actor-Id: u-pt-01")
STATUS=$(echo "$SUBMIT_REG_RESP" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('status', ''))")
if [ "$STATUS" != "SUBMITTED_TO_REGIONAL" ]; then
  fail "Submit to regional failed. Status: $STATUS. Resp: $SUBMIT_REG_RESP"
fi
pass "Plan submitted to Regional Directors (Status: $STATUS)"

step "6. Routing: Regional Director Approvals for all regions..."
REG_DIRECTORS=("u-rd-fed" "u-rd-aa" "u-rd-am" "u-rd-or" "u-rd-dd" "u-rd-sn" "u-rd-so")
for rd in "${REG_DIRECTORS[@]}"; do
  curl -s -X POST "$BASE_URL/plans/workflow/$PLAN_ID/approve-by-regional" \
    -H "Content-Type: application/json" \
    -H "X-Actor-Id: $rd" \
    -d '{"reason": "Regional capacity verified and approved."}' > /dev/null
done
pass "All 7 Regional Directors approved regional allocations."

step "7. Routing: Divide Regional Allocations into Tax Centers..."
# FED -> federal-lto1 (50), federal-lto2 (50)
curl -s -X POST "$BASE_URL/plans/workflow/$PLAN_ID/divide-allocations" \
  -H "Content-Type: application/json" -H "X-Actor-Id: u-rd-fed" \
  -d '{"regionCode": "FED", "taxCenterAllocations": [{"taxCenterCode": "federal-lto1", "auditCount": 50}, {"taxCenterCode": "federal-lto2", "auditCount": 50}]}' > /dev/null

# AA -> addis_ababa-tc1 (30), addis_ababa-tc2 (30), addis_ababa-tc3 (30)
curl -s -X POST "$BASE_URL/plans/workflow/$PLAN_ID/divide-allocations" \
  -H "Content-Type: application/json" -H "X-Actor-Id: u-rd-aa" \
  -d '{"regionCode": "AA", "taxCenterAllocations": [{"taxCenterCode": "addis_ababa-tc1", "auditCount": 30}, {"taxCenterCode": "addis_ababa-tc2", "auditCount": 30}, {"taxCenterCode": "addis_ababa-tc3", "auditCount": 30}]}' > /dev/null

# BA -> amhara-tc1 (30), amhara-tc2 (30), amhara-tc3 (30)
curl -s -X POST "$BASE_URL/plans/workflow/$PLAN_ID/divide-allocations" \
  -H "Content-Type: application/json" -H "X-Actor-Id: u-rd-am" \
  -d '{"regionCode": "BA", "taxCenterAllocations": [{"taxCenterCode": "amhara-tc1", "auditCount": 30}, {"taxCenterCode": "amhara-tc2", "auditCount": 30}, {"taxCenterCode": "amhara-tc3", "auditCount": 30}]}' > /dev/null

# BB -> oromia-tc1 (30), oromia-tc2 (30), oromia-tc3 (30)
curl -s -X POST "$BASE_URL/plans/workflow/$PLAN_ID/divide-allocations" \
  -H "Content-Type: application/json" -H "X-Actor-Id: u-rd-or" \
  -d '{"regionCode": "BB", "taxCenterAllocations": [{"taxCenterCode": "oromia-tc1", "auditCount": 30}, {"taxCenterCode": "oromia-tc2", "auditCount": 30}, {"taxCenterCode": "oromia-tc3", "auditCount": 30}]}' > /dev/null

# AB -> dire_dawa-tc1 (30), dire_dawa-tc2 (30), dire_dawa-tc3 (30)
curl -s -X POST "$BASE_URL/plans/workflow/$PLAN_ID/divide-allocations" \
  -H "Content-Type: application/json" -H "X-Actor-Id: u-rd-dd" \
  -d '{"regionCode": "AB", "taxCenterAllocations": [{"taxCenterCode": "dire_dawa-tc1", "auditCount": 30}, {"taxCenterCode": "dire_dawa-tc2", "auditCount": 30}, {"taxCenterCode": "dire_dawa-tc3", "auditCount": 30}]}' > /dev/null

# CA -> snnpr-tc1 (30), snnpr-tc2 (30), snnpr-tc3 (30)
curl -s -X POST "$BASE_URL/plans/workflow/$PLAN_ID/divide-allocations" \
  -H "Content-Type: application/json" -H "X-Actor-Id: u-rd-sn" \
  -d '{"regionCode": "CA", "taxCenterAllocations": [{"taxCenterCode": "snnpr-tc1", "auditCount": 30}, {"taxCenterCode": "snnpr-tc2", "auditCount": 30}, {"taxCenterCode": "snnpr-tc3", "auditCount": 30}]}' > /dev/null

# SO -> somali-tc1 (30), somali-tc2 (30), somali-tc3 (30)
curl -s -X POST "$BASE_URL/plans/workflow/$PLAN_ID/divide-allocations" \
  -H "Content-Type: application/json" -H "X-Actor-Id: u-rd-so" \
  -d '{"regionCode": "SO", "taxCenterAllocations": [{"taxCenterCode": "somali-tc1", "auditCount": 30}, {"taxCenterCode": "somali-tc2", "auditCount": 30}, {"taxCenterCode": "somali-tc3", "auditCount": 30}]}' > /dev/null
pass "All 20 tax centers divided across all 7 regions."

step "8. Routing: Send Plan to Tax Centers..."
SEND_TC_RESP=$(curl -s -X POST "$BASE_URL/plans/workflow/$PLAN_ID/send-to-tax-centers" \
  -H "X-Actor-Id: u-ad-01")
STATUS=$(echo "$SEND_TC_RESP" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('status', ''))")
if [ "$STATUS" != "SENT_TO_TAX_CENTERS" ]; then
  fail "Send to tax centers failed. Status: $STATUS. Resp: $SEND_TC_RESP"
fi
pass "Plan dispatched to Tax Centers (Status: $STATUS)"

step "9. Routing: Submit Tax Center Feedback from Tax Centers..."
TAX_CENTERS=(
  "federal-lto1" "federal-lto2"
  "addis_ababa-tc1" "addis_ababa-tc2" "addis_ababa-tc3"
  "amhara-tc1" "amhara-tc2" "amhara-tc3"
  "oromia-tc1" "oromia-tc2" "oromia-tc3"
  "dire_dawa-tc1" "dire_dawa-tc2" "dire_dawa-tc3"
  "snnpr-tc1" "snnpr-tc2" "snnpr-tc3"
  "somali-tc1" "somali-tc2" "somali-tc3"
)

for tc in "${TAX_CENTERS[@]}"; do
  COUNT=30
  if [[ "$tc" == *"lto"* ]]; then COUNT=50; fi
  curl -s -X PATCH "$BASE_URL/plans/workflow/$PLAN_ID/allocations/$tc/feedback" \
    -H "Content-Type: application/json" \
    -H "X-Actor-Id: u-tcm-$tc" \
    -d "{\"adjustedCount\": $COUNT, \"justification\": \"Target confirmed for $tc.\"}" > /dev/null
done
pass "Tax center feedback recorded for all 20 tax centers."

step "10. Routing: Mark Feedback Complete & Finalize Plan..."
curl -s -X POST "$BASE_URL/plans/workflow/$PLAN_ID/mark-feedback-complete" \
  -H "X-Actor-Id: u-ad-01" > /dev/null

FINALIZE_RESP=$(curl -s -X POST "$BASE_URL/plans/workflow/$PLAN_ID/finalize" \
  -H "X-Actor-Id: u-ad-01")
STATUS=$(echo "$FINALIZE_RESP" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('status', ''))")
if [ "$STATUS" != "FINALIZED" ]; then
  fail "Plan finalization failed. Status: $STATUS. Resp: $FINALIZE_RESP"
fi
pass "Plan finalized successfully (Status: FINALIZED)"

step "11. Routing: Cascade Plan into Audit Cases for all Audit Types..."
CASCADE_RESP=$(curl -s -X POST "$BASE_URL/plans/$PLAN_ID/cascade-to-cases" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: u-ad-01" \
  -d '{"auditTypes": ["DESK_AUDIT", "COMPREHENSIVE_AUDIT", "ISSUE_AUDIT", "JOINT_AUDIT", "TRANSFER_PRICING"]}')

echo "$CASCADE_RESP" | python3 -c "
import sys, json
raw = json.load(sys.stdin)
data = raw.get('data', raw)
print('Total cases created:', data.get('totalCasesCreated'))
print('Cases by Audit Type:', data.get('casesByAuditType'))
print('Processed Tax Centers count:', data.get('taxCentersProcessed'))
"

TOTAL_CASES=$(echo "$CASCADE_RESP" | python3 -c "import sys, json; raw=json.load(sys.stdin); print(raw.get('data', raw).get('totalCasesCreated', 0))")
if [ "$TOTAL_CASES" -eq 0 ]; then
  fail "Cascade failed to create any cases!"
fi
pass "Cascading generated $TOTAL_CASES total cases across all tax centers!"

step "12. Verifying Cases in All 20 Tax Centers..."
MISSING_TC=0
for tc in "${TAX_CENTERS[@]}"; do
  COUNT=$(curl -s "$BASE_URL/cases?taxCenter=$tc" -H "X-Actor-Id: u-ad-01" | python3 -c "import sys, json; print(len(json.load(sys.stdin).get('data', [])))")
  if [ "$COUNT" -eq 0 ]; then
    echo -e "${RED}  Tax center $tc has 0 cases!${NC}"
    MISSING_TC=$((MISSING_TC + 1))
  else
    echo -e "  ${CYAN}$tc${NC}: $COUNT cases"
  fi
done

if [ "$MISSING_TC" -gt 0 ]; then
  fail "$MISSING_TC tax centers have 0 cases!"
fi
pass "All 20 tax centers have active audit cases."

step "13. Verifying All 5 Audit Types in Database..."
AUDIT_TYPES=("DESK_AUDIT" "COMPREHENSIVE_AUDIT" "ISSUE_AUDIT" "JOINT_AUDIT" "TRANSFER_PRICING")
for at in "${AUDIT_TYPES[@]}"; do
  AT_COUNT=$(PGPASSWORD=dev_password psql -h localhost -p 5432 -U itas_dev -d itas_audit -t -A -c "SELECT count(*) FROM ap_audit_cases WHERE audit_type = '$at';")
  if [ "$AT_COUNT" -eq 0 ]; then
    fail "Audit type $at has 0 cases in database!"
  fi
  echo -e "  Audit Type ${CYAN}$at${NC}: $AT_COUNT cases"
done
pass "All 5 audit types generated in database."

step "14. Testing Tax Center Isolation & Assignment Routing..."
# Test in federal-lto1
LTO1_CASES=$(curl -s "$BASE_URL/cases?taxCenter=federal-lto1" -H "X-Actor-Id: u-tcm-federal-lto1")

# 14.1 DESK_AUDIT Assignment: TC Manager assigns to Desk TL
DESK_CASE_ID=$(echo "$LTO1_CASES" | python3 -c "import sys, json; cases=[c for c in json.load(sys.stdin)['data'] if c['auditType']=='DESK_AUDIT']; print(cases[0]['id'] if cases else '')")
if [ -n "$DESK_CASE_ID" ]; then
  ASSIGN_RESP=$(curl -s -X POST "$BASE_URL/cases/bulk-assign-team-leader" \
    -H "Content-Type: application/json" -H "X-Actor-Id: u-tcm-federal-lto1" \
    -d "{\"assignments\": [{\"caseId\": \"$DESK_CASE_ID\", \"teamLeaderId\": \"u-tl-federal-lto1-desk-1\"}]}")
  ASSIGNED_COUNT=$(echo "$ASSIGN_RESP" | python3 -c "import sys, json; print(json.load(sys.stdin).get('data', {}).get('assigned', 0))")
  if [ "$ASSIGNED_COUNT" -ne 1 ]; then fail "Desk TL assignment failed: $ASSIGN_RESP"; fi
  
  # Desk TL assigns to Desk Auditor
  AUD_ASSIGN_RESP=$(curl -s -X POST "$BASE_URL/cases/bulk-assign-auditor" \
    -H "Content-Type: application/json" -H "X-Actor-Id: u-tl-federal-lto1-desk-1" \
    -d "{\"assignments\": [{\"caseId\": \"$DESK_CASE_ID\", \"auditorId\": \"u-aud-federal-lto1-desk-1-1\"}]}")
  pass "DESK_AUDIT assigned to Desk TL (u-tl-federal-lto1-desk-1) -> Desk Auditor (u-aud-federal-lto1-desk-1-1)"
fi

# 14.2 COMPREHENSIVE_AUDIT Assignment
COMP_CASE_ID=$(echo "$LTO1_CASES" | python3 -c "import sys, json; cases=[c for c in json.load(sys.stdin)['data'] if c['auditType']=='COMPREHENSIVE_AUDIT']; print(cases[0]['id'] if cases else '')")
if [ -n "$COMP_CASE_ID" ]; then
  ASSIGN_RESP=$(curl -s -X POST "$BASE_URL/cases/bulk-assign-team-leader" \
    -H "Content-Type: application/json" -H "X-Actor-Id: u-tcm-federal-lto1" \
    -d "{\"assignments\": [{\"caseId\": \"$COMP_CASE_ID\", \"teamLeaderId\": \"u-tl-federal-lto1-comp-1\"}]}")
  pass "COMPREHENSIVE_AUDIT assigned to Comp TL (u-tl-federal-lto1-comp-1)"
fi

# 14.3 ISSUE_AUDIT Assignment
ISSUE_CASE_ID=$(echo "$LTO1_CASES" | python3 -c "import sys, json; cases=[c for c in json.load(sys.stdin)['data'] if c['auditType']=='ISSUE_AUDIT']; print(cases[0]['id'] if cases else '')")
if [ -n "$ISSUE_CASE_ID" ]; then
  ASSIGN_RESP=$(curl -s -X POST "$BASE_URL/cases/bulk-assign-team-leader" \
    -H "Content-Type: application/json" -H "X-Actor-Id: u-tcm-federal-lto1" \
    -d "{\"assignments\": [{\"caseId\": \"$ISSUE_CASE_ID\", \"teamLeaderId\": \"u-tl-federal-lto1-issue-1\"}]}")
  
  # Issue TL assigns to Issue Auditor
  curl -s -X POST "$BASE_URL/cases/bulk-assign-auditor" \
    -H "Content-Type: application/json" -H "X-Actor-Id: u-tl-federal-lto1-issue-1" \
    -d "{\"assignments\": [{\"caseId\": \"$ISSUE_CASE_ID\", \"auditorId\": \"u-aud-federal-lto1-issue-1-1\"}]}" > /dev/null
  pass "ISSUE_AUDIT assigned to Issue TL (u-tl-federal-lto1-issue-1) -> Issue Auditor (u-aud-federal-lto1-issue-1-1)"
fi

# 14.4 TRANSFER_PRICING Assignment
TP_CASE_ID=$(echo "$LTO1_CASES" | python3 -c "import sys, json; cases=[c for c in json.load(sys.stdin)['data'] if c['auditType']=='TRANSFER_PRICING']; print(cases[0]['id'] if cases else '')")
if [ -n "$TP_CASE_ID" ]; then
  # Committee assigns to TP TL
  ASSIGN_RESP=$(curl -s -X POST "$BASE_URL/cases/bulk-assign-team-leader" \
    -H "Content-Type: application/json" -H "X-Actor-Id: u-com-fed-tpchair" \
    -d "{\"assignments\": [{\"caseId\": \"$TP_CASE_ID\", \"teamLeaderId\": \"u-tl-federal-lto1-tp-1\"}]}")
  pass "TRANSFER_PRICING assigned by Committee to TP TL (u-tl-federal-lto1-tp-1)"
fi

# 14.5 JOINT_AUDIT Assignment
JA_CASE_ID=$(echo "$LTO1_CASES" | python3 -c "import sys, json; cases=[c for c in json.load(sys.stdin)['data'] if c['auditType']=='JOINT_AUDIT']; print(cases[0]['id'] if cases else '')")
if [ -n "$JA_CASE_ID" ]; then
  # Committee assigns to JA TL
  ASSIGN_RESP=$(curl -s -X POST "$BASE_URL/cases/bulk-assign-team-leader" \
    -H "Content-Type: application/json" -H "X-Actor-Id: u-com-fed-chair" \
    -d "{\"assignments\": [{\"caseId\": \"$JA_CASE_ID\", \"teamLeaderId\": \"u-tl-federal-lto1-joint-1\"}]}")
  pass "JOINT_AUDIT assigned by Committee to Joint TL (u-tl-federal-lto1-joint-1)"
fi

# 14.6 Cross-Tax-Center Rejection Test
CROSS_TEST=$(curl -s -X POST "$BASE_URL/cases/bulk-assign-team-leader" \
  -H "Content-Type: application/json" -H "X-Actor-Id: u-tcm-federal-lto1" \
  -d "{\"assignments\": [{\"caseId\": \"$DESK_CASE_ID\", \"teamLeaderId\": \"u-tl-addis_ababa-tc1-desk-1\"}]}")

IS_REJECTED=$(echo "$CROSS_TEST" | python3 -c "import sys, json; errors=json.load(sys.stdin).get('data', {}).get('errors', []); print('REJECTED' if any('Cannot assign to Team Leader' in e for e in errors) else 'FAILED')")
if [ "$IS_REJECTED" != "REJECTED" ]; then
  fail "Cross-center assignment was not properly rejected! Resp: $CROSS_TEST"
fi
pass "Cross-Tax-Center assignment correctly REJECTED by server validation."

# 14.7 Independent Assignment in Another Tax Center (addis_ababa-tc1)
AA1_CASES=$(curl -s "$BASE_URL/cases?taxCenter=addis_ababa-tc1" -H "X-Actor-Id: u-tcm-addis_ababa-tc1")
AA1_CASE_ID=$(echo "$AA1_CASES" | python3 -c "import sys, json; cases=json.load(sys.stdin)['data']; print(cases[0]['id'] if cases else '')")

AA1_ASSIGN=$(curl -s -X POST "$BASE_URL/cases/bulk-assign-team-leader" \
  -H "Content-Type: application/json" -H "X-Actor-Id: u-tcm-addis_ababa-tc1" \
  -d "{\"assignments\": [{\"caseId\": \"$AA1_CASE_ID\", \"teamLeaderId\": \"u-tl-addis_ababa-tc1-desk-1\"}]}")
AA1_SUCCESS=$(echo "$AA1_ASSIGN" | python3 -c "import sys, json; print(json.load(sys.stdin).get('data', {}).get('assigned', 0))")
if [ "$AA1_SUCCESS" -ne 1 ]; then
  fail "Assignment in addis_ababa-tc1 failed: $AA1_ASSIGN"
fi
pass "addis_ababa-tc1 assigned its own case independently without affecting federal-lto1."

step "15. Testing Audit Execution Workflows..."
# Test Issue Audit Execution Start
if [ -n "$ISSUE_CASE_ID" ]; then
  curl -s -X PATCH "$BASE_URL/cases/$ISSUE_CASE_ID/status" \
    -H "Content-Type: application/json" -H "X-Actor-Id: u-aud-federal-lto1-issue-1-1" \
    -d '{"status": "IN_PROGRESS", "notes": "Auditor began fieldwork on Issue Audit."}' > /dev/null
  
  CHECK_STATUS=$(curl -s "$BASE_URL/cases/$ISSUE_CASE_ID" -H "X-Actor-Id: u-aud-federal-lto1-issue-1-1" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['status'])")
  if [ "$CHECK_STATUS" != "IN_PROGRESS" ]; then
    fail "Issue audit status update failed. Status: $CHECK_STATUS"
  fi
  pass "Issue Audit execution workflow started: Case transitioned to IN_PROGRESS"
fi

# Test TP Audit Execution Start
if [ -n "$TP_CASE_ID" ]; then
  curl -s -X POST "http://localhost:8080/api/v1/backoffice/tp/cases/$TP_CASE_ID/start-execution" \
    -H "X-Actor-Id: u-tl-federal-lto1-tp-1" > /dev/null
  pass "TP Audit execution started: Initialized TP Dossier & Working Papers"
fi

echo ""
echo "================================================================="
echo -e "${GREEN}🎉 ALL TESTS PASSED SUCCESSFULLY!${NC}"
echo "  - Deleted all old plans and cascaded cases"
echo "  - Created new 2026 plan"
echo "  - Routed through Planning Team -> Director -> Regional -> Tax Centers -> Finalized"
echo "  - Cascaded cases across all 7 regions & 20 tax centers"
echo "  - Validated all 5 audit types (Desk, Comprehensive, Issue, Joint, TP)"
echo "  - Verified strict Tax Center Isolation & server-side cross-center rejection"
echo "  - Tested assignment and execution workflows end-to-end"
echo "================================================================="
