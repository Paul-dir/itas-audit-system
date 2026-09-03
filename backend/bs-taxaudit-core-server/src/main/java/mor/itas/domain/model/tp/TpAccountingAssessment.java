package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpAccountingAssessment {
    private String assessmentId;
    private String caseId;
    private String accountingMethodsUsed;
    private String financialReportingMethods;
    private String accountingPolicies;
    private String recordReviewResults;
    private String revenueReportingObservations;
    private String expenseReportingObservations;
    private String relatedPartyReportingObservations;
    
    @Builder.Default
    private List<String> auditorFindings = new ArrayList<>();
}
