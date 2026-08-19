package mor.itas.domain.model.ap;

import java.math.BigDecimal;

/**
 * AuditTypeDistribution - Value Object
 * 
 * Represents the distribution of cases for a specific audit type
 * (e.g., desk audit, field audit, joint audit, etc.)
 * 
 * Immutable value object containing:
 * - Audit type identifier
 * - Case count
 * - Percentage of total
 */
public class AuditTypeDistribution {
    private final String auditTypeId;
    private final String auditTypeName;
    private final Long count;
    private final BigDecimal percentage;

    public AuditTypeDistribution(String auditTypeId, String auditTypeName, Long count, BigDecimal percentage) {
        this.auditTypeId = auditTypeId;
        this.auditTypeName = auditTypeName;
        this.count = count != null ? count : 0L;
        this.percentage = percentage != null ? percentage : BigDecimal.ZERO;
    }

    public String getAuditTypeId() {
        return auditTypeId;
    }

    public String getAuditTypeName() {
        return auditTypeName;
    }

    public Long getCount() {
        return count;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    @Override
    public String toString() {
        return "AuditTypeDistribution{" +
                "auditTypeId='" + auditTypeId + '\'' +
                ", auditTypeName='" + auditTypeName + '\'' +
                ", count=" + count +
                ", percentage=" + percentage +
                '}';
    }
}
