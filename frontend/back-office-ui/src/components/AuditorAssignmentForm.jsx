import React, { useState, useEffect } from 'react';
import './forms.css';

/**
 * AuditorAssignmentForm Component - Phase 8.2.1
 * 
 * Allows team leader to assign an auditor from their team to a case.
 * 
 * Features:
 * - Case selector (dropdown) showing TEAM_ASSIGNED cases only
 * - Display selected case details (case number, tax center, assignment status)
 * - Auditor dropdown populated from current user's team members
 * - Disabled state with message "No team members available for assignment" if team empty (C3 fix)
 * - Submit button (disabled until form valid and auditor selected)
 * - Loading state during submission
 * - Success message on completion showing case number, assigned auditor, timestamp
 * - Error messages for each error type (including C2 and C3 fixes)
 * 
 * Integration:
 * - GET /api/v1/backoffice/cases?status=TEAM_ASSIGNED - fetch cases
 * - GET /api/v1/backoffice/team-members/active - fetch current user's active team members
 * - POST /api/v1/backoffice/cases/{caseId}/assign-auditor - submit assignment
 * 
 * Bug Fixes:
 * - C2: AUDITOR_NOT_IN_TEAM error handled with clear message
 * - C3: NO_TEAM_MEMBERS error handled with disabled form and clear message
 */
