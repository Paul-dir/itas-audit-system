package mor.itas.config;

import lombok.RequiredArgsConstructor;
import mor.itas.engineadapter.usermanagement.MockUserManagementAdapter;
import mor.itas.application.port.outboundport.repositoryport.ap.UserRepository;
import mor.itas.domain.model.ap.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@Profile("mock")
@RequiredArgsConstructor
public class MockDataSeeder implements CommandLineRunner {

    private final MockUserManagementAdapter mockUserManagementAdapter;
    private final UserRepository userRepository; // The AP Domain repository (MockUserRepository)

    @Override
    public void run(String... args) throws Exception {
        System.out.println("[MockDataSeeder] Starting to seed Mock Users into AP UserRepository...");
        List<Map<String, Object>> mockUsers = mockUserManagementAdapter.getAllUsers();
        
        int count = 0;
        for (Map<String, Object> mockUser : mockUsers) {
            String username = (String) mockUser.get("username");
            
            if (userRepository.findByUsername(username).isEmpty()) {
                
                String userType = (String) mockUser.get("userType"); // TEAM_LEADER, AUDITOR, etc.
                String auditType = (String) mockUser.get("auditType");
                String assignedLevel = (String) mockUser.get("assignedLevel");
                String assignedLocation = (String) mockUser.get("assignedLocation");
                String email = (String) mockUser.get("email");
                String fullName = (String) mockUser.get("fullName");
                String rawUserId = (String) mockUser.get("userId");

                java.util.UUID userId = null;
                if (rawUserId != null) {
                    try {
                        userId = java.util.UUID.fromString(rawUserId);
                    } catch (IllegalArgumentException ignored) {}
                }
                if (userId == null) {
                    userId = java.util.UUID.nameUUIDFromBytes(("itas-user:" + username).getBytes(java.nio.charset.StandardCharsets.UTF_8));
                }

                User domainUser = new User(userId, username, email, fullName, userType, auditType,
                                           assignedLevel, assignedLocation, "ACTIVE",
                                           java.time.OffsetDateTime.now(), java.time.OffsetDateTime.now(), "system-seeder");
                
                userRepository.save(domainUser);
                count++;
            }
        }
        
        System.out.println("[MockDataSeeder] Successfully seeded " + count + " users into AP MockUserRepository!");
    }
}
