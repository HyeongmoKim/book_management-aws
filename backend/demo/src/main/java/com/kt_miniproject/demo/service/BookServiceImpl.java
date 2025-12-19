package com.kt_miniproject.demo.service;

import com.kt_miniproject.demo.domain.book.Book;
import com.kt_miniproject.demo.domain.user.User;
import com.kt_miniproject.demo.dto.book.BookCreateRequest;
import com.kt_miniproject.demo.dto.book.BookResponse;
import com.kt_miniproject.demo.exception.DeletionException;
import com.kt_miniproject.demo.exception.ResourceNotFoundException;
import com.kt_miniproject.demo.repository.BookRepository;
import com.kt_miniproject.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpHeaders;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본은 전체 조회 트랜잭션
public class BookServiceImpl implements BookService {

    // AutoWired 대신 RequiredArgsConstructor로 의존성 주입
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private static final String OPENAI_API_URL = "https://api.openai.com/v1/images/generations";

    /**
     * 도서 등록 (쓰기 → 별도 트랜잭션)
     */
    @Override
    @Transactional
    public BookResponse createBook(BookCreateRequest request) {
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found. id=" + request.getUserId()));
        }
        Book book = Book.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .coverImageUrl(request.getCoverImageUrl())
                .user(user)
                .build();

        Book saved = bookRepository.save(book);
        return new BookResponse(saved);
    }

    /**
     * 전체 조회 (읽기 전용)
     */
    @Override
    @Transactional(readOnly = true)
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(BookResponse::new)
                .toList();
    }

    /**
     * 상세 조회 (읽기 전용)
     */
    @Override
    @Transactional(readOnly = true)
    public BookResponse getBookById(Long id) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found. id=" + id));

        return new BookResponse(book);
    }

    /**
     * 수정 (쓰기 트랜잭션 + Dirty Checking)
     */
    @Override
    @Transactional // 변경 감지를 위한 트랜잭션
    public BookResponse updateBook(Long id, BookCreateRequest request) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found. id=" + id));

        // Dirty Checking이 자동 update 수행
        book.setTitle(request.getTitle());
        book.setContent(request.getContent());
        book.setCoverImageUrl(request.getCoverImageUrl());

        return new BookResponse(book);
    }

    /**
     * 삭제 (쓰기 트랜잭션)
     */
    @Override
    @Transactional
    public void deleteBook(Long id, Long userId) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        // 작성자만 삭제 가능 하게 하는거
        if (!book.getUser().getId().equals(userId)) {
            throw new DeletionException("책을 삭제할 권한이 없습니다");
        }
        bookRepository.deleteById(id);
    }

    /**
     * 검색 (읽기 전용)
     */
    @Override
    @Transactional(readOnly = true)
    public List<BookResponse> searchBooks(String title) {
        if (title == null || title.isBlank()) {
            return getAllBooks();
        }

        return bookRepository
                .findByTitleContainingIgnoreCase(title)
                .stream()
                .map(BookResponse::new)
                .toList();
    }

    @Override
    @Transactional
    public BookResponse updateBookCoverUrl(Long id, String imageUrl) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found. id=" + id)); // illegalArgument에서 직접
                                                                                               // 처리한 예외로 변경
        book.setCoverImageUrl(imageUrl);

        // 변경감지(dirty checking)로 자동 update
        return new BookResponse(book);
    }

    @Override
    @Transactional
    public String generateAiImageUrl(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        String apiKey = book.getUser().getApiKey();
        String title = book.getTitle();
        String content = book.getContent();

        // 2. API Key 가져오기
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalArgumentException("API Key가 등록되지 않았습니다.");
        }

        // 내용이 너무 길면 DALL-E 요청 제한에 걸릴 수 있으므로 500자 정도로 자름
        String summary = (content != null && content.length() > 500)
                ? content.substring(0, 500)
                : content;

        // "제목이 ~이고, 내용이 ~인 책의 표지를 그려줘"
        String prompt = String.format(
                "A high-quality book cover illustration for a book titled '%s'. The story is about: %s",
                title, summary);

        // 4. 헤더 설정 (인증)
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        // 5. 요청 바디 설정 (DALL-E 3 파라미터)
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "dall-e-3");
        requestBody.put("prompt", prompt);
        requestBody.put("n", 1); // 1장 생성
        requestBody.put("size", "1024x1024");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            // 6. API 호출 (POST)
            ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_API_URL, entity, Map.class);

            // 7. 응답에서 URL 꺼내기
            // JSON 구조: { "data": [ { "url": "https://..." } ] }
            Map<String, Object> body = response.getBody();
            if (body == null || !body.containsKey("data")) {
                throw new IllegalStateException("이미지 생성 실패: 응답 데이터 없음");
            }

            List<Map<String, String>> data = (List<Map<String, String>>) body.get("data");
            String generatedImageUrl = data.get(0).get("url");

            // 생성된 이미지를 바로 책 정보에 저장
            book.setCoverImageUrl(generatedImageUrl);

            return generatedImageUrl;

        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalArgumentException("OpenAI API 호출 실패: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponse> getBooksByUserId(Long userId) {
        return bookRepository.findByUserId(userId)
                .stream()
                .map(BookResponse::new)
                .toList();
    }

    @Override
    @Transactional
    public int likeBook(Long id, boolean isUpvote) {
        // 1. 책 조회
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found. id=" + id));

        // 2. 현재 추천 수 가져오기 (null이면 0으로 처리)
        int currentRecommend = (book.getRecommend() == null) ? 0 : book.getRecommend();

        // 3. 더하기 또는 빼기
        if (isUpvote) {
            currentRecommend++;
        } else {
            currentRecommend--;
        }

        // 4. DB 업데이트 (Dirty Checking으로 자동 저장됨)
        book.setRecommend(currentRecommend);

        // 5. ★ [핵심] 변경된 숫자를 컨트롤러에게 돌려줌
        return currentRecommend;
    }
}
