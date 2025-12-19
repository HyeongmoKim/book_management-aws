package com.kt_miniproject.demo.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Component // 👈 [중요] 이게 있어야 컨트롤러에서 가져다 쓸 수 있습니다!
public class FileStore {

    // 프로젝트 폴더 바로 아래에 "uploads"라는 폴더를 만들어서 저장합니다.
    private final String fileDir = System.getProperty("user.dir") + "/uploads/";

    public String storeFile(MultipartFile multipartFile) throws IOException {
        if (multipartFile == null || multipartFile.isEmpty()) {
            return null;
        }

        // 1. 폴더가 없으면 새로 만듭니다.
        File directory = new File(fileDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // 2. 파일명 중복을 피하기 위해 UUID(랜덤 문자열)를 붙입니다.
        // 예: "dog.jpg" -> "550e8400-e29b..._dog.jpg"
        String originalFilename = multipartFile.getOriginalFilename();
        String storeFileName = UUID.randomUUID() + "_" + originalFilename;

        // 3. 실제 파일 저장 (업로드)
        multipartFile.transferTo(new File(fileDir + storeFileName));

        // 4. 나중에 웹에서 접근할 경로 반환 (/uploads/...)
        return "/uploads/" + storeFileName;
    }
}