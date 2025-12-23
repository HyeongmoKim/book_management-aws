package com.kt_miniproject.demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OpenAIService {

    private final RestTemplate restTemplate;

    // application.yml에 있는 키를 쓰거나, 프론트에서 받은 키를 쓸 수 있습니다.
    // 여기서는 일단 application.yml에 설정된 키를 쓴다고 가정합니다.
    @Value("${openai.api.key}")
    private String defaultApiKey;

    public String generateImage(String prompt, String userApiKey) {
        String url = "https://api.openai.com/v1/images/generations";

        // 1. 사용할 키 결정 (유저가 입력한 게 있으면 그거 쓰고, 없으면 서버 키 사용)
        String finalKey = (userApiKey != null && !userApiKey.isBlank()) ? userApiKey : defaultApiKey;

        // 2. 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + finalKey);

        // 3. 바디 설정
        Map<String, Object> body = new HashMap<>();
        body.put("prompt", prompt);
        body.put("n", 1);
        body.put("size", "512x512");

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        // 4. 요청 보내기
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            // 5. 응답 파싱 (data[0].url 꺼내기)
            Map<String, Object> responseBody = response.getBody();
            List<Map<String, Object>> data = (List<Map<String, Object>>) responseBody.get("data");
            return (String) data.get(0).get("url");

        } catch (Exception e) {
            throw new RuntimeException("OpenAI 이미지 생성 실패: " + e.getMessage());
        }
    }
}