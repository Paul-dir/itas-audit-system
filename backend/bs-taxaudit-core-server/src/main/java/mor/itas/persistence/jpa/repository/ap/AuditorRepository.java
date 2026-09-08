package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.AuditorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for Auditor entity
 */
@Repository
public interface AuditorRepository extends JpaRepository<AuditorEntity, UUID> {

    /**
     * Find all active auditors
     */
    List<AuditorEntity> findByActiveTrue();

    /**
     * Search auditors by expertise (case-insensitive partial match)
     */
    @Query(value = "SELECT * FROM t_auditor a WHERE a.active = true " +
           "AND (:expertise IS NULL OR LOWER(a.expertise) LIKE LOWER('%' || :expertise || '%'))", nativeQuery = true)
    List<AuditorEntity> searchByExpertise(@Param("expertise") String expertise);

    /**
     * Search auditors by seniority level
     */
    @Query(value = "SELECT * FROM t_auditor a WHERE a.active = true " +
           "AND (:seniority IS NULL OR UPPER(a.seniority) = UPPER(:seniority))", nativeQuery = true)
    List<AuditorEntity> searchBySeniority(@Param("seniority") String seniority);

    /**
     * Search auditors by expertise and seniority
     */
    @Query(value = "SELECT * FROM t_auditor a WHERE a.active = true " +
           "AND (:expertise IS NULL OR LOWER(a.expertise) LIKE LOWER('%' || :expertise || '%')) " +
           "AND (:seniority IS NULL OR UPPER(a.seniority) = UPPER(:seniority))", nativeQuery = true)
    List<AuditorEntity> searchByExpertiseAndSeniority(
            @Param("expertise") String expertise,
            @Param("seniority") String seniority);

    /**
     * Search auditors by expertise, seniority, and tax center.
     * Used by committee to only see auditors from their own tax center.
     * When taxCenter is NULL, no tax center filter is applied.
     */
    @Query(value = "SELECT * FROM t_auditor a WHERE a.active = true " +
           "AND (:expertise IS NULL OR LOWER(a.expertise) LIKE LOWER('%' || :expertise || '%')) " +
           "AND (:seniority IS NULL OR UPPER(a.seniority) = UPPER(:seniority)) " +
           "AND (:taxCenter IS NULL OR a.tax_center = :taxCenter)", nativeQuery = true)
    List<AuditorEntity> searchByExpertiseAndSeniorityAndTaxCenter(
            @Param("expertise") String expertise,
            @Param("seniority") String seniority,
            @Param("taxCenter") String taxCenter);

    /**
     * Find auditors with available capacity (current cases < max cases)
     */
    @Query("SELECT a FROM AuditorEntity a WHERE a.active = true AND a.currentCases < a.maxCases")
    List<AuditorEntity> findAvailable();

    /**
     * Count auditors by seniority level
     */
    @Query("SELECT a.seniority, COUNT(a) FROM AuditorEntity a WHERE a.active = true GROUP BY a.seniority")
    List<Object[]> countBySeniority();

    /**
     * Find auditors by expertise area
     */
    List<AuditorEntity> findByExpertiseAndActiveTrue(String expertise);
}
