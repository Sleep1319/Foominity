package com.example.foominity.dto.notice;

import java.time.LocalDateTime;

import com.example.foominity.domain.notice.Notice;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
// @AllArgsConstructor
public class NoticeResponse {

    @NotNull
    private Long id;

    @NotNull
    private String title;

    @NotNull
    private String content;

    @NotNull
    private LocalDateTime createdDate;

    private String imagePath;

    public NoticeResponse(Long id, String title, String content, LocalDateTime createdDate, String imagePath) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdDate = createdDate;
        this.imagePath = imagePath;
    }

    public static NoticeResponse from(Notice notice) {
        return new NoticeResponse(
                notice.getId(),
                notice.getTitle(),
                notice.getContent(),
                notice.getCreatedDate(),
                notice.getImageFile().getSavePath());
    }
}
