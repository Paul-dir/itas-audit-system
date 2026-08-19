package mor.itas.domain.model.ap;

import java.time.OffsetDateTime;
import java.util.*;

/**
 * Committee Model for ITAS Audit System (AP Cluster)
 * 
 * Represents committees at national/federal and regional levels:
 * - Joint Audit (JA) Committee at Federal level
 * - Transfer Pricing (TP) Committee at Federal level
 */
public class Committee {
    private UUID committeeId;
    private String committeeName;
    private String committeeType; // JA (Joint Audit), TP (Transfer Pricing)
    private String level; // NATIONAL, REGIONAL
    private String location; // FEDERAL for national, Region code for regional
    private UUID chairId; // User ID of committee chair
    private List<UUID> memberIds; // List of User IDs
    private Integer capacity; // Max cases per period
    private Integer currentLoad; // Current case load
    private String status; // ACTIVE, INACTIVE
    private OffsetDateTime createdDate;
    private OffsetDateTime lastModified;
    private String createdBy;

    // Constructors
    public Committee(String committeeName, String committeeType, String level, 
                    String location, UUID chairId, String createdBy) {
        this.committeeId = UUID.randomUUID();
        this.committeeName = committeeName;
        this.committeeType = committeeType;
        this.level = level;
        this.location = location;
        this.chairId = chairId;
        this.memberIds = new ArrayList<>();
        this.capacity = getDefaultCapacity(committeeType);
        this.currentLoad = 0;
        this.status = "ACTIVE";
        this.createdDate = OffsetDateTime.now();
        this.lastModified = OffsetDateTime.now();
        this.createdBy = createdBy;
    }

    public Committee(String committeeName, String committeeType, String level, 
                    String location, UUID chairId, Integer capacity, String createdBy) {
        this(committeeName, committeeType, level, location, chairId, createdBy);
        this.capacity = capacity;
    }

    // Full constructor for reconstruction
    public Committee(UUID committeeId, String committeeName, String committeeType, 
                    String level, String location, UUID chairId, List<UUID> memberIds,
                    Integer capacity, Integer currentLoad, String status,
                    OffsetDateTime createdDate, OffsetDateTime lastModified, String createdBy) {
        this.committeeId = committeeId;
        this.committeeName = committeeName;
        this.committeeType = committeeType;
        this.level = level;
        this.location = location;
        this.chairId = chairId;
        this.memberIds = new ArrayList<>(memberIds);
        this.capacity = capacity;
        this.currentLoad = currentLoad;
        this.status = status;
        this.createdDate = createdDate;
        this.lastModified = lastModified;
        this.createdBy = createdBy;
    }

    // Business logic methods
    public void addMember(UUID memberId) {
        if (memberIds.contains(memberId)) {
            throw new IllegalStateException("User is already a committee member");
        }
        if (memberId.equals(chairId)) {
            throw new IllegalStateException("Chair is automatically a member");
        }
        memberIds.add(memberId);
        lastModified = OffsetDateTime.now();
    }

    public void removeMember(UUID memberId) {
        if (memberId.equals(chairId)) {
            throw new IllegalStateException("Cannot remove committee chair");
        }
        if (!memberIds.contains(memberId)) {
            throw new IllegalStateException("User is not a committee member");
        }
        memberIds.remove(memberId);
        lastModified = OffsetDateTime.now();
    }

    public void assignCase(UUID caseId) {
        if (currentLoad >= capacity) {
            throw new IllegalStateException("Committee has reached maximum capacity");
        }
        currentLoad++;
        lastModified = OffsetDateTime.now();
    }

    public void completeCase(UUID caseId) {
        if (currentLoad <= 0) {
            throw new IllegalStateException("No cases to complete");
        }
        currentLoad--;
        lastModified = OffsetDateTime.now();
    }

    public void deactivate() {
        if ("INACTIVE".equals(this.status)) {
            throw new IllegalStateException("Committee is already inactive");
        }
        this.status = "INACTIVE";
        this.lastModified = OffsetDateTime.now();
    }

    public void activate() {
        if ("ACTIVE".equals(this.status)) {
            throw new IllegalStateException("Committee is already active");
        }
        this.status = "ACTIVE";
        this.lastModified = OffsetDateTime.now();
    }

    public void updateCapacity(Integer newCapacity) {
        if (newCapacity < currentLoad) {
            throw new IllegalStateException(
                "Cannot reduce capacity below current load (" + currentLoad + ")");
        }
        this.capacity = newCapacity;
        this.lastModified = OffsetDateTime.now();
    }

    public void changeChair(UUID newChairId) {
        if (newChairId.equals(this.chairId)) {
            throw new IllegalStateException("New chair is already the current chair");
        }
        if (!memberIds.contains(newChairId) && !newChairId.equals(this.chairId)) {
            throw new IllegalStateException("New chair must be a committee member or current chair");
        }
        this.chairId = newChairId;
        this.lastModified = OffsetDateTime.now();
    }

    public boolean hasCapacity() {
        return currentLoad < capacity;
    }

    public int getRemainingCapacity() {
        return Math.max(0, capacity - currentLoad);
    }

    public boolean isMember(UUID userId) {
        return userId.equals(chairId) || memberIds.contains(userId);
    }

    public int getTotalMembers() {
        return memberIds.size() + 1; // +1 for chair
    }

    public boolean isAtNationalLevel() {
        return "NATIONAL".equals(level);
    }

    public boolean isJointAuditCommittee() {
        return "JA".equals(committeeType);
    }

    public boolean isTransferPricingCommittee() {
        return "TP".equals(committeeType);
    }

    // Static helper
    public static int getDefaultCapacity(String committeeType) {
        if ("JA".equals(committeeType)) {
            return 100; // JA Committee can handle up to 100 cases
        } else if ("TP".equals(committeeType)) {
            return 50;  // TP Committee can handle up to 50 cases
        } else {
            return 75;  // Default
        }
    }

    // Getters
    public UUID getCommitteeId() { return committeeId; }
    public String getCommitteeName() { return committeeName; }
    public String getCommitteeType() { return committeeType; }
    public String getLevel() { return level; }
    public String getLocation() { return location; }
    public UUID getChairId() { return chairId; }
    public List<UUID> getMemberIds() { return Collections.unmodifiableList(memberIds); }
    public Integer getCapacity() { return capacity; }
    public Integer getCurrentLoad() { return currentLoad; }
    public String getStatus() { return status; }
    public OffsetDateTime getCreatedDate() { return createdDate; }
    public OffsetDateTime getLastModified() { return lastModified; }
    public String getCreatedBy() { return createdBy; }

    // Setters (for domain operations only)
    public void setStatus(String status) { this.status = status; }
}
