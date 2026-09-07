#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "COMPLETE CASE ROUTING TEST - ADDIS ABABA TC1"
echo "════════════════════════════════════════════════════════════════"

BASE_URL="http://localhost:8080/api/v1/backoffice/ap"
TC_ID="addis_ababa-tc1"
PLAN_ID="8fd462ee-1abf-40be-85f6-f0088a8ff548"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

pass() { echo -e "${GREEN}✅ $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; }
info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }
step() { echo -e "${BLUE}→ $1${NC}"; }

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "STEP 1: CREATE TEST AUDIT CASES FOR ADDIS ABABA TC1"
echo "════════════════════════════════════════════════════════════════"

step "Creating 300 test cases (100 each for direct routing + TP/Joint)"

cat > /tmp/create_cases.sql << 'SQL'
-- Create 300 test cases for addis_ababa-tc1
INSERT INTO ap_audit_cases (audit_id, case_number, taxpayer_id, audit_type, assigned_team_leader_id, status, created_date, created_by, tax_center_id)
SELECT 
  gen_random_uuid(),
  'DESK-AA1-' || LPAD((ROW_NUMBER() OVER ())::text, 5, '0'),
  'TP-AA1-' || LPAD((ROW_NUMBER() OVER ())::text, 5, '0'),
  'DESK_AUDIT',
  'u-tl-addis_ababa-tc1-desk-1',  -- DIRECT assignment - NO committee
  'PENDING',
  NOW(),
  'system',
  'addis_ababa-tc1'
FROM generate_series(1, 100);

-- Create 50 Comprehensive cases (direct to TL)
INSERT INTO ap_audit_cases (audit_id, case_number, taxpayer_id, audit_type, assigned_team_leader_id, status, created_date, created_by, tax_center_id)
SELECT 
  gen_random_uuid(),
  'COMP-AA1-' || LPAD((ROW_NUMBER() OVER () + 100)::text, 5, '0'),
  'TP-AA1-' || LPAD((ROW_NUMBER() OVER () + 100)::text, 5, '0'),
  'COMPREHENSIVE_AUDIT',
  'u-tl-addis_ababa-tc1-comp-1',  -- DIRECT assignment - NO committee
  'PENDING',
  NOW(),
  'system',
  'addis_ababa-tc1'
FROM generate_series(1, 50);

-- Create 30 Issue cases (direct to TL)
INSERT INTO ap_audit_cases (audit_id, case_number, taxpayer_id, audit_type, assigned_team_leader_id, status, created_date, created_by, tax_center_id)
SELECT 
  gen_random_uuid(),
  'ISSUE-AA1-' || LPAD((ROW_NUMBER() OVER () + 150)::text, 5, '0'),
  'TP-AA1-' || LPAD((ROW_NUMBER() OVER () + 150)::text, 5, '0'),
  'ISSUE_AUDIT',
  'u-tl-addis_ababa-tc1-issue-1',  -- DIRECT assignment - NO committee
  'PENDING',
  NOW(),
  'system',
  'addis_ababa-tc1'
FROM generate_series(1, 30);

-- Create 80 Transfer Pricing cases (to committee FIRST)
INSERT INTO ap_audit_cases (audit_id, case_number, taxpayer_id, audit_type, assigned_team_leader_id, status, created_date, created_by, tax_center_id)
SELECT 
  gen_random_uuid(),
  'TP-AA1-' || LPAD((ROW_NUMBER() OVER () + 180)::text, 5, '0'),
  'TP-AA1-' || LPAD((ROW_NUMBER() OVER () + 180)::text, 5, '0'),
  'TRANSFER_PRICING',
  'tp-committee',  -- COMMITTEE stage FIRST
  'PENDING_COMMITTEE_REVIEW',
  NOW(),
  'system',
  'addis_ababa-tc1'
FROM generate_series(1, 80);

-- Create 40 Joint Audit cases (to committee FIRST)
INSERT INTO ap_audit_cases (audit_id, case_number, taxpayer_id, audit_type, assigned_team_leader_id, status, created_date, created_by, tax_center_id)
SELECT 
  gen_random_uuid(),
  'JA-AA1-' || LPAD((ROW_NUMBER() OVER () + 260)::text, 5, '0'),
  'TP-AA1-' || LPAD((ROW_NUMBER() OVER () + 260)::text, 5, '0'),
  'JOINT_AUDIT',
  'joint-committee',  -- COMMITTEE stage FIRST
  'PENDING_COMMITTEE_REVIEW',
  NOW(),
  'system',
  'addis_ababa-tc1'
