package mor.itas.domain.valueobject;

import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Immutable value object for auditor nomination
 */
@Data
@AllArgsConstructor
@Builder
public class AuditorNomination {

    private UUID nominatedAuditorId;
    private UUID nominatingMemberId;
    private String justification;
    private OffsetDateTime nominatedAt;
    private String auditorName;
    private String auditorRole;
    private String auditorExpertise;

    /**
     * Nomination equality based on auditor ID and nominating member
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AuditorNomination)) return false;
        AuditorNomination that = (AuditorNomination) o;
        return nominatedAuditorId != null && nominatedAuditorId.equals(that.nominatedAuditorId)
                && nominatingMemberId != null && nominatingMemberId.equals(that.nominatingMemberId);
    }

    @Override
    public int hashCode() {
        int result = nominatedAuditorId != null ? nominatedAuditorId.hashCode() : 0;
        result = 31 * result + (nominatingMemberId != null ? nominatingMemberId.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "AuditorNomination{" +
                "nominatedAuditorId=" + nominatedAuditorId +
                ", nominatingMemberId=" + nominatingMemberId +
                ", auditorName='" + auditorName + '\'' +
                ", nominatedAt=" + nominatedAt +
                '}';
    }
}
