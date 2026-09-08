package mor.itas.domain.valueobject;

/**
 * Vote option enumeration for advisory voting
 */
public enum VoteOption {
    APPROVE("approve", "Approve the case for joint audit"),
    REJECT("reject", "Reject the case"),
    MORE_INFO("more_info", "Requires more research and information");

    private final String code;
    private final String description;

    VoteOption(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static VoteOption fromCode(String code) {
        for (VoteOption option : values()) {
            if (option.code.equals(code)) {
                return option;
            }
        }
        throw new IllegalArgumentException("Unknown vote option: " + code);
    }

    /**
     * Reads both current enum values and legacy values stored by older data.
     */
    public static VoteOption fromPersistedValue(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Vote option cannot be null");
        }
        return switch (value.trim().toUpperCase()) {
            case "APPROVE", "YES" -> APPROVE;
            case "REJECT", "NO" -> REJECT;
            case "MORE_INFO", "MOREINFO", "MORE INFORMATION" -> MORE_INFO;
            default -> throw new IllegalArgumentException("Unknown vote option: " + value);
        };
    }
}
