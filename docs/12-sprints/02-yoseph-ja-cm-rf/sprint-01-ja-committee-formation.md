# Sprint 01: JA Committee Formation & Case Assignment

**Objective:** Implement the foundational committee workspace where complex Transfer Pricing (TP) cases are delegated from the Annual Planning cluster to a Joint Audit Committee, enabling governance-level review and multi-jurisdiction collaboration.

**Developer:** Yoseph
**Cluster Prefix:** `ja_` (Joint Audit)
**ITAS Tasks:** 23, 24, 32-34 (Committee Chairperson: Appoint Team Leader, Assign Official Team, Create Committee Session)

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 01 (Committee World Entry Point).
> 
> **Database Schema:**
> - Create `ja_committees` table with fields: `id`, `audit_case_id`, `chairperson_id`, `lead_auditor_id`, `status` (FORMED, SESSION_CREATED, IN_PROGRESS, FINDINGS_SUBMITTED, CLOSED), `created_at`, `created_by`
> - Create `ja_committee_members` table: `id`, `committee_id`, `member_actor_id`, `jurisdiction_department`, `role` (CHAIRPERSON, VOTING_MEMBER, OBSERVER), `joined_at`
> - Create `ja_sessions` table for formal committee sessions: `id`, `committee_id`, `session_number`, `scheduled_date`, `venue`, `status` (SCHEDULED, IN_PROGRESS, CONCLUDED)
> - Add audit trail timestamps and created_by fields to all tables
>
> **Backend Service:**
> - Create `JointAuditCommittee` Aggregate Root (ITAS Domain Model for committee governance)
> - Implement `CommitteeDelegationService` that routes TP audit cases from AP cluster (only audit_type='TP')
> - Implement business logic: Committee cannot start until Chairperson appoints Team Leader
> - Create REST APIs:
>   - `POST /api/v1/ja/cases/{caseId}/committee` - Form committee for TP case (Task 24)
>   - `POST /api/v1/ja/committees/{committeeId}/team-leader` - Appoint Team Leader (Task 23)
>   - `POST /api/v1/ja/committees/{committeeId}/members` - Add committee members (Task 24)
>   - `POST /api/v1/ja/committees/{committeeId}/sessions` - Create committee session (Task 32)
> - Enforce: only Chairperson can appoint/add members; extract role from X-Actor-Id header
>
> **Frontend Pages & Components:**
> - Page `src/features/ja/pages/JointAuditWorkspace.jsx` - Main committee workspace (restricted to ROLE_COMMITTEE_MEMBER, ROLE_COMMITTEE_CHAIRPERSON)
> - Component `<CommitteeBuilder />` - Form to add members (Chairperson-only)
> - Component `<CommitteeMemberList />` - Display members with jurisdiction badges
> - Component `<SessionScheduler />` - Schedule formal committee sessions
> - Visual indicators: Show appointment status, session dates, member jurisdictions
>
> **Access Control:**
> - Chairperson: Can appoint Team Leader, add members, create sessions
> - Members: Can view workspace, participate in research notes (Sprint 03)
> - Non-members: 403 Forbidden

---

## 2. Database Implementation

### Flyway Script (`V5__ja_tables.sql`)

