package com.example.foominity.domain.member;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "review_comment_count")
    private int reviewCommentCount;

    @Column(name = "like_count")
    private int likeCount;

    @OneToOne
    @JoinColumn(name = "member_id")
    private Member member;

    public void resetPoint() {
        this.reviewCommentCount = 0;
        this.likeCount = 0;
    }

    public Point(Member member) {
        this.member = member;
    }

    public void addReviewCommentCount() {
        this.reviewCommentCount++;
    }

    public void addLikeCount() {
        this.likeCount++;
    }

}
