package mor.itas.persistence.jpa.entity.ap;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.*;

@Entity
@Table(name = "t_handoff_record")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HandoffRecordEntity {

    @Id
    private UUID handoffId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private CommitteeCaseEntity committeeCaseEntity;

    @Column(nullable = false, unique = true, length = 50)
    private String caseCode;

    @Column(name = "execution_case_id")
    private UUID executionCaseId;

    @Column(nullable = false)
    private UUID teamLeadId;

    @Column(name = "committee_summary", columnDefinition = "TEXT")
    private String committeeSummary;

    @Column(name = "key_findings", columnDefinition = "TEXT")
    private String keyFindings;

    @Column(nullable = false, length = 50)
    private String decision;

    @CreationTimestamp
    @Column(name = "handoff_date", nullable = false, updatable = false)
    private OffsetDateTime handoffDate;

    @Column(nullable = false)
    private UUID createdBy;

    @Column(name = "delivered_at")
    private OffsetDateTime deliveredAt;

    @Version
    private Long version;

    @OneToMany(mappedBy = "handoffRecordEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HandoffTeamMemberEntity> teamMembers = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (handoffId == null) {
            handoffId = UUID.randomUUID();
        }
    }
}
