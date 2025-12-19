package com.kt_miniproject.demo.dto.comment;

import com.kt_miniproject.demo.domain.comment.Comment;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private Integer recommend;
    private Long userId;
    private String userName;
    private Long bookId;

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.title = comment.getTitle();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        this.recommend = comment.getRecommend();
        if (comment.getUser() != null) {
            this.userId = comment.getUser().getId();
            this.userName = comment.getUser().getName();
        }
        if (comment.getBook() != null) {
            this.bookId = comment.getBook().getId();
        }
    }
}
