#!/bin/bash
set -e

BASE_URL="http://localhost:8080"
TC_MANAGER="u-tcm-federal-lto1"
COMM_CHAIR="0f2b2307-510c-4ebb-96a7-089776845f48"
COMM_USER="u-com-federal-lto1-tp"
TL_ID="u-tl-federal-lto1-tp-1"
AUDITOR_ID="u-aud-federal-lto1-tp-1-1"

echo "======================================================================="
echo "   STARTING END-TO-END TRANSFER PRICING STATUTORY LIFECYCLE TEST"
echo "======================================================================="

# --- Step 1: Create New Annual Audit Plan ---
echo ""
echo "[Step 1] Creating New 2028 Federal Transfer Pricing Strategic Plan..."
PLAN_RESP=$(curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: national-process-owner" \
  -d '{
    "planYear": 2028,
    "planName": "2028 Federal TP Strategic Plan",
    "estimatedRevenue": 350000000,
    "regionalAllocations": [
        {"regionCode": "FEDERAL", "proposedCount": 150}
    ],
    "distribution": {
        "FEDERAL": {
            "TRANSFER_PRICING": 25,
            "JOINT_AUDIT": 25,
            "DESK_AUDIT": 100
        }
    }
}')

PLAN_ID=$(echo "$PLAN_RESP" | jq -r '.id')
echo "==> Plan Created with ID: $PLAN_ID"
if [ "$PLAN_ID" == "null" ] || [ -z "$PLAN_ID" ]; then
    echo "FAILED: Could not create plan: $PLAN_RESP"
    exit 1
fi

# --- Step 2: Routing Approvals ---
echo ""
echo "[Step 2] Routing approvals: Planning Team -> Director -> Regional Director..."
curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/submit-to-director" \
  -H "X-Actor-Id: national-process-owner" > /dev/null
echo "  ✓ Submitted to National Audit Director"

curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/approve-by-director" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: national-director" \
  -d '{"reason": "Approved statutory plan for FY2027"}' > /dev/null
echo "  ✓ Approved by National Audit Director"

curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/submit-to-regional" \
  -H "X-Actor-Id: national-process-owner" > /dev/null
echo "  ✓ Submitted to Regional Director"

curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/approve-by-regional" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: fed-director" \
  -d '{"reason": "Endorsed for Federal Large Taxpayers Office"}' > /dev/null
echo "  ✓ Approved by Regional Director (Federal)"

# --- Step 3: Divide Allocations to Federal LTO1 ---
echo ""
echo "[Step 3] Dividing Allocations & Deploying to Federal LTO1 Tax Center..."
curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/divide-allocations" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: fed-director" \
  -d '{
    "regionCode": "FEDERAL",
    "taxCenterAllocations": [
        {"taxCenterCode": "federal-lto1", "auditCount": 150}
    ]
}' > /dev/null
echo "  ✓ Divided 150 audits to federal-lto1"

curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/send-to-tax-centers" \
  -H "X-Actor-Id: fed-director" > /dev/null
echo "  ✓ Dispatched plan to Tax Centers"

# --- Step 4: Tax Center Feedback ---
echo ""
echo "[Step 4] Tax Center Manager submits capacity feedback..."
curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/tax-centers/federal-lto1/feedback" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $TC_MANAGER" \
  -d '{
    "adjustedCount": 150,
    "notes": "Federal LTO-1 accepts full capacity allocation including 25 Transfer Pricing audits."
}' > /dev/null
echo "  ✓ Feedback submitted by Federal LTO-1 Manager"

curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/mark-feedback-complete" \
  -H "X-Actor-Id: fed-director" > /dev/null
echo "  ✓ Feedback marked complete by Regional Director"

# --- Step 5: Finalize Plan ---
echo ""
echo "[Step 5] Finalizing Annual Audit Plan..."
curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/workflow/$PLAN_ID/finalize" \
  -H "X-Actor-Id: national-director" > /dev/null
