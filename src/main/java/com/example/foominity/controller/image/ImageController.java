package com.example.foominity.controller.image;

import com.example.foominity.service.image.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

    @PostMapping("/api/images")
    public ResponseEntity<String> uploadImage(@RequestParam("file")MultipartFile file) {
        imageService.imageUpload(file);
        return ResponseEntity.ok().build();
    }

}
