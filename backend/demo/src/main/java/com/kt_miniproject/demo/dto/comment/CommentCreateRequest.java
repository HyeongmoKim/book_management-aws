package com.kt_miniproject.demo.dto.comment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentCreateRequest {
    private String title;
    private String content;
    private Long userId;
}