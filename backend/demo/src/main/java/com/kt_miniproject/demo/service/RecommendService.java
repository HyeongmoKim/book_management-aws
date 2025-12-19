package com.kt_miniproject.demo.service;

public interface RecommendService {

    void recommendBook(Long bookId, Long userId);
    void recommendComment(Long commentId, Long userId);
}
