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
    private int views;
    private String subject;

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public BoardResponse(Long id, String title, String nickname, int views, LocalDateTime createdDate,
            LocalDateTime updatedDate) {
        this.id = id;
        this.title = title;
        this.nickname = nickname;
        this.views = views;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }

    public static BoardResponse from(Board board) {
        return new BoardResponse(
                board.getId(),
                board.getTitle(),
                board.getContent(),
                board.getMemberId(),
                board.getNickname(),
                board.getViews(),
                board.getSubject(),
                board.getCreatedDate(),
                board.getUpdatedDate());
    }

}
