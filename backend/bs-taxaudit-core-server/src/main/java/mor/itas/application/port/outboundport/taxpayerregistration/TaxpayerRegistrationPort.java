package mor.itas.application.port.outboundport.taxpayerregistration;

public interface TaxpayerRegistrationPort {
    boolean verifyTaxpayerStatus(String tin);
}
