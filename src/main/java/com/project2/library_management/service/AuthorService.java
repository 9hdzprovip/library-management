package com.project2.library_management.service;

import com.project2.library_management.entity.Author;
import com.project2.library_management.repository.AuthorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
public class AuthorService {

    private final AuthorRepository authorRepository;

    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    public Author getAuthorById(Long id) {
        // Do not return null when record is missing.
        return authorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tác giả với id = " + id));
    }

    public Author createAuthor(Author author) {
        return authorRepository.save(author);
    }

    public Author updateAuthor(Long id, Author newAuthor) {
        Author oldAuthor = authorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tác giả với id = " + id));
        boolean isChanged = false;

        // Update only if the new value is provided and different.
        if (newAuthor.getName() != null && !Objects.equals(oldAuthor.getName(), newAuthor.getName())) {
            oldAuthor.setName(newAuthor.getName());
            isChanged = true;
        }

        if (newAuthor.getBiography() != null && !Objects.equals(oldAuthor.getBiography(), newAuthor.getBiography())) {
            oldAuthor.setBiography(newAuthor.getBiography());
            isChanged = true;
        }

        return isChanged ? authorRepository.save(oldAuthor) : oldAuthor;
    }

    public void deleteAuthor(Long id) {
        if (!authorRepository.existsById(id)) {
            throw new NoSuchElementException("Không tìm thấy tác giả với id = " + id);
        }
        authorRepository.deleteById(id);
    }
}
