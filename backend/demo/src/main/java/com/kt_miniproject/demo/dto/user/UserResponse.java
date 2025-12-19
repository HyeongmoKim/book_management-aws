package com.kt_miniproject.demo.dto.user;

import com.kt_miniproject.demo.domain.user.User;
import com.kt_miniproject.demo.dto.book.BookResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String email;
    private String name;
    private String apiKey;
    private String password;
    private List<BookResponse> myBooks;

    //  Book 엔티티를 받아서 응답 DTO로 변환하는 생성자
    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.apiKey = user.getApiKey();
        this.password = user.getPassword();
    }
}