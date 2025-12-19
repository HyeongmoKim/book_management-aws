package com.kt_miniproject.demo.repository;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.recommend.BookRecommend;
import com.kt_miniproject.demo.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRecommendRepository extends JpaRepository<BookRecommend, Long> {

    boolean existsByUserAndBook(User user, Book book);

    long countByBook(Book book);
}
