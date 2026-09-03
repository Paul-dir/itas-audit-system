package mor.itas.persistence.jpa.entity.tp;

import jakarta.persistence.*;
import lombok.*;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Stores the auto-generated discrepancy report produced by matching the
 * taxpayer's declared import price against comparable market prices from the
 * customs valuation database and competitor price uploads.
 *
 * Statutory basis: "interface with external price databases — produce TP
 * discrepancy report for the auditor to validate."
 *
 * The system automatically computes price_variance_amount and discrepancy_flag.
 * The auditor then validates, disputes, or confirms each match.
 */
@Entity
@Table(name = "tp_external_price_match")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TpExternalPriceMatchEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_case_id", nullable = false)
    private ApAuditCaseEntity auditCase;

    @Column(name = "audit_case_id", insertable = false, updatable = false)
    private UUID auditCaseId;

    @Column(name = "match_reference", length = 50, unique = true, nullable = false)
    private String matchReference;                  // e.g. EPM-2026-0001

    @Column(name = "product_hs_code", length = 20)
    private String productHsCode;

    @Column(name = "product_name", length = 512)
    private String productName;

    @Column(name = "taxpayer_import_price", precision = 19, scale = 4, nullable = false)
    private BigDecimal taxpayerImportPrice;         // Declared price from taxpayer

    @Column(name = "market_price_min", precision = 19, scale = 4)
    private BigDecimal marketPriceMin;              // Lowest comparable found

    @Column(name = "market_price_max", precision = 19, scale = 4)
    private BigDecimal marketPriceMax;              // Highest comparable found

    @Column(name = "market_price_median", precision = 19, scale = 4)
    private BigDecimal marketPriceMedian;           // Median / IQR midpoint

    @Column(name = "price_variance_amount", precision = 19, scale = 4)
    private BigDecimal priceVarianceAmount;         // taxpayer - median (auto-calculated)

    @Column(name = "price_variance_pct", precision = 10, scale = 4)
    private BigDecimal priceVariancePct;            // (variance / median) * 100

    @Column(name = "discrepancy_flag", nullable = false)
    @Builder.Default
    private Boolean discrepancyFlag = false;        // TRUE when variance > threshold

    @Column(name = "discrepancy_threshold", precision = 10, scale = 4)
    @Builder.Default
    private BigDecimal discrepancyThreshold = new BigDecimal("5.00"); // 5% default

    @Column(name = "validation_status", length = 50, nullable = false)
    @Builder.Default
    private String validationStatus = "PENDING";    // PENDING | VALIDATED | DISPUTED

    @Column(name = "auditor_validation_notes", columnDefinition = "TEXT")
    private String auditorValidationNotes;

    @Column(name = "validated_by", length = 255)
    private String validatedBy;

    @Column(name = "validated_at")
    private OffsetDateTime validatedAt;

    @Column(name = "generated_at", updatable = false)
    private OffsetDateTime generatedAt;

    @Column(name = "generated_by", length = 255, nullable = false)
    private String generatedBy;
}
