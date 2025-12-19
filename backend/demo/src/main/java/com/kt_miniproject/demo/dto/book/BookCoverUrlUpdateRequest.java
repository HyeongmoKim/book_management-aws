package com.kt_miniproject.demo.dto.book;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BookCoverUrlUpdateRequest {

    // JSON: { "imageUrl": "https://..." }
    private String imageUrl;
}
