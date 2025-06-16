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

    @Column(name = "review_count")
    private int reviewCount;

    @Column(name = "like_count")
    private int likeCount;

    @OneToOne
    @JoinColumn(name = "member_id")
    private Member member;

    public void resetPoint() {
        this.reviewCount = 0;
        this.likeCount = 0;
    }

    public void addReviewCount() {
        this.reviewCount++;
    }

    public void addLikeCount() {
        this.likeCount++;
    }

    public void increaseReviewCount() {
        this.reviewCount++;
    }

}
