package mor.itas.persistence.jpa.repository.ap;

import mor.itas.persistence.jpa.entity.ap.ResearchNoteEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for ResearchNote entity.
 * 
 * Manages research notes and collaborative documentation in the committee workspace,
 * including filtering by category and author with pagination support.
 */
@Repository
public interface ResearchNoteRepository extends JpaRepository<ResearchNoteEntity, UUID> {

    /**
     * Find all research notes for a specific case with pagination.
     * Notes are ordered by creation date in descending order (newest first).
     * 
     * @param caseId the committee case ID
     * @param pageable pagination parameters
     * @return Page of research notes for the case
     */
    @Query("""
        SELECT n FROM ResearchNoteEntity n 
        WHERE n.committeeCaseEntity.caseId = :caseId
        ORDER BY n.createdAt DESC
        """)
    Page<ResearchNoteEntity> findByCaseIdOrderByCreatedAtDesc(@Param("caseId") UUID caseId, Pageable pageable);

    /**
     * Find research notes for a specific case filtered by category.
     * Supports filtering (Observation, Question, Investigation, Recommendation).
     * 
     * @param caseId the committee case ID
     * @param category the note category
     * @return List of filtered notes, ordered by creation date
     */
    @Query("""
        SELECT n FROM ResearchNoteEntity n 
        WHERE n.committeeCaseEntity.caseId = :caseId AND n.category = :category
        ORDER BY n.createdAt DESC
        """)
    List<ResearchNoteEntity> findByCaseIdAndCategoryOrderByCreatedAtDesc(
        @Param("caseId") UUID caseId, 
        @Param("category") String category);

    /**
     * Find all research notes authored by a specific committee member.
     * Used for member's note history and analytics.
     * 
     * @param authorId the committee member ID
     * @return List of notes authored by the member
     */
    List<ResearchNoteEntity> findByAuthorId(UUID authorId);

    /**
     * Find research notes by author with pagination.
     * 
     * @param authorId the committee member ID
     * @param pageable pagination parameters
     * @return Page of notes authored by the member
     */
    Page<ResearchNoteEntity> findByAuthorIdOrderByCreatedAtDesc(UUID authorId, Pageable pageable);

    /**
     * Count total research notes for a specific case.
     * Used for statistics and analytics.
     * 
     * @param caseId the committee case ID
     * @return count of notes for the case
     */
    @Query("""
        SELECT COUNT(n) FROM ResearchNoteEntity n 
        WHERE n.committeeCaseEntity.caseId = :caseId
        """)
    long countByCaseId(@Param("caseId") UUID caseId);

    /**
     * Count research notes by category for a specific case.
     * Used to analyze note distribution by category.
     * 
     * @param caseId the committee case ID
     * @param category the note category
     * @return count of notes matching the criteria
     */
    @Query("""
        SELECT COUNT(n) FROM ResearchNoteEntity n 
        WHERE n.committeeCaseEntity.caseId = :caseId AND n.category = :category
        """)
    long countByCaseIdAndCategory(
        @Param("caseId") UUID caseId, 
        @Param("category") String category);

    /**
     * Find research notes by case and category with pagination.
     * 
     * @param caseId the committee case ID
     * @param category the note category
     * @param pageable pagination parameters
     * @return Page of filtered notes
     */
    @Query("""
        SELECT n FROM ResearchNoteEntity n 
        WHERE n.committeeCaseEntity.caseId = :caseId AND n.category = :category
        ORDER BY n.createdAt DESC
        """)
    Page<ResearchNoteEntity> findByCaseIdAndCategoryWithPagination(
        @Param("caseId") UUID caseId,
        @Param("category") String category,
        Pageable pageable);

    /**
     * Find research notes by multiple categories for a case.
     * 
     * @param caseId the committee case ID
     * @param categories list of note categories
     * @return List of notes matching any of the specified categories
     */
    @Query("""
        SELECT n FROM ResearchNoteEntity n 
        WHERE n.committeeCaseEntity.caseId = :caseId AND n.category IN :categories
        ORDER BY n.createdAt DESC
        """)
    List<ResearchNoteEntity> findByCaseIdAndCategoryIn(
        @Param("caseId") UUID caseId,
        @Param("categories") List<String> categories);
}