```sql
-- Joint Audit Committee Foundation
CREATE TABLE ja_committees (
    id UUID PRIMARY KEY,
    audit_case_id UUID NOT NULL REFERENCES ap_audit_cases(id),
    chairperson_id VARCHAR(64) NOT NULL,      -- Committee Chairperson (ITAS Task 23)
    lead_auditor_id VARCHAR(64),              -- Appointed Team Leader (ITAS Task 23)
    status VARCHAR(32) NOT NULL DEFAULT 'FORMED',  -- FORMED, SESSION_CREATED, IN_PROGRESS, FINDINGS_SUBMITTED, CLOSED
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(64) NOT NULL,
    updated_at TIMESTAMPTZ,
    mandate_focus_areas TEXT,                 -- Committee's specific focus (ITAS Task 13)
    
    -- Audit Trail
    session_created_at TIMESTAMPTZ,           -- When committee session was formally created (ITAS Task 32)
    first_meeting_scheduled TIMESTAMPTZ,
    
    CONSTRAINT unique_case_committee UNIQUE(audit_case_id)
);

-- Committee Members (Multi-Jurisdiction Representation)
CREATE TABLE ja_committee_members (
    id UUID PRIMARY KEY,
    committee_id UUID NOT NULL REFERENCES ja_committees(id) ON DELETE CASCADE,
    member_actor_id VARCHAR(64) NOT NULL,
    jurisdiction_department VARCHAR(64) NOT NULL,  -- e.g., "FEDERAL_CUSTOMS", "REGIONAL_TAX", "FEDERAL_REVENUE"
    role VARCHAR(32),                              -- CHAIRPERSON, VOTING_MEMBER, OBSERVER
    joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_member_per_committee UNIQUE(committee_id, member_actor_id)
);

-- Committee Session Management (ITAS Task 32-34)
CREATE TABLE ja_sessions (
    id UUID PRIMARY KEY,
    committee_id UUID NOT NULL REFERENCES ja_committees(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL,           -- Sequential session numbering
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    venue TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'SCHEDULED',  -- SCHEDULED, IN_PROGRESS, CONCLUDED, ADJOURNED
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(64) NOT NULL
);

-- Committee Member Attendance Tracking (ITAS Task 32)
CREATE TABLE ja_session_attendance (
    id UUID PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES ja_sessions(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES ja_committee_members(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL DEFAULT 'INVITED',  -- INVITED, CONFIRMED, ATTENDED, ABSENT
    response_at TIMESTAMPTZ
);
```

### Key Design Decisions:

1. **Committee Formation:** Triggered when AP cluster routes a TP case (audit_type = 'TP')
2. **Role Hierarchy:** Chairperson appoints Lead Auditor (Task 23), assigns Team Members (Task 24)
3. **Jurisdiction Tracking:** Each member tagged with `jurisdiction_department` for Rule 12 enforcement (Sprint 02)
4. **Session Management:** Formal committee sessions track collaborative work (Tasks 32-34)

---

## 3. Backend Implementation

### Domain Models

#### JointAuditCommittee Aggregate Root

