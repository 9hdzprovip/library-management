package com.project2.library_management.controller;

import com.project2.library_management.dto.BorrowBookRequest;
import com.project2.library_management.dto.response.MessageResponse;
import com.project2.library_management.entity.BorrowRecord;
import com.project2.library_management.service.BorrowRecordService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/borrow-records")
public class BorrowRecordController {

	private final BorrowRecordService borrowRecordService;

	public BorrowRecordController(BorrowRecordService borrowRecordService) {
		this.borrowRecordService = borrowRecordService;
	}

	@GetMapping
	public ResponseEntity<List<BorrowRecord>> getAllBorrowRecords() {
		return ResponseEntity.ok(borrowRecordService.getAllBorrowRecords());
	}

	@GetMapping("/status/{status}")
	public ResponseEntity<List<BorrowRecord>> getBorrowRecordsByStatus(@PathVariable String status) {
		return ResponseEntity.ok(borrowRecordService.getBorrowRecordsByStatus(status));
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<List<BorrowRecord>> getBorrowRecordsByUserId(@PathVariable Long userId) {
		return ResponseEntity.ok(borrowRecordService.getBorrowRecordsByUserId(userId));
	}

	@GetMapping("/{id}")
	public ResponseEntity<BorrowRecord> getBorrowRecordById(@PathVariable Long id) {
		return ResponseEntity.ok(borrowRecordService.getBorrowRecordById(id));
	}

	@PostMapping("/borrow")
	public ResponseEntity<BorrowRecord> borrowBook(@Valid @RequestBody BorrowBookRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(borrowRecordService.borrowBook(request));
	}

	@PutMapping("/{id}/return")
	public ResponseEntity<BorrowRecord> returnBook(@PathVariable Long id) {
		return ResponseEntity.ok(borrowRecordService.returnBook(id));
	}

	@PutMapping("/update-overdue")
	public ResponseEntity<List<BorrowRecord>> updateOverdueBorrowRecords() {
		return ResponseEntity.ok(borrowRecordService.updateOverdueBorrowRecords());
	}

	@PutMapping("/{id}")
	public ResponseEntity<BorrowRecord> updateBorrowRecord(@PathVariable Long id, @RequestBody BorrowRecord borrowRecord) {
		return ResponseEntity.ok(borrowRecordService.updateBorrowRecord(id, borrowRecord));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<MessageResponse> deleteBorrowRecord(@PathVariable Long id) {
		borrowRecordService.deleteBorrowRecord(id);
		return ResponseEntity.ok(new MessageResponse("Xóa phiếu mượn thành công"));
	}
}
