package mor.itas.persistence.repository.ap;

import mor.itas.application.port.outboundport.repositoryport.ap.CommitteeRepository;
import mor.itas.domain.model.ap.Committee;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Mock implementation of CommitteeRepository (AP Cluster)
 */
@Repository
public class MockCommitteeRepository implements CommitteeRepository {
    private final Map<UUID, Committee> committeeStore = new ConcurrentHashMap<>();
    private final Map<String, UUID> nameIndex = new ConcurrentHashMap<>();

    @Override
    public Committee save(Committee committee) {
        if (committee == null) throw new IllegalArgumentException("Committee cannot be null");
        committeeStore.put(committee.getCommitteeId(), committee);
        nameIndex.put(committee.getCommitteeName(), committee.getCommitteeId());
        return committee;
    }

    @Override
    public Optional<Committee> findById(UUID committeeId) {
        return Optional.ofNullable(committeeStore.get(committeeId));
    }

    @Override
    public Optional<Committee> findByName(String committeeName) {
        UUID committeeId = nameIndex.get(committeeName);
        return committeeId != null ? Optional.ofNullable(committeeStore.get(committeeId)) : Optional.empty();
    }

    @Override
    public List<Committee> findByType(String committeeType) {
        return committeeStore.values().stream()
            .filter(c -> c.getCommitteeType().equals(committeeType))
            .collect(Collectors.toList());
    }

    @Override
    public List<Committee> findByLevel(String level) {
        return committeeStore.values().stream()
            .filter(c -> c.getLevel().equals(level))
            .collect(Collectors.toList());
    }

    @Override
    public List<Committee> findByLevelAndType(String level, String committeeType) {
        return committeeStore.values().stream()
            .filter(c -> c.getLevel().equals(level) && c.getCommitteeType().equals(committeeType))
            .collect(Collectors.toList());
    }

    @Override
    public List<Committee> findByLocation(String location) {
        return committeeStore.values().stream()
            .filter(c -> location == null || c.getLocation().equals(location))
            .collect(Collectors.toList());
    }

    @Override
    public List<Committee> findByChair(UUID chairId) {
        return committeeStore.values().stream()
            .filter(c -> c.getChairId().equals(chairId))
            .collect(Collectors.toList());
    }

    @Override
    public List<Committee> findByMember(UUID memberId) {
        return committeeStore.values().stream()
            .filter(c -> c.isMember(memberId))
            .collect(Collectors.toList());
    }

    @Override
    public List<Committee> findByStatus(String status) {
        return committeeStore.values().stream()
            .filter(c -> c.getStatus().equals(status))
            .collect(Collectors.toList());
    }

    @Override
    public List<Committee> findAll() {
        return new ArrayList<>(committeeStore.values());
    }

    @Override
    public Committee update(Committee committee) {
        if (!committeeStore.containsKey(committee.getCommitteeId())) {
            throw new IllegalArgumentException("Committee not found with id: " + committee.getCommitteeId());
        }
        return save(committee);
    }

    @Override
    public void delete(UUID committeeId) {
        Committee committee = committeeStore.remove(committeeId);
        if (committee != null) {
            nameIndex.remove(committee.getCommitteeName());
        }
    }

    @Override
    public long countByType(String committeeType) {
        return committeeStore.values().stream()
            .filter(c -> c.getCommitteeType().equals(committeeType))
            .count();
    }

    @Override
    public boolean exists(UUID committeeId) {
        return committeeStore.containsKey(committeeId);
    }

    @Override
    public Optional<Committee> getNationalJACommittee() {
        return committeeStore.values().stream()
            .filter(c -> "NATIONAL".equals(c.getLevel()) && "JA".equals(c.getCommitteeType()))
            .findFirst();
    }

    @Override
    public Optional<Committee> getNationalTPCommittee() {
        return committeeStore.values().stream()
            .filter(c -> "NATIONAL".equals(c.getLevel()) && "TP".equals(c.getCommitteeType()))
            .findFirst();
    }
}
