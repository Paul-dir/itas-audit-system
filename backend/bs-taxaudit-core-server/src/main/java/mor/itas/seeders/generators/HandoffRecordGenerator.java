package mor.itas.seeders.generators;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Handoff Record Data Generator
 */
@Component
@Profile("mock")
@Slf4j
public class HandoffRecordGenerator {

    private final Random random = new Random(22222);

    public HandoffRecordData generateHandoffRecords(List<?> cases) {
        // Stub implementation
        HandoffRecordData data = new HandoffRecordData();
        return data;
    }

    @Data
    public static class HandoffRecordData {
        public List<?> records = new ArrayList<>();
        public List<?> teamMembers = new ArrayList<>();
    }
}