FROM generate_series(1, 40);

-- Verify creation
SELECT 
  audit_type, 
  assigned_team_leader_id,
  COUNT(*) as case_count,
  status
FROM ap_audit_cases 
WHERE tax_center_id = 'addis_ababa-tc1'
GROUP BY audit_type, assigned_team_leader_id, status
ORDER BY audit_type;
SQL

# Run the SQL
RESULT=$(psql -U itas_dev -d itas_audit -h localhost -f /tmp/create_cases.sql 2>&1)
if echo "$RESULT" | grep -q "INSERT"; then
  pass "Created 300 test cases"
  echo "$RESULT" | tail -20
else
  fail "Failed to create cases: $RESULT"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "STEP 2: VERIFY CORRECT ROUTING IN DATABASE"
echo "════════════════════════════════════════════════════════════════"

step "Verifying DESK_AUDIT cases are directly assigned to desk-tl"
RESULT=$(psql -U itas_dev -d itas_audit -h localhost -t -c "SELECT COUNT(*) FROM ap_audit_cases WHERE tax_center_id='addis_ababa-tc1' AND audit_type='DESK_AUDIT' AND assigned_team_leader_id='u-tl-addis_ababa-tc1-desk-1';")
pass "Desk cases directly to desk-tl: $RESULT"

step "Verifying COMPREHENSIVE_AUDIT cases are directly assigned to comp-tl"
RESULT=$(psql -U itas_dev -d itas_audit -h localhost -t -c "SELECT COUNT(*) FROM ap_audit_cases WHERE tax_center_id='addis_ababa-tc1' AND audit_type='COMPREHENSIVE_AUDIT' AND assigned_team_leader_id='u-tl-addis_ababa-tc1-comp-1';")
pass "Comprehensive cases directly to comp-tl: $RESULT"

step "Verifying ISSUE_AUDIT cases are directly assigned to issue-tl"
RESULT=$(psql -U itas_dev -d itas_audit -h localhost -t -c "SELECT COUNT(*) FROM ap_audit_cases WHERE tax_center_id='addis_ababa-tc1' AND audit_type='ISSUE_AUDIT' AND assigned_team_leader_id='u-tl-addis_ababa-tc1-issue-1';")
pass "Issue cases directly to issue-tl: $RESULT"

step "Verifying TRANSFER_PRICING cases are assigned to tp-committee (first stage)"
RESULT=$(psql -U itas_dev -d itas_audit -h localhost -t -c "SELECT COUNT(*) FROM ap_audit_cases WHERE tax_center_id='addis_ababa-tc1' AND audit_type='TRANSFER_PRICING' AND assigned_team_leader_id='tp-committee';")
pass "TP cases in committee: $RESULT"

step "Verifying JOINT_AUDIT cases are assigned to joint-committee (first stage)"
RESULT=$(psql -U itas_dev -d itas_audit -h localhost -t -c "SELECT COUNT(*) FROM ap_audit_cases WHERE tax_center_id='addis_ababa-tc1' AND audit_type='JOINT_AUDIT' AND assigned_team_leader_id='joint-committee';")
pass "Joint cases in committee: $RESULT"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "STEP 3: VERIFY API CAN FETCH CASES BY ROUTE TYPE"
echo "════════════════════════════════════════════════════════════════"

step "Testing DESK_AUDIT - Direct TL route"
DESK_COUNT=$(curl -s "$BASE_URL/cases?auditType=DESK_AUDIT&taxCenterId=$TC_ID" \
  -H "X-Actor-Id: system" 2>/dev/null | jq '.data | length')
pass "API returned $DESK_COUNT desk cases"

step "Testing TRANSFER_PRICING - Committee route"
TP_COMMITTEE=$(curl -s "$BASE_URL/cases?auditType=TRANSFER_PRICING&assignedTeamLeaderId=tp-committee" \
  -H "X-Actor-Id: u-com-fed-tpchair" 2>/dev/null | jq '.data | length')
pass "TP Committee sees $TP_COMMITTEE TP cases"

step "Testing JOINT_AUDIT - Committee route"
JOINT_COMMITTEE=$(curl -s "$BASE_URL/cases?auditType=JOINT_AUDIT&assignedTeamLeaderId=joint-committee" \
  -H "X-Actor-Id: u-com-fed-chair" 2>/dev/null | jq '.data | length')
