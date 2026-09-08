package mor.itas.seeders;

import mor.itas.persistence.jpa.entity.ap.UserEntity;
import mor.itas.persistence.jpa.repository.ap.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Seeds users into t_user table on startup.
 * Skips if V13 migration already populated the table.
 * Only runs in "mock" profile.
 */
@Component
@Profile("mock")
@Slf4j
@RequiredArgsConstructor
public class UserDataSeeder implements CommandLineRunner {

    private final UserJpaRepository userJpaRepo;

    @Override
    public void run(String... args) throws Exception {
        long count = userJpaRepo.count();
        if (count > 0) {
            log.info("✓ t_user already has {} records (from V13 migration). Skipping seed.", count);
            return;
        }

        log.info("[UserDataSeeder] t_user is empty — seeding from code...");

        // ── Team Leaders (4) ──
        seed("10000000-0000-0000-0000-000000000001", "henok.belay",      "henok.belay@mor.gov.et",      "Henok Belay",     "TEAM_LEADER", "desk_audit",  "TAX_CENTER", "addis_ababa-tc1");
        seed("10000000-0000-0000-0000-000000000002", "tigist.alemu",     "tigist.alemu@mor.gov.et",     "Tigist Alemu",    "TEAM_LEADER", "field_audit", "TAX_CENTER", "addis_ababa-tc3");
        seed("10000000-0000-0000-0000-000000000007", "fikadu.desta",     "fikadu.desta@mor.gov.et",     "Fikadu Desta",    "TEAM_LEADER", "desk_audit",  "TAX_CENTER", "addis_ababa-tc2");
        seed("10000000-0000-0000-0000-000000000017", "lalisa.wakjira",   "lalisa.wakjira@mor.gov.et",   "Lalisa Wakjira",  "TEAM_LEADER", "desk_audit",  "TAX_CENTER", "oromia-tc1");

        // ── Auditors (matching t_auditor UUIDs) ──
        seed("a0000001-0000-0000-0000-000000000001", "abebe.kebede",      "abebe.kebede@mor.gov.et",      "Abebe Kebede",      "AUDITOR", null, "TAX_CENTER", "addis_ababa-tc1");
        seed("a0000001-0000-0000-0000-000000000002", "fatuma.ahmed",       "fatuma.ahmed@mor.gov.et",       "Fatuma Ahmed",      "AUDITOR", null, "TAX_CENTER", "addis_ababa-tc1");
        seed("a0000001-0000-0000-0000-000000000003", "dawit.tadesse",      "dawit.tadesse@mor.gov.et",      "Dawit Tadesse",     "AUDITOR", null, "TAX_CENTER", "addis_ababa-tc2");
        seed("a0000001-0000-0000-0000-000000000004", "sara.mohammed",      "sara.mohammed@mor.gov.et",      "Sara Mohammed",     "AUDITOR", null, "TAX_CENTER", "addis_ababa-tc2");
        seed("a0000001-0000-0000-0000-000000000005", "yonas.berhanu",      "yonas.berhanu@mor.gov.et",      "Yonas Berhanu",     "AUDITOR", null, "TAX_CENTER", "addis_ababa-tc3");
        seed("a0000001-0000-0000-0000-000000000006", "hana.girma",         "hana.girma@mor.gov.et",         "Hana Girma",        "AUDITOR", null, "TAX_CENTER", "addis_ababa-tc3");
        seed("a0000001-0000-0000-0000-000000000007", "mulugeta.alemayehu", "mulugeta.alemayehu@mor.gov.et", "Mulugeta Alemayehu","AUDITOR", null, "TAX_CENTER", "oromia-tc1");
        seed("a0000001-0000-0000-0000-000000000008", "tigist.haile",       "tigist.haile@mor.gov.et",       "Tigist Haile",      "AUDITOR", null, "TAX_CENTER", "oromia-tc1");

        // ── Committee Members (1 chair + 1 member per tax center) ──
        seed("20000000-0000-0000-0000-000000000001", "aa.committee1",             "aa.committee1@mor.gov.et",             "Committee Chair AA-TC1",      "COMMITTEE_CHAIR",  "joint_audit", "TAX_CENTER", "addis_ababa-tc1");
        seed("20000000-0000-0000-0000-000000000002", "aa-ara.joint_committee.2",  "aa-ara.joint_committee.2@mor.gov.et",  "Committee Member AA-TC1",     "COMMITTEE_MEMBER", "joint_audit", "TAX_CENTER", "addis_ababa-tc1");
        seed("20000000-0000-0000-0000-000000000006", "aa.committee2",             "aa.committee2@mor.gov.et",             "Committee Chair AA-TC2",      "COMMITTEE_CHAIR",  "joint_audit", "TAX_CENTER", "addis_ababa-tc2");
        seed("20000000-0000-0000-0000-000000000007", "aa-ara.joint_committee.7",  "aa-ara.joint_committee.7@mor.gov.et",  "Committee Member AA-TC2",     "COMMITTEE_MEMBER", "joint_audit", "TAX_CENTER", "addis_ababa-tc2");
        seed("20000000-0000-0000-0000-000000000008", "aa.committee3",             "aa.committee3@mor.gov.et",             "Committee Chair AA-TC3",      "COMMITTEE_CHAIR",  "joint_audit", "TAX_CENTER", "addis_ababa-tc3");
        seed("20000000-0000-0000-0000-000000000009", "aa-ara.joint_committee.9",  "aa-ara.joint_committee.9@mor.gov.et",  "Committee Member AA-TC3",     "COMMITTEE_MEMBER", "joint_audit", "TAX_CENTER", "addis_ababa-tc3");
        seed("20000000-0000-0000-0000-000000000010", "or.committee1",             "or.committee1@mor.gov.et",             "Committee Chair OR-TC1",      "COMMITTEE_CHAIR",  "joint_audit", "TAX_CENTER", "oromia-tc1");
        seed("20000000-0000-0000-0000-000000000011", "or-ara.joint_committee.11", "or-ara.joint_committee.11@mor.gov.et", "Committee Member OR-TC1",     "COMMITTEE_MEMBER", "joint_audit", "TAX_CENTER", "oromia-tc1");

        log.info("[UserDataSeeder] ✓ Seeded {} users into t_user", userJpaRepo.count());
    }

    private void seed(String id, String username, String email, String fullName,
                      String userType, String auditType, String level, String location) {
        UserEntity entity = UserEntity.builder()
                .userId(java.util.UUID.fromString(id))
                .username(username)
                .email(email)
                .fullName(fullName)
                .userType(userType)
                .auditType(auditType)
                .assignedLevel(level)
                .assignedLocation(location)
                .status("ACTIVE")
                .build();
        userJpaRepo.save(entity);
    }
}
