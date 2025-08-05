package com.example.foominity.domain.board;

import com.example.foominity.domain.BaseEntity;
import com.example.foominity.domain.member.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@Getter
@Entity
public class Board extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    private Long memberId; // 그냥 숫자

    private String nickname; // 글 쓸 때 닉네임 복사해서 저장

    @Column(nullable = false, columnDefinition = "int default 0")
    private int views;

    @Column(nullable = false, columnDefinition = "varchar(10) default '일반'")
    private String subject; // 종류: 일반, 음악, 후기, 정보, 질문

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE)
    private List<BoardComment> boardComments;

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE)
    private List<BoardLike> boardLikes;

    public int getLikeCount() {
        return boardLikes == null ? 0 : boardLikes.size();
    }

    public void update(String title, String content, String subject) {
        this.title = title;
        this.content = content;
        this.subject = subject;
    }

    public Board(String title, String content, String subject, Long memberId, String nickname) {
        this.title = title;
        this.content = content;
        this.subject = subject;
        this.memberId = memberId;
        this.nickname = nickname;
        this.views = 0;
    }

    public void increaseViews() {
        this.views++;
    }

}
