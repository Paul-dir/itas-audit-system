package mor.itas.api.controller.backoffice.notification;

import lombok.RequiredArgsConstructor;
import mor.itas.api.dto.response.ap.GenericResponse;
import mor.itas.application.service.notification.NotificationService;
import mor.itas.infrastructure.security.ItasPrincipal;
import mor.itas.persistence.jpa.entity.notification.NotificationEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    private String resolveActor(String actorHeader, ItasPrincipal principal) {
        if (actorHeader != null && !actorHeader.isBlank()) {
            return actorHeader.trim();
        }
        if (principal != null) {
            return principal.getUsername() != null ? principal.getUsername() : principal.getUserId();
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<GenericResponse<List<NotificationEntity>>> getNotifications(
            @RequestHeader(value = "X-Actor-Id", required = false) String actorHeader,
            @RequestParam(value = "userId", required = false) String userIdParam,
            @AuthenticationPrincipal ItasPrincipal principal) {

        String actor = userIdParam != null && !userIdParam.isBlank() ? userIdParam : resolveActor(actorHeader, principal);
        if (actor == null) {
            return ResponseEntity.ok(GenericResponse.success(List.of()));
        }

        List<NotificationEntity> list = notificationService.getUserNotifications(actor);
        return ResponseEntity.ok(GenericResponse.success(list));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<GenericResponse<Map<String, Object>>> getUnreadCount(
            @RequestHeader(value = "X-Actor-Id", required = false) String actorHeader,
            @RequestParam(value = "userId", required = false) String userIdParam,
            @AuthenticationPrincipal ItasPrincipal principal) {

        String actor = userIdParam != null && !userIdParam.isBlank() ? userIdParam : resolveActor(actorHeader, principal);
        long count = actor != null ? notificationService.getUnreadCount(actor) : 0L;
        return ResponseEntity.ok(GenericResponse.success(Map.of("unreadCount", count, "actorId", actor != null ? actor : "")));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<GenericResponse<Map<String, Object>>> markAsRead(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Actor-Id", required = false) String actorHeader,
            @AuthenticationPrincipal ItasPrincipal principal) {

        String actor = resolveActor(actorHeader, principal);
        boolean success = notificationService.markAsRead(id, actor);
        return ResponseEntity.ok(GenericResponse.success(Map.of("success", success, "id", id.toString())));
    }

    @PatchMapping("/mark-all-read")
    public ResponseEntity<GenericResponse<Map<String, Object>>> markAllAsRead(
            @RequestHeader(value = "X-Actor-Id", required = false) String actorHeader,
            @AuthenticationPrincipal ItasPrincipal principal) {

        String actor = resolveActor(actorHeader, principal);
        int updated = actor != null ? notificationService.markAllAsRead(actor) : 0;
        return ResponseEntity.ok(GenericResponse.success(Map.of("markedReadCount", updated)));
    }
}
