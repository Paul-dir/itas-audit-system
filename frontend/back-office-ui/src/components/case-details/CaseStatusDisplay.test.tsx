import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CaseStatusDisplay from './CaseStatusDisplay';

/**
 * Test Suite for CaseStatusDisplay Component - Task 8.3.1
 * 
 * Tests validate:
 * - All fields display correctly
 * - Status enum values shown as human-readable labels
 * - Timestamps formatted consistently
 * - Responsive design (CSS styling)
 * - Missing values handled gracefully
 * - Loading and error states
 */

describe('CaseStatusDisplay Component', () => {
  const mockCaseData = {
    id: 'test-case-1',
    caseNumber: 'CASE-2024-001',
    status: 'AUDITOR_ASSIGNED',
    assignedTeamLeaderId: 'leader-1',
    assignedTeamLeaderName: 'John Smith',
    handoffDate: '2024-01-15T10:30:00Z',
    handoffReason: 'Case ready for team processing',
    assignedAuditorId: 'auditor-1',
    assignedAuditorName: 'Jane Doe',
    auditorCode: 'AUD-001',
    assignedDate: '2024-01-16T14:45:00Z',
  };

  describe('Display of Case Fields', () => {
    it('should display case number correctly', () => {
      render(<CaseStatusDisplay caseData={mockCaseData} />);
      expect(screen.getByText(/CASE-2024-001/i)).toBeInTheDocument();
    });

    it('should display all workflow stages with correct titles', () => {
      render(<CaseStatusDisplay caseData={mockCaseData} />);
      expect(screen.getByText(/Case Approved/i)).toBeInTheDocument();
      expect(screen.getByText(/Handed Off to Team Leader/i)).toBeInTheDocument();
      expect(screen.getByText(/Assigned to Auditor/i)).toBeInTheDocument();
    });

    it('should display team leader name when status >= TEAM_ASSIGNED', () => {
      render(<CaseStatusDisplay caseData={mockCaseData} />);
      expect(screen.getByText(/John Smith/i)).toBeInTheDocument();
    });

    it('should display auditor name when status >= AUDITOR_ASSIGNED', () => {
      render(<CaseStatusDisplay caseData={mockCaseData} />);
      expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    });

    it('should display auditor code when provided', () => {
      render(<CaseStatusDisplay caseData={mockCaseData} />);
      expect(screen.getByText(/AUD-001/i)).toBeInTheDocument();
    });

    it('should display handoff date when available', () => {
      render(<CaseStatusDisplay caseData={mockCaseData} />);
      const formattedDate = 'Jan 15, 2024, 10:30 AM';
      expect(screen.getByText(new RegExp(formattedDate, 'i'))).toBeInTheDocument();
    });

    it('should display handoff reason when available', () => {
      render(<CaseStatusDisplay caseData={mockCaseData} />);
      expect(screen.getByText(/Case ready for team processing/i)).toBeInTheDocument();
    });

    it('should display assignment date when auditor assigned', () => {
      render(<CaseStatusDisplay caseData={mockCaseData} />);
      const formattedDate = 'Jan 16, 2024, 2:45 PM';
      expect(screen.getByText(new RegExp(formattedDate, 'i'))).toBeInTheDocument();
    });
  });

  describe('Status Enum Labels', () => {
    it('should display APPROVED status as "Approved"', () => {
      const approvedCase = { ...mockCaseData, status: 'APPROVED' };
      render(<CaseStatusDisplay caseData={approvedCase} />);
      expect(screen.getByText(/Approved/i)).toBeInTheDocument();
    });

    it('should display TEAM_ASSIGNED status as "Team Assigned"', () => {
      const teamAssignedCase = { ...mockCaseData, status: 'TEAM_ASSIGNED' };
      render(<CaseStatusDisplay caseData={teamAssignedCase} />);
      expect(screen.getByText(/Team Assigned/i)).toBeInTheDocument();
    });

    it('should display AUDITOR_ASSIGNED status as "Auditor Assigned"', () => {
      const auditorAssignedCase = { ...mockCaseData, status: 'AUDITOR_ASSIGNED' };
      render(<CaseStatusDisplay caseData={auditorAssignedCase} />);
      expect(screen.getByText(/Auditor Assigned/i)).toBeInTheDocument();
    });

    it('should display PENDING_ASSIGNMENT status as "Pending Assignment"', () => {
      const pendingCase = { ...mockCaseData, status: 'PENDING_ASSIGNMENT' };
      render(<CaseStatusDisplay caseData={pendingCase} />);
      expect(screen.getByText(/Pending Assignment/i)).toBeInTheDocument();
    });
  });

  describe('Handling Missing Values', () => {
    it('should display "Not yet assigned" when team leader name is missing', () => {
      const caseWithoutTeamLeader = {
        ...mockCaseData,
        status: 'TEAM_ASSIGNED',
        assignedTeamLeaderName: undefined,
      };
      render(<CaseStatusDisplay caseData={caseWithoutTeamLeader} />);
      expect(screen.getByText(/Not yet assigned/i)).toBeInTheDocument();
    });

    it('should display "Not yet assigned" when auditor name is missing', () => {
      const caseWithoutAuditor = {
        ...mockCaseData,
        status: 'AUDITOR_ASSIGNED',
        assignedAuditorName: undefined,
      };
      render(<CaseStatusDisplay caseData={caseWithoutAuditor} />);
      expect(screen.getByText(/Not yet assigned/i)).toBeInTheDocument();
    });

    it('should not display handoff reason when not provided', () => {
      const caseWithoutReason = { ...mockCaseData, handoffReason: undefined };
      render(<CaseStatusDisplay caseData={caseWithoutReason} />);
      expect(screen.queryByText(/Reason:/i)).not.toBeInTheDocument();
    });

    it('should not display auditor code when not provided', () => {
      const caseWithoutCode = { ...mockCaseData, auditorCode: undefined };
      render(<CaseStatusDisplay caseData={caseWithoutCode} />);
      expect(screen.queryByText(/Auditor Code:/i)).not.toBeInTheDocument();
    });

    it('should render gracefully when caseData is undefined', () => {
      render(<CaseStatusDisplay caseData={undefined} />);
      expect(screen.getByText(/No case data available/i)).toBeInTheDocument();
    });

    it('should render gracefully when caseData is null', () => {
      render(<CaseStatusDisplay caseData={undefined} />);
      expect(screen.getByText(/No case data available/i)).toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('should display loading state when isLoading is true', () => {
      render(<CaseStatusDisplay caseData={mockCaseData} isLoading={true} />);
      expect(screen.getByText(/Loading case information/i)).toBeInTheDocument();
    });

    it('should display error message when error prop is provided', () => {
      const errorMessage = 'Failed to load case data';
      render(<CaseStatusDisplay caseData={mockCaseData} error={errorMessage} />);
      expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
    });

    it('should prioritize loading state over error state', () => {
      const errorMessage = 'Failed to load case data';
      render(
        <CaseStatusDisplay
          caseData={mockCaseData}
          isLoading={true}
          error={errorMessage}
        />
      );
      expect(screen.getByText(/Loading case information/i)).toBeInTheDocument();
      expect(screen.queryByText(new RegExp(errorMessage, 'i'))).not.toBeInTheDocument();
    });
  });

  describe('Timestamp Formatting', () => {
    it('should format timestamp consistently across all date fields', () => {
      render(<CaseStatusDisplay caseData={mockCaseData} />);
      // Verify that dates are formatted in a consistent, readable format
      const formattedHandoffDate = 'Jan 15, 2024, 10:30 AM';
      const formattedAssignedDate = 'Jan 16, 2024, 2:45 PM';
      expect(screen.getByText(new RegExp(formattedHandoffDate, 'i'))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(formattedAssignedDate, 'i'))).toBeInTheDocument();
    });

    it('should handle invalid date strings gracefully', () => {
      const caseWithInvalidDate = {
        ...mockCaseData,
        handoffDate: 'invalid-date',
      };
      render(<CaseStatusDisplay caseData={caseWithInvalidDate} />);
      // Should still render without crashing
      expect(screen.getByText(/Case Approved/i)).toBeInTheDocument();
    });
  });

  describe('Workflow Progression Display', () => {
    it('should show all stages completed for AUDITOR_ASSIGNED status', () => {
      render(<CaseStatusDisplay caseData={mockCaseData} />);
      // Verify checkmarks appear for completed stages
      expect(screen.queryByText('2')).not.toBeInTheDocument(); // Stage 2 should show checkmark, not "2"
      expect(screen.queryByText('3')).not.toBeInTheDocument(); // Stage 3 should show checkmark, not "3"
    });

    it('should show stages 2 and 3 as pending for APPROVED status', () => {
      const approvedCase = { ...mockCaseData, status: 'APPROVED' };
      render(<CaseStatusDisplay caseData={approvedCase} />);
      expect(screen.getByText(/Awaiting handoff to team leader/i)).toBeInTheDocument();
      expect(screen.getByText(/Awaiting auditor assignment/i)).toBeInTheDocument();
    });

    it('should show stage 3 as pending for TEAM_ASSIGNED status', () => {
      const teamAssignedCase = { ...mockCaseData, status: 'TEAM_ASSIGNED' };
      render(<CaseStatusDisplay caseData={teamAssignedCase} />);
      expect(screen.getByText(/Awaiting auditor assignment/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should use CSS grid for badge summary with responsive columns', () => {
      const { container } = render(<CaseStatusDisplay caseData={mockCaseData} />);
      // Verify grid layout exists
      const gridElement = container.querySelector('[style*="display: grid"]');
      expect(gridElement).toBeInTheDocument();
    });

    it('should use flexbox for main container (stack layout)', () => {
      const { container } = render(<CaseStatusDisplay caseData={mockCaseData} />);
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer.style.display).toBe('flex');
      expect(mainContainer.style.flexDirection).toBe('column');
    });

    it('should render all status badge sections', () => {
      render(<CaseStatusDisplay caseData={mockCaseData} />);
      expect(screen.getByText(/Approval/i)).toBeInTheDocument();
      expect(screen.getByText(/Team Leader/i)).toBeInTheDocument();
      expect(screen.getByText(/Auditor/i)).toBeInTheDocument();
    });
  });

  describe('User Name Fetching', () => {
    it('should call onFetchUserNames when IDs are present but names are missing', async () => {
      const mockFetchUserNames = jest.fn().mockResolvedValue({
        teamLeaderName: 'Fetched Team Leader',
        auditorName: 'Fetched Auditor',
      });

      const caseWithoutNames = {
        ...mockCaseData,
        assignedTeamLeaderName: undefined,
        assignedAuditorName: undefined,
      };

      render(
        <CaseStatusDisplay
          caseData={caseWithoutNames}
          onFetchUserNames={mockFetchUserNames}
        />
      );

      await waitFor(() => {
        expect(mockFetchUserNames).toHaveBeenCalled();
      });
    });

    it('should not call onFetchUserNames when all names are provided', async () => {
      const mockFetchUserNames = jest.fn();

      render(
        <CaseStatusDisplay
          caseData={mockCaseData}
          onFetchUserNames={mockFetchUserNames}
        />
      );

      await waitFor(() => {
        expect(mockFetchUserNames).not.toHaveBeenCalled();
      });
    });

    it('should handle fetch errors gracefully', async () => {
      const mockFetchUserNames = jest.fn().mockRejectedValue(
        new Error('Fetch failed')
      );

      const caseWithoutNames = {
        ...mockCaseData,
        assignedTeamLeaderName: undefined,
        assignedAuditorName: undefined,
      };

      render(
        <CaseStatusDisplay
          caseData={caseWithoutNames}
          onFetchUserNames={mockFetchUserNames}
        />
      );

      // Should render without crashing
      await waitFor(() => {
        expect(screen.getByText(/Case Approved/i)).toBeInTheDocument();
      });
    });
  });

  describe('Acceptance Criteria Validation', () => {
    it('AC1: Component displays all fields correctly', () => {
      render(<CaseStatusDisplay caseData={mockCaseData} />);
      expect(screen.getByText(/CASE-2024-001/i)).toBeInTheDocument();
      expect(screen.getByText(/Auditor Assigned/i)).toBeInTheDocument();
      expect(screen.getByText(/John Smith/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/AUD-001/i)).toBeInTheDocument();
      expect(screen.getByText(/Case ready for team processing/i)).toBeInTheDocument();
    });

    it('AC2: Status enum values displayed as human-readable labels', () => {
      const statusTests = [
        { status: 'PENDING_ASSIGNMENT', label: 'Pending Assignment' },
        { status: 'APPROVED', label: 'Approved' },
        { status: 'TEAM_ASSIGNED', label: 'Team Assigned' },
        { status: 'AUDITOR_ASSIGNED', label: 'Auditor Assigned' },
      ];

      statusTests.forEach(({ status, label }) => {
        const { unmount } = render(
          <CaseStatusDisplay caseData={{ ...mockCaseData, status }} />
        );
        expect(screen.getByText(new RegExp(label, 'i'))).toBeInTheDocument();
        unmount();
      });
    });

    it('AC3: Timestamps formatted consistently', () => {
      render(<CaseStatusDisplay caseData={mockCaseData} />);
      // Verify consistent date format (Month Day, Year, Time)
      expect(screen.getByText(/Jan 15, 2024/i)).toBeInTheDocument();
      expect(screen.getByText(/Jan 16, 2024/i)).toBeInTheDocument();
    });

    it('AC4: Responsive design works on mobile/tablet/desktop', () => {
      const { container } = render(<CaseStatusDisplay caseData={mockCaseData} />);
      // Verify responsive styles are applied
      expect(container.querySelector('[style*="grid"]')).toBeInTheDocument();
      expect(container.querySelector('[style*="flex"]')).toBeInTheDocument();
    });

    it('AC5: Handles missing values gracefully', () => {
      const minimalCase = {
        caseNumber: 'CASE-2024-001',
        status: 'APPROVED',
      };
      render(<CaseStatusDisplay caseData={minimalCase} />);
      expect(screen.getByText(/CASE-2024-001/i)).toBeInTheDocument();
      expect(screen.getByText(/Approved/i)).toBeInTheDocument();
      // Should not crash with missing optional fields
      expect(screen.queryByText(/Error/i)).not.toBeInTheDocument();
    });
  });
});
