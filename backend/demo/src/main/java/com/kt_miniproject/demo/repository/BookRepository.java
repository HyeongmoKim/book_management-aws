package com.kt_miniproject.demo.repository;

import com.kt_miniproject.demo.domain.book.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    // 제목 LIKE 검색 (대소문자 무시)
    List<Book> findByTitleContainingIgnoreCase(String title);
    List<Book> findByUserId(Long id);
}