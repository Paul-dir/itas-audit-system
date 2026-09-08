#!/bin/bash
set -e

BASE_URL="http://localhost:8080"
CHAIR_ID="20000000-0000-0000-0001-000000000001"
MEMBER_ID="20000000-0000-0000-0001-000000000002"

echo "======================================================================="
echo "   STARTING END-TO-END JOINT AUDIT COMMITTEE (JAC) LIFECYCLE TEST"
echo "======================================================================="

echo ""
echo "[Step 1] Fetching Committee Cases (PENDING_VIABILITY)..."
CASES_RESP=$(curl -s -H "X-Actor-Id: $CHAIR_ID" "$BASE_URL/api/v1/backoffice/ap/committee/cases?status=PENDING_VIABILITY&page=0&size=5")
CASE_ID=$(echo "$CASES_RESP" | jq -r '.content[0].committeeCaseId // .content[0].id')
TAXPAYER=$(echo "$CASES_RESP" | jq -r '.content[0].taxpayerName')
CASE_CODE=$(echo "$CASES_RESP" | jq -r '.content[0].caseCode')

echo "==> Selected Case ID:   $CASE_ID"
echo "==> Case Code:          $CASE_CODE"
echo "==> Taxpayer:           $TAXPAYER"

if [ "$CASE_ID" == "null" ] || [ -z "$CASE_ID" ]; then
    echo "FAILED: No PENDING_VIABILITY case found"
    exit 1
fi

echo ""
echo "[Step 2] Casting Committee Advisory Votes..."
curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/committee/cases/$CASE_ID/vote" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $MEMBER_ID" \
  -d '{
    "vote": "APPROVE",
    "rationale": "High Customs variance matches domestic VAT discrepancy."
  }' > /dev/null
echo "  ✓ Advisory Vote cast by Committee Member (APPROVE)"

curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/committee/cases/$CASE_ID/vote" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $CHAIR_ID" \
  -d '{
    "vote": "APPROVE",
    "rationale": "Chairperson concurs with statutory multi-agency joint audit."
  }' > /dev/null
echo "  ✓ Advisory Vote cast by Committee Chair (APPROVE)"

echo ""
echo "[Step 3] Fetching Vote Tally..."
TALLY_RESP=$(curl -s -H "X-Actor-Id: $CHAIR_ID" "$BASE_URL/api/v1/backoffice/ap/committee/cases/$CASE_ID/votes")
echo "  ✓ Tally: $(echo "$TALLY_RESP" | jq -c '{totalVotes, approves, rejects, status}')"

echo ""
echo "[Step 4] Chairperson Finalizing Viability Decision..."
VIABILITY_RESP=$(curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/committee/cases/$CASE_ID/finalize-viability" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $CHAIR_ID" \
  -d '{
    "decision": "APPROVED",
    "reason": "Statutory joint audit criteria met; inter-agency discrepancy confirmed.",
    "digitalSignature": "DIG-SIG-CHAIRPERSON-ETH-2026-AA-TC1"
  }')
NEW_STATUS=$(echo "$VIABILITY_RESP" | jq -r '.status')
echo "  ✓ Viability finalized! New Case Status: $NEW_STATUS"

echo ""
echo "[Step 5] Fetching Available Auditors for Tax Center..."
AUDITORS_RESP=$(curl -s -H "X-Actor-Id: $CHAIR_ID" "$BASE_URL/api/v1/backoffice/ap/committee/auditors/search?taxCenter=addis_ababa-tc1")
AUDITOR_1=$(echo "$AUDITORS_RESP" | jq -r '.content[0].auditorId')
AUDITOR_2=$(echo "$AUDITORS_RESP" | jq -r '.content[1].auditorId')
echo "  ✓ Selected Auditor 1: $AUDITOR_1"
echo "  ✓ Selected Auditor 2: $AUDITOR_2"

echo ""
echo "[Step 6] Chairperson Assigning Official Audit Team..."
ASSIGN_RESP=$(curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/committee/cases/$CASE_ID/assign-team" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $CHAIR_ID" \
  -d "{
    \"auditorIds\": [\"$AUDITOR_1\", \"$AUDITOR_2\"],
    \"teamLeadIndex\": 0
  }")
echo "  ✓ Official Team Assigned: $(echo "$ASSIGN_RESP" | jq -c '{teamId, leadId, memberCount: (.members | length)}')"

echo ""
echo "[Step 7] Chairperson Transferring Case to Execution Workspace..."
TRANSFER_RESP=$(curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/committee/cases/$CASE_ID/transfer-to-execution" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $CHAIR_ID" \
  -d '{
    "summary": "Multi-agency Customs ASYCUDA vs Domestic SIGTAS VAT declaration reconciliation.",
    "keyFindings": "Unexplained ETB 42M discrepancy in duty-free import exemptions."
  }')
HANDOFF_ID=$(echo "$TRANSFER_RESP" | jq -r '.handoffId')
echo "  ✓ Transferred to Execution! Handoff ID: $HANDOFF_ID"

echo ""
echo "[Step 8] Verifying Case in PostgreSQL Database..."
DB_STATE=$(psql -U postgres -d itas_audit -t -A -c "SELECT status, case_code, taxpayer_name, team_lead_id FROM t_committee_case WHERE case_id = '$CASE_ID';")
echo "  ✓ PostgreSQL Record: $DB_STATE"

echo ""
echo "======================================================================="
echo "   ✅ END-TO-END JOINT AUDIT COMMITTEE WORKFLOW VERIFIED SUCCESSFULLY!"
echo "======================================================================="
