package com.project2.library_management.service;

import com.project2.library_management.dto.request.AuthorRequest;
import com.project2.library_management.dto.response.AuthorResponse;
import com.project2.library_management.dto.response.UpdateResponse;
import com.project2.library_management.entity.Author;
import com.project2.library_management.repository.AuthorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AuthorService {

    private final AuthorRepository authorRepository;

    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    public List<AuthorResponse> getAllAuthors() {
        return authorRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public AuthorResponse getAuthorById(Long id) {
        // Do not return null when record is missing.
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tác giả với id = " + id));
        return convertToResponse(author);
    }

    public AuthorResponse createAuthor(AuthorRequest request) {
        Author author = new Author();
        author.setName(request.getName());
        author.setBiography(request.getBiography());
        
        Author savedAuthor = authorRepository.save(author);
        return convertToResponse(savedAuthor);
    }

    public UpdateResponse<AuthorResponse> updateAuthor(Long id, AuthorRequest request) {
        Author oldAuthor = authorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tác giả với id = " + id));
        boolean isChanged = false;

        // Update only if the new value is provided and different.
        if (request.getName() != null && !Objects.equals(oldAuthor.getName(), request.getName())) {
            oldAuthor.setName(request.getName());
            isChanged = true;
        }

        if (request.getBiography() != null && !Objects.equals(oldAuthor.getBiography(), request.getBiography())) {
            oldAuthor.setBiography(request.getBiography());
            isChanged = true;
        }

        Author savedAuthor = isChanged ? authorRepository.save(oldAuthor) : oldAuthor;
        String message = isChanged ? "Cập nhật tác giả thành công" : "Không có gì thay đổi";
        return new UpdateResponse<>(message, isChanged, convertToResponse(savedAuthor));
    }

    public void deleteAuthor(Long id) {
        if (!authorRepository.existsById(id)) {
            throw new NoSuchElementException("Không tìm thấy tác giả với id = " + id);
        }
        authorRepository.deleteById(id);
    }

    private AuthorResponse convertToResponse(Author author) {
        return new AuthorResponse(
                author.getId(),
                author.getName(),
                author.getBiography(),
                author.getCreatedAt()
        );
    }
}
