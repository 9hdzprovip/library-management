package com.project2.library_management.controller;

import com.project2.library_management.entity.Category;
import com.project2.library_management.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService categoryService;
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.createCategory(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category newCategory) {
        return ResponseEntity.ok(categoryService.updateCategory(id, newCategory));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Delete category successfully");
        return ResponseEntity.ok(response);
    }
}