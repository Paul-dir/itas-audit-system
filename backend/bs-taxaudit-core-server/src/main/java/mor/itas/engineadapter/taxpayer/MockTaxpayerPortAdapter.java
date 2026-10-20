package mor.itas.engineadapter.taxpayer;

import mor.itas.application.port.outboundport.taxpayer.TaxpayerPort;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * MockTaxpayerPortAdapter - Risk-aware taxpayer classification
 * 
 * Uses MockTaxpayerAdapter data + risk rules to classify each taxpayer
 * into an audit type with a risk score.
 * 
 * Risk Classification Rules:
 * - Transfer Pricing: has international operations OR related parties OR high revenue
 * - Joint Audit: has joint audit risk flag OR large business size
 * - Comprehensive: has multiple compliance issues OR large financials
 * - Issue Audit: has specific compliance flags (non-compliant status)
 * - Desk Audit: default for all remaining taxpayers
 */
@Component
@Profile("mock")
public class MockTaxpayerPortAdapter implements TaxpayerPort {
    
    private final MockTaxpayerAdapter mockTaxpayerAdapter;
    
    private static final String DESK_AUDIT = "desk_audit";
    private static final String JOINT_AUDIT = "joint_audit";
    private static final String TRANSFER_PRICING = "transfer_pricing";
    private static final String COMPREHENSIVE = "comprehensive";
    private static final String ISSUE_AUDIT = "issue_audit";
    
    public MockTaxpayerPortAdapter(MockTaxpayerAdapter mockTaxpayerAdapter) {
        this.mockTaxpayerAdapter = mockTaxpayerAdapter;
    }
    
    @Override
    public List<Map<String, Object>> getTaxpayersForTaxCenter(String taxCenterCode) {
        List<Map<String, Object>> taxpayers = mockTaxpayerAdapter.getTaxpayersForTaxCenter(taxCenterCode);
        if (taxpayers == null) return Collections.emptyList();
        
        return taxpayers.stream()
            .map(tp -> {
                try {
                    Map<String, Object> enriched = new HashMap<>(tp);
                    // If taxpayer already has risk data (lightweight or detailed), use it directly
                    if (tp.containsKey("recommendedAuditType") && tp.containsKey("riskScore")) {
                        // Already classified by MockTaxpayerAdapter - just pass through
                        return enriched;
                    }
                    // Fallback: classify via full risk engine (for unclassified taxpayers)
                    Map<String, Object> risk = getTaxpayerRiskClassification(
                        (String) tp.get("tin"), taxCenterCode);
                    enriched.put("recommendedAuditType", risk.get("auditType"));
                    enriched.put("riskScore", risk.get("riskScore"));
                    enriched.put("riskLevel", risk.get("riskLevel"));
                    enriched.put("riskReason", risk.get("reason"));
                    return enriched;
                } catch (Exception e) {
                    Map<String, Object> enriched = new HashMap<>(tp);
                    enriched.put("recommendedAuditType", DESK_AUDIT);
                    enriched.put("riskScore", 5);
                    enriched.put("riskLevel", "LOW");
                    enriched.put("riskReason", "Default classification");
                    return enriched;
                }
            })
            .collect(Collectors.toList());
    }
    
