package mor.itas.application.port.outboundport.usermanagement;

import java.util.List;
import java.util.Map;

public interface UserManagementPort {
    String getUserRole(String userId);
    String getUserTaxCenter(String userId);
    
    /** Get team leaders for a specific tax center and audit type */
    List<Map<String, Object>> getTeamLeaders(String taxCenterCode, String auditType);
    
    /** Get committee members for a specific audit type (JA, TP) */
    List<Map<String, Object>> getCommitteeMembers(String auditType);
    
    /** Get user by ID */
    Map<String, Object> getUserById(String userId);
}
