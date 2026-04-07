package com.project2.library_management.service;

import com.project2.library_management.entity.Author;
import com.project2.library_management.repository.AuthorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        Optional<Author> optionalAuthor = authorRepository.findById(id);
        return optionalAuthor.orElse(null);
    }

    public Author createAuthor(Author author) {
        return authorRepository.save(author);
    }

    public Author updateAuthor(Long id, Author newAuthor) {
        Optional<Author> optionalAuthor = authorRepository.findById(id);

        if (optionalAuthor.isPresent()) {
            Author oldAuthor = optionalAuthor.get();
            oldAuthor.setName(newAuthor.getName());
            oldAuthor.setBiography(newAuthor.getBiography());
            return authorRepository.save(oldAuthor);
        }

        return null;
    }

    public void deleteAuthor(Long id) {
        authorRepository.deleteById(id);
    }
}