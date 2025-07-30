package com.example.foominity.dto.magazine;

import com.example.foominity.domain.notice.Magazine;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MagazineRequest {

    @NotNull
    private String title;

    @NotNull
    private String content;

    private MultipartFile image;
    private String imagePath;

    public Magazine toEntity() {
        return new Magazine(this.title, this.content);
    }
}
