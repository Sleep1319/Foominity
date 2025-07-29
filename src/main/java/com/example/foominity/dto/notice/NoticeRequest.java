package com.example.foominity.dto.notice;

import org.springframework.web.multipart.MultipartFile;

import com.example.foominity.domain.member.Member;
import com.example.foominity.domain.notice.Notice;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticeRequest {

    @NotNull
    private String title;

    @NotNull
    private String content;

    private MultipartFile image;
    private String imagePath;

    public Notice toEntity() {
        return new Notice(this.title, this.content);
    }
}
