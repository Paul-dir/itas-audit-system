package mor.itas.engineadapter.usermanagement;

import mor.itas.application.port.outboundport.usermanagement.UserManagementPort;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("mock")
public class MockUserManagementAdapter implements UserManagementPort {

    @Override
    public String getUserRole(String userId) {
        if (userId != null && userId.startsWith("TC-")) {
            return "ROLE_TC_MANAGER";
        }
        return "ROLE_AUDITOR"; // Mock default role
    }

    @Override
    public String getUserTaxCenter(String userId) {
        if (userId != null && userId.startsWith("TC-")) {
            // For mocking, assume userId is "TC-01-MANAGER", return "TC-01"
            String[] parts = userId.split("-");
            if (parts.length >= 2) {
                return parts[0] + "-" + parts[1];
            }
        }
        return "TC-01"; // Default fallback tax center
    }
}
