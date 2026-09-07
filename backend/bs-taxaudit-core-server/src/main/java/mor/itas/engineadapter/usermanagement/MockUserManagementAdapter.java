package mor.itas.engineadapter.usermanagement;

import mor.itas.application.port.outboundport.usermanagement.UserManagementPort;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Mock User Management Adapter — Complete user directory for the ITAS Audit System.
 *
 * Hierarchy:
 *   NATIONAL  → Planning Team, Director, Senior Mgmt, Committees, Audit Requesters
 *   REGIONAL  → Regional Directors (Federal + 6 Regions)
 *   TAX_CENTER → Manager, Team Leaders (per audit type, numbered), Auditors (per TL, numbered)
 *
 * Tax-center IDs use the frontend-canonical format:
 *   federal-lto1, federal-lto2
 *   addis_ababa-tc1, addis_ababa-tc2, addis_ababa-tc3
 *   amhara-tc1, amhara-tc2, amhara-tc3
 *   oromia-tc1, oromia-tc2, oromia-tc3
 *   dire_dawa-tc1, dire_dawa-tc2, dire_dawa-tc3
 *   snnpr-tc1, snnpr-tc2, snnpr-tc3
 *   somali-tc1, somali-tc2, somali-tc3
 *
 * Audit types (backend IDs): DESK_AUDIT, FIELD_AUDIT, JOINT_AUDIT, TRANSFER_PRICING, COMPREHENSIVE_AUDIT, ISSUE_AUDIT
 */
@Component
@Profile("mock")
public class MockUserManagementAdapter implements UserManagementPort {

    private static final Map<String, Map<String, Object>> USERS = new LinkedHashMap<>();

    // Ethiopian names pool
    private static final String[] FIRST_NAMES = {
        "Abebe","Almaw","Tadesse","Workneh","Almaz","Tigist","Ephrem","Abdi",
        "Hassen","Mamo","Kassa","Bikila","Tekle","Haile","Dawit","Meron",
        "Selam","Bereket","Solomon","Getnet","Gemechu","Ibrahim","Yonas",
        "Chaltu","Fatuma","Kassahun","Tirhas","Mekdes","Dereje","Lalisa",
        "Birtukan","Genet","Henok","Seble","Sara","Fikadu","Bethlehem",
        "Yosef","Eleni","Nardos","Addis","Kidist","Robel","Natnael",
        "Yodit","Samuel","Eden","Meseret","Amanuel","Ruth","Tewodros",
        "Mesfin","Fikremariam","Saron","Michael","Eyerusalem","Abdi",
        "Mahlet","Tolera","Diriba","Mulugeta","Rahel","Berihun","Tsega"
    };
    private static final String[] LAST_NAMES = {
        "Getachew","Tesfa","Alemu","Bekele","Kebede","Mekonnen","Tilahun",
        "Assefa","Girma","Belay","Tadesse","Mamo","Kassa","Worku","Haile",
        "Negash","Zewde","Bikila","Tesfaye","Mulugeta","Lemma","Gebre",
        "Abera","Wolde","Berhane","Desta","Kifle","Alemayehu","Banti",
        "Wakjira","Mengistu","Hassan","Yohannes","Mideksa"
    };
    private static int employeeCounter = 4200;

    static {
        initializeUsers();
    }

    // ───────── NATIONAL LEVEL ─────────

