package mor.itas.application.port.outboundport.usermanagement;

public interface UserManagementPort {
    String getUserRole(String userId);
    String getUserTaxCenter(String userId);
}
