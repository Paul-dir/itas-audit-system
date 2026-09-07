package mor.itas.application.service.tp;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.tp.*;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import mor.itas.persistence.jpa.repository.tp.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TpCaseInitializationService {

    private final ApAuditCaseRepository caseRepository;
    private final TpRiskAssessmentRepository riskAssessmentRepository;
    private final TpWorkingHypothesisRepository workingHypothesisRepository;
    private final TpAuditPlanRepository auditPlanRepository;
    private final TpPlanningMeetingRepository planningMeetingRepository;
    private final TpFieldWorkDataRepository fieldWorkDataRepository;
    private final TpAnalysisDataRepository analysisDataRepository;
    private final TpAuditReportRepository auditReportRepository;
    private final TpAuditNoticeRepository auditNoticeRepository;
    private final TpObjectionRepository objectionRepository;
    private final TpInformationRequestLogRepository idrRepository;
    private final TpExitConferenceRepository exitConferenceRepository;
    private final ObjectMapper objectMapper;

    /**
     * Ensures all TP data structures (financials, controlled transactions, risk, plan, fieldwork, analysis)
     * are initialized in the PostgreSQL database for a given Transfer Pricing case.
     */
    @Transactional
    public ApAuditCaseEntity initializeTpCaseIfEmpty(UUID caseId, String actorId) {
        ApAuditCaseEntity auditCase = caseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Audit case not found: " + caseId));

        if (!"TRANSFER_PRICING".equalsIgnoreCase(auditCase.getAuditType())) {
            return auditCase;
        }

        boolean dirty = false;

        // 1. Initialize Risk Assessment if empty
        if (auditCase.getTpRiskAssessment() == null) {
            Map<String, Object> riskDetails = new LinkedHashMap<>();
            long rev = auditCase.getEstimatedRevenue() != null ? auditCase.getEstimatedRevenue() : 450_000_000L;
            
            riskDetails.put("auditedFinancials", List.of(
                    Map.of("year", "FY 2020", "turnover", rev * 0.70, "grossMargin", 19.8, "ebit", 3.1, "netProfit", -1_200_000, "taxPaid", 500_000),
                    Map.of("year", "FY 2021", "turnover", rev * 0.78, "grossMargin", 19.1, "ebit", 2.5, "netProfit", -2_800_000, "taxPaid", 500_000),
                    Map.of("year", "FY 2022", "turnover", rev * 0.85, "grossMargin", 18.5, "ebit", 2.1, "netProfit", -4_200_000, "taxPaid", 500_000),
                    Map.of("year", "FY 2023", "turnover", rev * 0.92, "grossMargin", 16.2, "ebit", 1.8, "netProfit", -5_800_000, "taxPaid", 500_000),
                    Map.of("year", "FY 2024", "turnover", rev * 1.00, "grossMargin", 14.8, "ebit", 1.5, "netProfit", -6_400_000, "taxPaid", 500_000)
            ));

            riskDetails.put("controlledTransactions", List.of(
                    Map.of("id", 1, "type", "INTERNATIONAL", "stream", "Management & Technical Services", "foreignEntity", "Crest Global Holdings Ltd", "jurisdiction", "Mauritius (Low-Tax DTA)", "totalValue", 75_000_000, "method", "TNMM", "riskFlag", "CRITICAL"),
                    Map.of("id", 2, "type", "INTERNATIONAL", "stream", "Raw Material Imports Purchasing", "foreignEntity", "Crest Asian Mfg Pte", "jurisdiction", "Singapore (Offshore Hub)", "totalValue", 320_000_000, "method", "CUP", "riskFlag", "MEDIUM"),
                    Map.of("id", 3, "type", "INTERNATIONAL", "stream", "Trademark & Brand Royalties", "foreignEntity", "Crest IP Capital Corp", "jurisdiction", "Switzerland (IP Box)", "totalValue", 42_500_000, "method", "CUT", "riskFlag", "HIGH"),
                    Map.of("id", 4, "type", "INTERNATIONAL", "stream", "Intercompany Financing & Interest", "foreignEntity", "Crest Finance Treasury BV", "jurisdiction", "Netherlands (Treasury)", "totalValue", 138_482_000, "method", "CUP", "riskFlag", "MONITORED"),
                    Map.of("id", 5, "type", "DOMESTIC", "stream", "Intercompany Finished Fabric Sales", "foreignEntity", "Crest Apparel Hawassa SEZ Ltd", "jurisdiction", "Ethiopia (Hawassa Industrial Park - 10 Yr Holiday)", "totalValue", 185_000_000, "method", "TNMM", "riskFlag", "CRITICAL"),
                    Map.of("id", 6, "type", "DOMESTIC", "stream", "Domestic Equipment & Machinery Lease", "foreignEntity", "Crest Heavy Equipment Rental SC", "jurisdiction", "Ethiopia (Addis Ababa Affiliate)", "totalValue", 28_500_000, "method", "CUP", "riskFlag", "MEDIUM")
            ));

            riskDetails.put("riskIndicators", List.of(
                    Map.of("id", 1, "title", "Operating Margin Below Benchmark", "category", "Financial Ratios", "weight", 15, "status", "CRITICAL", "detail", "Taxpayer EBIT 1.5% vs Industry Median 6.4%"),
                    Map.of("id", 2, "title", "Continuous Net Losses Despite Growing Revenue", "category", "Profitability", "weight", 15, "status", "CRITICAL", "detail", "Cumulative losses of ETB 20.4M during steady top-line growth"),
                    Map.of("id", 3, "title", "High Management Fee to Revenue Ratio", "category", "Service Fees", "weight", 15, "status", "CRITICAL", "detail", "Fees equal 4.34% of gross turnover paid to low-tax entity"),
                    Map.of("id", 4, "title", "Related Party Payments to Low-Tax Jurisdiction", "category", "Jurisdiction Risk", "weight", 15, "status", "HIGH", "detail", "Holding entity in Mauritius with 5% effective treaty rate"),
                    Map.of("id", 5, "title", "Thin Capitalization (Debt/Equity > 2:1)", "category", "Financing", "weight", 10, "status", "HIGH", "detail", "Related party debt ratio 3.2:1 exceeds statutory ceiling")
            ));

            TpRiskAssessmentEntity risk = TpRiskAssessmentEntity.builder()
                    .auditCase(auditCase)
                    .riskLevel("HIGH")
                    .assessmentStatus("COMPLETED")
                    .riskDetails(objectMapper.valueToTree(riskDetails))
                    .comments("High risk cross-border profit erosion detected via Schedule 5 screening.")
                    .createdBy(actorId != null ? actorId : "SYSTEM")
                    .build();

            riskAssessmentRepository.save(risk);
            auditCase.setTpRiskAssessment(risk);
            dirty = true;
        }

        // 2. Initialize Working Hypothesis if empty
        if (auditCase.getTpWorkingHypothesis() == null) {
            Map<String, Object> calcDetails = Map.of(
                    "baseTurnover", 575_000_000L,
                    "reportedEbitMargin", 1.5,
                    "targetEbitMedian", 6.4,
                    "estimatedProfitShortfall", 28_175_000L,
                    "assumedTaxRate", 0.30,
                    "estimatedTaxAtRisk", 8_452_500L
            );

            TpWorkingHypothesisEntity hyp = TpWorkingHypothesisEntity.builder()
                    .auditCase(auditCase)
                    .hypothesisDescription("Taxpayer is artificially depressing operating profits through excessive offshore management fees and understated intercompany finished goods prices.")
                    .identifiedIssue("Cross-border management fees to Mauritius and domestic transfer to tax-exempt Hawassa SEZ affiliate.")
                    .economicRationale("Transfer pricing adjustments to bring operating margin to 6.4% industry median under TNMM.")
                    .revenueAtRisk(new BigDecimal("8452500.00"))
                    .currency("ETB")
                    .status("APPROVED")
                    .calculationDetails(objectMapper.valueToTree(calcDetails))
                    .createdBy(actorId != null ? actorId : "SYSTEM")
                    .build();

            workingHypothesisRepository.save(hyp);
            auditCase.setTpWorkingHypothesis(hyp);
            dirty = true;
        }

        // 3. Initialize Audit Plan if empty (BUC-TA-013)
        if (auditCase.getTpAuditPlan() == null) {
            Map<String, Object> materiality = Map.of(
                    "materialityThreshold", 5_000_000L,
                    "planningMaterialityPct", 1.0,
                    "tolerableMisstatement", 3_500_000L,
                    "summaryOfUnadjustedDifferences", 250_000L,
                    "qualitativeFactors", "Transactions with offshore low-tax entities and SEZ affiliates are deemed material regardless of monetary size."
            );

            Map<String, Object> industry = Map.of(
                    "sectorCode", "MANUFACTURING_TEXTILE",
                    "sectorName", "Textile & Garment Manufacturing",
                    "businessModel", "Contract manufacturing with offshore procurement and brand licensing",
                    "keyRiskAreas", List.of("Raw material markup", "Technical service fee deductibility", "Royalty rates"),
                    "pricingStructures", "Cost-plus with benchmarked markups (6-10%)"
            );

            Map<String, Object> sampling = Map.of(
                    "samplingMethodology", "Stratified Random Sampling with 100% examination of high-value intercompany transactions",
                    "populationSize", 1420,
                    "sampleSize", 85,
                    "criteria", "All transactions > 1M ETB plus random selection from stratum 2 (100k - 1M ETB)"
            );

            Map<String, Object> procedures = Map.of(
                    "procedures", List.of(
                            "Inspect management service agreement and verify proof of actual service rendering (benefit test).",
                            "Match customs import declarations for raw materials with ASYCUDA competitor pricing database.",
                            "Verify interest rates on intercompany debt against CBE commercial prime rate and SOFR benchmarks.",
                            "Perform TNMM benchmark study across comparable independent manufacturers."
                    ),
                    "timelineDays", 90,
                    "allocatedHours", 480
            );

            TpAuditPlanEntity plan = TpAuditPlanEntity.builder()
                    .auditCase(auditCase)
                    .objective("Determine whether related-party cross-border and domestic transactions comply with the arm's-length principle per MoR Transfer Pricing Directive.")
                    .scope("FY 2020 through FY 2024 (5 Taxable Years)")
                    .materialityDetails(objectMapper.valueToTree(materiality))
                    .industryResearch(objectMapper.valueToTree(industry))
                    .samplingMethod(objectMapper.valueToTree(sampling))
                    .plannedProcedures(objectMapper.valueToTree(procedures))
                    .status("APPROVED")
                    .approvedBy("Workneh Kassa (Process Owner)")
                    .approvedAt(OffsetDateTime.now().minusDays(10))
                    .createdBy(actorId != null ? actorId : "SYSTEM")
                    .build();

            auditPlanRepository.save(plan);
            auditCase.setTpAuditPlan(plan);
            dirty = true;
        }

        // 4. Initialize Fieldwork Data if empty (BUC-TA-014)
        if (auditCase.getTpFieldWorkData() == null) {
            Map<String, Object> accountingFindings = Map.of(
                    "accountingSoftware", "SAP S/4HANA Enterprise",
                    "generalLedgerIntegrity", "Verified — chart of accounts matches audited balance sheet",
                    "relatedPartyAccounts", List.of("2110-001 Due to Crest Global", "1120-004 Due from Hawassa SEZ"),
                    "eInvoicingLinked", true,
                    "cashRegisterVerified", true
            );

            Map<String, Object> transactionTrails = Map.of(
                    "totalTransactionsTraced", 85,
                    "fullySupported", 68,
                    "unsupportedOrQuestioned", 17,
                    "questionedAmount", 42_500_000L,
                    "findings", "No evidence of technical reports or timesheets for management fees paid to Mauritius."
            );

            Map<String, Object> factStatement = Map.of(
                    "version", 1,
                    "status", "DRAFT",
                    "datePrepared", LocalDate.now().minusDays(5).toString(),
                    "summaryOfFacts", "Taxpayer engages in management fee payments to Mauritius parent without documentary substantiation of benefit test.",
                    "taxpayerObservations", "Taxpayer claims services were provided remotely via video conference; agreed to provide email logs and deliverables."
            );

            TpFieldWorkDataEntity fieldWork = TpFieldWorkDataEntity.builder()
                    .auditCase(auditCase)
                    .accountingMethods("Accrual accounting under IFRS with automated SAP posting.")
                    .accountingFindings(objectMapper.valueToTree(accountingFindings))
                    .transactionTrails(objectMapper.valueToTree(transactionTrails))
                    .sampleSelections(objectMapper.valueToTree(Map.of("stratifiedSampleCount", 85, "testedAmount", 285_000_000L)))
                    .factStatement(objectMapper.valueToTree(factStatement))
                    .factStatementStatus("DRAFT")
                    .factStatementVersion(1)
                    .build();

            fieldWorkDataRepository.save(fieldWork);
            auditCase.setTpFieldWorkData(fieldWork);
            dirty = true;
        }

        // 5. Initialize Analysis Data if empty (BUC-TA-015)
        if (auditCase.getTpAnalysisData() == null) {
            Map<String, Object> ratioAnalyses = Map.of(
                    "grossMargin", Map.of("taxpayer", 14.8, "industryBenchmark", 22.5, "variance", -7.7),
                    "operatingMargin", Map.of("taxpayer", 1.5, "industryBenchmark", 6.4, "variance", -4.9),
                    "berryRatio", Map.of("taxpayer", 1.08, "industryBenchmark", 1.35, "variance", -0.27),
                    "returnOnTotalCosts", Map.of("taxpayer", 1.8, "industryBenchmark", 7.2, "variance", -5.4)
            );

            Map<String, Object> methodSelection = Map.of(
                    "selectedMethod", "TNMM",
                    "profitLevelIndicator", "Operating Margin (EBIT / Operating Revenue)",
                    "justification", "Due to unique product differentiation, TNMM using operating margin is the most appropriate and reliable method per OECD Guidelines.",
                    "rejectedMethods", Map.of(
                            "CUP", "Reliable internal or external uncontrolled comparable transactions not available for custom fabric.",
                            "ResalePrice", "Taxpayer incorporates imported materials into local manufacturing with substantial value addition.",
                            "CostPlus", "Inconsistent accounting cost allocations across comparable regional producers."
                    )
            );

            Map<String, Object> benchmark = Map.of(
                    "databaseUsed", "Bureau van Dijk Orbis / MoR Internal Sector Study",
                    "searchStrategy", "Sub-Saharan Africa & Middle East Textile Manufacturers (NACE 13)",
                    "comparableCompaniesCount", 14,
                    "interquartileRange", Map.of(
                            "min", 3.2,
                            "lowerQuartileQ1", 4.8,
                            "median", 6.4,
                            "upperQuartileQ3", 8.2,
                            "max", 11.5
                    )
            );

            TpAnalysisDataEntity analysis = TpAnalysisDataEntity.builder()
                    .auditCase(auditCase)
                    .ratioAnalyses(objectMapper.valueToTree(ratioAnalyses))
                    .benchmarkComparisons(objectMapper.valueToTree(benchmark))
                    .methodSelection(objectMapper.valueToTree(methodSelection))
                    .selectedTpMethod("TNMM")
                    .armsLengthRangeMin(new BigDecimal("4.8000"))
                    .armsLengthRangeMax(new BigDecimal("8.2000"))
                    .taxpayerActualResult(new BigDecimal("1.5000"))
                    .varianceAmount(new BigDecimal("28175000.00")) // 575M * (6.4% - 1.5%)
                    .variancePercentage(new BigDecimal("4.9000"))
                    .build();

            analysisDataRepository.save(analysis);
            auditCase.setTpAnalysisData(analysis);
            dirty = true;
        }

        // Set current phase if not set
        if (auditCase.getTpCurrentPhase() == null || auditCase.getTpCurrentPhase().isBlank()) {
            auditCase.setTpCurrentPhase("PLANNING");
            dirty = true;
        }

        if (dirty) {
            caseRepository.save(auditCase);
        }

        return auditCase;
    }
}
