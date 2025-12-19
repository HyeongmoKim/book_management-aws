package com.kt_miniproject.demo.dto.book;

import com.kt_miniproject.demo.domain.book.Book;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponse {

    private Long id;
    private String title;
    private String content;
    private String coverImageUrl;
    private Long userId;
    private String userName;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
    private Integer recommend;
    private java.util.List<com.kt_miniproject.demo.dto.comment.CommentResponse> comments;

    // Book 엔티티를 받아서 응답 DTO로 변환하는 생성자
    public BookResponse(Book book) {
        this.id = book.getId();
        this.title = book.getTitle();
        this.content = book.getContent();
        this.coverImageUrl = book.getCoverImageUrl();
        this.createdAt = book.getCreatedAt();
        this.updatedAt = book.getUpdatedAt();
        this.recommend = book.getRecommend();

        if (book.getUser() != null) {
            this.userId = book.getUser().getId();
            this.userName = book.getUser().getName();
        }

        if (book.getComments() != null) {
            this.comments = book.getComments().stream()
                    .map(com.kt_miniproject.demo.dto.comment.CommentResponse::new)
                    .collect(java.util.stream.Collectors.toList());
        }
    }
}
