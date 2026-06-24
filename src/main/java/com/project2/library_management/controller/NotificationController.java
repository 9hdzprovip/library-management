package com.project2.library_management.controller;

import com.project2.library_management.dto.request.NotificationRequest;
import com.project2.library_management.dto.response.NotificationResponse;
import com.project2.library_management.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(@Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.createNotification(request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(notificationService.getMyNotifications(username));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(notificationService.markAsRead(id, username));
    }
}
