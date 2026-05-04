package com.project2.library_management.service;

import com.project2.library_management.entity.User;
import com.project2.library_management.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        // Do not return null when record is missing.
        return userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with id = " + id));
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Long id, User newUser) {
        User oldUser = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with id = " + id));
        boolean isChanged = false;

        // Update only if the new value is provided and different.
        if (newUser.getUsername() != null && !Objects.equals(oldUser.getUsername(), newUser.getUsername())) {
            oldUser.setUsername(newUser.getUsername());
            isChanged = true;
        }

        if (newUser.getPassword() != null && !Objects.equals(oldUser.getPassword(), newUser.getPassword())) {
            oldUser.setPassword(newUser.getPassword());
            isChanged = true;
        }

        if (newUser.getFullName() != null && !Objects.equals(oldUser.getFullName(), newUser.getFullName())) {
            oldUser.setFullName(newUser.getFullName());
            isChanged = true;
        }

        if (newUser.getEmail() != null && !Objects.equals(oldUser.getEmail(), newUser.getEmail())) {
            oldUser.setEmail(newUser.getEmail());
            isChanged = true;
        }

        if (newUser.getRole() != null && !Objects.equals(oldUser.getRole(), newUser.getRole())) {
            oldUser.setRole(newUser.getRole());
            isChanged = true;
        }

        return isChanged ? userRepository.save(oldUser) : oldUser;
    }

    public String deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            return "Khong tim thay user";
        }

        userRepository.deleteById(id);
        return "Xoa user thanh cong";
    }
}
