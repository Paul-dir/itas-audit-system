package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpReferralReason;
import mor.itas.domain.valueobject.tp.TpReferralStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpFraudInvestigationReferral {
    private String referralId;
    private String caseId;
    private TpReferralReason reason;
    private String findingDescription;
    private String fraudIndicatorDescription;
    
    @Builder.Default
    private List<String> supportingEvidenceRefs = new ArrayList<>();
    
    private LocalDateTime referralDate;
    private String referringUserId;
    private String referredToUnitOrPerson;
    
    @Builder.Default
    private TpReferralStatus status = TpReferralStatus.PENDING;
    
    private String investigationOutcome;
}
