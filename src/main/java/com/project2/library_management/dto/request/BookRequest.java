package com.project2.library_management.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookRequest {

    @NotBlank(message = "Tiêu đề sách không được để trống")
    private String title;

    private String description;

    private String publisher;

    private Integer publishYear;

    @NotNull(message = "Số lượng sách không được null")
    @Min(value = 0, message = "Số lượng sách phải >= 0")
    private Integer quantity;

    @NotNull(message = "Số lượng sách còn lại không được null")
    @Min(value = 0, message = "Số lượng sách còn lại phải >= 0")
    private Integer availableQuantity;

    @NotNull(message = "ID tác giả không được null")
    private Long authorId;

    @NotNull(message = "ID thể loại không được null")
    private Long categoryId;

    public BookRequest() {
    }

    public BookRequest(String title, String description, String publisher, Integer publishYear,
                       Integer quantity, Integer availableQuantity, Long authorId, Long categoryId) {
        this.title = title;
        this.description = description;
        this.publisher = publisher;
        this.publishYear = publishYear;
        this.quantity = quantity;
        this.availableQuantity = availableQuantity;
        this.authorId = authorId;
        this.categoryId = categoryId;
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

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