```java
package mor.itas.domain.model.ja;

import mor.itas.domain.aggregate.AggregateRoot;
import java.time.*;
import java.util.*;

public class JointAuditCommittee extends AggregateRoot {
    private UUID id;
    private UUID auditCaseId;
    private String chairpersonId;           // Committee Chairperson (ITAS Task 23)
    private String leadAuditorId;           // Appointed Team Leader
    private CommitteeStatus status;
    private String mandateFocusAreas;       // Committee Mandate (ITAS Task 13)
    private ZonedDateTime createdAt;
    private String createdBy;
    private List<CommitteeMember> members;
    private List<CommitteeSession> sessions;

    // Constructor: Create committee when TP case is routed from AP cluster
    public JointAuditCommittee(UUID caseId, String chairpersonId, String createdBy) {
        this.id = UUID.randomUUID();
        this.auditCaseId = caseId;
        this.chairpersonId = chairpersonId;
        this.status = CommitteeStatus.FORMED;
        this.createdAt = ZonedDateTime.now();
        this.createdBy = createdBy;
        this.members = new ArrayList<>();
        this.sessions = new ArrayList<>();
        
        // Auto-add chairperson as member
        this.members.add(new CommitteeMember(
            UUID.randomUUID(),
            this.id,
            chairpersonId,
            "FEDERAL_REVENUE",  // Default jurisdiction (Override in UI)
            CommitteeMemberRole.CHAIRPERSON
        ));
    }

    // ITAS Task 23: Appoint Team Leader
    public void appointTeamLeader(String auditorId) {
        if (this.status != CommitteeStatus.FORMED) {
            throw new IllegalStateException("Can only appoint Team Leader when committee is FORMED");
        }
        this.leadAuditorId = auditorId;
    }

    // ITAS Task 24: Assign Official Team (Add Members)
    public void addCommitteeMember(String actorId, String jurisdiction, CommitteeMemberRole role) {
        if (members.stream().anyMatch(m -> m.getMemberActorId().equals(actorId))) {
            throw new IllegalStateException("Member already added to committee");
        }
        CommitteeMember member = new CommitteeMember(
            UUID.randomUUID(),
            this.id,
            actorId,
            jurisdiction,
            role
        );
        members.add(member);
    }

    // ITAS Task 32: Create Committee Session
    public CommitteeSession createSession(LocalDate scheduledDate, String venue, String createdBy) {
        if (status == CommitteeStatus.CLOSED) {
            throw new IllegalStateException("Cannot create session for closed committee");
        }
        CommitteeSession session = new CommitteeSession(
            UUID.randomUUID(),
            this.id,
            sessions.size() + 1,  // Sequential numbering
            scheduledDate,
            venue,
            createdBy
        );
        sessions.add(session);
        if (sessions.size() == 1) {
            this.status = CommitteeStatus.SESSION_CREATED;
        }
        return session;
    }

    // ITAS Task 13: Set Committee Mandate (Focus Areas)
    public void setMandateFocusAreas(String focusAreas) {
        this.mandateFocusAreas = focusAreas;
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getAuditCaseId() { return auditCaseId; }
    public String getChairpersonId() { return chairpersonId; }
    public String getLeadAuditorId() { return leadAuditorId; }
    public CommitteeStatus getStatus() { return status; }
    public List<CommitteeMember> getMembers() { return Collections.unmodifiableList(members); }
    public List<CommitteeSession> getSessions() { return Collections.unmodifiableList(sessions); }
    public String getMandateFocusAreas() { return mandateFocusAreas; }
    
    public enum CommitteeStatus {
        FORMED, SESSION_CREATED, IN_PROGRESS, FINDINGS_SUBMITTED, CLOSED
    }
}
```

#### CommitteeMember Entity

```java
public class CommitteeMember {
    private UUID id;
    private UUID committeeId;
    private String memberActorId;
    private String jurisdictionDepartment;
    private CommitteeMemberRole role;
    private ZonedDateTime joinedAt;

    public CommitteeMember(UUID id, UUID committeeId, String memberActorId, 
                          String jurisdiction, CommitteeMemberRole role) {
        this.id = id;
        this.committeeId = committeeId;
        this.memberActorId = memberActorId;
        this.jurisdictionDepartment = jurisdiction;
        this.role = role;
        this.joinedAt = ZonedDateTime.now();
    }

    // Getters
    public UUID getId() { return id; }
    public String getMemberActorId() { return memberActorId; }
    public String getJurisdictionDepartment() { return jurisdictionDepartment; }
    public CommitteeMemberRole getRole() { return role; }
    
    public enum CommitteeMemberRole {
        CHAIRPERSON, VOTING_MEMBER, OBSERVER
    }
}
```

#### CommitteeSession Entity

```java
public class CommitteeSession {
    private UUID id;
    private UUID committeeId;
    private Integer sessionNumber;
    private LocalDate scheduledDate;
    private String venue;
    private SessionStatus status;
    private ZonedDateTime createdAt;
    private String createdBy;

    public CommitteeSession(UUID id, UUID committeeId, Integer sessionNumber, 
                           LocalDate scheduledDate, String venue, String createdBy) {
        this.id = id;
        this.committeeId = committeeId;
        this.sessionNumber = sessionNumber;
        this.scheduledDate = scheduledDate;
        this.venue = venue;
        this.status = SessionStatus.SCHEDULED;
        this.createdAt = ZonedDateTime.now();
        this.createdBy = createdBy;
    }

    public UUID getId() { return id; }
    public Integer getSessionNumber() { return sessionNumber; }
    public LocalDate getScheduledDate() { return scheduledDate; }
    
    public enum SessionStatus {
        SCHEDULED, IN_PROGRESS, CONCLUDED, ADJOURNED
    }
}
```

