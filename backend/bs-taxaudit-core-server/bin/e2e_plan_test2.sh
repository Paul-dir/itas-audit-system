#!/bin/bash
set -e

TC_MANAGER_ID="ea98b797-7c70-4714-9b86-cac2a51c52f7"
COMM_ID="122ef0ec-5113-4e1b-898f-d222607f0ae8"
TL_ID="e65f3ab3-d358-40dc-bb70-a9fcc615bb6c"
AUD_ID="92334ae1-48e9-4864-acdd-d37bb3057462"

echo "[13] Fetching a Transfer Pricing Case from federal-lto1..."
CASES_RESP=$(curl -s "http://localhost:8080/api/v1/backoffice/ap/cases?taxCenter=federal-lto1" \
  -H "X-Actor-Id: $TC_MANAGER_ID")

CASE_ID=$(echo $CASES_RESP | jq -r '.data | map(select(.auditType == "TRANSFER_PRICING")) | .[0].id')
echo "Selected Case ID: $CASE_ID"

if [ "$CASE_ID" == "null" ] || [ -z "$CASE_ID" ]; then
    echo "Failed to fetch a TP case."
    exit 1
fi

echo -e "\n[14] (Skipped) TP cases are automatically assigned to Committee by the engine."

echo -e "\n[15] Assign from Committee to Team Leader"
curl -s -X POST "http://localhost:8080/api/v1/backoffice/ap/cases/$CASE_ID/assign-team-leader" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $COMM_ID" \
  -d "{\"teamLeaderId\": \"$TL_ID\", \"notes\": \"Assigned to TL\"}"

echo -e "\n[16] Assign from Team Leader to Auditor"
curl -s -X POST "http://localhost:8080/api/v1/backoffice/ap/cases/$CASE_ID/assign-auditor" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $TL_ID" \
  -d "{\"auditorId\": \"$AUD_ID\", \"notes\": \"Assigned to Auditor\"}"

echo -e "\n[17] Starting TP Process (Phase 1) - Risk Assessment"
curl -s -X POST "http://localhost:8080/api/v1/backoffice/tp/cases/$CASE_ID/risk-assessment" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUD_ID" \
  -d '{
    "riskLevel": "HIGH",
    "riskDetails": "High related party transactions observed.",
    "comments": "Automated test insertion."
  }'

echo -e "\n[18] Proceeding to Phase 2 - Working Hypothesis"
curl -s -X POST "http://localhost:8080/api/v1/backoffice/tp/cases/$CASE_ID/working-hypothesis" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUD_ID" \
  -d '{
    "hypothesisDescription": "Management fees are likely overstated.",
    "identifiedIssue": "Management Fees",
    "economicRationale": "No actual services rendered.",
    "revenueAtRisk": 25000000.00,
    "calculationDetails": {"method": "CUP", "margin": 0.05}
  }'

echo -e "\n[19] Proceeding to Phase 3 - Audit Plan"
curl -s -X POST "http://localhost:8080/api/v1/backoffice/tp/cases/$CASE_ID/audit-plan" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUD_ID" \
  -d '{
    "scopeOfAudit": "FY2023",
    "auditObjectives": "Verify arms length nature of management fees.",
    "timeline": "6 months",
    "resourceRequirements": "2 auditors"
  }'

echo -e "\nE2E Test Completed successfully!"
