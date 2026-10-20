package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import mor.itas.domain.valueobject.tp.TpFallbackReason;
import mor.itas.domain.valueobject.tp.TpTrailResult;
import mor.itas.domain.valueobject.tp.TpTransactionSourceTier;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpTransactionAuditTrail {
    private String trailId;
    private String caseId;
    private TpTransactionSourceTier sourceTier;
    private TpFallbackReason fallbackReason;
    
    private String transactionSourceSystem;
    private String invoiceReference;
    private String ledgerPosting;
    private String taxpayerId;
    private String relatedPartyId;
    private LocalDate transactionDate;
    private BigDecimal transactionAmount;
    
    private TpTrailResult trailResult;
    private String discrepancyType;
    private String discrepancyDescription;
    private BigDecimal varianceAmount;
    private String investigationStatus;
    
    private boolean auditorSignOff;
    private String signedOffByUserId;
    private LocalDateTime signedOffAt;
}
