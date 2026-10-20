package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpSampleSelectionStatus;
import mor.itas.domain.valueobject.tp.TpSamplingMethod;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpSampleSelection {
    private String selectionId;
    private String caseId;
    private String populationName;
    private String selectionCriteria;
    private TpSamplingMethod samplingMethod;
    private int calculatedSampleSize;
    
    @Builder.Default
    private List<String> selectedRecordIds = new ArrayList<>();
    
    @Builder.Default
    private List<String> justifications = new ArrayList<>();
    
    private String selectingAuditorId;
    @Builder.Default
    private TpSampleSelectionStatus status = TpSampleSelectionStatus.DRAFT;
    @Builder.Default
    private boolean reproducible = true;
    private LocalDateTime createdAt;
}
