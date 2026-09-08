package mor.itas.domain.event.ap;

import lombok.*;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CaseTransferredToExecution extends DomainEvent {
    private UUID executionCaseId;
    private String caseCode;
    private UUID teamLeadId;

    public CaseTransferredToExecution(UUID aggregateId, UUID executionCaseId, String caseCode, UUID teamLeadId) {
        super(aggregateId);
        this.executionCaseId = executionCaseId;
        this.caseCode = caseCode;
        this.teamLeadId = teamLeadId;
    }
}