function AuditorAssignmentForm() {
  // Form state
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [selectedAuditorId, setSelectedAuditorId] = useState('');
  
  // Data state
  const [cases, setCases] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedCaseDetails, setSelectedCaseDetails] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [noTeamMembersMessage, setNoTeamMembersMessage] = useState(null);

  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

  // Fetch cases on component mount
  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiBaseUrl}/backoffice/cases?status=TEAM_ASSIGNED`);
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

  // Fetch team members on component mount
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/backoffice/team-members/active`);
        if (!response.ok) throw new Error('Failed to fetch team members');
        const data = await response.json();
        const members = Array.isArray(data) ? data : data.data || [];
        
        setTeamMembers(members);
        
        // C3 Bug Fix: Detect empty team and set message
        if (members.length === 0) {
          setNoTeamMembersMessage('No active team members available for assignment');
        } else {
          setNoTeamMembersMessage(null);
        }
      } catch (err) {
        setError('Failed to load team members. Please refresh and try again.');
        console.error('Error fetching team members:', err);
      }
    };

    fetchTeamMembers();
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

    if (!selectedAuditorId) {
      errors.auditorId = 'Please select an auditor';
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
        `${apiBaseUrl}/backoffice/cases/${selectedCaseId}/assign-auditor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            auditorId: selectedAuditorId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error types
        if (data.error === 'CASE_NOT_FOUND') {
          setError('Case not found. Please refresh and try again.');
        } else if (data.error === 'INVALID_CASE_STATE') {
          setError(`Case is not in TEAM_ASSIGNED status. Current: ${data.currentStatus}`);
        } else if (data.error === 'UNAUTHORIZED') {
          setError('You are not authorized to assign auditors for this case.');
        } else if (data.error === 'NO_TEAM_MEMBERS') {
          // C3 Bug Fix: Clear message for empty team
          setError('No team members available for assignment.');
        } else if (data.error === 'AUDITOR_NOT_IN_TEAM') {
          // C2 Bug Fix: Auditor not in team error
          setError('Selected auditor is not a member of your team.');
        } else if (data.error === 'AUDITOR_NOT_FOUND') {
          setError('Auditor not found in system.');
        } else {
          setError(data.message || 'Failed to assign auditor. Please try again or contact support.');
        }
        return;
      }

      // Success!
      const auditor = teamMembers.find(a => a.id === selectedAuditorId);
      setSuccess({
        caseNumber: data.caseNumber,
        auditorName: data.auditorName || auditor?.fullName || auditor?.name || selectedAuditorId,
        timestamp: new Date(data.assignedDate).toLocaleString(),
      });

      // Reset form
      setSelectedCaseId('');
      setSelectedAuditorId('');
      setValidationErrors({});
    } catch (err) {
      setError('Failed to assign auditor. Please try again or contact support.');
      console.error('Error submitting auditor assignment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = selectedCaseId && selectedAuditorId && teamMembers.length > 0;
  const isFormDisabled = noTeamMembersMessage !== null;

  return (
    <div className="form-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="form-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '28px', fontWeight: '700' }}>
          <i className="fas fa-user-check" style={{ marginRight: '12px', color: '#1976d2' }}></i>
          Assign Auditor to Case
        </h1>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          Assign an auditor from your team to execute a case
        </p>
      </div>

      {/* C3 Bug Fix: Empty team message */}
      {noTeamMembersMessage && (
        <div className="warning-message" style={{
          background: 'rgba(255, 193, 7, 0.1)',
          border: '1px solid rgba(255, 193, 7, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          fontSize: '14px',
          color: '#f57f17',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}></i>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>No Team Members Available</div>
              <div style={{ fontSize: '13px' }}>
                {noTeamMembersMessage}. Please contact your administrator to add team members.
              </div>
            </div>
          </div>
        </div>
      )}

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
              <div style={{ fontWeight: '600', marginBottom: '8px' }}>Auditor Assignment Successful!</div>
              <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                <strong>Case:</strong> {success.caseNumber}<br />
                <strong>Assigned Auditor:</strong> {success.auditorName}<br />
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
        <div className="form-group" style={{ marginBottom: '24px', opacity: isFormDisabled ? 0.6 : 1 }}>
          <label htmlFor="case-select" style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#333',
          }}>
            <i className="fas fa-folder" style={{ marginRight: '8px', color: '#1976d2' }}></i>
            Case <span style={{ color: '#e53935' }}>*</span>
          </label>
          <select
            id="case-select"
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            disabled={loading || cases.length === 0 || isFormDisabled}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: validationErrors.caseId ? '2px solid #e53935' : '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: loading || cases.length === 0 || isFormDisabled ? '#f5f5f5' : '#fff',
              cursor: loading || cases.length === 0 || isFormDisabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              if (!validationErrors.caseId && !isFormDisabled) {
                e.target.style.borderColor = '#1976d2';
                e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
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
            opacity: isFormDisabled ? 0.6 : 1,
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
              <div style={{ fontWeight: '600', color: '#1976d2' }}>TEAM_ASSIGNED</div>
            </div>
            <div>
              <div style={{ color: '#999', fontSize: '11px', textTransform: 'uppercase', marginBottom: '4px' }}>Assignment Status</div>
              <div style={{ fontWeight: '600', color: '#333' }}>Awaiting Auditor</div>
            </div>
          </div>
        )}

        {/* Auditor Selection */}
        <div className="form-group" style={{ marginBottom: '24px', opacity: isFormDisabled ? 0.6 : 1 }}>
          <label htmlFor="auditor-select" style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#333',
          }}>
            <i className="fas fa-user-tie" style={{ marginRight: '8px', color: '#1976d2' }}></i>
            Auditor <span style={{ color: '#e53935' }}>*</span>
          </label>
          <select
            id="auditor-select"
            value={selectedAuditorId}
            onChange={(e) => {
              setSelectedAuditorId(e.target.value);
              setValidationErrors(prev => ({ ...prev, auditorId: null }));
            }}
            disabled={teamMembers.length === 0 || isFormDisabled}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: validationErrors.auditorId ? '2px solid #e53935' : '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: teamMembers.length === 0 || isFormDisabled ? '#f5f5f5' : '#fff',
              cursor: teamMembers.length === 0 || isFormDisabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              if (!validationErrors.auditorId && !isFormDisabled) {
                e.target.style.borderColor = '#1976d2';
                e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)';
              }
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">{teamMembers.length === 0 ? 'No auditors available' : 'Select an auditor'}</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.fullName || member.name} ({member.auditorCode || 'N/A'})
              </option>
            ))}
          </select>
          {validationErrors.auditorId && (
            <p style={{ color: '#e53935', fontSize: '12px', marginTop: '6px' }}>
              <i className="fas fa-info-circle" style={{ marginRight: '4px' }}></i>
              {validationErrors.auditorId}
            </p>
          )}
          {teamMembers.length > 0 && (
            <p style={{ color: '#999', fontSize: '12px', marginTop: '6px' }}>
              <i className="fas fa-info-circle" style={{ marginRight: '4px' }}></i>
              {teamMembers.length} active team member{teamMembers.length !== 1 ? 's' : ''} available
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !isFormValid || isFormDisabled}
          style={{
            width: '100%',
            padding: '12px',
            background: submitting || !isFormValid || isFormDisabled ? '#ccc' : '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: submitting || !isFormValid || isFormDisabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            opacity: submitting || !isFormValid || isFormDisabled ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!submitting && isFormValid && !isFormDisabled) {
              e.target.style.background = '#1565c0';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!submitting && isFormValid && !isFormDisabled) {
              e.target.style.background = '#1976d2';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          {submitting ? (
            <>
              <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
              Assigning Auditor...
            </>
          ) : (
            <>
              <i className="fas fa-check-double" style={{ marginRight: '8px' }}></i>
              Assign Auditor
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default AuditorAssignmentForm;
