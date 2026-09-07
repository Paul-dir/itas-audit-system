import React, { useState } from 'react';
import { useCommitteeCases } from '../hooks/useCases';
import { useTeamLeaders } from '../hooks/useUsers';
import { useAssignCases } from '../hooks/useAssignCases';

/**
 * Committee Dashboard Component
 * 
 * Displays cases for a committee and allows assignment to team leaders
 * 
 * Usage:
 * <CommitteeDashboard committeeId="tp-committee" auditType="TRANSFER_PRICING" />
 */
export const CommitteeDashboard = ({ committeeId, auditType }) => {
  const [selectedCaseIds, setSelectedCaseIds] = useState([]);
  const [selectedTeamLeader, setSelectedTeamLeader] = useState(null);

  // Fetch cases for this committee
  const { cases, loading: casesLoading, error: casesError, refetch: refetchCases } = useCommitteeCases(
    committeeId,
    auditType
  );

  // Fetch team leaders for this audit type
  const { teamLeaders, loading: leadersLoading } = useTeamLeaders(auditType);

  // Setup case assignment
  const { assign, loading: assignLoading, error: assignError, success } = useAssignCases();

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

  // Handle assignment
  const handleAssign = async () => {
    if (!selectedTeamLeader) {
      alert('Please select a team leader');
      return;
    }

    if (!selectedCaseIds.length) {
      alert('Please select cases');
      return;
    }

    const success = await assign(selectedCaseIds, selectedTeamLeader);
    if (success) {
      setSelectedCaseIds([]);
      setSelectedTeamLeader(null);
      refetchCases(); // Refresh the case list
    }
  };

  if (casesLoading) return <div>Loading cases...</div>;
  if (casesError) return <div>Error: {casesError}</div>;

  return (
    <div className="committee-dashboard">
      <h2>{auditType} Committee Dashboard</h2>

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
          <label htmlFor="teamLeader">Assign to Team Leader:</label>
          <select
            id="teamLeader"
            value={selectedTeamLeader || ''}
            onChange={e => setSelectedTeamLeader(e.target.value)}
            disabled={leadersLoading}
          >
            <option value="">Select Team Leader...</option>
            {teamLeaders.map(tl => (
              <option key={tl.userId} value={tl.userId}>
                {tl.fullName}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssign}
          disabled={!selectedTeamLeader || !selectedCaseIds.length || assignLoading}
        >
          {assignLoading ? 'Assigning...' : `Assign (${selectedCaseIds.length})`}
        </button>
      </div>

      {assignError && <div className="error">{assignError}</div>}
      {success && <div className="success">Cases assigned successfully!</div>}

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
              <th>Taxpayer ID</th>
              <th>Audit Type</th>
              <th>Status</th>
              <th>Created At</th>
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
                <td>{c.taxpayerId}</td>
                <td>{c.auditType}</td>
                <td>{c.status}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommitteeDashboard;
