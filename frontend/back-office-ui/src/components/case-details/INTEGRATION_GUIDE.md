# CaseStatusDisplay Component - Integration Guide

## Overview

The `CaseStatusDisplay` component displays enhanced case status information including handoff workflow state and auditor assignments. This guide shows how to integrate it with the backend API and application architecture.

## Integration Points

### 1. API Data Flow

```
Backend (Java Spring Boot)
├── GET /api/v1/backoffice/cases/{caseId}
│   └── Returns: ApAuditCase with new fields
│       - assignedTeamLeaderId (UUID)
│       - assignedTeamLeaderName (string) - OPTIONAL
│       - handoffDate (ISO datetime)
│       - handoffReason (string)
│       - assignedAuditorId (UUID)
│       - assignedAuditorName (string) - OPTIONAL
│       - assignedDate (ISO datetime)
│       - auditorCode (string)
│
└── Component displays this data with:
    - Color-coded status badges
    - Timeline progression
    - Formatted timestamps
    - "Not yet assigned" placeholders
```

### 2. Data Dependencies

**From Backend API (Required fields)**:
- Case number
- Case status
- Team leader ID (when status >= TEAM_ASSIGNED)
- Handoff date (when status >= TEAM_ASSIGNED)
- Auditor ID (when status >= AUDITOR_ASSIGNED)
- Assignment date (when status >= AUDITOR_ASSIGNED)

**From Backend API (Optional fields)**:
- Team leader name (backend can include for optimization)
- Auditor name (backend can include for optimization)
- Auditor code
- Handoff reason

### 3. Component Integration

#### In a Case Detail Page

```tsx
import React, { useEffect, useState } from 'react';
import CaseStatusDisplay from './components/case-details/CaseStatusDisplay';

export function CaseDetailPage({ caseId }) {
  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/v1/backoffice/cases/${caseId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch case: ${response.statusText}`);
        }
        const data = await response.json();
        setCaseData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCase();
  }, [caseId]);

  return (
    <div className="case-detail-container">
      <h1>Case Details</h1>
      <CaseStatusDisplay 
        caseData={caseData}
        isLoading={isLoading}
        error={error}
      />
      {/* Other case details below */}
    </div>
  );
}
```

#### In a Case List View

```tsx
export function CaseListItem({ case: caseData }) {
  return (
    <div className="case-list-item">
      <h3>{caseData.caseNumber}</h3>
      {/* Minimal display of status */}
      <CaseStatusDisplay caseData={caseData} />
      <button onClick={() => navigate(`/cases/${caseData.id}`)}>
        View Details
      </button>
    </div>
  );
}
```

#### With User Name Fetching

```tsx
export function CaseDetailWithFetch() {
  const [caseData, setCaseData] = useState(null);

  const handleFetchUserNames = async (namesToFetch) => {
    // Request user names from backend when not included
    const response = await fetch('/api/v1/backoffice/users/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ids: namesToFetch.map(n => n.id),
      }),
    });
    const users = await response.json();
    
    return {
      teamLeaderName: users.find(u => u.id === namesToFetch[0]?.id)?.name,
      auditorName: users.find(u => u.id === namesToFetch[1]?.id)?.name,
      auditorCode: users.find(u => u.id === namesToFetch[1]?.id)?.code,
    };
  };

  return (
    <CaseStatusDisplay 
      caseData={caseData}
      onFetchUserNames={handleFetchUserNames}
    />
  );
}
```

## Backend Integration

### API Response Format

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "caseNumber": "CASE-2024-001",
  "status": "AUDITOR_ASSIGNED",
  "taxCenter": "TC-001",
  "assignedTeamLeaderId": "660e8400-e29b-41d4-a716-446655440001",
  "assignedTeamLeaderName": "John Smith",
  "handoffDate": "2024-01-15T10:30:00Z",
  "handoffReason": "Case ready for team processing",
  "assignedAuditorId": "770e8400-e29b-41d4-a716-446655440002",
  "assignedAuditorName": "Jane Doe",
  "auditorCode": "AUD-001",
  "assignedDate": "2024-01-16T14:45:00Z",
  "createdAt": "2024-01-10T08:00:00Z",
  "updatedAt": "2024-01-16T14:45:00Z"
}
```

