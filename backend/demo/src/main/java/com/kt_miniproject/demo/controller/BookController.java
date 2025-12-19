package com.kt_miniproject.demo.controller;

import com.kt_miniproject.demo.dto.book.BookCoverUrlUpdateRequest;
import com.kt_miniproject.demo.dto.book.BookCreateRequest;
import com.kt_miniproject.demo.dto.book.BookResponse;
import com.kt_miniproject.demo.service.BookService;
import com.kt_miniproject.demo.service.FileStorageService;
import com.kt_miniproject.demo.util.FileStore;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/books") // 전체 prefix
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final FileStore fileStore;

    // 1. 도서 등록 (Create)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE) // ★ 중요: 이 줄 필수!
    public ResponseEntity<BookResponse> createBook(
            @RequestPart("title") String title,
            @RequestPart("content") String content,
            @RequestPart("userId") String userId, // 프론트에서 보낸 userId 받기
            @RequestPart(value = "coverImage", required = false) MultipartFile coverImage,
            @RequestPart(value = "aiCoverUrl", required = false) String aiCoverUrl) throws IOException {

        // 1. 이미지 처리
        String coverImageUrl = null;
        if (aiCoverUrl != null && !aiCoverUrl.isBlank()) {
            coverImageUrl = aiCoverUrl;
        } else if (coverImage != null && !coverImage.isEmpty()) {
            coverImageUrl = fileStore.storeFile(coverImage);
        }

        // 2. DTO 만들기
        BookCreateRequest request = new BookCreateRequest();
        request.setTitle(title);
        request.setContent(content);
        request.setUserId(Long.parseLong(userId));
        request.setCoverImageUrl(coverImageUrl);

        // 3. 저장
        BookResponse response = bookService.createBook(request);
        return ResponseEntity.ok(response);
    }

    // 2. 도서 목록 조회 + 제목 검색 (Read List)
    // GET /api/books -> 전체 목록
    // GET /api/books?title=별 -> 제목 검색
    @GetMapping
    public ResponseEntity<List<BookResponse>> getBooks(
            @RequestParam(name = "title", required = false) String title) {

        List<BookResponse> books = bookService.searchBooks(title);
        return ResponseEntity.ok(books);
    }

    // 2-1. 내 도서 목록 조회
    // GET /api/books/my?userId=1
    @GetMapping("/my")
    public ResponseEntity<List<BookResponse>> getMyBooks(@RequestParam("userId") Long userId) {
        List<BookResponse> books = bookService.getBooksByUserId(userId);
        return ResponseEntity.ok(books);
    }

    // 3. 도서 상세 조회 (Read One)
    // GET /api/books/{id}
    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBook(@PathVariable("id") Long id) {
        BookResponse response = bookService.getBookById(id);
        return ResponseEntity.ok(response);
    }

    // 4. 도서 수정 (Update)
    // PUT /api/books/{id}
    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> updateBook(
            @PathVariable("id") Long id,
            @RequestBody BookCreateRequest request) {

        BookResponse response = bookService.updateBook(id, request);
        return ResponseEntity.ok(response);
    }

    // 5. 도서 삭제 (Delete)
    // DELETE /api/books/{id}?userId=1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable("id") Long id,
            @RequestParam("userId") Long userId) {
        bookService.deleteBook(id, userId);
        return ResponseEntity.noContent().build(); // 204 응답
    }

    // 6. 표지 URL 직접 수정
    // PUT /api/books/{id}/cover-url
    // Body: { "imageUrl": "https://..." }
    @PutMapping("/{id}/cover-url")
    public ResponseEntity<BookResponse> updateBookCoverUrl(
            @PathVariable("id") Long id,
            @RequestBody BookCoverUrlUpdateRequest request) {

        BookResponse response = bookService.updateBookCoverUrl(id, request.getImageUrl());

        return ResponseEntity.ok(response);
    }

    // 7. AI로 표지 이미지 생성
    // PUT /api/books/{id}/generate-image
    @PutMapping("/{id}/generate-image")
    public ResponseEntity<String> generateAiImageUrl(
            @PathVariable("id") Long id) {

        String bookUrl = bookService.generateAiImageUrl(id);
        return ResponseEntity.ok(bookUrl);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Integer> likeBook(
            @PathVariable("id") Long id,
            @RequestParam("isUpvote") boolean isUpvote // 추가
    ) {
        int currentRecommend = bookService.likeBook(id, isUpvote);
        return ResponseEntity.ok(currentRecommend);
    }
}
