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

    private float starPoint;

    public ReviewComment toEntity(Review review, Member member) {
        return new ReviewComment(this.comment, review, member.getId(), member.getNickname(), this.starPoint);
    }

}
