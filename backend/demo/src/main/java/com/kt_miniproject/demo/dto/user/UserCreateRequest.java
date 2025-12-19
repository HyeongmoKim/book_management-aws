package com.kt_miniproject.demo.dto.user;

import com.kt_miniproject.demo.domain.user.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreateRequest {
    private String email;
    private String password;
    private String name;
    private Role role;
    private String apiKey;

}
