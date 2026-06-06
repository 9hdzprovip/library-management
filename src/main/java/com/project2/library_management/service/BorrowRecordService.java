package com.project2.library_management.service;

import com.project2.library_management.dto.request.BorrowBookRequest;
import com.project2.library_management.dto.response.BorrowRecordResponse;
import com.project2.library_management.entity.Book;
import com.project2.library_management.entity.BorrowRecord;
import com.project2.library_management.entity.User;
import com.project2.library_management.enums.BorrowStatus;
import com.project2.library_management.repository.BookRepository;
import com.project2.library_management.repository.BorrowRecordRepository;
import com.project2.library_management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class BorrowRecordService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public BorrowRecordService(BorrowRecordRepository borrowRecordRepository,
                               UserRepository userRepository,
                               BookRepository bookRepository) {
        this.borrowRecordRepository = borrowRecordRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    public List<BorrowRecordResponse> getAllBorrowRecords() {
        return borrowRecordRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public BorrowRecordResponse getBorrowRecordById(Long id) {
        BorrowRecord borrowRecord = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Kh\u00f4ng t\u00ecm th\u1ea5y phi\u1ebfu m\u01b0\u1ee3n v\u1edbi id = " + id));
        return convertToResponse(borrowRecord);
    }

    @Transactional
    public BorrowRecordResponse borrowBook(BorrowBookRequest request) {
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("User id must not be null");
        }

        if (request.getBookId() == null) {
            throw new IllegalArgumentException("Book id must not be null");
        }

        if (request.getDueDate() == null) {
            throw new IllegalArgumentException("Due date must not be null");
        }

        LocalDate today = LocalDate.now();
        if (request.getDueDate().isBefore(today)) {
            throw new IllegalArgumentException("Ng\u00e0y h\u1eb9n tr\u1ea3 kh\u00f4ng \u0111\u01b0\u1ee3c tr\u01b0\u1edbc ng\u00e0y m\u01b0\u1ee3n");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NoSuchElementException("Kh\u00f4ng t\u00ecm th\u1ea5y ng\u01b0\u1eddi d\u00f9ng v\u1edbi id = " + request.getUserId()));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new NoSuchElementException("Kh\u00f4ng t\u00ecm th\u1ea5y s\u00e1ch v\u1edbi id = " + request.getBookId()));

        if (book.getAvailableQuantity() == null || book.getAvailableQuantity() <= 0) {
            throw new IllegalArgumentException("S\u00e1ch hi\u1ec7n kh\u00f4ng c\u00f2n b\u1ea3n n\u00e0o \u0111\u1ec3 m\u01b0\u1ee3n");
        }

        book.setAvailableQuantity(book.getAvailableQuantity() - 1);
        bookRepository.save(book);

        BorrowRecord borrowRecord = new BorrowRecord();
        borrowRecord.setUser(user);
        borrowRecord.setBook(book);
        borrowRecord.setBorrowDate(LocalDate.now());
        borrowRecord.setDueDate(request.getDueDate());
        borrowRecord.setReturnDate(null);
        borrowRecord.setStatus(BorrowStatus.BORROWED);

        BorrowRecord savedRecord = borrowRecordRepository.save(borrowRecord);
        return convertToResponse(savedRecord);
    }

    @Transactional
    public BorrowRecordResponse returnBook(Long id) {
        BorrowRecord borrowRecord = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Kh\u00f4ng t\u00ecm th\u1ea5y phi\u1ebfu m\u01b0\u1ee3n v\u1edbi id = " + id));

        if (borrowRecord.getStatus() == BorrowStatus.RETURNED) {
            throw new IllegalArgumentException("Phi\u1ebfu m\u01b0\u1ee3n n\u00e0y \u0111\u00e3 \u0111\u01b0\u1ee3c tr\u1ea3 tr\u01b0\u1edbc \u0111\u00f3");
        }

        Book book = borrowRecord.getBook();
        if (book == null) {
            throw new IllegalArgumentException("Borrow record does not have a book to return");
        }

        Integer currentAvailableQuantity = book.getAvailableQuantity();
        Integer bookQuantity = book.getQuantity();

        if (currentAvailableQuantity == null) {
            currentAvailableQuantity = 0;
        }

        if (bookQuantity != null && currentAvailableQuantity >= bookQuantity) {
            throw new IllegalArgumentException("S\u1ed1 l\u01b0\u1ee3ng s\u00e1ch c\u00f2n l\u1ea1i kh\u00f4ng \u0111\u01b0\u1ee3c l\u1edbn h\u01a1n t\u1ed5ng s\u1ed1 l\u01b0\u1ee3ng s\u00e1ch");
        }

        book.setAvailableQuantity(currentAvailableQuantity + 1);
        bookRepository.save(book);

        borrowRecord.setReturnDate(LocalDate.now());
        borrowRecord.setStatus(BorrowStatus.RETURNED);

        BorrowRecord savedRecord = borrowRecordRepository.save(borrowRecord);
        return convertToResponse(savedRecord);
    }

    @Transactional
    public List<BorrowRecordResponse> updateOverdueBorrowRecords() {
        LocalDate today = LocalDate.now();
        List<BorrowRecord> borrowedRecords = borrowRecordRepository.findByStatus(BorrowStatus.BORROWED);
        List<BorrowRecord> overdueRecords = new java.util.ArrayList<>();

        for (BorrowRecord borrowRecord : borrowedRecords) {
            if (borrowRecord.getDueDate() != null && borrowRecord.getDueDate().isBefore(today)) {
                borrowRecord.setStatus(BorrowStatus.OVERDUE);
                overdueRecords.add(borrowRecord);
            }
        }

        if (!overdueRecords.isEmpty()) {
            borrowRecordRepository.saveAll(overdueRecords);
        }

        return overdueRecords.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public void deleteBorrowRecord(Long id) {
        if (!borrowRecordRepository.existsById(id)) {
            throw new NoSuchElementException("Kh\u00f4ng t\u00ecm th\u1ea5y phi\u1ebfu m\u01b0\u1ee3n v\u1edbi id = " + id);
        }
        borrowRecordRepository.deleteById(id);
    }

    public List<BorrowRecordResponse> getBorrowRecordsByUserId(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Kh\u00f4ng t\u00ecm th\u1ea5y ng\u01b0\u1eddi d\u00f9ng v\u1edbi id = " + userId));
        return borrowRecordRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BorrowRecordResponse> getMyBorrowRecords(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("Kh\u00f4ng t\u00ecm th\u1ea5y ng\u01b0\u1eddi d\u00f9ng"));

        return borrowRecordRepository.findByUserId(user.getId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BorrowRecordResponse> getBorrowRecordsByStatus(String statusStr) {
        BorrowStatus status;
        try {
            status = BorrowStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Tr\u1ea1ng th\u00e1i kh\u00f4ng h\u1ee3p l\u1ec7: " + statusStr + ". Gi\u00e1 tr\u1ecb h\u1ee3p l\u1ec7: BORROWED, RETURNED, OVERDUE");
        }
        return borrowRecordRepository.findByStatus(status)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private BorrowRecordResponse convertToResponse(BorrowRecord record) {
        return new BorrowRecordResponse(
                record.getId(),
                record.getUser() != null ? record.getUser().getId() : null,
                record.getUser() != null ? record.getUser().getUsername() : null,
                record.getUser() != null ? record.getUser().getFullName() : null,
                record.getBook() != null ? record.getBook().getId() : null,
                record.getBook() != null ? record.getBook().getTitle() : null,
                record.getBorrowDate(),
                record.getDueDate(),
                record.getReturnDate(),
                record.getStatus(),
                record.getCreatedAt()
        );
    }
}
