package mor.itas.seeders.generators;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Committee Session Data Generator
 */
@Component
@Profile("mock")
@Slf4j
public class CommitteeSessionGenerator {

    private final Random random = new Random(33333);

    public SessionData generateSessions(List<?> cases) {
        // Stub implementation
        SessionData data = new SessionData();
        return data;
    }

    @Data
    public static class SessionData {
        public List<?> sessions = new ArrayList<>();
        public List<?> attendees = new ArrayList<>();
    }
}
