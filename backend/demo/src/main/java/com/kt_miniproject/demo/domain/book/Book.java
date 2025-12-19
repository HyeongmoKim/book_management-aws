package com.kt_miniproject.demo.domain.book;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// ★ 추가 (ERD 관계 때문에 import 필요)
import com.kt_miniproject.demo.domain.user.User;          // ★ 추가
import com.kt_miniproject.demo.domain.comment.Comment;    // ★ 추가
import java.util.ArrayList;                               // ★ 추가
import java.util.List;                                    // ★ 추가

/**
 * Book 엔티티
 * - 도서 등록/조회/수정/삭제 기능의 핵심 데이터 구조
 */
@Entity
@Table(name = "book")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")                 // ★ ERD 컬럼명 적용
    private Long id;                          // 기존 id 그대로

    @Column(name = "book_title", nullable = false, length = 200)   // ★ 컬럼명만 변경
    private String title;

    @Column(name = "book_content", columnDefinition = "TEXT")       // ★ 컬럼명만 변경
    private String content;

    @Column(name = "book_image_URL", length = 500)                  // ★ 컬럼명만 변경
    private String coverImageUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;  // 생성일

    @Column(nullable = false)
    private LocalDateTime updatedAt;  // 수정일

    @Column(name = "book_recommend")
    private Integer recommend;

    // ============= ★★★ ERD 변경으로 인해 추가된 부분 ★★★ ============= //

    // book.user_user_id -> user.user_id
    @ManyToOne
    @JoinColumn(name = "users_user_id", nullable = true)   // ★ FK 이름 맞춰 수정
    private User user;

    // book : comment = 1 : N
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL) // ★ 추가
    private List<Comment> comments = new ArrayList<>();      // ★ 추가

    // ============================================================== //

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
