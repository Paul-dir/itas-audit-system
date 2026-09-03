package mor.itas.persistence.jpa.entity.tp;

import jakarta.persistence.*;
import lombok.*;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Represents a single Information & Document Request (IDR) issued during TP audit.
 *
 * Each IDR goes through a strict approval workflow:
 *   DRAFT → AWAITING_APPROVAL (submitted by auditor)
 *   → APPROVED (process owner approves) → ISSUED (sent to taxpayer)
 *   → RESPONSE_RECEIVED (taxpayer submits docs) → CLOSED
 *   OR → OVERDUE (deadline passed, escalation triggered)
 *
 * Multiple IDRs can exist per case. A case may have interview requests,
 * document requests, plant-tour requests — each tracked separately.
 *
 * Statutory basis: "enable auditor to issue additional information and document
 * requests for factual development including interviews, plant tours, site visits"
 */
@Entity
@Table(name = "tp_information_request_log")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TpInformationRequestLogEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_case_id", nullable = false)
    private ApAuditCaseEntity auditCase;

    @Column(name = "audit_case_id", insertable = false, updatable = false)
    private UUID auditCaseId;

    @Column(name = "request_reference", length = 50, unique = true, nullable = false)
    private String requestReference;               // e.g. IDR-TP-2026-0001

    @Column(name = "request_type", length = 50, nullable = false)
    private String requestType;                    // DOCUMENT | INTERVIEW | PLANT_TOUR | SITE_VISIT | GENERAL

    @Column(name = "subject", length = 512, nullable = false)
    private String subject;

    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "deadline_date")
    private LocalDate deadlineDate;

    @Column(name = "status", length = 50, nullable = false)
    @Builder.Default
    private String status = "DRAFT";
    // DRAFT | AWAITING_APPROVAL | APPROVED | ISSUED | RESPONSE_RECEIVED | CLOSED | OVERDUE

    // -- Approval fields --
    @Column(name = "submitted_by", length = 255, nullable = false)
    private String submittedBy;

    @Column(name = "submitted_at")
    private OffsetDateTime submittedAt;

    @Column(name = "approved_by", length = 255)
    private String approvedBy;

    @Column(name = "approved_at")
    private OffsetDateTime approvedAt;

    @Column(name = "approval_comments", columnDefinition = "TEXT")
    private String approvalComments;

    // -- Taxpayer response fields --
    @Column(name = "taxpayer_response", columnDefinition = "TEXT")
    private String taxpayerResponse;

    @Column(name = "evidence_uploaded")
    @Builder.Default
    private Boolean evidenceUploaded = false;

    @Column(name = "response_received_at")
    private OffsetDateTime responseReceivedAt;

    // -- Escalation --
    @Column(name = "is_overdue")
    @Builder.Default
    private Boolean isOverdue = false;

    @Column(name = "overdue_flagged_at")
    private OffsetDateTime overdueFlaggedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