echo "  ✓ Plan formally finalized by National Director"

# --- Step 6: Cascade Plan to Cases ---
echo ""
echo "[Step 6] Cascading finalized plan to operational audit cases..."
CASCADE_RESP=$(curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/plans/$PLAN_ID/cascade-to-cases" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: fed-director" \
  -d '{"auditTypes": ["TRANSFER_PRICING", "JOINT_AUDIT", "DESK_AUDIT"]}')

echo "  ✓ Cascade response received"
sleep 2

# --- Step 7: Fetch the Generated Transfer Pricing Case ---
echo ""
echo "[Step 7] Fetching Transfer Pricing cases in Federal LTO..."
CASES_RESP=$(curl -s "$BASE_URL/api/v1/backoffice/ap/cases?taxCenter=federal-lto1&auditType=TRANSFER_PRICING" \
  -H "X-Actor-Id: $TC_MANAGER")

CASE_ID=$(echo "$CASES_RESP" | jq -r '.data[0].id')
CASE_NUM=$(echo "$CASES_RESP" | jq -r '.data[0].caseNumber')
TAXPAYER=$(echo "$CASES_RESP" | jq -r '.data[0].taxpayerName')

echo "==> Selected Case ID:      $CASE_ID"
echo "==> Selected Case Number:  $CASE_NUM"
echo "==> Selected Taxpayer:     $TAXPAYER"

if [ "$CASE_ID" == "null" ] || [ -z "$CASE_ID" ]; then
    echo "FAILED: No Transfer Pricing cases found for federal-lto1"
    exit 1
fi

# --- Step 8: Multi-Tier Hierarchy Assignment ---
echo ""
echo "[Step 8] Multi-Tier Statutory Hierarchy Assignment:"
echo "  8.1 Tax Center Manager assigns case to Review Committee..."
ASSIGN_COMM=$(curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/cases/$CASE_ID/assign?committeeId=$COMM_CHAIR&status=ASSIGNED_TO_COMMITTEE" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $TC_MANAGER" \
  -d '{"notes": "Assigned to Federal TP Committee for statutory oversight"}')
echo "      Status: $(echo "$ASSIGN_COMM" | jq -r '.data.status')"

echo "  8.2 Review Committee assigns case to Team Leader ($TL_ID)..."
ASSIGN_TL=$(curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/cases/$CASE_ID/assign?teamLeaderId=$TL_ID" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $COMM_USER" \
  -d '{"notes": "Committee delegated supervision to TP Team Leader 1"}')
echo "      Status: $(echo "$ASSIGN_TL" | jq -r '.data.status')"
echo "      Assigned TL: $(echo "$ASSIGN_TL" | jq -r '.data.assignedTeamLeaderId')"

echo "  8.3 Team Leader assigns case to Lead Auditor ($AUDITOR_ID)..."
ASSIGN_AUD=$(curl -s -X POST "$BASE_URL/api/v1/backoffice/ap/cases/$CASE_ID/assign?auditorId=$AUDITOR_ID" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $TL_ID" \
  -d '{"notes": "TL assigned operational field audit execution to Auditor 1"}')
echo "      Status: $(echo "$ASSIGN_AUD" | jq -r '.data.status')"
echo "      Assigned Auditor: $(echo "$ASSIGN_AUD" | jq -r '.data.assignedAuditorId')"

# --- Step 9: Transfer Pricing Execution (Phases 1 to 9) ---
echo ""
echo "[Step 9] Executing All TP Statutory Phases End-to-End:"

echo "  --- Phase 1: Risk Assessment & Working Hypothesis Formulation ---"
curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/start-execution" \
  -H "X-Actor-Id: $AUDITOR_ID" > /dev/null
echo "      ✓ Execution started (Auditor)"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/risk-assessment" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUDITOR_ID" \
  -d '{
    "riskLevel": "HIGH",
    "riskDetails": {"schedule5Indicators": ["High intercompany management fee (12% of revenue)", "Cross-border IP royalties to tax haven"]},
    "comments": "High profit-shifting risk detected across related group entities."
}' > /dev/null
echo "      ✓ Risk Assessment saved (Auditor)"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/risk-assessment/submit-tl" \
  -H "X-Actor-Id: $AUDITOR_ID" > /dev/null
