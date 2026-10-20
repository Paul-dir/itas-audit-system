package mor.itas.api.controller.backoffice.tp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.application.usecase.tp.TpAuditActionHistoryUseCase;
import mor.itas.application.usecase.tp.TpCompetitorPriceAnalysisUseCase;
import mor.itas.application.usecase.tp.TpInformationRequestUseCase;
import mor.itas.persistence.jpa.entity.tp.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * REST controller for the newly added TP audit sub-processes:
 * - Competitor price uploads (CUP analysis)
 * - External price match / discrepancy reports
 * - Information & Document Requests (IDR) with approval workflow
 * - Full audit action history (immutable trail)
 *
 * Base: /api/v1/backoffice/tp/cases/{caseId}
 */
@RestController
@RequestMapping("/api/v1/backoffice/tp/cases/{caseId}")
@RequiredArgsConstructor
@Slf4j
public class TpEnhancedExecutionController {

    private final TpCompetitorPriceAnalysisUseCase priceAnalysisUseCase;
    private final TpInformationRequestUseCase idrUseCase;
    private final TpAuditActionHistoryUseCase historyUseCase;

    // ── Competitor Price Uploads (CUP Analysis) ──────────────────────────────

    @PostMapping("/analysis/competitor-prices")
    public ResponseEntity<UUID> uploadCompetitorPrice(
            @PathVariable UUID caseId,
            @RequestParam String productName,
            @RequestParam(required = false) String productHsCode,
            @RequestParam String competitorName,
            @RequestParam(required = false) String competitorTin,
            @RequestParam BigDecimal importPrice,
            @RequestParam(defaultValue = "USD") String currency,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate priceDate,
            @RequestParam(defaultValue = "MANUAL") String source,
            @RequestParam(required = false) String dataSourceRef,
            @RequestParam(required = false) String uploadNotes,
            @RequestHeader("X-Actor-Id") String actorId) {
        UUID id = priceAnalysisUseCase.uploadCompetitorPrice(
                caseId, productName, productHsCode, competitorName, competitorTin,
                importPrice, currency, priceDate, source, dataSourceRef, uploadNotes, actorId);
        return ResponseEntity.ok(id);
    }

    @GetMapping("/analysis/competitor-prices")
    public ResponseEntity<List<TpCompetitorPriceUploadEntity>> getCompetitorPrices(@PathVariable UUID caseId) {
        return ResponseEntity.ok(priceAnalysisUseCase.getUploadsForCase(caseId));
    }

    @PostMapping("/analysis/competitor-prices/run-discrepancy")
    public ResponseEntity<List<TpExternalPriceMatchEntity>> runDiscrepancyAnalysis(
            @PathVariable UUID caseId,
            @RequestParam BigDecimal taxpayerImportPrice,
            @RequestParam String productHsCode,
            @RequestParam String productName,
            @RequestParam(required = false) BigDecimal discrepancyThreshold,
            @RequestHeader("X-Actor-Id") String actorId) {
        List<TpExternalPriceMatchEntity> matches = priceAnalysisUseCase.runDiscrepancyAnalysis(
                caseId, taxpayerImportPrice, productHsCode, productName, discrepancyThreshold, actorId);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/analysis/price-matches")
    public ResponseEntity<List<TpExternalPriceMatchEntity>> getPriceMatches(@PathVariable UUID caseId) {
        return ResponseEntity.ok(priceAnalysisUseCase.getMatchesForCase(caseId));
    }

    @GetMapping("/analysis/price-matches/discrepancies")
    public ResponseEntity<List<TpExternalPriceMatchEntity>> getDiscrepancies(@PathVariable UUID caseId) {
        return ResponseEntity.ok(priceAnalysisUseCase.getDiscrepanciesForCase(caseId));
    }

    @PatchMapping("/analysis/price-matches/{matchId}/validate")
    public ResponseEntity<Void> validatePriceMatch(
            @PathVariable UUID caseId,
            @PathVariable UUID matchId,
            @RequestParam String validationStatus,
            @RequestParam(required = false) String notes,
            @RequestHeader("X-Actor-Id") String actorId) {
        priceAnalysisUseCase.validatePriceMatch(matchId, validationStatus, notes, actorId);
        return ResponseEntity.ok().build();
    }

    // ── Information & Document Requests (IDR) ────────────────────────────────

    @PostMapping("/field-work/information-requests/create")
    public ResponseEntity<UUID> createInformationRequest(
            @PathVariable UUID caseId,
            @RequestParam String requestType,
            @RequestParam String subject,
            @RequestParam String description,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate deadlineDate,
            @RequestHeader("X-Actor-Id") String actorId) {
        UUID id = idrUseCase.createInformationRequest(caseId, requestType, subject, description, deadlineDate, actorId);
        return ResponseEntity.ok(id);
    }

    @PostMapping("/field-work/information-requests/{idrId}/submit-for-approval")
    public ResponseEntity<Void> submitIdrForApproval(
            @PathVariable UUID caseId,
            @PathVariable UUID idrId,
            @RequestHeader("X-Actor-Id") String actorId) {
        idrUseCase.submitForApproval(idrId, actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/field-work/information-requests/{idrId}/approve")
    public ResponseEntity<Void> approveIdr(
            @PathVariable UUID caseId,
            @PathVariable UUID idrId,
            @RequestParam boolean approved,
            @RequestParam(required = false) String comments,
            @RequestHeader("X-Actor-Id") String actorId) {
        idrUseCase.approveInformationRequest(idrId, approved, comments, actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/field-work/information-requests/{idrId}/issue")
    public ResponseEntity<Void> issueIdr(
            @PathVariable UUID caseId,
            @PathVariable UUID idrId,
            @RequestHeader("X-Actor-Id") String actorId) {
        idrUseCase.issueToTaxpayer(idrId, actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/field-work/information-requests/{idrId}/taxpayer-response")
    public ResponseEntity<Void> recordTaxpayerResponse(
            @PathVariable UUID caseId,
            @PathVariable UUID idrId,
            @RequestParam String response,
            @RequestHeader("X-Actor-Id") String actorId) {
        idrUseCase.recordTaxpayerResponse(idrId, response, actorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/field-work/information-requests/{idrId}/close")
    public ResponseEntity<Void> closeIdr(
            @PathVariable UUID caseId,
            @PathVariable UUID idrId,
            @RequestHeader("X-Actor-Id") String actorId) {
        idrUseCase.closeRequest(idrId, actorId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/field-work/information-requests")
    public ResponseEntity<List<TpInformationRequestLogEntity>> getInformationRequests(@PathVariable UUID caseId) {
        return ResponseEntity.ok(idrUseCase.getRequestsForCase(caseId));
    }

    // ── Audit Action History ──────────────────────────────────────────────────

    @GetMapping("/action-history")
    public ResponseEntity<List<TpAuditActionHistoryEntity>> getActionHistory(@PathVariable UUID caseId) {
        return ResponseEntity.ok(historyUseCase.getFullHistory(caseId));
    }

    @GetMapping("/action-history/{phase}")
    public ResponseEntity<List<TpAuditActionHistoryEntity>> getPhaseHistory(
            @PathVariable UUID caseId,
            @PathVariable String phase) {
        return ResponseEntity.ok(historyUseCase.getPhaseHistory(caseId, phase));
    }
}
