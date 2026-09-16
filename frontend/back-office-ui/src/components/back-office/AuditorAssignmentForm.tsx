import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ExclamationTriangle, Loader, User, Folder } from 'lucide-react';

interface Case {
  id: string;
  caseNumber: string;
  taxCenter: string;
  status: string;
}

interface TeamMember {
  id: string;
  fullName?: string;
  name?: string;
  auditorCode?: string;
}

interface SuccessMessage {
  caseNumber: string;
  auditorName: string;
  timestamp: string;
}

interface ValidationErrors {
  caseId?: string;
  auditorId?: string;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
  currentStatus?: string;
}

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
const AuditorAssignmentForm: React.FC = () => {
  // Form state
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [selectedAuditorId, setSelectedAuditorId] = useState<string>('');
  
  // Data state
  const [cases, setCases] = useState<Case[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedCaseDetails, setSelectedCaseDetails] = useState<Case | null>(null);
  
  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessMessage | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [noTeamMembersMessage, setNoTeamMembersMessage] = useState<string | null>(null);

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
    setValidationErrors(prev => ({ ...prev, caseId: undefined }));
  }, [selectedCaseId, cases]);

  // Validate form
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      const data: ApiErrorResponse & {
        caseNumber?: string;
        auditorName?: string;
        assignedDate?: string;
      } = await response.json();

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
        caseNumber: data.caseNumber || '',
        auditorName: data.auditorName || auditor?.fullName || auditor?.name || selectedAuditorId,
        timestamp: new Date(data.assignedDate || new Date()).toLocaleString(),
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <User className="w-8 h-8 text-blue-600" />
          Assign Auditor to Case
        </h1>
        <p className="text-gray-600 text-sm">
          Assign an auditor from your team to execute a case
        </p>
      </div>

      {/* C3 Bug Fix: Empty team message */}
      {noTeamMembersMessage && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
          <ExclamationTriangle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-yellow-800">No Team Members Available</div>
            <div className="text-sm text-yellow-700 mt-1">
              {noTeamMembersMessage}. Please contact your administrator to add team members.
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-green-800">Auditor Assignment Successful!</div>
            <div className="text-sm text-green-700 mt-2 space-y-1">
              <div><strong>Case:</strong> {success.caseNumber}</div>
              <div><strong>Assigned Auditor:</strong> {success.auditorName}</div>
              <div><strong>Timestamp:</strong> {success.timestamp}</div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-800">Error</div>
            <div className="text-sm text-red-700 mt-1">{error}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Case Selection */}
        <div className={`${isFormDisabled ? 'opacity-60' : ''}`}>
          <label htmlFor="case-select" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Folder className="w-4 h-4 text-blue-600" />
            Case <span className="text-red-500">*</span>
          </label>
          <select
            id="case-select"
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            disabled={loading || cases.length === 0 || isFormDisabled}
            className={`w-full px-3 py-2 border rounded-md text-sm transition-colors ${
              validationErrors.caseId
                ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500'
                : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            } ${
              loading || cases.length === 0 || isFormDisabled
                ? 'bg-gray-50 cursor-not-allowed'
                : 'bg-white cursor-pointer'
            }`}
          >
            <option value="">{loading ? 'Loading cases...' : 'Select a case'}</option>
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} - {c.taxCenter}
              </option>
            ))}
          </select>
          {validationErrors.caseId && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {validationErrors.caseId}
            </p>
          )}
        </div>

        {/* Case Details Display */}
        {selectedCaseDetails && (
          <div className={`p-4 bg-gray-50 border border-gray-200 rounded-md grid grid-cols-2 gap-4 text-sm ${isFormDisabled ? 'opacity-60' : ''}`}>
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Case Number</div>
              <div className="font-semibold text-gray-900">{selectedCaseDetails.caseNumber}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Tax Center</div>
              <div className="font-semibold text-gray-900">{selectedCaseDetails.taxCenter}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</div>
              <div className="font-semibold text-blue-600">TEAM_ASSIGNED</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Assignment Status</div>
              <div className="font-semibold text-gray-900">Awaiting Auditor</div>
            </div>
          </div>
        )}

        {/* Auditor Selection */}
        <div className={`${isFormDisabled ? 'opacity-60' : ''}`}>
          <label htmlFor="auditor-select" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Auditor <span className="text-red-500">*</span>
          </label>
          <select
            id="auditor-select"
            value={selectedAuditorId}
            onChange={(e) => {
              setSelectedAuditorId(e.target.value);
              setValidationErrors(prev => ({ ...prev, auditorId: undefined }));
            }}
            disabled={teamMembers.length === 0 || isFormDisabled}
            className={`w-full px-3 py-2 border rounded-md text-sm transition-colors ${
              validationErrors.auditorId
                ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500'
                : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            } ${
              teamMembers.length === 0 || isFormDisabled
                ? 'bg-gray-50 cursor-not-allowed'
                : 'bg-white cursor-pointer'
            }`}
          >
            <option value="">{teamMembers.length === 0 ? 'No auditors available' : 'Select an auditor'}</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.fullName || member.name} ({member.auditorCode || 'N/A'})
              </option>
            ))}
          </select>
          {validationErrors.auditorId && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {validationErrors.auditorId}
            </p>
          )}
          {teamMembers.length > 0 && (
            <p className="text-gray-500 text-xs mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {teamMembers.length} active team member{teamMembers.length !== 1 ? 's' : ''} available
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !isFormValid || isFormDisabled}
          className={`w-full py-2 px-4 rounded-md font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
            submitting || !isFormValid || isFormDisabled
              ? 'bg-gray-400 cursor-not-allowed opacity-60'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          {submitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Assigning Auditor...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Assign Auditor
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AuditorAssignmentForm;
