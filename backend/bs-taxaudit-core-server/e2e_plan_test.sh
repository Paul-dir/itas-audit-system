#!/bin/bash
set -e

TC_MANAGER_ID="ea98b797-7c70-4714-9b86-cac2a51c52f7"
COMM_ID="122ef0ec-5113-4e1b-898f-d222607f0ae8"
TL_ID="e65f3ab3-d358-40dc-bb70-a9fcc615bb6c"
AUD_ID="92334ae1-48e9-4864-acdd-d37bb3057462"

echo "[0] Fixing DB Schema..."
PGPASSWORD=dev_password psql -h localhost -p 5432 -U itas_dev -d itas_audit -c "ALTER TABLE ap_audit_cases ALTER COLUMN case_number TYPE varchar(64);"

echo "[1] Cleaning up existing plans..."
PGPASSWORD=dev_password psql -h localhost -p 5432 -U itas_dev -d itas_audit -c "TRUNCATE ap_annual_audit_plans, ap_audit_cases CASCADE;"

echo "[2] Creating Plan..."
CREATE_RESP=$(curl -s -X POST http://localhost:8080/api/v1/backoffice/ap/plans/workflow \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: national-process-owner" \
  -d '{
    "planYear": 2026,
    "planName": "2026 Federal End-to-End Audit Plan",
    "estimatedRevenue": 150000000,
    "regionalAllocations": [
        {"regionCode": "FEDERAL", "proposedCount": 200},
        {"regionCode": "AA", "proposedCount": 100}
    ],
    "distribution": {
        "FEDERAL": {
            "TRANSFER_PRICING": 20,
            "JOINT_AUDIT": 30,
            "DESK_AUDIT": 150
        }
    }
}')

PLAN_ID=$(echo $CREATE_RESP | jq -r '.id')
echo "Plan ID: $PLAN_ID"

if [ "$PLAN_ID" == "null" ] || [ -z "$PLAN_ID" ]; then
    echo "Failed to create plan: $CREATE_RESP"
    exit 1
fi

echo "[3] Submit to Director"
curl -s -X POST http://localhost:8080/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/submit-to-director \
  -H "X-Actor-Id: national-process-owner"

echo "[4] Approve by Director"
curl -s -X POST http://localhost:8080/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/approve-by-director \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: national-director" \
  -d '{"reason": "Looks good"}'

echo "[5] Submit to Regional"
curl -s -X POST http://localhost:8080/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/submit-to-regional \
  -H "X-Actor-Id: national-process-owner"

echo "[6] Approve by Regional (Federal)"
curl -s -X POST http://localhost:8080/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/approve-by-regional \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: fed-director" \
  -d '{"reason": "Approved for Federal LTO"}'

echo "[7] Divide Allocations (Send to Tax Centers)"
curl -s -X POST http://localhost:8080/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/divide-allocations \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: fed-director" \
  -d '{
    "regionCode": "FEDERAL",
    "taxCenterAllocations": [
        {"taxCenterCode": "federal-lto1", "auditCount": 200}
    ]
}'

echo "[8] Send to Tax Centers"
curl -s -X POST http://localhost:8080/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/send-to-tax-centers \
  -H "X-Actor-Id: fed-director"

echo "[9] Tax Center Feedback"
curl -s -X POST http://localhost:8080/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/tax-centers/federal-lto1/feedback \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $TC_MANAGER_ID" \
  -d '{
    "adjustedCount": 200,
    "notes": "We can handle 200 audits."
}'

echo "[10] Mark Feedback Complete"
curl -s -X POST http://localhost:8080/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/mark-feedback-complete \
  -H "X-Actor-Id: fed-director"

echo "[11] Finalize Plan"
curl -s -X POST http://localhost:8080/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/finalize \
  -H "X-Actor-Id: national-director"

echo "[12] Cascade Plan to Cases"
curl -s -X POST http://localhost:8080/api/v1/backoffice/ap/plans/$PLAN_ID/cascade-to-cases \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: fed-director" \
  -d '{"auditTypes": ["TRANSFER_PRICING", "JOINT_AUDIT", "DESK_AUDIT"]}'

echo "Waiting a few seconds for async cascading..."
sleep 5

echo "[13] Fetching a Transfer Pricing Case from federal-lto1..."
CASES_RESP=$(curl -s "http://localhost:8080/api/v1/backoffice/ap/cases?taxCenter=federal-lto1" \
  -H "X-Actor-Id: $TC_MANAGER_ID")

CASE_ID=$(echo $CASES_RESP | jq -r '.data | map(select(.auditType == "TRANSFER_PRICING")) | .[0].caseId')
echo "Selected Case ID: $CASE_ID"

if [ "$CASE_ID" == "null" ] || [ -z "$CASE_ID" ]; then
    echo "Failed to fetch a TP case."
    exit 1
fi

echo "[14] Assign to Committee"
curl -s -X POST "http://localhost:8080/api/v1/backoffice/ap/cases/$CASE_ID/assign?committeeId=$COMM_ID&notes=Assigned%20to%20Committee" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $TC_MANAGER_ID" \
  -d '{}'

echo "[15] Assign from Committee to Team Leader"
curl -s -X POST "http://localhost:8080/api/v1/backoffice/ap/cases/$CASE_ID/assign?teamLeaderId=$TL_ID&notes=Assigned%20to%20TL" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $COMM_ID" \
  -d '{}'

echo "[16] Assign from Team Leader to Auditor"
curl -s -X POST "http://localhost:8080/api/v1/backoffice/ap/cases/$CASE_ID/assign?auditorId=$AUD_ID&notes=Assigned%20to%20Auditor" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $TL_ID" \
  -d '{}'

echo "[17] Starting TP Process (Phase 1)"
curl -s -X POST "http://localhost:8080/api/v1/backoffice/tp/cases/$CASE_ID/start-execution" \
  -H "X-Actor-Id: $AUD_ID"

echo "[18] Proceeding to Phase 2 (Working Hypothesis)"
curl -s -X POST "http://localhost:8080/api/v1/backoffice/tp/cases/$CASE_ID/advance-phase" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $TL_ID" \
  -d '{"targetPhase": "WORKING_HYPOTHESIS"}'

echo "E2E Test Completed successfully!"
