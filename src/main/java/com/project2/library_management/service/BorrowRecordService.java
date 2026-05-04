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
                .orElseThrow(() -> new NoSuchElementException("Borrow record not found with id = " + id));
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

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NoSuchElementException("User not found with id = " + request.getUserId()));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new NoSuchElementException("Book not found with id = " + request.getBookId()));

        if (book.getAvailableQuantity() == null || book.getAvailableQuantity() <= 0) {
            throw new IllegalArgumentException("Book is out of stock, cannot borrow");
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

    public BorrowRecord updateBorrowRecord(Long id, BorrowRecord newBorrowRecord) {
        BorrowRecord oldBorrowRecord = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Borrow record not found with id = " + id));
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
                        .orElseThrow(() -> new NoSuchElementException("User not found with id = " + newUserId));
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
                        .orElseThrow(() -> new NoSuchElementException("Book not found with id = " + newBookId));
                oldBorrowRecord.setBook(book);
                isChanged = true;
            }
        }

        return isChanged ? borrowRecordRepository.save(oldBorrowRecord) : oldBorrowRecord;
    }

    public String deleteBorrowRecord(Long id) {
        if (!borrowRecordRepository.existsById(id)) {
            return "Khong tim thay borrow record";
        }

        borrowRecordRepository.deleteById(id);
        return "Xoa borrow record thanh cong";
    }
}