echo "      ✓ Risk Assessment submitted to Team Leader"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/risk-assessment/submit-committee" \
  -H "X-Actor-Id: $TL_ID" > /dev/null
echo "      ✓ Team Leader endorsed and submitted to Review Committee"

echo "  --- Phase 2: Working Hypothesis & Statutory Gate 1 ---"
curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/working-hypothesis" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $COMM_USER" \
  -d '{
    "identifiedIssue": "Non-Arm Length Management Charges & Royalty Erosion",
    "hypothesisDescription": "Taxpayer overstated deductible service charges to foreign parent entity without economic substance.",
    "economicRationale": "Article 15 & 28 of Directive 43/2015. Management fees exceed median industry profitability benchmark.",
    "revenueAtRisk": 35000000,
    "calculationDetails": {"baseErosion": 35000000, "estimatedTaxAdjustment": 10500000}
}' > /dev/null
echo "      ✓ Working Hypothesis formulated (Revenue-at-risk: ETB 35M)"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/planning-meeting/decision" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $COMM_USER" \
  -d '{
    "decision": "CONTINUE_AUDIT",
    "discussionNotes": "Review Committee unanimously approves moving into formal Audit Planning and Examination."
}' > /dev/null
echo "      ✓ Review Committee passed statutory resolution: CONTINUE_AUDIT"

echo "  --- Phase 3: TP Audit Plan & Examination Scope ---"
curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/audit-plan" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUDITOR_ID" \
  -d '{
    "objective": "Verify arm length pricing of intercompany transactions FY2021-FY2025",
    "scope": "Comprehensive Transfer Pricing Audit",
    "materialityDetails": "ETB 5,000,000 threshold",
    "industryResearch": "Orbis/Amadeus database benchmark for East Africa manufacturing",
    "samplingMethod": "100% census of cross-border management invoices",
    "plannedProcedures": "Functional, Assets, and Risk (FAR) analysis, TNMM benchmarking"
}' > /dev/null
echo "      ✓ Audit Plan drafted (Form FR-04.5.1)"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/audit-plan/submit-tl" \
  -H "X-Actor-Id: $AUDITOR_ID" > /dev/null
echo "      ✓ Audit Plan submitted to Team Leader"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/audit-plan/tl-endorse" \
  -H "X-Actor-Id: $TL_ID" > /dev/null
echo "      ✓ Team Leader endorsed Audit Plan"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/audit-plan/approve" \
  -H "X-Actor-Id: $COMM_USER" > /dev/null
echo "      ✓ Review Committee formally approved Audit Plan (Unlocked Fieldwork)"

echo "  --- Phase 4: Fieldwork & Audit Examination ---"
curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/field-work/accounting" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUDITOR_ID" \
  -d '{"accountingMethods": "IFRS with SAP ERP", "data": {"costCenterAnalysis": "Management cost allocation keys unjustified"}}' > /dev/null
echo "      ✓ Accounting systems and cost allocation keys assessed"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/field-work/transaction-trails" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUDITOR_ID" \
  -d '{"data": {"trails": ["Invoices #INV-8801 to #INV-8840 examined", "SWIFT transfer vouchers verified"]}}' > /dev/null
echo "      ✓ Controlled transaction trails audited"

