package com.project2.library_management.service;

import com.project2.library_management.dto.request.BorrowRecordUpdateRequest;
import com.project2.library_management.dto.request.BorrowBookRequest;
import com.project2.library_management.dto.response.BorrowRecordResponse;
import com.project2.library_management.dto.response.UpdateResponse;
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
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy phiếu mượn với id = " + id));
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

        BorrowRecord savedRecord = borrowRecordRepository.save(borrowRecord);
        return convertToResponse(savedRecord);
    }

    @Transactional
    public BorrowRecordResponse returnBook(Long id) {
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

    public UpdateResponse<BorrowRecordResponse> updateBorrowRecord(Long id, BorrowRecordUpdateRequest request) {
        BorrowRecord oldBorrowRecord = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy phiếu mượn với id = " + id));
        boolean isChanged = false;

        if (request.getBorrowDate() != null && !Objects.equals(oldBorrowRecord.getBorrowDate(), request.getBorrowDate())) {
            oldBorrowRecord.setBorrowDate(request.getBorrowDate());
            isChanged = true;
        }

        if (request.getDueDate() != null && !Objects.equals(oldBorrowRecord.getDueDate(), request.getDueDate())) {
            oldBorrowRecord.setDueDate(request.getDueDate());
            isChanged = true;
        }

        if (request.getReturnDate() != null && !Objects.equals(oldBorrowRecord.getReturnDate(), request.getReturnDate())) {
            oldBorrowRecord.setReturnDate(request.getReturnDate());
            isChanged = true;
        }

        if (request.getStatus() != null && !Objects.equals(oldBorrowRecord.getStatus(), request.getStatus())) {
            oldBorrowRecord.setStatus(request.getStatus());
            isChanged = true;
        }

        if (request.getUserId() != null) {
            Long oldUserId = oldBorrowRecord.getUser() != null ? oldBorrowRecord.getUser().getId() : null;
            if (!Objects.equals(oldUserId, request.getUserId())) {
                User user = userRepository.findById(request.getUserId())
                        .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng với id = " + request.getUserId()));
                oldBorrowRecord.setUser(user);
                isChanged = true;
            }
        }

        if (request.getBookId() != null) {
            Long oldBookId = oldBorrowRecord.getBook() != null ? oldBorrowRecord.getBook().getId() : null;
            if (!Objects.equals(oldBookId, request.getBookId())) {
                Book book = bookRepository.findById(request.getBookId())
                        .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sách với id = " + request.getBookId()));
                oldBorrowRecord.setBook(book);
                isChanged = true;
            }
        }

        BorrowRecord savedRecord = isChanged ? borrowRecordRepository.save(oldBorrowRecord) : oldBorrowRecord;
        String message = isChanged ? "Cập nhật phiếu mượn thành công" : "Không có gì thay đổi";
        return new UpdateResponse<>(message, isChanged, convertToResponse(savedRecord));
    }

    public void deleteBorrowRecord(Long id) {
        if (!borrowRecordRepository.existsById(id)) {
            throw new NoSuchElementException("Không tìm thấy phiếu mượn với id = " + id);
        }
        borrowRecordRepository.deleteById(id);
    }

    public List<BorrowRecordResponse> getBorrowRecordsByUserId(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng với id = " + userId));
        return borrowRecordRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BorrowRecordResponse> getMyBorrowRecords(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

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
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + statusStr + ". Giá trị hợp lệ: BORROWED, RETURNED, OVERDUE");
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
