package com.example.foominity.dto.comment;

import java.time.LocalDateTime;

import com.example.foominity.domain.board.ReviewComment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCommentResponse {

    private Long id;

    private Long memberId;
    private String nickname;
    private String comment;

    private float starPoint;

    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public static ReviewCommentResponse fromEntity(ReviewComment comment) {
        return new ReviewCommentResponse(
                comment.getId(),
                comment.getMemberId(),
                comment.getNickname(),
                comment.getContent(),
                comment.getStarPoint(),
                null,
                null);
    }

}
