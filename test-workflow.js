const API_BASE = 'http://localhost:8080/api/v1/backoffice';
const PLAN_NAME = `Integration-Test-${Date.now()}`;

async function runTest() {
  try {
    console.log('1. Creating Plan...');
    const createRes = await fetch(`${API_BASE}/ap/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Actor-Id': 'planning-team-001' },
      body: JSON.stringify({
        planYear: 2000 + Math.floor(Math.random() * 100000),
        planName: PLAN_NAME,
        regionalAllocations: [
          { regionCode: 'AA', proposedCount: 100 }
        ],
        distribution: {
          'addis_ababa': { 'DESK_AUDIT': 50, 'COMPREHENSIVE_AUDIT': 50 }
        }
      })
    });
    if (!createRes.ok) throw new Error(`Create failed: ${await createRes.text()}`);
    const createdPlan = await createRes.json();
    const planId = createdPlan.planId || createdPlan.id;
    console.log(`✅ Created Plan ID: ${planId}, Status: ${createdPlan.status}`);

    console.log('2. Submitting to Director...');
    const submitRes = await fetch(`${API_BASE}/ap/plans/${planId}/submit-to-director`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Actor-Id': 'planning-team-001' }
    });
    if (!submitRes.ok) throw new Error(`Submit failed: ${await submitRes.text()}`);
    console.log('✅ Submitted to Director');

    console.log('3. Approving Plan...');
    const approveRes = await fetch(`${API_BASE}/ap/plans/${planId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Actor-Id': 'director-001' },
      body: JSON.stringify({ reason: 'Looks good' })
    });
    if (!approveRes.ok) throw new Error(`Approve failed: ${await approveRes.text()}`);
    console.log('✅ Approved Plan');

    console.log('4. Sending to Regions...');
    const sendRes = await fetch(`${API_BASE}/ap/plans/${planId}/send-to-regions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Actor-Id': 'director-001' },
      body: JSON.stringify({ deploymentNote: 'Deploying to regions' })
    });
    if (!sendRes.ok) throw new Error(`Send to regions failed: ${await sendRes.text()}`);
    console.log('✅ Sent to Regions');

    console.log('5. Distributing to Tax Centers (AA)...');
    const distributeRes = await fetch(`${API_BASE}/ap/regional/plans/${planId}/distribute-to-tax-centers?regionCode=AA`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Actor-Id': 'regional-director-aa' },
      body: JSON.stringify({
        regionCode: 'AA',
        taxCenterAllocations: {
          'LTO': { 'DESK_AUDIT': 30, 'COMPREHENSIVE_AUDIT': 30 },
          'MTO': { 'DESK_AUDIT': 20, 'COMPREHENSIVE_AUDIT': 20 }
        }
      })
    });
    if (!distributeRes.ok) throw new Error(`Distribute failed: ${await distributeRes.text()}`);
    console.log('✅ Distributed to Tax Centers');

    console.log('6. Submitting Regional Feedback...');
    const feedbackRes = await fetch(`${API_BASE}/ap/regions/AA/submit-feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Actor-Id': 'regional-director-aa' },
      body: JSON.stringify({
        planId: planId,
        aggregatedFeedback: {
          'DESK_AUDIT': { totalRequested: 50, totalCapacity: 50, gapPercentage: 0, taxCenterFeedbacks: [] },
          'COMPREHENSIVE_AUDIT': { totalRequested: 50, totalCapacity: 50, gapPercentage: 0, taxCenterFeedbacks: [] }
        },
        regionalAnalysis: 'All looks good from Addis Ababa'
      })
    });
    if (!feedbackRes.ok) throw new Error(`Feedback failed: ${await feedbackRes.text()}`);
    console.log('✅ Submitted Feedback');

    console.log('7. Fetching plan from backend to verify status...');
    const fetchRes = await fetch(`${API_BASE}/ap/plans/${planId}`, {
        headers: { 'Content-Type': 'application/json' }
    });
    const finalPlan = await fetchRes.json();
    console.log('✅ Final Plan Data:', JSON.stringify(finalPlan, null, 2));

  } catch (err) {
    console.error('Error during test:', err);
  }
}

runTest();
