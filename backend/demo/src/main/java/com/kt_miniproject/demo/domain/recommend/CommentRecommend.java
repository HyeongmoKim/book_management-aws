package com.kt_miniproject.demo.domain.recommend;

import com.kt_miniproject.demo.domain.comment.Comment;
import com.kt_miniproject.demo.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "comment_recommend")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentRecommend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_recommend_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_comment_id", nullable = false)
    private Comment comment;
}
