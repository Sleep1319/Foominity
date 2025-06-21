package com.example.foominity.dto.comment;

import com.example.foominity.domain.board.Board;
import com.example.foominity.domain.board.BoardComment;
import com.example.foominity.domain.member.Member;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardCommentRequest {

    @NotBlank
    private String comment;

    public BoardComment toEntity(BoardCommentRequest req, Board board, Member member) {
        return new BoardComment(req.getComment(), board, member);
    }

    // 게시글 정보를 포함할 경우
    // @NotBlank
    // private Long boardId;

}
