package com.example.foominity.controller.image;

import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.service.image.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

    // 기존 파일 업로드 (로컬 PC에서 업로드)
    @PostMapping("/api/images")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        ImageFile saved = imageService.imageUpload(file);
        // 저장된 이미지 정보 반환 (savePath, originalName 등)
        return ResponseEntity.ok(saved);
    }

    // [추가] 외부 URL 이미지 다운로드 후 서버에 저장
    @PostMapping("/api/images/download")
    public ResponseEntity<?> downloadImage(@RequestBody Map<String, String> body) {
        String imageUrl = body.get("imageUrl");
        if (imageUrl == null || imageUrl.isBlank()) {
            return ResponseEntity.badRequest().body("imageUrl is required");
        }
        ImageFile saved = imageService.downloadAndSaveFromUrl(imageUrl);
        return ResponseEntity.ok(saved); // 저장된 이미지 정보 반환
    }
}
