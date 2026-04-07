package com.project2.library_management.service;

import com.project2.library_management.entity.Author;
import com.project2.library_management.entity.Category;
import com.project2.library_management.repository.AuthorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
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
            boolean isChanged = false;

            if (!Objects.equals(oldAuthor.getName(), newAuthor.getName())) {
                oldAuthor.setName(newAuthor.getName());
                isChanged = true;
            }

            if (!Objects.equals(oldAuthor.getBiography(), newAuthor.getBiography())) {
                oldAuthor.setBiography(newAuthor.getBiography());
                isChanged = true;
            }

            if (isChanged) {
                return authorRepository.save(oldAuthor);
            } else {
                System.out.println("Không có gì thay đổi");
                return oldAuthor;
            }
        }

        return null;
    }

    public String deleteAuthor(Long id) {
        Optional<Author> optionalAuthor = authorRepository.findById(id);

        if (optionalAuthor.isPresent()) {
            authorRepository.deleteById(id);
            return "Xóa author thành công";
        }

        return "Không tìm thấy author";
    }
}