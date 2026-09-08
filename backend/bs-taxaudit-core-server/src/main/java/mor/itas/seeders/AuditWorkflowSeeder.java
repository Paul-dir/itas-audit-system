package mor.itas.seeders;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * AuditWorkflowSeeder — DISABLED
 * Mock cases have been removed. AP audit cases are now created dynamically
 * when the Committee Chairperson transfers an approved case to execution
 * via TransferToExecutionUseCase.
 */
@Component
@Profile("mock")
@Slf4j
public class AuditWorkflowSeeder implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        log.info("╔══════════════════════════════════════════════════════════╗");
        log.info("║  AuditWorkflowSeeder DISABLED — cases come from         ║");
        log.info("║  Committee → Transfer to Execution flow                 ║");
        log.info("╚══════════════════════════════════════════════════════════╝");
    }
}
