package mor.itas.domain.model.ap;

import java.math.BigDecimal;
import java.util.*;

/**
 * NationalRiskData - Value Object
 * 
 * Represents national-level risk aggregates:
 * - Total taxpayers and risky count
 * - Risk level distribution (critical, high, medium, low)
 * - Audit type recommendations
 * 
 * Immutable value object constructed from Risk Engine and Taxpayer Registration data.
 */
public class NationalRiskData {
    private final Long totalTaxpayers;
    private final Long totalRisky;
    private final BigDecimal percentRisky;
    
    private final Map<RiskLevel, Long> byRiskLevel; // critical, high, medium, low counts
    private final List<AuditTypeDistribution> byAuditType;

    public NationalRiskData(
            Long totalTaxpayers,
            Long totalRisky,
            BigDecimal percentRisky,
            Map<RiskLevel, Long> byRiskLevel,
            List<AuditTypeDistribution> byAuditType) {
        this.totalTaxpayers = totalTaxpayers != null ? totalTaxpayers : 0L;
        this.totalRisky = totalRisky != null ? totalRisky : 0L;
        this.percentRisky = percentRisky != null ? percentRisky : BigDecimal.ZERO;
        this.byRiskLevel = byRiskLevel != null ? new HashMap<>(byRiskLevel) : new HashMap<>();
        this.byAuditType = byAuditType != null ? new ArrayList<>(byAuditType) : new ArrayList<>();
    }

    public Long getTotalTaxpayers() {
        return totalTaxpayers;
    }

    public Long getTotalRisky() {
        return totalRisky;
    }

    public BigDecimal getPercentRisky() {
        return percentRisky;
    }

    public Map<RiskLevel, Long> getByRiskLevel() {
        return Collections.unmodifiableMap(byRiskLevel);
    }

    public Long getRiskCount(RiskLevel riskLevel) {
        return byRiskLevel.getOrDefault(riskLevel, 0L);
    }

    public List<AuditTypeDistribution> getByAuditType() {
        return Collections.unmodifiableList(byAuditType);
    }

    public AuditTypeDistribution getAuditTypeDistribution(String auditTypeId) {
        return byAuditType.stream()
                .filter(a -> a.getAuditTypeId().equals(auditTypeId))
                .findFirst()
                .orElse(null);
    }

    @Override
    public String toString() {
        return "NationalRiskData{" +
                "totalTaxpayers=" + totalTaxpayers +
                ", totalRisky=" + totalRisky +
                ", percentRisky=" + percentRisky +
                ", byRiskLevel=" + byRiskLevel +
                ", byAuditType=" + byAuditType +
                '}';
    }
}
