package com.project2.library_management.service;

import com.project2.library_management.dto.BorrowBookRequest;
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
import java.util.Objects;

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

    public List<BorrowRecord> getAllBorrowRecords() {
        return borrowRecordRepository.findAll();
    }

    public BorrowRecord getBorrowRecordById(Long id) {
        // Do not return null when record is missing.
        return borrowRecordRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy phiếu mượn với id = " + id));
    }

    @Transactional
    public BorrowRecord borrowBook(BorrowBookRequest request) {
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
            throw new IllegalArgumentException("Ngày hẹn trả không được trước ngày mượn");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng với id = " + request.getUserId()));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sách với id = " + request.getBookId()));

        if (book.getAvailableQuantity() == null || book.getAvailableQuantity() <= 0) {
            throw new IllegalArgumentException("Sách hiện không còn bản nào để mượn");
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

        return borrowRecordRepository.save(borrowRecord);
    }

    @Transactional
    public BorrowRecord returnBook(Long id) {
        BorrowRecord borrowRecord = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy phiếu mượn với id = " + id));

        if (borrowRecord.getStatus() == BorrowStatus.RETURNED) {
            throw new IllegalArgumentException("Phiếu mượn này đã được trả trước đó");
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
            throw new IllegalArgumentException("Số lượng sách còn lại không được lớn hơn tổng số lượng sách");
        }

        book.setAvailableQuantity(currentAvailableQuantity + 1);
        bookRepository.save(book);

        borrowRecord.setReturnDate(LocalDate.now());
        borrowRecord.setStatus(BorrowStatus.RETURNED);

        return borrowRecordRepository.save(borrowRecord);
    }

    @Transactional
    public List<BorrowRecord> updateOverdueBorrowRecords() {
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

        return overdueRecords;
    }

    public BorrowRecord updateBorrowRecord(Long id, BorrowRecord newBorrowRecord) {
        BorrowRecord oldBorrowRecord = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy phiếu mượn với id = " + id));
        boolean isChanged = false;

        // Update only if the new value is provided and different.
        if (newBorrowRecord.getBorrowDate() != null && !Objects.equals(oldBorrowRecord.getBorrowDate(), newBorrowRecord.getBorrowDate())) {
            oldBorrowRecord.setBorrowDate(newBorrowRecord.getBorrowDate());
            isChanged = true;
        }

        if (newBorrowRecord.getDueDate() != null && !Objects.equals(oldBorrowRecord.getDueDate(), newBorrowRecord.getDueDate())) {
            oldBorrowRecord.setDueDate(newBorrowRecord.getDueDate());
            isChanged = true;
        }

        if (newBorrowRecord.getReturnDate() != null && !Objects.equals(oldBorrowRecord.getReturnDate(), newBorrowRecord.getReturnDate())) {
            oldBorrowRecord.setReturnDate(newBorrowRecord.getReturnDate());
            isChanged = true;
        }

        if (newBorrowRecord.getStatus() != null && !Objects.equals(oldBorrowRecord.getStatus(), newBorrowRecord.getStatus())) {
            oldBorrowRecord.setStatus(newBorrowRecord.getStatus());
            isChanged = true;
        }

        if (newBorrowRecord.getUser() != null) {
            if (newBorrowRecord.getUser().getId() == null) {
                throw new IllegalArgumentException("User id must not be null");
            }

            Long oldUserId = oldBorrowRecord.getUser() != null ? oldBorrowRecord.getUser().getId() : null;
            Long newUserId = newBorrowRecord.getUser().getId();
            if (!Objects.equals(oldUserId, newUserId)) {
                User user = userRepository.findById(newUserId)
                        .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng với id = " + newUserId));
                oldBorrowRecord.setUser(user);
                isChanged = true;
            }
        }

        if (newBorrowRecord.getBook() != null) {
            if (newBorrowRecord.getBook().getId() == null) {
                throw new IllegalArgumentException("Book id must not be null");
            }

            Long oldBookId = oldBorrowRecord.getBook() != null ? oldBorrowRecord.getBook().getId() : null;
            Long newBookId = newBorrowRecord.getBook().getId();
            if (!Objects.equals(oldBookId, newBookId)) {
                Book book = bookRepository.findById(newBookId)
                        .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sách với id = " + newBookId));
                oldBorrowRecord.setBook(book);
                isChanged = true;
            }
        }

        return isChanged ? borrowRecordRepository.save(oldBorrowRecord) : oldBorrowRecord;
    }

    public void deleteBorrowRecord(Long id) {
        if (!borrowRecordRepository.existsById(id)) {
            throw new NoSuchElementException("Không tìm thấy phiếu mượn với id = " + id);
        }
        borrowRecordRepository.deleteById(id);
    }

    public List<BorrowRecord> getBorrowRecordsByUserId(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng với id = " + userId));
        return borrowRecordRepository.findByUserId(userId);
    }

    public List<BorrowRecord> getBorrowRecordsByStatus(String statusStr) {
        BorrowStatus status;
        try {
            status = BorrowStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + statusStr + ". Giá trị hợp lệ: BORROWED, RETURNED, OVERDUE");
        }
        return borrowRecordRepository.findByStatus(status);
    }
}
