package com.example.foominity.dto.notice;

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

    public Notice toEntity(NoticeRequest req) {
        return new Notice(req.getTitle(), req.getContent());
    }
}
