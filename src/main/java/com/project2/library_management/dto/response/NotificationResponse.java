package com.project2.library_management.dto.response;

import java.time.LocalDateTime;

public class NotificationResponse {

    private Long id;
    private Long userId;
    private String username;
    private String fullName;
    private String title;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;

    public NotificationResponse() {
    }

    public NotificationResponse(Long id, Long userId, String username, String fullName, String title, String message, boolean read, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.fullName = fullName;
        this.title = title;
        this.message = message;
        this.read = read;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
