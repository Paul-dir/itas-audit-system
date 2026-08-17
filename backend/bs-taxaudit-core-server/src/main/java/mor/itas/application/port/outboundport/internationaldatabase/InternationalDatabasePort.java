package mor.itas.application.port.outboundport.internationaldatabase;

public interface InternationalDatabasePort {
    boolean checkCrossBorderTransactions(String tin);
}
