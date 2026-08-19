package mor.itas.application.port.outboundport.repositoryport.ap;

import mor.itas.domain.model.ap.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository port for User aggregate (AP Cluster)
 */
public interface UserRepository {
    User save(User user);
    Optional<User> findById(UUID userId);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByUserType(String userType);
    List<User> findByAssignedLevel(String assignedLevel);
    List<User> findByAssignedLocation(String assignedLocation);
    List<User> findByAuditType(String auditType);
    List<User> findByUserTypeAndAssignedLocation(String userType, String assignedLocation);
    List<User> findByUserTypeAndAuditType(String userType, String auditType);
    List<User> findByUserTypeAuditTypeAndLocation(String userType, String auditType, String assignedLocation);
    List<User> findNationalLevelUsers();
    List<User> findRegionalUsers(String regionCode);
    List<User> findTaxCenterUsers(String taxCenterCode);
    List<User> findByStatus(String status);
    List<User> findAll();
    void delete(UUID userId);
    User update(User user);
    long countByUserType(String userType);
    long countByAssignedLevel(String assignedLevel);
}
