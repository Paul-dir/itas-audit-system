# CaseStatusDisplay Component - Task 8.3.1

## Overview

This is a React functional component built in TypeScript that displays enhanced case status information with workflow progression tracking. It supports the case handoff and auditor assignment workflow.

**Location**: `frontend/back-office-ui/src/components/case-details/CaseStatusDisplay.tsx`

## Features

### 1. Case Status Display with Color Coding
- **PENDING_ASSIGNMENT**: Yellow (#ff9800)
- **APPROVED**: Green (#4caf50)
- **TEAM_ASSIGNED**: Blue (#1976d2)
- **AUDITOR_ASSIGNED**: Purple (#7b1fa2)

### 2. Handoff Information
When case status >= TEAM_ASSIGNED:
- Team leader name (displays "Not yet assigned" if null)
- Handoff date (formatted timestamp)
- Handoff reason (text explanation)

### 3. Auditor Assignment Information
When case status >= AUDITOR_ASSIGNED:
- Auditor name (displays "Not yet assigned" if null)
- Auditor code (optional field)
- Assignment date (formatted timestamp)

### 4. Workflow Progression
Visual timeline showing progression through:
1. Case Approval
2. Team Leader Handoff
3. Auditor Assignment

Each stage shows completion status with checkmarks or pending indicators.

### 5. Responsive Design
- **Desktop**: Grid layout for status badges
- **Tablet**: Responsive grid with auto-fit
- **Mobile**: Stack layout with full-width elements
- Uses flexbox for flexible, responsive containers

### 6. Loading and Error States
- Loading indicator while data is fetching
- Error message display with appropriate styling
- Graceful handling of missing data

## Component Props

```typescript
interface CaseStatusDisplayProps {
  caseData?: {
    id?: string;
    caseNumber?: string;
    status?: string;  // PENDING_ASSIGNMENT, APPROVED, TEAM_ASSIGNED, AUDITOR_ASSIGNED
    assignedTeamLeaderId?: string;
    assignedTeamLeaderName?: string;
    handoffDate?: string;  // ISO datetime string
    handoffReason?: string;
    assignedAuditorId?: string;
    assignedAuditorName?: string;
    auditorCode?: string;
    assignedDate?: string;  // ISO datetime string
  };
  onFetchUserNames?: (namesToFetch: UserNameFetchRequest[]) => Promise<UserNameFetchResponse>;
  isLoading?: boolean;
  error?: string;
}
```

## Usage Example

### Basic Usage
```tsx
import CaseStatusDisplay from './CaseStatusDisplay';

function CaseDetail() {
  const caseData = {
    caseNumber: 'CASE-2024-001',
    status: 'AUDITOR_ASSIGNED',
    assignedTeamLeaderName: 'John Smith',
    handoffDate: '2024-01-15T10:30:00Z',
    handoffReason: 'Case ready for team processing',
    assignedAuditorName: 'Jane Doe',
    auditorCode: 'AUD-001',
    assignedDate: '2024-01-16T14:45:00Z',
  };

  return <CaseStatusDisplay caseData={caseData} />;
}
```

### With Loading State
```tsx
const [caseData, setCaseData] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetchCaseData()
    .then(setCaseData)
    .catch(err => setError(err.message))
    .finally(() => setIsLoading(false));
}, []);

return (
  <CaseStatusDisplay 
    caseData={caseData}
    isLoading={isLoading}
    error={error}
  />
);
```

### With User Name Fetching
```tsx
const handleFetchUserNames = async (namesToFetch) => {
  const response = await fetch('/api/users/batch', {
    method: 'POST',
    body: JSON.stringify({ ids: namesToFetch.map(n => n.id) }),
  });
  return response.json();
};

return (
  <CaseStatusDisplay 
    caseData={caseData}
    onFetchUserNames={handleFetchUserNames}
  />
);
```

## Acceptance Criteria

### ✅ AC1: Component displays all fields correctly
- Case number displayed
- Status shown with human-readable label
- Team leader name shown (when available)
- Auditor name shown (when available)
- Auditor code shown (when provided)
- Handoff date shown (when available)
- Handoff reason shown (when available)
- Assignment date shown (when available)

### ✅ AC2: Status enum values displayed as human-readable labels
- PENDING_ASSIGNMENT → "Pending Assignment"
- APPROVED → "Approved"
- TEAM_ASSIGNED → "Team Assigned"
- AUDITOR_ASSIGNED → "Auditor Assigned"

### ✅ AC3: Timestamps formatted consistently
- Format: "Mon DD, YYYY, HH:MM AM/PM"
- Example: "Jan 15, 2024, 10:30 AM"
- All dates use same locale-aware formatting

### ✅ AC4: Responsive design works on mobile/tablet/desktop
- Mobile: Single column layout, full-width containers
- Tablet: 2-3 column grid with responsive auto-fit
- Desktop: 3 column grid for badges, proper spacing
- Uses CSS Grid with `repeat(auto-fit, minmax(150px, 1fr))`

### ✅ AC5: Handles missing values gracefully
- Missing team leader name → "Not yet assigned"
- Missing auditor name → "Not yet assigned"
- Missing optional fields not rendered
- No crashes with null/undefined values
- Renders correctly with minimal data

## Styling Approach

Component uses inline styles (React CSSProperties) for:
- Complete encapsulation without external CSS dependencies
- Easy theme customization through props
- Consistent styling across environments
- No CSS class conflicts

### Color Scheme
- **Primary Colors**: Status-specific colors (yellow, green, blue, purple)
- **Text Colors**: Dark (#333), Medium (#666), Light (#999)
- **Backgrounds**: Light backgrounds (#f9f9f9, #f5f5f5)
- **Borders**: Light borders (#e0e0e0)

## Timestamp Formatting

Timestamps are formatted using JavaScript's `toLocaleString()`:
- Year: numeric (2024)
- Month: short (Jan, Feb, etc.)
- Day: numeric (15)
- Hour: 2-digit (10)
- Minute: 2-digit (30)
- Locale: en-US

## Loading State

When `isLoading={true}`:
- Displays spinner icon
- Shows "Loading case information..." message
- Prevents interaction with case data
- Loading state takes priority over error state

## Error State

When `error` prop is provided:
- Displays error message in red alert box
- Shows error icon
- Does not prevent displaying existing case data if available
- Error state lower priority than loading state

## User Name Fetching

The component can optionally fetch user names asynchronously:
1. Detects when IDs are present but names are missing
2. Calls `onFetchUserNames` callback with missing name IDs
3. Updates state with fetched names
4. Handles fetch errors gracefully without crashing

## Testing

Comprehensive test suite included in `CaseStatusDisplay.test.tsx`:
- Field display tests
- Status enum label tests
- Missing value handling
- Loading/error state tests
- Timestamp formatting tests
- Workflow progression tests
- Responsive design tests
- User name fetching tests
- All acceptance criteria validation

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires React 19.x or later

## Dependencies

- React 19.2.7+
- TypeScript 5.0+ (for development)
- Font Awesome 6.0+ (for icons via CDN)

## Integration Notes

### With API Endpoints
Component expects ApAuditCase objects from backend with:
- `assignedTeamLeaderId` UUID
- `handoffDate` ISO timestamp
- `handoffReason` text
- `assignedAuditorId` UUID
- `assignedDate` ISO timestamp
- Additional user name fields for display optimization

### With State Management
Works with any state management solution:
- Redux
- Context API
- Zustand
- MobX

### With Routing
Can be embedded in:
- Case detail pages
- Case list views
- Dashboard widgets
- Modal dialogs

## Performance Considerations

- Component is lightweight with minimal re-renders
- useEffect hook optimized with dependency array
- No unnecessary state updates
- Responsive design uses native CSS Grid (hardware accelerated)
- Icons loaded from CDN (external dependency)

## Future Enhancements

Potential improvements:
- Internationalization (i18n) support
- Configurable date formats
- Custom color scheme props
- Animation transitions
- Copy-to-clipboard for case number
- Print-friendly layout
- Accessibility improvements (ARIA labels)

## Author Notes

This component implements the final frontend task for the case handoff and auditor assignment workflow. It displays the results of handoff operations (6.1.1) and auditor assignment operations (6.2.1), providing users with clear visibility into case workflow progression.

The component is framework-agnostic styling (no Tailwind, no Styled Components), making it easily portable to other projects or integrable with different styling systems.
