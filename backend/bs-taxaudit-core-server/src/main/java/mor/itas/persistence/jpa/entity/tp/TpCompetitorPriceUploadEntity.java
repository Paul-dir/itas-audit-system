package mor.itas.persistence.jpa.entity.tp;

import jakarta.persistence.*;
import lombok.*;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Stores import prices of comparable/competing companies for CUP (Comparable
 * Uncontrolled Price) analysis.  Each row represents a single product price
 * observation uploaded manually or imported from ASYCUDA / CBE Swift data.
 *
 * Statutory basis: Directive 43/2015 Art. 9 — CUP method; system requirement:
 * "upload prices of selected products imported by competing companies and use
 * for preliminary comparative analysis."
 */
@Entity
@Table(name = "tp_competitor_price_uploads")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TpCompetitorPriceUploadEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_case_id", nullable = false)
    private ApAuditCaseEntity auditCase;

    @Column(name = "audit_case_id", insertable = false, updatable = false)
    private UUID auditCaseId;

    @Column(name = "upload_reference", length = 50, unique = true, nullable = false)
    private String uploadReference;                // e.g. CPU-2026-0001

    @Column(name = "product_name", length = 512, nullable = false)
    private String productName;

    @Column(name = "product_hs_code", length = 20)
    private String productHsCode;                  // Harmonized System / customs tariff code

    @Column(name = "competitor_name", length = 512, nullable = false)
    private String competitorName;

    @Column(name = "competitor_tin", length = 64)
    private String competitorTin;

    @Column(name = "import_price", precision = 19, scale = 4, nullable = false)
    private BigDecimal importPrice;                // Per unit price

    @Column(name = "currency", length = 10, nullable = false)
    @Builder.Default
    private String currency = "USD";               // Import prices typically in USD

    @Column(name = "price_date", nullable = false)
    private LocalDate priceDate;

    @Column(name = "source", length = 50, nullable = false)
    @Builder.Default
    private String source = "MANUAL";              // MANUAL | ASYCUDA_IMPORT | CBE_SWIFT

    @Column(name = "data_source_ref", length = 255)
    private String dataSourceRef;

    @Column(name = "uploaded_by", length = 255, nullable = false)
    private String uploadedBy;

    @Column(name = "upload_notes", columnDefinition = "TEXT")
    private String uploadNotes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
