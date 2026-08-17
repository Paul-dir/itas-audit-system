package mor.itas.engineadapter.internationaldatabase;

import mor.itas.application.port.outboundport.internationaldatabase.InternationalDatabasePort;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("mock")
public class MockInternationalDatabaseAdapter implements InternationalDatabasePort {

    @Override
    public boolean checkCrossBorderTransactions(String tin) {
        return false; // Mock default response
    }
}
