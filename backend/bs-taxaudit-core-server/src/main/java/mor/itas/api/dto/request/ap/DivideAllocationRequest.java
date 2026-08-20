package mor.itas.api.dto.request.ap;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

/**
 * DivideAllocationRequest - Request DTO for Regional Director dividing regional allocations into tax centers
 * Regional Director divides regional allocation into multiple tax center allocations
 */
public class DivideAllocationRequest {

    @NotBlank(message = "Region code is required")
    private String regionCode;

    @NotEmpty(message = "At least one tax center allocation is required")
    @Valid
    private List<TaxCenterAllocationRequest> taxCenterAllocations;

    // Constructors
    public DivideAllocationRequest() {
    }

    public DivideAllocationRequest(String regionCode, List<TaxCenterAllocationRequest> taxCenterAllocations) {
        this.regionCode = regionCode;
        this.taxCenterAllocations = taxCenterAllocations;
    }

    // Getters and Setters
    public String getRegionCode() {
        return regionCode;
    }

    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
    }

    public List<TaxCenterAllocationRequest> getTaxCenterAllocations() {
        return taxCenterAllocations;
    }

    public void setTaxCenterAllocations(List<TaxCenterAllocationRequest> taxCenterAllocations) {
        this.taxCenterAllocations = taxCenterAllocations;
    }

    @Override
    public String toString() {
        return "DivideAllocationRequest{" +
                "regionCode='" + regionCode + '\'' +
                ", taxCenterAllocations=" + taxCenterAllocations +
                '}';
    }

    /**
     * TaxCenterAllocationRequest - Nested DTO for individual tax center allocations
     */
    public static class TaxCenterAllocationRequest {
        @NotBlank(message = "Tax center code is required")
        private String taxCenterCode;

        @NotNull(message = "Audit count is required")
        @Positive(message = "Audit count must be positive")
        private Integer auditCount;

        // Constructors
        public TaxCenterAllocationRequest() {
        }

        public TaxCenterAllocationRequest(String taxCenterCode, Integer auditCount) {
            this.taxCenterCode = taxCenterCode;
            this.auditCount = auditCount;
        }

        // Getters and Setters
        public String getTaxCenterCode() {
            return taxCenterCode;
        }

        public void setTaxCenterCode(String taxCenterCode) {
            this.taxCenterCode = taxCenterCode;
        }

        public Integer getAuditCount() {
            return auditCount;
        }

        public void setAuditCount(Integer auditCount) {
            this.auditCount = auditCount;
        }

        @Override
        public String toString() {
            return "TaxCenterAllocationRequest{" +
                    "taxCenterCode='" + taxCenterCode + '\'' +
                    ", auditCount=" + auditCount +
                    '}';
        }
    }
}
