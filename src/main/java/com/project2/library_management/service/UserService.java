package com.project2.library_management.service;

import com.project2.library_management.entity.User;
import com.project2.library_management.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

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
		Optional<User> optionalUser = userRepository.findById(id);
		return optionalUser.orElse(null);
	}

	public User createUser(User user) {
		return userRepository.save(user);
	}

	public User updateUser(Long id, User newUser) {
		Optional<User> optionalUser = userRepository.findById(id);

		if (optionalUser.isPresent()) {
			User oldUser = optionalUser.get();
			boolean isChanged = false;

			if (!Objects.equals(oldUser.getUsername(), newUser.getUsername())) {
				oldUser.setUsername(newUser.getUsername());
				isChanged = true;
			}

			if (!Objects.equals(oldUser.getPassword(), newUser.getPassword())) {
				oldUser.setPassword(newUser.getPassword());
				isChanged = true;
			}

			if (!Objects.equals(oldUser.getFullName(), newUser.getFullName())) {
				oldUser.setFullName(newUser.getFullName());
				isChanged = true;
			}

			if (!Objects.equals(oldUser.getEmail(), newUser.getEmail())) {
				oldUser.setEmail(newUser.getEmail());
				isChanged = true;
			}

			if (!Objects.equals(oldUser.getRole(), newUser.getRole())) {
				oldUser.setRole(newUser.getRole());
				isChanged = true;
			}

			if (isChanged) {
				return userRepository.save(oldUser);
			} else {
				System.out.println("Không có gì thay đổi");
				return oldUser;
			}
		}

		return null;
	}

	public String deleteUser(Long id) {
		Optional<User> optionalUser = userRepository.findById(id);

		if (optionalUser.isPresent()) {
			userRepository.deleteById(id);
			return "Xóa user thành công";
		}

		return "Không tìm thấy user";
	}
}
