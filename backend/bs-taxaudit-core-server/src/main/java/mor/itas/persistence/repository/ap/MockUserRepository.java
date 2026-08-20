package mor.itas.persistence.repository.ap;

import mor.itas.application.port.outboundport.repositoryport.ap.UserRepository;
import mor.itas.domain.model.ap.User;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Mock implementation of UserRepository (AP Cluster)
 */
@Repository
public class MockUserRepository implements UserRepository {
    private final Map<UUID, User> userStore = new ConcurrentHashMap<>();
    private final Map<String, UUID> usernameIndex = new ConcurrentHashMap<>();
    private final Map<String, UUID> emailIndex = new ConcurrentHashMap<>();

    @Override
    public User save(User user) {
        if (user == null) throw new IllegalArgumentException("User cannot be null");
        userStore.put(user.getUserId(), user);
        usernameIndex.put(user.getUsername(), user.getUserId());
        emailIndex.put(user.getEmail(), user.getUserId());
        return user;
    }

    @Override
    public Optional<User> findById(UUID userId) {
        return Optional.ofNullable(userStore.get(userId));
    }

    @Override
    public Optional<User> findByUsername(String username) {
        UUID userId = usernameIndex.get(username);
        return userId != null ? Optional.ofNullable(userStore.get(userId)) : Optional.empty();
    }

    @Override
    public Optional<User> findByEmail(String email) {
        UUID userId = emailIndex.get(email);
        return userId != null ? Optional.ofNullable(userStore.get(userId)) : Optional.empty();
    }

    @Override
    public List<User> findByUserType(String userType) {
        return userStore.values().stream()
            .filter(u -> u.getUserType().equals(userType))
            .collect(Collectors.toList());
    }

    @Override
    public List<User> findByAssignedLevel(String assignedLevel) {
        return userStore.values().stream()
            .filter(u -> u.getAssignedLevel().equals(assignedLevel))
            .collect(Collectors.toList());
    }

    @Override
    public List<User> findByAssignedLocation(String assignedLocation) {
        return userStore.values().stream()
            .filter(u -> u.getAssignedLocation() != null && u.getAssignedLocation().equals(assignedLocation))
            .collect(Collectors.toList());
    }

    @Override
    public List<User> findByAuditType(String auditType) {
        return userStore.values().stream()
            .filter(u -> u.getAuditType() != null && u.getAuditType().equals(auditType))
            .collect(Collectors.toList());
    }

    @Override
    public List<User> findByUserTypeAndAssignedLocation(String userType, String assignedLocation) {
        return userStore.values().stream()
            .filter(u -> u.getUserType().equals(userType) && 
                   (assignedLocation == null || u.getAssignedLocation().equals(assignedLocation)))
            .collect(Collectors.toList());
    }

    @Override
    public List<User> findByUserTypeAndAuditType(String userType, String auditType) {
        return userStore.values().stream()
            .filter(u -> u.getUserType().equals(userType) && 
                   u.getAuditType() != null && u.getAuditType().equals(auditType))
            .collect(Collectors.toList());
    }

    @Override
    public List<User> findByUserTypeAuditTypeAndLocation(String userType, String auditType, String assignedLocation) {
        return userStore.values().stream()
            .filter(u -> u.getUserType().equals(userType) &&
                   u.getAuditType() != null && u.getAuditType().equals(auditType) &&
                   u.getAssignedLocation().equals(assignedLocation))
            .collect(Collectors.toList());
    }

    @Override
    public List<User> findNationalLevelUsers() {
        return findByAssignedLevel("NATIONAL");
    }

    @Override
    public List<User> findRegionalUsers(String regionCode) {
        return userStore.values().stream()
            .filter(u -> u.getAssignedLevel().equals("REGIONAL") && 
                   u.getAssignedLocation().equals(regionCode))
            .collect(Collectors.toList());
    }

    @Override
    public List<User> findTaxCenterUsers(String taxCenterCode) {
        return userStore.values().stream()
            .filter(u -> u.getAssignedLevel().equals("TAX_CENTER") && 
                   u.getAssignedLocation().equals(taxCenterCode))
            .collect(Collectors.toList());
    }

    @Override
    public List<User> findByStatus(String status) {
        return userStore.values().stream()
            .filter(u -> u.getStatus().equals(status))
            .collect(Collectors.toList());
    }

    @Override
    public List<User> findAll() {
        return new ArrayList<>(userStore.values());
    }

    @Override
    public void delete(UUID userId) {
        User user = userStore.remove(userId);
        if (user != null) {
            usernameIndex.remove(user.getUsername());
            emailIndex.remove(user.getEmail());
        }
    }

    @Override
    public User update(User user) {
        if (!userStore.containsKey(user.getUserId())) {
            throw new IllegalArgumentException("User not found with id: " + user.getUserId());
        }
        return save(user);
    }

    @Override
    public long countByUserType(String userType) {
        return userStore.values().stream()
            .filter(u -> u.getUserType().equals(userType))
            .count();
    }

    @Override
    public long countByAssignedLevel(String assignedLevel) {
        return userStore.values().stream()
            .filter(u -> u.getAssignedLevel().equals(assignedLevel))
            .count();
    }
}