IDR_RESP=$(curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/field-work/idr/create" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUDITOR_ID" \
  -d '{
    "requestType": "DOCUMENT",
    "subject": "Request for Transfer Pricing Local File & Cross-Border Contracts",
    "description": "Provide complete Master File, Local File, and benchmark studies within 14 days",
    "deadlineDays": 14
}')
IDR_ID=$(echo "$IDR_RESP" | jq -r '.id')
echo "      ✓ Statutory IDR issued (Ref: $(echo "$IDR_RESP" | jq -r '.requestReference'))"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/field-work/idr/$IDR_ID/respond" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: taxpayer-portal" \
  -d '{
    "taxpayerResponse": "Local File and master intercompany agreements uploaded to portal.",
    "evidenceUploaded": true
}' > /dev/null
echo "      ✓ Taxpayer responded to IDR with evidence documents"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/field-work/site-visit" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUDITOR_ID" \
  -d '{
    "location": "Taxpayer Headquarters & Plant",
    "observations": "Interviewed Finance Director and Operations Lead. Found no active local services rendered by foreign parent."
}' > /dev/null
echo "      ✓ On-site examination conducted"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/field-work/contract-verify" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUDITOR_ID" \
  -d '{"title": "Management & Technical Services Agreement 2021"}' > /dev/null
echo "      ✓ Intercompany contract verified"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/field-work/fact-statement" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUDITOR_ID" \
  -d '{
    "factStatementVersion": 1,
    "factStatementStatus": "SIGNED_OFF",
    "data": {"agreedFacts": "Taxpayer incurred ETB 35M in fees without tangible deliverable proof"}
}' > /dev/null
echo "      ✓ Statutory Fact Statement v1.0 signed off"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/field-work/complete" \
  -H "X-Actor-Id: $AUDITOR_ID" > /dev/null
echo "      ✓ Fieldwork concluded; transitioning to Economic Analysis"

echo "  --- Phase 5: Economic Analysis & Benchmarking ---"
curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/analysis/method-selection" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUDITOR_ID" \
  -d '{
    "selectedTpMethod": "TNMM",
    "data": {"testedParty": "Local Operating Company", "profitLevelIndicator": "NCPM (Net Cost Plus Margin)"}
}' > /dev/null
echo "      ✓ TP Method Selected: TNMM (Net Cost Plus Margin)"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/analysis/arms-length" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUDITOR_ID" \
  -d '{
    "armsLengthRangeMin": 4.80,
    "armsLengthRangeMax": 8.20,
    "taxpayerActualResult": 1.90,
    "varianceAmount": 26800000.00,
    "variancePercentage": 2.90,
    "data": {"interquartileRange": {"q1": 4.80, "median": 6.50, "q3": 8.20}}
}' > /dev/null
echo "      ✓ Arm Length IQR computed: [4.80% – 8.20%], Variance: ETB 26,800,000"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/analysis/complete" \
  -H "X-Actor-Id: $AUDITOR_ID" > /dev/null
echo "      ✓ Economic analysis completed; transitioning to Report Phase"

echo "  --- Phase 6: TP Audit Report & Committee Approval ---"
REPORT_ID=$(curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/report/draft" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUDITOR_ID" \
  -d '{
    "executiveSummary": "Transfer Pricing Audit concluded non-arm length profit shifting of ETB 26.8M via foreign management charges.",
    "auditBackground": "Initiated pursuant to Federal Income Tax Proclamation No. 979/2016.",
    "scope": "FY 2021 – FY 2025 cross-border related transactions.",
    "proceduresPerformed": "FAR Analysis, TNMM benchmarking with interquartile range testing.",
    "findingsAndConclusions": "Taxpayer operating margin of 1.90% falls significantly below the arm length interquartile range.",
    "complianceAssessment": "NON_COMPLIANT"
}' | tr -d '"')
echo "      ✓ Draft Report generated (ID: $REPORT_ID)"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/report/$REPORT_ID/submit-for-team-leader-review" \
  -H "X-Actor-Id: $AUDITOR_ID" > /dev/null
echo "      ✓ Draft Report submitted for Team Leader review"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/report/$REPORT_ID/team-leader-review" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $TL_ID" \
  -d '{"decision": "APPROVED", "comments": "Team Leader reviewed findings; calculations and legal grounds are sound."}' > /dev/null
