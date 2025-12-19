package com.kt_miniproject.demo.domain.comment;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long id;

    // 옵션: 제목 (API 명세서에는 없지만 컬럼은 유지)
    @Column(name = "comment_title", length = 200)
    private String title;

    // 필수: 댓글 내용
    @Column(name = "comment_content", columnDefinition = "TEXT", nullable = false)
    private String content;

    // 필수: 작성 시간
    @Column(name = "comment_date", nullable = false)
    private LocalDateTime createdAt;

    // 옵션: 활성/비활성 플래그 (명세서에는 없지만 컬럼 유지)
    @Column(name = "comment_active")
    private Boolean active;

    // 필수: 추천(좋아요) 수
    @Column(name = "comment_recommend", nullable = false)
    private Integer recommend = 0;

    // Comment → User (N:1)
    @ManyToOne
    @JoinColumn(name = "users_user_id", nullable = false)
    private User user;

    // Comment → Book (N:1)
    @ManyToOne
    @JoinColumn(name = "book_book_id", nullable = false)
    private Book book;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        // active를 기본 true로 쓰고 싶으면:
        if (this.active == null) {
            this.active = true;
        }
        if (this.recommend == null) {
            this.recommend = 0;
        }
    }
}
