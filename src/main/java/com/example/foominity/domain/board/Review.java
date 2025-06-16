package com.example.foominity.domain.board;

import com.example.foominity.domain.BaseEntity;
import com.example.foominity.domain.category.ReviewCategory;
import com.example.foominity.domain.member.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
public class Review extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "member_id")
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private Member member;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column(name = "star_point")
    private float starPoint;

    public Review(String title, String content, Member member, float starPoint) {
        this.title = title;
        this.content = content;
        this.member = member;
        this.starPoint = starPoint;
    }

    public void update(String title, String content, Float starPoint) {
        this.title = title;
        this.content = content;
        this.starPoint = starPoint;
    }
}
