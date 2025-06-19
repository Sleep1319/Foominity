package com.example.foominity.dto.board;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardResponse {
    private Long id;
    private String title;
    private String content;
    private Long memberId;
    private String nickname;

    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public BoardResponse(Long id, String title, String nickname, LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.title = title;
        this.nickname = nickname;
        this.createDate = createdDate;
        this.updateDate = updatedDate;
    }
}