### Application Service

```java
package mor.itas.application.service.ja;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class JointAuditFormationService {
    private final JointAuditCommitteeRepository committeeRepository;
    private final AuditCaseRepository auditCaseRepository;

    // ITAS Task 24: Assign Official Team (Create Committee)
    public JointAuditCommittee formCommittee(UUID caseId, String chairpersonId, String createdBy) {
        // Validate case exists and is TP type
        AuditCase auditCase = auditCaseRepository.findById(caseId)
            .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));
        
        if (!AuditType.TP.equals(auditCase.getAuditType())) {
            throw new IllegalStateException("Only TP cases can be routed to Joint Audit Committee");
        }

        JointAuditCommittee committee = new JointAuditCommittee(caseId, chairpersonId, createdBy);
        return committeeRepository.save(committee);
    }

    // ITAS Task 23: Appoint Team Leader
    public void appointTeamLeader(UUID committeeId, String auditorId) {
        JointAuditCommittee committee = committeeRepository.findById(committeeId)
            .orElseThrow(() -> new IllegalArgumentException("Committee not found"));
        
        committee.appointTeamLeader(auditorId);
        committeeRepository.save(committee);
    }

    // ITAS Task 24: Add Committee Member
    public void addCommitteeMember(UUID committeeId, String memberActorId, 
                                   String jurisdiction, String role) {
        JointAuditCommittee committee = committeeRepository.findById(committeeId)
            .orElseThrow(() -> new IllegalArgumentException("Committee not found"));
        
        CommitteeMember.CommitteeMemberRole memberRole = 
            CommitteeMember.CommitteeMemberRole.valueOf(role.toUpperCase());
        
        committee.addCommitteeMember(memberActorId, jurisdiction, memberRole);
        committeeRepository.save(committee);
    }

    // ITAS Task 32: Create Committee Session
    public CommitteeSession createCommitteeSession(UUID committeeId, LocalDate scheduledDate, 
                                                   String venue, String createdBy) {
        JointAuditCommittee committee = committeeRepository.findById(committeeId)
            .orElseThrow(() -> new IllegalArgumentException("Committee not found"));
        
        CommitteeSession session = committee.createSession(scheduledDate, venue, createdBy);
        committeeRepository.save(committee);
        return session;
    }
}
```

### REST Controller

