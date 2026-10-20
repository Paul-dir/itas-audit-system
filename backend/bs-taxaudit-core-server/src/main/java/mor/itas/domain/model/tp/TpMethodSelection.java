package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpMethod;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpMethodSelection {
    private String selectionId;
    private String caseId;
    private TpMethod tpMethod;
    private String appliedTransaction;
    private String selectionRationale;
    private String applicabilityAnalysis;
    private String supportingEvidence;
    private String regulatoryReferenceBasis;
    private String selectingAuditorId;
    private LocalDateTime selectedAt;
}
