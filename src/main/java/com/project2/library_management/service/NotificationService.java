package com.project2.library_management.service;

import com.project2.library_management.dto.request.NotificationRequest;
import com.project2.library_management.dto.response.NotificationResponse;
import com.project2.library_management.entity.Notification;
import com.project2.library_management.entity.User;
import com.project2.library_management.repository.NotificationRepository;
import com.project2.library_management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public NotificationResponse createNotification(NotificationRequest request) {
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("User id must not be null");
        }
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title must not be empty");
        }
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("Message must not be empty");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng với id = " + request.getUserId()));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(request.getTitle().trim());
        notification.setMessage(request.getMessage().trim());
        notification.setRead(false);

        Notification saved = notificationRepository.save(notification);
        return convertToResponse(saved);
    }

    public List<NotificationResponse> getMyNotifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationResponse markAsRead(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thông báo với id = " + id));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Bạn không có quyền sửa đổi thông báo này");
        }

        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return convertToResponse(saved);
    }

    private NotificationResponse convertToResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getUser() != null ? notification.getUser().getId() : null,
                notification.getUser() != null ? notification.getUser().getUsername() : null,
                notification.getUser() != null ? notification.getUser().getFullName() : null,
                notification.getTitle(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
