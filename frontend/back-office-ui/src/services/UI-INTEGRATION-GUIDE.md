# Frontend UI Integration Guide

## Overview

The frontend now has complete API integration services matching the backend exactly. All components fetch data from the backend using the same query parameters and filters.

---

## Files Created

### 1. API Client Service
**File**: `src/services/apiClient.js`

Core API communication layer. All requests go through this.

**Export**: `apiClient` object with methods:
- `getCases(filters)` - Get cases with filters
- `getCaseById(caseId)` - Get specific case
- `updateCase(caseId, updates)` - Update a case
- `batchAssignCases(caseIds, teamLeaderId)` - Assign multiple cases
- `getUsers()` - Get all users
- `getUserById(userId)` - Get specific user

---

## Custom React Hooks

### 2. Cases Hook
**File**: `src/hooks/useCases.js`

**Main Hook**: `useCases(filters)`
```javascript
const { cases, loading, error, metadata, refetch } = useCases({
  taxCenter: 'addis_ababa-tc1',
  auditType: 'DESK_AUDIT'
});
```

**Convenience Hooks**:
- `useCommitteeCases(committeeId, auditType)` - For committee views
- `useTeamLeaderCases(teamLeaderId, auditType)` - For team leader views
- `useTaxCenterCases(taxCenter, auditType)` - For tax center views
- `useAuditorCases(auditorId)` - For auditor views

### 3. Assignment Hook
**File**: `src/hooks/useAssignCases.js`

```javascript
const { assign, loading, error, success, assignedCount } = useAssignCases();

// Use it:
await assign(['case-id-1', 'case-id-2'], 'tp-tl-1');
```

### 4. Users Hook
**File**: `src/hooks/useUsers.js`

**Main Hook**: `useUsers()`
```javascript
const { users, loading, error, refetch } = useUsers();
```

**Convenience Hooks**:
- `useCommitteeUsers(auditType)` - Get committee members
- `useTeamLeaders(auditType)` - Get team leaders
- `useAuditors(auditType)` - Get auditors
- `useUser(userId)` - Get specific user

---

## Example Components

### 5. Committee Dashboard
**File**: `src/components/CommitteeDashboard.jsx`

Shows committee members their unassigned cases and allows batch assignment to team leaders.

**Usage**:
```jsx
<CommitteeDashboard 
  committeeId="tp-committee" 
  auditType="TRANSFER_PRICING" 
/>
```

**Features**:
- Display cases for committee
- Multi-select cases
- Assign to team leader
- Auto-refresh on success

### 6. Team Leader Dashboard
**File**: `src/components/TeamLeaderDashboard.jsx`

Shows team leaders their assigned cases.

**Usage**:
```jsx
<TeamLeaderDashboard 
  teamLeaderId="desk-tl-1" 
  auditType="DESK_AUDIT" 
/>
```

**Features**:
- Display assigned cases
- Multi-select cases
- Show audit statistics
- Ready for auditor assignment

---

## How It Works

### Flow Diagram

```
UI Component
    ↓
React Hook (useCases, useUsers, etc.)
    ↓
API Client Service (apiClient.js)
    ↓
Backend API (http://localhost:8080/api/v1/backoffice/ap)
    ↓
Database
```

### Example: Committee Viewing Cases

```javascript
import { useCommitteeCases } from './hooks/useCases';

function TPCommitteeView() {
  // Hook automatically fetches cases for tp-committee
  const { cases, loading } = useCommitteeCases('tp-committee', 'TRANSFER_PRICING');
  
  return (
    <div>
      {loading ? <p>Loading...</p> : (
        <table>
          {cases.map(c => <tr key={c.id}>{c.caseNumber}</tr>)}
        </table>
      )}
    </div>
  );
}
```

---

## API Request Format

All requests include the required header:
```
X-Actor-Id: <userId>
```

The actor ID is automatically set from:
1. `sessionStorage.userId` (if set by auth)
2. Falls back to `'system'` if not set

---

## Query Parameters

### Required Filter (at least one)
- `taxCenter` - e.g., `addis_ababa-tc1`
- `teamLeader` - e.g., `desk-tl-1`
- `committeeId` - e.g., `tp-committee`
- `auditor` - e.g., `auditor-id`

### Optional Filters
- `auditType` - e.g., `DESK_AUDIT`, `TRANSFER_PRICING`
- `status` - e.g., `PENDING`
- `limit` - pagination limit
- `offset` - pagination offset

