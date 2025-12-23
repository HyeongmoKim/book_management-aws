package com.kt_miniproject.demo.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    // 1. 일반 파일 업로드 (프론트에서 직접 파일 보냈을 때)
    public String upload(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        amazonS3.putObject(new PutObjectRequest(bucket, fileName, file.getInputStream(), metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead));

        return amazonS3.getUrl(bucket, fileName).toString();
    }

    // 2. [심화] URL 이미지 다운로드 후 S3 업로드 (OpenAI 이미지 영구 저장용)
    public String uploadFromUrl(String imageUrl) throws IOException {
        // 2-1. URL 연결
        URL url = new URL(imageUrl);
        URLConnection connection = url.openConnection();
        InputStream inputStream = connection.getInputStream();

        // 2-2. 파일 이름 생성 (OpenAI는 보통 png임)
        String fileName = UUID.randomUUID() + "_ai_generated.png";

        // 2-3. 메타데이터 설정 (중요: 스트림 크기 등)
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType("image/png"); // OpenAI DALL-E는 기본적으로 PNG
        // 스트림 길이를 모를 때는 생략 가능하지만, 알 수 있다면 넣는 게 좋음

        // 2-4. S3에 업로드
        amazonS3.putObject(new PutObjectRequest(bucket, fileName, inputStream, metadata)
                .withCannedAcl(CannedAccessControlList.PublicRead));

        // 2-5. 업로드된 S3 주소 반환
        return amazonS3.getUrl(bucket, fileName).toString();
    }
}