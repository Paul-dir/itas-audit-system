package mor.itas.application.usecase.tp;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.tp.TpAuditReportEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import mor.itas.persistence.jpa.repository.tp.TpAuditReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service @RequiredArgsConstructor @Slf4j
public class TpAuditReportUseCase {

    private final ApAuditCaseRepository auditCaseRepository;
    private final TpAuditReportRepository reportRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public UUID draftReport(UUID caseId, String executiveSummary, String auditBackground,
            String scope, String proceduresPerformed, String findingsAndConclusions,
            JsonNode issuesAnalyzed, String complianceAssessment, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        int version = reportRepository.findByAuditCaseIdOrderByVersionDesc(caseId).size() + 1;
        TpAuditReportEntity r = TpAuditReportEntity.builder()
                .auditCase(c).version(version).status("DRAFT")
                .executiveSummary(executiveSummary).auditBackground(auditBackground)
                .scope(scope).proceduresPerformed(proceduresPerformed)
                .findingsAndConclusions(findingsAndConclusions)
                .issuesAnalyzed(issuesAnalyzed).complianceAssessment(complianceAssessment)
                .authorId(userId).build();
        TpAuditReportEntity saved = reportRepository.save(r);
        c.setTpCurrentPhase("REPORT"); auditCaseRepository.save(c);
        return saved.getId();
    }

    @Transactional
    public void submitForTeamLeaderReview(UUID reportId, String userId) {
        TpAuditReportEntity r = getReport(reportId);
        checkStatus(r, "DRAFT");
        r.setStatus("SUBMITTED_FOR_TEAM_LEADER_REVIEW");
        reportRepository.save(r);
    }

    @Transactional
    public void recordTeamLeaderReview(UUID reportId, String decision, String comments, String reviewerId) {
        TpAuditReportEntity r = getReport(reportId);
        checkStatus(r, "SUBMITTED_FOR_TEAM_LEADER_REVIEW");
        r.setTeamLeaderReview(buildReview(reviewerId, "TEAM_LEADER", decision, comments, r.getVersion()));
        r.setStatus("APPROVE".equalsIgnoreCase(decision) ? "TEAM_LEADER_APPROVED" : "DRAFT");
        reportRepository.save(r);
    }

    @Transactional
    public void submitForProcessOwnerReview(UUID reportId, String userId) {
        TpAuditReportEntity r = getReport(reportId);
        checkStatus(r, "TEAM_LEADER_APPROVED");
        r.setStatus("SUBMITTED_FOR_PROCESS_OWNER_REVIEW");
        reportRepository.save(r);
    }

    @Transactional
    public void recordProcessOwnerReview(UUID reportId, String decision, String comments, String reviewerId) {
        TpAuditReportEntity r = getReport(reportId);
        checkStatus(r, "SUBMITTED_FOR_PROCESS_OWNER_REVIEW");
        r.setProcessOwnerReview(buildReview(reviewerId, "PROCESS_OWNER", decision, comments, r.getVersion()));
        r.setStatus("APPROVE".equalsIgnoreCase(decision) ? "PROCESS_OWNER_APPROVED" : "TEAM_LEADER_APPROVED");
        reportRepository.save(r);
    }

    @Transactional
    public void submitForFinalApproval(UUID reportId, String userId) {
        TpAuditReportEntity r = getReport(reportId);
        checkStatus(r, "PROCESS_OWNER_APPROVED");
        r.setStatus("SUBMITTED_FOR_FINAL_APPROVAL");
        reportRepository.save(r);
    }

    @Transactional
    public void recordFinalApproval(UUID reportId, String decision, String comments, String reviewerId) {
        TpAuditReportEntity r = getReport(reportId);
        checkStatus(r, "SUBMITTED_FOR_FINAL_APPROVAL");
        r.setAuthorizedOfficialReview(buildReview(reviewerId, "AUTHORIZED_OFFICIAL", decision, comments, r.getVersion()));
        if ("APPROVE".equalsIgnoreCase(decision)) {
            r.setStatus("FULLY_APPROVED");
            ApAuditCaseEntity c = r.getAuditCase();
            c.setTpCurrentPhase("NOTICE");
            auditCaseRepository.save(c);
        } else {
            r.setStatus("PROCESS_OWNER_APPROVED");
        }
        reportRepository.save(r);
    }

    @Transactional
    public void recordTaxpayerResponse(UUID reportId, String action, String detail, String userId) {
        TpAuditReportEntity r = getReport(reportId);
        ObjectNode node = objectMapper.createObjectNode();
        node.put("action", action); node.put("detail", detail);
        r.setTaxpayerResponse(node);
        if ("SIGN".equalsIgnoreCase(action)) r.setStatus("TAXPAYER_SIGNED");
        else if ("OBJECT".equalsIgnoreCase(action)) r.setStatus("TAXPAYER_OBJECTED");
        else r.setStatus("NO_RESPONSE_REFERRED");
        reportRepository.save(r);
    }

    private JsonNode buildReview(String reviewerId, String role, String decision, String comments, int version) {
        ObjectNode n = objectMapper.createObjectNode();
        n.put("reviewerId", reviewerId); n.put("role", role);
        n.put("decision", decision); n.put("comments", comments);
        n.put("reportVersionReviewed", version);
        n.put("reviewedAt", OffsetDateTime.now().toString());
        return n;
    }

    private void checkStatus(TpAuditReportEntity r, String expected) {
        if (!expected.equals(r.getStatus()))
            throw new IllegalStateException("Expected status " + expected + " but was " + r.getStatus());
    }

    private TpAuditReportEntity getReport(UUID id) {
        return reportRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Report not found: " + id));
    }

    private ApAuditCaseEntity getCase(UUID id) {
        return auditCaseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Case not found: " + id));
    }
}
