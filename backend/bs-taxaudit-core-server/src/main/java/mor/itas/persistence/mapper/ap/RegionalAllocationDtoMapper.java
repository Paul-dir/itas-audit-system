package mor.itas.persistence.mapper.ap;

import mor.itas.api.dto.response.ap.RegionalAllocationDto;
import mor.itas.domain.model.ap.RegionalAllocationDetail;
import org.springframework.stereotype.Component;

/**
 * RegionalAllocationDtoMapper - Mapper
 * 
 * Maps domain models to DTOs for Regional Allocation responses.
 */
@Component
public class RegionalAllocationDtoMapper {
    
    /**
     * Map RegionalAllocationDetail to RegionalAllocationDto
     * 
     * @param detail the domain model
     * @return the DTO
     */
    public RegionalAllocationDto toRegionalAllocationDto(RegionalAllocationDetail detail) {
        if (detail == null) {
            return null;
        }
        
        return RegionalAllocationDto.builder()
            .regionId(detail.getRegionId())
            .allocationByAuditType(detail.getAllocationByAuditType())
            .totalAllocation(detail.getTotalAllocated())
            .taxCenterAllocations(detail.getTaxCenterAllocations())
            .status(detail.getStatus())
            .build();
    }
}
