package com.example.foominity.domain.member;

import com.example.foominity.domain.board.Review;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "review_likes")
public class ReviewLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;


    @Column(name = "review_id", nullable = false)
    private Long reviewId;

    public ReviewLike(Member member, Long reviewId) {
        this.member = member;
        this.reviewId = reviewId;
    }
}
