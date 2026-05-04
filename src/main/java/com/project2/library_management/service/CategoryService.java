package com.project2.library_management.service;

import com.project2.library_management.entity.Category;
import com.project2.library_management.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        // Do not return null when record is missing.
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thể loại với id = " + id));
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category newCategory) {
        Category oldCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thể loại với id = " + id));
        boolean isChanged = false;

        // Update only if the new value is provided and different.
        if (newCategory.getName() != null && !Objects.equals(oldCategory.getName(), newCategory.getName())) {
            oldCategory.setName(newCategory.getName());
            isChanged = true;
        }

        if (newCategory.getDescription() != null && !Objects.equals(oldCategory.getDescription(), newCategory.getDescription())) {
            oldCategory.setDescription(newCategory.getDescription());
            isChanged = true;
        }

        return isChanged ? categoryRepository.save(oldCategory) : oldCategory;
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new NoSuchElementException("Không tìm thấy thể loại với id = " + id);
        }
        categoryRepository.deleteById(id);
    }
}
