// src/main/java/com/kt_miniproject/demo/service/FileStorageService.java
package com.kt_miniproject.demo.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    private final Path uploadDir = Paths.get("uploads");  // 프로젝트 루트 기준 ./uploads

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadDir);
            log.info("Upload directory = {}", uploadDir.toAbsolutePath());
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload folder", e);
        }
    }

    /**
     * 파일을 서버 로컬 디스크에 저장하고, 접근 가능한 URL 경로를 반환
     */
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            String originalName = StringUtils.cleanPath(file.getOriginalFilename());
            String ext = "";

            int dot = originalName.lastIndexOf('.');
            if (dot != -1) {
                ext = originalName.substring(dot);  // .png, .jpg 등
            }

            // 파일명 중복 방지를 위해 UUID 사용
            String filename = UUID.randomUUID() + ext;

            Path target = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            // ★ 프론트에서 사용할 URL (아래 WebConfig와 맞춰야 함)
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}
