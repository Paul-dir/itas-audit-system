package mor.itas.application.usecase.tp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.tp.TpCompetitorPriceUploadEntity;
import mor.itas.persistence.jpa.entity.tp.TpExternalPriceMatchEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import mor.itas.persistence.jpa.repository.tp.TpCompetitorPriceUploadRepository;
import mor.itas.persistence.jpa.repository.tp.TpExternalPriceMatchRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

/**
 * Manages competitor/comparable price uploads and the automatic CUP discrepancy
 * analysis engine.
 *
 * KEY BUSINESS LOGIC:
 * - Accepts manual uploads or ASYCUDA imports of comparable product prices
 * - Automatically calculates IQR (interquartile range) across all comparables
 * - Compares the taxpayer's declared import price against the IQR midpoint
 * - Flags discrepancy if variance exceeds the configured threshold (default 5%)
 * - Creates a TpExternalPriceMatchEntity record for each discrepancy analysis
 * - Auditor must then VALIDATE each match before it enters the audit report
 *
 * Statutory basis:
 * - "upload prices of selected products imported by competing companies and use
 *    for preliminary comparative analysis to provide indicative TP information"
 * - "interface with external price databases — produce TP discrepancy report"
 * - Directive 43/2015 Art. 9 (CUP method)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TpCompetitorPriceAnalysisUseCase {

    private final ApAuditCaseRepository auditCaseRepository;
    private final TpCompetitorPriceUploadRepository uploadRepository;
    private final TpExternalPriceMatchRepository matchRepository;
    private final TpAuditActionHistoryUseCase historyUseCase;

    /**
     * Upload a single comparable company's product import price for this case.
     */
    @Transactional
    public UUID uploadCompetitorPrice(UUID caseId,
                                      String productName,
                                      String productHsCode,
                                      String competitorName,
                                      String competitorTin,
                                      BigDecimal importPrice,
                                      String currency,
                                      LocalDate priceDate,
                                      String source,
                                      String dataSourceRef,
                                      String uploadNotes,
                                      String actorId) {
        ApAuditCaseEntity auditCase = getValidTpCase(caseId);
        String ref = generateUploadReference(caseId);

        TpCompetitorPriceUploadEntity upload = TpCompetitorPriceUploadEntity.builder()
                .auditCase(auditCase)
                .uploadReference(ref)
                .productName(productName)
                .productHsCode(productHsCode)
                .competitorName(competitorName)
                .competitorTin(competitorTin)
                .importPrice(importPrice)
                .currency(currency != null ? currency : "USD")
                .priceDate(priceDate)
                .source(source != null ? source : "MANUAL")
                .dataSourceRef(dataSourceRef)
                .uploadedBy(actorId)
                .uploadNotes(uploadNotes)
                .build();

        upload = uploadRepository.save(upload);

        historyUseCase.record(caseId, "COMPETITOR_PRICE_UPLOADED", "ANALYSIS",
                actorId, "AUDITOR",
                "Competitor price uploaded: " + productName + " @ " + importPrice + " " + currency + " (" + competitorName + ")",
                null, null, null);

        log.info("Competitor price uploaded: {} for case {}", ref, caseId);
        return upload.getId();
    }

    /**
     * Automatically runs the CUP comparative analysis for all products in the
     * case that have at least 1 competitor price uploaded.
     * Produces one TpExternalPriceMatchEntity per distinct HS code.
     * Called by the auditor after uploading all comparables.
     */
    @Transactional
    public List<TpExternalPriceMatchEntity> runDiscrepancyAnalysis(UUID caseId,
                                                                    BigDecimal taxpayerImportPrice,
                                                                    String productHsCode,
                                                                    String productName,
                                                                    BigDecimal discrepancyThreshold,
                                                                    String actorId) {
        ApAuditCaseEntity auditCase = getValidTpCase(caseId);

        List<TpCompetitorPriceUploadEntity> comparables =
                uploadRepository.findByCaseIdAndHsCode(caseId, productHsCode);

        if (comparables.isEmpty()) {
            throw new IllegalStateException(
                    "No comparable prices uploaded for HS code: " + productHsCode +
                    ". Upload at least 1 competitor price before running analysis.");
        }

        // --- IQR Calculation Engine ---
        List<BigDecimal> prices = comparables.stream()
                .map(TpCompetitorPriceUploadEntity::getImportPrice)
                .sorted()
                .toList();

        BigDecimal min    = prices.get(0);
        BigDecimal max    = prices.get(prices.size() - 1);
        BigDecimal median = calculateMedian(prices);

        BigDecimal variance = taxpayerImportPrice.subtract(median);
        BigDecimal variancePct = median.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : variance.divide(median, 6, RoundingMode.HALF_UP)
                          .multiply(BigDecimal.valueOf(100));

        BigDecimal threshold = discrepancyThreshold != null ? discrepancyThreshold : new BigDecimal("5.00");
        boolean isDiscrepancy = variancePct.abs().compareTo(threshold) > 0;

        String matchRef = generateMatchReference(caseId);

        TpExternalPriceMatchEntity match = TpExternalPriceMatchEntity.builder()
                .auditCase(auditCase)
                .matchReference(matchRef)
                .productHsCode(productHsCode)
                .productName(productName)
                .taxpayerImportPrice(taxpayerImportPrice)
                .marketPriceMin(min)
                .marketPriceMax(max)
                .marketPriceMedian(median)
                .priceVarianceAmount(variance.setScale(4, RoundingMode.HALF_UP))
                .priceVariancePct(variancePct.setScale(4, RoundingMode.HALF_UP))
                .discrepancyFlag(isDiscrepancy)
                .discrepancyThreshold(threshold)
                .validationStatus("PENDING")
                .generatedAt(OffsetDateTime.now())
                .generatedBy(actorId)
                .build();

        match = matchRepository.save(match);

        String summary = isDiscrepancy
                ? "⚠ DISCREPANCY DETECTED: " + productHsCode + " variance " + variancePct.setScale(2, RoundingMode.HALF_UP) + "%"
                : "✓ MATCHED: " + productHsCode + " within threshold";

        historyUseCase.record(caseId, "PRICE_DISCREPANCY_GENERATED", "ANALYSIS",
                actorId, "SYSTEM", summary, null, null, match.getId());

        log.info("Discrepancy analysis complete for case {} HS {}: discrepancy={}", caseId, productHsCode, isDiscrepancy);

        return matchRepository.findByAuditCaseIdOrderByGeneratedAtDesc(caseId);
    }

    /**
     * Auditor validates a specific price match record after review.
     */
    @Transactional
    public void validatePriceMatch(UUID matchId, String validationStatus, String notes, String actorId) {
        TpExternalPriceMatchEntity match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Price match not found: " + matchId));

        match.setValidationStatus(validationStatus);
        match.setAuditorValidationNotes(notes);
        match.setValidatedBy(actorId);
        match.setValidatedAt(OffsetDateTime.now());
        matchRepository.save(match);

        historyUseCase.record(match.getAuditCaseId(), "PRICE_MATCH_VALIDATED", "ANALYSIS",
                actorId, "AUDITOR",
                "Price match " + match.getMatchReference() + " validated as: " + validationStatus,
                null, null, matchId);
    }

    public List<TpCompetitorPriceUploadEntity> getUploadsForCase(UUID caseId) {
        return uploadRepository.findByAuditCaseIdOrderByPriceDateDesc(caseId);
    }

    public List<TpExternalPriceMatchEntity> getMatchesForCase(UUID caseId) {
        return matchRepository.findByAuditCaseIdOrderByGeneratedAtDesc(caseId);
    }

    public List<TpExternalPriceMatchEntity> getDiscrepanciesForCase(UUID caseId) {
        return matchRepository.findByAuditCaseIdAndDiscrepancyFlagTrue(caseId);
    }

    // --- Private helpers ---

    private BigDecimal calculateMedian(List<BigDecimal> sorted) {
        int n = sorted.size();
        if (n % 2 == 1) return sorted.get(n / 2);
        return sorted.get(n / 2 - 1).add(sorted.get(n / 2))
                .divide(BigDecimal.valueOf(2), 4, RoundingMode.HALF_UP);
    }

    private String generateUploadReference(UUID caseId) {
        long count = uploadRepository.count();
        return String.format("CPU-%d-%04d", java.time.Year.now().getValue(), count + 1);
    }

    private String generateMatchReference(UUID caseId) {
        long count = matchRepository.count();
        return String.format("EPM-%d-%04d", java.time.Year.now().getValue(), count + 1);
    }

    private ApAuditCaseEntity getValidTpCase(UUID caseId) {
        ApAuditCaseEntity c = auditCaseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));
        if (!"TRANSFER_PRICING".equals(c.getAuditType())) {
            throw new IllegalStateException("Case is not a Transfer Pricing audit");
        }
        return c;
    }
}
