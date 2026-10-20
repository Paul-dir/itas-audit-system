import React, { useState, useEffect } from 'react';
import FormInput from './FormInput';
import './forms.css';

/**
 * CaseHandoffForm Component - Phase 8.1.1
 * 
 * Allows chairperson to hand off an approved case to a team leader.
 * 
 * Features:
 * - Case selector (dropdown) showing APPROVED cases only
 * - Display selected case details (case number, tax center, committee)
 * - Team leader dropdown (fetched from API, filtered to TEAM_LEADER role)
 * - Assignment reason textarea (required, min 10 chars, max 500 chars)
 * - Submit button (disabled until form valid)
 * - Loading state during submission
 * - Success message on completion showing case number, team leader, timestamp
 * - Error messages for each error type
 * 
 * Integration:
 * - GET /api/v1/backoffice/cases?status=APPROVED - fetch cases
 * - GET /api/v1/backoffice/users?role=TEAM_LEADER - fetch team leaders
 * - POST /api/v1/backoffice/cases/{caseId}/handoff-to-team-leader - submit handoff
 */
function CaseHandoffForm() {
  // Form state
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [selectedTeamLeaderId, setSelectedTeamLeaderId] = useState('');
  const [assignmentReason, setAssignmentReason] = useState('');
  
  // Data state
  const [cases, setCases] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [selectedCaseDetails, setSelectedCaseDetails] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

  // Fetch cases on component mount
  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/backoffice/cases?status=APPROVED`);
        if (!response.ok) throw new Error('Failed to fetch cases');
        const data = await response.json();
        setCases(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        setError('Failed to load cases. Please refresh and try again.');
        console.error('Error fetching cases:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // Fetch team leaders on component mount
  useEffect(() => {
    const fetchTeamLeaders = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/backoffice/users?role=TEAM_LEADER`);
        if (!response.ok) throw new Error('Failed to fetch team leaders');
        const data = await response.json();
        setTeamLeaders(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        setError('Failed to load team leaders. Please refresh and try again.');
        console.error('Error fetching team leaders:', err);
      }
    };

    fetchTeamLeaders();
  }, []);

  // Update case details when case selection changes
  useEffect(() => {
    if (selectedCaseId) {
      const caseDetails = cases.find(c => c.id === selectedCaseId);
      setSelectedCaseDetails(caseDetails || null);
    } else {
      setSelectedCaseDetails(null);
    }
    setValidationErrors(prev => ({ ...prev, caseId: null }));
  }, [selectedCaseId, cases]);

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!selectedCaseId) {
      errors.caseId = 'Please select a case';
    }

    if (!selectedTeamLeaderId) {
      errors.teamLeaderId = 'Please select a team leader';
    }

    if (!assignmentReason || assignmentReason.trim().length === 0) {
      errors.reason = 'Assignment reason is required';
    } else if (assignmentReason.length < 10) {
      errors.reason = 'Assignment reason must be at least 10 characters';
    } else if (assignmentReason.length > 500) {
      errors.reason = 'Assignment reason cannot exceed 500 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `${apiBaseUrl}/backoffice/cases/${selectedCaseId}/handoff-to-team-leader`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            teamLeaderId: selectedTeamLeaderId,
            assignmentReason: assignmentReason.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error types
        if (data.error === 'CASE_NOT_FOUND') {
          setError('Case not found. Please refresh and try again.');
        } else if (data.error === 'INVALID_CASE_STATE') {
          setError(`Case is not in APPROVED status. Current: ${data.currentStatus}`);
        } else if (data.error === 'INVALID_TEAM_LEADER') {
          setError('Selected team leader is invalid. Please choose another.');
        } else {
          setError(data.message || 'Failed to complete handoff. Please try again or contact support.');
        }
        return;
      }

      // Success!
      const teamLeader = teamLeaders.find(tl => tl.id === selectedTeamLeaderId);
      setSuccess({
        caseNumber: data.caseNumber,
        teamLeaderName: teamLeader?.fullName || teamLeader?.name || selectedTeamLeaderId,
        timestamp: new Date(data.assignmentDate).toLocaleString(),
      });

      // Reset form
      setSelectedCaseId('');
      setSelectedTeamLeaderId('');
      setAssignmentReason('');
      setValidationErrors({});
    } catch (err) {
      setError('Failed to complete handoff. Please try again or contact support.');
      console.error('Error submitting handoff:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = selectedCaseId && selectedTeamLeaderId && assignmentReason.trim().length >= 10;

  return (
    <div className="form-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="form-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '28px', fontWeight: '700' }}>
          <i className="fas fa-hand-holding" style={{ marginRight: '12px', color: '#4caf50' }}></i>
          Hand Off Case to Team Leader
        </h1>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          Transfer an approved case to a team leader for assignment to auditors
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="success-message" style={{
          background: 'rgba(76, 175, 80, 0.1)',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          fontSize: '14px',
          color: '#2e7d32',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <i className="fas fa-check-circle" style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}></i>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>Case Handoff Successful!</div>
              <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                <strong>Case:</strong> {success.caseNumber}<br />
                <strong>Assigned To:</strong> {success.teamLeaderName}<br />
                <strong>Timestamp:</strong> {success.timestamp}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message" style={{
          background: 'rgba(244, 67, 54, 0.1)',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          fontSize: '14px',
          color: '#c62828',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}></i>
            <div>
              <div style={{ fontWeight: '600' }}>Error</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>{error}</div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Case Selection */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label htmlFor="case-select" style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#333',
          }}>
            <i className="fas fa-folder" style={{ marginRight: '8px', color: '#4caf50' }}></i>
            Case <span style={{ color: '#e53935' }}>*</span>
          </label>
          <select
            id="case-select"
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            disabled={loading || cases.length === 0}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: validationErrors.caseId ? '2px solid #e53935' : '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: loading || cases.length === 0 ? '#f5f5f5' : '#fff',
              cursor: loading || cases.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              if (!validationErrors.caseId) {
                e.target.style.borderColor = '#4caf50';
                e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
              }
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">{loading ? 'Loading cases...' : 'Select a case'}</option>
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} - {c.taxCenter}
              </option>
            ))}
          </select>
          {validationErrors.caseId && (
            <p style={{ color: '#e53935', fontSize: '12px', marginTop: '6px' }}>
              <i className="fas fa-info-circle" style={{ marginRight: '4px' }}></i>
              {validationErrors.caseId}
            </p>
          )}
        </div>

        {/* Case Details Display */}
        {selectedCaseDetails && (
          <div className="case-details" style={{
            background: '#f5f5f5',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            padding: '16px',
            marginBottom: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            fontSize: '13px',
          }}>
            <div>
              <div style={{ color: '#999', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Case Number</div>
              <div style={{ fontWeight: '600', color: '#333' }}>{selectedCaseDetails.caseNumber}</div>
            </div>
            <div>
              <div style={{ color: '#999', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Tax Center</div>
              <div style={{ fontWeight: '600', color: '#333' }}>{selectedCaseDetails.taxCenter}</div>
            </div>
            <div>
              <div style={{ color: '#999', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Status</div>
              <div style={{ fontWeight: '600', color: '#2e7d32' }}>APPROVED</div>
            </div>
            <div>
              <div style={{ color: '#999', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Committee</div>
              <div style={{ fontWeight: '600', color: '#333' }}>{selectedCaseDetails.committee || 'N/A'}</div>
            </div>
          </div>
        )}

        {/* Team Leader Selection */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label htmlFor="team-leader-select" style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#333',
          }}>
            <i className="fas fa-users" style={{ marginRight: '8px', color: '#4caf50' }}></i>
            Team Leader <span style={{ color: '#e53935' }}>*</span>
          </label>
          <select
            id="team-leader-select"
            value={selectedTeamLeaderId}
            onChange={(e) => {
              setSelectedTeamLeaderId(e.target.value);
              setValidationErrors(prev => ({ ...prev, teamLeaderId: null }));
            }}
            disabled={teamLeaders.length === 0}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: validationErrors.teamLeaderId ? '2px solid #e53935' : '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: teamLeaders.length === 0 ? '#f5f5f5' : '#fff',
              cursor: teamLeaders.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              if (!validationErrors.teamLeaderId) {
                e.target.style.borderColor = '#4caf50';
                e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
              }
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">{teamLeaders.length === 0 ? 'No team leaders available' : 'Select a team leader'}</option>
            {teamLeaders.map(tl => (
              <option key={tl.id} value={tl.id}>
                {tl.fullName || tl.name} ({tl.department || 'N/A'})
              </option>
            ))}
          </select>
          {validationErrors.teamLeaderId && (
            <p style={{ color: '#e53935', fontSize: '12px', marginTop: '6px' }}>
              <i className="fas fa-info-circle" style={{ marginRight: '4px' }}></i>
              {validationErrors.teamLeaderId}
            </p>
          )}
        </div>

        {/* Assignment Reason */}
        <FormInput
          label="Assignment Reason"
          type="textarea"
          value={assignmentReason}
          onChange={(e) => {
            setAssignmentReason(e.target.value);
            setValidationErrors(prev => ({ ...prev, reason: null }));
          }}
          placeholder="Explain why this case is being handed off to this team leader..."
          error={validationErrors.reason}
          rows={4}
          className={validationErrors.reason ? 'error' : ''}
          required
        />

        {/* Character Count */}
        <div style={{
          fontSize: '12px',
          color: '#999',
          marginBottom: '24px',
          textAlign: 'right',
        }}>
          {assignmentReason.length}/500 characters
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !isFormValid}
          style={{
            width: '100%',
            padding: '12px',
            background: submitting || !isFormValid ? '#ccc' : '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: submitting || !isFormValid ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            opacity: submitting || !isFormValid ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!submitting && isFormValid) {
              e.target.style.background = '#45a049';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!submitting && isFormValid) {
              e.target.style.background = '#4caf50';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {submitting ? (
            <>
              <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
              Processing Handoff...
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>
              Hand Off Case
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default CaseHandoffForm;
