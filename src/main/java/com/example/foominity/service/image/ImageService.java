package com.example.foominity.service.image;

import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.exception.NotFoundImageException;
import com.example.foominity.repository.image.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ImageService {

    private final ImageRepository imageRepository;
    private final String uploadDir = "uploads/";

    @Transactional
    public ImageFile imageUpload(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path savePath = Paths.get(uploadDir + fileName);
            Files.createDirectories(savePath.getParent());
            file.transferTo(savePath.toFile());

            ImageFile image = new ImageFile(file.getOriginalFilename(), savePath.toString());
            return imageRepository.save(image);
        } catch (IOException e) {
            throw new NotFoundImageException();
        }

    }

    @Transactional
    public void deleteImageFile(ImageFile imageFile) {
        try {
            // 1. 물리적 파일 삭제
            Path path = Paths.get(imageFile.getSavePath());
            Files.deleteIfExists(path);

            imageRepository.delete(imageFile);

        } catch (IOException e) {
            throw new NotFoundImageException(); // 커스텀 예외 정의 (선택)
        }
    }

}
