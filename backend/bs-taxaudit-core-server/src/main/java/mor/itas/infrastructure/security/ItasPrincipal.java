package mor.itas.infrastructure.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

/**
 * Extended UserDetails that carries ITAS-specific fields (userId, fullName, orgUnitId)
 * so controllers can resolve the current actor without a second DB lookup.
 */
public class ItasPrincipal extends User {

    private final String userId;
    private final String fullName;
    private final String orgUnitId;

    public ItasPrincipal(String userId, String username, String passwordHash,
                         String fullName, String orgUnitId,
                         Collection<? extends GrantedAuthority> authorities) {
        super(username, passwordHash, authorities);
        this.userId = userId;
        this.fullName = fullName;
        this.orgUnitId = orgUnitId;
    }

    public String getUserId() { return userId; }
    public String getFullName() { return fullName; }
    public String getOrgUnitId() { return orgUnitId; }

    /** Returns true if this principal has a given permission code (e.g. "REPORT_APPROVE"). */
    public boolean hasPermission(String permissionCode) {
        return getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("PERM_" + permissionCode));
    }

    /** Returns true if this principal holds a given role code (e.g. "AUDITOR"). */
    public boolean hasRole(String roleCode) {
        return getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_" + roleCode));
    }
}
