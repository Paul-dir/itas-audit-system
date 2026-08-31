package mor.itas.persistence.jpa.entity.tp;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tp_analysis_data")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TpAnalysisDataEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_case_id", nullable = false)
    private ApAuditCaseEntity auditCase;

    @Column(name = "audit_case_id", insertable = false, updatable = false)
    private UUID auditCaseId;

    @Column(name = "ratio_analyses", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode ratioAnalyses;

    @Column(name = "cost_expense_selections", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode costExpenseSelections;

    @Column(name = "benchmark_comparisons", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode benchmarkComparisons;

    @Column(name = "cross_border_assessments", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode crossBorderAssessments;

    @Column(name = "customs_valuation_matches", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode customsValuationMatches;

    @Column(name = "method_selection", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode methodSelection;

    @Column(name = "selected_tp_method", length = 50)
    private String selectedTpMethod;

    @Column(name = "arms_length_analysis", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode armsLengthAnalysis;

    @Column(name = "arms_length_range_min", precision = 18, scale = 4)
    private BigDecimal armsLengthRangeMin;

    @Column(name = "arms_length_range_max", precision = 18, scale = 4)
    private BigDecimal armsLengthRangeMax;

    @Column(name = "taxpayer_actual_result", precision = 18, scale = 4)
    private BigDecimal taxpayerActualResult;

    @Column(name = "variance_amount", precision = 18, scale = 4)
    private BigDecimal varianceAmount;

    @Column(name = "variance_percentage", precision = 10, scale = 4)
    private BigDecimal variancePercentage;

    @Column(name = "status", length = 50)
    @Builder.Default
    private String status = "IN_PROGRESS";

    @Column(name = "created_by", length = 255)
    private String createdBy;

    @Column(name = "updated_by", length = 255)
    private String updatedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
