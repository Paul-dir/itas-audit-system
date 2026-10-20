package mor.itas.domain.model.tp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mor.itas.domain.valueobject.tp.TpFactStatementStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TpFactStatement {
    private String statementId;
    private String caseId;
    @Builder.Default
    private int version = 1;
    @Builder.Default
    private TpFactStatementStatus status = TpFactStatementStatus.DRAFT;
    
    private String businessProfile;
    private String organizationalStructure;
    private String relatedPartyRelationships;
    private String controlledTransactionsOverview;
    private String transactionAccountingTreatment;
    private String industryContext;
    private String supportingEvidenceSummary;
    private String factsEstablished;
    private String auditorQuestions;
    
    @Builder.Default
    private List<TpTaxpayerFactComment> taxpayerComments = new ArrayList<>();
    
    @Builder.Default
    private boolean isCurrentVersion = true;
    private String authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TpTaxpayerFactComment {
        private String commentId;
        private String factReference;
        private String commentText;
        private LocalDateTime commentDate;
        private String taxpayerId;
        private boolean disputed;
        private String correctionRequested;
    }
}
