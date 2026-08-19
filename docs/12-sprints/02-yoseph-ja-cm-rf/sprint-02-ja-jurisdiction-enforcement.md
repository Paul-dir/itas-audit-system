# Sprint 02: JA Jurisdiction Enforcement (Rule 12)

**Objective:** Enforce the critical business rule (Rule 12) that a Joint Audit Committee MUST include representatives from at least two distinct jurisdictions/departments before audit can proceed, ensuring multi-department accountability.

**Developer:** Yoseph
**Cluster Prefix:** `ja_`
**ITAS Tasks:** 26 (Committee Chairperson: Finalize Viability - only after Rule 12 satisfied)
**Business Rule:** Rule 12 - Minimum 2 distinct jurisdictions required

---

## 1. AI Context Prompt

> **To the AI Assistant:** You are implementing Sprint 02 (Rule Enforcement Gate).
>
> **Database Schema:**
> - Add validation columns to `ja_committees`: `jurisdiction_validation_met` (BOOLEAN), `jurisdiction_validation_checked_at` (TIMESTAMPTZ)
> - Create `ja_rule12_audit_log` table to track all validation attempts: `id`, `committee_id`, `attempt_time`, `attempted_by`, `distinct_jurisdictions_found`, `required_jurisdictions`, `violation_reason`, `status` (VIOLATION, RESOLVED, WAIVED)
> - This ensures compliance audit trail for Rule 12 enforcement
>
> **Backend Service:**
> - Create `JurisdictionValidationService` that implements Rule 12 check
> - Business Logic: Count distinct `jurisdiction_department` values in `ja_committee_members`
> - If count < 2, throw `JurisdictionRequirementNotMetException` with clear messaging of missing jurisdictions
> - Create validation gate that prevents `finalizeViability()` unless `jurisdiction_validation_met = TRUE`
> - Log all validation attempts (successes and failures) to audit log table
>
> **REST Endpoints:**
> - `POST /api/v1/ja/committees/{committeeId}/validate-jurisdiction` - Validate Rule 12
> - `GET /api/v1/ja/committees/{committeeId}/jurisdiction-status` - Get current validation status
> - Return 422 Unprocessable Entity if Rule 12 not met (RFC 7807 Problem Details)
> - Include in error response: current count, required count, list of missing jurisdictions
>
> **Frontend Interaction:**
> - Component `<JurisdictionStatusPanel />` - Display Rule 12 compliance indicator
> - Show progress: "2/2 Jurisdictions Represented" with visual badge
> - If not met: display red warning "RULE 12 NOT SATISFIED" with list of missing departments
> - Disable "Validate & Proceed" button until Rule 12 met
> - Show helpful text: "Rule 12 requires members from at least 2 distinct jurisdictions for multi-department accountability"
>
> **Error Handling:**
> - Graceful error messages: "Rule 12 Violation: Missing representation from [Federal Customs, Regional Tax Authority]. Add members from these jurisdictions to proceed."
> - Display Rule 12 violation reason prominently to guide user action
> - Log failed validation attempts for compliance review

---

## 2. Database Implementation

### Flyway Script (`V5_1__ja_jurisdiction_enforcement.sql`)

```sql
-- Jurisdiction Validation Tracking
ALTER TABLE ja_committees ADD COLUMN jurisdiction_validation_met BOOLEAN DEFAULT FALSE;
ALTER TABLE ja_committees ADD COLUMN jurisdiction_validation_checked_at TIMESTAMPTZ;
ALTER TABLE ja_committees ADD COLUMN required_minimum_jurisdictions INTEGER DEFAULT 2;

-- Add index for quick jurisdiction counting
CREATE INDEX idx_ja_committee_members_jurisdiction 
  ON ja_committee_members(committee_id, jurisdiction_department);

-- Audit log for Rule 12 violations
CREATE TABLE ja_rule12_audit_log (
    id UUID PRIMARY KEY,
    committee_id UUID NOT NULL REFERENCES ja_committees(id),
    attempt_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    attempted_by VARCHAR(64) NOT NULL,
    distinct_jurisdictions_found INTEGER NOT NULL,
    required_jurisdictions INTEGER NOT NULL,
    violation_reason TEXT,
    status VARCHAR(32) NOT NULL  -- VIOLATION, RESOLVED, WAIVED
);

-- Jurisdiction status per committee (pre-calculated for performance)
CREATE TABLE ja_committee_jurisdiction_status (
    id UUID PRIMARY KEY,
    committee_id UUID NOT NULL REFERENCES ja_committees(id),
    distinct_jurisdiction_count INTEGER NOT NULL,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_jurisdiction_status UNIQUE(committee_id)
);
```

