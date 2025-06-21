package com.example.foominity.domain.board;

import com.example.foominity.domain.BaseEntity;
import com.example.foominity.domain.member.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@NoArgsConstructor
@Getter
@Entity
public class BoardComment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 댓글 내용
    @Column(nullable = false)
    private String content;

    @JoinColumn(name = "member_id")
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private Member member;
    // 게시판 아이디
    @JoinColumn(name = "board_id")
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private Board board;

    public BoardComment(String content, Board board, Member member) {
        this.content = content;
        this.board = board;
        this.member = member;
    }

    public void changeComment(String content) {
        this.content = content;
    }

}
