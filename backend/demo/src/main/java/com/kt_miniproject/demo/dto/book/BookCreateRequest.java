package com.kt_miniproject.demo.dto.book;

import com.kt_miniproject.demo.domain.user.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookCreateRequest {
    private String title;
    private String content;
    private String coverImageUrl;
    private Long userId;
}
