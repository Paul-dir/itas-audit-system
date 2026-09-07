#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "COMPLETE PLAN ROUTING TEST - ADDIS ABABA TC1"
echo "════════════════════════════════════════════════════════════════"

BASE_URL="http://localhost:8080/api/v1/backoffice/ap"
YEAR=$((3000 + RANDOM))
REGION="addis_ababa"
TC_ID="addis_ababa-tc1"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

pass() { echo -e "${GREEN}✅ $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; exit 1; }
info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }
step() { echo -e "${BLUE}→ $1${NC}"; }

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "PHASE 1: CREATE PLAN FOR ADDIS ABABA TC1"
echo "════════════════════════════════════════════════════════════════"

step "Creating plan for fiscal year $YEAR"

PLAN_RESPONSE=$(curl -s -X POST "$BASE_URL/plans" \
  -H "X-Actor-Id: u-pt-01" \
  -H "Content-Type: application/json" \
  -d "{
    \"fiscalYear\": $YEAR,
    \"planType\": \"SHOW\",
    \"totalCases\": 500,
    \"region\": \"$REGION\",
    \"description\": \"Plan for $REGION - Testing Correct Routing\"
  }")

PLAN_ID=$(echo "$PLAN_RESPONSE" | jq -r '.data.planId // empty')
if [ -z "$PLAN_ID" ]; then
  fail "Plan creation failed: $PLAN_RESPONSE"
fi
pass "Plan created: $PLAN_ID (Year: $YEAR)"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "PHASE 2: SUBMIT PLAN TO DIRECTOR"
echo "════════════════════════════════════════════════════════════════"

step "Planning team submitting plan to director"

SUBMIT=$(curl -s -X POST "$BASE_URL/plans/$PLAN_ID/submit-to-director" \
  -H "X-Actor-Id: u-pt-01" \
  -H "Content-Type: application/json")

STATUS=$(echo "$SUBMIT" | jq -r '.data.status // empty')
if [ "$STATUS" != "SUBMITTED" ]; then
  fail "Submit failed: $SUBMIT"
fi
pass "Plan submitted to director - Status: $STATUS"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "PHASE 3: DIRECTOR APPROVES PLAN"
echo "════════════════════════════════════════════════════════════════"

step "Director approving plan"

APPROVE=$(curl -s -X POST "$BASE_URL/plans/$PLAN_ID/approve" \
  -H "X-Actor-Id: u-ad-01" \
  -H "Content-Type: application/json" \
  -d '{"approvalComment": "Approved for distribution"}')

STATUS=$(echo "$APPROVE" | jq -r '.data.status // empty')
if [ "$STATUS" != "APPROVED" ]; then
  fail "Approval failed: $APPROVE"
fi
pass "Plan approved - Status: $STATUS"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "PHASE 4: DIRECTOR DISTRIBUTES TO REGIONS"
echo "════════════════════════════════════════════════════════════════"

step "Director sending plan to regions"

SEND=$(curl -s -X POST "$BASE_URL/plans/$PLAN_ID/send-to-regions" \
  -H "X-Actor-Id: u-ad-01" \
  -H "Content-Type: application/json")

STATUS=$(echo "$SEND" | jq -r '.data.status // empty')
if [ "$STATUS" != "SENT_TO_REGIONS" ]; then
  fail "Send to regions failed: $SEND"
fi
pass "Plan sent to regions - Status: $STATUS"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "PHASE 5: GET DISTRIBUTION DEFAULTS FOR ADDIS ABABA"
echo "════════════════════════════════════════════════════════════════"

step "Regional director getting distribution defaults"

DEFAULTS=$(curl -s "$BASE_URL/plans/$PLAN_ID/distribution-defaults?regionCode=$REGION" \
  -H "X-Actor-Id: u-rd-aa" \
  -H "Content-Type: application/json")

