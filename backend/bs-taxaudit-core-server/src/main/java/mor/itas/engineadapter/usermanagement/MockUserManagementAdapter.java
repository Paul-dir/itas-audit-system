package mor.itas.engineadapter.usermanagement;

import org.springframework.stereotype.Component;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Mock User Management Adapter - Provides complete user data
 * 
 * Contains 338+ users across all organizational levels:
 * - National (18): Planning Team, Director, Senior Management, Committees
 * - Regional (12): Regional Directors
 * - Tax Centers (308): Managers, Team Leaders, Auditors
 */
@Component
public class MockUserManagementAdapter {

    private static final Map<String, Map<String, Object>> USERS = new HashMap<>();

    static {
        initializeUsers();
    }

    private static void initializeUsers() {
        // NATIONAL LEVEL (18 users)
        // Planning Team
        addUser("PT-001", "pt-001", "pt001@itas.gov", "Planning Team Lead", "PLANNING_TEAM", null, "NATIONAL", "FEDERAL");
        addUser("PT-002", "pt-002", "pt002@itas.gov", "Planning Team Member 1", "PLANNING_TEAM", null, "NATIONAL", "FEDERAL");
        addUser("PT-003", "pt-003", "pt003@itas.gov", "Planning Team Member 2", "PLANNING_TEAM", null, "NATIONAL", "FEDERAL");
        addUser("PT-004", "pt-004", "pt004@itas.gov", "Planning Team Member 3", "PLANNING_TEAM", null, "NATIONAL", "FEDERAL");

        // Director
        addUser("DIR-001", "dir-001", "dir001@itas.gov", "Director", "DIRECTOR", null, "NATIONAL", "FEDERAL");
        addUser("DIR-002", "dir-002", "dir002@itas.gov", "Deputy Director", "DIRECTOR", null, "NATIONAL", "FEDERAL");

        // Senior Management
        addUser("SM-001", "sm-001", "sm001@itas.gov", "Senior Manager 1 (Chair)", "SENIOR_MANAGEMENT", null, "NATIONAL", "FEDERAL");
        addUser("SM-002", "sm-002", "sm002@itas.gov", "Senior Manager 2", "SENIOR_MANAGEMENT", null, "NATIONAL", "FEDERAL");
        addUser("SM-003", "sm-003", "sm003@itas.gov", "Senior Manager 3", "SENIOR_MANAGEMENT", null, "NATIONAL", "FEDERAL");

        // JA Committee (Federal)
        addUser("JA-COMM-001", "ja-comm-001", "ja-comm-001@itas.gov", "JA Committee Chair", "COMMITTEE_MEMBER", "JA", "NATIONAL", "FEDERAL");
        addUser("JA-COMM-002", "ja-comm-002", "ja-comm-002@itas.gov", "JA Committee Member 1", "COMMITTEE_MEMBER", "JA", "NATIONAL", "FEDERAL");
        addUser("JA-COMM-003", "ja-comm-003", "ja-comm-003@itas.gov", "JA Committee Member 2", "COMMITTEE_MEMBER", "JA", "NATIONAL", "FEDERAL");
        addUser("JA-COMM-004", "ja-comm-004", "ja-comm-004@itas.gov", "JA Committee Member 3", "COMMITTEE_MEMBER", "JA", "NATIONAL", "FEDERAL");
        addUser("JA-COMM-005", "ja-comm-005", "ja-comm-005@itas.gov", "JA Committee Member 4", "COMMITTEE_MEMBER", "JA", "NATIONAL", "FEDERAL");

        // TP Committee (Federal)
        addUser("TP-COMM-001", "tp-comm-001", "tp-comm-001@itas.gov", "TP Committee Chair", "COMMITTEE_MEMBER", "TP", "NATIONAL", "FEDERAL");
        addUser("TP-COMM-002", "tp-comm-002", "tp-comm-002@itas.gov", "TP Committee Member 1", "COMMITTEE_MEMBER", "TP", "NATIONAL", "FEDERAL");
        addUser("TP-COMM-003", "tp-comm-003", "tp-comm-003@itas.gov", "TP Committee Member 2", "COMMITTEE_MEMBER", "TP", "NATIONAL", "FEDERAL");
        addUser("TP-COMM-004", "tp-comm-004", "tp-comm-004@itas.gov", "TP Committee Member 3", "COMMITTEE_MEMBER", "TP", "NATIONAL", "FEDERAL");

        // REGIONAL LEVEL (12 users)
        String[] regions = {"AA", "AB", "BA", "BB", "CA", "SO"};
        for (String region : regions) {
            addUser("RD-" + region + "-001", "rd-" + region.toLowerCase() + "-001", "rd-" + region.toLowerCase() + "-001@itas.gov", 
                   "Regional Director " + region, "REGIONAL_DIRECTOR", null, "REGIONAL", region);
            addUser("RD-" + region + "-002", "rd-" + region.toLowerCase() + "-002", "rd-" + region.toLowerCase() + "-002@itas.gov",
                   "Deputy Director " + region, "REGIONAL_DIRECTOR", null, "REGIONAL", region);
        }

        // TAX CENTER LEVEL (308 users)
        String[] taxCenters = {
            "AA-01", "AA-02", "AA-03", "AA-04",
            "AB-01", "AB-02", "AB-03",
            "BA-01", "BA-02", "BA-03",
            "BB-01", "BB-02", "BB-03",
            "CA-01", "CA-02"
        };

        for (String tc : taxCenters) {
            // Tax Center Manager
            addUser("TCM-" + tc, "tcm-" + tc.toLowerCase(), "tcm-" + tc.toLowerCase() + "@itas.gov",
                   "Tax Center Manager " + tc, "TAX_CENTER_MANAGER", null, "TAX_CENTER", tc);

            // Desk Team Leaders (3) and Auditors (2 per TL)
            for (int i = 1; i <= 3; i++) {
                String tlId = "TL-DESK-" + tc + "-" + i;
                addUser(tlId, tlId.toLowerCase(), tlId.toLowerCase() + "@itas.gov",
                       "Desk Team Leader " + i + " (" + tc + ")", "TEAM_LEADER", "DESK", "TAX_CENTER", tc);
                for (int j = 1; j <= 2; j++) {
                    String audId = "AUD-DESK-" + tc + "-" + i + "-" + j;
                    addUser(audId, audId.toLowerCase(), audId.toLowerCase() + "@itas.gov",
                           "Desk Auditor " + j + " (TL" + i + ", " + tc + ")", "AUDITOR", "DESK", "TAX_CENTER", tc);
                }
            }

            // Comprehensive Team Leaders (2) and Auditors (2 per TL)
            for (int i = 1; i <= 2; i++) {
                String tlId = "TL-COMP-" + tc + "-" + i;
                addUser(tlId, tlId.toLowerCase(), tlId.toLowerCase() + "@itas.gov",
                       "Comprehensive Team Leader " + i + " (" + tc + ")", "TEAM_LEADER", "COMP", "TAX_CENTER", tc);
                for (int j = 1; j <= 2; j++) {
                    String audId = "AUD-COMP-" + tc + "-" + i + "-" + j;
                    addUser(audId, audId.toLowerCase(), audId.toLowerCase() + "@itas.gov",
                           "Comprehensive Auditor " + j + " (TL" + i + ", " + tc + ")", "AUDITOR", "COMP", "TAX_CENTER", tc);
                }
            }

            // QA Team Leaders (2) and Auditors (2 per TL)
            for (int i = 1; i <= 2; i++) {
                String tlId = "TL-QA-" + tc + "-" + i;
                addUser(tlId, tlId.toLowerCase(), tlId.toLowerCase() + "@itas.gov",
                       "QA Team Leader " + i + " (" + tc + ")", "TEAM_LEADER", "QA", "TAX_CENTER", tc);
                for (int j = 1; j <= 2; j++) {
                    String audId = "AUD-QA-" + tc + "-" + i + "-" + j;
                    addUser(audId, audId.toLowerCase(), audId.toLowerCase() + "@itas.gov",
                           "QA Auditor " + j + " (TL" + i + ", " + tc + ")", "AUDITOR", "QA", "TAX_CENTER", tc);
                }
            }
        }
    }

