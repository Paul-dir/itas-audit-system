import React, { useState, useEffect } from 'react';
import { denormalizeRegionName, getDisplayRegionName, normalizeRegionName } from '../utils/regionNormalizer';
import { parseUserIdEmail, toOrgContext } from '../utils/userIdParser';
import { useData } from '../services/dataService';
import planService from '../services/planService';

/**
 * Region Format Test Component
 * Tests the complete region format consistency fix
 * 
 * Tests:
 * 1. Region normalization functions
 * 2. User ID parsing
 * 3. Data lookup with normalized regions
 * 4. Plan filtering logic
 */

function RegionFormatTest() {
  const { data } = useData();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      runAllTests();
    }
  }, [data]);

  const runAllTests = () => {
    setLoading(true);
    const results = {};

    // Test 1: Region Normalization
    console.log('\n===== TEST 1: Region Normalization =====');
    results.normalization = testRegionNormalization();

    // Test 2: User ID Parsing
    console.log('\n===== TEST 2: User ID Parsing =====');
    results.userIdParsing = testUserIdParsing();

    // Test 3: Data Lookup with Normalized Regions
    console.log('\n===== TEST 3: Data Lookup =====');
    results.dataLookup = testDataLookup();

    // Test 4: Plan Filtering
    console.log('\n===== TEST 4: Plan Filtering =====');
    results.planFiltering = testPlanFiltering();

    // Test 5: Complete Flow Simulation
    console.log('\n===== TEST 5: Complete Flow Simulation =====');
    results.completeFlow = testCompleteFlow();

    setTestResults(results);
    setLoading(false);

    // Log summary
    console.log('\n===== TEST SUMMARY =====');
    Object.entries(results).forEach(([name, result]) => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status}: ${name} (${result.checks}/${result.total} checks)`);
      if (!result.passed) {
        result.errors.forEach(err => console.error(`  - ${err}`));
      }
    });
  };

  /**
   * TEST 1: Region Normalization
   */
  const testRegionNormalization = () => {
    const checks = [];
    const errors = [];

    // Test denormalize (titlecase → lowercase_underscore)
    const tests = [
      { input: 'Oromia', expected: 'oromia', desc: 'Titlecase Oromia' },
      { input: 'Addis Ababa', expected: 'addis_ababa', desc: 'Titlecase with space' },
      { input: 'addis_ababa', expected: 'addis_ababa', desc: 'Already lowercase_underscore' },
      { input: 'Dire Dawa', expected: 'dire_dawa', desc: 'Dire Dawa special case' },
      { input: 'SNNPR', expected: 'snnpr', desc: 'All caps SNNPR' },
    ];

    tests.forEach(test => {
      const result = denormalizeRegionName(test.input);
      const passed = result === test.expected;
      checks.push({
        test: test.desc,
        input: test.input,
        expected: test.expected,
        got: result,
        passed
      });
      if (!passed) {
        errors.push(`denormalizeRegionName('${test.input}'): expected '${test.expected}', got '${result}'`);
      }
    });

    // Test display names (normalize)
    const displayTests = [
      { input: 'addis_ababa', expected: 'Addis Ababa', desc: 'Display addis_ababa' },
      { input: 'oromia', expected: 'Oromia', desc: 'Display oromia' },
      { input: 'Oromia', expected: 'Oromia', desc: 'Display already titlecase' },
    ];

    displayTests.forEach(test => {
      const result = getDisplayRegionName(test.input);
      const passed = result === test.expected;
      checks.push({
        test: test.desc,
        input: test.input,
        expected: test.expected,
        got: result,
        passed
      });
      if (!passed) {
        errors.push(`getDisplayRegionName('${test.input}'): expected '${test.expected}', got '${result}'`);
      }
    });

    return {
      checks,
      total: checks.length,
      passed: errors.length === 0,
      errors
    };
  };

  /**
   * TEST 2: User ID Parsing
   */
  const testUserIdParsing = () => {
    const checks = [];
    const errors = [];

    const userIds = [
      {
        email: 'director.addis_ababa@mor.gov.et',
        expectedRole: 'regional_director',
        expectedRegion: 'addis_ababa',
        desc: 'Regional Director Addis Ababa'
      },
      {
        email: 'manager.oromia-tc1@mor.gov.et',
        expectedRole: 'tax_center_manager',
        expectedRegion: 'oromia',
        desc: 'Tax Center Manager Oromia TC1'
      },
      {
        email: 'desk.tl1.amhara-tc2@mor.gov.et',
        expectedRole: 'team_leader',
        expectedRegion: 'amhara',
        desc: 'Desk Team Lead Amhara TC2'
      }
    ];

    userIds.forEach(test => {
      const parsed = parseUserIdEmail(test.email);
      const roleMatch = parsed.role === test.expectedRole;
      const regionMatch = parsed.assignedRegion === test.expectedRegion;
      const passed = roleMatch && regionMatch && parsed.valid;

      checks.push({
        test: test.desc,
        email: test.email,
        role: { expected: test.expectedRole, got: parsed.role, match: roleMatch },
        region: { expected: test.expectedRegion, got: parsed.assignedRegion, match: regionMatch },
        passed
      });

      if (!passed) {
        errors.push(`${test.email}: role=${roleMatch}, region=${regionMatch}`);
      }
    });

    return {
      checks,
      total: checks.length,
      passed: errors.length === 0,
      errors
    };
  };

  /**
   * TEST 3: Data Lookup with Normalized Regions
   */
  const testDataLookup = () => {
    const checks = [];
    const errors = [];

    if (!data || !data.plans || data.plans.length === 0) {
      errors.push('No plans found in test data');
      return { checks, total: 1, passed: false, errors };
    }

    // Get first plan
    const plan = data.plans[0];
    checks.push({
      test: 'Plans loaded',
      info: `${data.plans.length} plans in test data`,
      passed: true
    });

    // Test regional allocation lookup with lowercase_underscore
    const regionTestCases = [
      { region: 'addis_ababa', desc: 'Addis Ababa region' },
      { region: 'oromia', desc: 'Oromia region' },
      { region: 'amhara', desc: 'Amhara region' }
    ];

    regionTestCases.forEach(test => {
      const hasAllocation = plan.regionalAllocation && plan.regionalAllocation[test.region];
      const sentToRegion = plan.sentToRegions && plan.sentToRegions.includes(test.region);

      checks.push({
        test: `${test.desc} lookup`,
        region: test.region,
        hasAllocation,
        sentToRegion,
        passed: hasAllocation !== undefined
      });

      if (!hasAllocation) {
        errors.push(`No regional allocation found for '${test.region}' in plan ${plan.id}`);
      }
    });

    // Test that titlecase lookups FAIL (to verify we fixed it)
    const titlecaseRegion = 'Oromia';
    const titlecaseLookup = plan.regionalAllocation && plan.regionalAllocation[titlecaseRegion];
    checks.push({
      test: 'Titlecase lookup FAILS (expected behavior)',
      region: titlecaseRegion,
      lookupResult: titlecaseLookup ? 'Found' : 'Not found',
      passedTest: titlecaseLookup === undefined, // Should NOT find with titlecase
      passed: titlecaseLookup === undefined
    });

    return {
      checks,
      total: checks.length,
      passed: errors.length === 0,
      errors
    };
  };

  /**
   * TEST 4: Plan Filtering (Simulating RegionalFeedbackView)
   */
  const testPlanFiltering = () => {
    const checks = [];
    const errors = [];

    // Use data from hook instead of loadData()
    const testRegion = 'addis_ababa'; // Use normalized region

    // Filter plans like RegionalFeedbackView does
    const filteredPlans = data.plans.filter(p => {
      const hasAllocation = p.regionalAllocation && p.regionalAllocation[testRegion];
      const wasSentHere = p.sentToRegions && p.sentToRegions.includes(testRegion);
      const isReady = planService.isReadyForRegionalFeedback(p);
      return hasAllocation && wasSentHere && isReady;
    });

    checks.push({
      test: 'Plan filtering with normalized region',
      region: testRegion,
      totalPlans: data.plans.length,
      filteredPlans: filteredPlans.length,
      passed: filteredPlans.length > 0
    });

    if (filteredPlans.length === 0) {
      errors.push(`No plans found for region '${testRegion}' after filtering`);
    } else {
      // Verify each filtered plan meets all criteria
      filteredPlans.forEach(p => {
        const hasAllocation = p.regionalAllocation && p.regionalAllocation[testRegion];
        const wasSentHere = p.sentToRegions && p.sentToRegions.includes(testRegion);
        const isReady = planService.isReadyForRegionalFeedback(p);

        checks.push({
          test: `Plan ${p.id} criteria`,
          hasAllocation,
          wasSentHere,
          isReady,
          status: p.status,
          passed: hasAllocation && wasSentHere && isReady
        });

        if (!hasAllocation || !wasSentHere || !isReady) {
          errors.push(`Plan ${p.id} failed filtering criteria`);
        }
      });
    }

    return {
      checks,
      total: checks.length,
      passed: errors.length === 0,
      errors
    };
  };

  /**
   * TEST 5: Complete Flow Simulation
   * Simulates: Login → Parse User ID → Get Region → Filter Plans → Display
   */
  const testCompleteFlow = () => {
    const checks = [];
    const errors = [];

    // Simulate login with user ID
    const email = 'director.addis_ababa@mor.gov.et';
    console.log(`\n[FLOW] Logging in as: ${email}`);

    // Step 1: Parse user ID
    const parsedUser = parseUserIdEmail(email);
    checks.push({
      step: '1. Parse User ID',
      email,
      parsed: parsedUser.valid,
      region: parsedUser.assignedRegion,
      passed: parsedUser.valid && parsedUser.assignedRegion === 'addis_ababa'
    });

    if (!parsedUser.valid) {
      errors.push(`Failed to parse user ID: ${email}`);
      return { checks, total: checks.length, passed: false, errors };
    }

    // Step 2: Get org context
    const orgContext = toOrgContext(parsedUser);
    checks.push({
      step: '2. Generate Org Context',
      region: orgContext.assignedRegion,
      format: 'lowercase_underscore',
      passed: orgContext.assignedRegion === 'addis_ababa'
    });

    // Step 3: RegionalFeedbackView receives region
    const rawRegion = orgContext.assignedRegion;
    console.log(`[FLOW] Raw region from auth: ${rawRegion}`);

    // Step 4: Normalize region (the fix!)
    const normalizedRegion = denormalizeRegionName(rawRegion);
    checks.push({
      step: '3. Normalize Region',
      input: rawRegion,
      output: normalizedRegion,
      passed: normalizedRegion === 'addis_ababa'
    });

    // Step 5: Filter plans with normalized region
    // Use data from hook instead of loadData()
    const plansForRegion = data.plans.filter(p => {
      const hasAllocation = p.regionalAllocation && p.regionalAllocation[normalizedRegion];
      const wasSentHere = p.sentToRegions && p.sentToRegions.includes(normalizedRegion);
      const isReady = planService.isReadyForRegionalFeedback(p);
      return hasAllocation && wasSentHere && isReady;
    });

    console.log(`[FLOW] Found ${plansForRegion.length} plans for ${normalizedRegion}`);

    checks.push({
      step: '4. Filter Plans',
      region: normalizedRegion,
      plansFound: plansForRegion.length,
      display: `Plans ready for feedback: ${plansForRegion.length}`,
      passed: plansForRegion.length > 0
    });

    if (plansForRegion.length === 0) {
      errors.push(`No plans found for regional director in region '${normalizedRegion}'`);
    }

    // Step 6: Display to user
    const displayRegion = getDisplayRegionName(normalizedRegion);
    checks.push({
      step: '5. Display to User',
      internalFormat: normalizedRegion,
      displayFormat: displayRegion,
      passed: displayRegion === 'Addis Ababa'
    });

    return {
      checks,
      total: checks.length,
      passed: errors.length === 0,
      errors
    };
  };

  // Render results
  if (loading) {
    return (
      <div className="p-8 bg-ink dark:bg-ink min-h-screen">
        <h1 className="text-3xl font-bold mb-4">🧪 Region Format Test Suite</h1>
        <p className="text-lg text-text-mid">Running tests...</p>
      </div>
    );
  }

  const allPassed = Object.values(testResults).every(r => r.passed);

  return (
    <div className="p-8 bg-ink dark:bg-ink min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">🧪 Region Format Test Suite</h1>
        <div className={`p-4 rounded-lg text-xl font-bold ${allPassed ? 'bg-green-900 text-teal' : 'bg-red-900 text-red-300'}`}>
          {allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}
        </div>
      </div>

      {/* Test 1: Normalization */}
      {testResults.normalization && (
        <TestSection 
          title="Test 1: Region Normalization" 
          result={testResults.normalization}
        >
          <div className="grid grid-cols-1 gap-3">
            {testResults.normalization.checks.map((check, i) => (
              <div key={i} className={`p-3 rounded border ${check.passed ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20'}`}>
                <div className="font-mono text-sm">
                  <div><strong>{check.test}</strong></div>
                  {check.input && <div>Input: <code>{check.input}</code></div>}
                  {check.expected && <div>Expected: <code>{check.expected}</code></div>}
                  {check.got && <div>Got: <code>{check.got}</code></div>}
                  <div className={check.passed ? 'text-teal' : 'text-red-400'}>
                    {check.passed ? '✅ PASS' : '❌ FAIL'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TestSection>
      )}

      {/* Test 2: User ID Parsing */}
      {testResults.userIdParsing && (
        <TestSection 
          title="Test 2: User ID Parsing" 
          result={testResults.userIdParsing}
        >
          <div className="grid grid-cols-1 gap-3">
            {testResults.userIdParsing.checks.map((check, i) => (
              <div key={i} className={`p-3 rounded border ${check.passed ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20'}`}>
                <div className="font-mono text-sm">
                  <div><strong>{check.test}</strong></div>
                  <div>Email: <code>{check.email}</code></div>
                  <div>Role: {check.role.match ? '✅' : '❌'} Expected <code>{check.role.expected}</code>, Got <code>{check.role.got}</code></div>
                  <div>Region: {check.region.match ? '✅' : '❌'} Expected <code>{check.region.expected}</code>, Got <code>{check.region.got}</code></div>
                </div>
              </div>
            ))}
          </div>
        </TestSection>
      )}

      {/* Test 3: Data Lookup */}
      {testResults.dataLookup && (
        <TestSection 
          title="Test 3: Data Lookup with Normalized Regions" 
          result={testResults.dataLookup}
        >
          <div className="grid grid-cols-1 gap-3">
            {testResults.dataLookup.checks.map((check, i) => (
              <div key={i} className={`p-3 rounded border ${check.passed ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20'}`}>
                <div className="font-mono text-sm">
                  <div><strong>{check.test}</strong></div>
                  {check.info && <div>{check.info}</div>}
                  {check.region && <div>Region: <code>{check.region}</code></div>}
                  {check.hasAllocation !== undefined && <div>Has Allocation: {check.hasAllocation ? '✅' : '❌'}</div>}
                  {check.sentToRegion !== undefined && <div>Sent to Region: {check.sentToRegion ? '✅' : '❌'}</div>}
                  {check.lookupResult && <div>Titlecase Lookup: {check.lookupResult} (should be "Not found")</div>}
                </div>
              </div>
            ))}
          </div>
        </TestSection>
      )}

      {/* Test 4: Plan Filtering */}
      {testResults.planFiltering && (
        <TestSection 
          title="Test 4: Plan Filtering (RegionalFeedbackView)" 
          result={testResults.planFiltering}
        >
          <div className="grid grid-cols-1 gap-3">
            {testResults.planFiltering.checks.map((check, i) => (
              <div key={i} className={`p-3 rounded border ${check.passed ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20'}`}>
                <div className="font-mono text-sm">
                  <div><strong>{check.test}</strong></div>
                  {check.region && <div>Region: <code>{check.region}</code></div>}
                  {check.totalPlans !== undefined && <div>Total Plans: {check.totalPlans}</div>}
                  {check.filteredPlans !== undefined && <div>Filtered Plans: <strong>{check.filteredPlans}</strong> {check.filteredPlans > 0 ? '✅' : '❌'}</div>}
                  {check.status && <div>Status: <code>{check.status}</code></div>}
                  {check.hasAllocation !== undefined && (
                    <div>
                      <div>Has Allocation: {check.hasAllocation ? '✅' : '❌'}</div>
                      <div>Was Sent: {check.wasSentHere ? '✅' : '❌'}</div>
                      <div>Is Ready: {check.isReady ? '✅' : '❌'}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TestSection>
      )}

      {/* Test 5: Complete Flow */}
      {testResults.completeFlow && (
        <TestSection 
          title="Test 5: Complete Flow Simulation (Login → Display)" 
          result={testResults.completeFlow}
        >
          <div className="grid grid-cols-1 gap-3">
            {testResults.completeFlow.checks.map((check, i) => (
              <div key={i} className={`p-3 rounded border ${check.passed ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20'}`}>
                <div className="font-mono text-sm">
                  <div className="font-bold text-lg mb-2">{check.step}</div>
                  {check.email && <div>Email: <code>{check.email}</code></div>}
                  {check.parsed !== undefined && <div>Parsed: {check.parsed ? '✅' : '❌'}</div>}
                  {check.region && <div>Region: <code>{check.region}</code></div>}
                  {check.format && <div>Format: {check.format}</div>}
                  {check.input && <div>Input: <code>{check.input}</code></div>}
                  {check.output && <div>Output: <code>{check.output}</code></div>}
                  {check.plansFound !== undefined && <div>Plans Found: <strong className="text-teal">{check.plansFound}</strong> {check.plansFound > 0 ? '✅' : '❌'}</div>}
                  {check.display && <div className="text-teal text-lg font-bold mt-2">{check.display}</div>}
                  {check.internalFormat && (
                    <div className="mt-2">
                      <div>Internal: <code>{check.internalFormat}</code></div>
                      <div>Display: <code className="text-teal">{check.displayFormat}</code></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TestSection>
      )}

      <div className="mt-8 p-4 bg-blue-900 rounded-lg border border-blue">
        <h3 className="font-bold mb-2">📋 Test Summary</h3>
        <div className="font-mono text-sm space-y-1">
          {Object.entries(testResults).map(([name, result]) => (
            <div key={name} className={result.passed ? 'text-teal' : 'text-red-400'}>
              {result.passed ? '✅' : '❌'} {name}: {result.total} checks ({result.errors.length} errors)
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Helper component for rendering test sections
 */
function TestSection({ title, result, children }) {
  return (
    <div className="mb-8 p-6 bg-panel dark:bg-panel rounded-lg border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className={`px-3 py-1 rounded font-bold ${result.passed ? 'bg-green-900 text-teal' : 'bg-red-900 text-red-300'}`}>
          {result.passed ? `✅ ${result.total}/${result.total}` : `❌ ${result.total - result.errors.length}/${result.total}`}
        </div>
      </div>
      {result.errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-600 rounded">
          <div className="font-bold text-red-300 mb-2">Errors:</div>
          {result.errors.map((err, i) => (
            <div key={i} className="text-red-300 text-sm font-mono">• {err}</div>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

export default RegionFormatTest;
