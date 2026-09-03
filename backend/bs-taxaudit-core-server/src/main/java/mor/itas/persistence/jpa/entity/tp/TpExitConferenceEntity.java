package mor.itas.persistence.jpa.entity.tp;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Records the exit conference (final meeting) held with the taxpayer.
 *
 * BUSINESS RULE (enforced in service layer): The venue MUST be the MoR tax
 * office. Auditors are PROHIBITED from holding exit conferences at the taxpayer's
 * premises. This rule is enforced via validation in TpExitConferenceUseCase.
 *
 * Scheduling workflow:
 *   PROPOSED → NOTICE_SENT → TAXPAYER_CONFIRMED | TAXPAYER_RESCHEDULE_REQUESTED
 *   → CONFIRMED | RESCHEDULED → HELD
 *
 * Statutory basis: FR-04.7-04 through FR-04.7-15; TP requirement:
 * "review with taxpayer in exit conference, amend report"
 */
@Entity
@Table(name = "tp_exit_conference")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TpExitConferenceEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_case_id", nullable = false, unique = true)
    private ApAuditCaseEntity auditCase;

    @Column(name = "audit_case_id", insertable = false, updatable = false)
    private UUID auditCaseId;

    @Column(name = "conference_reference", length = 50, unique = true, nullable = false)
    private String conferenceReference;            // e.g. EXC-TP-2026-0001

    @Column(name = "proposed_date")
    private OffsetDateTime proposedDate;

    @Column(name = "confirmed_date")
    private OffsetDateTime confirmedDate;

    @Column(name = "venue", length = 512, nullable = false)
    @Builder.Default
    private String venue = "MoR Tax Office — TP Interview Room";  // MUST be tax office

    @Column(name = "agenda_template", length = 50)
    @Builder.Default
    private String agendaTemplate = "STD_TP_EXIT";

    @Column(name = "taxpayer_contact", length = 255)
    private String taxpayerContact;

    @Column(name = "scheduling_status", length = 50, nullable = false)
    @Builder.Default
    private String schedulingStatus = "PROPOSED";

    @Column(name = "taxpayer_rescheduled_to")
    private OffsetDateTime taxpayerRescheduledTo;

    @Column(name = "reschedule_reason", columnDefinition = "TEXT")
    private String rescheduleReason;

    @Column(name = "reschedule_approved")
    private Boolean rescheduleApproved;

    // -- Notification tracking --
    @Column(name = "notification_sent")
    @Builder.Default
    private Boolean notificationSent = false;

    @Column(name = "notification_sent_at")
    private OffsetDateTime notificationSentAt;

    @Column(name = "notification_channel", length = 50)
    private String notificationChannel;            // EMAIL | SMS | POSTAL | SYSTEM_ALERT

    // -- Meeting record --
    @Column(name = "meeting_held_at")
    private OffsetDateTime meetingHeldAt;

    @Column(name = "auditor_notes", columnDefinition = "TEXT")
    private String auditorNotes;

    @Column(name = "taxpayer_observations", columnDefinition = "TEXT")
    private String taxpayerObservations;

    @Column(name = "agreed_adjustments", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode agreedAdjustments;

    @Column(name = "audio_record_ref", length = 512)
    private String audioRecordRef;

    // -- Signoff --
    @Column(name = "taxpayer_signed")
    @Builder.Default
    private Boolean taxpayerSigned = false;

    @Column(name = "taxpayer_signed_at")
    private OffsetDateTime taxpayerSignedAt;

    @Column(name = "taxpayer_signature_ref", length = 512)
    private String taxpayerSignatureRef;

    @Column(name = "created_by", length = 255, nullable = false)
    private String createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
