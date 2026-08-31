package mor.itas.api.controller.backoffice.ap;

import mor.itas.api.dto.response.ap.GenericResponse;
import mor.itas.application.port.outboundport.taxpayer.TaxpayerPort;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * TaxCenterTaxpayersController - Returns taxpayers for a tax center with risk classification
 */
@RestController
@RequestMapping("/api/v1/backoffice/ap/tax-center")
@RequiredArgsConstructor
public class TaxCenterTaxpayersController {

    private final TaxpayerPort taxpayerPort;

    /**
     * Map frontend tax center code to backend format
     * AA-TC1 -> TC-AA-01, BA-TC2 -> TC-BA-02, etc.
     */
    private String mapTaxCenterCode(String frontendCode) {
        if (frontendCode == null) return null;
        if (frontendCode.startsWith("TC-")) return frontendCode;
        // AA-TC1 -> TC-AA-01, AA-TC2 -> TC-AA-02
        String[] parts = frontendCode.split("-TC");
        if (parts.length == 2) {
            String region = parts[0];
            String tcNum = parts[1];
            return String.format("TC-%s-%02d", region, Integer.parseInt(tcNum));
        }
        return frontendCode;
    }

    @GetMapping("/taxpayers")
    public ResponseEntity<GenericResponse<Map<String, Object>>> getTaxpayers(
        @RequestParam String taxCenterCode,
        @RequestParam(defaultValue = "false") boolean all) {

        try {
            String backendCode = mapTaxCenterCode(taxCenterCode);
            // If all=false, return only detailed taxpayers (500) for display
            // If all=true, return all 30K+ (used for cascade)
            List<Map<String, Object>> taxpayers;
            if (all) {
                taxpayers = taxpayerPort.getTaxpayersForTaxCenter(backendCode);
            } else {
                // Get all for count, but limit detailed for display
                List<Map<String, Object>> allTaxpayers = taxpayerPort.getTaxpayersForTaxCenter(backendCode);
                // Return first 1000 for display (filtered by risk level)
                taxpayers = allTaxpayers.stream().limit(1000).collect(Collectors.toList());
            }

            if (taxpayers == null || taxpayers.isEmpty()) {
                return ResponseEntity.ok(GenericResponse.success(Map.of(
                    "taxCenterCode", taxCenterCode,
                    "totalTaxpayers", 0,
                    "taxpayers", List.of()
                )));
            }

            // Compute risk stats + estimated revenue from FULL dataset
            int critical = 0, high = 0, medium = 0, low = 0;
            long totalEstimatedRevenue = 0;
            List<Map<String, Object>> allForStats = taxpayerPort.getTaxpayersForTaxCenter(backendCode);
            for (Map<String, Object> tp : allForStats) {
                String level = (String) tp.getOrDefault("riskLevel", "LOW");
                switch (level) {
                    case "CRITICAL" -> critical++;
                    case "HIGH" -> high++;
                    case "MEDIUM" -> medium++;
                    default -> low++;
                }
                Object estRev = tp.get("estimatedRevenue");
                if (estRev instanceof Number) totalEstimatedRevenue += ((Number) estRev).longValue();
            }

            Map<String, Object> result = Map.of(
                "taxCenterCode", taxCenterCode,
                "totalTaxpayers", allForStats.size(),
                "criticalRisk", critical,
                "highRisk", high,
                "mediumRisk", medium,
                "lowRisk", low,
                "totalEstimatedRevenue", totalEstimatedRevenue,
                "taxpayers", taxpayers
            );

            return ResponseEntity.ok(GenericResponse.success(result));
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.error("ERROR", "Failed: " + e.getMessage()));
        }
    }
}