    private static void addUser(String userId, String username, String email, String fullName,
                               String userType, String auditType, String level, String location) {
        Map<String, Object> user = new HashMap<>();
        user.put("userId", userId);
        user.put("username", username);
        user.put("email", email);
        user.put("fullName", fullName);
        user.put("userType", userType);
        user.put("auditType", auditType);
        user.put("assignedLevel", level);
        user.put("assignedLocation", location);
        user.put("status", "ACTIVE");
        USERS.put(userId, user);
    }

    // Public APIs for frontend
    public Map<String, Object> getUserById(String userId) {
        return USERS.getOrDefault(userId, new HashMap<>());
    }

    public List<Map<String, Object>> getAllUsers() {
        return new ArrayList<>(USERS.values());
    }

    public List<Map<String, Object>> getUsersByLevel(String level) {
        return USERS.values().stream()
            .filter(u -> level.equals(u.get("assignedLevel")))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getUsersByType(String userType) {
        return USERS.values().stream()
            .filter(u -> userType.equals(u.get("userType")))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getUsersByLocation(String location) {
        return USERS.values().stream()
            .filter(u -> location.equals(u.get("assignedLocation")))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTeamLeaders(String taxCenter, String auditType) {
        return USERS.values().stream()
            .filter(u -> "TEAM_LEADER".equals(u.get("userType")) &&
                       taxCenter.equals(u.get("assignedLocation")) &&
                       auditType.equals(u.get("auditType")))
            .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getAuditors(String taxCenter, String auditType) {
        return USERS.values().stream()
            .filter(u -> "AUDITOR".equals(u.get("userType")) &&
                       taxCenter.equals(u.get("assignedLocation")) &&
                       auditType.equals(u.get("auditType")))
            .collect(Collectors.toList());
    }

    public Map<String, Object> getUserStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", USERS.size());
        stats.put("byLevel", USERS.values().stream()
            .collect(Collectors.groupingBy(u -> u.get("assignedLevel"), Collectors.counting())));
        stats.put("byType", USERS.values().stream()
            .collect(Collectors.groupingBy(u -> u.get("userType"), Collectors.counting())));
        return stats;
    }
}
