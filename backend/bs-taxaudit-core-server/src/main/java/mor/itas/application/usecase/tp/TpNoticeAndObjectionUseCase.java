package mor.itas.application.usecase.tp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.tp.TpAuditNoticeEntity;
import mor.itas.persistence.jpa.entity.tp.TpObjectionEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import mor.itas.persistence.jpa.repository.tp.TpAuditNoticeRepository;
import mor.itas.persistence.jpa.repository.tp.TpObjectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Service @RequiredArgsConstructor @Slf4j
public class TpNoticeAndObjectionUseCase {

    private final ApAuditCaseRepository auditCaseRepository;
    private final TpAuditNoticeRepository noticeRepository;
    private final TpObjectionRepository objectionRepository;

    @Transactional
    public UUID generateNotice(UUID caseId, String taxpayerName, String tin, String auditPeriod,
            String issuesSummary, String proposedAdjustmentsSummary,
            BigDecimal assessedPrincipalTax, BigDecimal penalties, BigDecimal interest,
            LocalDate issueDate, LocalDate responseDeadline, String deliveryMethod, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        String ref = "TP-" + LocalDate.now().getYear() + "-" + String.format("%05d", (int)(Math.random() * 99999));
        TpAuditNoticeEntity notice = TpAuditNoticeEntity.builder()
                .auditCase(c).noticeReferenceNumber(ref).status("DRAFT")
                .taxpayerName(taxpayerName).tin(tin).auditPeriod(auditPeriod)
                .issuesSummary(issuesSummary).proposedAdjustmentsSummary(proposedAdjustmentsSummary)
                .assessedPrincipalTax(assessedPrincipalTax).penalties(penalties).interest(interest)
                .totalAssessmentAmount(assessedPrincipalTax.add(penalties).add(interest))
                .issueDate(issueDate).responseDeadline(responseDeadline).deliveryMethod(deliveryMethod)
                .build();
        TpAuditNoticeEntity saved = noticeRepository.save(notice);
        c.setTpAuditNotice(saved); c.setTpCurrentPhase("NOTICE");
        auditCaseRepository.save(c);
        return saved.getId();
    }

    @Transactional
    public void issueNotice(UUID noticeId, String deliveryStatus, String userId) {
        TpAuditNoticeEntity n = getNotice(noticeId);
        n.setStatus("ISSUED"); n.setDeliveryStatus(deliveryStatus);
        n.setDeliveryTimestamp(OffsetDateTime.now());
        noticeRepository.save(n);
        ApAuditCaseEntity c = n.getAuditCase();
        c.setTpCurrentPhase("ASSESSMENT"); auditCaseRepository.save(c);
    }

    @Transactional
    public void markNoticeReturned(UUID noticeId, String reason, String actionPlan, String userId) {
        TpAuditNoticeEntity n = getNotice(noticeId);
        n.setStatus("RETURNED_UNDELIVERED");
        n.setReturnedReason(reason); n.setActionPlanDetails(actionPlan);
        noticeRepository.save(n);
    }

    @Transactional
    public void acknowledgeNotice(UUID noticeId, String userId) {
        TpAuditNoticeEntity n = getNotice(noticeId);
        n.setStatus("ACKNOWLEDGED"); n.setDeliveryStatus("ACKNOWLEDGED");
        noticeRepository.save(n);
        ApAuditCaseEntity c = n.getAuditCase();
        c.setTpCurrentPhase("TAXPAYER_RESPONSE"); auditCaseRepository.save(c);
    }

    @Transactional
    public UUID submitObjection(UUID caseId, UUID noticeId, String taxpayerId,
            String noticeProvision, String factualExplanation, String legalArguments,
            String disputedSections, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        TpObjectionEntity obj = TpObjectionEntity.builder()
                .auditCase(c).noticeId(noticeId).taxpayerId(taxpayerId)
                .objectionDate(OffsetDateTime.now()).status("SUBMITTED")
                .noticeProvisionReferenced(noticeProvision)
                .factualExplanation(factualExplanation).legalArguments(legalArguments)
                .disputedTpAnalysisSections(disputedSections).build();
        TpObjectionEntity saved = objectionRepository.save(obj);
        c.setTpCurrentPhase("REVIEW_OR_INVESTIGATION"); auditCaseRepository.save(c);
        return saved.getId();
    }

    @Transactional
    public void reviewObjection(UUID objectionId, String reviewResult,
            BigDecimal adjustedAmount, String comments, String reviewerId) {
        TpObjectionEntity obj = getObjection(objectionId);
        obj.setReviewerId(reviewerId); obj.setReviewedAt(OffsetDateTime.now());
        obj.setReviewResult(reviewResult); obj.setAdjustedAssessmentAmount(adjustedAmount);
        obj.setReviewComments(comments); obj.setStatus("RESOLVED");
        objectionRepository.save(obj);
        ApAuditCaseEntity c = obj.getAuditCase();
        c.setTpCurrentPhase("COMPLETION"); auditCaseRepository.save(c);
    }

    @Transactional
    public void closeCase(UUID caseId, String userId) {
        ApAuditCaseEntity c = getCase(caseId);
        c.setTpCurrentPhase("CLOSED_SUCCESSFULLY");
        c.setStatus("COMPLETED");
        c.setCompletedAt(OffsetDateTime.now());
        auditCaseRepository.save(c);
    }

    private ApAuditCaseEntity getCase(UUID id) {
        return auditCaseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Case not found: " + id));
    }

    private TpAuditNoticeEntity getNotice(UUID id) {
        return noticeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Notice not found: " + id));
    }

    private TpObjectionEntity getObjection(UUID id) {
        return objectionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Objection not found: " + id));
    }
}
