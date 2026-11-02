package mor.itas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TaxAuditApplication {
    public static void main(String[] args) {
        SpringApplication.run(TaxAuditApplication.class, args);
    }
}
