package mor.itas.seeders.generators;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Audit Trail Data Generator
 */
@Component
@Profile("mock")
@Slf4j
public class AuditTrailGenerator {

    private final Random random = new Random(44444);

    public List<?> generateAuditTrail(List<?> cases, List<?> votes, List<?> notes) {
        // Stub implementation
        return new ArrayList<>();
    }
}
