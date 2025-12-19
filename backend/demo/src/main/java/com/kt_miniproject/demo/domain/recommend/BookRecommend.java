package com.kt_miniproject.demo.domain.recommend;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "book_recommend")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookRecommend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_recommend_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_book_id", nullable = false)
    private Book book;
}
