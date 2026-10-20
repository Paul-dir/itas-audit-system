package mor.itas.api.controller.backoffice.identity;

import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import mor.itas.api.dto.response.ap.GenericResponse;
import mor.itas.persistence.jpa.entity.identity.RegionEntity;
import mor.itas.persistence.jpa.entity.identity.TaxCenterEntity;
import mor.itas.persistence.jpa.repository.identity.RegionRepository;
import mor.itas.persistence.jpa.repository.identity.TaxCenterRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrganizationalHierarchyController {

    private final RegionRepository regionRepository;
    private final TaxCenterRepository taxCenterRepository;

    @Data
    @Builder
    public static class AuditTypeDto {
        private String id;
        private String code;
        private String name;
        private boolean requiresCommittee;
        private String initialAssignmentRole;
    }

    @Data
    @Builder
    public static class CommitteeDto {
        private String id;
        private String code;
        private String name;
        private String taxCenterId;
        private String auditTypeId;
    }

    @GetMapping("/regions")
    public ResponseEntity<GenericResponse<List<RegionEntity>>> getRegions() {
        return ResponseEntity.ok(GenericResponse.success(regionRepository.findAll()));
    }

    @GetMapping("/regions/{regionId}/tax-centers")
    public ResponseEntity<GenericResponse<List<TaxCenterEntity>>> getTaxCentersByRegion(@PathVariable String regionId) {
        try {
            UUID rId = UUID.fromString(regionId);
            return ResponseEntity.ok(GenericResponse.success(taxCenterRepository.findByRegionId(rId)));
        } catch (Exception e) {
            return ResponseEntity.ok(GenericResponse.success(taxCenterRepository.findAll()));
        }
    }

    @GetMapping("/tax-centers/{tcId}/audit-types")
    public ResponseEntity<GenericResponse<List<AuditTypeDto>>> getAuditTypesByTaxCenter(@PathVariable String tcId) {
        List<AuditTypeDto> types = List.of(
            AuditTypeDto.builder().id("desk_audit").code("DESK_AUDIT").name("Desk Audit").requiresCommittee(false).initialAssignmentRole("TEAM_LEADER").build(),
            AuditTypeDto.builder().id("comprehensive").code("COMPREHENSIVE_AUDIT").name("Comprehensive Audit").requiresCommittee(false).initialAssignmentRole("TEAM_LEADER").build(),
            AuditTypeDto.builder().id("joint_audit").code("JOINT_AUDIT").name("Joint Audit").requiresCommittee(true).initialAssignmentRole("COMMITTEE").build(),
            AuditTypeDto.builder().id("transfer_pricing").code("TRANSFER_PRICING").name("Transfer Pricing").requiresCommittee(true).initialAssignmentRole("COMMITTEE").build()
        );
        return ResponseEntity.ok(GenericResponse.success(types));
    }

    @GetMapping("/tax-centers/{tcId}/committees")
    public ResponseEntity<GenericResponse<List<CommitteeDto>>> getCommitteesByTaxCenter(@PathVariable String tcId) {
        List<CommitteeDto> committees = List.of(
            CommitteeDto.builder().id("e2b95130-0000-0000-0000-000000000001").code(tcId + "-JA-COM-001").name(tcId + " Joint Audit Committee 1").taxCenterId(tcId).auditTypeId("JOINT_AUDIT").build(),
            CommitteeDto.builder().id("e2b95130-0000-0000-0000-000000000003").code(tcId + "-TP-COM-001").name(tcId + " Transfer Pricing Committee 1").taxCenterId(tcId).auditTypeId("TRANSFER_PRICING").build()
        );
        return ResponseEntity.ok(GenericResponse.success(committees));
    }
}