---

## Demo Data Available

### Test Cases (300 total in Addis Ababa TC1)

**Direct Routes (No Committee)**:
```
DESK_AUDIT          → 100 cases → desk-tl-1
COMPREHENSIVE_AUDIT → 50 cases  → comp-tl-1
ISSUE_AUDIT         → 30 cases  → issue-tl-1
```

**Committee Routes**:
```
TRANSFER_PRICING → 80 cases → tp-committee → (assign to tp-tl-1, etc.)
JOINT_AUDIT      → 40 cases → joint-committee → (assign to ja-tl-1, etc.)
```

### Demo Users

**Committee Chairs**:
- `u-com-fed-tpchair` (Transfer Pricing)
- `u-com-fed-chair` (Joint Audit)
- `u-com-fed-deskchair` (Desk)
- `u-com-fed-compchair` (Comprehensive)
- `u-com-fed-issuechair` (Issue)

**Team Leaders**:
- `desk-tl-1`, `desk-tl-2`
- `comp-tl-1`, `comp-tl-2`
- `issue-tl-1`, `issue-tl-2`
- `tp-tl-1` through `tp-tl-5`
- `ja-tl-1`, `ja-tl-2`, `ja-tl-3`

---

## Environment Configuration

Create `.env` file in frontend root:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1/backoffice/ap
```

Or it defaults to: `http://localhost:8080/api/v1/backoffice/ap`

---

## Common Usage Patterns

### Pattern 1: Committee Dashboard

```javascript
function CommitteeView() {
  const { cases, loading } = useCommitteeCases('tp-committee', 'TRANSFER_PRICING');
  const { assign } = useAssignCases();
  
  const handleAssign = async (caseIds) => {
    await assign(caseIds, 'tp-tl-1');
  };
  
  return <Dashboard cases={cases} onAssign={handleAssign} />;
}
```

### Pattern 2: Team Leader Dashboard

```javascript
function TeamLeaderView() {
  const { cases } = useTeamLeaderCases('desk-tl-1', 'DESK_AUDIT');
  
  return <CasesList cases={cases} />;
}
```

### Pattern 3: Bulk Operations

```javascript
function BulkAssignView() {
  const [selected, setSelected] = useState([]);
  const { assign, loading } = useAssignCases();
  
  const handleBulkAssign = async (teamLeaderId) => {
    await assign(selected.map(c => c.id), teamLeaderId);
    setSelected([]); // Clear selection
  };
  
  return <BulkAssignUI onAssign={handleBulkAssign} />;
}
```

---

## Error Handling

All hooks return `error` state:

```javascript
const { cases, error } = useCases({ taxCenter: 'addis_ababa-tc1' });

if (error) {
  return <ErrorMessage message={error} />;
}
```

API Client throws errors automatically:

```javascript
try {
  const result = await apiClient.getCases({ taxCenter: 'invalid' });
} catch (error) {
  console.error(error.message);
}
```

---

## Testing Checklist

- [ ] Committee Dashboard loads TP cases
- [ ] Desk cases show for desk-tl-1
- [ ] Case selection works
- [ ] Bulk assignment to team leader works
- [ ] Team leader dashboard shows assigned cases
- [ ] User dropdown populates with auditors
- [ ] Case refresh after assignment works
- [ ] Error messages display correctly
- [ ] Loading states show properly

---

## Integration Steps

1. **Set up API service**: Already created in `services/apiClient.js`
2. **Add hooks to components**: Import `useCases`, `useUsers`, `useAssignCases`
3. **Build committee dashboard**: Use `CommitteeDashboard.jsx` as template
4. **Build team leader dashboard**: Use `TeamLeaderDashboard.jsx` as template
5. **Add navigation**: Link between dashboards
6. **Test with demo data**: Use test users and 300 cases

---

## Next Steps

1. Build login form to set `sessionStorage.userId`
2. Implement dashboard routing
3. Add case detail views
4. Implement status update workflows
5. Add audit history tracking

---

## Support Files

- API Backend: `.kiro/BACKEND-API-SERVICE.md`
- API Quick Reference: `.kiro/API-QUICK-REFERENCE.md`
- Backend Status: `.kiro/READY-FOR-UI.md`

---

**Frontend ready for integration!** ✅

All components fetch from backend exactly as backend expects.
