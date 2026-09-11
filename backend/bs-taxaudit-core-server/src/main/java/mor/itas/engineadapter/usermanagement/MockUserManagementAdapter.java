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

        // ── Federal LTO-1 Joint Audit Personnel ──
        addUser("20000000-0000-0000-0099-000000000001", "fed.ja.chair", "fed.ja.chair@mor.gov.et",
                "Dr. Solomon Desta", "COMMITTEE_CHAIR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto1");
        addUser("20000000-0000-0000-0099-000000000002", "fed.ja.member", "fed.ja.member@mor.gov.et",
                "Eleni Tesfaye", "COMMITTEE_MEMBER", "JOINT_AUDIT", "TAX_CENTER", "federal-lto1");
        addUser("10000000-0000-0000-0099-000000000001", "fed.ja.tl", "fed.ja.tl@mor.gov.et",
                "Addis Zewde", "TEAM_LEADER", "JOINT_AUDIT", "TAX_CENTER", "federal-lto1");
        addUser("10000000-0000-0000-0099-000000000002", "fed.ja.tl2", "fed.ja.tl2@mor.gov.et",
                "Nardos Negash", "TEAM_LEADER", "JOINT_AUDIT", "TAX_CENTER", "federal-lto1");
        addUser("a0000001-0000-0000-0099-000000000001", "fed.ja.auditor1", "fed.ja.auditor1@mor.gov.et",
                "Fikremariam Tilahun", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto1");
        addUser("a0000001-0000-0000-0099-000000000002", "fed.ja.auditor2", "fed.ja.auditor2@mor.gov.et",
                "Saron Assefa", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto1");
        addUser("a0000001-0000-0000-0099-000000000003", "fed.ja.auditor3", "fed.ja.auditor3@mor.gov.et",
                "Bikila Worku", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto1");
        addUser("a0000001-0000-0000-0099-000000000004", "fed.ja.auditor4", "fed.ja.auditor4@mor.gov.et",
                "Michael Zewde", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto1");
        addUser("a0000001-0000-0000-0099-000000000005", "fed.ja.auditor5", "fed.ja.auditor5@mor.gov.et",
                "Saron Negash", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto1");
        addUser("a0000001-0000-0000-0099-000000000006", "fed.ja.auditor6", "fed.ja.auditor6@mor.gov.et",
                "Almaw Tesfa", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto1");
        addUser("a0000001-0000-0000-0099-000000000007", "fed.ja.auditor7", "fed.ja.auditor7@mor.gov.et",
                "Tigist Alemu", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto1");
        addUser("a0000001-0000-0000-0099-000000000008", "fed.ja.auditor8", "fed.ja.auditor8@mor.gov.et",
                "Ephrem Bekele", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto1");
        addUser("a0000001-0000-0000-0099-000000000009", "fed.ja.auditor9", "fed.ja.auditor9@mor.gov.et",
                "Meron Kebede", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto1");
        addUser("a0000001-0000-0000-0099-000000000010", "fed.ja.auditor10", "fed.ja.auditor10@mor.gov.et",
                "Bereket Mekonnen", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto1");

        // ── Federal LTO-2 Joint Audit Personnel ──
        addUser("20000000-0000-0000-0098-000000000001", "fed2.ja.chair", "fed2.ja.chair@mor.gov.et",
                "Dr. Worku Alemayehu", "COMMITTEE_CHAIR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto2");
        addUser("20000000-0000-0000-0098-000000000002", "fed2.ja.member", "fed2.ja.member@mor.gov.et",
                "Tigist Hailu", "COMMITTEE_MEMBER", "JOINT_AUDIT", "TAX_CENTER", "federal-lto2");
        addUser("10000000-0000-0000-0098-000000000001", "fed2.ja.tl", "fed2.ja.tl@mor.gov.et",
                "Berhanu Bekele", "TEAM_LEADER", "JOINT_AUDIT", "TAX_CENTER", "federal-lto2");
        addUser("10000000-0000-0000-0098-000000000002", "fed2.ja.tl2", "fed2.ja.tl2@mor.gov.et",
                "Eleni Banti", "TEAM_LEADER", "JOINT_AUDIT", "TAX_CENTER", "federal-lto2");
        addUser("a0000001-0000-0000-0098-000000000001", "fed2.ja.auditor1", "fed2.ja.auditor1@mor.gov.et",
                "Dawit Mengistu", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto2");
        addUser("a0000001-0000-0000-0098-000000000002", "fed2.ja.auditor2", "fed2.ja.auditor2@mor.gov.et",
                "Eden Tadesse", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto2");
        addUser("a0000001-0000-0000-0098-000000000003", "fed2.ja.auditor3", "fed2.ja.auditor3@mor.gov.et",
                "Henok Girma", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto2");
        addUser("a0000001-0000-0000-0098-000000000004", "fed2.ja.auditor4", "fed2.ja.auditor4@mor.gov.et",
                "Meron Kebede", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto2");
        addUser("a0000001-0000-0000-0098-000000000005", "fed2.ja.auditor5", "fed2.ja.auditor5@mor.gov.et",
                "Natnael Assefa", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto2");
        addUser("a0000001-0000-0000-0098-000000000006", "fed2.ja.auditor6", "fed2.ja.auditor6@mor.gov.et",
                "Fikadu Wolde", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto2");
        addUser("a0000001-0000-0000-0098-000000000007", "fed2.ja.auditor7", "fed2.ja.auditor7@mor.gov.et",
                "Genet Alemu", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto2");
        addUser("a0000001-0000-0000-0098-000000000008", "fed2.ja.auditor8", "fed2.ja.auditor8@mor.gov.et",
                "Habtamu Desta", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto2");
        addUser("a0000001-0000-0000-0098-000000000009", "fed2.ja.auditor9", "fed2.ja.auditor9@mor.gov.et",
                "Selam Haile", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto2");
        addUser("a0000001-0000-0000-0098-000000000010", "fed2.ja.auditor10", "fed2.ja.auditor10@mor.gov.et",
                "Getnet Alemayehu", "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "federal-lto2");

        // ── Regional Committee Chairs (Joint & TP) ──
        addUser("20000000-0000-0000-0001-000000000001", "aa1.chair", "aa1.chair@mor.gov.et",
                "Dr. Abebe Kebede", "COMMITTEE_CHAIR", "JOINT_AUDIT", "TAX_CENTER", "addis_ababa-tc1");
        addUser("20000000-0000-0000-0001-000000000002", "aa1.member", "aa1.member@mor.gov.et",
                "Fatuma Ahmed", "COMMITTEE_MEMBER", "JOINT_AUDIT", "TAX_CENTER", "addis_ababa-tc1");
        addUser("10000000-0000-0000-0001-000000000001", "aa1.tl", "aa1.tl@mor.gov.et",
                "Dawit Tadesse", "TEAM_LEADER", "JOINT_AUDIT", "TAX_CENTER", "addis_ababa-tc1");
        addUser("10000000-0000-0000-0001-000000000002", "aa1.tl2", "aa1.tl2@mor.gov.et",
                "Robel Girma", "TEAM_LEADER", "JOINT_AUDIT", "TAX_CENTER", "addis_ababa-tc1");
        for (int i = 1; i <= 10; i++) {
            String audId = String.format("a0000001-0000-0000-0001-0000000000%02d", i);
            String un = "aa1.auditor" + i;
            addUser(audId, un, un + "@mor.gov.et",
                    "AA1 Auditor " + i, "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", "addis_ababa-tc1");
        }
        addUser("u-com-aa-tpchair", "u-com-aa-tpchair", "aa.tpchair@mor.gov.et",
                "TP Committee Chair AA", "COMMITTEE_CHAIR", "TRANSFER_PRICING", "TAX_CENTER", "addis_ababa-tc1");
        addUser("20000000-0000-0000-0004-000000000001", "or1.chair", "or1.chair@mor.gov.et",
                "Dr. Chaltu Negash", "COMMITTEE_CHAIR", "JOINT_AUDIT", "TAX_CENTER", "oromia-tc1");
        addUser("20000000-0000-0000-0004-000000000002", "or1.member", "or1.member@mor.gov.et",
                "Diriba Lema", "COMMITTEE_MEMBER", "JOINT_AUDIT", "TAX_CENTER", "oromia-tc1");
        addUser("20000000-0000-0000-0007-000000000001", "am1.chair", "am1.chair@mor.gov.et",
                "Dr. Tadesse Kebede", "COMMITTEE_CHAIR", "JOINT_AUDIT", "TAX_CENTER", "amhara-tc1");
        addUser("20000000-0000-0000-0007-000000000002", "am1.member", "am1.member@mor.gov.et",
                "Almaz Kassa", "COMMITTEE_MEMBER", "JOINT_AUDIT", "TAX_CENTER", "amhara-tc1");
        addUser("20000000-0000-0000-0010-000000000001", "dd1.chair", "dd1.chair@mor.gov.et",
                "Dr. Yonas Mengistu", "COMMITTEE_CHAIR", "JOINT_AUDIT", "TAX_CENTER", "dire_dawa-tc1");
        addUser("20000000-0000-0000-0013-000000000001", "sn1.chair", "sn1.chair@mor.gov.et",
                "Dr. Tekle Lemma", "COMMITTEE_CHAIR", "JOINT_AUDIT", "TAX_CENTER", "snnpr-tc1");
        addUser("20000000-0000-0000-0016-000000000001", "so1.chair", "so1.chair@mor.gov.et",
                "Dr. Ibrahim Hassan", "COMMITTEE_CHAIR", "JOINT_AUDIT", "TAX_CENTER", "somali-tc1");

        // ── JA Committee (Federal) ──
        addUser("u-com-fed-chair", "u-com-fed-chair", "fed.committee1@mor.gov.et",
                "Federal Joint Committee Chair", "COMMITTEE_CHAIR", "JOINT_AUDIT", "NATIONAL", "FEDERAL");
        addUser("u-com-fed-mem1", "u-com-fed-mem1", "fed.committee2@mor.gov.et",
                "Federal Joint Committee Member 1", "COMMITTEE_MEMBER", "JOINT_AUDIT", "NATIONAL", "FEDERAL");
        addUser("u-com-fed-mem2", "u-com-fed-mem2", "fed.committee3@mor.gov.et",
                "Federal Joint Committee Member 2", "COMMITTEE_MEMBER", "JOINT_AUDIT", "NATIONAL", "FEDERAL");

        // ── TP Committee (Federal) ──
        addUser("u-com-fed-tpchair", "u-com-fed-tpchair", "fed.tpcommittee1@mor.gov.et",
                "Federal TP Committee Chair", "COMMITTEE_CHAIR", "TRANSFER_PRICING", "NATIONAL", "FEDERAL");
        addUser("u-com-fed-tpmem1", "u-com-fed-tpmem1", "fed.tpcommittee2@mor.gov.et",
                "Federal TP Committee Member 1", "COMMITTEE_MEMBER", "TRANSFER_PRICING", "NATIONAL", "FEDERAL");
        addUser("u-com-fed-tpmem2", "u-com-fed-tpmem2", "fed.tpcommittee3@mor.gov.et",
                "Federal TP Committee Member 2", "COMMITTEE_MEMBER", "TRANSFER_PRICING", "NATIONAL", "FEDERAL");

        // ── Desk Audit Committee (Federal) ──
        addUser("u-com-fed-deskchair", "u-com-fed-deskchair", "fed.deskcommittee@mor.gov.et",
                "Federal Desk Audit Committee Chair", "COMMITTEE_CHAIR", "DESK_AUDIT", "NATIONAL", "FEDERAL");
        addUser("u-com-fed-deskmem1", "u-com-fed-deskmem1", "fed.deskmem1@mor.gov.et",
                "Federal Desk Audit Committee Member 1", "COMMITTEE_MEMBER", "DESK_AUDIT", "NATIONAL", "FEDERAL");

        // ── Comprehensive Audit Committee (Federal) ──
        addUser("u-com-fed-compchair", "u-com-fed-compchair", "fed.compcommittee@mor.gov.et",
                "Federal Comprehensive Audit Committee Chair", "COMMITTEE_CHAIR", "COMPREHENSIVE_AUDIT", "NATIONAL", "FEDERAL");
        addUser("u-com-fed-compmem1", "u-com-fed-compmem1", "fed.compmem1@mor.gov.et",
                "Federal Comprehensive Audit Committee Member 1", "COMMITTEE_MEMBER", "COMPREHENSIVE_AUDIT", "NATIONAL", "FEDERAL");

        // ── Issue Audit Committee (Federal) ──
        addUser("u-com-fed-issuechair", "u-com-fed-issuechair", "fed.issuecommittee@mor.gov.et",
                "Federal Issue Audit Committee Chair", "COMMITTEE_CHAIR", "ISSUE_AUDIT", "NATIONAL", "FEDERAL");
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

            // JA Committee at this TC (only if not already registered above)
            if (!"federal-lto1".equals(tcId) && !"federal-lto2".equals(tcId) && !"addis_ababa-tc1".equals(tcId)
                && !"oromia-tc1".equals(tcId) && !"amhara-tc1".equals(tcId) && !"dire_dawa-tc1".equals(tcId)
                && !"snnpr-tc1".equals(tcId) && !"somali-tc1".equals(tcId)) {
                String jaChairId = "u-com-" + tcId + "-ja";
                addUser(jaChairId, jaChairId, jaChairId + "@mor.gov.et",
                        "Joint Committee Chair (" + tcShort + ")", "COMMITTEE_CHAIR", "JOINT_AUDIT", "TAX_CENTER", tcId);
            }
            // TP Committee at this TC
            String tpChairId = "u-com-" + tcId + "-tp";
            addUser(tpChairId, tpChairId, tpChairId + "@mor.gov.et",
                    "TP Committee Chair (" + tcShort + ")", "COMMITTEE_MEMBER", "TRANSFER_PRICING", "TAX_CENTER", tcId);

            for (String[] atDef : auditTypeDefs) {
                String auditType = atDef[0];
                String atShort = atDef[1];

                if ("JOINT_AUDIT".equals(auditType)) {
                    // If this tax center already has dedicated Joint Audit TLs and auditors, do not add duplicates!
                    if ("federal-lto1".equals(tcId) || "federal-lto2".equals(tcId) || "addis_ababa-tc1".equals(tcId)) {
                        continue;
                    }
                    // For all other tax centers, strictly 2 Joint TLs and 10 Joint Auditors
                    for (int tl = 1; tl <= 2; tl++) {
                        String tlId = "u-tl-" + tcId + "-joint-" + tl;
                        String tlTitle = "Joint TL-" + tl + " (" + tcShort + ")";
                        addUser(tlId, tlId, tlId + "@mor.gov.et",
                                tlTitle, "TEAM_LEADER", "JOINT_AUDIT", "TAX_CENTER", tcId);
                    }
                    for (int a = 1; a <= 10; a++) {
                        String audId = "u-aud-" + tcId + "-joint-" + a;
                        String audTitle = "Joint Aud-" + a + " (" + tcShort + ")";
                        addUser(audId, audId, audId + "@mor.gov.et",
                                audTitle, "AUDITOR", "JOINT_AUDIT", "TAX_CENTER", tcId);
                    }
                    continue;
                }

                // 2 Team Leaders per audit type (for non-joint audit types)
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
