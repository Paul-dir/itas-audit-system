package mor.itas.engineadapter.dms;

import mor.itas.application.port.outboundport.dms.DmsPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Mock DMS (Document Management System) Adapter
 * Stores documents locally on the filesystem.
 * In production, this would integrate with an actual DMS (e.g., AWS S3, MinIO).
 *
 * Storage structure:
 *   {storage-base}/{year}/{month}/{day}/{uuid}_{filename}
 *
 * Supported operations:
 *   - uploadDocument: Store a file and return its ID
 *   - downloadDocument: Retrieve a file by ID
 *   - deleteDocument: Remove a file by ID
 *   - getFilePath: Get the filesystem path for a document ID
 */
@Component
@Profile({"mock", "test"})
@Slf4j
public class MockDmsAdapter implements DmsPort {

    @Value("${itas.dms.storage-base:./dms-storage}")
    private String storageBase;

    @Override
    public UUID uploadDocument(String filename, byte[] content) {
        if (filename == null || filename.isBlank()) {
            throw new IllegalArgumentException("Filename cannot be null or empty");
        }
        if (content == null || content.length == 0) {
            throw new IllegalArgumentException("Document content cannot be null or empty");
        }

        UUID documentId = UUID.randomUUID();
        String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        Path targetDir = Paths.get(storageBase, datePath);

        try {
            Files.createDirectories(targetDir);
            String safeName = filename.replaceAll("[^a-zA-Z0-9._-]", "_");
            Path targetFile = targetDir.resolve(documentId + "_" + safeName);
            Files.write(targetFile, content);

            log.info("[DMS] Document uploaded: id={}, filename={}, size={} bytes, path={}",
                    documentId, filename, content.length, targetFile);
            return documentId;
        } catch (IOException e) {
            log.error("[DMS] Failed to upload document: {}", filename, e);
            throw new RuntimeException("Failed to store document: " + filename, e);
        }
    }

    /**
     * Download a document by ID.
     * Scans the storage directory for the file matching the given ID.
     */
    public byte[] downloadDocument(UUID documentId) {
        if (documentId == null) {
            throw new IllegalArgumentException("Document ID cannot be null");
        }

        try {
            Path root = Paths.get(storageBase);
            if (!Files.exists(root)) {
                throw new RuntimeException("DMS storage directory not found: " + storageBase);
            }

            // Walk the directory tree to find the file
            String prefix = documentId + "_";
            try (java.util.stream.Stream<Path> paths = Files.walk(root)) {
                return paths
                        .filter(Files::isRegularFile)
                        .filter(p -> p.getFileName().toString().startsWith(prefix))
                        .findFirst()
                        .map(p -> {
                            try {
                                return Files.readAllBytes(p);
                            } catch (IOException e) {
                                throw new RuntimeException("Failed to read document: " + documentId, e);
                            }
                        })
                        .orElseThrow(() -> new RuntimeException("Document not found: " + documentId));
            }
        } catch (RuntimeException e) {
            throw e;
        } catch (IOException e) {
            log.error("[DMS] Failed to download document: {}", documentId, e);
            throw new RuntimeException("Failed to retrieve document: " + documentId, e);
        }
    }

    /**
     * Delete a document by ID.
     */
    public boolean deleteDocument(UUID documentId) {
        if (documentId == null) return false;

        try {
            Path root = Paths.get(storageBase);
            if (!Files.exists(root)) return false;

            String prefix = documentId + "_";
            try (java.util.stream.Stream<Path> paths = Files.walk(root)) {
                return paths
                        .filter(Files::isRegularFile)
                        .filter(p -> p.getFileName().toString().startsWith(prefix))
                        .findFirst()
                        .map(p -> {
                            try {
                                Files.delete(p);
                                log.info("[DMS] Document deleted: id={}, path={}", documentId, p);
                                return true;
                            } catch (IOException e) {
                                log.error("[DMS] Failed to delete document: {}", documentId, e);
                                return false;
                            }
                        })
                        .orElse(false);
            }
        } catch (IOException e) {
            log.error("[DMS] Failed to scan for document: {}", documentId, e);
            return false;
        }
    }

    /**
     * Get the filesystem path for a document (for serving via controller).
     */
    public String getFilePath(UUID documentId) {
        if (documentId == null) return null;

        try {
            Path root = Paths.get(storageBase);
            if (!Files.exists(root)) return null;

            String prefix = documentId + "_";
            try (java.util.stream.Stream<Path> paths = Files.walk(root)) {
                return paths
                        .filter(Files::isRegularFile)
                        .filter(p -> p.getFileName().toString().startsWith(prefix))
                        .findFirst()
                        .map(p -> p.toAbsolutePath().toString())
                        .orElse(null);
            }
        } catch (IOException e) {
            log.error("[DMS] Failed to find path for document: {}", documentId, e);
            return null;
        }
    }

    /**
     * Get the total number of stored documents.
     */
    public long getDocumentCount() {
        try {
            Path root = Paths.get(storageBase);
            if (!Files.exists(root)) return 0;
            try (java.util.stream.Stream<Path> paths = Files.walk(root)) {
                return paths.filter(Files::isRegularFile).count();
            }
        } catch (IOException e) {
            return 0;
        }
    }
}
