package com.kt_miniproject.demo.service;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.user.User;
import com.kt_miniproject.demo.dto.book.BookResponse;
import com.kt_miniproject.demo.dto.user.LoginRequest;
import com.kt_miniproject.demo.dto.user.UserCreateRequest;
import com.kt_miniproject.demo.dto.user.UserResponse;
import com.kt_miniproject.demo.exception.ResourceNotFoundException;
import com.kt_miniproject.demo.repository.BookRepository;
import com.kt_miniproject.demo.repository.UserRepository;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service // 서비스 빈 등록
@RequiredArgsConstructor
@Transactional
@Builder
public class UserServiceImpl implements UserService {
        private final BookRepository bookRepository;
        private final UserRepository userRepository;

        public UserResponse createUser(UserCreateRequest request) {
                User user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail())
                                .password(request.getPassword())
                                .role(request.getRole())
                                .apiKey(request.getApiKey())
                                .build();
                User savedUser = userRepository.save(user); // 2. DB에 저장 필수!

                // 3. 결과 반환 (UserResponse에 생성자가 있다고 가정)
                return UserResponse.builder()
                                .id(savedUser.getId())
                                .email(savedUser.getEmail())
                                .name(savedUser.getName())
                                .build();
        }

        public UserResponse getUserInfo(Long id) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                List<Book> books = bookRepository.findByUserId(id);

                List<BookResponse> bookResponses = books.stream()
                                .map(b -> BookResponse.builder()
                                                .id(b.getId())
                                                .title(b.getTitle())
                                                .content(b.getContent())
                                                .coverImageUrl(b.getCoverImageUrl())
                                                .build())
                                .collect(Collectors.toList()); // 리스트로 변환 마무리

                // UserResponse에 내 정보와 책 목록을 담아서 반환
                return UserResponse.builder()
                                .id(user.getId())
                                .email(user.getEmail())
                                .name(user.getName())
                                .myBooks(bookResponses) // List<BookResponse> 필드 반환
                                .build();
        }

        @Override
        public UserResponse login(LoginRequest request) {
                // 1. 이메일 검증
                // [수정] Optional user -> User user 로 변경!
                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new ResourceNotFoundException("정보가 일치하는 회원이 없습니다."));

                // 2. 비밀번호 검증
                if (!user.getPassword().equals(request.getPassword())) {
                        throw new IllegalStateException("비밀번호가 일치하지 않습니다.");
                }

                // 3. 성공 시 정보 반환
                return UserResponse.builder()
                                .id(user.getId()) // 이제 user.getId()가 정상 작동합니다.
                                .email(user.getEmail())
                                .name(user.getName())
                                .build();
        }

        /**
         * ✅ 아이디(이메일) 찾기
         * 이름으로 검색해서 이메일을 반환
         */
        @Override
        public List<String> findEmail(String name) {
                Optional<User> users = userRepository.findAllByName(name);

                if (users.isEmpty()) {
                        throw new ResourceNotFoundException("해당 이름의 회원이 없습니다.");
                }

                // List<User>를 -> List<String>(이메일 목록)으로 변환
                return users.stream()
                                .map(user -> user.getEmail()) // User 객체에서 이메일만 쏙 뽑아서
                                .collect(Collectors.toList()); // 리스트로 만듦
        }

        // 비밀번호 찾기

        @Override
        public String findPassword(String email, String name) {
                User user = userRepository.findByEmailAndName(email, name)
                                .orElseThrow(() -> new ResourceNotFoundException("정보가 일치하는 회원이 없습니다."));

                return user.getPassword();
        }

        @Override
        public UserResponse updateUser(Long id, UserCreateRequest request) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                if (request.getName() != null && !request.getName().isBlank()) {
                        user.setName(request.getName());
                }
                if (request.getPassword() != null && !request.getPassword().isBlank()) {
                        user.setPassword(request.getPassword());
                }
                if (request.getApiKey() != null) {
                        user.setApiKey(request.getApiKey());
                }
                // Email update might require uniqueness check, skipping for now or assumed safe
                // if not changed often.

                // Dirty checking works because of @Transactional
                return UserResponse.builder()
                                .id(user.getId())
                                .email(user.getEmail())
                                .name(user.getName())
                                // .myBooks(...) - usually not needed for update response, or can fetch if
                                // needed
                                .build();
        }
}
