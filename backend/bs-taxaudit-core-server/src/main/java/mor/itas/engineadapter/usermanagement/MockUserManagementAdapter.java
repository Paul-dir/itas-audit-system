package mor.itas.engineadapter.usermanagement;

import mor.itas.application.port.outboundport.usermanagement.UserManagementPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Mock User Management Adapter
 * Provides in-memory user data for committee member lookups.
 * In production, this would integrate with Keycloak, LDAP, or user-management microservice.
 *
 * Stores user profiles with:
 *   - userId → { name, email, role, taxCenter, region, expertise }
 */
@Component
@Profile({"mock", "test"})
@Slf4j
public class MockUserManagementAdapter implements UserManagementPort {

    /** userId → UserProfile */
    private final Map<String, UserProfile> userStore = new ConcurrentHashMap<>();

    public MockUserManagementAdapter() {
        // Seed committee members
        seedUser("member-001", "Dr. Abebe Kebede", "abebe@mor.gov.et", "COMMITTEE_MEMBER", "TC-ADDIS-01", "AA", "Corporate Tax");
        seedUser("member-002", "Dr. Fatima Ahmed", "fatima@mor.gov.et", "COMMITTEE_MEMBER", "TC-ADDIS-02", "AA", "VAT");
        seedUser("member-003", "Mr. Daniel Tesfaye", "daniel@mor.gov.et", "COMMITTEE_MEMBER", "TC-HAWASSA-01", "SO", "Transfer Pricing");
        seedUser("member-004", "Ms. Sara Hailu", "sara@mor.gov.et", "COMMITTEE_MEMBER", "TC-BAHIR-01", "BA", "International Tax");
        seedUser("member-005", "Mr. Yonas Girma", "yonas@mor.gov.et", "COMMITTEE_MEMBER", "TC-DIREDAWA-01", "DD", "Customs");

        // Chairperson
        seedUser("chair-001", "Director General Mesfin Tadesse", "mesfin@mor.gov.et", "CHAIRPERSON", "TC-ADDIS-01", "AA", "General");

        // Team Leaders
        seedUser("tl-001", "Ato Bikila Demisse", "bikila@mor.gov.et", "TEAM_LEADER", "TC-ADDIS-01", "AA", "Corporate Tax");
        seedUser("tl-002", "W/ro Hanna Bekele", "hanna@mor.gov.et", "TEAM_LEADER", "TC-HAWASSA-01", "SO", "VAT");

        // Auditors
        seedUser("aud-001", "Tigist Mulugeta", "tigist@mor.gov.et", "AUDITOR", "TC-ADDIS-01", "AA", "Corporate Tax");
        seedUser("aud-002", "Getachew Alemayehu", "getachew@mor.gov.et", "AUDITOR", "TC-ADDIS-02", "AA", "VAT");
        seedUser("aud-003", "Meron Tadesse", "meron@mor.gov.et", "AUDITOR", "TC-HAWASSA-01", "SO", "Transfer Pricing");
        seedUser("aud-004", "Dawit Kebede", "dawit@mor.gov.et", "AUDITOR", "TC-BAHIR-01", "BA", "International Tax");
    }

    private void seedUser(String id, String name, String email, String role, String taxCenter, String region, String expertise) {
        userStore.put(id, new UserProfile(id, name, email, role, taxCenter, region, expertise));
    }

    @Override
    public String getUserRole(String userId) {
        UserProfile user = userStore.get(userId);
        return user != null ? user.role : null;
    }

    @Override
    public String getUserTaxCenter(String userId) {
        UserProfile user = userStore.get(userId);
        return user != null ? user.taxCenter : null;
    }

    /**
     * Get full user profile.
     */
    public UserProfile getUserProfile(String userId) {
        return userStore.get(userId);
    }

    /**
     * Get user by email.
     */
    public UserProfile getUserByEmail(String email) {
        return userStore.values().stream()
                .filter(u -> u.email.equals(email))
                .findFirst()
                .orElse(null);
    }

    /**
     * Search users by role.
     */
    public java.util.List<UserProfile> getUsersByRole(String role) {
        return userStore.values().stream()
                .filter(u -> u.role.equals(role))
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Search users by expertise.
     */
    public java.util.List<UserProfile> getUsersByExpertise(String expertise) {
        return userStore.values().stream()
                .filter(u -> u.expertise != null && u.expertise.equalsIgnoreCase(expertise))
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Search users by tax center.
     */
    public java.util.List<UserProfile> getUsersByTaxCenter(String taxCenter) {
        return userStore.values().stream()
                .filter(u -> u.taxCenter != null && u.taxCenter.equals(taxCenter))
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Search users by name (partial match).
     */
    public java.util.List<UserProfile> searchUsersByName(String query) {
        String q = query.toLowerCase();
        return userStore.values().stream()
                .filter(u -> u.name.toLowerCase().contains(q) || u.email.toLowerCase().contains(q))
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Get all committee members (role = COMMITTEE_MEMBER).
     */
    public java.util.List<UserProfile> getCommitteeMembers() {
        return getUsersByRole("COMMITTEE_MEMBER");
    }

    /**
     * Get all auditors.
     */
    public java.util.List<UserProfile> getAuditors() {
        return getUsersByRole("AUDITOR");
    }

    /**
     * Get all team leaders.
     */
    public java.util.List<UserProfile> getTeamLeaders() {
        return getUsersByRole("TEAM_LEADER");
    }

    /**
     * User profile record.
     */
    public static class UserProfile {
        public final String id;
        public final String name;
        public final String email;
        public final String role;
        public final String taxCenter;
        public final String region;
        public final String expertise;

        public UserProfile(String id, String name, String email, String role, String taxCenter, String region, String expertise) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
            this.taxCenter = taxCenter;
            this.region = region;
            this.expertise = expertise;
        }

        @Override
        public String toString() {
            return "UserProfile{id='" + id + "', name='" + name + "', role='" + role + "'}";
        }
    }
}