### Key Design Decisions:

1. **Rule 12 Enforcement:** Calculated at domain layer, not DB constraint
2. **Audit Trail:** Tracks all Rule 12 validation attempts (compliance)
3. **Performance Optimization:** Pre-calculated jurisdiction count for fast queries

---

## 3. Backend Implementation

### Domain Service: JurisdictionValidationService

```java
package mor.itas.application.service.ja;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class JurisdictionValidationService {
    private final JointAuditCommitteeRepository committeeRepository;
    private final Rule12AuditLogRepository auditLogRepository;

    /**
     * RULE 12: Validates that committee has members from >= 2 distinct jurisdictions
     * This is a critical business rule that must be satisfied before audit progression
     */
    public void validateJurisdictionRequirement(UUID committeeId, String attemptedBy) 
            throws JurisdictionRequirementNotMetException {
        
        JointAuditCommittee committee = committeeRepository.findById(committeeId)
            .orElseThrow(() -> new IllegalArgumentException("Committee not found: " + committeeId));

        // Count distinct jurisdictions
        Set<String> distinctJurisdictions = committee.getMembers().stream()
            .map(CommitteeMember::getJurisdictionDepartment)
            .collect(Collectors.toSet());

        int jurisdictionCount = distinctJurisdictions.size();
        int requiredMinimum = 2;  // Rule 12 requirement

        // Log validation attempt
        logValidationAttempt(committeeId, attemptedBy, jurisdictionCount, requiredMinimum);

        // Enforce Rule 12
        if (jurisdictionCount < requiredMinimum) {
            String missingJurisdictions = getMissingJurisdictionSuggestions(
                distinctJurisdictions, 
                requiredMinimum
            );

            throw new JurisdictionRequirementNotMetException(
                String.format(
                    "Rule 12 Violation: Joint Audit Committee requires members from at least %d distinct jurisdictions. " +
                    "Current: %d. Missing: %s",
                    requiredMinimum,
                    jurisdictionCount,
                    missingJurisdictions
                ),
                jurisdictionCount,
                requiredMinimum,
                new ArrayList<>(distinctJurisdictions)
            );
        }

        // Mark validation as met
        committee.markJurisdictionValidationMet();
        committeeRepository.save(committee);

        // Log successful validation
        logValidationSuccess(committeeId, attemptedBy, jurisdictionCount, requiredMinimum);
    }

    /**
     * Provides list of missing jurisdictions to guide Chairperson
     */
    private String getMissingJurisdictionSuggestions(Set<String> current, int required) {
        List<String> allJurisdictions = Arrays.asList(
            "FEDERAL_CUSTOMS",
            "FEDERAL_REVENUE",
            "REGIONAL_TAX",
            "STATE_REVENUE",
            "LOCAL_TAX"
        );
        
        List<String> missing = allJurisdictions.stream()
            .filter(j -> !current.contains(j))
            .limit(required - current.size())
            .collect(Collectors.toList());
            
        return String.join(", ", missing);
    }

    private void logValidationAttempt(UUID committeeId, String attemptedBy, 
                                     int found, int required) {
        Rule12AuditLog log = new Rule12AuditLog(
            UUID.randomUUID(),
            committeeId,
            attemptedBy,
            found,
            required,
            found < required ? "Insufficient jurisdictions" : null,
            found < required ? "VIOLATION" : "RESOLVED"
        );
        auditLogRepository.save(log);
    }

    private void logValidationSuccess(UUID committeeId, String approvedBy,
                                     int count, int required) {
        Rule12AuditLog log = new Rule12AuditLog(
            UUID.randomUUID(),
            committeeId,
            approvedBy,
            count,
            required,
            null,
            "RESOLVED"
        );
        auditLogRepository.save(log);
    }
}

/**
 * Custom exception for Rule 12 violations
 */
public class JurisdictionRequirementNotMetException extends RuntimeException {
    private int currentCount;
    private int requiredCount;
    private List<String> currentJurisdictions;

    public JurisdictionRequirementNotMetException(
            String message,
            int currentCount,
            int requiredCount,
            List<String> currentJurisdictions) {
        super(message);
        this.currentCount = currentCount;
        this.requiredCount = requiredCount;
        this.currentJurisdictions = currentJurisdictions;
    }

    public int getCurrentCount() { return currentCount; }
    public int getRequiredCount() { return requiredCount; }
    public List<String> getCurrentJurisdictions() { return currentJurisdictions; }
}
```

### Updated JointAuditCommittee Aggregate

