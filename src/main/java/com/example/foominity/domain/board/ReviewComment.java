package com.example.foominity.domain.board;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@NoArgsConstructor
@Getter
@Entity
public class ReviewComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 댓글 내용
    private String content;

    // 별점
    @Column(nullable = false)
    private float starPoint;

    @Column(name = "member_id")
    private Long memberId;

    @Column(name = "nickname")
    private String nickname;
    // 게시판 아이디
    @JoinColumn(name = "review_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Review review;

    public ReviewComment(String content, Review review, Long memberId, String nickname, float starPoint) {
        this.content = content;
        this.starPoint = starPoint;
        this.review = review;
        this.memberId = memberId;
        this.nickname = nickname;
    }

    public void changeComment(String content, float starPoint) {
        this.content = content;
        this.starPoint = starPoint;
    }
}