### Optional Name Field Optimization

To avoid additional API calls, include user names in the case response:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "caseNumber": "CASE-2024-001",
  "status": "AUDITOR_ASSIGNED",
  "assignedTeamLeaderId": "660e8400-e29b-41d4-a716-446655440001",
  "assignedTeamLeaderName": "John Smith",  // ← Included for optimization
  "handoffDate": "2024-01-15T10:30:00Z",
  "handoffReason": "Case ready for team processing",
  "assignedAuditorId": "770e8400-e29b-41d4-a716-446655440002",
  "assignedAuditorName": "Jane Doe",       // ← Included for optimization
  "auditorCode": "AUD-001",
  "assignedDate": "2024-01-16T14:45:00Z"
}
```

If names are omitted, the component will fetch them via `onFetchUserNames` callback.

## State Management Integration

### With Redux

```tsx
import { useSelector, useDispatch } from 'react-redux';
import { fetchCase } from './slices/caseSlice';

export function CaseDetailWithRedux({ caseId }) {
  const dispatch = useDispatch();
  const { data: caseData, loading, error } = useSelector(
    state => state.case
  );

  useEffect(() => {
    dispatch(fetchCase(caseId));
  }, [caseId]);

  return (
    <CaseStatusDisplay 
      caseData={caseData}
      isLoading={loading}
      error={error}
    />
  );
}
```

### With React Query

```tsx
import { useQuery } from '@tanstack/react-query';

export function CaseDetailWithReactQuery({ caseId }) {
  const { data: caseData, isLoading, error } = useQuery({
    queryKey: ['case', caseId],
    queryFn: () => fetch(`/api/v1/backoffice/cases/${caseId}`).then(r => r.json()),
  });

  return (
    <CaseStatusDisplay 
      caseData={caseData}
      isLoading={isLoading}
      error={error?.message}
    />
  );
}
```

### With Context API

```tsx
import { useCaseContext } from './contexts/CaseContext';

export function CaseDetailWithContext({ caseId }) {
  const { case: caseData, loading, error } = useCaseContext();

  useEffect(() => {
    // Your context update logic
  }, [caseId]);

  return (
    <CaseStatusDisplay 
      caseData={caseData}
      isLoading={loading}
      error={error}
    />
  );
}
```

## Styling Integration

### With Tailwind CSS

The component uses inline styles for complete portability, but can be wrapped:

```tsx
export function CaseStatusDisplayWrapper(props) {
  return (
    <div className="p-4 bg-white rounded-lg">
      <CaseStatusDisplay {...props} />
    </div>
  );
}
```

### Custom Theme Styling

Create theme variations:

```tsx
const themes = {
  light: {
    backgroundColor: '#ffffff',
    textColor: '#333333',
  },
  dark: {
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
  },
};

export function ThemedCaseStatusDisplay({ caseData, theme = 'light' }) {
  // Component would need theme props passed (future enhancement)
  return <CaseStatusDisplay caseData={caseData} />;
}
```

## Error Handling Patterns

### Global Error Boundary

```tsx
import { ErrorBoundary } from 'react-error-boundary';

export function SafeCaseStatusDisplay(props) {
  return (
    <ErrorBoundary 
      fallback={<div>Error loading case status</div>}
      onError={(error) => console.error('Case display error:', error)}
    >
      <CaseStatusDisplay {...props} />
    </ErrorBoundary>
  );
}
```

### Error Recovery

```tsx
export function CaseStatusWithRetry({ caseId }) {
  const [caseData, setCaseData] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await fetch(`/api/v1/backoffice/cases/${caseId}`);
        setCaseData(await response.json());
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };

    if (retryCount < 3) {
      const timeout = setTimeout(fetchCase, retryCount * 1000);
      return () => clearTimeout(timeout);
    }
  }, [caseId, retryCount]);

  return (
    <>
      <CaseStatusDisplay caseData={caseData} error={error} />
      {error && (
        <button onClick={() => setRetryCount(c => c + 1)}>
          Retry ({retryCount}/3)
        </button>
      )}
    </>
  );
}
```

## Performance Optimization

### Memoization

```tsx
import { memo } from 'react';

