package com.example.foominity.dto.board;

import java.time.LocalDateTime;

import com.example.foominity.domain.BaseEntity;
import com.example.foominity.domain.board.Board;

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

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public BoardResponse(Long id, String title, String nickname, LocalDateTime createdDate, LocalDateTime updatedDate) {
        this.id = id;
        this.title = title;
        this.nickname = nickname;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }

    public static BoardResponse from(Board board) {
        return new BoardResponse(
                board.getId(),
                board.getTitle(),
                board.getContent(),
                board.getMember().getId(),
                board.getMember().getNickname(),
                board.getCreatedDate(),
                board.getUpdatedDate());
    }

}
