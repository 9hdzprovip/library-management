package com.project2.library_management.service;

import com.project2.library_management.dto.request.UserRequest;
import com.project2.library_management.dto.response.UpdateResponse;
import com.project2.library_management.dto.response.UserResponse;
import com.project2.library_management.entity.User;
import com.project2.library_management.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        // Do not return null when record is missing.
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng với id = " + id));
        return convertToResponse(user);
    }

    public UserResponse createUser(UserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        
        User savedUser = userRepository.save(user);
        return convertToResponse(savedUser);
    }

    public UpdateResponse<UserResponse> updateUser(Long id, UserRequest request) {
        User oldUser = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng với id = " + id));
        boolean isChanged = false;

        // Update only if the new value is provided and different.
        if (request.getUsername() != null && !Objects.equals(oldUser.getUsername(), request.getUsername())) {
            oldUser.setUsername(request.getUsername());
            isChanged = true;
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            // Only update password when the raw password is actually different.
            if (oldUser.getPassword() == null || !passwordEncoder.matches(request.getPassword(), oldUser.getPassword())) {
                oldUser.setPassword(passwordEncoder.encode(request.getPassword()));
                isChanged = true;
            }
        }

        if (request.getFullName() != null && !Objects.equals(oldUser.getFullName(), request.getFullName())) {
            oldUser.setFullName(request.getFullName());
            isChanged = true;
        }

        if (request.getEmail() != null && !Objects.equals(oldUser.getEmail(), request.getEmail())) {
            oldUser.setEmail(request.getEmail());
            isChanged = true;
        }

        if (request.getRole() != null && !Objects.equals(oldUser.getRole(), request.getRole())) {
            oldUser.setRole(request.getRole());
            isChanged = true;
        }

        User savedUser = isChanged ? userRepository.save(oldUser) : oldUser;
        String message = isChanged ? "Cập nhật người dùng thành công" : "Không có gì thay đổi";
        return new UpdateResponse<>(message, isChanged, convertToResponse(savedUser));
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new NoSuchElementException("Không tìm thấy người dùng với id = " + id);
        }
        userRepository.deleteById(id);
    }

    private UserResponse convertToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
