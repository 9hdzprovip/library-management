package com.project2.library_management.service;

import com.project2.library_management.entity.Author;
import com.project2.library_management.entity.Book;
import com.project2.library_management.entity.Category;
import com.project2.library_management.repository.AuthorRepository;
import com.project2.library_management.repository.BookRepository;
import com.project2.library_management.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

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
        // Do not return null when record is missing.
        return bookRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sách với id = " + id));
    }

    public Book createBook(Book book) {
        if (book.getAuthor() != null) {
            if (book.getAuthor().getId() == null) {
                throw new IllegalArgumentException("Author id must not be null");
            }
            // Resolve relation by id and fail clearly if not found.
            Author author = authorRepository.findById(book.getAuthor().getId())
                    .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tác giả với id = " + book.getAuthor().getId()));
            book.setAuthor(author);
        }

        if (book.getCategory() != null) {
            if (book.getCategory().getId() == null) {
                throw new IllegalArgumentException("Category id must not be null");
            }
            // Resolve relation by id and fail clearly if not found.
            Category category = categoryRepository.findById(book.getCategory().getId())
                    .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thể loại với id = " + book.getCategory().getId()));
            book.setCategory(category);
        }

        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book newBook) {
        Book oldBook = bookRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sách với id = " + id));
        boolean isChanged = false;

        // Update only if the new value is provided and different.
        if (newBook.getTitle() != null && !Objects.equals(oldBook.getTitle(), newBook.getTitle())) {
            oldBook.setTitle(newBook.getTitle());
            isChanged = true;
        }

        if (newBook.getDescription() != null && !Objects.equals(oldBook.getDescription(), newBook.getDescription())) {
            oldBook.setDescription(newBook.getDescription());
            isChanged = true;
        }

        if (newBook.getPublisher() != null && !Objects.equals(oldBook.getPublisher(), newBook.getPublisher())) {
            oldBook.setPublisher(newBook.getPublisher());
            isChanged = true;
        }

        if (newBook.getPublishYear() != null && !Objects.equals(oldBook.getPublishYear(), newBook.getPublishYear())) {
            oldBook.setPublishYear(newBook.getPublishYear());
            isChanged = true;
        }

        if (newBook.getQuantity() != null && !Objects.equals(oldBook.getQuantity(), newBook.getQuantity())) {
            oldBook.setQuantity(newBook.getQuantity());
            isChanged = true;
        }

        if (newBook.getAvailableQuantity() != null && !Objects.equals(oldBook.getAvailableQuantity(), newBook.getAvailableQuantity())) {
            oldBook.setAvailableQuantity(newBook.getAvailableQuantity());
            isChanged = true;
        }

        if (newBook.getAuthor() != null) {
            if (newBook.getAuthor().getId() == null) {
                throw new IllegalArgumentException("Author id must not be null");
            }

            Long oldAuthorId = oldBook.getAuthor() != null ? oldBook.getAuthor().getId() : null;
            Long newAuthorId = newBook.getAuthor().getId();
            if (!Objects.equals(oldAuthorId, newAuthorId)) {
                Author author = authorRepository.findById(newAuthorId)
                        .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tác giả với id = " + newAuthorId));
                oldBook.setAuthor(author);
                isChanged = true;
            }
        }

        if (newBook.getCategory() != null) {
            if (newBook.getCategory().getId() == null) {
                throw new IllegalArgumentException("Category id must not be null");
            }

            Long oldCategoryId = oldBook.getCategory() != null ? oldBook.getCategory().getId() : null;
            Long newCategoryId = newBook.getCategory().getId();
            if (!Objects.equals(oldCategoryId, newCategoryId)) {
                Category category = categoryRepository.findById(newCategoryId)
                        .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thể loại với id = " + newCategoryId));
                oldBook.setCategory(category);
                isChanged = true;
            }
        }

        return isChanged ? bookRepository.save(oldBook) : oldBook;
    }

    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new NoSuchElementException("Không tìm thấy sách với id = " + id);
        }
        bookRepository.deleteById(id);
    }

    public List<Book> searchBooksByTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title must not be empty");
        }
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Book> getBooksByAuthorId(Long authorId) {
        authorRepository.findById(authorId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tác giả với id = " + authorId));
        return bookRepository.findByAuthorId(authorId);
    }

    public List<Book> getBooksByCategoryId(Long categoryId) {
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thể loại với id = " + categoryId));
        return bookRepository.findByCategoryId(categoryId);
    }
}
