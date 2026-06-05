package com.project2.library_management.dto.response;

public class UpdateResponse<T> {

    private String message;
    private boolean updated;
    private T data;

    public UpdateResponse() {
    }

    public UpdateResponse(String message, boolean updated, T data) {
        this.message = message;
        this.updated = updated;
        this.data = data;
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

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
