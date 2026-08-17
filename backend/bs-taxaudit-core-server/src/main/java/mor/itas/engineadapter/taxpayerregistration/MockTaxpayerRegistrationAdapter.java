package mor.itas.engineadapter.taxpayerregistration;

import mor.itas.application.port.outboundport.taxpayerregistration.TaxpayerRegistrationPort;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("mock")
public class MockTaxpayerRegistrationAdapter implements TaxpayerRegistrationPort {

    @Override
    public boolean verifyTaxpayerStatus(String tin) {
        return true; // Mock always returns true
    }
}
