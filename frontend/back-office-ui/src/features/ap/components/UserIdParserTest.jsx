import React, { useState, useEffect } from 'react';
import { parseUserIdEmail, toOrgContext, getUserDisplayName, testUserIdParsing } from '../utils/userIdParser';

/**
 * UserIdParserTest Component
 * Tests user ID parsing for all expected formats
 * Useful for verifying user ID → region → role mapping
 */
function UserIdParserTest() {
  const [testResults, setTestResults] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState('director.addis_ababa@mor.gov.et');
  const [customEmail, setCustomEmail] = useState('');
  const [parseResult, setParseResult] = useState(null);

  // Run tests on mount
  useEffect(() => {
    const results = testUserIdParsing();
    setTestResults(results);
    
    // Parse the selected email
    const parsed = parseUserIdEmail(selectedEmail);
    setParseResult(parsed);
  }, [selectedEmail]);

  // Handle custom email parsing
  const handleParseCustom = () => {
    if (customEmail.trim()) {
      const parsed = parseUserIdEmail(customEmail.trim());
      setParseResult(parsed);
    }
  };

  if (!testResults) {
    return <div className="p-4">Loading...</div>;
  }

  const testEmails = Object.keys(testResults);

  return (
    <div className="p-6 bg-ink dark:bg-ink text-text-primary dark:text-text-primary">
      <h1 className="text-3xl font-bold mb-6 text-text-hi dark:text-text-hi">
        <i className="fas fa-user-circle"></i> User ID Parser Test
      </h1>

      {/* Quick Test Selector */}
      <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-3 text-text-hi dark:text-text-hi">Quick Test</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2 text-text-mid dark:text-text-mid">
            Select a Test Email:
          </label>
          <select
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
            className="w-full px-4 py-2 rounded border border-blue dark:border-blue bg-ink dark:bg-ink text-text-primary dark:text-text-primary"
          >
            {testEmails.map(email => (
              <option key={email} value={email}>{email}</option>
            ))}
          </select>
        </div>

        {/* Parse Result */}
        {parseResult && (
          <div className={`p-4 rounded border-l-4 ${parseResult.valid ? 'border-teal bg-teal/10' : 'border-danger bg-danger/10'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-mid dark:text-text-mid uppercase">Status</p>
                <p className="text-lg font-bold text-text-hi dark:text-text-hi">
                  {parseResult.valid ? '✅ Valid' : '❌ Invalid'}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-text-mid dark:text-text-mid uppercase">Role</p>
                <p className="text-lg font-bold text-text-hi dark:text-text-hi">
                  {parseResult.roleTitle || parseResult.role || 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-text-mid dark:text-text-mid uppercase">Region</p>
                <p className="text-lg font-bold text-teal dark:text-teal">
                  {parseResult.assignedRegion || 'None (National)'}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-text-mid dark:text-text-mid uppercase">Tax Center</p>
                <p className="text-lg font-bold text-text-hi dark:text-text-hi">
                  {parseResult.assignedTaxCenter || 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-text-mid dark:text-text-mid uppercase">Audit Type</p>
                <p className="text-lg font-bold text-text-hi dark:text-text-hi">
                  {parseResult.auditType || 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-text-mid dark:text-text-mid uppercase">Level</p>
                <p className="text-lg font-bold text-text-hi dark:text-text-hi">
                  {parseResult.level}
                </p>
              </div>
            </div>

            {/* Display Name */}
            <div className="mt-4 pt-4 border-t border-border dark:border-border">
              <p className="text-xs text-text-mid dark:text-text-mid uppercase">Display Name</p>
              <p className="text-sm font-semibold text-text-primary dark:text-text-primary">
                {getUserDisplayName(parseResult)}
              </p>
            </div>

            {/* OrgContext */}
            <div className="mt-4 pt-4 border-t border-border dark:border-border">
              <p className="text-xs text-text-mid dark:text-text-mid uppercase">Org Context</p>
              <pre className="bg-ink dark:bg-ink p-2 rounded text-xs overflow-auto mt-2 border border-border dark:border-border">
                {JSON.stringify(toOrgContext(parseResult), null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Custom Email Parser */}
      <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-3 text-text-hi dark:text-text-hi">Custom Email Parser</h2>
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter custom email (e.g., manager.oromia-tc1@mor.gov.et)"
            value={customEmail}
            onChange={(e) => setCustomEmail(e.target.value)}
            className="flex-1 px-4 py-2 rounded border border-blue dark:border-blue bg-ink dark:bg-ink text-text-primary dark:text-text-primary"
          />
          <button
            onClick={handleParseCustom}
            className="btn btn-primary"
          >
            <i className="fas fa-search"></i> Parse
          </button>
        </div>
      </div>

      {/* All Test Results */}
      <div className="bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
        <h2 className="text-xl font-bold mb-3 text-text-hi dark:text-text-hi">
          All Test Results ({testEmails.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-ink dark:bg-ink border-b border-border dark:border-border">
                <th className="text-left p-2 font-bold text-blue dark:text-blue">Email</th>
                <th className="text-left p-2 font-bold text-blue dark:text-blue">Status</th>
                <th className="text-left p-2 font-bold text-blue dark:text-blue">Role</th>
                <th className="text-left p-2 font-bold text-blue dark:text-blue">Region</th>
                <th className="text-left p-2 font-bold text-blue dark:text-blue">Tax Center</th>
                <th className="text-left p-2 font-bold text-blue dark:text-blue">Audit Type</th>
                <th className="text-left p-2 font-bold text-blue dark:text-blue">Level</th>
              </tr>
            </thead>
            <tbody>
              {testEmails.map(email => {
                const result = testResults[email];
                return (
                  <tr
                    key={email}
                    className={`border-b border-border dark:border-border hover:bg-ink/50 dark:hover:bg-ink/50 cursor-pointer ${
                      result.valid ? '' : 'opacity-50'
                    }`}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <td className="p-2">
                      <code className="text-text-primary dark:text-text-primary">{email}</code>
                    </td>
                    <td className="p-2">
                      {result.valid ? (
                        <span className="text-teal dark:text-teal font-bold">✅</span>
                      ) : (
                        <span className="text-danger dark:text-danger font-bold">❌</span>
                      )}
                    </td>
                    <td className="p-2">
                      <span className="text-text-primary dark:text-text-primary">
                        {result.roleTitle || result.role || '—'}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={result.assignedRegion ? 'text-teal dark:text-teal font-semibold' : 'text-text-mid dark:text-text-mid'}>
                        {result.assignedRegion || '—'}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className="text-text-primary dark:text-text-primary">
                        {result.assignedTaxCenter || '—'}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className="text-text-primary dark:text-text-primary">
                        {result.auditType || '—'}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        result.level === 'national' ? 'bg-blue/20 text-blue' :
                        result.level === 'regional' ? 'bg-teal/20 text-teal' :
                        result.level === 'tax_center' ? 'bg-gold/20 text-gold' :
                        'bg-text-mid/20 text-text-mid'
                      }`}>
                        {result.level}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User ID Format Guide */}
      <div className="mt-6 bg-panel dark:bg-panel border border-border dark:border-border rounded-lg p-4">
        <h2 className="text-xl font-bold mb-3 text-text-hi dark:text-text-hi">
          <i className="fas fa-book"></i> User ID Format Guide
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-bold text-teal dark:text-teal mb-2">Directors</h3>
            <code className="block text-xs text-text-primary dark:text-text-primary mb-1">
              director.addis_ababa@mor.gov.et
            </code>
            <p className="text-xs text-text-mid dark:text-text-mid">Audit Director assigned to a region</p>
          </div>

          <div>
            <h3 className="font-bold text-teal dark:text-teal mb-2">Tax Center Managers</h3>
            <code className="block text-xs text-text-primary dark:text-text-primary mb-1">
              manager.addis_ababa-tc1@mor.gov.et
            </code>
            <p className="text-xs text-text-mid dark:text-text-mid">Manager for specific tax center</p>
          </div>

          <div>
            <h3 className="font-bold text-teal dark:text-teal mb-2">Team Leads</h3>
            <code className="block text-xs text-text-primary dark:text-text-primary mb-1">
              desk.tl1.addis_ababa-tc1@mor.gov.et
            </code>
            <p className="text-xs text-text-mid dark:text-text-mid">Team lead with team number</p>
          </div>

          <div>
            <h3 className="font-bold text-teal dark:text-teal mb-2">Auditors</h3>
            <code className="block text-xs text-text-primary dark:text-text-primary mb-1">
              desk.tl1.a1.addis_ababa-tc1@mor.gov.et
            </code>
            <p className="text-xs text-text-mid dark:text-text-mid">Auditor with audit type and team</p>
          </div>

          <div>
            <h3 className="font-bold text-teal dark:text-teal mb-2">Audit Types</h3>
            <code className="block text-xs text-text-primary dark:text-text-primary mb-1">
              desk, field, joint, transfer/tp, ...
            </code>
            <p className="text-xs text-text-mid dark:text-text-mid">First part indicates audit type</p>
          </div>

          <div>
            <h3 className="font-bold text-teal dark:text-teal mb-2">Regions</h3>
            <code className="block text-xs text-text-primary dark:text-text-primary mb-1">
              addis_ababa, oromia, amhara, snnpr, somali, dire_dawa, tigray
            </code>
            <p className="text-xs text-text-mid dark:text-text-mid">Always lowercase_underscore format</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserIdParserTest;