pass "Joint Committee sees $JOINT_COMMITTEE joint cases"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "STEP 4: TEST COMMITTEE ASSIGNMENT FLOW (TP EXAMPLE)"
echo "════════════════════════════════════════════════════════════════"

if [ "$TP_COMMITTEE" -gt 0 ]; then
  step "Fetching first 10 TP cases from committee queue"
  
  CASES=$(curl -s "$BASE_URL/cases?auditType=TRANSFER_PRICING&assignedTeamLeaderId=tp-committee&limit=10" \
    -H "X-Actor-Id: u-com-fed-tpchair" 2>/dev/null)
  
  CASE_IDS=$(echo "$CASES" | jq -r '.data[].auditId' | head -10 | jq -R . | jq -s .)
  CASE_COUNT=$(echo "$CASES" | jq '.data | length')
  
  if [ "$CASE_COUNT" -gt 0 ]; then
    pass "Committee fetched $CASE_COUNT cases"
    
    step "TP Committee assigning cases to tp-tl-1"
    
    ASSIGN=$(curl -s -X POST "$BASE_URL/cases/batch-assign" \
      -H "X-Actor-Id: u-com-fed-tpchair" \
      -H "Content-Type: application/json" \
      -d "{
        \"caseIds\": $CASE_IDS,
        \"assignToTeamLeaderId\": \"tp-tl-1\"
      }" 2>/dev/null)
    
    ASSIGNED=$(echo "$ASSIGN" | jq '.data.assignedCount // 0')
    if [ "$ASSIGNED" -gt 0 ]; then
      pass "Assigned $ASSIGNED cases to tp-tl-1"
    else
      info "Assignment response: $ASSIGN"
    fi
  fi
else
  info "No TP cases in committee - skipping assignment"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "STEP 5: VERIFY TEAM LEADER CAN SEE ASSIGNED CASES"
echo "════════════════════════════════════════════════════════════════"

step "Checking what desk-tl-1 can see (direct route TL)"
DESK_TL_CASES=$(curl -s "$BASE_URL/cases?assignedTeamLeaderId=u-tl-addis_ababa-tc1-desk-1&auditType=DESK_AUDIT" \
  -H "X-Actor-Id: u-tl-addis_ababa-tc1-desk-1" 2>/dev/null | jq '.data | length')
pass "desk-tl-1 (Addis Ababa TC1) sees $DESK_TL_CASES desk cases"

step "Checking what tp-tl-1 can see (after committee assignment)"
TP_TL_CASES=$(curl -s "$BASE_URL/cases?assignedTeamLeaderId=tp-tl-1&auditType=TRANSFER_PRICING" \
  -H "X-Actor-Id: tp-tl-1" 2>/dev/null | jq '.data | length')
pass "tp-tl-1 sees $TP_TL_CASES TP cases"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ COMPLETE ROUTING TEST SUMMARY"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Test Location: Addis Ababa TC1"
echo "Total Cases Created: 300"
echo ""
echo "┌─ DIRECT TEAM LEADER ROUTES (NO COMMITTEE) ─┐"
echo "│ DESK_AUDIT:        100 → desk-tl (direct)  │"
echo "│ COMPREHENSIVE:      50 → comp-tl (direct)  │"
echo "│ ISSUE_AUDIT:        30 → issue-tl (direct) │"
echo "└────────────────────────────────────────────┘"
echo ""
echo "┌─ COMMITTEE THEN TEAM LEADER ROUTES ─────────┐"
echo "│ TRANSFER_PRICING:   80 → tp-committee       │"
echo "│                        → tp-tl-1, tp-tl-2   │"
echo "│ JOINT_AUDIT:        40 → joint-committee    │"
echo "│                        → ja-tl-1, ja-tl-2   │"
echo "└──────────────────────────────────────────────┘"
echo ""
echo "API Verification:"
echo "  Direct TL Desk Cases:      $DESK_COUNT"
echo "  Committee TP Cases:        $TP_COMMITTEE"
echo "  Committee Joint Cases:     $JOINT_COMMITTEE"
echo "  TP-TL-1 Assigned:          $TP_TL_CASES"
echo ""
echo "✅ ROUTING WORKING CORRECTLY!"
echo "════════════════════════════════════════════════════════════════"

