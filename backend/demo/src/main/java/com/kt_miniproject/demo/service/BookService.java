package com.kt_miniproject.demo.service;

import com.kt_miniproject.demo.dto.book.BookCreateRequest;
import com.kt_miniproject.demo.dto.book.BookResponse;

import java.util.List;

public interface BookService {

    // 도서 등록
    BookResponse createBook(BookCreateRequest request);

    // 전체 조회
    List<BookResponse> getAllBooks();

    // 단건 조회
    BookResponse getBookById(Long id);

    // 수정
    BookResponse updateBook(Long id, BookCreateRequest request);

    // 삭제
    void deleteBook(Long id, Long userId);

    // 제목 검색
    List<BookResponse> searchBooks(String title);

    // 표지 URL 수정
    BookResponse updateBookCoverUrl(Long id, String imageUrl);

    // AI 이미지 URL 생성
    String generateAiImageUrl(Long id);

    // 사용자별 도서 조회
    // 사용자별 도서 조회
    List<BookResponse> getBooksByUserId(Long userId);

    // 좋아요(추천) 증가
    int likeBook(Long id, boolean isUpvote);
}
