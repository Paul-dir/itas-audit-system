package mor.itas.application.usecase.tp;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.entity.tp.TpPlanningMeetingEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TpPlanningMeetingUseCase {

    private final ApAuditCaseRepository auditCaseRepository;

    @Transactional
    public void recordMeetingDetails(UUID caseId, OffsetDateTime scheduledDate,
                                     JsonNode participants, String agenda, String currentUserId) {
        log.info("Recording TP Planning Meeting for case: {}", caseId);
        ApAuditCaseEntity auditCase = getCase(caseId);
        TpPlanningMeetingEntity meeting = auditCase.getTpPlanningMeeting();
        if (meeting == null) {
            meeting = TpPlanningMeetingEntity.builder()
                    .auditCase(auditCase).recordedBy(currentUserId).build();
        }
        meeting.setScheduledDate(scheduledDate);
        meeting.setParticipants(participants);
        meeting.setAgenda(agenda);
        auditCase.setTpPlanningMeeting(meeting);
        auditCaseRepository.save(auditCase);
    }

    @Transactional
    public void recordMeetingDecision(UUID caseId, String decision, String discussionNotes, String currentUserId) {
        log.info("Recording Planning Committee Decision [{}] for case: {}", decision, caseId);
        ApAuditCaseEntity auditCase = getCase(caseId);
        TpPlanningMeetingEntity meeting = auditCase.getTpPlanningMeeting();
        if (meeting == null) {
            throw new IllegalStateException("Planning meeting record not found for case: " + caseId);
        }
        meeting.setDecision(decision);
        meeting.setDiscussionNotes(discussionNotes);
        meeting.setDecisionTimestamp(OffsetDateTime.now());

        if ("APPROVED".equals(decision)) {
            auditCase.setTpCurrentPhase("FIELD_WORK");
        } else if ("RETURN_FOR_REVISION".equals(decision)) {
            auditCase.setTpCurrentPhase("PLANNING");
        }
        auditCase.setTpPlanningMeeting(meeting);
        auditCaseRepository.save(auditCase);
    }

    private ApAuditCaseEntity getCase(UUID caseId) {
        return auditCaseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Case not found: " + caseId));
    }
}
