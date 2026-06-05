package com.project2.library_management.dto.response;

public class AuthorUpdateResponse {

    private String message;
    private boolean updated;
    private AuthorResponse author;

    public AuthorUpdateResponse() {
    }

    public AuthorUpdateResponse(String message, boolean updated, AuthorResponse author) {
        this.message = message;
        this.updated = updated;
        this.author = author;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isUpdated() {
        return updated;
    }

    public void setUpdated(boolean updated) {
        this.updated = updated;
    }

    public AuthorResponse getAuthor() {
        return author;
    }

    public void setAuthor(AuthorResponse author) {
        this.author = author;
    }
}
