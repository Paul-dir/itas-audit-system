package mor.itas.domain.model.ap;

/**
 * RiskLevel - Enum for taxpayer risk classification
 * 
 * Represents the four risk categories used in audit planning:
 * - CRITICAL: Highest risk, requires immediate audit
 * - HIGH: High risk, should be audited
 * - MEDIUM: Medium risk, should be considered
 * - LOW: Low risk, audit as capacity permits
 */
public enum RiskLevel {
    CRITICAL("Critical", 1),
    HIGH("High", 2),
    MEDIUM("Medium", 3),
    LOW("Low", 4);

    private final String displayName;
    private final int priority;

    RiskLevel(String displayName, int priority) {
        this.displayName = displayName;
        this.priority = priority;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getPriority() {
        return priority;
    }

    /**
     * Parse RiskLevel from string representation
     */
    public static RiskLevel fromString(String value) {
        if (value == null) return LOW;
        try {
            return RiskLevel.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return LOW; // Default to LOW if not recognized
        }
    }
}
