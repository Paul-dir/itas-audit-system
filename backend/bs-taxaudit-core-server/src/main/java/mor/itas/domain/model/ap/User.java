package mor.itas.domain.model.ap;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * User Model for ITAS Audit System (AP Cluster)
 * 
 * Represents all users across organizational levels:
 * - National: Planning Team, Director, Senior Management, Committee Members
 * - Regional: Regional Directors
 * - Tax Center: Tax Center Managers, Team Leaders, Auditors
 */
public class User {
    private UUID userId;
    private String username;
    private String email;
    private String fullName;
    private String userType; // PLANNING_TEAM, DIRECTOR, REGIONAL_DIRECTOR, TAX_CENTER_MANAGER, TEAM_LEADER, AUDITOR, COMMITTEE_MEMBER
    private String auditType; // For specialists: DESK, COMP, QA, JA, TP (optional)
    private String assignedLevel; // NATIONAL, REGIONAL, TAX_CENTER
    private String assignedLocation; // Region code or Tax Center code
    private String status; // ACTIVE, INACTIVE
    private OffsetDateTime createdDate;
    private OffsetDateTime lastModified;
    private String createdBy;

    // Constructors
    public User(String username, String email, String fullName, String userType, 
                String assignedLevel, String assignedLocation, String createdBy) {
        this.userId = UUID.randomUUID();
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.userType = userType;
        this.assignedLevel = assignedLevel;
        this.assignedLocation = assignedLocation;
        this.status = "ACTIVE";
        this.createdDate = OffsetDateTime.now();
        this.lastModified = OffsetDateTime.now();
        this.createdBy = createdBy;
        this.auditType = null;
    }

    public User(String username, String email, String fullName, String userType, 
                String auditType, String assignedLevel, String assignedLocation, String createdBy) {
        this(username, email, fullName, userType, assignedLevel, assignedLocation, createdBy);
        this.auditType = auditType;
    }

    // Full constructor for reconstruction
    public User(UUID userId, String username, String email, String fullName, String userType,
                String auditType, String assignedLevel, String assignedLocation, String status,
                OffsetDateTime createdDate, OffsetDateTime lastModified, String createdBy) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.userType = userType;
        this.auditType = auditType;
        this.assignedLevel = assignedLevel;
        this.assignedLocation = assignedLocation;
        this.status = status;
        this.createdDate = createdDate;
        this.lastModified = lastModified;
        this.createdBy = createdBy;
    }

    // Business logic methods
    public void deactivate() {
        if ("INACTIVE".equals(this.status)) {
            throw new IllegalStateException("User is already inactive");
        }
        this.status = "INACTIVE";
        this.lastModified = OffsetDateTime.now();
    }

    public void activate() {
        if ("ACTIVE".equals(this.status)) {
            throw new IllegalStateException("User is already active");
        }
        this.status = "ACTIVE";
        this.lastModified = OffsetDateTime.now();
    }

    public void updateAssignment(String newAuditType, String newAssignedLocation) {
        this.auditType = newAuditType;
        this.assignedLocation = newAssignedLocation;
        this.lastModified = OffsetDateTime.now();
    }

    public void updateContactInfo(String email) {
        this.email = email;
        this.lastModified = OffsetDateTime.now();
    }

    public boolean isSpecialist() {
        return this.auditType != null && !this.auditType.isEmpty();
    }

    public boolean isAtLevel(String level) {
        return this.assignedLevel.equals(level);
    }

    public boolean isOfType(String type) {
        return this.userType.equals(type);
    }

    // Getters
    public UUID getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public String getUserType() { return userType; }
    public String getAuditType() { return auditType; }
    public String getAssignedLevel() { return assignedLevel; }
    public String getAssignedLocation() { return assignedLocation; }
    public String getStatus() { return status; }
    public OffsetDateTime getCreatedDate() { return createdDate; }
    public OffsetDateTime getLastModified() { return lastModified; }
    public String getCreatedBy() { return createdBy; }

    // Setters (for domain operations only)
    public void setUserType(String userType) { this.userType = userType; }
    public void setStatus(String status) { this.status = status; }
}
