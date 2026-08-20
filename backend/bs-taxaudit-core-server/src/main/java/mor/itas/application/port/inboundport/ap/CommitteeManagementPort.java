package mor.itas.application.port.inboundport.ap;

import mor.itas.domain.model.ap.Committee;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface CommitteeManagementPort {
    Committee createCommittee(String committeeName, String committeeType, String level,
                            String location, UUID chairId, String actorId);
    Committee getCommitteeById(UUID committeeId);
    List<Committee> getAllCommittees();
    Committee addMember(UUID committeeId, UUID memberId, String actorId);
    Committee removeMember(UUID committeeId, UUID memberId, String actorId);
    Committee changeChair(UUID committeeId, UUID newChairId, String actorId);
    Committee updateCapacity(UUID committeeId, Integer newCapacity, String actorId);
    Committee deactivateCommittee(UUID committeeId, String actorId);
    Committee getNationalJACommittee();
    Committee getNationalTPCommittee();
    Map<String, Object> getWorkloadInfo(UUID committeeId);
    Map<String, Object> getCommitteeStatistics();
}
