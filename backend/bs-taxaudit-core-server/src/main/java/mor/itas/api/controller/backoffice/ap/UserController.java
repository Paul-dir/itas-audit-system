package mor.itas.api.controller.backoffice.ap;

import mor.itas.api.dto.request.ap.CreateUserRequest;
import mor.itas.api.dto.response.ap.UserResponse;
import mor.itas.application.usecase.ap.UserManagementUseCase;
import mor.itas.domain.model.ap.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Backoffice REST Controller for User Management (AP Cluster)
 */
@RestController
@RequestMapping("/api/v1/backoffice/ap/users")
@RequiredArgsConstructor
public class UserController {

    private final UserManagementUseCase userManagementUseCase;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @RequestBody CreateUserRequest request,
            @RequestHeader("X-Actor-Id") String actorId) {
        try {
            User user = userManagementUseCase.createUser(
                request.getUsername(),
                request.getEmail(),
                request.getFullName(),
                request.getUserType(),
                request.getAuditType(),
                request.getAssignedLevel(),
                request.getAssignedLocation(),
                actorId
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(mapUserToResponse(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(
            @RequestHeader("X-Actor-Id") String actorId) {
        List<User> users = userManagementUseCase.getAllUsers();
        return ResponseEntity.ok(
            users.stream().map(this::mapUserToResponse).collect(Collectors.toList())
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable UUID userId,
            @RequestHeader("X-Actor-Id") String actorId) {
        try {
            User user = userManagementUseCase.getUserById(userId);
            return ResponseEntity.ok(mapUserToResponse(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/{userId}/assign-audit-type")
    public ResponseEntity<UserResponse> assignAuditType(
            @PathVariable UUID userId,
            @RequestParam String auditType,
            @RequestHeader("X-Actor-Id") String actorId) {
        try {
            User user = userManagementUseCase.assignAuditType(userId, auditType, actorId);
            return ResponseEntity.ok(mapUserToResponse(user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/{userId}/deactivate")
    public ResponseEntity<UserResponse> deactivateUser(
            @PathVariable UUID userId,
            @RequestHeader("X-Actor-Id") String actorId) {
        try {
            User user = userManagementUseCase.deactivateUser(userId, actorId);
            return ResponseEntity.ok(mapUserToResponse(user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics(
            @RequestHeader("X-Actor-Id") String actorId) {
        Map<String, Object> stats = userManagementUseCase.getUserStatistics();
        return ResponseEntity.ok(stats);
    }

    private UserResponse mapUserToResponse(User user) {
        return UserResponse.builder()
            .userId(user.getUserId())
            .username(user.getUsername())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .userType(user.getUserType())
            .auditType(user.getAuditType())
            .assignedLevel(user.getAssignedLevel())
            .assignedLocation(user.getAssignedLocation())
            .status(user.getStatus())
            .createdDate(user.getCreatedDate())
            .lastModified(user.getLastModified())
            .build();
    }
}
