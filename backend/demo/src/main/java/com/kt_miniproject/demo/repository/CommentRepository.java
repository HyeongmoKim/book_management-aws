package com.kt_miniproject.demo.repository;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.comment.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 특정 도서(book)에 달린 댓글 목록 조회
    List<Comment> findByBook(Book book);
    List<Comment> findByBookId(Long bookId);
}
