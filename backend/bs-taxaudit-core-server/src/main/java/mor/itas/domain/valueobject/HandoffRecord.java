package mor.itas.domain.valueobject;

import lombok.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Immutable value object for handoff record snapshot
 */
@Data
@AllArgsConstructor
@Builder
public class HandoffRecord {

    private UUID handoffRecordId;
    private UUID committeeCaseId;
    private String caseCode;
    private UUID teamLeadId;
    private List<UUID> teamMemberIds;
    private String committeeSummary;
    private String keyFindings;
    private String decision;
    private OffsetDateTime handoffDate;
    private UUID createdBy;
    private OffsetDateTime createdAt;
    private UUID executionCaseId;

    /**
     * Handoff record equality based on handoff ID
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HandoffRecord)) return false;
        HandoffRecord that = (HandoffRecord) o;
        return handoffRecordId != null && handoffRecordId.equals(that.handoffRecordId);
    }

    @Override
    public int hashCode() {
        return handoffRecordId != null ? handoffRecordId.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "HandoffRecord{" +
                "handoffRecordId=" + handoffRecordId +
                ", committeeCaseId=" + committeeCaseId +
                ", caseCode='" + caseCode + '\'' +
                ", teamLeadId=" + teamLeadId +
                ", decision='" + decision + '\'' +
                ", handoffDate=" + handoffDate +
                '}';
    }
}
