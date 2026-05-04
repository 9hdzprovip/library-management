package com.project2.library_management.controller;

import com.project2.library_management.dto.BorrowBookRequest;
import com.project2.library_management.entity.BorrowRecord;
import com.project2.library_management.service.BorrowRecordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

	@GetMapping("/{id}")
	public ResponseEntity<BorrowRecord> getBorrowRecordById(@PathVariable Long id) {
		return ResponseEntity.ok(borrowRecordService.getBorrowRecordById(id));
	}

	@PostMapping("/borrow")
	public ResponseEntity<BorrowRecord> borrowBook(@RequestBody BorrowBookRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(borrowRecordService.borrowBook(request));
	}

	@PutMapping("/{id}/return")
	public ResponseEntity<BorrowRecord> returnBook(@PathVariable Long id) {
		return ResponseEntity.ok(borrowRecordService.returnBook(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<BorrowRecord> updateBorrowRecord(@PathVariable Long id, @RequestBody BorrowRecord borrowRecord) {
		return ResponseEntity.ok(borrowRecordService.updateBorrowRecord(id, borrowRecord));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> deleteBorrowRecord(@PathVariable Long id) {
		borrowRecordService.deleteBorrowRecord(id);

		Map<String, String> response = new HashMap<>();
		response.put("message", "Delete borrow record successfully");
		return ResponseEntity.ok(response);
	}
}
