package com.project2.library_management.controller;

import com.project2.library_management.entity.User;
import com.project2.library_management.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	public ResponseEntity<List<User>> getAllUsers() {
		return ResponseEntity.ok(userService.getAllUsers());
	}

	@GetMapping("/{id}")
	public ResponseEntity<User> getUserById(@PathVariable Long id) {
		return ResponseEntity.ok(userService.getUserById(id));
	}

	@PostMapping
	public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
		return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user));
	}

	@PutMapping("/{id}")
	public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody User user) {
		return ResponseEntity.ok(userService.updateUser(id, user));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
		userService.deleteUser(id);

		Map<String, String> response = new HashMap<>();
		response.put("message", "Delete user successfully");
		return ResponseEntity.ok(response);
	}
}
