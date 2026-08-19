package mor.itas.api.dto.request.ap;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import java.util.HashMap;
import java.util.Map;

/**
 * CreatePlanRequest - Request DTO for creating an annual audit plan
 * Production-ready: Full annual plan creation with comprehensive workflow data
 * 
 * Supports:
 * - Basic plan info (year, name, strategy, dates)
 * - Audit type allocation (desk_audit, field_audit, etc.)
 * - Regional distribution
 * - Draft vs Submitted status
 */
public class CreatePlanRequest {
    
    private Integer year;
    private String name;
    private String strategy;
    private String startDate;
    private String endDate;
    private Integer targetAudits;
    private String status;
    
    // Audit Type Allocation: { "desk_audit": 20, "field_audit": 30, ... }
    private Map<String, Integer> auditTypeAllocation = new HashMap<>();
    
    // Regional Allocation: { "Addis Ababa": { "desk_audit": 10, ... }, ... }
    private Map<String, Map<String, Integer>> regionalAllocation = new HashMap<>();
    
    // Constructors
    public CreatePlanRequest() {
    }
    
    public CreatePlanRequest(Integer year, String name) {
        this.year = year;
        this.name = name;
    }

    // Getters and Setters
    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStrategy() {
        return strategy;
    }

    public void setStrategy(String strategy) {
        this.strategy = strategy;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Integer getTargetAudits() {
        return targetAudits;
    }

    public void setTargetAudits(Integer targetAudits) {
        this.targetAudits = targetAudits;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Map<String, Integer> getAuditTypeAllocation() {
        return auditTypeAllocation;
    }

    public void setAuditTypeAllocation(Map<String, Integer> auditTypeAllocation) {
        this.auditTypeAllocation = auditTypeAllocation;
    }

    public Map<String, Map<String, Integer>> getRegionalAllocation() {
        return regionalAllocation;
    }

    public void setRegionalAllocation(Map<String, Map<String, Integer>> regionalAllocation) {
        this.regionalAllocation = regionalAllocation;
    }

    /**
     * Allows flexible JSON parsing for nested maps
     */
    @JsonAnySetter
    private void handleUnknownProperty(String key, Object value) {
        // This allows the DTO to accept additional properties without failing
    }

    @Override
    public String toString() {
        return "CreatePlanRequest{" +
                "year=" + year +
                ", name='" + name + '\'' +
                ", strategy='" + strategy + '\'' +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                ", targetAudits=" + targetAudits +
                ", status='" + status + '\'' +
                ", auditTypeAllocation=" + auditTypeAllocation +
                ", regionalAllocation=" + regionalAllocation +
                '}';
    }
}
