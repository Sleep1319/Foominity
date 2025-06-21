package com.example.foominity.dto.comment;

import java.time.LocalDateTime;

import com.example.foominity.domain.board.BoardComment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardCommentResponse {

    private Long id;

    private String nickname;

    private String comment;

    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public static BoardCommentResponse fromEntity(BoardComment comment) {
        return new BoardCommentResponse(
                comment.getId(),
                comment.getMember().getNickname(),
                comment.getContent(),
                null,
                null);
    }
}
