package mor.itas.domain.event.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpNoticeIssuedEvent {
    private String caseId;
    private String noticeId;
    private String noticeReferenceNumber;
    private BigDecimal totalAssessmentAmount;
    private String taxpayerId;
    private LocalDateTime issuedAt;
}
