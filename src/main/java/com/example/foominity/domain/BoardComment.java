// package com.example.foominity.domain;

// import jakarta.persistence.Entity;
// import jakarta.persistence.FetchType;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import lombok.ToString;

// @ToString
// @NoArgsConstructor
// @Getter
// @Entity
// public class BoardComment {

// @Id
// @GeneratedValue(strategy = GenerationType.IDENTITY)
// private Long id;

// // 유저 닉네임 (멤버)
// private Member member;

// // 댓글 내용
// private String content;

// // 게시판 아이디
// @JoinColumn(name = "board_id")
// @ManyToOne(fetch = FetchType.LAZY)
// private String board;

// }