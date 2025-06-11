package com.example.foominity.service.image;

import com.example.foominity.domain.image.ImageFile;
import com.example.foominity.exception.ImageUploadException;
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
    public void imageUpload(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path savePath = Paths.get(uploadDir + fileName);
            Files.createDirectories(savePath.getParent());
            file.transferTo(savePath.toFile());

            ImageFile image = new ImageFile(file.getOriginalFilename(), savePath.toString());
            imageRepository.save(image);
        } catch (IOException e) {
            throw new ImageUploadException();
        }

    }
}
