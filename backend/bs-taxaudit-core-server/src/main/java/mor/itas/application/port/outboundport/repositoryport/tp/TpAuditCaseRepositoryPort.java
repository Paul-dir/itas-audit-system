package mor.itas.application.port.outboundport.repositoryport.tp;

import mor.itas.domain.model.tp.TpAuditCase;
import java.util.Optional;
import java.util.UUID;

public interface TpAuditCaseRepositoryPort {
    TpAuditCase save(TpAuditCase tpAuditCase);
    Optional<TpAuditCase> findById(UUID id);
}
