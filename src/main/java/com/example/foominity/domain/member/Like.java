package com.example.foominity.domain.member;

import com.example.foominity.domain.board.Review;
import com.example.foominity.domain.board.ReviewComment;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "likes")
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "comment_id")
    private ReviewComment reviewComment;

    public Like(ReviewComment reviewComment, Member member) {
        this.reviewComment = reviewComment;
        this.member = member;
    }
}