const MemoizedCaseStatusDisplay = memo(CaseStatusDisplay, (prev, next) => {
  return prev.caseData?.id === next.caseData?.id &&
         prev.isLoading === next.isLoading &&
         prev.error === next.error;
});

export function CaseDetail() {
  return <MemoizedCaseStatusDisplay caseData={caseData} />;
}
```

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const CaseStatusDisplayLazy = lazy(() => import('./CaseStatusDisplay'));

export function CaseDetailWithLazyLoad() {
  return (
    <Suspense fallback={<div>Loading component...</div>}>
      <CaseStatusDisplayLazy caseData={caseData} />
    </Suspense>
  );
}
```

## Responsive Container

```tsx
export function ResponsiveCaseStatusDisplay(props) {
  return (
    <div style={{
      maxWidth: '100%',
      padding: '16px',
      '@media (max-width: 768px)': {
        padding: '8px',
      },
    }}>
      <CaseStatusDisplay {...props} />
    </div>
  );
}
```

## Testing Integration

### Unit Testing with Mock Data

```tsx
import { render, screen } from '@testing-library/react';
import CaseStatusDisplay from './CaseStatusDisplay';

const mockCaseData = {
  caseNumber: 'CASE-2024-001',
  status: 'AUDITOR_ASSIGNED',
  assignedTeamLeaderName: 'John Smith',
  handoffDate: '2024-01-15T10:30:00Z',
};

test('displays case status correctly', () => {
  render(<CaseStatusDisplay caseData={mockCaseData} />);
  expect(screen.getByText(/CASE-2024-001/)).toBeInTheDocument();
});
```

### Integration Testing with API

```tsx
import { server } from './test/server';

server.listen();

test('fetches and displays case data', async () => {
  server.use(
    http.get('/api/v1/backoffice/cases/:id', () => {
      return HttpResponse.json(mockCaseData);
    })
  );

  // Render component that fetches data
  render(<CaseDetailPage caseId="123" />);
  
  // Wait for data to load
  await screen.findByText(/CASE-2024-001/);
});
```

## Accessibility

### ARIA Labels

The component includes semantic icons that could be enhanced with ARIA:

```tsx
<i 
  className={`fas ${config.icon}`}
  aria-label={`Status: ${config.label}`}
  role="img"
/>
```

### Keyboard Navigation

Component is fully keyboard accessible through:
- Semantic HTML structure
- Click handlers (no hover-only interactions)
- Proper color contrast ratios

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+
- Android Chrome 90+

## Future Enhancement Opportunities

1. **Export to PDF**: Add print/export functionality
2. **Real-time Updates**: WebSocket integration for live status updates
3. **User Avatars**: Display user profile pictures with names
4. **Status Change History**: Show previous states/transitions
5. **Bulk Operations**: Handle multiple cases
6. **Customizable Workflows**: Support different workflow steps
7. **Internationalization**: i18n support for multi-language deployment
8. **Dark Mode**: Theme switching support

## Support & Troubleshooting

### Common Issues

**Q: Component shows "Not yet assigned" incorrectly**  
A: Check that API is returning user names in response, or implement `onFetchUserNames` callback

**Q: Timestamps show in wrong timezone**  
A: Component uses browser locale. Ensure ISO timestamps from API include timezone info

**Q: Component not responsive on mobile**  
A: Verify CSS Grid support in target browsers; IE11 may need polyfill

**Q: Error state not displaying**  
A: Ensure error prop is a string, not an Error object

## Related Components

- `CaseHandoffForm`: Chairperson handoff workflow
- `AuditorAssignmentForm`: Team leader auditor assignment
- `CaseDetailPage`: Full case detail view
- `CaseListView`: List of cases

## Contact & Support

For issues or questions about CaseStatusDisplay integration:
1. Check this integration guide
2. Review README.md for usage examples
3. Check TASK_COMPLETION.md for acceptance criteria
4. Consult TypeScript types in component
