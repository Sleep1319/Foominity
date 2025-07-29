package com.example.foominity.dto.magazine;

import java.time.LocalDateTime;

import com.example.foominity.domain.notice.Magazine;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
// @AllArgsConstructor
public class MagazineResponse {

    @NotNull
    private Long id;

    @NotNull
    private String title;

    @NotNull
    private String content;

    @NotNull
    private LocalDateTime createdDate;

    private String imagePath;

    public MagazineResponse(Long id, String title, String content, LocalDateTime createdDate, String imagePath) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdDate = createdDate;
        this.imagePath = imagePath;
    }

    public static MagazineResponse from(Magazine magazine) {
        return new MagazineResponse(
                magazine.getId(),
                magazine.getTitle(),
                magazine.getContent(),
                magazine.getCreatedDate(),
                magazine.getImageFile().getSavePath());
    }
}