```java
public class JointAuditCommittee extends AggregateRoot {
    // ... existing fields ...
    private boolean jurisdictionValidationMet;
    private ZonedDateTime jurisdictionValidationCheckedAt;

    /**
     * ITAS Task 26: Can only finalize viability once Rule 12 is satisfied
     */
    public void finalizeViability() {
        if (!jurisdictionValidationMet) {
            throw new IllegalStateException(
                "Cannot finalize viability: Rule 12 (jurisdiction requirement) not met"
            );
        }
        this.status = CommitteeStatus.IN_PROGRESS;
    }

    /**
     * Mark that Rule 12 validation has been satisfied
     */
    public void markJurisdictionValidationMet() {
        this.jurisdictionValidationMet = true;
        this.jurisdictionValidationCheckedAt = ZonedDateTime.now();
    }

    public boolean isJurisdictionValidationMet() {
        return jurisdictionValidationMet;
    }
}
```

### Updated REST Controller

```java
@RestController
@RequestMapping("/api/v1/ja")
@RequiredArgsConstructor
public class JointAuditCommitteeController {
    private final JointAuditFormationService formationService;
    private final JurisdictionValidationService validationService;

    // ... existing endpoints ...

    /**
     * Validate Rule 12 before proceeding with audit
     * ITAS Task 26: Finalize Viability
     */
    @PostMapping("/committees/{committeeId}/validate-jurisdiction")
    public ResponseEntity<JurisdictionValidationResponse> validateJurisdiction(
            @PathVariable UUID committeeId,
            @RequestHeader("X-Actor-Id") String chairpersonId) {
        
        try {
            validationService.validateJurisdictionRequirement(committeeId, chairpersonId);
            
            return ResponseEntity.ok(new JurisdictionValidationResponse(
                true,
                "Rule 12 satisfied: Committee has required multi-jurisdiction representation",
                null,
                null
            ));
        } catch (JurisdictionRequirementNotMetException e) {
            return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(new JurisdictionValidationResponse(
                    false,
                    e.getMessage(),
                    e.getCurrentCount(),
                    e.getRequiredCount()
                ));
        }
    }

    /**
     * Get Rule 12 validation status
     */
    @GetMapping("/committees/{committeeId}/jurisdiction-status")
    public ResponseEntity<JurisdictionStatusResponse> getJurisdictionStatus(
            @PathVariable UUID committeeId) {
        
        JointAuditCommittee committee = committeeRepository.findById(committeeId)
            .orElseThrow(() -> new IllegalArgumentException("Committee not found"));

        Set<String> jurisdictions = committee.getMembers().stream()
            .map(CommitteeMember::getJurisdictionDepartment)
            .collect(Collectors.toSet());

        return ResponseEntity.ok(new JurisdictionStatusResponse(
            committee.getId(),
            jurisdictions.size(),
            2,  // Required minimum
            new ArrayList<>(jurisdictions),
            committee.isJurisdictionValidationMet()
        ));
    }
}
```

---

## 4. Frontend Implementation

### Enhanced CommitteeBuilder with Rule 12 Validation

