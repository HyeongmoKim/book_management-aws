package com.kt_miniproject.demo.domain.user;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.comment.Comment;
import com.kt_miniproject.demo.domain.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseTimeEntity {   // ★ BaseTimeEntity 상속

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;                         // ★ Integer → Long 권장

    @Column(length = 30, nullable = false, unique = true)
    private String email;

    @Column(length = 20, nullable = false)
    private String password;

    @Column(length = 20, nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)             // ★ Boolean → Role enum
    @Column(name = "role", length = 20, nullable = false)
    private Role role;                       // USER / ADMIN

    @Column(name = "api_key", length = 100)
    private String apiKey;

    // User : Book = 1 : N
    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<Book> books = new ArrayList<>();

    // User : Comment = 1 : N
    @OneToMany(mappedBy = "user")
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();
}
