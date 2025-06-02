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

    @Column(name = "content_count")
    private String contentCount;

    @Column(name = "like_count")
    private String likeCount;

    @OneToOne
    @JoinColumn(name = "member_id")
    private Member member;

}
