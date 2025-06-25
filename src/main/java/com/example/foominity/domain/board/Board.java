package com.example.foominity.domain.board;

import com.example.foominity.domain.BaseEntity;
import com.example.foominity.domain.member.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private Member member;

    @Column(nullable = false, columnDefinition = "int default 0")
    private int views;

    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public Board(String title, String content, Member member) {
        this.title = title;
        this.content = content;
        this.member = member;
        this.views = 0;
    }

    public void addViews(int views) {
        this.views = views;
    }
}