    private static void initializeUsers() {

        // ── Planning Team ──
        addUser("u-pt-01", "u-pt-01", "planning.auditor1@mor.gov.et",
                "Planning Team Lead", "PLANNING_TEAM", null, "NATIONAL", "FEDERAL");
        addUser("u-pt-02", "u-pt-02", "abebe.tadesse@mor.gov.et",
                "Planning Team Member 1", "PLANNING_TEAM", null, "NATIONAL", "FEDERAL");
        addUser("u-pt-03", "u-pt-03", "hanna.girma@mor.gov.et",
                "Planning Team Member 2", "PLANNING_TEAM", null, "NATIONAL", "FEDERAL");

        // ── Director ──
        addUser("u-ad-01", "u-ad-01", "tesfaye.bekele@mor.gov.et",
                "Director", "DIRECTOR", null, "NATIONAL", "FEDERAL");
        addUser("u-ad-02", "u-ad-02", "deputy.director@mor.gov.et",
                "Deputy Director", "DIRECTOR", null, "NATIONAL", "FEDERAL");

        // ── Senior Management ──
        addUser("u-sm-01", "u-sm-01", "rahel.hailu@mor.gov.et",
                "Senior Manager 1 (Chair)", "SENIOR_MANAGEMENT", null, "NATIONAL", "FEDERAL");
        addUser("u-sm-02", "u-sm-02", "biruk.assefa@mor.gov.et",
                "Senior Manager 2", "SENIOR_MANAGEMENT", null, "NATIONAL", "FEDERAL");

        // ── JA Committee (Federal) ──
        addUser("u-com-fed-chair", "u-com-fed-chair", "fed.committee1@mor.gov.et",
                "Federal Joint Committee Chair", "COMMITTEE_MEMBER", "JOINT_AUDIT", "NATIONAL", "FEDERAL");
        addUser("u-com-fed-mem1", "u-com-fed-mem1", "fed.committee2@mor.gov.et",
                "Federal Joint Committee Member 1", "COMMITTEE_MEMBER", "JOINT_AUDIT", "NATIONAL", "FEDERAL");
        addUser("u-com-fed-mem2", "u-com-fed-mem2", "fed.committee3@mor.gov.et",
                "Federal Joint Committee Member 2", "COMMITTEE_MEMBER", "JOINT_AUDIT", "NATIONAL", "FEDERAL");

        // ── TP Committee (Federal) ──
        addUser("u-com-fed-tpchair", "u-com-fed-tpchair", "fed.tpcommittee1@mor.gov.et",
                "Federal TP Committee Chair", "COMMITTEE_MEMBER", "TRANSFER_PRICING", "NATIONAL", "FEDERAL");
        addUser("u-com-fed-tpmem1", "u-com-fed-tpmem1", "fed.tpcommittee2@mor.gov.et",
                "Federal TP Committee Member 1", "COMMITTEE_MEMBER", "TRANSFER_PRICING", "NATIONAL", "FEDERAL");
        addUser("u-com-fed-tpmem2", "u-com-fed-tpmem2", "fed.tpcommittee3@mor.gov.et",
                "Federal TP Committee Member 2", "COMMITTEE_MEMBER", "TRANSFER_PRICING", "NATIONAL", "FEDERAL");

        // ── Desk Audit Committee (Federal) ──
        addUser("u-com-fed-deskchair", "u-com-fed-deskchair", "fed.deskcommittee@mor.gov.et",
                "Federal Desk Audit Committee Chair", "COMMITTEE_MEMBER", "DESK_AUDIT", "NATIONAL", "FEDERAL");
        addUser("u-com-fed-deskmem1", "u-com-fed-deskmem1", "fed.deskmem1@mor.gov.et",
                "Federal Desk Audit Committee Member 1", "COMMITTEE_MEMBER", "DESK_AUDIT", "NATIONAL", "FEDERAL");

        // ── Comprehensive Audit Committee (Federal) ──
        addUser("u-com-fed-compchair", "u-com-fed-compchair", "fed.compcommittee@mor.gov.et",
                "Federal Comprehensive Audit Committee Chair", "COMMITTEE_MEMBER", "COMPREHENSIVE_AUDIT", "NATIONAL", "FEDERAL");
        addUser("u-com-fed-compmem1", "u-com-fed-compmem1", "fed.compmem1@mor.gov.et",
                "Federal Comprehensive Audit Committee Member 1", "COMMITTEE_MEMBER", "COMPREHENSIVE_AUDIT", "NATIONAL", "FEDERAL");

        // ── Issue Audit Committee (Federal) ──
        addUser("u-com-fed-issuechair", "u-com-fed-issuechair", "fed.issuecommittee@mor.gov.et",
                "Federal Issue Audit Committee Chair", "COMMITTEE_MEMBER", "ISSUE_AUDIT", "NATIONAL", "FEDERAL");
        addUser("u-com-fed-issuemem1", "u-com-fed-issuemem1", "fed.issuemem1@mor.gov.et",
                "Federal Issue Audit Committee Member 1", "COMMITTEE_MEMBER", "ISSUE_AUDIT", "NATIONAL", "FEDERAL");

        // ── Audit Requesters (internal & external directorates) ──
        addUser("u-req-01", "u-req-01", "clearance.officer@mor.gov.et",
                "Getachew Zewde (Tax Clearance)", "AUDIT_REQUESTER", null, "NATIONAL", "FEDERAL");
        addUser("u-req-02", "u-req-02", "closure.directorate@mor.gov.et",
                "Tigist Worku (Business Closure)", "AUDIT_REQUESTER", null, "NATIONAL", "FEDERAL");
        addUser("u-req-03", "u-req-03", "fraud.intel@mor.gov.et",
                "Deriba Alemayehu (Fraud & Intel)", "AUDIT_REQUESTER", null, "NATIONAL", "FEDERAL");
        addUser("u-req-04", "u-req-04", "external.motri@gov.et",
                "Ministry of Trade (External)", "AUDIT_REQUESTER", null, "NATIONAL", "FEDERAL");

        // ───────── REGIONAL LEVEL ─────────
        // One Regional Director per region
        addUser("u-rd-fed", "u-rd-fed", "solomon.worku@mor.gov.et",
                "Solomon Worku (Federal LTO)", "REGIONAL_DIRECTOR", null, "REGIONAL", "FED");
        addUser("u-rd-aa", "u-rd-aa", "getnet.alemu@mor.gov.et",
                "Getnet Alemu", "REGIONAL_DIRECTOR", null, "REGIONAL", "AA");
        addUser("u-rd-am", "u-rd-am", "tadesse.kebede@mor.gov.et",
                "Tadesse Kebede", "REGIONAL_DIRECTOR", null, "REGIONAL", "BA");
        addUser("u-rd-or", "u-rd-or", "gemechu.negash@mor.gov.et",
                "Gemechu Negash", "REGIONAL_DIRECTOR", null, "REGIONAL", "BB");
        addUser("u-rd-dd", "u-rd-dd", "yonas.mengistu.dd@mor.gov.et",
                "Yonas Mengistu (Dire Dawa)", "REGIONAL_DIRECTOR", null, "REGIONAL", "AB");
        addUser("u-rd-sn", "u-rd-sn", "yonas.mengistu@mor.gov.et",
                "Yonas Mengistu", "REGIONAL_DIRECTOR", null, "REGIONAL", "CA");
        addUser("u-rd-so", "u-rd-so", "ibrahim.hassan@mor.gov.et",
                "Ibrahim Hassan", "REGIONAL_DIRECTOR", null, "REGIONAL", "SO");

        // ───────── TAX CENTER LEVEL ─────────
        // Each tax center gets: 1 Manager + per audit type (2 TLs + 2 Aud per TL)

        String[][] taxCenterDefs = {
            // { tcId,              regionCode, shortLabel }
            {"federal-lto1",     "FED", "FED-LTO1"},
            {"federal-lto2",     "FED", "FED-LTO2"},
            {"addis_ababa-tc1",  "AA",  "AA-TC1"},
            {"addis_ababa-tc2",  "AA",  "AA-TC2"},
            {"addis_ababa-tc3",  "AA",  "AA-TC3"},
            {"amhara-tc1",       "BA",  "BA-TC1"},
            {"amhara-tc2",       "BA",  "BA-TC2"},
            {"amhara-tc3",       "BA",  "BA-TC3"},
            {"oromia-tc1",       "BB",  "BB-TC1"},
            {"oromia-tc2",       "BB",  "BB-TC2"},
            {"oromia-tc3",       "BB",  "BB-TC3"},
            {"dire_dawa-tc1",    "AB",  "AB-TC1"},
            {"dire_dawa-tc2",    "AB",  "AB-TC2"},
            {"dire_dawa-tc3",    "AB",  "AB-TC3"},
            {"snnpr-tc1",        "CA",  "CA-TC1"},
            {"snnpr-tc2",        "CA",  "CA-TC2"},
            {"snnpr-tc3",        "CA",  "CA-TC3"},
            {"somali-tc1",       "SO",  "SO-TC1"},
            {"somali-tc2",       "SO",  "SO-TC2"},
            {"somali-tc3",       "SO",  "SO-TC3"},
        };

        // 5 audit types that match the frontend
        String[][] auditTypeDefs = {
            // { backendId,              shortLabel }
            {"DESK_AUDIT",          "Desk"},
            {"JOINT_AUDIT",         "Joint"},
            {"TRANSFER_PRICING",    "TP"},
            {"COMPREHENSIVE_AUDIT", "Comp"},
            {"ISSUE_AUDIT",         "Issue"},
        };

        for (String[] tcDef : taxCenterDefs) {
            String tcId = tcDef[0];
            String tcShort = tcDef[2];

            // Tax Center Manager
            String tcmId = "u-tcm-" + tcId;
            addUser(tcmId, tcmId, tcmId + "@mor.gov.et",
                    "Tax Center Manager " + tcShort, "TAX_CENTER_MANAGER", null, "TAX_CENTER", tcId);

            // JA Committee at this TC
            String jaChairId = "u-com-" + tcId + "-ja";
            addUser(jaChairId, jaChairId, jaChairId + "@mor.gov.et",
                    "Joint Committee Chair (" + tcShort + ")", "COMMITTEE_MEMBER", "JOINT_AUDIT", "TAX_CENTER", tcId);
            // TP Committee at this TC
            String tpChairId = "u-com-" + tcId + "-tp";
            addUser(tpChairId, tpChairId, tpChairId + "@mor.gov.et",
                    "TP Committee Chair (" + tcShort + ")", "COMMITTEE_MEMBER", "TRANSFER_PRICING", "TAX_CENTER", tcId);

            for (String[] atDef : auditTypeDefs) {
                String auditType = atDef[0];
                String atShort = atDef[1];

                // 2 Team Leaders per audit type
                for (int tl = 1; tl <= 2; tl++) {
                    String tlId = "u-tl-" + tcId + "-" + atShort.toLowerCase() + "-" + tl;
                    String tlTitle = atShort + " TL-" + tl + " (" + tcShort + ")";
                    addUser(tlId, tlId, tlId + "@mor.gov.et",
                            tlTitle, "TEAM_LEADER", auditType, "TAX_CENTER", tcId);

                    // 2 Auditors per Team Leader
                    for (int a = 1; a <= 2; a++) {
                        String audId = "u-aud-" + tcId + "-" + atShort.toLowerCase() + "-" + tl + "-" + a;
                        String audTitle = atShort + " Aud-" + a + " (TL-" + tl + ", " + tcShort + ")";
                        addUser(audId, audId, audId + "@mor.gov.et",
                                audTitle, "AUDITOR", auditType, "TAX_CENTER", tcId);
                    }
                }
            }
        }
    }

