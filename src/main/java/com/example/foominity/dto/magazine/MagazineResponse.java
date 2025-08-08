package com.example.foominity.dto.magazine;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

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

    private String summary;

    @NotNull
    private String content;

    @NotNull
    private LocalDateTime createdDate;

    private String imagePath;

    private List<String> keyPoints;

    private String originalUrl;

    private Date publishedDate;

    public MagazineResponse(Long id,
            String title,
            String summary,
            String content,
            LocalDateTime createdDate,
            String imagePath,
            List<String> keyPoints,
            String originalUrl,
            Date publishedDate) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.content = content;
        this.createdDate = createdDate;
        this.imagePath = imagePath;
        this.keyPoints = keyPoints;
        this.originalUrl = originalUrl;
        this.publishedDate = publishedDate;
    }

    public static MagazineResponse from(Magazine magazine) {
        return new MagazineResponse(
                magazine.getId(),
                magazine.getTitle(),
                magazine.getSummary(),
                magazine.getContent(),
                magazine.getCreatedDate(),
                magazine.getImageFile().getSavePath(),
                magazine.getKeyPoints(),
                magazine.getOriginalUrl(),
                magazine.getPublishedDate());
    }
}