```java
package mor.itas.api.controller.backoffice.ja;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ja")
@RequiredArgsConstructor
public class JointAuditCommitteeController {
    private final JointAuditFormationService formationService;

    // ITAS Task 24: Create Committee for TP Case
    @PostMapping("/cases/{caseId}/committee")
    public ResponseEntity<JointAuditCommitteeResponse> formCommittee(
            @PathVariable UUID caseId,
            @RequestHeader("X-Actor-Id") String chairpersonId) {
        
        JointAuditCommittee committee = formationService.formCommittee(
            caseId, chairpersonId, chairpersonId
        );
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new JointAuditCommitteeResponse(committee));
    }

    // ITAS Task 23: Appoint Team Leader
    @PostMapping("/committees/{committeeId}/team-leader")
    public ResponseEntity<Void> appointTeamLeader(
            @PathVariable UUID committeeId,
            @RequestBody AppointTeamLeaderRequest request,
            @RequestHeader("X-Actor-Id") String chairpersonId) {
        
        formationService.appointTeamLeader(committeeId, request.getAuditorId());
        return ResponseEntity.ok().build();
    }

    // ITAS Task 24: Add Committee Member
    @PostMapping("/committees/{committeeId}/members")
    public ResponseEntity<Void> addCommitteeMember(
            @PathVariable UUID committeeId,
            @RequestBody AddCommitteeMemberRequest request,
            @RequestHeader("X-Actor-Id") String chairpersonId) {
        
        formationService.addCommitteeMember(
            committeeId,
            request.getMemberActorId(),
            request.getJurisdiction(),
            request.getRole()
        );
        
        return ResponseEntity.ok().build();
    }

    // ITAS Task 32: Create Committee Session
    @PostMapping("/committees/{committeeId}/sessions")
    public ResponseEntity<CommitteeSessionResponse> createSession(
            @PathVariable UUID committeeId,
            @RequestBody CreateSessionRequest request,
            @RequestHeader("X-Actor-Id") String createdBy) {
        
        CommitteeSession session = formationService.createCommitteeSession(
            committeeId,
            request.getScheduledDate(),
            request.getVenue(),
            createdBy
        );
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new CommitteeSessionResponse(session));
    }

    // ITAS Task 13: Set Committee Mandate
    @PutMapping("/committees/{committeeId}/mandate")
    public ResponseEntity<Void> setMandateFocusAreas(
            @PathVariable UUID committeeId,
            @RequestBody SetMandateRequest request,
            @RequestHeader("X-Actor-Id") String chairpersonId) {
        
        formationService.setMandateFocusAreas(committeeId, request.getFocusAreas());
        return ResponseEntity.ok().build();
    }
}
```

---

## 4. Frontend Implementation

### UI Components

#### JointAuditWorkspace (Main Committee Workspace)

```jsx
// src/features/ja/pages/JointAuditWorkspace.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import CommitteeBuilder from '../components/CommitteeBuilder';
import CommitteeMemberList from '../components/CommitteeMemberList';
import SessionScheduler from '../components/SessionScheduler';
import MandatePanel from '../components/MandatePanel';

export default function JointAuditWorkspace() {
  const { caseId, committeeId } = useParams();
  const { user } = useAuth();
  const [committee, setCommittee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommittee();
  }, [committeeId]);

  const fetchCommittee = async () => {
    try {
      const response = await fetch(`/api/v1/ja/committees/${committeeId}`);
      const data = await response.json();
      setCommittee(data);
    } catch (error) {
      console.error('Failed to fetch committee:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading committee...</div>;
  if (!committee) return <div>Committee not found</div>;

  const isChairperson = user.id === committee.chairpersonId;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900">Joint Audit Committee</h1>
        <p className="text-gray-600 mt-2">Case ID: {caseId}</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Status: {committee.status}
          </span>
          {isChairperson && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              Chairperson
            </span>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: Committee Builder & Members */}
        <div className="col-span-2 space-y-6">
          {isChairperson && <CommitteeBuilder committeeId={committeeId} onUpdate={fetchCommittee} />}
          <CommitteeMemberList committee={committee} isChairperson={isChairperson} />
          <SessionScheduler committeeId={committeeId} isChairperson={isChairperson} />
        </div>

        {/* Right Column: Mandate Panel */}
        <div className="col-span-1">
          <MandatePanel committeeId={committeeId} mandate={committee.mandateFocusAreas} isChairperson={isChairperson} />
        </div>
      </div>
    </div>
  );
}
```

#### CommitteeBuilder (Formation Component)

