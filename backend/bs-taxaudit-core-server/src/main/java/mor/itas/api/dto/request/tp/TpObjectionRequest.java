package mor.itas.api.dto.request.tp;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class TpObjectionRequest {
    private UUID noticeId;
    private String taxpayerId;
    private String noticeProvisionReferenced;
    private String factualExplanation;
    private String legalArguments;
    private String disputedTpAnalysisSections;
}
