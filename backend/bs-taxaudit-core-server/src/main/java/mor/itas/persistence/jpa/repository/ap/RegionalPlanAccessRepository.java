package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.RegionalPlanAccessEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * RegionalPlanAccessRepository - Permission checks for regional plan access
 * 
 * Determines which regions can access which plans.
 * A region can only see a plan if they have an active access record.
 */
@Repository
public interface RegionalPlanAccessRepository extends JpaRepository<RegionalPlanAccessEntity, UUID> {

    /**
     * Check if a region has access to a plan
     */
    Optional<RegionalPlanAccessEntity> findByPlanIdAndRegionCode(UUID planId, String regionCode);

    /**
     * Check if access is active (not expired)
     */
    @Query("SELECT CASE WHEN COUNT(rpa) > 0 THEN TRUE ELSE FALSE END " +
           "FROM RegionalPlanAccessEntity rpa " +
           "WHERE rpa.planId = :planId AND rpa.regionCode = :regionCode " +
           "AND (rpa.accessExpiresAt IS NULL OR rpa.accessExpiresAt > CURRENT_TIMESTAMP)")
    boolean hasActiveAccess(@Param("planId") UUID planId, @Param("regionCode") String regionCode);

    /**
     * Find all plans accessible to a region
     */
    @Query("SELECT rpa FROM RegionalPlanAccessEntity rpa " +
           "WHERE rpa.regionCode = :regionCode " +
           "AND (rpa.accessExpiresAt IS NULL OR rpa.accessExpiresAt > CURRENT_TIMESTAMP) " +
           "ORDER BY rpa.accessGrantedAt DESC")
    List<RegionalPlanAccessEntity> findActivePlansForRegion(@Param("regionCode") String regionCode);

    /**
     * Find all regions that have access to a plan
     */
    List<RegionalPlanAccessEntity> findByPlanId(UUID planId);

    /**
     * Count active regions with access to a plan
     */
    @Query("SELECT COUNT(rpa) FROM RegionalPlanAccessEntity rpa " +
           "WHERE rpa.planId = :planId " +
           "AND (rpa.accessExpiresAt IS NULL OR rpa.accessExpiresAt > CURRENT_TIMESTAMP)")
    long countActiveAccessForPlan(@Param("planId") UUID planId);

    @Modifying
    @Query(value = "DELETE FROM ap_regional_plan_access WHERE plan_id = :planId", nativeQuery = true)
    int deleteByPlanIdNative(@Param("planId") UUID planId);
}
