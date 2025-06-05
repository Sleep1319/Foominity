package com.example.foominity.dto.board;

import com.example.reactbootserver.domain.Member;
import com.example.reactbootserver.domain.board.Board;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCreateRequest {

    @NotNull
    private Long memberId;

    @NotNull
    private String title;

    @NotNull
    private String content;

    private float starPoint;

    public Board toEntity(ReviewCreateRequest req, Member member) {
        return new Board(req.getTitle(), req.title, member);
    }

}
