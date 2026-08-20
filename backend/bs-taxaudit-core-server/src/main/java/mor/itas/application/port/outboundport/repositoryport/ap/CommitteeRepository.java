package mor.itas.application.port.outboundport.repositoryport.ap;

import mor.itas.domain.model.ap.Committee;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository port for Committee aggregate (AP Cluster)
 */
public interface CommitteeRepository {
    Committee save(Committee committee);
    Optional<Committee> findById(UUID committeeId);
    Optional<Committee> findByName(String committeeName);
    List<Committee> findByType(String committeeType);
    List<Committee> findByLevel(String level);
    List<Committee> findByLevelAndType(String level, String committeeType);
    List<Committee> findByLocation(String location);
    List<Committee> findByChair(UUID chairId);
    List<Committee> findByMember(UUID memberId);
    List<Committee> findByStatus(String status);
    List<Committee> findAll();
    Committee update(Committee committee);
    void delete(UUID committeeId);
    long countByType(String committeeType);
    boolean exists(UUID committeeId);
    Optional<Committee> getNationalJACommittee();
    Optional<Committee> getNationalTPCommittee();
}
