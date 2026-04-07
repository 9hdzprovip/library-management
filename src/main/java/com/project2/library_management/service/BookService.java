package com.project2.library_management.service;

import com.project2.library_management.entity.Author;
import com.project2.library_management.entity.Book;
import com.project2.library_management.entity.Category;
import com.project2.library_management.repository.AuthorRepository;
import com.project2.library_management.repository.BookRepository;
import com.project2.library_management.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;

    public BookService(BookRepository bookRepository,
                       AuthorRepository authorRepository,
                       CategoryRepository categoryRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        Optional<Book> optionalBook = bookRepository.findById(id);
        return optionalBook.orElse(null);
    }

    public Book createBook(Book book) {
        if (book.getAuthor() != null && book.getAuthor().getId() != null) {
            Optional<Author> optionalAuthor = authorRepository.findById(book.getAuthor().getId());
            if (optionalAuthor.isPresent()) {
                book.setAuthor(optionalAuthor.get());
            } else {
                throw new RuntimeException("Không tìm thấy author với id = " + book.getAuthor().getId());
            }
        }

        if (book.getCategory() != null && book.getCategory().getId() != null) {
            Optional<Category> optionalCategory = categoryRepository.findById(book.getCategory().getId());
            if (optionalCategory.isPresent()) {
                book.setCategory(optionalCategory.get());
            } else {
                throw new RuntimeException("Không tìm thấy category với id = " + book.getCategory().getId());
            }
        }

        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book newBook) {
        Optional<Book> optionalBook = bookRepository.findById(id);

        if (optionalBook.isPresent()) {
            Book oldBook = optionalBook.get();
            boolean isChanged = false;

            if (!Objects.equals(oldBook.getTitle(), newBook.getTitle())) {
                oldBook.setTitle(newBook.getTitle());
                isChanged = true;
            }

            if (!Objects.equals(oldBook.getDescription(), newBook.getDescription())) {
                oldBook.setDescription(newBook.getDescription());
                isChanged = true;
            }

            if (!Objects.equals(oldBook.getPublisher(), newBook.getPublisher())) {
                oldBook.setPublisher(newBook.getPublisher());
                isChanged = true;
            }

            if (!Objects.equals(oldBook.getPublishYear(), newBook.getPublishYear())) {
                oldBook.setPublishYear(newBook.getPublishYear());
                isChanged = true;
            }

            if (!Objects.equals(oldBook.getQuantity(), newBook.getQuantity())) {
                oldBook.setQuantity(newBook.getQuantity());
                isChanged = true;
            }

            if (!Objects.equals(oldBook.getAvailableQuantity(), newBook.getAvailableQuantity())) {
                oldBook.setAvailableQuantity(newBook.getAvailableQuantity());
                isChanged = true;
            }

            if (newBook.getAuthor() != null && newBook.getAuthor().getId() != null) {
                Long oldAuthorId = oldBook.getAuthor() != null ? oldBook.getAuthor().getId() : null;
                Long newAuthorId = newBook.getAuthor().getId();

                if (!Objects.equals(oldAuthorId, newAuthorId)) {
                    Optional<Author> optionalAuthor = authorRepository.findById(newAuthorId);
                    if (optionalAuthor.isPresent()) {
                        oldBook.setAuthor(optionalAuthor.get());
                        isChanged = true;
                    } else {
                        return null;
                    }
                }
            }

            if (newBook.getCategory() != null && newBook.getCategory().getId() != null) {
                Long oldCategoryId = oldBook.getCategory() != null ? oldBook.getCategory().getId() : null;
                Long newCategoryId = newBook.getCategory().getId();

                if (!Objects.equals(oldCategoryId, newCategoryId)) {
                    Optional<Category> optionalCategory = categoryRepository.findById(newCategoryId);
                    if (optionalCategory.isPresent()) {
                        oldBook.setCategory(optionalCategory.get());
                        isChanged = true;
                    } else {
                        return null;
                    }
                }
            }

            if (isChanged) {
                return bookRepository.save(oldBook);
            } else {
                System.out.println("Không có gì thay đổi");
                return oldBook;
            }
        }

        return null;
    }

    public String deleteBook(Long id) {
        Optional<Book> optionalBook = bookRepository.findById(id);

        if (optionalBook.isPresent()) {
            bookRepository.deleteById(id);
            return "Xóa book thành công";
        }

        return "Không tìm thấy book";
    }
}