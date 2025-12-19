package com.kt_miniproject.demo.repository;

import com.kt_miniproject.demo.domain.comment.Comment;
import com.kt_miniproject.demo.domain.recommend.CommentRecommend;
import com.kt_miniproject.demo.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRecommendRepository extends JpaRepository<CommentRecommend, Long> {

    boolean existsByUserAndComment(User user, Comment comment);

    long countByComment(Comment comment);
}
