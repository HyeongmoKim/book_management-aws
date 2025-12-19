package com.kt_miniproject.demo.service;

import com.kt_miniproject.demo.dto.user.LoginRequest;
import com.kt_miniproject.demo.dto.user.UserCreateRequest;
import com.kt_miniproject.demo.dto.user.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse createUser(UserCreateRequest request);

    UserResponse getUserInfo(Long id);

    UserResponse login(LoginRequest request); // 로그인

    List<String> findEmail(String name); // 이메일(ID) 찾기

    String findPassword(String email, String name); // 비밀번호 찾기

    UserResponse updateUser(Long id, UserCreateRequest request); // 회원정보 수정
}