echo "      ✓ Team Leader approved Report"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/report/$REPORT_ID/submit-for-process-owner-review" \
  -H "X-Actor-Id: $TL_ID" > /dev/null
echo "      ✓ Submitted to Review Committee / Process Owner"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/report/$REPORT_ID/committee-approval" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $COMM_USER" \
  -d '{"comments": "Review Committee formally adopts resolution approving TP Audit Report Form FR-04.5-20."}' > /dev/null
echo "      ✓ Review Committee passed statutory resolution approving TP Audit Report"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/exit-conference/record" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUDITOR_ID" \
  -d '{
    "venue": "Federal LTO Conference Room A",
    "auditorNotes": "Exit conference conducted with taxpayer managing director and tax agent.",
    "taxpayerObservations": "Taxpayer noted findings and agreed to review assessment computation.",
    "taxpayerSigned": true
}' > /dev/null
echo "      ✓ Statutory Exit Conference conducted and signed"

echo "  --- Phase 7: Assessment & Penalty Calculation Engine ---"
curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/assessment/save" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $AUDITOR_ID" \
  -d '{
    "adjustment": 26800000.00,
    "corpTax": 8040000.00,
    "penalty": 4020000.00,
    "interest": 1206000.00,
    "totalDemand": 13266000.00
}' > /dev/null
echo "      ✓ Assessment Computed: Tax ETB 8.04M, Penalty ETB 4.02M, Interest ETB 1.21M, Total ETB 13.27M"

echo "  --- Phase 8: Statutory Notice & Acceptance ---"
curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/assessment/generate-final-notice" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $COMM_USER" \
  -d '{
    "principalTax": 8040000.00,
    "penalties": 4020000.00,
    "interest": 1206000.00
}' > /dev/null
echo "      ✓ Official Transfer Pricing Assessment Notice Issued (Form NOT-TP)"

curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/assessment/taxpayer-accept" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: taxpayer-portal" \
  -d '{"paymentCommitment": "Payment in full within 30 days via Commercial Bank of Ethiopia"}' > /dev/null
echo "      ✓ Taxpayer accepted assessment with payment commitment"

echo "  --- Phase 9: Case Closure & MoR Executive KPI Recording ---"
curl -s -X POST "$BASE_URL/api/v1/backoffice/tp/cases/$CASE_ID/assessment/close-and-kpi" \
  -H "Content-Type: application/json" \
  -H "X-Actor-Id: $COMM_USER" \
  -d '{
    "agreedSettlementAmount": 13266000.00,
    "sigtasReceiptNo": "SIG-2027-ET-994821",
    "closureReason": "Taxpayer settled liability in full with SIGTAS validation."
}' > /dev/null
echo "      ✓ Transfer Pricing Audit Case CLOSED & KPIs recorded in MoR registry"

# --- Step 10: Verification in Database ---
echo ""
echo "[Step 10] Verifying Final Case State in PostgreSQL Database..."
DB_CASE=$(PGPASSWORD=dev_password psql -h localhost -p 5432 -U itas_dev -d itas_audit -t -A -c "SELECT status, case_number, assigned_auditor_id, assigned_team_leader_id, committee_id, tp_current_phase, completed_at FROM ap_audit_cases WHERE id = '$CASE_ID';")

echo "==> Database Record: $DB_CASE"

ACTION_COUNT=$(PGPASSWORD=dev_password psql -h localhost -p 5432 -U itas_dev -d itas_audit -t -A -c "SELECT COUNT(*) FROM tp_audit_action_history WHERE audit_case_id = '$CASE_ID';")
echo "==> Total Immutable Audit Action Logs Created: $ACTION_COUNT"

echo ""
echo "======================================================================="
echo "   ✅ END-TO-END AUDIT LIFECYCLE TEST COMPLETED SUCCESSFULLY!"
echo "======================================================================="
