package mor.itas.domain.service.tp;

import mor.itas.domain.model.tp.TpCustomsValuationMatch;

import mor.itas.domain.valueobject.tp.TpCustomsValidationStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class TpCustomsValuationMatchingService {

    /**
     * Performs customs valuation matching logic between taxpayer import price and comparable market dataset.
     */
    public TpCustomsValuationMatch performMatching(
            String caseId,
            String importTransactionRef,
            String hsCode,
            String productName,
            String productDescription,
            String importerId,
            String producerId,
            String originCountry,
            BigDecimal taxpayerImportUnitPrice,
            List<BigDecimal> competitorPrices
    ) {
        if (competitorPrices == null || competitorPrices.isEmpty()) {
            return TpCustomsValuationMatch.builder()
                    .matchId(UUID.randomUUID().toString())
                    .caseId(caseId)
                    .importTransactionRef(importTransactionRef)
                    .hsCode(hsCode)
                    .productName(productName)
                    .productDescription(productDescription)
                    .importerId(importerId)
                    .producerId(producerId)
                    .originCountry(originCountry)
                    .taxpayerImportUnitPrice(taxpayerImportUnitPrice)
                    .validationStatus(TpCustomsValidationStatus.REQUIRES_FURTHER_ANALYSIS)
                    .isPreliminary(true)
                    .auditorComments("No competitor data available for matching")
                    .build();
        }

        Collections.sort(competitorPrices);
        BigDecimal minPrice = competitorPrices.get(0);
        BigDecimal maxPrice = competitorPrices.get(competitorPrices.size() - 1);

        BigDecimal sum = competitorPrices.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal averagePrice = sum.divide(BigDecimal.valueOf(competitorPrices.size()), 4, RoundingMode.HALF_UP);

        BigDecimal medianPrice;
        int size = competitorPrices.size();
        if (size % 2 == 0) {
            medianPrice = competitorPrices.get(size / 2 - 1).add(competitorPrices.get(size / 2))
                    .divide(BigDecimal.valueOf(2), 4, RoundingMode.HALF_UP);
        } else {
            medianPrice = competitorPrices.get(size / 2);
        }

        BigDecimal priceDifference = taxpayerImportUnitPrice.subtract(medianPrice);
        BigDecimal percentageDifference = BigDecimal.ZERO;
        if (medianPrice.compareTo(BigDecimal.ZERO) != 0) {
            percentageDifference = priceDifference.divide(medianPrice, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
        }

        TpCustomsValidationStatus status = TpCustomsValidationStatus.PRELIMINARY;
        if (percentageDifference.abs().compareTo(BigDecimal.valueOf(15)) > 0) {
            status = TpCustomsValidationStatus.REQUIRES_FURTHER_ANALYSIS;
        }

        return TpCustomsValuationMatch.builder()
                .matchId(UUID.randomUUID().toString())
                .caseId(caseId)
                .importTransactionRef(importTransactionRef)
                .hsCode(hsCode)
                .productName(productName)
                .productDescription(productDescription)
                .importerId(importerId)
                .producerId(producerId)
                .originCountry(originCountry)
                .taxpayerImportUnitPrice(taxpayerImportUnitPrice)
                .competitorMinPrice(minPrice)
                .competitorMaxPrice(maxPrice)
                .averagePrice(averagePrice)
                .medianPrice(medianPrice)
                .priceDifference(priceDifference)
                .percentageDifference(percentageDifference)
                .validationStatus(status)
                .isPreliminary(true) // Requirement 26.5: Preliminary nature
                .build();
    }
}
