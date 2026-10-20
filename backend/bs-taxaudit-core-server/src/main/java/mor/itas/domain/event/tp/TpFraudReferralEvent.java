package mor.itas.domain.event.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpReferralReason;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpFraudReferralEvent {
    private String referralId;
    private String caseId;
    private TpReferralReason reason;
    private String referringUserId;
    private LocalDateTime timestamp;
}