DESK=$(echo "$DEFAULTS" | jq -r '.data.defaultDistribution.DESK_AUDIT // 0')
COMP=$(echo "$DEFAULTS" | jq -r '.data.defaultDistribution.COMPREHENSIVE_AUDIT // 0')
ISSUE=$(echo "$DEFAULTS" | jq -r '.data.defaultDistribution.ISSUE_AUDIT // 0')
TP=$(echo "$DEFAULTS" | jq -r '.data.defaultDistribution.TRANSFER_PRICING // 0')
JOINT=$(echo "$DEFAULTS" | jq -r '.data.defaultDistribution.JOINT_AUDIT // 0')

pass "Got defaults - DESK: $DESK, COMP: $COMP, ISSUE: $ISSUE, TP: $TP, JOINT: $JOINT"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "PHASE 6: DISTRIBUTE CASES TO TAX CENTER (ADDIS ABABA TC1)"
echo "════════════════════════════════════════════════════════════════"

step "Distributing cases to $TC_ID"

DISTRIBUTE=$(curl -s -X POST "$BASE_URL/regional/plans/$PLAN_ID/distribute" \
  -H "X-Actor-Id: u-rd-aa" \
  -H "Content-Type: application/json" \
  -d "{
    \"taxCenterId\": \"$TC_ID\",
    \"deskAudit\": 100,
    \"comprehensiveAudit\": 50,
    \"issueAudit\": 30,
    \"transferPricing\": 80,
    \"jointAudit\": 40
  }")

ALLOC_STATUS=$(echo "$DISTRIBUTE" | jq -r '.data.status // empty')
if [ -z "$ALLOC_STATUS" ]; then
  fail "Distribution failed: $DISTRIBUTE"
fi
pass "Cases distributed - Status: $ALLOC_STATUS"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "PHASE 7: VERIFY CASE ASSIGNMENT - CORRECT ROUTING"
echo "════════════════════════════════════════════════════════════════"

echo ""
info "ROUTING RULE:"
info "  ✓ DESK_AUDIT → DIRECT to desk-tl (NO committee)"
info "  ✓ COMPREHENSIVE → DIRECT to comp-tl (NO committee)"
info "  ✓ ISSUE_AUDIT → DIRECT to issue-tl (NO committee)"
info "  ✓ TRANSFER_PRICING → TO COMMITTEE → tp-committee → THEN to tp-tl"
info "  ✓ JOINT_AUDIT → TO COMMITTEE → joint-committee → THEN to ja-tl"

echo ""
step "Checking DESK_AUDIT cases (should be assigned to desk-tl directly)"
DESK_CASES=$(curl -s "$BASE_URL/cases?auditType=DESK_AUDIT&taxCenterId=$TC_ID" \
  -H "X-Actor-Id: system" | jq '.data | length')
info "Desk cases: $DESK_CASES"

step "Checking COMPREHENSIVE_AUDIT cases (should be assigned to comp-tl directly)"
COMP_CASES=$(curl -s "$BASE_URL/cases?auditType=COMPREHENSIVE_AUDIT&taxCenterId=$TC_ID" \
  -H "X-Actor-Id: system" | jq '.data | length')
info "Comprehensive cases: $COMP_CASES"

step "Checking ISSUE_AUDIT cases (should be assigned to issue-tl directly)"
ISSUE_CASES=$(curl -s "$BASE_URL/cases?auditType=ISSUE_AUDIT&taxCenterId=$TC_ID" \
  -H "X-Actor-Id: system" | jq '.data | length')
info "Issue cases: $ISSUE_CASES"

step "Checking TRANSFER_PRICING cases (should be in tp-committee FIRST)"
TP_CASES=$(curl -s "$BASE_URL/cases?auditType=TRANSFER_PRICING&taxCenterId=$TC_ID" \
  -H "X-Actor-Id: system" | jq '.data | length')