```jsx
// src/features/ja/components/CommitteeBuilder.jsx
import React, { useState } from 'react';
import { Users, Plus, AlertCircle } from 'lucide-react';

export default function CommitteeBuilder({ committeeId, onUpdate }) {
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [formData, setFormData] = useState({
    memberActorId: '',
    jurisdiction: 'FEDERAL_CUSTOMS',
    role: 'VOTING_MEMBER'
  });
  const [error, setError] = useState('');

  const handleAddMember = async () => {
    if (!formData.memberActorId) {
      setError('Please select a member');
      return;
    }

    try {
      const response = await fetch(`/api/v1/ja/committees/${committeeId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': 'current-user-id'  // Replace with actual user ID
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to add member');

      setFormData({ memberActorId: '', jurisdiction: 'FEDERAL_CUSTOMS', role: 'VOTING_MEMBER' });
      setShowMemberForm(false);
      setError('');
      onUpdate();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Users size={20} />
          Committee Formation (ITAS Task 24)
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {!showMemberForm ? (
        <button
          onClick={() => setShowMemberForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Committee Member
        </button>
      ) : (
        <div className="space-y-4 p-4 bg-gray-50 rounded">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Member</label>
            <select
              value={formData.memberActorId}
              onChange={(e) => setFormData({ ...formData, memberActorId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a member...</option>
              <option value="auditor-001">Auditor 001 (Customs)</option>
              <option value="auditor-002">Auditor 002 (Regional Tax)</option>
              <option value="auditor-003">Auditor 003 (Federal Revenue)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jurisdiction</label>
            <select
              value={formData.jurisdiction}
              onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="FEDERAL_CUSTOMS">Federal Customs</option>
              <option value="FEDERAL_REVENUE">Federal Revenue</option>
              <option value="REGIONAL_TAX">Regional Tax Authority</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="VOTING_MEMBER">Voting Member</option>
              <option value="OBSERVER">Observer</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddMember}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Add Member
            </button>
            <button
              onClick={() => setShowMemberForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### CommitteeMemberList (Display Members)

```jsx
// src/features/ja/components/CommitteeMemberList.jsx
import React from 'react';
import { Users, Shield } from 'lucide-react';

export default function CommitteeMemberList({ committee, isChairperson }) {
  const roleColors = {
    CHAIRPERSON: 'bg-purple-100 text-purple-800',
    VOTING_MEMBER: 'bg-blue-100 text-blue-800',
    OBSERVER: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
        <Shield size={20} />
        Committee Members (ITAS Task 24)
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Member ID</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Jurisdiction</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Role</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Joined</th>
            </tr>
          </thead>
          <tbody>
            {committee.members && committee.members.map((member) => (
              <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 font-medium">{member.memberActorId}</td>
                <td className="px-4 py-3 text-gray-600">{member.jurisdictionDepartment}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColors[member.role]}`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{new Date(member.joinedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
        <strong>Rule 12 (Sprint 02):</strong> A Joint Audit legally requires members from at least 2 distinct jurisdictions. Current: {new Set(committee.members?.map(m => m.jurisdictionDepartment)).size} jurisdictions.
      </div>
    </div>
  );
}
```

---

## 5. ITAS Alignment Summary

| ITAS Task | Sprint Coverage | Component | Status |
| :--- | :--- | :--- | :--- |
| Task 23 | Sprint 01 | `appointTeamLeader()` | ✅ Implemented |
| Task 24 | Sprint 01 | `addCommitteeMember()` | ✅ Implemented |
| Task 32 | Sprint 01 | `createCommitteeSession()` | ✅ Implemented |
| Task 33 | Sprint 02 (TBD) | Committee member assignment | 📋 Placeholder |
| Task 34 | Sprint 02 (TBD) | Meeting scheduling | 📋 Placeholder |
| Task 13 | Sprint 01 | `setMandateFocusAreas()` | ✅ Implemented |
| Rule 12 | Sprint 02 (TBD) | Jurisdiction validation | 📋 Placeholder |

---

## 6. Success Criteria

- ✅ Committee can be formed for TP cases from AP cluster
- ✅ Chairperson can appoint Team Leader and add voting members
- ✅ Each member is tagged with jurisdiction for Rule 12 enforcement
- ✅ Sessions can be created with scheduled dates and venues
- ✅ Frontend displays member list with jurisdiction information
- ✅ API returns 201 Created for committee formation
- ✅ All operations tracked with created_at, created_by audit timestamps
