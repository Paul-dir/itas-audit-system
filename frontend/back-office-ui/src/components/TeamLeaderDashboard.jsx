import React, { useState } from 'react';
import { useTeamLeaderCases } from '../hooks/useCases';
import { useAuditors } from '../hooks/useUsers';

/**
 * Team Leader Dashboard Component
 * 
 * Displays cases assigned to a team leader for further assignment to auditors
 * 
 * Usage:
 * <TeamLeaderDashboard teamLeaderId="desk-tl-1" auditType="DESK_AUDIT" />
 */
export const TeamLeaderDashboard = ({ teamLeaderId, auditType }) => {
  const [selectedCaseIds, setSelectedCaseIds] = useState([]);
  const [selectedAuditor, setSelectedAuditor] = useState(null);

  // Fetch cases for this team leader
  const { cases, loading: casesLoading, error: casesError, metadata } = useTeamLeaderCases(
    teamLeaderId,
    auditType
  );

  // Fetch auditors for this audit type
  const { auditors, loading: auditorsLoading } = useAuditors(auditType);

  // Handle case selection
  const handleSelectCase = (caseId) => {
    setSelectedCaseIds(prev =>
      prev.includes(caseId)
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedCaseIds.length === cases.length) {
      setSelectedCaseIds([]);
    } else {
      setSelectedCaseIds(cases.map(c => c.id));
    }
  };

  if (casesLoading) return <div>Loading cases...</div>;
  if (casesError) return <div>Error: {casesError}</div>;

  return (
    <div className="team-leader-dashboard">
      <h2>Team Leader Dashboard - {auditType}</h2>

      {/* Summary */}
      <div className="summary">
        <div className="summary-card">
          <h3>Total Cases</h3>
          <p className="big-number">{metadata?.total || 0}</p>
        </div>
        <div className="summary-card">
          <h3>Selected</h3>
          <p className="big-number">{selectedCaseIds.length}</p>
        </div>
      </div>

      {/* Selection and Assignment Controls */}
      <div className="controls">
        <div>
          <label>
            <input
              type="checkbox"
              checked={selectedCaseIds.length === cases.length && cases.length > 0}
              onChange={handleSelectAll}
            />
            Select All ({selectedCaseIds.length}/{cases.length})
          </label>
        </div>

        <div>
          <label htmlFor="auditor">Assign to Auditor:</label>
          <select
            id="auditor"
            value={selectedAuditor || ''}
            onChange={e => setSelectedAuditor(e.target.value)}
            disabled={auditorsLoading}
          >
            <option value="">Select Auditor...</option>
            {auditors.map(auditor => (
              <option key={auditor.userId} value={auditor.userId}>
                {auditor.fullName}
              </option>
            ))}
          </select>
        </div>

        <button
          disabled={!selectedAuditor || !selectedCaseIds.length}
        >
          {`Assign to Auditor (${selectedCaseIds.length})`}
        </button>
      </div>

      {/* Cases Table */}
      <div className="cases-table">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedCaseIds.length === cases.length && cases.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Case Number</th>
              <th>Taxpayer Name</th>
              <th>Taxpayer ID</th>
              <th>Risk Score</th>
              <th>Status</th>
              <th>Tax Center</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(c => (
              <tr key={c.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCaseIds.includes(c.id)}
                    onChange={() => handleSelectCase(c.id)}
                  />
                </td>
                <td>{c.caseNumber}</td>
                <td>{c.taxpayerName}</td>
                <td>{c.taxpayerId}</td>
                <td>{c.riskScore || 'N/A'}</td>
                <td>{c.status}</td>
                <td>{c.taxCenterCode}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      {metadata && (
        <div className="pagination-info">
          Showing {cases.length} of {metadata.total} cases
        </div>
      )}
    </div>
  );
};

export default TeamLeaderDashboard;
