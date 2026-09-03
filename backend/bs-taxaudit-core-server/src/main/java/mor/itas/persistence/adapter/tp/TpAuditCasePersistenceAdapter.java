package mor.itas.persistence.adapter.tp;

import lombok.RequiredArgsConstructor;
import mor.itas.application.port.outboundport.repositoryport.tp.TpAuditCaseRepositoryPort;
import mor.itas.domain.model.tp.TpAuditCase;
import mor.itas.persistence.jpa.entity.ap.ApAuditCaseEntity;
import mor.itas.persistence.jpa.repository.ap.ApAuditCaseRepository;
import mor.itas.persistence.mapper.tp.TpAuditCaseMapper;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TpAuditCasePersistenceAdapter implements TpAuditCaseRepositoryPort {

    private final ApAuditCaseRepository jpaRepository;
    private final TpAuditCaseMapper mapper;

    @Override
    public TpAuditCase save(TpAuditCase tpAuditCase) {
        ApAuditCaseEntity entity = mapper.toEntity(tpAuditCase);
        ApAuditCaseEntity saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<TpAuditCase> findById(UUID id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }
}
