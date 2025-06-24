package com.example.foominity.dto.member;

import com.example.foominity.domain.board.ReviewComment;
import com.example.foominity.domain.member.Like;
import com.example.foominity.domain.member.Member;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeRequest {

    private boolean liked;

    public Like toEntity(ReviewComment reviewComment, Member member) {
        return new Like(reviewComment, member);
    }

}
