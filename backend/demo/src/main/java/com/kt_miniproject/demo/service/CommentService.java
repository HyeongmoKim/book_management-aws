package com.kt_miniproject.demo.service;

import com.kt_miniproject.demo.dto.comment.CommentCreateRequest;
import com.kt_miniproject.demo.dto.comment.CommentResponse;

import java.util.List;

public interface CommentService {

    CommentResponse createComment(Long bookId, CommentCreateRequest request);
    void deleteComment(Long commentId, Long userId);
    List<CommentResponse> getCommentsByBook(Long bookId);
    int likeComment(Long commentId, boolean isUpvote);
}
