package com.project2.library_management.controller;

import com.project2.library_management.dto.BorrowBookRequest;
import com.project2.library_management.dto.response.BorrowRecordResponse;
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
	public ResponseEntity<List<BorrowRecordResponse>> getAllBorrowRecords() {
		return ResponseEntity.ok(borrowRecordService.getAllBorrowRecords());
	}

	@GetMapping("/status/{status}")
	public ResponseEntity<List<BorrowRecordResponse>> getBorrowRecordsByStatus(@PathVariable String status) {
		return ResponseEntity.ok(borrowRecordService.getBorrowRecordsByStatus(status));
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<List<BorrowRecordResponse>> getBorrowRecordsByUserId(@PathVariable Long userId) {
		return ResponseEntity.ok(borrowRecordService.getBorrowRecordsByUserId(userId));
	}

	@GetMapping("/{id}")
	public ResponseEntity<BorrowRecordResponse> getBorrowRecordById(@PathVariable Long id) {
		return ResponseEntity.ok(borrowRecordService.getBorrowRecordById(id));
	}

	@PostMapping("/borrow")
	public ResponseEntity<BorrowRecordResponse> borrowBook(@Valid @RequestBody BorrowBookRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(borrowRecordService.borrowBook(request));
	}

	@PutMapping("/{id}/return")
	public ResponseEntity<BorrowRecordResponse> returnBook(@PathVariable Long id) {
		return ResponseEntity.ok(borrowRecordService.returnBook(id));
	}

	@PutMapping("/update-overdue")
	public ResponseEntity<List<BorrowRecordResponse>> updateOverdueBorrowRecords() {
		return ResponseEntity.ok(borrowRecordService.updateOverdueBorrowRecords());
	}

	@PutMapping("/{id}")
	public ResponseEntity<BorrowRecordResponse> updateBorrowRecord(@PathVariable Long id, @RequestBody BorrowRecord borrowRecord) {
		return ResponseEntity.ok(borrowRecordService.updateBorrowRecord(id, borrowRecord));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<MessageResponse> deleteBorrowRecord(@PathVariable Long id) {
		borrowRecordService.deleteBorrowRecord(id);
		return ResponseEntity.ok(new MessageResponse("Xóa phiếu mượn thành công"));
	}
}
