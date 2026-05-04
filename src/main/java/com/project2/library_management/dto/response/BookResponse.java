package com.project2.library_management.dto.response;

import java.time.LocalDateTime;

public class BookResponse {

    private Long id;
    private String title;
    private String description;
    private String publisher;
    private Integer publishYear;
    private Integer quantity;
    private Integer availableQuantity;
    private Long authorId;
    private String authorName;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;

    public BookResponse() {
    }

    public BookResponse(Long id, String title, String description, String publisher, Integer publishYear,
                        Integer quantity, Integer availableQuantity, Long authorId, String authorName,
                        Long categoryId, String categoryName, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.publisher = publisher;
        this.publishYear = publishYear;
        this.quantity = quantity;
        this.availableQuantity = availableQuantity;
        this.authorId = authorId;
        this.authorName = authorName;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public Integer getPublishYear() {
        return publishYear;
    }

    public void setPublishYear(Integer publishYear) {
        this.publishYear = publishYear;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