    @Override
    public Map<String, Object> getTaxpayerRiskClassification(String tin, String taxCenterCode) {
        Map<String, Object> taxpayer = mockTaxpayerAdapter.getTaxpayerById(tin);
        if (taxpayer == null || taxpayer.isEmpty()) {
            return Map.of("auditType", DESK_AUDIT, "riskScore", 0, "riskLevel", "LOW", "reason", "Unknown taxpayer");
        }
        
        int riskScore = 0;
        String auditType = DESK_AUDIT;
        List<String> reasons = new ArrayList<>();
        
        try {
            // Rule 1: Transfer Pricing Risk
            boolean hasTPRisk = Boolean.TRUE.equals(taxpayer.get("tpRiskFlag"));
            boolean hasIntOps = Boolean.TRUE.equals(taxpayer.get("hasInternationalOperations"));
            boolean hasRelatedParties = Boolean.TRUE.equals(taxpayer.get("hasRelatedParties"));
            
            double revenue = 0;
            Object financialsObj = taxpayer.get("financials");
            if (financialsObj instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> financials = (Map<String, Object>) financialsObj;
                Object revObj = financials.get("annualRevenue");
                if (revObj instanceof Number) {
                    revenue = ((Number) revObj).doubleValue();
                }
            }
            
            if (hasTPRisk || (hasIntOps && hasRelatedParties)) {
                riskScore += 40;
                reasons.add("Transfer pricing risk indicators");
            }
            if (revenue > 50_000_000) {
                riskScore += 20;
                reasons.add("High revenue (>50M ETB)");
            }
            
            // Rule 2: Joint Audit Risk
            boolean hasJARisk = Boolean.TRUE.equals(taxpayer.get("jaRiskFlag"));
            String businessSize = (String) taxpayer.get("businessSize");
            boolean isLarge = "Large".equals(businessSize) || "Very Large".equals(businessSize);
            
            if (hasJARisk || isLarge) {
                riskScore += 30;
                reasons.add(isLarge ? "Large business" : "Joint audit risk flag");
            }
            
            // Rule 3: Comprehensive Audit Risk
            String complianceStatus = (String) taxpayer.get("complianceStatus");
            boolean isNonCompliant = "Non-Compliant".equals(complianceStatus);
            boolean isMixed = "Mixed".equals(complianceStatus);
            
            // Parse compliance history safely (may be List or Map)
            int prevAudits = 0;
            int findings = 0;
            Object historyObj = taxpayer.get("complianceHistory");
            if (historyObj instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> history = (Map<String, Object>) historyObj;
                Object audits = history.get("totalAudits");
                Object finds = history.get("totalFindings");
                if (audits instanceof Number) prevAudits = ((Number) audits).intValue();
                if (finds instanceof Number) findings = ((Number) finds).intValue();
            } else if (historyObj instanceof List) {
                // complianceHistory is a List of audit records
                @SuppressWarnings("unchecked")
                List<Object> historyList = (List<Object>) historyObj;
                prevAudits = historyList.size();
                for (Object record : historyList) {
                    if (record instanceof Map) {
                        Object findingsObj = ((Map<?, ?>) record).get("findings");
                        if (findingsObj instanceof Number) {
                            findings += ((Number) findingsObj).intValue();
                        } else if (findingsObj instanceof List) {
                            findings += ((List<?>) findingsObj).size();
                        }
                    }
                }
            }
            
            if (isNonCompliant || findings > 3) {
                riskScore += 25;
                reasons.add(isNonCompliant ? "Non-compliant status" : "Multiple audit findings");
            }
            if (prevAudits > 2) {
                riskScore += 10;
                reasons.add("Multiple previous audits");
            }
            
            // Rule 4: Issue Audit Risk
            if (isMixed || (findings > 0 && findings <= 3)) {
                riskScore += 15;
                reasons.add("Compliance issues detected");
            }
            
            // Assign audit type based on highest risk factor
            if (riskScore >= 50 && (hasTPRisk || (hasIntOps && hasRelatedParties) || revenue > 50_000_000)) {
                auditType = TRANSFER_PRICING;
            } else if (riskScore >= 40 && (hasJARisk || isLarge)) {
                auditType = JOINT_AUDIT;
            } else if (riskScore >= 35 && (isNonCompliant || findings > 3)) {
                auditType = COMPREHENSIVE;
            } else if (riskScore >= 20 && (isMixed || findings > 0)) {
                auditType = ISSUE_AUDIT;
            } else {
                auditType = DESK_AUDIT;
                riskScore = Math.max(riskScore, 5);
            }
        } catch (Exception e) {
            // Fallback: desk audit with low risk
            auditType = DESK_AUDIT;
            riskScore = 5;
            reasons.add("Classification fallback: " + e.getMessage());
        }
        
        String riskLevel;
        if (riskScore >= 50) riskLevel = "CRITICAL";
        else if (riskScore >= 35) riskLevel = "HIGH";
        else if (riskScore >= 20) riskLevel = "MEDIUM";
        else riskLevel = "LOW";
        
        String reason = reasons.isEmpty() ? "Standard risk profile" : String.join("; ", reasons);
        
        return Map.of(
            "auditType", auditType,
            "riskScore", riskScore,
            "riskLevel", riskLevel,
            "reason", reason
        );
    }
    
    @Override
    public List<Map<String, Object>> getTaxpayersByAuditType(String taxCenterCode, String auditType, int limit) {
        return getTaxpayersForTaxCenter(taxCenterCode).stream()
            .filter(tp -> auditType.equals(tp.get("recommendedAuditType")))
            .sorted((a, b) -> {
                int scoreA = a.get("riskScore") instanceof Number ? ((Number) a.get("riskScore")).intValue() : 0;
                int scoreB = b.get("riskScore") instanceof Number ? ((Number) b.get("riskScore")).intValue() : 0;
                return Integer.compare(scoreB, scoreA);
            })
            .limit(limit)
            .collect(Collectors.toList());
    }
}
