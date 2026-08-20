package mor.itas.application.port.inboundport.ap;

import mor.itas.domain.model.ap.User;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface UserManagementPort {
    User createUser(String username, String email, String fullName, String userType, 
                    String auditType, String assignedLevel, String assignedLocation, String actorId);
    User getUserById(UUID userId);
    List<User> getAllUsers();
    List<User> getTeamLeaders(String auditType, String taxCenterCode);
    List<User> getAuditors(String auditType, String taxCenterCode);
    User updateUser(UUID userId, String email, String fullName, String actorId);
    User assignAuditType(UUID userId, String auditType, String actorId);
    User deactivateUser(UUID userId, String actorId);
    User activateUser(UUID userId, String actorId);
    Map<String, Object> getUserStatistics();
}
