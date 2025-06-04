package com.example.foominity.service.image;

import com.example.foominity.repository.image.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ImageService {

    private final ImageRepository imageRepository;
    private final String uploadDir = "uploads/";

    @Transactional
    public void imageUpload() {

    }
}
