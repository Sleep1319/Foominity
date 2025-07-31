package com.example.foominity.dto.board;

import com.example.foominity.domain.board.Board;
import com.example.foominity.domain.member.Member;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardRequest {

    @NotNull
    private Long memberId;

    @NotNull
    private String nickname;

    @NotNull
    private String title;

    @NotNull
    private String content;

    @NotNull
    private String subject;

    public Board toEntity(BoardRequest req, Member member) {
        return new Board(req.getTitle(), req.getContent(), req.getSubject(), member.getId(), member.getNickname());
    }
}
