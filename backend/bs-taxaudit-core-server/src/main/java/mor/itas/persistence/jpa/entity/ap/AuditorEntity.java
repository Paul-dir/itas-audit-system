package mor.itas.persistence.jpa.entity.ap;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * JPA Entity for Auditor Profiles
 * Stores auditor information for nomination search and team formation
 */
@Entity
@Table(name = "t_auditor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditorEntity {

    @Id
    private UUID auditorId;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, length = 100)
    private String expertise;

    @Column(nullable = false, length = 50)
    private String seniority;  // JUNIOR, MID_LEVEL, SENIOR, PRINCIPAL

    @Column(name = "years_of_experience", nullable = false)
    private Integer yearsOfExperience;

    @Column(length = 100)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(name = "tax_center", length = 100)
    private String taxCenter;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(name = "current_cases")
    @Builder.Default
    private Integer currentCases = 0;

    @Column(name = "max_cases")
    @Builder.Default
    private Integer maxCases = 5;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (auditorId == null) {
            auditorId = UUID.randomUUID();
        }
    }

    /**
     * Get full display name
     */
    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }

    /**
     * Check if auditor belongs to a specific tax center
     */
    @Transient
    public boolean belongsToTaxCenter(String taxCenterCode) {
        return this.taxCenter != null && this.taxCenter.equals(taxCenterCode);
    }
}
