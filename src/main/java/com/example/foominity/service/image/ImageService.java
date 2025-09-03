package com.example.foominity.service.image;

import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.exception.NotFoundImageException;
import com.example.foominity.repository.image.ImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Log4j2
public class ImageService {

    private final ImageRepository imageRepository;

    /**
     * 업로드 루트 디렉터리(절대경로)
     * - 도커/배포:  /app/uploads   (docker-compose에서 - /home/ubuntu/Foominity/uploads:/app/uploads 로 마운트)
     * - 로컬:      프로젝트 루트의 /uploads (fallback)
     */
    @Value("${app.upload-dir:/app/uploads}")
    private String uploadRoot;

    /** DB에는 항상 "uploads/파일명" 같은 상대경로만 저장 */
    private static final String DB_PREFIX = "uploads/";

    private Path ensureUploadDir() throws IOException {
        Path dir = Paths.get(uploadRoot).toAbsolutePath().normalize();
        Files.createDirectories(dir);
        return dir;
    }

    private static String randomNameFromOriginal(String originalName) {
        String safeName = (originalName == null || originalName.isBlank()) ? "file" : originalName;
        // 운영체제에 따라 문제될 수 있는 문자를 간단히 제거
        safeName = safeName.replaceAll("[\\\\/:*?\"<>|]", "_");
        return UUID.randomUUID() + "_" + safeName;
    }

    @Transactional
    public ImageFile imageUpload(MultipartFile file) {
        try {
            Path saveDir = ensureUploadDir();

            String newFileName = randomNameFromOriginal(file.getOriginalFilename());
            Path savePath = saveDir.resolve(newFileName).normalize();

            // 실제 저장
            file.transferTo(savePath.toFile());

            // DB에는 상대 경로만
            ImageFile image = new ImageFile();
            image.setOriginalName(file.getOriginalFilename());
            image.setSavePath(DB_PREFIX + newFileName);

            return imageRepository.save(image);
        } catch (IOException e) {
            log.error("이미지 업로드 실패", e);
            throw new RuntimeException("이미지 업로드 실패", e);
        }
    }

    /** 외부 URL에서 이미지 다운로드 후 저장 */
    @Transactional
    public ImageFile downloadAndSaveFromUrl(String imageUrl) {
        try (InputStream in = new URL(imageUrl).openStream()) {
            Path saveDir = ensureUploadDir();

            // 확장자 추출 (없으면 .jpg)
            String ext = ".jpg";
            int idx = imageUrl.lastIndexOf('.');
            if (idx != -1 && idx < imageUrl.length() - 1) {
                String candidate = imageUrl.substring(idx).toLowerCase();
                if (candidate.length() <= 10) ext = candidate;
            }
            String newFileName = UUID.randomUUID() + ext;

            Path savePath = saveDir.resolve(newFileName).normalize();
            Files.copy(in, savePath, StandardCopyOption.REPLACE_EXISTING);

            ImageFile image = new ImageFile();
            String original = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            image.setOriginalName(original);
            image.setSavePath(DB_PREFIX + newFileName);

            return imageRepository.save(image);
        } catch (IOException e) {
            log.error("외부 이미지 다운로드 실패 url={}", imageUrl, e);
            throw new RuntimeException("외부 이미지 다운로드 실패", e);
        }
    }

    /** 업로드/저장된 이미지 삭제 */
    @Transactional
    public void deleteImageFile(ImageFile imageFile) {
        try {
            Path root = Paths.get(uploadRoot).toAbsolutePath().normalize();
            // DB에는 "uploads/파일명" 이 들어있으므로, 파일명 부분만 뽑아 합칩니다.
            String dbPath = imageFile.getSavePath(); // e.g.) uploads/abc.jpg
            String fileName = dbPath.replaceFirst("^uploads/", "");
            Path real = root.resolve(fileName).normalize();

            Files.deleteIfExists(real);
            imageRepository.delete(imageFile);
        } catch (IOException e) {
            log.warn("이미지 삭제 실패: {}", imageFile.getSavePath(), e);
            throw new NotFoundImageException();
        }
    }

    @Transactional(readOnly = true)
    public ImageFile getImageByPath(String savePath) {
        return imageRepository.findBySavePath(savePath)
                .orElseThrow(() -> new RuntimeException("이미지 없음: " + savePath));
    }
}
