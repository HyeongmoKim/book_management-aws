package com.kt_miniproject.demo.service;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.comment.Comment;
import com.kt_miniproject.demo.domain.recommend.BookRecommend;
import com.kt_miniproject.demo.domain.recommend.CommentRecommend;
import com.kt_miniproject.demo.domain.user.User;
import com.kt_miniproject.demo.exception.ResourceNotFoundException;
import com.kt_miniproject.demo.repository.BookRecommendRepository;
import com.kt_miniproject.demo.repository.BookRepository;
import com.kt_miniproject.demo.repository.CommentRecommendRepository;
import com.kt_miniproject.demo.repository.CommentRepository;
import com.kt_miniproject.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)   // ⭐ 기본은 조회 트랜잭션
public class RecommendServiceImpl implements RecommendService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final CommentRepository commentRepository;
    private final BookRecommendRepository bookRecommendRepository;
    private final CommentRecommendRepository commentRecommendRepository;

    /**
     * 도서 추천 (쓰기 트랜잭션)
     */
    @Override
    @Transactional   // ⭐ 반드시 readOnly=false로 별도 트랜잭션 적용
    public void recommendBook(Long bookId, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        // 중복 추천 방지
        if (bookRecommendRepository.existsByUserAndBook(user, book)) {
            throw new IllegalStateException("이미 추천한 도서입니다.");
        }

        // 추천 저장
        bookRecommendRepository.save(
                BookRecommend.builder()
                        .user(user)
                        .book(book)
                        .build()
        );
    }

    /**
     * 댓글 추천 (쓰기 트랜잭션)
     */
    @Override
    @Transactional   // ⭐ 마찬가지로 write 트랜잭션
    public void recommendComment(Long commentId, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (commentRecommendRepository.existsByUserAndComment(user, comment)) {
            throw new IllegalStateException("이미 추천한 댓글입니다.");
        }

        commentRecommendRepository.save(
                CommentRecommend.builder()
                        .user(user)
                        .comment(comment)
                        .build()
        );
    }
}
