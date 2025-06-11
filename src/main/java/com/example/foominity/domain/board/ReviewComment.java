package com.example.foominity.domain.board;

import com.example.foominity.domain.member.Member;
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

    @JoinColumn(name = "member_id")
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private Member member;
    // 게시판 아이디
    @JoinColumn(name = "review_id")
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private Review review;

    public ReviewComment(String content, Review review, Member member) {
        this.content = content;
        this.review = review;
        this.member = member;
    }

    public void changeComment(String content) {
        this.content = content;
    }
}