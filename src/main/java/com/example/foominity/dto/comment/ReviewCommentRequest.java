package com.example.foominity.dto.comment;

import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.board.ReviewComment;
import com.example.foominity.domain.member.Member;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCommentRequest {

    @NotBlank
    private String comment;

    public ReviewComment toEntity(ReviewCommentRequest req, Review review, Member member) {
        return new ReviewComment(req.getComment(), review, member);
    }

    // 게시글 정보를 포함할 경우
    // @NotBlank
    // private Long reviewId;
}
