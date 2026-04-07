package com.project2.library_management.service;

import com.project2.library_management.entity.Book;
import com.project2.library_management.entity.BorrowRecord;
import com.project2.library_management.entity.User;
import com.project2.library_management.repository.BookRepository;
import com.project2.library_management.repository.BorrowRecordRepository;
import com.project2.library_management.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

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
		Optional<BorrowRecord> optionalBorrowRecord = borrowRecordRepository.findById(id);
		return optionalBorrowRecord.orElse(null);
	}

	public BorrowRecord createBorrowRecord(BorrowRecord borrowRecord) {
		if (borrowRecord.getUser() != null && borrowRecord.getUser().getId() != null) {
			Optional<User> optionalUser = userRepository.findById(borrowRecord.getUser().getId());
			if (optionalUser.isPresent()) {
				borrowRecord.setUser(optionalUser.get());
			} else {
				throw new RuntimeException("Không tìm thấy user với id = " + borrowRecord.getUser().getId());
			}
		}

		if (borrowRecord.getBook() != null && borrowRecord.getBook().getId() != null) {
			Optional<Book> optionalBook = bookRepository.findById(borrowRecord.getBook().getId());
			if (optionalBook.isPresent()) {
				borrowRecord.setBook(optionalBook.get());
			} else {
				throw new RuntimeException("Không tìm thấy book với id = " + borrowRecord.getBook().getId());
			}
		}

		return borrowRecordRepository.save(borrowRecord);
	}

	public BorrowRecord updateBorrowRecord(Long id, BorrowRecord newBorrowRecord) {
		Optional<BorrowRecord> optionalBorrowRecord = borrowRecordRepository.findById(id);

		if (optionalBorrowRecord.isPresent()) {
			BorrowRecord oldBorrowRecord = optionalBorrowRecord.get();
			boolean isChanged = false;

			if (!Objects.equals(oldBorrowRecord.getBorrowDate(), newBorrowRecord.getBorrowDate())) {
				oldBorrowRecord.setBorrowDate(newBorrowRecord.getBorrowDate());
				isChanged = true;
			}

			if (!Objects.equals(oldBorrowRecord.getDueDate(), newBorrowRecord.getDueDate())) {
				oldBorrowRecord.setDueDate(newBorrowRecord.getDueDate());
				isChanged = true;
			}

			if (!Objects.equals(oldBorrowRecord.getReturnDate(), newBorrowRecord.getReturnDate())) {
				oldBorrowRecord.setReturnDate(newBorrowRecord.getReturnDate());
				isChanged = true;
			}

			if (!Objects.equals(oldBorrowRecord.getStatus(), newBorrowRecord.getStatus())) {
				oldBorrowRecord.setStatus(newBorrowRecord.getStatus());
				isChanged = true;
			}

			if (newBorrowRecord.getUser() != null && newBorrowRecord.getUser().getId() != null) {
				Long oldUserId = oldBorrowRecord.getUser() != null ? oldBorrowRecord.getUser().getId() : null;
				Long newUserId = newBorrowRecord.getUser().getId();

				if (!Objects.equals(oldUserId, newUserId)) {
					Optional<User> optionalUser = userRepository.findById(newUserId);
					if (optionalUser.isPresent()) {
						oldBorrowRecord.setUser(optionalUser.get());
						isChanged = true;
					} else {
						return null;
					}
				}
			}

			if (newBorrowRecord.getBook() != null && newBorrowRecord.getBook().getId() != null) {
				Long oldBookId = oldBorrowRecord.getBook() != null ? oldBorrowRecord.getBook().getId() : null;
				Long newBookId = newBorrowRecord.getBook().getId();

				if (!Objects.equals(oldBookId, newBookId)) {
					Optional<Book> optionalBook = bookRepository.findById(newBookId);
					if (optionalBook.isPresent()) {
						oldBorrowRecord.setBook(optionalBook.get());
						isChanged = true;
					} else {
						return null;
					}
				}
			}

			if (isChanged) {
				return borrowRecordRepository.save(oldBorrowRecord);
			} else {
				System.out.println("Không có gì thay đổi");
				return oldBorrowRecord;
			}
		}

		return null;
	}

	public String deleteBorrowRecord(Long id) {
		Optional<BorrowRecord> optionalBorrowRecord = borrowRecordRepository.findById(id);

		if (optionalBorrowRecord.isPresent()) {
			borrowRecordRepository.deleteById(id);
			return "Xóa borrow record thành công";
		}

		return "Không tìm thấy borrow record";
	}
}
