package com.example.foominity.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BoardDTO {

    private Long id;
    private Long memberId;
    private String title;
    private String content;
    private int views;

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public BoardDTO(Long id, Long memberId, String title, String content, int views) {
        this.id = id;
        this.memberId = memberId;
        this.title = title;
        this.content = content;
        this.views = views;
    }

}
