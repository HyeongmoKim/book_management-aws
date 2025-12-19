package com.kt_miniproject.demo.repository;

import com.kt_miniproject.demo.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 로그인용: 이메일로 회원 찾기
    Optional<User> findByEmail(String email);

    // 아이디 찾기용: 이름으로 회원 찾기
    Optional<User> findAllByName(String name);

    // 비번 찾기용: 이메일과 이름이 둘 다 맞는 회원 찾기
    Optional<User> findByEmailAndName(String email, String name);
}