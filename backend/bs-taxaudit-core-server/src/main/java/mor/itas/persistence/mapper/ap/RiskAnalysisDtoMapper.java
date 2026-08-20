package mor.itas.persistence.mapper.ap;

import mor.itas.api.dto.response.ap.*;
import mor.itas.domain.model.ap.*;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

/**
 * RiskAnalysisDtoMapper - Maps domain models to response DTOs
 * 
 * Converts:
 * - RiskAnalysis → RiskAnalysisResponse
 * - NationalRiskData → NationalRiskDataDto
 * - RegionalRiskData → RegionalRiskDataDto
 * - AuditTypeDistribution → AuditTypeDistributionDto
 * 
 * Used by: RiskAnalysisController
 */
@Component
public class RiskAnalysisDtoMapper {

    public RiskAnalysisResponse toRiskAnalysisResponse(RiskAnalysis domain) {
        if (domain == null) return null;

        return RiskAnalysisResponse.builder()
                .source(domain.getSource())
                .lastUpdated(domain.getCreatedAt())
                .national(toNationalRiskDataDto(domain.getNational()))
                .byRegion(domain.getByRegion().stream()
                        .map(this::toRegionalRiskDataDto)
                        .collect(Collectors.toList()))
                .planDefaults(domain.getPlanDefaults())
                .build();
    }

    public NationalRiskDataDto toNationalRiskDataDto(NationalRiskData domain) {
        if (domain == null) return null;

        Map<String, RiskLevelDataDto> byRiskLevel = new HashMap<>();
        for (RiskLevel level : RiskLevel.values()) {
            Long count = domain.getRiskCount(level);
            if (count == null || count == 0) continue;

            long totalRisky = domain.getTotalRisky();
            BigDecimal percentage = totalRisky > 0
                    ? new BigDecimal(count)
                            .divide(new BigDecimal(totalRisky), 4, RoundingMode.HALF_UP)
                            .multiply(new BigDecimal(100))
                            .setScale(1, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            byRiskLevel.put(level.name().toLowerCase(), RiskLevelDataDto.builder()
                    .level(level.name().toLowerCase())
                    .count(count)
                    .percentage(percentage)
                    .build());
        }

        return NationalRiskDataDto.builder()
                .totalTaxpayers(domain.getTotalTaxpayers())
                .totalRisky(domain.getTotalRisky())
                .percentRisky(domain.getPercentRisky())
                .byRiskLevel(byRiskLevel)
                .byAuditType(domain.getByAuditType().stream()
                        .map(this::toAuditTypeDistributionDto)
                        .collect(Collectors.toList()))
                .build();
    }

    public RegionalRiskDataDto toRegionalRiskDataDto(RegionalRiskData domain) {
        if (domain == null) return null;

        return RegionalRiskDataDto.builder()
                .id(domain.getId())
                .name(domain.getName())
                .code(domain.getCode())
                .totalTaxpayers(domain.getTotalTaxpayers())
                .totalRisky(domain.getTotalRisky())
                .percentRisky(domain.getPercentRisky())
                .byAuditType(domain.getByAuditType().stream()
                        .map(this::toAuditTypeDistributionDto)
                        .collect(Collectors.toList()))
                .build();
    }

    public AuditTypeDistributionDto toAuditTypeDistributionDto(AuditTypeDistribution domain) {
        if (domain == null) return null;

        return AuditTypeDistributionDto.builder()
                .auditTypeId(domain.getAuditTypeId())
                .auditTypeName(domain.getAuditTypeName())
                .count(domain.getCount())
                .percentage(domain.getPercentage())
                .build();
    }
}
