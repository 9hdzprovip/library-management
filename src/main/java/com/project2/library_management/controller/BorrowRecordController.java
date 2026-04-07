package com.project2.library_management.controller;

import com.project2.library_management.entity.BorrowRecord;
import com.project2.library_management.service.BorrowRecordService;
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
	public List<BorrowRecord> getAllBorrowRecords() {
		return borrowRecordService.getAllBorrowRecords();
	}

	@GetMapping("/{id}")
	public BorrowRecord getBorrowRecordById(@PathVariable Long id) {
		return borrowRecordService.getBorrowRecordById(id);
	}

	@PostMapping
	public BorrowRecord createBorrowRecord(@RequestBody BorrowRecord borrowRecord) {
		return borrowRecordService.createBorrowRecord(borrowRecord);
	}

	@PutMapping("/{id}")
	public BorrowRecord updateBorrowRecord(@PathVariable Long id, @RequestBody BorrowRecord borrowRecord) {
		return borrowRecordService.updateBorrowRecord(id, borrowRecord);
	}

	@DeleteMapping("/{id}")
	public String deleteBorrowRecord(@PathVariable Long id) {
		return borrowRecordService.deleteBorrowRecord(id);
	}
}
