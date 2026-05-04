package com.project2.library_management.controller;

import com.project2.library_management.entity.Author;
import com.project2.library_management.service.AuthorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/authors")
public class AuthorController {

    private final AuthorService authorService;

    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping
    public ResponseEntity<List<Author>> getAllAuthors() {
        return ResponseEntity.ok(authorService.getAllAuthors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Author> getAuthorById(@PathVariable Long id) {
        return ResponseEntity.ok(authorService.getAuthorById(id));
    }

    @PostMapping
    public ResponseEntity<Author> createAuthor(@Valid @RequestBody Author author) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authorService.createAuthor(author));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Author> updateAuthor(@PathVariable Long id, @Valid @RequestBody Author author) {
        return ResponseEntity.ok(authorService.updateAuthor(id, author));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAuthor(@PathVariable Long id) {
        authorService.deleteAuthor(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Delete author successfully");
        return ResponseEntity.ok(response);
    }
}