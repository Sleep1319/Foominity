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

    @JoinColumn(name = "member_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    @Column(nullable = false, columnDefinition = "int default 0")
    private int views;

    @Column(nullable = false, columnDefinition = "varchar(10) default '일반'")
    private String category; // 종류: 일반, 음악, 후기, 정보, 질문

    @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE)
    private List<BoardComment> boardComments;

    public void update(String title, String content, String category) {
        this.title = title;
        this.content = content;
        this.category = category;
    }

    public Board(String title, String content, String category, Member member) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.member = member;
        this.views = 0;
    }

    public void increaseViews() {
        this.views++;
    }
}
