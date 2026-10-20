package mor.itas.persistence.jpa.repository.tp;

import mor.itas.persistence.jpa.entity.tp.TpAuditNoticeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TpAuditNoticeRepository extends JpaRepository<TpAuditNoticeEntity, UUID> {
    Optional<TpAuditNoticeEntity> findByAuditCaseId(UUID auditCaseId);
    Optional<TpAuditNoticeEntity> findByNoticeReferenceNumber(String noticeReferenceNumber);
}
