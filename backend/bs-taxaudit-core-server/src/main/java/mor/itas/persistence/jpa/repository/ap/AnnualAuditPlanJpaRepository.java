package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.AnnualAuditPlanEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

/**
 * AnnualAuditPlanJpaRepository - Spring Data JPA Repository
 * Low-level database access for AnnualAuditPlanEntity
 */
@Repository
public interface AnnualAuditPlanJpaRepository extends JpaRepository<AnnualAuditPlanEntity, UUID> {
    
    /**
     * Find plans by status
     */
    List<AnnualAuditPlanEntity> findByStatus(String status);
    
    /**
     * Find plans by year
     */
    List<AnnualAuditPlanEntity> findByYear(Integer year);
    
    /**
     * Find plans by status and year
     */
    List<AnnualAuditPlanEntity> findByStatusAndYear(String status, Integer year);
    
    /**
     * Find plans with pagination and filtering
     */
    @Query("SELECT p FROM AnnualAuditPlanEntity p WHERE " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:year IS NULL OR p.year = :year)")
    Page<AnnualAuditPlanEntity> findPlansWithFilters(
           @Param("status") String status,
           @Param("year") Integer year,
           Pageable pageable);
}

