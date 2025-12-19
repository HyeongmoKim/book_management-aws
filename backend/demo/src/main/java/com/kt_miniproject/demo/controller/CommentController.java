package com.kt_miniproject.demo.controller;

import com.kt_miniproject.demo.dto.comment.CommentCreateRequest;
import com.kt_miniproject.demo.dto.comment.CommentResponse;
import com.kt_miniproject.demo.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books/{bookId}/comments") // 🔹 bookId 포함
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // 댓글 작성
    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable("bookId") Long bookId,
            @RequestBody CommentCreateRequest request
    ) {
        CommentResponse response = commentService.createComment(bookId, request);
        return ResponseEntity.ok(response);
    }

    // 책별 댓글 조회
    @GetMapping
    public ResponseEntity<List<CommentResponse>> getCommentsByBook(
            @PathVariable("bookId") Long bookId
    ) {
        List<CommentResponse> comments = commentService.getCommentsByBook(bookId);
        return ResponseEntity.ok(comments);
    }
    // 댓글 추천
    @PostMapping("/{commentId}/like")
    public ResponseEntity<Integer> likeComment(
            @PathVariable Long commentId,
            @RequestParam("isUpvote") boolean isUpvote // true: 추천, false: 비추천
    ) {
        int updatedCount = commentService.likeComment(commentId, isUpvote);
        return ResponseEntity.ok(updatedCount); // 변경된 숫자 반환
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<String> deleteComment(
            @PathVariable Long commentId,
            @RequestParam("userId") Long userId // 프론트에서 보내준 userId 받기
    ) {
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.ok("댓글이 삭제되었습니다.");
    }
}