```jsx
// src/features/ja/components/CommitteeBuilder.jsx
import React, { useState, useEffect } from 'react';
import { Users, Plus, AlertCircle, CheckCircle, Lock } from 'lucide-react';

export default function CommitteeBuilder({ committeeId, onUpdate }) {
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [jurisdictionStatus, setJurisdictionStatus] = useState(null);
  const [validationLoading, setValidationLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [formData, setFormData] = useState({
    memberActorId: '',
    jurisdiction: 'FEDERAL_CUSTOMS',
    role: 'VOTING_MEMBER'
  });

  useEffect(() => {
    checkJurisdictionStatus();
  }, [committeeId]);

  const checkJurisdictionStatus = async () => {
    try {
      const response = await fetch(`/api/v1/ja/committees/${committeeId}/jurisdiction-status`);
      const data = await response.json();
      setJurisdictionStatus(data);
    } catch (error) {
      console.error('Failed to fetch jurisdiction status:', error);
    }
  };

  const handleAddMember = async () => {
    if (!formData.memberActorId) {
      setValidationError('Please select a member');
      return;
    }

    try {
      const response = await fetch(`/api/v1/ja/committees/${committeeId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': 'current-user-id'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to add member');

      setFormData({ memberActorId: '', jurisdiction: 'FEDERAL_CUSTOMS', role: 'VOTING_MEMBER' });
      setShowMemberForm(false);
      setValidationError('');
      checkJurisdictionStatus();
      onUpdate();
    } catch (err) {
      setValidationError(err.message);
    }
  };

  const handleValidateRule12 = async () => {
    setValidationLoading(true);
    try {
      const response = await fetch(`/api/v1/ja/committees/${committeeId}/validate-jurisdiction`, {
        method: 'POST',
        headers: {
          'X-Actor-Id': 'current-user-id'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setValidationError('');
        alert('✅ Rule 12 Satisfied: Committee has multi-jurisdiction representation');
      } else {
        setValidationError(data.message);
      }
    } catch (err) {
      setValidationError('Failed to validate: ' + err.message);
    } finally {
      setValidationLoading(false);
    }
  };

  const rule12Met = jurisdictionStatus?.jurisdictionCount >= jurisdictionStatus?.requiredCount;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Users size={20} />
          Committee Formation with Rule 12 Enforcement
        </h2>

        {/* Rule 12 Status Indicator */}
        <div className={`p-4 rounded-lg border-2 mb-4 ${
          rule12Met 
            ? 'bg-green-50 border-green-300' 
            : 'bg-orange-50 border-orange-300'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            {rule12Met ? (
              <>
                <CheckCircle className="text-green-600" size={20} />
                <span className="font-semibold text-green-900">Rule 12: Satisfied ✓</span>
              </>
            ) : (
              <>
                <AlertCircle className="text-orange-600" size={20} />
                <span className="font-semibold text-orange-900">Rule 12: Requires {jurisdictionStatus?.requiredCount} Jurisdictions</span>
              </>
            )}
          </div>
          
          <div className="text-sm text-gray-700">
            <p className="mb-2">
              <strong>Current Jurisdictions: {jurisdictionStatus?.jurisdictionCount}/{jurisdictionStatus?.requiredCount}</strong>
            </p>
            {jurisdictionStatus?.jurisdictions?.length > 0 && (
              <p className="mb-2 flex flex-wrap gap-2">
                {jurisdictionStatus.jurisdictions.map(j => (
                  <span key={j} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {j}
                  </span>
                ))}
              </p>
            )}
            <p className="text-xs text-gray-600 italic">
              Rule 12 requires at least 2 distinct jurisdictions to ensure multi-department accountability
            </p>
          </div>
        </div>

        {validationError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded flex items-center gap-2">
            <AlertCircle size={18} />
            {validationError}
          </div>
        )}
      </div>

      {/* Add Member Form */}
      {!showMemberForm ? (
        <button
          onClick={() => setShowMemberForm(true)}
          disabled={!rule12Met}
          className={`flex items-center gap-2 px-4 py-2 rounded transition ${
            !rule12Met
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
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
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a member...</option>
              <option value="auditor-001">Auditor 001 (Customs)</option>
              <option value="auditor-002">Auditor 002 (Regional Tax)</option>
              <option value="auditor-003">Auditor 003 (Federal Revenue)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jurisdiction (Rule 12)</label>
            <select
              value={formData.jurisdiction}
              onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="FEDERAL_CUSTOMS">Federal Customs</option>
              <option value="FEDERAL_REVENUE">Federal Revenue</option>
              <option value="REGIONAL_TAX">Regional Tax Authority</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddMember}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Member
            </button>
            <button
              onClick={() => setShowMemberForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Validation Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleValidateRule12}
          disabled={!rule12Met || validationLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded transition ${
            !rule12Met || validationLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <Lock size={18} />
          {validationLoading ? 'Validating...' : 'Validate & Proceed (Rule 12)'}
        </button>
      </div>
    </div>
  );
}
```

---

## 5. ITAS Alignment Summary

| ITAS Task | Requirement | Implementation | Status |
| :--- | :--- | :--- | :--- |
| Task 23 | Appoint Team Leader | `appointTeamLeader()` | ✅ Sprint 01 |
| Task 24 | Assign Committee Team | `addCommitteeMember()` with jurisdiction | ✅ Implemented |
| Task 26 | Finalize Viability | Only after Rule 12 satisfied | ✅ Implemented |
| Task 31 | Override Authority | Rule 12 can be waived by Chairperson | 📋 Sprint 03+ |
| Rule 12 | Multi-Jurisdiction Requirement | `validateJurisdictionRequirement()` | ✅ Implemented |

---

## 6. Success Criteria

- ✅ Committee cannot proceed without members from 2+ jurisdictions
- ✅ API returns 422 Unprocessable Entity if Rule 12 violated
- ✅ Frontend "Validate & Proceed" button disabled until Rule 12 satisfied
- ✅ Error message lists which jurisdictions are still needed
- ✅ All validation attempts logged to `ja_rule12_audit_log` for compliance
- ✅ Chairperson can only finalize viability after Rule 12 validation
- ✅ Jurisdiction status endpoint provides real-time validation status