    // ───────── User builder ─────────

    private static void addUser(String userId, String username, String email, String title,
                               String userType, String auditType, String level, String location) {

        String firstName = FIRST_NAMES[Math.abs(userId.hashCode()) % FIRST_NAMES.length];
        String lastName  = LAST_NAMES[Math.abs(username.hashCode()) % LAST_NAMES.length];
        String fullName  = firstName + " " + lastName;

        // For named requesters / committee chairs keep their title as fullName
        if ("AUDIT_REQUESTER".equals(userType) || title.contains("(")) {
            // keep generated name but prepend the descriptive title for clarity
        }

        String realisticEmail = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@mor.gov.et";
        // Prefer the explicit email if it looks intentional
        if (email != null && !email.startsWith("u-")) {
            realisticEmail = email;
        }

        String department = "Tax Audit";
        if (auditType != null) {
            switch (auditType) {
                case "DESK_AUDIT":          department = "Desk Audit";         break;
                case "JOINT_AUDIT":         department = "Joint Audit";        break;
                case "TRANSFER_PRICING":    department = "Transfer Pricing";   break;
                case "COMPREHENSIVE_AUDIT": department = "Comprehensive Audit";break;
                case "ISSUE_AUDIT":         department = "Issue Audit";        break;
                default:                    department = auditType;            break;
            }
        }

        Map<String, Object> user = new LinkedHashMap<>();
        user.put("userId",           userId);
        user.put("username",         username);
        user.put("email",            realisticEmail);
        user.put("fullName",         fullName);
        user.put("jobTitle",         title);
        user.put("department",       department);
        user.put("officeLocation",   location);
        user.put("userType",         userType);
        user.put("auditType",        auditType);
        user.put("assignedLevel",    level);
        user.put("assignedLocation", location);
        user.put("employeeId",       "MOR-" + (employeeCounter++));
        user.put("status",           "ACTIVE");
        user.put("supervisorId",     "u-ad-01");

        List<String> roles = new ArrayList<>(Arrays.asList("ROLE_USER"));
        roles.add("ROLE_" + userType);
        user.put("roles", roles);

        USERS.put(userId, user);
    }

