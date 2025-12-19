package com.kt_miniproject.demo.controller;

import com.kt_miniproject.demo.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    // 도서 추천
    @PostMapping("/{bookId}/recommend")
    public ResponseEntity<String> recommendBook(
            @PathVariable("bookId") Long bookId,
            @RequestParam("userId") Long userId
    ) {
        recommendService.recommendBook(bookId, userId);
        return ResponseEntity.ok("도서 추천 완료");
    }

    // 댓글 추천
    @PostMapping("/{bookId}/comments/{commentId}/recommend")
    public ResponseEntity<String> recommendComment(
            @PathVariable("commentId") Long commentId,
            @RequestParam("userId") Long userId
    ) {
        recommendService.recommendComment(commentId, userId);
        return ResponseEntity.ok("댓글 추천 완료");
    }
}
