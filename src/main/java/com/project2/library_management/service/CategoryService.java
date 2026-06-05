package com.project2.library_management.service;

import com.project2.library_management.dto.request.CategoryRequest;
import com.project2.library_management.dto.response.CategoryResponse;
import com.project2.library_management.dto.response.UpdateResponse;
import com.project2.library_management.entity.Category;
import com.project2.library_management.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(Long id) {
        // Do not return null when record is missing.
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thể loại với id = " + id));
        return convertToResponse(category);
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        
        Category savedCategory = categoryRepository.save(category);
        return convertToResponse(savedCategory);
    }

    public UpdateResponse<CategoryResponse> updateCategory(Long id, CategoryRequest request) {
        Category oldCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thể loại với id = " + id));
        boolean isChanged = false;

        // Update only if the new value is provided and different.
        if (request.getName() != null && !Objects.equals(oldCategory.getName(), request.getName())) {
            oldCategory.setName(request.getName());
            isChanged = true;
        }

        if (request.getDescription() != null && !Objects.equals(oldCategory.getDescription(), request.getDescription())) {
            oldCategory.setDescription(request.getDescription());
            isChanged = true;
        }

        Category savedCategory = isChanged ? categoryRepository.save(oldCategory) : oldCategory;
        String message = isChanged ? "Cập nhật thể loại thành công" : "Không có gì thay đổi";
        return new UpdateResponse<>(message, isChanged, convertToResponse(savedCategory));
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new NoSuchElementException("Không tìm thấy thể loại với id = " + id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryResponse convertToResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getCreatedAt()
        );
    }
}
