package mor.itas.persistence.jpa.repository.tp;

import mor.itas.persistence.jpa.entity.tp.TpCompetitorPriceUploadEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface TpCompetitorPriceUploadRepository extends JpaRepository<TpCompetitorPriceUploadEntity, UUID> {
    List<TpCompetitorPriceUploadEntity> findByAuditCaseIdOrderByPriceDateDesc(UUID auditCaseId);

    @Query("SELECT e FROM TpCompetitorPriceUploadEntity e WHERE e.auditCaseId = :caseId AND e.productHsCode = :hsCode ORDER BY e.priceDate DESC")
    List<TpCompetitorPriceUploadEntity> findByCaseIdAndHsCode(UUID caseId, String hsCode);
}
