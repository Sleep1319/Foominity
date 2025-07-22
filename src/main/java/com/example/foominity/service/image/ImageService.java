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
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Log4j2
public class ImageService {

    private final ImageRepository imageRepository;
    // 서버 업로드 폴더 경로 (절대경로)
    private final String uploadDir = System.getProperty("user.dir") + "/uploads/";

    /**
     * 일반 파일 업로드 (직접 업로드)
     */
    @Transactional
    public ImageFile imageUpload(MultipartFile file) {
        try {
            String originalName = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();
            String newFileName = uuid + "_" + originalName;

            // 실제 저장 디렉토리 생성 (없으면)
            Path saveDir = Paths.get(uploadDir).toAbsolutePath();
            Files.createDirectories(saveDir);

            // 저장 경로
            Path savePath = saveDir.resolve(newFileName);
            file.transferTo(savePath.toFile());

            // DB에는 상대 경로로 저장
            ImageFile image = new ImageFile();
            image.setOriginalName(originalName);
            image.setSavePath("uploads/" + newFileName);

            return imageRepository.save(image);

        } catch (IOException e) {
            throw new RuntimeException("이미지 업로드 실패", e);
        }
    }

    /**
     * 외부 URL에서 이미지를 다운로드하여 저장
     */
    @Transactional
    public ImageFile downloadAndSaveFromUrl(String imageUrl) {
        try (InputStream in = new URL(imageUrl).openStream()) {
            String uuid = UUID.randomUUID().toString();
            String fileExt = imageUrl.contains(".") ? imageUrl.substring(imageUrl.lastIndexOf('.')) : ".jpg";
            String newFileName = uuid + fileExt;

            Path saveDir = Paths.get(uploadDir).toAbsolutePath();
            Files.createDirectories(saveDir);

            Path savePath = saveDir.resolve(newFileName);
            Files.copy(in, savePath);

            ImageFile image = new ImageFile();
            image.setOriginalName(imageUrl.substring(imageUrl.lastIndexOf('/') + 1));
            image.setSavePath("uploads/" + newFileName);

            return imageRepository.save(image);

        } catch (IOException e) {
            throw new RuntimeException("외부 이미지 다운로드 실패", e);
        }
    }

    /**
     * 업로드/저장된 이미지 삭제
     */
    @Transactional
    public void deleteImageFile(ImageFile imageFile) {
        try {
            Path path = Paths.get(System.getProperty("user.dir")).resolve(imageFile.getSavePath());
            Files.deleteIfExists(path);
            imageRepository.delete(imageFile);
        } catch (IOException e) {
            throw new NotFoundImageException();
        }
    }

    @Transactional(readOnly = true)
    public ImageFile getImageByPath(String savePath) {
        return imageRepository.findBySavePath(savePath)
                .orElseThrow(() -> new RuntimeException("이미지 없음: " + savePath));
    }
}
