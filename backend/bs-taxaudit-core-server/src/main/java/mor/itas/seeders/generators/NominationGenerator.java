package mor.itas.seeders.generators;

import mor.itas.persistence.jpa.entity.ap.AuditorNominationEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.*;

/**
 * Auditor Nomination Data Generator
 */
@Component
@Profile("mock")
@Slf4j
public class NominationGenerator {

    private final Random random = new Random(11111);

    public List<AuditorNominationEntity> generateNominations(List<?> cases) {
        // Stub implementation - minimal data generation
        List<AuditorNominationEntity> nominations = new ArrayList<>();
        return nominations;
    }
}
