package mor.itas.persistence.repository.ap;

import mor.itas.application.port.outboundport.repositoryport.ap.UserRepository;
import mor.itas.domain.model.ap.User;
import mor.itas.persistence.jpa.entity.ap.UserEntity;
import mor.itas.persistence.jpa.repository.ap.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;

/**
 * JPA-backed implementation of UserRepository (AP Cluster).
 * Reads/writes to t_user table via UserJpaRepository.
 * Replaces the previous in-memory ConcurrentHashMap implementation.
 */
@Repository
@RequiredArgsConstructor
public class MockUserRepository implements UserRepository {

    private final UserJpaRepository jpaRepo;

    @Override
    public User save(User user) {
        if (user == null) throw new IllegalArgumentException("User cannot be null");
        UserEntity entity = UserEntity.fromDomain(user);
        UserEntity saved = jpaRepo.save(entity);
        return saved.toDomain();
    }

    @Override
    public Optional<User> findById(UUID userId) {
        return jpaRepo.findById(userId).map(UserEntity::toDomain);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return jpaRepo.findByUsername(username).map(UserEntity::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepo.findByEmail(email).map(UserEntity::toDomain);
    }

    @Override
    public List<User> findByUserType(String userType) {
        return jpaRepo.findByUserType(userType).stream()
                .map(UserEntity::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findByAssignedLevel(String assignedLevel) {
        return jpaRepo.findAll().stream()
                .filter(u -> assignedLevel.equals(u.getAssignedLevel()))
                .map(UserEntity::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findByAssignedLocation(String assignedLocation) {
        return jpaRepo.findByAssignedLocation(assignedLocation).stream()
                .map(UserEntity::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findByAuditType(String auditType) {
        return jpaRepo.findAll().stream()
                .filter(u -> auditType.equals(u.getAuditType()))
                .map(UserEntity::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findByUserTypeAndAssignedLocation(String userType, String assignedLocation) {
        return jpaRepo.findAll().stream()
                .filter(u -> u.getUserType().equals(userType))
                .filter(u -> assignedLocation == null || assignedLocation.equals(u.getAssignedLocation()))
                .map(UserEntity::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findByUserTypeAndAuditType(String userType, String auditType) {
        return jpaRepo.findByUserTypeAndAuditType(userType, auditType).stream()
                .map(UserEntity::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findByUserTypeAuditTypeAndLocation(String userType, String auditType, String assignedLocation) {
        return jpaRepo.findAll().stream()
                .filter(u -> u.getUserType().equals(userType))
                .filter(u -> auditType == null || auditType.equals(u.getAuditType()))
                .filter(u -> assignedLocation == null || assignedLocation.equals(u.getAssignedLocation()))
                .map(UserEntity::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findNationalLevelUsers() {
        return findByAssignedLevel("NATIONAL");
    }

    @Override
    public List<User> findRegionalUsers(String regionCode) {
        return jpaRepo.findAll().stream()
                .filter(u -> "REGIONAL".equals(u.getAssignedLevel()) && regionCode.equals(u.getAssignedLocation()))
                .map(UserEntity::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findTaxCenterUsers(String taxCenterCode) {
        return jpaRepo.findAll().stream()
                .filter(u -> "TAX_CENTER".equals(u.getAssignedLevel()) && taxCenterCode.equals(u.getAssignedLocation()))
                .map(UserEntity::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findByStatus(String status) {
        return jpaRepo.findByStatus(status).stream()
                .map(UserEntity::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> findAll() {
        return jpaRepo.findAll().stream()
                .map(UserEntity::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID userId) {
        jpaRepo.deleteById(userId);
    }

    @Override
    public User update(User user) {
        if (!jpaRepo.existsById(user.getUserId())) {
            throw new IllegalArgumentException("User not found: " + user.getUserId());
        }
        return save(user);
    }

    @Override
    public long countByUserType(String userType) {
        return jpaRepo.findByUserType(userType).size();
    }

    @Override
    public long countByAssignedLevel(String assignedLevel) {
        return findAll().stream()
                .filter(u -> assignedLevel.equals(u.getAssignedLevel()))
                .count();
    }
}
