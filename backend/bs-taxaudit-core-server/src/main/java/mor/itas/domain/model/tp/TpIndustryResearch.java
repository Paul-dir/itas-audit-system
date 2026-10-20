package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpIndustryResearch {
    private String researchId;
    private String caseId;
    private String sectorClassification;
    private String businessModelAnalysis;
    private String marketCharacteristics;
    private String economicRisks;
    
    @Builder.Default
    private List<String> industryBenchmarks = new ArrayList<>();
    
    @Builder.Default
    private List<String> comparableBusinessProfiles = new ArrayList<>();
    
    @Builder.Default
    private List<String> researchSources = new ArrayList<>();
    
    @Builder.Default
    private List<String> supportingDocs = new ArrayList<>();
    
    private LocalDate completionDate;
}
