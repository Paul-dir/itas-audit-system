package mor.itas.domain.model.ap;

import java.math.BigDecimal;
import java.util.*;

/**
 * RegionalRiskData - Value Object
 * 
 * Represents risk data for a specific region:
 * - Region identification (id, name, code)
 * - Regional taxpayer and risky counts
 * - Audit type distribution for this region
 * 
 * Immutable value object constructed from Risk Engine regional breakdown.
 */
public class RegionalRiskData {
    private final String id;              // region code (e.g., "AA" for Addis Ababa)
    private final String name;            // full region name
    private final String code;            // 2-letter code
    
    private final Long totalTaxpayers;
    private final Long totalRisky;
    private final BigDecimal percentRisky;
    
    private final List<AuditTypeDistribution> byAuditType;

    public RegionalRiskData(
            String id,
            String name,
            String code,
            Long totalTaxpayers,
            Long totalRisky,
            BigDecimal percentRisky,
            List<AuditTypeDistribution> byAuditType) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.totalTaxpayers = totalTaxpayers != null ? totalTaxpayers : 0L;
        this.totalRisky = totalRisky != null ? totalRisky : 0L;
        this.percentRisky = percentRisky != null ? percentRisky : BigDecimal.ZERO;
        this.byAuditType = byAuditType != null ? new ArrayList<>(byAuditType) : new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCode() {
        return code;
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

    public List<AuditTypeDistribution> getByAuditType() {
        return Collections.unmodifiableList(byAuditType);
    }

    public AuditTypeDistribution getAuditTypeDistribution(String auditTypeId) {
        return byAuditType.stream()
                .filter(a -> a.getAuditTypeId().equals(auditTypeId))
                .findFirst()
                .orElse(null);
    }

    public Long getAuditTypeCount(String auditTypeId) {
        AuditTypeDistribution dist = getAuditTypeDistribution(auditTypeId);
        return dist != null ? dist.getCount() : 0L;
    }

    @Override
    public String toString() {
        return "RegionalRiskData{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", totalTaxpayers=" + totalTaxpayers +
                ", totalRisky=" + totalRisky +
                ", percentRisky=" + percentRisky +
                ", byAuditType=" + byAuditType +
                '}';
    }
}