    // ───────── Port interface ─────────

    @Override
    public String getUserRole(String userId) {
        Map<String, Object> user = USERS.get(userId);
        if (user == null) return "ROLE_USER";
        return (String) user.get("userType");
    }

    @Override
    public String getUserTaxCenter(String userId) {
        Map<String, Object> user = USERS.get(userId);
        if (user == null) return null;
        return (String) user.get("assignedLocation");
    }

    @Override
    public List<Map<String, Object>> getTeamLeaders(String taxCenterCode, String auditType) {
        return USERS.values().stream()
            .filter(u -> "TEAM_LEADER".equals(u.get("userType")))
            .filter(u -> taxCenterCode == null || taxCenterCode.equalsIgnoreCase((String) u.get("assignedLocation")))
            .filter(u -> auditType == null || auditType.equalsIgnoreCase((String) u.get("auditType")))
            .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getCommitteeMembers(String auditType) {
        return USERS.values().stream()
            .filter(u -> "COMMITTEE_MEMBER".equals(u.get("userType")) || "AUDITOR".equals(u.get("userType")))
            .filter(u -> auditType == null || auditType.equalsIgnoreCase((String) u.get("auditType")))
            .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getUserById(String userId) {
        return USERS.get(userId);
    }

    public Optional<Map<String, Object>> getUserProfile(String userId) {
        return Optional.ofNullable(USERS.get(userId));
    }

    /** Used by MockDataSeeder to seed all users into the AP UserRepository / DB. */
    public List<Map<String, Object>> getAllUsers() {
        return new ArrayList<>(USERS.values());
    }

    public List<Map<String, Object>> findUsersByCriteria(Map<String, Object> criteria) {
        return USERS.values().stream()
                .filter(u -> matchesCriteria(u, criteria))
                .collect(Collectors.toList());
    }

    private boolean matchesCriteria(Map<String, Object> user, Map<String, Object> criteria) {
        for (Map.Entry<String, Object> entry : criteria.entrySet()) {
            if (entry.getValue() == null) continue;

            Object userValue = user.get(entry.getKey());

            // Special handling: "region" matches both REGIONAL location (code) and TAX_CENTER prefix
            if ("region".equals(entry.getKey())) {
                String region = (String) entry.getValue();
                if ("REGIONAL".equals(user.get("assignedLevel"))) {
                    if (!region.equalsIgnoreCase((String) user.get("assignedLocation"))) return false;
                } else if ("TAX_CENTER".equals(user.get("assignedLevel"))) {
                    String loc = (String) user.get("assignedLocation");
                    // Frontend region-id based matching (e.g. addis_ababa → addis_ababa-tc1)
                    if (!loc.toUpperCase().startsWith(region.toUpperCase())) {
                        // Also try short code matching (AA → addis_ababa-tc1? No. So skip.)
                        return false;
                    }
                } else {
                    return false;
                }
                continue;
            }

            if (userValue == null || !userValue.toString().equalsIgnoreCase(entry.getValue().toString())) {
                return false;
            }
        }
        return true;
    }
}
