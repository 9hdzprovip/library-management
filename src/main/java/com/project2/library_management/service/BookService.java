package com.project2.library_management.service;

import com.project2.library_management.dto.request.BookRequest;
import com.project2.library_management.dto.response.BookResponse;
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
import java.util.stream.Collectors;

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

    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public BookResponse getBookById(Long id) {
        // Do not return null when record is missing.
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sách với id = " + id));
        return convertToResponse(book);
    }

    public BookResponse createBook(BookRequest request) {
        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setDescription(request.getDescription());
        book.setPublisher(request.getPublisher());
        book.setPublishYear(request.getPublishYear());
        book.setQuantity(request.getQuantity());
        book.setAvailableQuantity(request.getAvailableQuantity());

        // Validate availableQuantity <= quantity
        if (request.getAvailableQuantity() > request.getQuantity()) {
            throw new IllegalArgumentException("Số lượng sách còn lại không được lớn hơn tổng số lượng sách");
        }

        // Resolve author
        Author author = authorRepository.findById(request.getAuthorId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tác giả với id = " + request.getAuthorId()));
        book.setAuthor(author);

        // Resolve category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thể loại với id = " + request.getCategoryId()));
        book.setCategory(category);

        Book savedBook = bookRepository.save(book);
        return convertToResponse(savedBook);
    }

    public BookResponse updateBook(Long id, BookRequest request) {
        Book oldBook = bookRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sách với id = " + id));
        boolean isChanged = false;

        // Update only if the new value is provided and different.
        if (request.getTitle() != null && !Objects.equals(oldBook.getTitle(), request.getTitle())) {
            oldBook.setTitle(request.getTitle());
            isChanged = true;
        }

        if (request.getDescription() != null && !Objects.equals(oldBook.getDescription(), request.getDescription())) {
            oldBook.setDescription(request.getDescription());
            isChanged = true;
        }

        if (request.getPublisher() != null && !Objects.equals(oldBook.getPublisher(), request.getPublisher())) {
            oldBook.setPublisher(request.getPublisher());
            isChanged = true;
        }

        if (request.getPublishYear() != null && !Objects.equals(oldBook.getPublishYear(), request.getPublishYear())) {
            oldBook.setPublishYear(request.getPublishYear());
            isChanged = true;
        }

        if (request.getQuantity() != null && !Objects.equals(oldBook.getQuantity(), request.getQuantity())) {
            oldBook.setQuantity(request.getQuantity());
            isChanged = true;
        }

        if (request.getAvailableQuantity() != null && !Objects.equals(oldBook.getAvailableQuantity(), request.getAvailableQuantity())) {
            oldBook.setAvailableQuantity(request.getAvailableQuantity());
            isChanged = true;
        }

        // Validate availableQuantity <= quantity
        if (oldBook.getAvailableQuantity() > oldBook.getQuantity()) {
            throw new IllegalArgumentException("Số lượng sách còn lại không được lớn hơn tổng số lượng sách");
        }

        // Update author if authorId provided
        if (request.getAuthorId() != null) {
            Long oldAuthorId = oldBook.getAuthor() != null ? oldBook.getAuthor().getId() : null;
            if (!Objects.equals(oldAuthorId, request.getAuthorId())) {
                Author author = authorRepository.findById(request.getAuthorId())
                        .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tác giả với id = " + request.getAuthorId()));
                oldBook.setAuthor(author);
                isChanged = true;
            }
        }

        // Update category if categoryId provided
        if (request.getCategoryId() != null) {
            Long oldCategoryId = oldBook.getCategory() != null ? oldBook.getCategory().getId() : null;
            if (!Objects.equals(oldCategoryId, request.getCategoryId())) {
                Category category = categoryRepository.findById(request.getCategoryId())
                        .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thể loại với id = " + request.getCategoryId()));
                oldBook.setCategory(category);
                isChanged = true;
            }
        }

        Book savedBook = isChanged ? bookRepository.save(oldBook) : oldBook;
        return convertToResponse(savedBook);
    }

    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new NoSuchElementException("Không tìm thấy sách với id = " + id);
        }
        bookRepository.deleteById(id);
    }

    public List<BookResponse> searchBooksByTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Tiêu đề sách không được để trống");
        }
        return bookRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BookResponse> getBooksByAuthorId(Long authorId) {
        authorRepository.findById(authorId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tác giả với id = " + authorId));
        return bookRepository.findByAuthorId(authorId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BookResponse> getBooksByCategoryId(Long categoryId) {
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thể loại với id = " + categoryId));
        return bookRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private BookResponse convertToResponse(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getDescription(),
                book.getPublisher(),
                book.getPublishYear(),
                book.getQuantity(),
                book.getAvailableQuantity(),
                book.getAuthor() != null ? book.getAuthor().getId() : null,
                book.getAuthor() != null ? book.getAuthor().getName() : null,
                book.getCategory() != null ? book.getCategory().getId() : null,
                book.getCategory() != null ? book.getCategory().getName() : null,
                book.getCreatedAt()
        );
    }
}
