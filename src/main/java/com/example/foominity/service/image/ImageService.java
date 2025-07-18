package com.example.foominity.service.image;

import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.exception.NotFoundImageException;
import com.example.foominity.repository.image.ImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

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
@Log4j2
public class ImageService {

    private final ImageRepository imageRepository;
    private final String uploadDir = System.getProperty("user.dir") + "/uploads/"; // 절대 경로

    @Transactional
    public ImageFile imageUpload(MultipartFile file) {
        try {
            String originalName = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();
            String newFileName = uuid + "_" + originalName;

            // 실제 저장 디렉토리
            Path saveDir = Paths.get(uploadDir).toAbsolutePath(); // C:/.../uploads
            Files.createDirectories(saveDir); // uploads 폴더 없으면 생성

            Path savePath = saveDir.resolve(newFileName);
            file.transferTo(savePath.toFile());

            // 상대 경로만 저장
            ImageFile image = new ImageFile();
            image.setOriginalName(originalName);
            image.setSavePath("uploads/" + newFileName); // 상대경로로 저장

            return imageRepository.save(image);

        } catch (IOException e) {
            throw new RuntimeException("이미지 업로드 실패", e);
        }
    }

    @Transactional
    public void deleteImageFile(ImageFile imageFile) {
        try {
            // 1. 물리적 파일 삭제
            // Path path = Paths.get(imageFile.getSavePath());
            // Files.deleteIfExists(path);
            Path path = Paths.get(System.getProperty("user.dir")).resolve(imageFile.getSavePath());
            Files.deleteIfExists(path);

            imageRepository.delete(imageFile);

        } catch (IOException e) {
            throw new NotFoundImageException(); // 커스텀 예외 정의 (선택)
        }
    }

}
