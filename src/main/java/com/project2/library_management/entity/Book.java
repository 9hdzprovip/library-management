package com.project2.library_management.entity;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@JsonPropertyOrder({ "id", "title", "description", "publisher", "publishYear", "quantity",
        "availableQuantity", "author", "category", "createdAt" })
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String publisher;

    @Column(name = "publish_year")
    private Integer publishYear;

    private Integer quantity;

    @Column(name = "available_quantity")
    private Integer availableQuantity;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Book() {
    }
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }


    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getPublisher() {
        return publisher;
    }

    public Integer getPublishYear() {
        return publishYear;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public Author getAuthor() {
        return author;
    }

    public Category getCategory() {
        return category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public void setPublishYear(Integer publishYear) {
        this.publishYear = publishYear;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}