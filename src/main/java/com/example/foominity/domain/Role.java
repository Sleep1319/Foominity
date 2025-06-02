package com.example.foominity.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
<<<<<<<< HEAD:src/main/java/com/example/foominity/domain/Role.java
import lombok.AllArgsConstructor;
import lombok.Builder;
========
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
>>>>>>>> origin/feat/comment:src/main/java/com/example/foominity/domain/BoardComment.java
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@ToString
@Entity
<<<<<<<< HEAD:src/main/java/com/example/foominity/domain/Role.java
public class Role {
========
public class BoardComment {
>>>>>>>> origin/feat/comment:src/main/java/com/example/foominity/domain/BoardComment.java

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

<<<<<<<< HEAD:src/main/java/com/example/foominity/domain/Role.java
    @Column(nullable = false)
    private String name;

    @Column(nullable = false, name = "required_point")
    private int requiredPoint;
}
========
    // 유저 닉네임 (멤버)
    private Member member;

    // 댓글 내용
    private String content;

    // 게시판 아이디
    @JoinColumn(name = "board_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private String board;

}
>>>>>>>> origin/feat/comment:src/main/java/com/example/foominity/domain/BoardComment.java
