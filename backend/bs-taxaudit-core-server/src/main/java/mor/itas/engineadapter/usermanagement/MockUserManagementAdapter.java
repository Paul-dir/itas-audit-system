package mor.itas.engineadapter.usermanagement;

import mor.itas.application.port.outboundport.usermanagement.UserManagementPort;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("mock")
public class MockUserManagementAdapter implements UserManagementPort {

    @Override
    public String getUserRole(String userId) {
        return "ROLE_AUDITOR"; // Mock default role
    }
}
