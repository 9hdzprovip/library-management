package com.project2.library_management.repository;


import com.project2.library_management.entity.BorrowRecord;
import com.project2.library_management.enums.BorrowStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
	List<BorrowRecord> findByStatus(BorrowStatus status);
	List<BorrowRecord> findByUserId(Long userId);
}