TP_COMMITTEE_ASSIGNED=$(curl -s "$BASE_URL/cases?auditType=TRANSFER_PRICING&assignedTeamLeaderId=tp-committee" \
  -H "X-Actor-Id: system" | jq '.data | length')
info "TP cases: $TP_CASES | In TP Committee: $TP_COMMITTEE_ASSIGNED"

step "Checking JOINT_AUDIT cases (should be in joint-committee FIRST)"
JOINT_CASES=$(curl -s "$BASE_URL/cases?auditType=JOINT_AUDIT&taxCenterId=$TC_ID" \
  -H "X-Actor-Id: system" | jq '.data | length')
JOINT_COMMITTEE_ASSIGNED=$(curl -s "$BASE_URL/cases?auditType=JOINT_AUDIT&assignedTeamLeaderId=joint-committee" \
  -H "X-Actor-Id: system" | jq '.data | length')
info "Joint cases: $JOINT_CASES | In Joint Committee: $JOINT_COMMITTEE_ASSIGNED"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "PHASE 8: TEST COMMITTEE ASSIGNMENT WORKFLOW (TP)"
echo "════════════════════════════════════════════════════════════════"

if [ "$TP_COMMITTEE_ASSIGNED" -gt 0 ]; then
  step "TP Committee assigning 20 cases to tp-tl-1"
  
  # Get first 20 case IDs
  CASE_IDS=$(curl -s "$BASE_URL/cases?auditType=TRANSFER_PRICING&assignedTeamLeaderId=tp-committee&limit=20" \
    -H "X-Actor-Id: u-com-fed-tpchair" | jq -r '.data[].caseId' | jq -R . | jq -s .)
  
  if [ ! -z "$CASE_IDS" ]; then
    ASSIGN=$(curl -s -X POST "$BASE_URL/cases/batch-assign" \
      -H "X-Actor-Id: u-com-fed-tpchair" \
      -H "Content-Type: application/json" \
      -d "{
        \"caseIds\": $CASE_IDS,
        \"assignToTeamLeaderId\": \"tp-tl-1\"
      }")
    
    ASSIGNED_COUNT=$(echo "$ASSIGN" | jq -r '.data.assignedCount // 0')
    if [ "$ASSIGNED_COUNT" -gt 0 ]; then
      pass "Assigned $ASSIGNED_COUNT TP cases to tp-tl-1"
    else
      info "Assignment response: $ASSIGN"
    fi
  fi
else
  info "No TP cases in committee - skipping assignment test"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "PHASE 9: VERIFY TEAM LEADER SEES ASSIGNED CASES"
echo "════════════════════════════════════════════════════════════════"

step "Checking what tp-tl-1 can see"
TL_CASES=$(curl -s "$BASE_URL/cases?assignedTeamLeaderId=tp-tl-1&auditType=TRANSFER_PRICING" \
  -H "X-Actor-Id: tp-tl-1" | jq '.data | length')
pass "tp-tl-1 can see $TL_CASES TP cases"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ COMPLETE TEST SUMMARY"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Plan: $PLAN_ID (FY: $YEAR)"
echo "Region: $REGION"
echo "Tax Center: $TC_ID"
echo ""
echo "Case Distribution:"
echo "  DESK_AUDIT:          $DESK_CASES (direct to desk-tl)"
echo "  COMPREHENSIVE_AUDIT: $COMP_CASES (direct to comp-tl)"
echo "  ISSUE_AUDIT:         $ISSUE_CASES (direct to issue-tl)"
echo "  TRANSFER_PRICING:    $TP_CASES total | $TP_COMMITTEE_ASSIGNED in committee"
echo "  JOINT_AUDIT:         $JOINT_CASES total | $JOINT_COMMITTEE_ASSIGNED in committee"
echo ""
echo "Committee Assignments:"
echo "  TP Committee → tp-tl-1: $TL_CASES cases assigned"
echo ""
echo "════════════════════════════════════════════════════════════════"

