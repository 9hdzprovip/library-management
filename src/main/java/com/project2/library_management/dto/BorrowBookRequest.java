package com.project2.library_management.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class BorrowBookRequest {

    @NotNull(message = "User id must not be null")
    private Long userId;

    @NotNull(message = "Book id must not be null")
    private Long bookId;

    @NotNull(message = "Due date must not be null")
    private LocalDate dueDate;

    public BorrowBookRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
}