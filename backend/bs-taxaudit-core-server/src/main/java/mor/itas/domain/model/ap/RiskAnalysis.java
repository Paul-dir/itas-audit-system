package mor.itas.domain.model.ap;

import java.time.OffsetDateTime;
import java.util.*;

/**
 * RiskAnalysis - Aggregate Root
 * 
 * Represents the complete risk analysis for annual plan creation:
 * - National level aggregates
 * - Regional breakdown
 * - Plan defaults (computed case distribution)
 * 
 * This aggregate is constructed on-the-fly from Risk Engine and Taxpayer
 * Registration adapters. It is NOT persisted to database but read-only.
 */
public class RiskAnalysis {
    private final String id;
    private final OffsetDateTime createdAt;
    private final String source;  // "live" or "estimated"
    
    private final NationalRiskData national;
    private final List<RegionalRiskData> byRegion;
    private final Map<String, Map<String, Integer>> planDefaults;

    public RiskAnalysis(
            String id,
            OffsetDateTime createdAt,
            String source,
            NationalRiskData national,
            List<RegionalRiskData> byRegion,
            Map<String, Map<String, Integer>> planDefaults) {
        this.id = id != null ? id : UUID.randomUUID().toString();
        this.createdAt = createdAt != null ? createdAt : OffsetDateTime.now();
        this.source = source != null ? source : "estimated";
        this.national = national;
        this.byRegion = byRegion != null ? new ArrayList<>(byRegion) : new ArrayList<>();
        this.planDefaults = planDefaults != null ? new HashMap<>(planDefaults) : new HashMap<>();
    }

    public String getId() {
        return id;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public String getSource() {
        return source;
    }

    public NationalRiskData getNational() {
        return national;
    }

    public List<RegionalRiskData> getByRegion() {
        return Collections.unmodifiableList(byRegion);
    }

    public RegionalRiskData getRegion(String regionId) {
        return byRegion.stream()
                .filter(r -> r.getId().equals(regionId))
                .findFirst()
                .orElse(null);
    }

    public Map<String, Map<String, Integer>> getPlanDefaults() {
        return Collections.unmodifiableMap(planDefaults);
    }

    public Map<String, Integer> getRegionDefaults(String regionId) {
        Map<String, Integer> defaults = planDefaults.get(regionId);
        return defaults != null ? Collections.unmodifiableMap(defaults) : new HashMap<>();
    }

    public Integer getPlanDefaultForRegionAndType(String regionId, String auditTypeId) {
        Map<String, Integer> regionDefaults = planDefaults.get(regionId);
        if (regionDefaults == null) return 0;
        return regionDefaults.getOrDefault(auditTypeId, 0);
    }

    /**
     * Calculate total planned cases across all regions
     */
    public Long calculateTotalPlannedCases() {
        return planDefaults.values().stream()
                .flatMap(m -> m.values().stream())
                .mapToLong(Long::valueOf)
                .sum();
    }

    @Override
    public String toString() {
        return "RiskAnalysis{" +
                "id='" + id + '\'' +
                ", createdAt=" + createdAt +
                ", source='" + source + '\'' +
                ", national=" + national +
                ", byRegion=" + byRegion +
                ", planDefaults=" + planDefaults +
                '}';
    }
}
