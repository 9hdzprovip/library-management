package com.project2.library_management.service;

import com.project2.library_management.entity.Category;
import com.project2.library_management.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

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
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        return optionalCategory.orElse(null);
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category newCategory) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);

        if (optionalCategory.isPresent()) {
            Category oldCategory = optionalCategory.get();
            boolean isChanged = false;

            if (!Objects.equals(oldCategory.getName(), newCategory.getName())) {
                oldCategory.setName(newCategory.getName());
                isChanged = true;
            }

            if (!Objects.equals(oldCategory.getDescription(), newCategory.getDescription())) {
                oldCategory.setDescription(newCategory.getDescription());
                isChanged = true;
            }

            if (isChanged) {
                return categoryRepository.save(oldCategory);
            } else {
                System.out.println("Không có gì thay đổi");
                return oldCategory;
            }
        }

        return null;
    }

    public String deleteCategory(Long id) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);

        if (optionalCategory.isPresent()) {
            categoryRepository.deleteById(id);
            return "Xóa category thành công";
        }

        return "Không tìm thấy category";
    }
}