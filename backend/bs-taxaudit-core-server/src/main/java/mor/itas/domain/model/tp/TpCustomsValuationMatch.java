package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpCustomsValidationStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpCustomsValuationMatch {
    private String matchId;
    private String caseId;
    private String importTransactionRef;
    private String hsCode;
    private String productName;
    private String productDescription;
    private String importerId;
    private String producerId;
    private String originCountry;
    private LocalDate importDate;
    private BigDecimal quantity;
    
    private BigDecimal taxpayerImportUnitPrice;
    private BigDecimal competitorMinPrice;
    private BigDecimal competitorMaxPrice;
    private BigDecimal averagePrice;
    private BigDecimal medianPrice;
    
    private BigDecimal priceDifference;
    private BigDecimal percentageDifference;
    
    @Builder.Default
    private TpCustomsValidationStatus validationStatus = TpCustomsValidationStatus.PRELIMINARY;
    
    private boolean isPreliminary; // Requirement 26.5: clearly marked as preliminary
    private boolean overriddenByAuditor;
    private String auditorComments;
}
