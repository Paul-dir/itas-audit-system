#!/bin/bash
set -e

BASE_URL="http://localhost:8080/api/v1/backoffice"
YEAR="2027"

echo "=== 1. Create AP Plan ==="
CREATE_RES=$(curl -s -X POST "$BASE_URL/ap/plans/workflow" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: u-po-aa1" \
  -d '{
    "planYear": "'$YEAR'",
    "planName": "Annual Audit Plan '$YEAR'",
    "distribution": {"TRANSFER_PRICING": 50, "COMPREHENSIVE": 100},
    "regionalAllocations": [{"regionCode": "AA", "proposedCount": 150}],
    "estimatedRevenue": 50000000
  }')
PLAN_ID=$(echo $CREATE_RES | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Plan ID: $PLAN_ID"

echo "=== 2. Submit to Director ==="
curl -s -X POST "$BASE_URL/ap/plans/workflow/$PLAN_ID/submit-to-director" -H "X-Actor-Id: u-po-aa1" > /dev/null

echo "=== 3. Approve by Director ==="
curl -s -X POST "$BASE_URL/ap/plans/workflow/$PLAN_ID/approve-by-director" -H "Content-Type: application/json" -H "X-Actor-Id: u-dir" -d '{"reason":"Approved for '$YEAR'"}' > /dev/null

echo "=== 4. Submit to Regional ==="
curl -s -X POST "$BASE_URL/ap/plans/workflow/$PLAN_ID/submit-to-regional" -H "X-Actor-Id: u-dir" > /dev/null

echo "=== 5. Approve by Regional ==="
curl -s -X POST "$BASE_URL/ap/plans/workflow/$PLAN_ID/approve-by-regional" -H "Content-Type: application/json" -H "X-Actor-Id: u-reg-aa" -d '{"reason":"Regional Approved"}' > /dev/null

echo "=== 6. Divide Allocations ==="
curl -s -X POST "$BASE_URL/ap/plans/workflow/$PLAN_ID/divide-allocations" -H "Content-Type: application/json" -H "X-Actor-Id: u-reg-aa" -d '{
  "regionCode": "AA",
  "taxCenterAllocations": [{"taxCenterCode": "TC-AA-01", "auditCount": 150}]
}' > /dev/null

echo "=== 7. Tax Center Feedback ==="
curl -s -X PATCH "$BASE_URL/ap/plans/workflow/$PLAN_ID/allocations/TC-AA-01/feedback" -H "Content-Type: application/json" -H "X-Actor-Id: u-tc-aa1" -d '{"adjustedCount":150, "justification":"Capacity confirmed"}' > /dev/null

echo "=== 8. Mark Feedback Complete & Finalize ==="
curl -s -X POST "$BASE_URL/ap/plans/workflow/$PLAN_ID/mark-feedback-complete" -H "X-Actor-Id: u-dir" > /dev/null
curl -s -X POST "$BASE_URL/ap/plans/workflow/$PLAN_ID/finalize" -H "X-Actor-Id: u-dir" > /dev/null

echo "=== 9. Get Cascaded Cases ==="
CASES_RES=$(curl -s "$BASE_URL/ap/cases?taxCenter=TC-AA-01" -H "X-Actor-Id: u-tc-aa1")
CASE_ID=$(echo $CASES_RES | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Got Case ID: $CASE_ID"

echo "=== 10. Assign Team Leader & Auditor ==="
curl -s -X POST "$BASE_URL/ap/cases/$CASE_ID/assign-team-leader" -H "Content-Type: application/json" -H "X-Actor-Id: u-tc-aa1" -d '{"teamLeaderId":"tp.committee1"}' > /dev/null
curl -s -X POST "$BASE_URL/ap/cases/$CASE_ID/assign-auditor" -H "Content-Type: application/json" -H "X-Actor-Id: tp.committee1" -d '{"auditorId":"tp.auditor1"}' > /dev/null

echo "=== 11. TP Phase 1: Risk Assessment ==="
curl -s -X POST "$BASE_URL/tp/cases/$CASE_ID/risk-assessment" -H "Content-Type: application/json" -H "X-Actor-Id: tp.auditor1" -d '{"riskLevel":"HIGH","riskDetails":"E2E Test","comments":"Test"}' > /dev/null

echo "=== 12. TP Phase 2: Working Hypothesis ==="
curl -s -X POST "$BASE_URL/tp/cases/$CASE_ID/working-hypothesis" -H "Content-Type: application/json" -H "X-Actor-Id: tp.committee1" -d '{"hypothesisDescription":"E2E","identifiedIssue":"Issue","economicRationale":"Rationale","revenueAtRisk":1000000,"calculationDetails":"Calc"}' > /dev/null

echo "=== 13. TP Phase 5: Draft Report ==="
REPORT_RES=$(curl -s -X POST "$BASE_URL/tp/cases/$CASE_ID/report/draft" -H "Content-Type: application/json" -H "X-Actor-Id: tp.auditor1" -d '{"executiveSummary":"Exec Summary","auditBackground":"BG","scope":"Scope","proceduresPerformed":"Procs","findingsAndConclusions":"Findings","issuesAnalyzed":"Issues","complianceAssessment":"Compliant"}')
REPORT_ID=$(echo $REPORT_RES | tr -d '"')
echo "Report ID: $REPORT_ID"

echo "=== E2E Test Completed Successfully! ==="
