package com.kt_miniproject.demo.service;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.comment.Comment;
import com.kt_miniproject.demo.domain.user.User;
import com.kt_miniproject.demo.dto.comment.CommentCreateRequest;
import com.kt_miniproject.demo.dto.comment.CommentResponse;
import com.kt_miniproject.demo.repository.BookRepository;
import com.kt_miniproject.demo.repository.CommentRepository;
import com.kt_miniproject.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CommentResponse createComment(Long bookId, CommentCreateRequest request) {

        // 댓글 내용 검증
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "댓글 내용을 입력해야 합니다.");
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Comment comment = Comment.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .recommend(0)
                .book(book)
                .user(user)
                .build();

        commentRepository.save(comment);
        return new CommentResponse(comment);
    }


    @Override
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        // 작성자 본인 확인
        if (!comment.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인의 댓글만 삭제할 수 있습니다.");
        }

        commentRepository.delete(comment);
    }

    @Override
    @Transactional
    public int likeComment(Long commentId, boolean isUpvote) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        // null 방지
        int currentRecommend = (comment.getRecommend() == null) ? 0 : comment.getRecommend();

        if (isUpvote) {
            currentRecommend++;
        } else {
            currentRecommend--;
        }

        comment.setRecommend(currentRecommend); // DB 업데이트 (Dirty Checking)

        return currentRecommend; // 변경된 숫자 반환
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByBook(Long bookId) {
        // repository 네이밍은 findByBook_Id로 되어 있어야 안전함
        return commentRepository.findById(bookId)
                .stream()
                .map(CommentResponse::new)
                .collect(Collectors.toList());
    }
}
