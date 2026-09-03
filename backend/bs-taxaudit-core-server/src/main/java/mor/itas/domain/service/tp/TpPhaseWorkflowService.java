package mor.itas.domain.service.tp;

import lombok.extern.slf4j.Slf4j;
import mor.itas.domain.event.tp.TpPhaseTransitionEvent;

import mor.itas.domain.model.tp.TpAuditCase;
import mor.itas.domain.valueobject.tp.TpAuditPhase;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
public class TpPhaseWorkflowService {

    /**
     * Executes a phase transition on a TP Audit Case domain aggregate.
     */
    public TpPhaseTransitionEvent executePhaseTransition(TpAuditCase tpCase, TpAuditPhase targetPhase, String userId, String userRole) {
        TpAuditPhase currentPhase = tpCase.getCurrentPhase();
        log.info("Transitioning TP Case {} from phase {} to {}", tpCase.getCaseId(), currentPhase, targetPhase);

        tpCase.transitionToPhase(targetPhase, userId, userRole);

        return TpPhaseTransitionEvent.builder()
                .caseId(tpCase.getCaseId())
                .previousPhase(currentPhase)
                .newPhase(targetPhase)
                .triggeredById(userId)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
